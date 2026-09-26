// @vitest-environment jsdom
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { waitFor } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

const directory = resolve(import.meta.dirname);

describe("CMS article detail", () => {
  it("renders formatted article blocks and keyboard-operable detail tabs", async () => {
    const html = await readFile(resolve(directory, "index.html"), "utf8");
    const script = await readFile(resolve(directory, "app.js"), "utf8");
    document.body.innerHTML = html.match(/<body>([\s\S]*?)<\/body>/)?.[1] ?? "";
    const summary = { id: "sample-article", title: "Sample article", status: "needs-review", translation: "stale", path: "content/articles/sample-article.mdx", revision: "revision", groups: ["daily-life"] };
    const article = {
      summary,
      metadata: {
        id: "sample-article", slug: "sample-article", title: "Sample article", description: "Sample description.",
        status: "needs-review", createdAt: "2026-09-01", updatedAt: "2026-09-02", topicIds: ["daily-life"],
        journeyStageIds: ["planning"], audienceIds: [], geographicScopes: ["national"],
        importance: "informational", contentType: "guide", termIds: [], residenceStatusIds: [],
      },
      body: "## Heading\n\n**Important** [term](/glossary/term)",
      blocks: [
        { kind: "heading", level: 2, text: "Heading" },
        { kind: "paragraph", text: "**Important** [term](/glossary/term)" },
        { kind: "component", component: "japan-region-map" },
      ],
      componentTags: { "japan-region-map": "JapanRegionMap" },
      sources: [],
      outboundRelationships: [{ id: "another-article", title: "Another article", type: "related" }],
      inboundRelationships: [],
    };
    const faqSummary = { kind: "faq", id: "sample-faq", title: "Can I try this?", status: "needs-review", path: "src/data/faqs/study.ts", revision: "a".repeat(64), groups: ["study"] };
    const faq = { ...faqSummary, value: { id: "sample-faq", question: "Can I try this?", summary: "Check the actual conditions.", relatedArticleIds: ["sample-article"] },
      source: { path: faqSummary.path, sourceRevision: "b".repeat(64) }, sources: [], updatedAt: "2026-09-02", editableFields: ["question", "summary"] };
    const mutations: { path: string; method: string; body: string }[] = [];
    const fetch = async (path: string, options?: { method?: string; body?: string }) => ({
      ok: true,
       json: async () => path === "/api/articles" ? { articles: [summary], failures: [] }
        : path === "/api/records" ? { records: [faqSummary], failures: [] }
        : path === "/api/records/faq/sample-faq" ? faq
        : path === "/api/git" ? { status: "## main" }
          : path === "/api/session" ? { token: "test-token" }
            : path.endsWith("/preview") ? { blocks: [{ kind: "heading", level: 2, text: "Changed heading" }] }
              : ["/body", "/status", "/review", "/content"].some((suffix) => path.endsWith(suffix))
                ? (mutations.push({ path, method: options?.method ?? "", body: options?.body ?? "" }), { changed: true, revision: "new-revision", approvalRecord: "content/editorial-reviews/test.json" })
                : article,
    });
    runInNewContext(script, { document, window, Event, fetch, setTimeout, clearTimeout });
    await waitFor(() => expect(document.querySelector("#article-list button")).not.toBeNull());
    (document.querySelector("#article-list button") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector("#article-body-editor")).not.toBeNull());
    const previewPanel = document.querySelector("#cms-article-preview") as HTMLElement;
    const previewButton = document.querySelector(".edit-actions button:first-child") as HTMLButtonElement;
    expect(previewPanel.hidden).toBe(true);
    expect(previewButton.getAttribute("aria-expanded")).toBe("false");
    previewButton.click();
    expect(previewPanel.hidden).toBe(false);
    expect(previewButton.getAttribute("aria-expanded")).toBe("true");
    expect(document.querySelector(".article-preview h2")?.textContent).toBe("Heading");
    expect(document.querySelector(".article-preview strong")?.textContent).toBe("Important");
    expect((document.querySelector(".article-preview a[href$='/glossary/term']") as HTMLAnchorElement).href).toContain("127.0.0.1:3000");
    expect(document.querySelector(".component-placeholder")?.textContent).toContain("Japan region map");
    const linkedTab = document.querySelector("#tab-linked") as HTMLButtonElement;
    linkedTab.click();
    expect(linkedTab.getAttribute("aria-selected")).toBe("true");
    expect(document.querySelector("#panel-article")?.hasAttribute("hidden")).toBe(true);
    linkedTab.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    expect(document.querySelector("#tab-file")?.getAttribute("aria-selected")).toBe("true");
    expect(document.querySelector("#panel-file pre")?.textContent).toContain("**Important**");
    const status = document.querySelector("#article-status") as HTMLSelectElement;
    status.value = "draft";
    status.dispatchEvent(new Event("change", { bubbles: true }));
    expect((document.querySelector(".editorial-controls > button") as HTMLButtonElement).disabled).toBe(false);
    expect(document.querySelector(".review-form")?.textContent).toContain("exact revision");
    const approvalHelp = document.querySelector("#panel-file .field-help summary[aria-label='Help for Approval confirmation']") as HTMLElement;
    expect(approvalHelp).not.toBeNull();
    approvalHelp.click();
    expect(approvalHelp.parentElement?.hasAttribute("open")).toBe(true);
    expect(approvalHelp.parentElement?.textContent).toContain("exact revision");
    expect(document.querySelector("#panel-file .field-help summary[aria-label='Help for Validation performed (one check per line)']")).not.toBeNull();
    (document.querySelector("#tab-article") as HTMLButtonElement).click();
    const textarea = document.querySelector("#article-body-editor") as HTMLTextAreaElement;
    const toolbar = document.querySelector(".format-toolbar") as HTMLElement;
    expect([...toolbar.querySelectorAll("button")].slice(0, 2).map((button) => button.getAttribute("aria-label")))
      .toEqual(["Undo edit (Ctrl+Z)", "Redo edit (Ctrl+Y)"]);
    expect(toolbar.querySelector('[aria-label="Heading level 2"] .toolbar-symbol')?.textContent).toBe("H₂");
    const componentGroup = toolbar.querySelector('[aria-label="Shared article components"]') as HTMLElement;
    const componentInsert = [...componentGroup.querySelectorAll("button")].find((button) => button.textContent?.includes("Insert component"))!;
    const componentHelp = componentGroup.querySelector(".field-help") as HTMLElement;
    expect(componentInsert.compareDocumentPosition(componentHelp) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    textarea.setSelectionRange(0, 0);
    (document.querySelector('[aria-label="Heading level 3"]') as HTMLButtonElement).click();
    expect(textarea.value.startsWith("### Heading")).toBe(true);
    (document.querySelector('[aria-label="Undo edit (Ctrl+Z)"]') as HTMLButtonElement).click();
    expect(textarea.value).toBe(article.body);
    (document.querySelector('[aria-label="Redo edit (Ctrl+Y)"]') as HTMLButtonElement).click();
    expect(textarea.value.startsWith("### Heading")).toBe(true);
    textarea.value = "## Changed heading\n";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await waitFor(() => expect(document.querySelector(".article-preview h2")?.textContent).toBe("Changed heading"));
    expect(document.querySelector("#cms-article-preview [role='status']")?.textContent).toContain("unsaved article body");
    expect((document.querySelector(".edit-actions button:nth-child(2)") as HTMLButtonElement).disabled).toBe(false);
    (document.querySelector(".edit-actions button:nth-child(2)") as HTMLButtonElement).click();
    await waitFor(() => expect(mutations).toHaveLength(1));
    expect(mutations[0].method).toBe("PUT");
    expect(JSON.parse(mutations[0].body).expectedRevision).toBe("revision");
    await waitFor(() => expect(document.querySelector("#article-status")).not.toBeNull());
    (document.querySelector("#tab-file") as HTMLButtonElement).click();
    (document.querySelector("#review-change-note") as HTMLTextAreaElement).value = "Checked the article and sources.";
    (document.querySelector("#review-validation") as HTMLTextAreaElement).value = "Focused checks passed.";
    (document.querySelector("#review-approval-note") as HTMLTextAreaElement).value = "I approve this revision.";
    (document.querySelector(".approval-check input") as HTMLInputElement).checked = true;
    (document.querySelector(".review-form") as HTMLFormElement).dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await waitFor(() => expect(mutations).toHaveLength(2));
    expect(mutations[1].path).toContain("/review");
    expect(JSON.parse(mutations[1].body).explicitHumanApproval).toBe(true);
    const kindFilter = document.querySelector("#kind-filter") as HTMLSelectElement;
    kindFilter.value = "faq";
    kindFilter.dispatchEvent(new Event("change", { bubbles: true }));
    const groupFilter = document.querySelector("#group-filter") as HTMLSelectElement;
    expect([...groupFilter.options].map((option) => option.value)).toContain("faq:study");
    groupFilter.value = "faq:study";
    groupFilter.dispatchEvent(new Event("change", { bubbles: true }));
    expect(document.querySelectorAll("#article-list button")).toHaveLength(1);
    (document.querySelector("#article-list button") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector(".structured-record h3")?.textContent).toBe("Can I try this?"));
    const contentTab = document.querySelector("#record-tab-content") as HTMLButtonElement;
    const linkedRecordTab = document.querySelector("#record-tab-linked") as HTMLButtonElement;
    const fileRecordTab = document.querySelector("#record-tab-file") as HTMLButtonElement;
    expect(contentTab.getAttribute("aria-selected")).toBe("true");
    linkedRecordTab.click();
    expect(linkedRecordTab.getAttribute("aria-selected")).toBe("true");
    expect(document.querySelector("#record-panel-content")?.hasAttribute("hidden")).toBe(true);
    expect(document.querySelector("#record-panel-linked")?.textContent).toContain("sample-article");
    linkedRecordTab.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    expect(fileRecordTab.getAttribute("aria-selected")).toBe("true");
    expect(document.querySelector("#record-panel-file details pre")?.textContent).toContain("Check the actual conditions.");
    contentTab.click();
    const structuredPreview = document.querySelector("#cms-structured-preview") as HTMLElement;
    const structuredPreviewButton = [...document.querySelectorAll<HTMLButtonElement>(".structured-editor .edit-actions button")].find((button) => button.textContent?.startsWith("Preview"))!;
    expect(structuredPreview.hidden).toBe(true);
    structuredPreviewButton.click();
    expect(structuredPreview.hidden).toBe(false);
    expect(structuredPreviewButton.getAttribute("aria-expanded")).toBe("true");
    expect(structuredPreview.querySelector(".faq-preview h3")?.textContent).toBe("Can I try this?");
    expect(structuredPreview.querySelector(".preview-description")?.textContent).toBe("Check the actual conditions.");
    expect((structuredPreview.querySelector("a[href$='/faq#faq-sample-faq']") as HTMLAnchorElement).href).toContain("127.0.0.1:3000");
    expect(document.querySelector(".structured-editor .field-help summary[aria-label='Help for Summary']")).not.toBeNull();
    expect(document.querySelector(".structured-record")?.textContent).toContain("related articles");
    const summaryEditor = document.querySelector("#edit-summary") as HTMLTextAreaElement;
    summaryEditor.value = "Updated FAQ answer.";
    summaryEditor.dispatchEvent(new Event("input", { bubbles: true }));
    expect(document.querySelector(".structured-editor pre")?.textContent).toContain("Updated FAQ answer.");
    expect(structuredPreview.querySelector(".preview-description")?.textContent).toBe("Updated FAQ answer.");
    expect(structuredPreview.querySelector("[role='status']")?.textContent).toContain("unsaved edits");
    (document.querySelector(".structured-editor .edit-actions button:first-child") as HTMLButtonElement).click();
    await waitFor(() => expect(mutations).toHaveLength(3));
    expect(mutations[2].path).toBe("/api/records/faq/sample-faq/content");
    expect(JSON.parse(mutations[2].body).fields).toEqual({ summary: "Updated FAQ answer." });
    await waitFor(() => expect((document.querySelector("#edit-summary") as HTMLTextAreaElement).value).toBe("Check the actual conditions."));
    (document.querySelector("#record-tab-file") as HTMLButtonElement).click();
    (document.querySelector("#structured-change-note") as HTMLTextAreaElement).value = "Reviewed the FAQ.";
    (document.querySelector("#structured-validation") as HTMLTextAreaElement).value = "FAQ checks passed.";
    (document.querySelector("#structured-approval-note") as HTMLTextAreaElement).value = "I approve this FAQ.";
    (document.querySelector("#structured-editorial .approval-check input") as HTMLInputElement).checked = true;
    (document.querySelector("#structured-editorial .review-form") as HTMLFormElement).dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await waitFor(() => expect(mutations).toHaveLength(4));
    expect(mutations[3].path).toBe("/api/records/faq/sample-faq/review");
    expect(JSON.parse(mutations[3].body).expectedSourceRevision).toBe("b".repeat(64));
    await waitFor(() => expect(document.querySelector("#record-tab-file")?.getAttribute("aria-selected")).toBe("true"));
  });
});
