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
    expect(() => verifyContentBundle({ ...bundle.manifest, formatVersion: 2 }, bundle.files, sha256)).toThrow();
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
});
