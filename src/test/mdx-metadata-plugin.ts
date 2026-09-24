import type { Plugin } from "vite";
import { splitArticleSource } from "../domain/article/article-source";

/**
 * Test-only stand-in for Next's MDX compilation. Article modules are imported for their `metadata` export
 * (e.g. by the article registry behind FAQ and search helpers), but Vitest has no MDX compiler, so it would
 * parse the Markdown body as JavaScript and fail. This keeps the real metadata object literal and replaces the
 * body with an empty component; tests that need rendered article prose must not rely on it.
 */
export function mdxMetadataPlugin(): Plugin {
  return {
    name: "nihonest-mdx-metadata",
    enforce: "pre",
    transform(source, id) {
      if (!id.endsWith(".mdx")) return null;
      try {
        const { metadataLiteral } = splitArticleSource(source);
        return { code: `export const metadata = ${metadataLiteral};\nexport default function MDXContent() { return null; }\n`, map: null };
      } catch (error) {
        throw new Error(`${id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  };
}
