import { japaneseArticleComponentTranslations } from "@/data/translations/ja/article-components";
import { parseArticleInline, type ArticleInline } from "@/domain/article/article-inline";
import type { TranslationArtifact } from "@/domain/translation/translation";
import { translationSourceFields, type ArticleComponentSource } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision";

export type ArticleComponentTranslationFields = Readonly<Record<string, string>>;

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

function validFields(component: ArticleComponentSource, fields: Readonly<Record<string, string>>): boolean {
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

/**
 * Current Japanese fields for a shared article component, or undefined to render the whole component in English.
 * Applies only an active artifact whose revision matches the English and whose every field is present and valid.
 * Values are returned exactly as stored (no trimming), so suffix spacing and punctuation survive.
 */
export function selectArticleComponentTranslation(
  component: ArticleComponentSource,
  artifacts: readonly TranslationArtifact[] = japaneseArticleComponentTranslations,
): ArticleComponentTranslationFields | undefined {
  const revision = createTranslationSourceRevision(translationSourceFields["article-component"](component));
  const artifact = artifacts.find((candidate) => candidate.availability === "active" && candidate.contentKind === "article-component"
    && candidate.contentId === component.kind && candidate.targetLocale === "ja");
  if (!artifact || artifact.sourceRevision !== revision || !validFields(component, artifact.fields)) return undefined;
  return artifact.fields;
}
