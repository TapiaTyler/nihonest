import { withCmsFileLock } from "./write-locks";
/** Guarded body-only article writes. Metadata identity and relationships remain untouched. */
import { randomUUID } from "node:crypto";
import { mkdir, open, readFile, realpath, rename, rm, stat } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { runInNewContext } from "node:vm";
import { bundledArticleSchema } from "@/domain/content-bundle/content-bundle";
import { articleMetadataSchema } from "@/domain/article/article";
import { parseArticleMarkdown } from "@/domain/article/article-blocks";
import { splitArticleSource, toPortableArticleMarkdown } from "@/domain/article/article-source";
import { articleSourceRevision } from "@/lib/content/content-bundle";
import { readArticleCatalog } from "./catalog";
import { guardCmsWrite, noteCmsWrite } from "./git-session";

export class CmsEditError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

export type BodyEdit = Readonly<{ expectedRevision: string; body: string; updatedAt: string }>;
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const revisionPattern = /^[a-f0-9]{64}$/;

type MdxNode = { type?: string; children?: MdxNode[]; position?: { start?: { line?: number; column?: number } } };

function rejectInlineMdx() {
  return (tree: MdxNode) => {
    const visit = (node: MdxNode): void => {
      if (node.type === "mdxTextExpression" || node.type === "mdxJsxTextElement") {
        const position = node.position?.start;
        throw new CmsEditError(`Inline MDX expressions and JSX are not supported (line ${position?.line ?? 1}, column ${position?.column ?? 1}).`, 422);
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

function compilerErrorMessage(error: unknown): string {
  const detail = error as { message?: string; line?: number; column?: number; place?: { start?: { line?: number; column?: number } } };
  const line = detail.place?.start?.line ?? detail.line;
  const column = detail.place?.start?.column ?? detail.column;
  const message = detail.message?.split("\n")[0] ?? "Invalid MDX syntax.";
  return `${message} (line ${line ?? 1}, column ${column ?? 1}).`;
}

async function validateBody(body: unknown) {
  if (typeof body !== "string" || !body.trim() || Buffer.byteLength(body, "utf8") > 1_000_000) {
    throw new CmsEditError("Article body must contain text and be at most 1 MB.", 422);
  }
  const normalized = body.replace(/\r\n?/g, "\n");
  try {
    // Match createMDX() in next.config.ts: default MDX compilation with no extra plugins or options.
    // The tsx entry point is CommonJS; MDX and its dependencies require their ESM exports.
    const { compile } = await import("@mdx-js/mdx");
    await compile(normalized, { remarkPlugins: [rejectInlineMdx] });
    const blocks = parseArticleMarkdown(toPortableArticleMarkdown(normalized));
    if (blocks.length === 0) throw new Error("Article body has no blocks.");
    return { body: normalized.endsWith("\n") ? normalized : `${normalized}\n`, blocks };
  } catch (error) {
    throw new CmsEditError(error instanceof CmsEditError ? error.message : compilerErrorMessage(error), 422);
  }
}

export async function previewArticleBody(body: unknown) {
  return (await validateBody(body)).blocks;
}

function detectNewlines(source: string): "\n" | "\r\n" {
  const hasCrLf = source.includes("\r\n");
  if (/\r(?!\n)/.test(source) || hasCrLf && /(?<!\r)\n/.test(source)) {
    throw new CmsEditError("Mixed line endings need manual source editing.", 422);
  }
  return hasCrLf ? "\r\n" : "\n";
}

export async function saveArticleBody(projectRoot: string, id: string, edit: BodyEdit) {
  if (!idPattern.test(id)) throw new CmsEditError("Invalid article ID.", 400);
  if (!revisionPattern.test(edit.expectedRevision)) throw new CmsEditError("Invalid expected revision.", 400);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(edit.updatedAt)) throw new CmsEditError("Choose an ISO update date.", 422);
  const { body, blocks } = await validateBody(edit.body);
  const catalog = await readArticleCatalog(projectRoot);
  const detail = catalog.details.get(id);
  if (!detail) throw new CmsEditError("Article not found or cannot be parsed.", 404);
  if (detail.metadata.status !== "draft" && detail.metadata.status !== "needs-review") {
    throw new CmsEditError("This editor currently supports draft and needs-review articles only.", 422);
  }
  if (detail.metadata.lastReviewedAt) throw new CmsEditError("Reviewed metadata needs a separate editorial transition.", 422);
  const articleDirectory = await realpath(resolve(projectRoot, "content/articles"));
  const target = await realpath(resolve(projectRoot, detail.summary.path));
  if (!target.startsWith(`${articleDirectory}${sep}`)) throw new CmsEditError("Article path escapes the canonical directory.", 403);
  return withCmsFileLock(target, async () => {
    const original = await readFile(target, "utf8");
    if (articleSourceRevision(original) !== edit.expectedRevision) {
      throw new CmsEditError("The article changed since it was loaded. Refresh before editing again.", 409);
    }
    const newline = detectNewlines(original);
    const normalizedOriginal = original.replace(/\r\n/g, "\n");
    const { metadataLiteral, body: oldBody } = splitArticleSource(original);
    const metadata = articleMetadataSchema.parse(runInNewContext(`(${metadataLiteral})`, {}, { timeout: 1000 }));
    if (metadata.id !== id || edit.updatedAt < metadata.createdAt || edit.updatedAt < metadata.updatedAt) {
      throw new CmsEditError("The update date cannot precede the article's existing dates.", 422);
    }
    const nextArticle = bundledArticleSchema.safeParse({ metadata: { ...metadata, updatedAt: edit.updatedAt }, blocks });
    if (!nextArticle.success) throw new CmsEditError("The proposed article does not pass content validation.", 422);
    if (oldBody === body && metadata.updatedAt === edit.updatedAt) {
      return { changed: false, revision: edit.expectedRevision };
    }
    const prefix = normalizedOriginal.slice(0, normalizedOriginal.length - oldBody.length);
    const matches = [...prefix.matchAll(/^([ \t]*updatedAt:[ \t]*["'])(\d{4}-\d{2}-\d{2})(["'][ \t]*,?)/gm)];
    if (matches.length !== 1) throw new CmsEditError("Cannot safely update the article date in its metadata.", 422);
    const updatedPrefix = prefix.replace(/^([ \t]*updatedAt:[ \t]*["'])(\d{4}-\d{2}-\d{2})(["'][ \t]*,?)/m,
      (_match, start: string, _oldDate: string, end: string) => `${start}${edit.updatedAt}${end}`);
    const next = `${updatedPrefix}${body}`.replace(/\n/g, newline);
    await guardCmsWrite(projectRoot, target);
    const temporaryDirectory = resolve(projectRoot, ".cms");
    await mkdir(temporaryDirectory, { recursive: true });
    const temporaryPath = join(temporaryDirectory, `${id}-${randomUUID()}.tmp`);
    try {
      const handle = await open(temporaryPath, "wx", (await stat(target)).mode);
      try {
        await handle.writeFile(next, "utf8");
        await handle.sync();
      } finally {
        await handle.close();
      }
      // Optimistic second check narrows the window before the atomic replacement.
      if (articleSourceRevision(await readFile(target, "utf8")) !== edit.expectedRevision) {
        throw new CmsEditError("The article changed during saving. Refresh before editing again.", 409);
      }
      await rename(temporaryPath, target);
    } finally {
      await rm(temporaryPath, { force: true });
    }
    await noteCmsWrite(projectRoot, target);
    return { changed: true, revision: articleSourceRevision(next) };
  });
}
