import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getDeclaredArticleTermIds,
  getInlineArticleTermIds,
} from "@/lib/editorial/article-terminology-order";

describe("article terminology order", () => {
  it("matches Key Japanese terminology to first appearance in every article", () => {
    const articleDirectory = resolve(process.cwd(), "content/articles");
    const issues = readdirSync(articleDirectory)
      .filter((file) => file.endsWith(".mdx"))
      .sort()
      .flatMap((file) => {
        const source = readFileSync(resolve(articleDirectory, file), "utf8");
        const declared = getDeclaredArticleTermIds(source);
        const inline = getInlineArticleTermIds(source);
        return declared.join("|") === inline.join("|")
          ? []
          : [{ file, declared, expectedFromFirstAppearance: inline }];
      });

    expect(issues).toEqual([]);
  });
});
