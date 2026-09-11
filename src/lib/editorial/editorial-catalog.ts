import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { faqs } from "@/data/faqs";
import { glossaryTerms } from "@/data/glossary";
import { residenceStatuses } from "@/data/residence-statuses";
import {
  editorialReviewRecordSchema,
  editorialTargetSchema,
  type EditorialReviewRecord,
  type EditorialTarget,
} from "@/domain/editorial/editorial-review";
import { extractArticleMetadataObject } from "@/lib/source-monitoring/article-source-metadata";

function revision(value: string): string {
  return createHash("sha256").update(value.replaceAll("\r\n", "\n")).digest("hex");
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

function quotedValue(source: string, field: string): string | undefined {
  return source.match(new RegExp(`\\b${field}\\s*:\\s*"([^"]+)"`))?.[1];
}

function articleTarget(rawMdx: string, filename: string): EditorialTarget {
  try {
    const metadata = extractArticleMetadataObject(rawMdx);
    return editorialTargetSchema.parse({
      kind: "article",
      id: quotedValue(metadata, "id"),
      status: quotedValue(metadata, "status"),
      revision: revision(rawMdx),
      updatedAt: quotedValue(metadata, "updatedAt"),
      lastReviewedAt: quotedValue(metadata, "lastReviewedAt"),
    });
  }
  catch (error) {
    throw new Error(`Cannot read editorial metadata from ${filename}.`, { cause: error });
  }
}

function structuredTarget(
  kind: "glossary-term" | "residence-status" | "faq",
  value: Readonly<{ id: string; status: string; lastReviewedAt?: string; updatedAt?: string }>,
): EditorialTarget {
  return editorialTargetSchema.parse({
    kind,
    id: value.id,
    status: value.status,
    revision: revision(canonicalJson(value)),
    updatedAt: value.updatedAt,
    lastReviewedAt: value.lastReviewedAt,
  });
}

/** Loads editorial identities without importing MDX components into local review commands. */
export async function loadEditorialTargets(projectRoot = process.cwd()): Promise<readonly EditorialTarget[]> {
  const articleDirectory = resolve(projectRoot, "content/articles");
  const filenames = (await readdir(articleDirectory)).filter((filename) => filename.endsWith(".mdx")).sort();
  const articleTargets = await Promise.all(filenames.map(async (filename) => (
    articleTarget(await readFile(join(articleDirectory, filename), "utf8"), filename)
  )));
  return [
    ...articleTargets,
    ...glossaryTerms.map((term) => structuredTarget("glossary-term", term)),
    ...residenceStatuses.map((status) => structuredTarget("residence-status", status)),
    ...faqs.map((faq) => structuredTarget("faq", faq)),
  ];
}

export async function loadEditorialReviewRecords(directory: string): Promise<readonly EditorialReviewRecord[]> {
  let filenames: readonly string[] = [];
  try {
    filenames = (await readdir(directory)).filter((filename) => filename.endsWith(".json")).sort();
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  return Promise.all(filenames.map(async (filename) => {
    try {
      return editorialReviewRecordSchema.parse(JSON.parse(await readFile(join(directory, filename), "utf8")));
    }
    catch (error) {
      throw new Error(`Cannot read editorial approval ${filename}.`, { cause: error });
    }
  }));
}
