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
    const formattedScript = await readFile(resolve(directory, "formatted-article.js"), "utf8");
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
    const referenceRecords = [
      { kind: "source", id: "official-source", title: "Official source", registryPath: "src/data/sources.ts", capability: "inspect-only" },
      { kind: "journey", id: "sample-journey", title: "Moving to Japan", registryPath: "src/data/discovery.ts", capability: "inspect-only" },
      { kind: "article-group", id: "sample-group", title: "Arrival essentials", registryPath: "src/data/discovery/article-groups.ts", capability: "inspect-only" },
      { kind: "annotated-document", id: "sample-document", title: "Residence Card", registryPath: "src/data/annotated-documents.ts", capability: "inspect-only" },
    ];
    const referenceValues: Record<string, unknown> = {
      source: { id: "official-source", organization: "Agency", title: "Official source", url: "https://example.go.jp/source", authorityLevel: "national-government", language: "en", lastCheckedAt: "2026-09-10", lastReviewedAt: "2026-09-11", checkMethod: "manual" },
      journey: { id: "sample-journey", groupId: "sample-group", title: "Moving to Japan", description: "A route through preparation.", introduction: "Begin with the basics.", routes: [{ id: "route-study", title: "Study route", description: "Prepare for school.", articleId: "sample-article" }], phases: [{ id: "before-arrival", title: "Before arrival", description: "Plan ahead.", steps: [{ id: "choose-route", type: "route-choice" }, { id: "read-guide", type: "article", articleId: "sample-article", requiredness: "conditional", conditionLabel: "For this example", routeIds: ["route-study"] }] }] },
      "article-group": { id: "sample-group", title: "Arrival essentials", description: "Guides for the first steps.", articleIds: ["sample-article", "not-in-catalog"] },
      "annotated-document": { id: "sample-document", title: "Residence Card", japaneseName: "在留カード", issuer: "Agency", jurisdiction: "Japan", articleId: "sample-article", glossaryTermIds: ["zairyu-card"], description: "An accessible guide to the fields.", jurisdictionVariants: [{ id: "japan", geographyId: "japan", label: "Japan", issuer: "Agency", jurisdiction: "Japan", versions: [{ id: "current-card", label: "Current card", lifecycle: "current", reviewStatus: "verified", validFrom: "2026-01-01", lastCheckedAt: "2026-09-12", notice: "Check the issued card.", sourceIds: ["official-source"], officialVisuals: [{ id: "card-image", assetUrl: "https://example.go.jp/card.png", width: 400, height: 250, alt: "Official card example", caption: "Official comparison image.", sourceId: "official-source", rightsSourceId: "official-source", presentation: "unmodified" }], sections: [{ id: "identity", label: "Identity", fields: [{ id: "name", number: 1, label: "Name", japaneseLabel: "氏名", exampleValue: "EXAMPLE NAME", explanation: "Check against the passport.", caution: "Example only." }] }] }] }] },
    };
    const localGuidanceSummary = { id: "akita-address-registration", articleId: "sample-article", title: "Address registration in Akita", translation: "stale", generator: "codex-drafted" };
    let localGuidanceValue = { id: "akita-address-registration", articleId: "sample-article", title: localGuidanceSummary.title, summary: "File a local address notification.", applicability: "For people moving to Akita City.", responsibleBody: "Akita City", receivingOffice: "Residents Section", actions: [{ title: "Visit the city", description: "Bring your required documents." }], sourceIds: ["akita-address-source"], sourceFormatNote: "This is an English summary, not an official translation.", lastCheckedAt: "2026-09-26", status: "needs-review" };
    let localGuidanceRevision = "local-guidance-revision-1";
    const localGuidanceSourceRevision = "d".repeat(64);
    const localGuidanceMutations: { path: string; method: string; body: string }[] = [];
    const localGuidanceDetail = () => ({ id: localGuidanceSummary.id, locationId: "jp-05201", locationName: "Akita City", articleId: "sample-article", title: localGuidanceValue.title, revision: localGuidanceRevision, source: { path: "src/data/local-guidance/locations/akita/akita.ts", sourceRevision: localGuidanceSourceRevision }, value: localGuidanceValue, sources: [{ id: "akita-address-source", title: "Akita address procedure", url: "https://example.go.jp/akita", language: "ja", lastCheckedAt: "2026-09-26" }], recheck: [{ kind: "gap", records: ["akita-address-registration"], gap: "Confirm counter hours before visiting." }], translation: "stale", generator: "codex-drafted", translationReviewState: "machine-translated" });
    const mutations: { path: string; method: string; body: string }[] = [];
    // The first article body save reports a failed metadata regeneration; the server then reports it as stale.
    let generatedMetadataState: Record<string, unknown> = { status: "current" };
    const metadataRefreshes: string[] = [];
    const recoveryMutations: { path: string; method: string; body: string }[] = [];
    let savedDraft: Record<string, unknown> | null = null;
    let draftRevision = 0;
    const checkDefinitions = [
      { id: "cms-tests", label: "CMS tests", command: "npx vitest run tools/cms", scope: "focused" },
      { id: "glossary-check", label: "Glossary consistency", command: "npm run localization:glossary:check", scope: "project" },
    ];
    let checkReport = { definitions: checkDefinitions, active: undefined as undefined | { id: string; status: string; startedAt: string; durationMs: number; output: string }, history: [] as Array<{ id: string; status: string; startedAt: string; durationMs: number; output: string }> };
    let checkStarts = 0;
    const creations: { path: string; body: Record<string, unknown> }[] = [];
    const creationOptions = { faqGroups: [{ id: "study", label: "Study in Japan" }], topics: ["banking"], journeyStages: ["planning"],
      sourceFamilies: ["daily-life-safety"], authorityLevels: ["national-government"], sourceLanguages: ["en", "ja"], checkMethods: ["automated", "manual"],
      known: { articles: ["sample-article"], groups: [], journeys: [], glossaryTerms: [], residenceStatuses: [], activities: [], sources: ["official-source"] },
      article: { registryFamilies: ["transport-safety-and-daily-life"], journeyStages: ["planning"], topics: ["daily-life"], audiences: ["newcomer"],
        geographicScopes: ["national"], importance: ["informational"], contentTypes: ["guide"], relationshipTypes: ["related", "prerequisite", "next-step"] } };
    const createdFaq = { ...faq, id: "new-faq", title: "Can I create this?", value: { ...faq.value, id: "new-faq", question: "Can I create this?" } };
    const fetch = async (path: string, options?: { method?: string; body?: string }) => ({
      ok: true,
       json: async () => path === "/api/local-guidance" ? { locations: [{ id: "jp-05201", name: "Akita City", prefectureId: "jp-05000", supplements: [localGuidanceSummary] }, { id: "jp-05202", name: "Noshiro City", prefectureId: "jp-05000", supplements: [] }], guides: ["sample-article", "health-insurance-guide", "waste-guide", "resident-tax-guide", "hazard-guide", "japanese-classes-guide", "pension-guide"], failures: [] }
        : path === "/api/local-guidance/akita-address-registration" ? localGuidanceDetail()
          : path === "/api/local-guidance/akita-address-registration/content" && options?.method === "PUT" ? (localGuidanceMutations.push({ path, method: options.method, body: options.body ?? "" }), (() => { const payload = JSON.parse(options.body ?? "{}"); localGuidanceValue = { ...localGuidanceValue, ...payload.fields }; localGuidanceSummary.title = localGuidanceValue.title; localGuidanceRevision = "local-guidance-revision-2"; return { changed: true, revision: localGuidanceRevision, sourceRevision: localGuidanceSourceRevision }; })())
        : path === "/api/recovery/drafts" ? (savedDraft ? [savedDraft] : [])
        : path.startsWith("/api/recovery/drafts/") && (options?.method || "GET") === "GET" ? savedDraft
          : path.startsWith("/api/recovery/drafts/") && options?.method === "PUT" ? (recoveryMutations.push({ path, method: options.method, body: options.body ?? "" }), savedDraft = { ...JSON.parse(options.body ?? "{}"), kind: path.split("/")[4], id: decodeURIComponent(path.split("/")[5]), capturedAt: "2026-09-26T00:00:00.000Z", draftRevision: `draft-${++draftRevision}` })
            : path.startsWith("/api/recovery/drafts/") && options?.method === "DELETE" ? (recoveryMutations.push({ path, method: options.method, body: options.body ?? "" }), savedDraft = null, { deleted: true })
              : path === "/api/activity" ? { events: [{ at: "2026-09-26T00:00:00.000Z", kind: "save", outcome: "success", recordKind: "article", recordId: "sample-article", revision: "revision" }] }
                : path === "/api/checks" ? checkReport
        : path === "/api/checks/start" ? (checkReport = { ...checkReport, active: { id: JSON.parse(options?.body ?? "{}").id, status: JSON.parse(options?.body ?? "{}").id === "glossary-check" ? "warning" : ++checkStarts === 1 ? "running" : "passed", startedAt: "2026-09-26T00:00:00.000Z", durationMs: 1000, output: "3 locations have findings." } })
          : path === "/api/checks/cancel" ? (checkReport = { ...checkReport, active: undefined, history: [{ id: "cms-tests", status: "canceled", startedAt: "2026-09-26T00:00:00.000Z", durationMs: 1500, output: "Canceled by operator" }] })
       : path === "/api/impact/sources" ? { sources: [{ id: "official-source", title: "Official source", organization: "Agency", url: "https://example.go.jp", dependents: [{ kind: "article", id: "sample-article", viaArticleIds: [] }] }], findings: [], coverageNote: "FAQs are not represented." }
            : path === "/api/reference" ? { records: referenceRecords }
              : path.startsWith("/api/reference/") ? (() => { const [, , , kind, id] = path.split("/"); const summary = referenceRecords.find((record) => record.kind === kind && record.id === decodeURIComponent(id)); return summary ? { ...summary, value: referenceValues[kind] } : null; })()
            : path.startsWith("/api/impact/content/") ? { coverage: path.includes("/faq/") ? "unknown" : "complete", note: path.includes("/faq/") ? "FAQs are not represented." : "", sources: path.includes("/faq/") ? [] : [{ id: "official-source", title: "Official source", url: "https://example.go.jp" }] }
            : path === "/api/translation-handoff" ? { complete: true, failures: [], items: [{ kind: "article", id: "sample-article", title: "Sample article", state: "stale", path: summary.path, sourceRevision: summary.revision }, ...(localGuidanceMutations.length ? [{ kind: "local-guidance-supplement", id: "akita-address-registration", title: localGuidanceValue.title, state: "stale", path: "src/data/local-guidance/akita/akita.ts", sourceRevision: localGuidanceRevision }] : [])] }
            : path === "/api/articles" ? { articles: [summary], failures: [] }
        : path === "/api/records" ? { records: [faqSummary], failures: [] }
        : path === "/api/records/faq/sample-faq" ? faq
        : path === "/api/git" ? {
          identity: { repository: "/repo", worktree: "/repo", branch: "main", startCommit: "c".repeat(40), startedAt: "2026-09-26T00:00:00.000Z", dirtyAtStart: ["src/data/faqs/work.ts"] },
          currentBranch: "main", currentCommit: "c".repeat(40), cmsChanges: ["content/articles/sample-article.mdx"],
          preexistingChanges: ["src/data/faqs/work.ts"], otherChanges: ["src/data/sources/registry.ts"], status: "## main",
        }
          : path === "/api/generated-metadata" ? generatedMetadataState
          : path === "/api/generated-metadata/refresh" ? (metadataRefreshes.push(options?.body ?? ""), generatedMetadataState = { status: "current" }, { refresh: { status: "updated" }, state: generatedMetadataState })
          : path === "/api/session" ? { token: "test-token" }
            : path === "/api/create/options" ? creationOptions
            : path === "/api/create/faq/preview" ? (creations.push({ path, body: JSON.parse(options?.body ?? "{}") }), { kind: "faq", id: "new-faq", path: "src/data/faqs/study.ts", sourceRevision: "e".repeat(64), insertion: ',\n  defineFaq("study", { id: "new-faq" }),', line: 12, revision: "f".repeat(64) })
            : path === "/api/create/faq" ? (creations.push({ path, body: JSON.parse(options?.body ?? "{}") }), { created: true, kind: "faq", id: "new-faq", path: "src/data/faqs/study.ts" })
            : path === "/api/records/faq/new-faq" ? createdFaq
            : path === "/api/create/article/preview" ? (creations.push({ path, body: JSON.parse(options?.body ?? "{}") }), { id: "new-article", mdxPath: "content/articles/new-article.mdx", mdxText: "export const metadata = {\n  id: \"new-article\",\n}\n\n## First section\n", registryPath: "src/lib/content/article-registry/transport-safety-and-daily-life.ts", registrySourceRevision: "a".repeat(64), importLine: 'import NewArticle, { metadata as newArticleMetadata } from "../../../../content/articles/new-article.mdx";', entryLine: "  [newArticleMetadata, NewArticle],", revision: "b".repeat(64), warnings: ["The new article is not in any article group or guided journey."] })
            : path === "/api/create/article" ? (creations.push({ path, body: JSON.parse(options?.body ?? "{}") }), { created: true, kind: "article", id: "new-article", path: "content/articles/new-article.mdx", registryPath: "src/lib/content/article-registry/transport-safety-and-daily-life.ts" })
            : path === "/api/create/source/preview" ? (creations.push({ path, body: JSON.parse(options?.body ?? "{}") }), { kind: "source", id: "new-source", path: "src/data/sources/daily-life-safety.ts", sourceRevision: "c".repeat(64), insertion: ',\n  officialSourceSchema.parse({ id: "new-source" }),', line: 20, revision: "d".repeat(64), warnings: [] })
            : path === "/api/create/source" ? (creations.push({ path, body: JSON.parse(options?.body ?? "{}") }), { created: true, kind: "source", id: "new-source", path: "src/data/sources/daily-life-safety.ts" })
            : path.endsWith("/preview") ? { blocks: [{ kind: "heading", level: 2, text: "Changed heading" }] }
              : ["/body", "/status", "/review", "/content"].some((suffix) => path.endsWith(suffix))
                ? (mutations.push({ path, method: options?.method ?? "", body: options?.body ?? "" }), (() => {
                  const failMetadata = path.endsWith("/body") && mutations.length === 1;
                  if (failMetadata) generatedMetadataState = { status: "stale", lastFailure: "fixture file was dirty at startup" };
                  return { changed: true, revision: "new-revision", approvalRecord: "content/editorial-reviews/test.json",
                    ...(failMetadata ? { generatedMetadata: { status: "failed", message: "fixture file was dirty at startup" } } : {}) };
                })())
                : article,
    });
    runInNewContext(formattedScript, { window });
    runInNewContext(script, { document, window, Event, fetch, setTimeout, clearTimeout });
    window.confirm = () => true;
    await waitFor(() => expect(document.querySelector("#article-list button")).not.toBeNull());
    await waitFor(() => expect(document.querySelector("#git-status .git-files")).not.toBeNull());
    // Source impact starts with a choice rather than an arbitrary source.
    await waitFor(() => expect((document.querySelector("#impact-source") as HTMLSelectElement).options.length).toBeGreaterThan(1));
    expect(document.querySelector("#impact-result")?.textContent).toContain("Choose a source");
    const impactPicker = document.querySelector("#impact-source") as HTMLSelectElement;
    impactPicker.value = impactPicker.options[1].value;
    impactPicker.dispatchEvent(new Event("change", { bubbles: true }));
    expect(document.querySelector("#impact-result")?.textContent).toContain("Official source");
    await waitFor(() => expect(document.querySelectorAll("#reference-list button")).toHaveLength(4));
    await waitFor(() => expect((document.querySelector("#local-guidance-location") as HTMLSelectElement).options.length).toBe(3));
    expect(document.querySelectorAll("#local-guidance-matrix thead th")).toHaveLength(8);
    expect(document.querySelector("#local-guidance-matrix thead th:nth-child(2)")?.textContent).toBe("Sample article");
    expect(document.querySelectorAll("#local-guidance-matrix tbody tr")).toHaveLength(2);
    // Locations group by prefecture when named; "issues only" keeps rows with stale, missing, or unchecked guides.
    expect(document.querySelector("#local-guidance-matrix-summary")?.textContent).toContain("1 supplement in 2 locations: 0 current, 1 stale");
    const issuesOnly = document.querySelector("#local-guidance-issues-only") as HTMLInputElement;
    issuesOnly.click();
    expect(document.querySelectorAll("#local-guidance-matrix tbody tr")).toHaveLength(1);
    expect(document.querySelector("#local-guidance-matrix .local-guidance-matrix-cell")?.textContent).toBe("Stale · Codex draft");
    issuesOnly.click();
    expect(document.querySelectorAll("#local-guidance-matrix tbody tr")).toHaveLength(2);
    (document.querySelector(".local-guidance-matrix-disclosure > summary") as HTMLElement).click();
    const matrixCell = document.querySelector("#local-guidance-matrix .local-guidance-matrix-cell") as HTMLButtonElement;
    expect(matrixCell.getAttribute("aria-label")).toContain("Sample article; Japanese artifact stale");
    matrixCell.click();
    await waitFor(() => expect(document.querySelector("#local-guidance-detail")?.textContent).toContain("Address registration in Akita"));
    expect((document.querySelector("#local-guidance-location") as HTMLSelectElement).value).toBe("jp-05201");
    expect(document.querySelector("[data-page='guidance']")?.hasAttribute("hidden")).toBe(false);
    expect(window.location.hash).toBe("#/guidance/akita-address-registration");
    expect(document.querySelector("#impact-result")?.textContent).toContain("sample-article");
    expect(document.querySelector("#handoff-status")?.textContent).toContain("1 stale and 0 missing");
    expect(document.querySelector("#handoff-items")?.textContent).toContain("Sample article");
    // Activity names the record and opens it; events are grouped by day in plain sentences.
    await waitFor(() => expect(document.querySelector("#activity-events")?.textContent).toContain("Sample article"));
    expect(document.querySelector("#activity-events h3")).not.toBeNull();
    expect(document.querySelector("#recovery-drafts")?.textContent).toContain("No recovery drafts");
    const referenceSearch = document.querySelector("#reference-search") as HTMLInputElement;
    referenceSearch.value = "journey";
    referenceSearch.dispatchEvent(new Event("input", { bubbles: true }));
    expect(document.querySelectorAll("#reference-list button")).toHaveLength(1);
    expect(document.querySelector("#reference-list")?.textContent).toContain("Moving to Japan");
    const referenceKind = document.querySelector("#reference-kind") as HTMLSelectElement;
    referenceSearch.value = "";
    referenceSearch.dispatchEvent(new Event("input", { bubbles: true }));
    referenceKind.value = "source";
    referenceKind.dispatchEvent(new Event("change", { bubbles: true }));
    expect(document.querySelectorAll("#reference-list button")).toHaveLength(1);
    (document.querySelector("#reference-list button") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector("#reference-detail")?.textContent).toContain("national-government"));
    expect(document.querySelector("#reference-detail")?.textContent).toContain("Last checked");
    expect(document.querySelector("#reference-detail")?.textContent).toContain("2026-09-11");
    expect(document.querySelector("#reference-detail .reference-raw-data pre")?.textContent).toContain('"checkMethod": "manual"');
    expect((document.querySelector("#reference-detail a") as HTMLAnchorElement).href).toContain("example.go.jp/source");
    expect(document.querySelector("#reference-detail")?.textContent).toContain("Inspect only · editing is not supported here");
    expect(document.querySelector("#reference-detail .edit-actions")).toBeNull();
    referenceKind.value = "journey";
    referenceKind.dispatchEvent(new Event("change", { bubbles: true }));
    (document.querySelector("#reference-list button") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector("#reference-detail")?.textContent).toContain("Phases and steps"));
    expect(document.querySelector("#reference-detail")?.textContent).toContain("Choose a route");
    expect(document.querySelector("#reference-detail")?.textContent).toContain("For this example");
    (document.querySelector("#reference-detail .reference-article-link") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector("#article-body-editor")).not.toBeNull());
    referenceKind.value = "article-group";
    referenceKind.dispatchEvent(new Event("change", { bubbles: true }));
    (document.querySelector("#reference-list button") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector("#reference-detail")?.textContent).toContain("Member articles"));
    expect(document.querySelector("#reference-detail .reference-article-link")?.textContent).toContain("sample-article");
    const missingArticleLink = document.querySelectorAll<HTMLButtonElement>("#reference-detail .reference-article-link")[1];
    expect(missingArticleLink.textContent).toContain("Article not in CMS catalog: not-in-catalog");
    expect(missingArticleLink.disabled).toBe(true);
    referenceKind.value = "annotated-document";
    referenceKind.dispatchEvent(new Event("change", { bubbles: true }));
    (document.querySelector("#reference-list button") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector("#reference-detail")?.textContent).toContain("Current card"));
    expect(document.querySelector("#reference-detail")?.textContent).toContain("Jurisdiction variants");
    expect(document.querySelector("#reference-detail")?.textContent).toContain("Official source IDs");
    expect(document.querySelector("#reference-detail")?.textContent).toContain("Official visuals");
    expect(document.querySelector("#reference-detail")?.textContent).toContain("Example only.");
    expect(document.querySelector("#reference-detail")?.textContent).toContain("EXAMPLE NAME");
    expect(document.querySelector("#reference-detail .reference-raw-data pre")?.textContent).toContain('"rightsSourceId": "official-source"');
    expect(document.querySelector("#reference-detail .reference-raw-data pre")?.textContent).toContain('"japaneseLabel": "氏名"');
    expect(document.querySelector("#reference-detail .article-editor")).toBeNull();
    expect(document.querySelector("#recovery-drafts")?.textContent).toContain("No recovery drafts");
    expect(document.querySelectorAll("#local-guidance-list button")).toHaveLength(1);
    expect(document.querySelector("#summary")?.textContent).not.toContain("municipality");
    expect(document.querySelector("#local-guidance-detail")?.textContent).toContain("Japanese artifact stale");
    expect(document.querySelector("#local-guidance-detail")?.textContent).toContain("Codex drafted; awaiting Claude check");
    expect(document.querySelector("#local-guidance-detail")?.textContent).toContain("Translation review state: machine-translated");
    expect(document.querySelector("#local-guidance-detail")?.textContent).toContain("Akita address procedure");
    expect(document.querySelector("#local-guidance-detail")?.textContent).toContain("Confirm counter hours before visiting.");
    expect([...document.querySelectorAll("#local-guidance-detail [role='tab']")].map((tab) => tab.textContent)).toEqual(["Edit", "Sources & rechecks", "Details & checks"]);
    expect(document.querySelector("#local-guidance-detail .record-header h3")?.textContent).toBe("Address registration in Akita");
    expect(document.querySelector(".local-guidance-check-command code")?.textContent).toBe("npm run local-guidance -- check --location jp-05201 --links --evidence");
    expect(document.querySelector(".local-guidance-check-command")?.textContent).toContain("has not run it automatically");
    expect((document.querySelector("#local-guidance-detail a") as HTMLAnchorElement).href).toContain("example.go.jp/akita");
    (document.querySelector("#local-guidance-title") as HTMLInputElement).value = "Address registration in Akita, updated";
    (document.querySelector("#local-guidance-title") as HTMLInputElement).dispatchEvent(new Event("input", { bubbles: true }));
    (document.querySelector("#local-guidance-summary") as HTMLTextAreaElement).value = "Updated location-specific summary.";
    (document.querySelector("#local-guidance-summary") as HTMLTextAreaElement).dispatchEvent(new Event("input", { bubbles: true }));
    const localActionTitle = document.querySelector(".local-guidance-actions-editor [data-action-field='title']") as HTMLInputElement;
    localActionTitle.value = "Bring current records";
    localActionTitle.dispatchEvent(new Event("input", { bubbles: true }));
    const localSave = [...document.querySelectorAll<HTMLButtonElement>("#local-guidance-detail button")].find((button) => button.textContent === "Save English changes")!;
    expect(localSave.disabled).toBe(false);
    localSave.click();
    await waitFor(() => expect(localGuidanceMutations).toHaveLength(1));
    expect(localGuidanceMutations[0].path).toBe("/api/local-guidance/akita-address-registration/content");
    const localPayload = JSON.parse(localGuidanceMutations[0].body);
    expect(localPayload.expectedRevision).toBe("local-guidance-revision-1");
    expect(localPayload.expectedSourceRevision).toBe(localGuidanceSourceRevision);
    expect(localPayload.fields).toEqual({ title: "Address registration in Akita, updated", summary: "Updated location-specific summary.", actions: [{ title: "Bring current records", description: "Bring your required documents." }] });
    await waitFor(() => expect((document.querySelector("#local-guidance-summary") as HTMLTextAreaElement).value).toBe("Updated location-specific summary."));
    expect(document.querySelector("#local-guidance-detail")?.textContent).toContain("local-guidance-revision-2");
    expect(document.querySelector("#local-guidance-list")?.textContent).toContain("Address registration in Akita, updated");
    expect(document.querySelector("#handoff-items")?.textContent).toContain("Address registration in Akita");
    const localHandoffButton = [...document.querySelectorAll<HTMLButtonElement>("#handoff-items button")].find((button) => button.textContent?.includes("local guidance supplement"));
    expect(localHandoffButton).toBeDefined();
    localHandoffButton!.click();
    await waitFor(() => expect(document.querySelector("#local-guidance-detail")?.textContent).toContain("Address registration in Akita"));
    expect(document.querySelector("#local-guidance-detail .review-form")).toBeNull();
    expect(document.querySelector("#local-guidance-detail select")).toBeNull();
    expect(document.querySelector("#summary")?.textContent).toContain("2 reviewable records");
    await waitFor(() => expect((document.querySelector("#check-kind") as HTMLSelectElement).value).toBe("cms-tests"));
    (document.querySelector("#check-start") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector("#check-status")?.textContent).toContain("Running: CMS tests"));
    expect((document.querySelector("#check-start") as HTMLButtonElement).disabled).toBe(true);
    (document.querySelector("#check-cancel") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector("#check-status")?.textContent).toContain("Canceled: CMS tests"));
    expect(document.querySelector("#check-status")?.textContent).not.toContain("Passed");
    (document.querySelector("#check-start") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector("#check-status")?.textContent).toContain("Passed: CMS tests"));
    expect(document.querySelector("#check-status")?.textContent).toContain("Only this named check passed.");
    const checkSelector = document.querySelector("#check-kind") as HTMLSelectElement;
    checkSelector.value = "glossary-check";
    checkSelector.dispatchEvent(new Event("change", { bubbles: true }));
    (document.querySelector("#check-start") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector("#check-status")?.textContent).toContain("Review findings: Glossary consistency"));
    expect(document.querySelector("#check-status")?.className).toBe("check-warning");
    const changesPage = document.querySelector("[data-page='changes']") as HTMLElement;
    expect(changesPage.hidden).toBe(true);
    (document.querySelector("[data-page-link='changes']") as HTMLAnchorElement).dispatchEvent(new Event("click", { bubbles: true }));
    window.location.hash = "#/changes";
    await waitFor(() => expect(changesPage.hidden).toBe(false));
    expect(document.querySelector("#page-heading")?.textContent).toBe("Changes");
    expect(document.querySelector("[data-page-link='changes']")?.getAttribute("aria-current")).toBe("page");
    expect(document.querySelector("[data-page='content']")?.hasAttribute("hidden")).toBe(true);
    expect(document.querySelector("[data-count='changes']")?.textContent).toBe("1 changed by this session");
    expect(document.querySelector("#attention")?.textContent).toContain("1 file changed by this CMS session");
    expect(document.querySelector("#attention")?.textContent).toContain("1 file already had uncommitted changes");
    expect(document.querySelector("#attention")?.textContent).toContain("1 data module changed outside the CMS after it started. Restart the CMS");
    expect(document.querySelector("#data-freshness")?.textContent).toContain("Restart needed");
    expect(document.querySelector("#data-freshness")?.classList.contains("restart-needed")).toBe(true);
    const gitText = document.querySelector("#git-status")!.textContent!;
    expect(gitText).toContain("Changed by this CMS session (1)");
    expect(gitText).toContain("content/articles/sample-article.mdx");
    expect(gitText).toContain("Already changed before this session (1)");
    expect(gitText).toContain("The CMS will not write them");
    savedDraft = { kind: "article", id: "sample-article", expectedRecordRevision: "older-revision", content: { body: "## Do not load automatically" }, capturedAt: "2026-09-25T00:00:00.000Z", draftRevision: "existing-draft" };
    (document.querySelector("#article-list button") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector("#article-body-editor")).not.toBeNull());
    expect(window.location.hash).toBe("#/content/article/sample-article");
    expect(document.querySelector("[data-page='content']")?.hasAttribute("hidden")).toBe(false);
    expect(document.querySelector("#page-heading")?.textContent).toBe("Content");
    await waitFor(() => expect(document.querySelector(".recovery-panel")?.textContent).toContain("base revision is stale"));
    expect((document.querySelector("#article-body-editor") as HTMLTextAreaElement).value).toBe(article.body);
    const staleLoad = [...document.querySelectorAll<HTMLButtonElement>(".recovery-panel button")].find((button) => button.textContent === "Load draft into editor")!;
    expect(staleLoad.disabled).toBe(true);
    const blockedEditor = document.querySelector("#article-body-editor") as HTMLTextAreaElement;
    blockedEditor.value = "## New unsaved edit\n";
    blockedEditor.dispatchEvent(new Event("input", { bubbles: true }));
    await waitFor(() => expect((document.querySelector("#panel-article .edit-actions button:nth-child(2)") as HTMLButtonElement).disabled).toBe(false));
    (document.querySelector("#panel-article .edit-actions button:nth-child(2)") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector("#panel-article .article-editor [role='status']")?.textContent).toContain("recovery draft is already saved"));
    expect(mutations).toHaveLength(0);
    (document.querySelector(".recovery-panel button:last-child") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector(".recovery-panel")?.textContent).toContain("No saved recovery draft"));
    expect(JSON.parse(recoveryMutations.find((item) => item.method === "DELETE")!.body).draftRevision).toBe("existing-draft");
    recoveryMutations.length = 0;
    savedDraft = { kind: "article", id: "sample-article", expectedRecordRevision: "revision", content: { body: "## Explicitly restored draft", updatedAt: "2026-09-02" }, capturedAt: "2026-09-26T00:00:00.000Z", draftRevision: "matching-draft" };
    (document.querySelector("#refresh") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector(".recovery-panel")?.textContent).toContain("base revision matches"));
    expect((document.querySelector("#article-body-editor") as HTMLTextAreaElement).value).toBe(article.body);
    const matchingLoad = [...document.querySelectorAll<HTMLButtonElement>(".recovery-panel button")].find((button) => button.textContent === "Load draft into editor")!;
    expect(matchingLoad.disabled).toBe(false);
    matchingLoad.click();
    expect((document.querySelector("#article-body-editor") as HTMLTextAreaElement).value).toBe("## Explicitly restored draft");
    (document.querySelector(".recovery-panel .recovery-actions button:last-child") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector(".recovery-panel")?.textContent).toContain("No saved recovery draft"));
    (document.querySelector("#panel-article .article-editor .edit-actions button:last-child") as HTMLButtonElement).click();
    await waitFor(() => expect((document.querySelector("#article-body-editor") as HTMLTextAreaElement).value).toBe(article.body));
    await waitFor(() => expect(document.querySelector("#panel-sources .content-impact")?.textContent).toContain("Graph coverage: complete"));
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
    const approvalHelp = document.querySelector("#panel-review .field-help summary[aria-label='Help for Approval confirmation']") as HTMLElement;
    expect(approvalHelp).not.toBeNull();
    approvalHelp.click();
    expect(approvalHelp.parentElement?.hasAttribute("open")).toBe(true);
    expect(approvalHelp.parentElement?.textContent).toContain("exact revision");
    expect(document.querySelector("#panel-review .field-help summary[aria-label='Help for Validation performed (one check per line)']")).not.toBeNull();
    expect(document.querySelector("#panel-file .editorial-controls")).toBeNull();
    expect(document.querySelector("#tab-review")?.textContent).toBe("Review & approve");
    expect(document.querySelector(".record-header h3")?.textContent).toBe("Sample article");
    expect(document.querySelector(".record-header .record-path")?.textContent).toBe("content/articles/sample-article.mdx");
    // The filtered list is a queue: the header shows the position and steps to the next record.
    expect(document.querySelector(".record-header .queue-position")?.textContent).toBe("1 of 2 in this list");
    // Approval stays disabled until the confirmation is ticked.
    const approveButton = document.querySelector("#panel-review .review-form button[type='submit']") as HTMLButtonElement;
    const approveCheck = document.querySelector("#panel-review .approval-check input") as HTMLInputElement;
    expect(approveButton.disabled).toBe(true);
    approveCheck.checked = true;
    approveCheck.dispatchEvent(new Event("change", { bubbles: true }));
    expect(approveButton.disabled).toBe(false);
    approveCheck.checked = false;
    approveCheck.dispatchEvent(new Event("change", { bubbles: true }));
    expect(document.querySelector("#panel-review .review-context")?.textContent).toContain("What you are approving");
    (document.querySelector("#tab-article") as HTMLButtonElement).click();
    const textarea = document.querySelector("#article-body-editor") as HTMLTextAreaElement;
    expect(textarea.hidden).toBe(true);
    expect(document.querySelector(".formatted-host h2")?.textContent).toBe("Heading");
    const formattedHeading = document.querySelector(".formatted-host h2") as HTMLElement;
    formattedHeading.textContent = "Edited heading";
    formattedHeading.dispatchEvent(new Event("input", { bubbles: true }));
    expect(textarea.value).toContain("## Edited heading");
    (document.querySelector('[aria-label="Undo edit (Ctrl+Z)"]') as HTMLButtonElement).click();
    expect(textarea.value).toBe(article.body);
    (document.querySelector(".editor-mode-bar button:nth-child(2)") as HTMLButtonElement).click();
    expect(textarea.hidden).toBe(false);
    expect(textarea.value).toBe(article.body);
    (document.querySelector(".editor-mode-bar button:first-child") as HTMLButtonElement).click();
    expect(document.querySelector(".editor-mode-bar button:first-child")?.getAttribute("aria-pressed")).toBe("true");
    expect(document.querySelector(".formatted-host h2")?.textContent).toBe("Heading");
    const paragraph = document.querySelector(".formatted-host .formatted-block:nth-child(2) p") as HTMLElement;
    paragraph.focus();
    paragraph.dispatchEvent(new Event("focusin", { bubbles: true }));
    expect((document.querySelector('[aria-label="Block type"]') as HTMLSelectElement).value).toBe("paragraph");
    const strongText = paragraph.querySelector("strong")!.firstChild!;
    const selected = document.createRange();
    selected.selectNodeContents(strongText);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(selected);
    expect(window.getSelection()!.anchorNode).toBe(strongText);
    expect(paragraph.contains(window.getSelection()!.getRangeAt(0).commonAncestorContainer)).toBe(true);
    paragraph.dispatchEvent(new Event("mouseup", { bubbles: true }));
    (document.querySelector('[aria-label="Bold (Ctrl+B)"]') as HTMLButtonElement).click();
    expect(document.querySelector(".article-editor [role='status']")?.textContent).not.toContain("Select text");
    expect(document.querySelector(".formatted-host .formatted-block:nth-child(2) strong")).toBeNull();
    expect(textarea.value).toContain("Important [term](/glossary/term)");
    (document.querySelector('[aria-label="Undo edit (Ctrl+Z)"]') as HTMLButtonElement).click();
    const link = document.querySelector(".formatted-host .formatted-block:nth-child(2) a") as HTMLElement;
    link.closest('[contenteditable="true"]')?.dispatchEvent(new Event("focusin", { bubbles: true }));
    const linkRange = document.createRange();
    linkRange.selectNodeContents(link);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(linkRange);
    link.dispatchEvent(new Event("mouseup", { bubbles: true }));
    (document.querySelector('[aria-label="Insert or change link"]') as HTMLButtonElement).click();
    (document.querySelector("#article-link-url") as HTMLInputElement).value = "/glossary/changed";
    (document.querySelector(".link-editor button") as HTMLButtonElement).click();
    expect(textarea.value).toContain("[term](/glossary/changed)");
    (document.querySelector('[aria-label="Undo edit (Ctrl+Z)"]') as HTMLButtonElement).click();
    expect(textarea.value).toBe(article.body);
    const selectParagraph = () => {
      const current = document.querySelector(".formatted-host .formatted-block:nth-child(2) p") as HTMLElement;
      current.dispatchEvent(new Event("focusin", { bubbles: true }));
      const range = document.createRange();
      range.selectNodeContents(current);
      range.collapse(false);
      window.getSelection()!.removeAllRanges();
      window.getSelection()!.addRange(range);
      return current;
    };
    selectParagraph();
    const typePicker = document.querySelector('[aria-label="Block type"]') as HTMLSelectElement;
    typePicker.value = "blockquote";
    typePicker.dispatchEvent(new Event("change", { bubbles: true }));
    expect(textarea.value).toContain("> **Important** [term](/glossary/term)");
    (document.querySelector('[aria-label="Undo edit (Ctrl+Z)"]') as HTMLButtonElement).click();
    selectParagraph();
    typePicker.value = "unordered-list";
    typePicker.dispatchEvent(new Event("change", { bubbles: true }));
    expect(textarea.value).toContain("- **Important** [term](/glossary/term)");
    const listItem = document.querySelector(".formatted-host .formatted-block:nth-child(2) li") as HTMLElement;
    listItem.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(document.querySelectorAll(".formatted-host .formatted-block:nth-child(2) li")).toHaveLength(2);
    expect(document.querySelector(".formatted-host .formatted-block:nth-child(2) li:last-child")?.textContent).toBe("");
    expect((document.querySelector(".edit-actions button:nth-child(2)") as HTMLButtonElement).disabled).toBe(true);
    (document.querySelector('[aria-label="Undo edit (Ctrl+Z)"]') as HTMLButtonElement).click();
    const pasteTarget = selectParagraph();
    const paste = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(paste, "clipboardData", { value: { getData: () => " pasted" } });
    pasteTarget.dispatchEvent(paste);
    expect(textarea.value).toContain("[term](/glossary/term) pasted");
    (document.querySelector('[aria-label="Undo edit (Ctrl+Z)"]') as HTMLButtonElement).click();
    selectParagraph();
    (document.querySelector(".toolbar-group[aria-label='Shared article components'] button") as HTMLButtonElement).click();
    expect(textarea.value).toContain("<JapanRegionMap />");
    expect(document.querySelector(".formatted-locked")?.textContent).toContain("japan region map");
    (document.querySelector('[aria-label="Undo edit (Ctrl+Z)"]') as HTMLButtonElement).click();
    expect(textarea.value).toBe(article.body);
    const toolbar = document.querySelector(".format-toolbar") as HTMLElement;
    expect([...toolbar.querySelectorAll("button")].slice(0, 2).map((button) => button.getAttribute("aria-label")))
      .toEqual(["Undo edit (Ctrl+Z)", "Redo edit (Ctrl+Y)"]);
    expect(toolbar.querySelector('[aria-label="Heading level 2"] .toolbar-symbol')?.textContent).toBe("H₂");
    const componentGroup = toolbar.querySelector('[aria-label="Shared article components"]') as HTMLElement;
    const componentInsert = [...componentGroup.querySelectorAll("button")].find((button) => button.textContent?.includes("Insert component"))!;
    const componentHelp = componentGroup.querySelector(".field-help") as HTMLElement;
    expect(componentInsert.compareDocumentPosition(componentHelp) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const firstHeading = document.querySelector(".formatted-host h2") as HTMLElement;
    firstHeading.focus();
    firstHeading.dispatchEvent(new Event("focusin", { bubbles: true }));
    const firstRange = document.createRange();
    firstRange.selectNodeContents(firstHeading);
    firstRange.collapse(false);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(firstRange);
    textarea.setSelectionRange(0, 0);
    (document.querySelector('[aria-label="Heading level 3"]') as HTMLButtonElement).click();
    expect(textarea.value.startsWith("### Heading")).toBe(true);
    (document.querySelector('[aria-label="Undo edit (Ctrl+Z)"]') as HTMLButtonElement).click();
    expect(textarea.value).toBe(article.body);
    (document.querySelector('[aria-label="Redo edit (Ctrl+Y)"]') as HTMLButtonElement).click();
    expect(textarea.value.startsWith("### Heading")).toBe(true);
    const emptyHeading = document.querySelector(".formatted-host h3") as HTMLElement;
    emptyHeading.textContent = "";
    emptyHeading.dispatchEvent(new Event("input", { bubbles: true }));
    const otherBlock = document.querySelector(".formatted-host .formatted-block:nth-child(2) p") as HTMLElement;
    otherBlock.textContent = "Changed while heading is empty";
    otherBlock.dispatchEvent(new Event("input", { bubbles: true }));
    expect((document.querySelector(".edit-actions button:nth-child(2)") as HTMLButtonElement).disabled).toBe(true);
    (document.querySelector(".editor-mode-bar button:nth-child(2)") as HTMLButtonElement).click();
    expect(textarea.hidden).toBe(true);
    emptyHeading.textContent = "Heading restored";
    emptyHeading.dispatchEvent(new Event("input", { bubbles: true }));
    (document.querySelector(".editor-mode-bar button:nth-child(2)") as HTMLButtonElement).click();
    expect(textarea.hidden).toBe(false);
    textarea.value = "## Changed heading\n";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await waitFor(() => expect(recoveryMutations.some((item) => item.method === "PUT" && item.path.endsWith("/article/sample-article")
      && JSON.parse(item.body).content.body === "## Changed heading\n")).toBe(true));
    await waitFor(() => expect(document.querySelector(".article-preview h2")?.textContent).toBe("Changed heading"));
    expect(document.querySelector("#cms-article-preview [role='status']")?.textContent).toContain("unsaved article body");
    expect((document.querySelector(".edit-actions button:nth-child(2)") as HTMLButtonElement).disabled).toBe(false);
    expect(document.querySelector("#panel-article .save-state")?.textContent).toContain("Unsaved edits");
    expect(document.querySelector(".record-header .unsaved-badge")).not.toBeNull();
    // Ctrl+S saves the open editor.
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "s", ctrlKey: true, bubbles: true, cancelable: true }));
    await waitFor(() => expect(mutations).toHaveLength(1));
    expect(mutations[0].method).toBe("PUT");
    expect(JSON.parse(mutations[0].body).expectedRevision).toBe("revision");
    // The article save stands, and the banner explains the stale generated module and offers the repair.
    const metadataNotice = document.querySelector("#generated-metadata") as HTMLElement;
    await waitFor(() => expect(metadataNotice.hidden).toBe(false));
    expect(metadataNotice.textContent).toContain("Article changes are saved");
    expect(metadataNotice.textContent).toContain("fixture file was dirty at startup");
    expect(metadataNotice.textContent).toContain("npm run content:metadata");
    expect(document.querySelector("#article-detail .error")).toBeNull();
    (metadataNotice.querySelector("button") as HTMLButtonElement).click();
    await waitFor(() => expect(metadataNotice.hidden).toBe(true));
    expect(metadataRefreshes).toEqual(["{}"]);
    await waitFor(() => expect(recoveryMutations.some((item) => item.method === "DELETE")).toBe(true));
    await waitFor(() => expect(document.querySelector("#article-status")).not.toBeNull());
    (document.querySelector("#tab-review") as HTMLButtonElement).click();
    (document.querySelector("#review-change-note") as HTMLTextAreaElement).value = "Checked the article and sources.";
    (document.querySelector("#review-validation") as HTMLTextAreaElement).value = "Focused checks passed.";
    (document.querySelector("#review-approval-note") as HTMLTextAreaElement).value = "I approve this revision.";
    (document.querySelector(".approval-check input") as HTMLInputElement).checked = true;
    (document.querySelector(".review-form") as HTMLFormElement).dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await waitFor(() => expect(mutations).toHaveLength(2));
    expect(mutations[1].path).toContain("/review");
    expect(JSON.parse(mutations[1].body).explicitHumanApproval).toBe(true);
    const searchBox = document.querySelector("#search") as HTMLInputElement;
    searchBox.value = "sample-article";
    searchBox.dispatchEvent(new Event("input", { bubbles: true }));
    expect(document.querySelector("#article-list .match-reason")?.textContent).toBe("Matched ID: sample-article");
    searchBox.value = "study";
    searchBox.dispatchEvent(new Event("input", { bubbles: true }));
    expect(document.querySelectorAll("#article-list button")).toHaveLength(1);
    expect(document.querySelector("#article-list .match-reason")?.textContent).toBe("Matched category or topic: study");
    searchBox.value = "";
    searchBox.dispatchEvent(new Event("input", { bubbles: true }));
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
    await waitFor(() => expect(recoveryMutations.some((item) => item.path.endsWith("/faq/sample-faq"))).toBe(true));
    expect(document.querySelector(".structured-editor > details pre")?.textContent).toContain("Updated FAQ answer.");
    expect(structuredPreview.querySelector(".preview-description")?.textContent).toBe("Updated FAQ answer.");
    expect(structuredPreview.querySelector("[role='status']")?.textContent).toContain("unsaved edits");
    (document.querySelector(".structured-editor .edit-actions button:first-child") as HTMLButtonElement).click();
    await waitFor(() => expect(mutations).toHaveLength(3));
    expect(mutations[2].path).toBe("/api/records/faq/sample-faq/content");
    expect(JSON.parse(mutations[2].body).fields).toEqual({ summary: "Updated FAQ answer." });
    await waitFor(() => expect((document.querySelector("#edit-summary") as HTMLTextAreaElement).value).toBe("Check the actual conditions."));
    (document.querySelector("#record-tab-review") as HTMLButtonElement).click();
    (document.querySelector("#structured-change-note") as HTMLTextAreaElement).value = "Reviewed the FAQ.";
    (document.querySelector("#structured-validation") as HTMLTextAreaElement).value = "FAQ checks passed.";
    (document.querySelector("#structured-approval-note") as HTMLTextAreaElement).value = "I approve this FAQ.";
    (document.querySelector("#structured-editorial .approval-check input") as HTMLInputElement).checked = true;
    (document.querySelector("#structured-editorial .review-form") as HTMLFormElement).dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await waitFor(() => expect(mutations).toHaveLength(4));
    expect(mutations[3].path).toBe("/api/records/faq/sample-faq/review");
    expect(JSON.parse(mutations[3].body).expectedSourceRevision).toBe("b".repeat(64));
    await waitFor(() => expect(document.querySelector("#record-tab-review")?.getAttribute("aria-selected")).toBe("true"));

    // Duplicate as new opens a creation form with a fresh ID and no review data; Create needs a current preview.
    (document.querySelector(".record-header .duplicate-record") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector(".create-record h3")?.textContent).toBe("Create a FAQ"));
    expect(window.location.hash).toBe("#/content/new/faq");
    const idInput = document.querySelector("#create-id") as HTMLInputElement;
    expect(idInput.value).toBe("sample-faq-copy");
    expect((document.querySelector("#create-question") as HTMLInputElement).value).toBe("Can I try this?");
    expect((document.querySelector("#create-relatedArticleIds") as HTMLTextAreaElement).value).toBe("sample-article");
    const createButton = [...document.querySelectorAll<HTMLButtonElement>(".create-form button")].find((button) => button.textContent === "Create FAQ")!;
    expect(createButton.disabled).toBe(true);
    idInput.value = "new-faq";
    idInput.dispatchEvent(new Event("input", { bubbles: true }));
    const previewAddition = [...document.querySelectorAll<HTMLButtonElement>(".create-form button")].find((button) => button.textContent === "Preview addition")!;
    previewAddition.click();
    await waitFor(() => expect(createButton.disabled).toBe(false));
    expect(document.querySelector(".create-preview")?.textContent).toContain("src/data/faqs/study.ts, starting at line 12");
    expect(document.querySelector(".create-preview pre")?.textContent).toBe('  defineFaq("study", { id: "new-faq" }),');
    const previewed = creations[0]!.body.fields as Record<string, unknown>;
    expect(previewed).toMatchObject({ id: "new-faq", question: "Can I try this?", status: "needs-review", relatedArticleIds: ["sample-article"] });
    for (const key of ["lastReviewedAt", "createdAt", "updatedAt", "slug"]) expect(previewed).not.toHaveProperty(key);
    const question = document.querySelector("#create-question") as HTMLInputElement;
    question.value = "Can I create this?";
    question.dispatchEvent(new Event("input", { bubbles: true }));
    expect(createButton.disabled).toBe(true);
    previewAddition.click();
    await waitFor(() => expect(createButton.disabled).toBe(false));
    (document.querySelector(".create-form") as HTMLFormElement).dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await waitFor(() => expect(creations.filter((item) => item.path === "/api/create/faq")).toHaveLength(1));
    const created = creations.find((item) => item.path === "/api/create/faq")!.body;
    expect(created.expectedSourceRevision).toBe("e".repeat(64));
    expect((created.fields as Record<string, unknown>).question).toBe("Can I create this?");
    await waitFor(() => expect(document.querySelector(".structured-record .record-header h3")?.textContent).toBe("Can I create this?"));
    expect(window.location.hash).toBe("#/content/faq/new-faq");

    // Changing the creation route must replace a different-kind form, while routing back renders the requested kind.
    window.location.hash = "#/content/new/faq";
    await waitFor(() => expect(document.querySelector(".create-record")?.getAttribute("data-create-kind")).toBe("faq"));
    const draftQuestion = document.querySelector("#create-question") as HTMLInputElement;
    draftQuestion.value = "Preserve this unsaved FAQ";
    draftQuestion.dispatchEvent(new Event("input", { bubbles: true }));
    window.location.hash = "#/overview";
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    window.location.hash = "#/content/new/faq";
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    expect((document.querySelector("#create-question") as HTMLInputElement).value).toBe("Preserve this unsaved FAQ");
    let discardRequested = false;
    window.confirm = () => { discardRequested = true; return false; };
    window.location.hash = "#/content/new/article";
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    expect(discardRequested).toBe(true);
    expect(document.querySelector(".create-record")?.getAttribute("data-create-kind")).toBe("faq");
    expect((document.querySelector("#create-question") as HTMLInputElement).value).toBe("Preserve this unsaved FAQ");
    window.confirm = () => true;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    await waitFor(() => {
      expect(document.querySelector(".create-record")?.getAttribute("data-create-kind")).toBe("article");
      expect(document.querySelector(".create-record h3")?.textContent).toBe("Create an article");
    });

    // A new article: metadata, relationships by type, and a body; creation uses the previewed registry revision.
    (document.querySelector("[data-create-kind='article']") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector(".create-record h3")?.textContent).toBe("Create an article"));
    const setValue = (selector: string, value: string) => {
      const input = document.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };
    setValue("#create-id", "new-article");
    setValue("#create-title", "A new article");
    setValue("#create-description", "What the new article covers.");
    (document.querySelector("fieldset[data-create-list='journeyStageIds'] input") as HTMLInputElement).checked = true;
    (document.querySelector("fieldset[data-create-list='topicIds'] input") as HTMLInputElement).checked = true;
    setValue("#create-relationships-prerequisite", "sample-article");
    expect((document.querySelector("#create-body") as HTMLTextAreaElement).value).toContain("## First section");
    const articlePreview = [...document.querySelectorAll<HTMLButtonElement>(".create-form button")].find((button) => button.textContent === "Preview addition")!;
    articlePreview.click();
    const createArticleButton = [...document.querySelectorAll<HTMLButtonElement>(".create-form button")].find((button) => button.textContent === "Create article")!;
    await waitFor(() => expect(createArticleButton.disabled).toBe(false));
    expect(document.querySelector(".create-preview")?.textContent).toContain("Creates content/articles/new-article.mdx");
    expect(document.querySelector(".create-preview")?.textContent).toContain("[newArticleMetadata, NewArticle],");
    expect(document.querySelector(".create-preview .check-warning")?.textContent).toContain("not in any article group");
    const articleFields = creations.find((item) => item.path === "/api/create/article/preview")!.body.fields as Record<string, unknown>;
    expect(articleFields).toMatchObject({ id: "new-article", family: "transport-safety-and-daily-life", journeyStageIds: ["planning"], topicIds: ["daily-life"],
      geographicScopes: ["national"], status: "draft", relationships: [{ type: "prerequisite", articleId: "sample-article" }] });
    (document.querySelector(".create-form") as HTMLFormElement).dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await waitFor(() => expect(creations.some((item) => item.path === "/api/create/article")).toBe(true));
    expect(creations.find((item) => item.path === "/api/create/article")!.body.expectedSourceRevision).toBe("a".repeat(64));
    await waitFor(() => expect(window.location.hash).toBe("#/content/article/new-article"));

    // A new official source is created from the Sources page and can be cited at once.
    (document.querySelector("[data-create-kind='source']") as HTMLButtonElement).click();
    await waitFor(() => expect(document.querySelector("#reference-detail .create-record h3")?.textContent).toBe("Create an official source"));
    expect(document.querySelector("[data-page='sources']")?.hasAttribute("hidden")).toBe(false);
    expect(window.location.hash).toBe("#/sources/new/source");
    setValue("#create-id", "new-source");
    setValue("#create-organization", "Agency");
    setValue("#create-title", "A page");
    setValue("#create-url", "https://example.go.jp/page");
    [...document.querySelectorAll<HTMLButtonElement>("#reference-detail .create-form button")].find((button) => button.textContent === "Preview addition")!.click();
    const createSourceButton = [...document.querySelectorAll<HTMLButtonElement>("#reference-detail .create-form button")].find((button) => button.textContent === "Create official source")!;
    await waitFor(() => expect(createSourceButton.disabled).toBe(false));
    expect(creations.find((item) => item.path === "/api/create/source/preview")!.body.fields).toMatchObject({ family: "daily-life-safety", id: "new-source", authorityLevel: "national-government", language: "ja" });
    (document.querySelector("#reference-detail .create-form") as HTMLFormElement).dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await waitFor(() => expect(document.querySelector("#reference-detail")?.textContent).toContain("Official source created"));
    expect(creations.find((item) => item.path === "/api/create/source")!.body.expectedSourceRevision).toBe("c".repeat(64));
    // Ctrl+K opens Go to; typing narrows the list and Enter opens the highlighted match.
    window.confirm = () => true;
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true, cancelable: true }));
    const paletteInput = document.querySelector("#palette-input") as HTMLInputElement;
    expect(document.querySelector("#palette")?.hasAttribute("open")).toBe(true);
    paletteInput.value = "try this";
    paletteInput.dispatchEvent(new Event("input", { bubbles: true }));
    expect(document.querySelector("#palette-results [aria-selected='true'] .palette-title")?.textContent).toBe("Can I try this?");
    paletteInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(document.querySelector("#palette")?.hasAttribute("open")).toBe(false);
    await waitFor(() => expect(document.querySelector("#article-detail .record-header h3")?.textContent).toBe("Can I try this?"));
  }, 30_000);
});
