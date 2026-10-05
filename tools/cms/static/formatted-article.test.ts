// @vitest-environment jsdom
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import { splitArticleSource } from "@/domain/article/article-source";
import { articleComponentBlocks } from "@/domain/article/article-blocks";

type Chunk = { raw: string; separator: string; kind: string; label: string };
type Formatter = {
  scan(body: string, components: Record<string, string>): Chunk[];
  render(body: string, components: Record<string, string>, document: Document): { surface: HTMLElement; chunks: Chunk[] };
  sourceFor(chunk: Chunk, element: Element): string;
};

async function formatter(): Promise<Formatter> {
  const script = await readFile(resolve(import.meta.dirname, "formatted-article.js"), "utf8");
  const browser = {} as { CmsFormattedArticle: Formatter };
  runInNewContext(script, { window: browser });
  return browser.CmsFormattedArticle;
}

function normalizedRaw(chunk: Chunk): string {
  const lines = chunk.raw.replace(/^\n+|\n+$/g, "").split("\n");
  if (chunk.kind === "unordered-list") return lines.map((line) => `- ${line.slice(2)}`).join("\n");
  if (chunk.kind === "ordered-list") return lines.map((line, index) => `${index + 1}. ${line.replace(/^\d+[.)] /, "")}`).join("\n");
  if (chunk.kind === "blockquote") return `> ${lines.map((line) => line.slice(2)).join(" ")}`;
  if (chunk.kind === "heading-2" || chunk.kind === "heading-3") return lines[0]!.replace(/^(#{2,3})[ \t]+/, "$1 ");
  return lines.join(" ");
}

// Fixture I/O (Git repositories, local servers, catalog scans) exceeded the 5 s default under full-suite parallel load; see the other CMS suites.
describe("formatted article source preservation", { timeout: 30_000 }, () => {
  it("reproduces every editable block in every real article without an edit", async () => {
    const directory = resolve(import.meta.dirname, "../../../content/articles");
    const names = (await readdir(directory)).filter((name) => name.endsWith(".mdx"));
    const editor = await formatter();
    let editableCount = 0;
    for (const name of names) {
      const body = splitArticleSource(await readFile(resolve(directory, name), "utf8")).body;
      const { surface, chunks } = editor.render(body, articleComponentBlocks, document);
      for (const [index, chunk] of chunks.entries()) {
        if (chunk.kind === "locked") continue;
        const element = surface.querySelector(`.formatted-block[data-block-index="${index}"] > :first-child`)!;
        expect(editor.sourceFor(chunk, element), `${name}, block ${index + 1}`).toBe(normalizedRaw(chunk));
        editableCount += 1;
      }
    }
    expect(names.length).toBeGreaterThan(50);
    expect(editableCount).toBeGreaterThan(100);
  }, 20_000);

  it("locks nested emphasis that the inline renderer cannot preserve", async () => {
    const source = await readFile(resolve(import.meta.dirname, "../../../content/articles/visa-and-status-of-residence-explained.mdx"), "utf8");
    const editor = await formatter();
    const { surface, chunks } = editor.render(splitArticleSource(source).body, articleComponentBlocks, document);
    const index = chunks.findIndex((chunk) => chunk.raw.includes("**Certificate of Eligibility (") && chunk.raw.includes("*zairyū shikaku nintei shōmeisho*"));
    expect(index).toBeGreaterThanOrEqual(0);
    expect(chunks[index]!.kind).toBe("locked");
    const block = surface.querySelector(`.formatted-block[data-block-index="${index}"]`)!;
    expect(block.textContent).toContain("Formatting the editor cannot preserve; use MDX source");
    expect(block.querySelector("[contenteditable]")).toBeNull();
  });

  it.each([
    ["understanding-japan-geography-government-and-language", "locked"],
    ["artist-status", "ordered-list"],
    ["choosing-a-family-or-personal-status-in-japan", "ordered-list"],
    ["calling-police-fire-and-ambulance-services-in-japan", "unordered-list"],
    ["consumption-tax-and-the-invoice-system", "blockquote"],
  ])("round trips the real %s article through formatted and source views without touching its MDX", async (name, expectedKind) => {
    const source = await readFile(resolve(import.meta.dirname, `../../../content/articles/${name}.mdx`), "utf8");
    const body = splitArticleSource(source).body;
    const editor = await formatter();
    const first = editor.render(body, articleComponentBlocks, document);
    const sourceAfterModeSwitch = first.chunks.map((chunk) => chunk.raw + chunk.separator).join("");
    expect(sourceAfterModeSwitch).toBe(body);
    const second = editor.render(sourceAfterModeSwitch, articleComponentBlocks, document);
    expect(second.chunks.map((chunk) => chunk.raw + chunk.separator).join("")).toBe(body);
    expect(second.surface.textContent).toBe(first.surface.textContent);
    expect(second.chunks.length).toBeGreaterThan(4);
    expect(second.chunks.some((chunk) => chunk.kind === expectedKind)).toBe(true);
    expect(body).toContain("](");
  });

  it("preserves components and unsupported constructs as named, locked source blocks", async () => {
    const editor = await formatter();
    const body = "## Heading\n\n<JapanRegionMap />\n\n<UnknownWidget />\n\n:::custom-directive\n";
    const { chunks, surface } = editor.render(body, articleComponentBlocks, document);
    expect(chunks.map((chunk) => chunk.raw + chunk.separator).join("")).toBe(body);
    expect(chunks.slice(1).map((chunk) => chunk.kind)).toEqual(["locked", "locked", "locked"]);
    expect(surface.querySelectorAll(".formatted-locked")).toHaveLength(3);
    expect(surface.textContent).toContain("japan region map");
    expect(surface.textContent).toContain("Unknown component: UnknownWidget");
    expect(surface.querySelector(".formatted-locked [contenteditable]")).toBeNull();
  });

  it("serializes changes to editable headings, lists, emphasis, and links", async () => {
    const editor = await formatter();
    const body = "## Heading\n\nParagraph **bold** [link](/faq)\n\n- One\n- Two\n";
    const { chunks, surface } = editor.render(body, articleComponentBlocks, document);
    const heading = surface.querySelector("h2")!;
    heading.textContent = "New heading";
    expect(editor.sourceFor(chunks[0]!, heading)).toBe("## New heading");
    const paragraph = surface.querySelector("p")!;
    expect(editor.sourceFor(chunks[1]!, paragraph)).toBe("Paragraph **bold** [link](/faq)");
    surface.querySelector("li")!.textContent = "Changed";
    expect(editor.sourceFor(chunks[2]!, surface.querySelector("ul")!)).toBe("- Changed\n- Two");
  });
});
