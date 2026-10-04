import { parseArticleInline, type ArticleInline } from "@/domain/article/article-inline";
import { translationSourceFields, type ArticleComponentSource } from "@/domain/translation/translation-source-fields";

/**
 * Field-validity rules for a Japanese article-component artifact, shared by the web selector and portable
 * consumers. Pure: no catalogs, hashing, React, or server-only code. Revision and artifact selection stay with
 * the caller; this only answers whether a complete set of fields may replace the English component.
 */

function walk(nodes: readonly ArticleInline[], visit: (node: ArticleInline) => void) {
  for (const node of nodes) {
    visit(node);
    if (node.kind === "strong" || node.kind === "emphasis" || node.kind === "link") walk(node.children, visit);
  }
}

function plainText(nodes: readonly ArticleInline[]): string {
  return nodes.map((node) => {
    if ("children" in node) return plainText(node.children);
    if ("text" in node) return node.text;
    return node.raw;
  }).join("");
}

/** A practical paragraph: parses without protected spans, starts with a non-empty **label**, and has body text. */
function practicalParagraph(source: string): Readonly<{ targets: readonly string[] }> | undefined {
  let nodes: readonly ArticleInline[];
  try {
    nodes = parseArticleInline(source);
  }
  catch {
    return undefined;
  }
  let protectedSpan = false;
  const targets: string[] = [];
  walk(nodes, (node) => {
    if (node.kind === "protected") protectedSpan = true;
    if (node.kind === "link") targets.push(node.href);
  });
  const [label, ...body] = nodes;
  if (protectedSpan || label?.kind !== "strong" || !plainText(label.children).trim() || !plainText(body).trim()) return undefined;
  return { targets };
}

/**
 * True when `fields` has exactly the component's English field keys and every value is usable as stored
 * (values are never trimmed). Empty English route suffixes must stay exactly ""; practical paragraphs must keep
 * the inline grammar, a leading label, body text, and the same link targets in the same order.
 */
export function areArticleComponentTranslationFieldsValid(
  component: ArticleComponentSource,
  fields: Readonly<Record<string, string>>,
): boolean {
  const english = translationSourceFields["article-component"](component);
  const expected = Object.keys(english);
  if (Object.keys(fields).length !== expected.length) return false;
  for (const key of expected) {
    const value = fields[key];
    if (typeof value !== "string") return false;
    if (component.kind === "japan-practical-basics") {
      const translated = practicalParagraph(value);
      const source = practicalParagraph(english[key]!);
      if (!translated || !source || JSON.stringify(translated.targets) !== JSON.stringify(source.targets)) return false;
      continue;
    }
    // An empty English route suffix must stay exactly empty; every other value must have visible text.
    const emptySuffix = /^rows\.[^.]+\.2$/.test(key) && english[key] === "";
    if (emptySuffix ? value !== "" : !value.trim()) return false;
  }
  return true;
}
