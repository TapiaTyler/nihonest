import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { importanceSchema, topicIdSchema } from "@/domain/taxonomy/taxonomy";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const articleSourceMetadataSchema = z.object({
  id: stableIdSchema,
  title: z.string().min(1),
  sourceIds: z.array(stableIdSchema).min(1),
  importance: importanceSchema,
  topicIds: z.array(topicIdSchema).min(1),
});

export type ArticleSourceMetadata = z.infer<typeof articleSourceMetadataSchema>;

function quotedValue(source: string, field: string): string | undefined {
  return source.match(new RegExp(`\\b${field}\\s*:\\s*"([^"]+)"`))?.[1];
}

function quotedArray(source: string, field: string): string[] | undefined {
  const contents = source.match(new RegExp(`\\b${field}\\s*:\\s*\\[([^\\]]*)\\]`))?.[1];
  return contents ? [...contents.matchAll(/"([^"]+)"/g)].map((match) => match[1]!) : undefined;
}

/** Extracts the controlled metadata object without evaluating executable MDX. */
export function extractArticleMetadataObject(mdx: string): string {
  const metadataStart = mdx.indexOf("export const metadata");
  const bodyStart = mdx.indexOf("{", metadataStart);
  if (metadataStart < 0 || bodyStart < 0) throw new Error("Article is missing its metadata export.");

  let depth = 0;
  let inString = false;
  let escaped = false;
  let bodyEnd = -1;
  for (let index = bodyStart; index < mdx.length; index += 1) {
    const character = mdx[index]!;
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}" && --depth === 0) {
      bodyEnd = index + 1;
      break;
    }
  }
  if (bodyEnd < 0) throw new Error("Article metadata export is not a complete object.");

  return mdx.slice(bodyStart, bodyEnd);
}

/** Reads only the controlled metadata export and fails closed when required fields cannot be found. */
export function parseArticleSourceMetadata(mdx: string): ArticleSourceMetadata {
  const metadata = extractArticleMetadataObject(mdx);
  return articleSourceMetadataSchema.parse({
    id: quotedValue(metadata, "id"),
    title: quotedValue(metadata, "title"),
    sourceIds: quotedArray(metadata, "sourceIds"),
    importance: quotedValue(metadata, "importance"),
    topicIds: quotedArray(metadata, "topicIds"),
  });
}

export async function loadArticleSourceMetadata(directory: string): Promise<readonly ArticleSourceMetadata[]> {
  const filenames = (await readdir(directory)).filter((filename) => filename.endsWith(".mdx")).sort();
  return Promise.all(filenames.map(async (filename) => {
    try {
      return parseArticleSourceMetadata(await readFile(join(directory, filename), "utf8"));
    }
    catch (error) {
      throw new Error(`Cannot read source metadata from ${filename}.`, { cause: error });
    }
  }));
}
