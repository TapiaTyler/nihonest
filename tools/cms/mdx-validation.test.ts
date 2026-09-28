// @vitest-environment node
import { describe, expect, it } from "vitest";
import { CmsEditError, previewArticleBody } from "./article-writer";

describe("article body MDX validation", () => {
  it.each(["Text with inline{value} expression.", "Text with inline<tag>content</tag> JSX."])(
    "rejects inline MDX: %s",
    async (body) => {
      await expect(previewArticleBody(body)).rejects.toMatchObject({
        status: 422,
        message: expect.stringMatching(/line 1, column \d+/),
      });
    },
  );

  it("allows escaped braces and braces inside inline code", async () => {
    const body = "Escaped \\{value\\} and code `{value}`.";
    const blocks = await previewArticleBody(body);
    expect(blocks).toEqual([{ kind: "paragraph", text: body }]);
  });

  it("turns MDX compiler diagnostics into a positioned validation error", async () => {
    const error = await previewArticleBody("A valid paragraph.\n\n{unterminated").catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(CmsEditError);
    expect(error).toMatchObject({ status: 422, message: expect.stringMatching(/line 3, column \d+/) });
  });
});
