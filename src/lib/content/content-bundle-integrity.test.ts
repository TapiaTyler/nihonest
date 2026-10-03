import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { contentBundleVersionInput, verifyContentBundle } from "@/domain/content-bundle/content-bundle-integrity";
import { buildContentBundle, type ContentBundle } from "./content-bundle";

const sha256 = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");
let bundle: ContentBundle;
beforeAll(async () => {
  bundle = await buildContentBundle({ articleDirectory: resolve("content/articles"), generatedAt: "2026-09-29T00:00:00.000Z" });
});
const candidate = () => ({ manifest: structuredClone(bundle.manifest), files: new Map(bundle.files) });
function replacePayload(copy: ReturnType<typeof candidate>, path: string, payload: unknown) {
  const json = `${JSON.stringify(payload)}\n`;
  copy.files.set(path, json);
  copy.manifest.files.find((file) => file.path === path)!.checksum = sha256(json);
  copy.manifest.catalogVersion = sha256(contentBundleVersionInput(copy.manifest.files));
}

describe("content bundle acceptance", () => {
  it("accepts a complete serialized bundle without changing bytes or metadata", () => {
    const copy = candidate();
    expect(verifyContentBundle(JSON.parse(JSON.stringify(copy.manifest)), copy.files, sha256)).toEqual(bundle.manifest);
    expect(copy.files).toEqual(bundle.files);
  });
  it("rejects an unsupported format version", () => {
    expect(() => verifyContentBundle({ ...bundle.manifest, formatVersion: 1 }, bundle.files, sha256)).toThrow();
    expect(() => verifyContentBundle({ ...bundle.manifest, formatVersion: 2 }, bundle.files, sha256)).toThrow();
    expect(() => verifyContentBundle({ ...bundle.manifest, formatVersion: 3 }, bundle.files, sha256)).toThrow();
    expect(() => verifyContentBundle({ ...bundle.manifest, formatVersion: 4 }, bundle.files, sha256)).toThrow();
    expect(() => verifyContentBundle({ ...bundle.manifest, formatVersion: 5 }, bundle.files, sha256)).toThrow();
    expect(() => verifyContentBundle({ ...bundle.manifest, formatVersion: 6 }, bundle.files, sha256)).toThrow();
  });
  it("rejects the previous geography-free format", () => {
    expect(() => verifyContentBundle({ ...bundle.manifest, formatVersion: 7 }, bundle.files, sha256)).toThrow();
  });
  it("rejects the previous provenance-free format", () => {
    expect(() => verifyContentBundle({ ...bundle.manifest, formatVersion: 8 }, bundle.files, sha256)).toThrow();
  });
  it.each(["missing", "unlisted", "omitted"])("rejects %s files", (mode) => {
    const copy = candidate();
    if (mode === "missing") copy.files.delete("faqs.en.json");
    if (mode === "unlisted") copy.files.set("private.en.json", "[]\n");
    if (mode === "omitted") {
      copy.files.delete("faqs.en.json");
      copy.manifest.files = copy.manifest.files.filter((file) => file.path !== "faqs.en.json");
    }
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("exactly the supported files");
  });
  it("rejects duplicate manifest paths", () => {
    const copy = candidate();
    copy.manifest.files[1] = copy.manifest.files[0]!;
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow();
  });
  it("rejects changed bytes even when JSON is equivalent", () => {
    const copy = candidate();
    copy.files.set("faqs.en.json", copy.files.get("faqs.en.json")! + " ");
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("checksum mismatch");
  });
  it("rejects a wrong record count", () => {
    const copy = candidate();
    copy.manifest.files[0]!.records++;
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("record count mismatch");
  });
  it("rejects a wrong catalog version", () => {
    expect(() => verifyContentBundle({ ...bundle.manifest, catalogVersion: "0".repeat(64) }, bundle.files, sha256)).toThrow("catalog version mismatch");
  });
  it("rejects a mismatched locale/kind descriptor", () => {
    const copy = candidate();
    copy.manifest.files[0]!.locale = "ja";
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("Unsupported content bundle file contract");
  });
  it("rejects malformed JSON even with matching checksums", () => {
    const copy = candidate();
    copy.files.set("faqs.en.json", "{");
    copy.manifest.files.find((file) => file.path === "faqs.en.json")!.checksum = sha256("{");
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow(SyntaxError);
  });
  it.each(["glossary", "faqs", "sources", "residence-statuses", "article-groups", "journeys"])("validates %s payloads even with matching checksums", (catalog) => {
    const copy = candidate();
    const path = `${catalog}.en.json`;
    const records = JSON.parse(copy.files.get(path)!);
    records[0] = { id: records[0].id };
    replacePayload(copy, path, records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow();
  });
  it("rejects duplicate record IDs with valid payloads and checksums", () => {
    const copy = candidate();
    const records = JSON.parse(copy.files.get("faqs.en.json")!);
    records[1] = records[0];
    replacePayload(copy, "faqs.en.json", records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("record IDs must be unique");
  });
  it.each(["articles.en.json", "article-translations.ja.json"])("rejects duplicate canonical identities in %s despite extra IDs", (path) => {
    const copy = candidate();
    const records = JSON.parse(copy.files.get(path)!);
    expect(records.length).toBeGreaterThan(1);
    records[0].id = "extra-one";
    records[1] = { ...records[0], id: "extra-two" };
    replacePayload(copy, path, records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("record IDs must be unique");
  });
  it.each(["articles.en.json", "article-translations.ja.json"])("ignores unrelated IDs when checking valid %s identities", (path) => {
    const copy = candidate();
    const records = JSON.parse(copy.files.get(path)!);
    for (const record of records) record.id = "same-unrelated-id";
    replacePayload(copy, path, records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).not.toThrow();
  });
  it.each(["faq-translations.ja.json", "glossary-translations.ja.json", "residence-status-translations.ja.json"])("uses canonical contentId and validates fields in %s", (path) => {
    const copy = candidate();
    const records = JSON.parse(copy.files.get(path)!);
    records[0].id = "extra-one";
    records[1] = { ...records[0], id: "extra-two" };
    replacePayload(copy, path, records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("record IDs must be unique");
    records[1] = { ...records[0], contentId: "different-target", fields: {} };
    replacePayload(copy, path, records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow();
  });
  it.each(["faq-translations.ja.json", "glossary-translations.ja.json", "residence-status-translations.ja.json",
    "local-guidance-translations.ja.json", "general-local-advice-translations.ja.json",
    "residence-status-guidance-translations.ja.json", "article-group-translations.ja.json",
    "journey-translations.ja.json", "annotated-document-translations.ja.json",
    "activity-translations.ja.json"])("rejects unknown targets and stale source revisions in %s", (path) => {
    for (const mutation of [{ contentId: "missing-target" }, { sourceRevision: "0".repeat(64) }]) {
      const copy = candidate();
      const records = JSON.parse(copy.files.get(path)!);
      records[0] = { ...records[0], ...mutation };
      replacePayload(copy, path, records);
      expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("translation target or revision mismatch");
    }
  });
  it.each(["articleId", "geographyId", "sourceIds"])("rejects broken supplement %s references", (field) => {
    const copy = candidate();
    const records = JSON.parse(copy.files.get("local-guidance.en.json")!);
    records[0][field] = field === "sourceIds" ? ["missing-target"] : "missing-target";
    replacePayload(copy, "local-guidance.en.json", records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow(/unknown/);
  });
  it("rejects broken geography hierarchy", () => {
    const copy = candidate();
    const records = JSON.parse(copy.files.get("supported-geographies.en.json")!);
    records.find((record: { parentId?: string }) => record.parentId)!.parentId = "missing-parent";
    replacePayload(copy, "supported-geographies.en.json", records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("invalid parent");
  });
  it("rejects general advice for an unknown article", () => {
    const copy = candidate();
    const records = JSON.parse(copy.files.get("general-local-advice.en.json")!);
    records[0].id = "missing-target";
    replacePayload(copy, "general-local-advice.en.json", records);
    // Remove its overlay so the independent English relationship check must reject it.
    const overlays = JSON.parse(copy.files.get("general-local-advice-translations.ja.json")!)
      .filter((record: { contentId: string }) => record.contentId !== JSON.parse(bundle.files.get("general-local-advice.en.json")!)[0].id);
    replacePayload(copy, "general-local-advice-translations.ja.json", overlays);
    copy.manifest.files.find((file) => file.path === "general-local-advice-translations.ja.json")!.records = overlays.length;
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("unknown article");
  });
  it.each(["local-guidance-translations.ja.json", "general-local-advice-translations.ja.json"])("rejects unknown overlay keys in %s", (path) => {
    for (const key of ["unregistered-field", "constructor"]) {
      const copy = candidate();
      const records = JSON.parse(copy.files.get(path)!);
      records[0].fields[key] = "unexpected";
      replacePayload(copy, path, records);
      expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("Unknown path-keyed translation field");
    }
  });
  it("accepts partial supplement overlays but rejects incomplete general advice", () => {
    const copy = candidate();
    const supplements = JSON.parse(copy.files.get("local-guidance-translations.ja.json")!);
    supplements[0].fields = { title: supplements[0].fields.title };
    replacePayload(copy, "local-guidance-translations.ja.json", supplements);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).not.toThrow();
    const advice = JSON.parse(copy.files.get("general-local-advice-translations.ja.json")!);
    delete advice[0].fields["steps.0"];
    replacePayload(copy, "general-local-advice-translations.ja.json", advice);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("every title and step");
  });
  it("rejects guidance overlays on a status without structured guidance", () => {
    const copy = candidate();
    const overlays = JSON.parse(copy.files.get("residence-status-guidance-translations.ja.json")!);
    const statuses = JSON.parse(copy.files.get("residence-statuses.en.json")!);
    delete statuses.find((record: { id: string }) => record.id === overlays[0].contentId)!.structuredGuidance;
    replacePayload(copy, "residence-statuses.en.json", statuses);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("translation target or revision mismatch");
  });
  it("rejects summary artifacts masquerading as structured-guidance overlays", () => {
    const copy = candidate();
    const overlays = JSON.parse(copy.files.get("residence-status-guidance-translations.ja.json")!);
    const summaries = JSON.parse(copy.files.get("residence-status-translations.ja.json")!);
    const summary = summaries.find((record: { contentId: string }) => record.contentId === overlays[0].contentId)!;
    overlays[0].fields = summary.fields;
    replacePayload(copy, "residence-status-guidance-translations.ja.json", overlays);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("Unknown path-keyed translation field");
  });
  it.each(["unregistered-path", "constructor", "source-assertions.0.editorial-state"])("rejects unsupported guidance overlay path %s", (key) => {
    const copy = candidate();
    const overlays = JSON.parse(copy.files.get("residence-status-guidance-translations.ja.json")!);
    overlays[0].fields[key] = "unexpected";
    replacePayload(copy, "residence-status-guidance-translations.ja.json", overlays);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("Unknown path-keyed translation field");
  });
  it("accepts a current partial structured-guidance overlay", () => {
    const copy = candidate();
    const overlays = JSON.parse(copy.files.get("residence-status-guidance-translations.ja.json")!);
    overlays[0].fields = { "route-kind-label": overlays[0].fields["route-kind-label"] };
    replacePayload(copy, "residence-status-guidance-translations.ja.json", overlays);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).not.toThrow();
  });
  it.each(["glossary", "article", "source", "period-source", "pathway-source", "assertion-source", "transition"])("rejects broken residence-status %s references", (kind) => {
    const copy = candidate();
    const statuses = JSON.parse(copy.files.get("residence-statuses.en.json")!);
    const status = statuses[0];
    if (kind === "glossary") status.glossaryTermId = "missing-target";
    if (kind === "article") status.relatedArticleIds = ["missing-target"];
    if (kind === "source") status.sourceIds = ["missing-target"];
    if (kind === "period-source") status.structuredGuidance.periodsOfStay[0].sourceIds = ["missing-target"];
    if (kind === "pathway-source") status.structuredGuidance.qualificationPathways[0].sourceIds = ["missing-target"];
    if (kind === "assertion-source") status.structuredGuidance.sourceAssertions[0].sourceId = "missing-target";
    if (kind === "transition") status.structuredGuidance.transitions[0].targetStatusId = "missing-target";
    replacePayload(copy, "residence-statuses.en.json", statuses);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow(/unknown/);
  });
  it.each(["group-article", "journey-group", "route-article", "step-route"])("rejects broken discovery %s references", (kind) => {
    const copy = candidate();
    if (kind === "group-article") {
      const groups = JSON.parse(copy.files.get("article-groups.en.json")!);
      groups[0].articleIds[0] = "missing-target";
      replacePayload(copy, "article-groups.en.json", groups);
    } else {
      const journeys = JSON.parse(copy.files.get("journeys.en.json")!);
      if (kind === "journey-group") journeys[0].groupId = "missing-target";
      if (kind === "route-article") journeys.find((record: { routes: unknown[] }) => record.routes.length)!.routes[0].articleId = "missing-target";
      if (kind === "step-route") {
        const journey = journeys.find((record: { routes: unknown[] }) => record.routes.length)!;
        const step = journey.phases.flatMap((phase: { steps: { type: string }[] }) => phase.steps).find((item: { type: string }) => item.type === "article");
        step.routeIds = ["missing-target"];
      }
      replacePayload(copy, "journeys.en.json", journeys);
    }
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow(/unknown/);
  });
  it("rejects journey overlay identity injection with matching checksums", () => {
    const copy = candidate();
    const artifacts = JSON.parse(copy.files.get("journey-translations.ja.json")!);
    const artifact = artifacts.find((record: { fields: { routes: string } }) => JSON.parse(record.fields.routes).length)!;
    const routes = JSON.parse(artifact.fields.routes);
    routes[0].id = "missing-target";
    artifact.fields.routes = JSON.stringify(routes);
    replacePayload(copy, "journey-translations.ja.json", artifacts);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("unknown route, phase or condition");
  });
  it("rejects incomplete document translations even with matching checksums", () => {
    const copy = candidate();
    const records = JSON.parse(copy.files.get("annotated-document-translations.ja.json")!);
    delete records[0].fields.title;
    replacePayload(copy, "annotated-document-translations.ja.json", records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("every canonical text field");
  });
  it.each(["constructor", "versions.fake.label", "versions.fake.lifecycle"])("rejects unknown document overlay path %s", (key) => {
    const copy = candidate();
    const records = JSON.parse(copy.files.get("annotated-document-translations.ja.json")!);
    records[0].fields[key] = "unexpected";
    replacePayload(copy, "annotated-document-translations.ja.json", records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("Unknown path-keyed translation field");
  });
  it.each(["article", "glossary", "geography", "source", "rights", "current-version"])("rejects broken document %s relationships", (kind) => {
    const copy = candidate();
    const records = JSON.parse(copy.files.get("annotated-documents.en.json")!);
    const family = records.find((record: { versions: { officialVisuals: unknown[] }[] }) => record.versions.some((version) => version.officialVisuals.length))!;
    const version = family.versions.find((record: { officialVisuals: unknown[] }) => record.officialVisuals.length)!;
    if (kind === "article") family.articleId = "missing-target";
    if (kind === "glossary") family.glossaryTermIds = ["missing-target"];
    if (kind === "geography") records.find((record: { jurisdictionVariants: unknown[] }) => record.jurisdictionVariants.length)!.jurisdictionVariants[0].geographyId = "missing-target";
    if (kind === "source") version.sourceIds = ["missing-target"];
    if (kind === "rights") version.officialVisuals[0].rightsSourceId = "missing-target";
    if (kind === "current-version") family.versions.forEach((record: { lifecycle: string }) => { record.lifecycle = "future"; });
    replacePayload(copy, "annotated-documents.en.json", records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow(/unknown|current version/);
  });
  it("requires visual rights attribution to be listed in its document version", () => {
    const copy = candidate();
    const records = JSON.parse(copy.files.get("annotated-documents.en.json")!);
    const family = records.find((record: { versions: { officialVisuals: unknown[] }[] }) => record.versions.some((version) => version.officialVisuals.length))!;
    const version = family.versions.find((record: { officialVisuals: unknown[] }) => record.officialVisuals.length)!;
    const sources = JSON.parse(copy.files.get("sources.en.json")!);
    version.officialVisuals[0].rightsSourceId = sources.find((source: { id: string }) => !version.sourceIds.includes(source.id))!.id;
    replacePayload(copy, "annotated-documents.en.json", records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("sources must be included");
  });
  it.each(["article", "residence-status", "journey", "source"])("rejects broken activity %s references", (kind) => {
    const copy = candidate();
    const records = JSON.parse(copy.files.get("activity-cross-references.en.json")!);
    if (kind === "source") {
      const activity = records.find((record: { rules: { assertion?: unknown }[] }) => record.rules.some((rule) => rule.assertion))!;
      activity.rules.find((rule: { assertion?: unknown }) => rule.assertion)!.assertion.sourceIds = ["missing-target"];
    } else {
      records[0].rules[0].links[0] = { ...records[0].rules[0].links[0], kind, id: "missing-target" };
    }
    replacePayload(copy, "activity-cross-references.en.json", records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow(/unknown/);
  });
  it.each(["question", "choice"])("rejects broken activity %s conditions", (kind) => {
    const copy = candidate();
    const records = JSON.parse(copy.files.get("activity-cross-references.en.json")!);
    const activity = records.find((record: { rules: { when: unknown[] }[] }) => record.rules.some((rule) => rule.when.length))!;
    const condition = activity.rules.find((rule: { when: unknown[] }) => rule.when.length)!.when[0];
    if (kind === "question") condition.questionId = "missing-target";
    else condition.choiceIds = ["missing-target"];
    replacePayload(copy, "activity-cross-references.en.json", records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow(/unknown/);
  });
  it.each(["constructor", "rules.0.when.0.question-id", "rules.0.assertion.editorial-state", "rules.0.links.0.href"])("rejects unsupported activity overlay path %s", (key) => {
    const copy = candidate();
    const records = JSON.parse(copy.files.get("activity-translations.ja.json")!);
    records[0].fields[key] = "unexpected";
    replacePayload(copy, "activity-translations.ja.json", records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).toThrow("Unknown path-keyed translation field");
  });
  it("accepts a current partial activity overlay", () => {
    const copy = candidate();
    const records = JSON.parse(copy.files.get("activity-translations.ja.json")!);
    records[0].fields = { label: records[0].fields.label };
    replacePayload(copy, "activity-translations.ja.json", records);
    expect(() => verifyContentBundle(copy.manifest, copy.files, sha256)).not.toThrow();
  });
});
