import { articleComponentBlocks } from "./article-blocks";

/**
 * Reads canonical article MDX as text, without compiling it. An article file is an `export const metadata = {...}`
 * object literal followed by a Markdown body that may use the shared components as self-closing JSX tags.
 */

export type ArticleSourceParts = Readonly<{ metadataLiteral: string; body: string }>;

/** Splits the metadata object literal from the body. Braces are balanced outside string literals. */
export function splitArticleSource(source: string): ArticleSourceParts {
  const normalized = source.replace(/\r\n?/g, "\n");
  const start = normalized.indexOf("export const metadata");
  const open = normalized.indexOf("{", start);
  if (start < 0 || open < 0) throw new Error("Article source has no metadata export.");
  let depth = 0;
  let quote: string | undefined;
  for (let index = open; index < normalized.length; index += 1) {
    const character = normalized[index]!;
    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = undefined;
    } else if (character === "\"" || character === "'" || character === "`") quote = character;
    else if (character === "{") depth += 1;
    else if (character === "}" && --depth === 0) {
      return {
        metadataLiteral: normalized.slice(open, index + 1),
        body: normalized.slice(index + 1).replace(/^;?[ \t]*\n/, ""),
      };
    }
  }
  throw new Error("Article source has an unbalanced metadata export.");
}

const directiveByComponent = new Map<string, string>(Object.entries(articleComponentBlocks).map(([kind, component]) => [component, kind]));

/**
 * Converts an MDX body to the portable Markdown form (see `article-blocks.ts`): shared-component tags become
 * `:::directive` lines. Any other JSX, import, export, or expression line is rejected so that nothing a native
 * client cannot render passes silently.
 */
export function toPortableArticleMarkdown(body: string): string {
  return body.split("\n").map((line, index) => {
    const trimmed = line.trim();
    const component = trimmed.match(/^<([A-Z][A-Za-z0-9]*)\s*\/>$/)?.[1];
    if (component) {
      const directive = directiveByComponent.get(component);
      if (!directive) throw new Error(`Line ${index + 1}: unknown article component <${component} />.`);
      return `:::${directive}`;
    }
    if (/^(?:<[A-Za-z/!]|import\s|export\s|\{)/.test(trimmed)) {
      throw new Error(`Line ${index + 1}: unsupported MDX syntax "${trimmed.slice(0, 60)}".`);
    }
    return line;
  }).join("\n").trim();
}
