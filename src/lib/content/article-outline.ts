import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { articleOutline, type ArticleOutlineEntry } from "@/domain/article/article-outline";
import { splitArticleSource, toPortableArticleMarkdown } from "@/domain/article/article-source";

const outlines = new Map<string, readonly ArticleOutlineEntry[]>();

/**
 * The English outline of an article, read from its canonical MDX source at build time. Article files are named
 * by slug. A file that cannot be read or parsed yields no outline rather than breaking the page.
 */
export function getEnglishArticleOutline(slug: string): readonly ArticleOutlineEntry[] {
  const cached = outlines.get(slug);
  if (cached) return cached;
  let outline: readonly ArticleOutlineEntry[] = [];
  try {
    const source = readFileSync(join(process.cwd(), "content", "articles", `${slug}.mdx`), "utf8");
    outline = articleOutline(toPortableArticleMarkdown(splitArticleSource(source).body));
  } catch {
    outline = [];
  }
  outlines.set(slug, outline);
  return outline;
}
