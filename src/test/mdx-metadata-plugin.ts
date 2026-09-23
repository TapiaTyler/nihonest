import type { Plugin } from "vite";

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
      const start = source.indexOf("export const metadata");
      const open = source.indexOf("{", start);
      if (start < 0 || open < 0) throw new Error(`${id} has no metadata export.`);
      let depth = 0;
      let quote: string | undefined;
      for (let index = open; index < source.length; index += 1) {
        const character = source[index]!;
        if (quote) {
          if (character === "\\") index += 1;
          else if (character === quote) quote = undefined;
        } else if (character === "\"" || character === "'" || character === "`") quote = character;
        else if (character === "{") depth += 1;
        else if (character === "}" && --depth === 0) {
          const metadata = source.slice(open, index + 1);
          return { code: `export const metadata = ${metadata};\nexport default function MDXContent() { return null; }\n`, map: null };
        }
      }
      throw new Error(`${id} has an unbalanced metadata export.`);
    },
  };
}
