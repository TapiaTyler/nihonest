import type { OfficialSource } from "@/domain/source/source";
import {
  classifySourceSnapshot,
  sourceCheckResultSchema,
  sourceSnapshotSchema,
  type SourceCheckResult,
  type SourceContentKind,
  type SourceSnapshot,
} from "@/domain/source/source-monitoring";

const removableHtml = /<(script|style|noscript|svg|nav|footer)\b[^>]*>[\s\S]*?<\/\1>/gi;
const htmlComments = /<!--[\s\S]*?-->/g;
const htmlTags = /<[^>]+>/g;
const zeroWidthCharacters = /[\u200B-\u200D\uFEFF]/g;

function decodeHtmlEntities(value: string): string {
  const namedEntities: Readonly<Record<string, string>> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code.startsWith("#x")) return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
    if (code.startsWith("#")) return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
    return namedEntities[code.toLowerCase()] ?? entity;
  });
}

/** Removes predictable page chrome while preserving the source's meaningful visible wording. */
export function normalizeSourceText(content: string, contentKind: "html" | "text"): string {
  const visibleText = contentKind === "html"
    ? decodeHtmlEntities(content.replace(htmlComments, " ").replace(removableHtml, " ").replace(htmlTags, " "))
    : content;
  return visibleText.normalize("NFKC").replace(zeroWidthCharacters, "").replace(/\s+/g, " ").trim();
}

export function normalizeSourceBytes(body: Uint8Array, contentKind: SourceContentKind): Uint8Array {
  return contentKind === "html" || contentKind === "text"
    ? new TextEncoder().encode(normalizeSourceText(new TextDecoder().decode(body), contentKind))
    : body;
}

function bytesToHex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

async function fingerprint(content: Uint8Array): Promise<string> {
  const digestInput = new Uint8Array(content.byteLength);
  digestInput.set(content);
  return bytesToHex(await crypto.subtle.digest("SHA-256", digestInput.buffer));
}

function getContentKind(contentType: string | null, url: string): SourceContentKind {
  if (contentType?.includes("text/html")) return "html";
  if (contentType?.startsWith("text/")) return "text";
  if (contentType?.includes("application/pdf") || new URL(url).pathname.toLowerCase().endsWith(".pdf")) return "pdf";
  return "binary";
}

export async function createSourceSnapshot(
  body: Uint8Array,
  contentKind: SourceContentKind,
  resolvedUrl: string,
  capturedAt: string,
): Promise<SourceSnapshot> {
  const normalized = normalizeSourceBytes(body, contentKind);
  return sourceSnapshotSchema.parse({
    fingerprint: await fingerprint(normalized),
    capturedAt,
    resolvedUrl,
    contentKind,
    normalizedLength: normalized.byteLength,
  });
}

type SourceFetcher = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

type CheckSourceOptions = Readonly<{
  accepted?: SourceSnapshot;
  checkedAt?: string;
  fetcher?: SourceFetcher;
  onSnapshot?: (snapshot: SourceSnapshot, normalizedContent: Uint8Array) => void | Promise<void>;
}>;

/** Performs one deliberate GET; network failures remain observations and never become source revisions. */
export async function checkSource(
  source: OfficialSource,
  { accepted, checkedAt = new Date().toISOString(), fetcher = fetch, onSnapshot }: CheckSourceOptions = {},
): Promise<SourceCheckResult> {
  if (source.checkMethod === "manual") {
    return sourceCheckResultSchema.parse({
      sourceId: source.id,
      requestedUrl: source.url,
      checkedAt,
      status: "manual",
      detail: "This source is configured for manual review and was not fetched.",
    });
  }

  try {
    const response = await fetcher(source.url, {
      headers: { "User-Agent": "Nihonest source review checker" },
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      return sourceCheckResultSchema.parse({
        sourceId: source.id,
        requestedUrl: source.url,
        checkedAt,
        status: "unavailable",
        httpStatus: response.status,
        detail: `The source returned HTTP ${response.status}; its accepted revision was not changed.`,
      });
    }

    const resolvedUrl = response.url || source.url;
    const contentKind = getContentKind(response.headers.get("content-type"), resolvedUrl);
    const body = new Uint8Array(await response.arrayBuffer());
    const snapshot = await createSourceSnapshot(
      body,
      contentKind,
      resolvedUrl,
      checkedAt,
    );
    if (onSnapshot) await onSnapshot(snapshot, normalizeSourceBytes(body, contentKind));
    return classifySourceSnapshot(source, snapshot, checkedAt, response.status, accepted, response.redirected);
  }
  catch (error) {
    return sourceCheckResultSchema.parse({
      sourceId: source.id,
      requestedUrl: source.url,
      checkedAt,
      status: "unavailable",
      detail: error instanceof Error
        ? `The source could not be checked (${error.name}); its accepted revision was not changed.`
        : "The source could not be checked; its accepted revision was not changed.",
    });
  }
}
