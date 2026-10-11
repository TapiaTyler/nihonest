import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import { describe, expect, it } from "vitest";
import { articleOutline } from "@/domain/article/article-outline";
import { splitArticleSource, toPortableArticleMarkdown } from "@/domain/article/article-source";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { useMDXComponents } from "@/mdx-components";
import { getEnglishArticleOutline } from "./article-outline";

const articleDirectory = resolve("content/articles");

describe("English article outlines", () => {
  it("anchor to a heading in the article as it is actually rendered", async () => {
    const files = (await readdir(articleDirectory)).filter((name) => name.endsWith(".mdx")).sort();
    expect(files.length).toBeGreaterThan(0);
    const problems: string[] = [];
    let checkedEntries = 0;

    for (const file of files) {
      const { body } = splitArticleSource(await readFile(join(articleDirectory, file), "utf8"));
      const outline = articleOutline(toPortableArticleMarkdown(body));
      const { default: Content } = await evaluate(body, { ...runtime, useMDXComponents, baseUrl: import.meta.url } as never);
      const html = renderToStaticMarkup(<ContentLocaleProvider><Content /></ContentLocaleProvider>);
      const renderedIds = [...html.matchAll(/<h[23] id="([^"]*)"/g)].map(([, id]) => id);

      checkedEntries += outline.length;
      if (renderedIds.length < outline.length) problems.push(`${file}: ${outline.length} outline entries but ${renderedIds.length} rendered headings`);
      for (const { id } of outline) if (!renderedIds.includes(id)) problems.push(`${file}: no rendered heading with id "${id}"`);
      if (new Set(outline.map(({ id }) => id)).size !== outline.length) problems.push(`${file}: duplicate heading anchors`);
      expect(getEnglishArticleOutline(file.replace(/\.mdx$/, ""))).toEqual(outline);
    }

    expect(checkedEntries).toBeGreaterThan(500);
    expect(problems).toEqual([]);
  }, 120_000);
});
