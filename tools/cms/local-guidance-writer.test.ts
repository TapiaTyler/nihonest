// @vitest-environment node
import { execFileSync } from "node:child_process";
import { once } from "node:events";
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve, sep } from "node:path";
import { describe, expect, it } from "vitest";
import ts from "typescript";
import { startGitSession } from "./git-session";
import { readLocalGuidanceCatalog } from "./local-guidance-catalog";
import { saveLocalGuidanceContent } from "./local-guidance-writer";
import { createCmsServer } from "./server";

const projectRoot = resolve(import.meta.dirname, "../..");
const locationsPath = "src/data/local-guidance/locations";
const fixturePrefix = "nihonest-cms-local-guidance-";

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), fixturePrefix));
  await mkdir(resolve(root, locationsPath, ".."), { recursive: true });
  await mkdir(resolve(root, locationsPath, "kyoto"), { recursive: true });
  await writeFile(resolve(root, locationsPath, "index.ts"), 'import { prefecture as kyoto } from "./kyoto";\nexport const prefectureGuidance = [kyoto];\n');
  await cp(resolve(projectRoot, locationsPath, "kyoto", "index.ts"), resolve(root, locationsPath, "kyoto", "index.ts"));
  await cp(resolve(projectRoot, locationsPath, "kyoto", "kyoto.ts"), resolve(root, locationsPath, "kyoto", "kyoto.ts"));
  execFileSync("git", ["init", "-q"], { cwd: root });
  execFileSync("git", ["config", "core.autocrlf", "false"], { cwd: root });
  execFileSync("git", ["add", "."], { cwd: root });
  execFileSync("git", ["-c", "user.name=CMS Fixture", "-c", "user.email=cms-fixture@example.invalid", "commit", "-qm", "baseline"], { cwd: root });
  return root;
}

async function disposeFixture(root: string) {
  if (!resolve(root).startsWith(`${resolve(tmpdir())}${sep}`) || !basename(root).startsWith(fixturePrefix)) {
    throw new Error("Refusing to remove a fixture outside the temporary directory.");
  }
  await rm(root, { recursive: true, force: true });
}

describe("CMS local guidance English writer", () => {
  it("patches only supported literals in a Git fixture and rejects stale or unrelated changes", async () => {
    const root = await fixture();
    try {
      await startGitSession(root);
      const catalog = await readLocalGuidanceCatalog(root);
      expect(catalog.failures.some(({ path }) => path.includes("kyoto/kyoto.ts"))).toBe(false);
      const record = catalog.details.get("kyoto-address-registration")!;
      const neighbor = catalog.details.get("kyoto-resident-tax")!;
      const path = resolve(root, record.source.path);
      const before = await readFile(path, "utf8");
      const neighborBefore = before.slice(neighbor.source.objectStart, neighbor.source.objectEnd);
      const title = `${record.value.title} fixture clarification`;
      const actions = record.value.actions.map((action, index) => index === 0
        ? { ...action, description: `${action.description} Fixture detail.` } : { ...action });
      const input = { expectedRevision: record.revision, expectedSourceRevision: record.source.sourceRevision,
        fields: { title, actions } };
      await expect(saveLocalGuidanceContent(root, record.id, { ...input, fields: { sourceIds: [] } }))
        .rejects.toMatchObject({ status: 422 });
      expect(await readFile(path, "utf8")).toBe(before);
      const saved = await saveLocalGuidanceContent(root, record.id, input);
      expect(saved.changed).toBe(true);
      const after = await readFile(path, "utf8");
      expect(after).toBe(before
        .replace(JSON.stringify(record.value.title), JSON.stringify(title))
        .replace(JSON.stringify(record.value.actions[0]!.description), JSON.stringify(actions[0]!.description)));
      const parsed = ts.createSourceFile(path, after, ts.ScriptTarget.Latest, true) as ts.SourceFile & { parseDiagnostics: readonly ts.Diagnostic[] };
      expect(parsed.parseDiagnostics).toEqual([]);
      const refreshed = await readLocalGuidanceCatalog(root);
      expect(refreshed.failures.some(({ path }) => path.includes("kyoto/kyoto.ts"))).toBe(false);
      expect(refreshed.details.get(record.id)?.value.title).toBe(title);
      expect(refreshed.details.get(record.id)?.translation).toBe(record.translation === "missing" ? "missing" : "stale");
      expect(refreshed.details.get(neighbor.id)?.source.sourceRevision).toBe(saved.sourceRevision);
      const neighborAfter = refreshed.details.get(neighbor.id)!;
      expect(after.slice(neighborAfter.source.objectStart, neighborAfter.source.objectEnd)).toBe(neighborBefore);
      await expect(saveLocalGuidanceContent(root, record.id, input)).rejects.toMatchObject({ status: 409 });
    } finally { await disposeFixture(root); }
  });

  it("adds and removes an optional English field without editing neighboring records", async () => {
    const root = await fixture();
    try {
      await startGitSession(root);
      const first = (await readLocalGuidanceCatalog(root)).details.get("kyoto-household-waste")!;
      expect(first.value.receivingOffice).toBeUndefined();
      const added = await saveLocalGuidanceContent(root, first.id, {
        expectedRevision: first.revision, expectedSourceRevision: first.source.sourceRevision,
        fields: { receivingOffice: "Fixture municipal desk" },
      });
      expect(added.changed).toBe(true);
      const second = (await readLocalGuidanceCatalog(root)).details.get(first.id)!;
      expect(second.value.receivingOffice).toBe("Fixture municipal desk");
      const removed = await saveLocalGuidanceContent(root, first.id, {
        expectedRevision: second.revision, expectedSourceRevision: second.source.sourceRevision,
        fields: { receivingOffice: "" },
      });
      expect(removed.changed).toBe(true);
      const final = (await readLocalGuidanceCatalog(root)).details.get(first.id)!;
      expect(final.value.receivingOffice).toBeUndefined();
      expect(final.revision).toBe(first.revision);
    } finally { await disposeFixture(root); }
  });

  it("refuses a file that was already dirty when the Git session began", async () => {
    const root = await fixture();
    try {
      const path = resolve(root, locationsPath, "kyoto", "kyoto.ts");
      await writeFile(path, `${await readFile(path, "utf8")}\n// Existing work from another editor.\n`);
      await startGitSession(root);
      const current = (await readLocalGuidanceCatalog(root)).details.get("kyoto-address-registration")!;
      await expect(saveLocalGuidanceContent(root, current.id, {
        expectedRevision: current.revision, expectedSourceRevision: current.source.sourceRevision,
        fields: { title: `${current.value.title} fixture edit` },
      })).rejects.toMatchObject({ status: 423 });
      expect(await readFile(path, "utf8")).toContain("Existing work from another editor.");
    } finally { await disposeFixture(root); }
  });

  it("rejects an external file change after loading without overwriting it", async () => {
    const root = await fixture();
    try {
      await startGitSession(root);
      const record = (await readLocalGuidanceCatalog(root)).details.get("kyoto-address-registration")!;
      const path = resolve(root, record.source.path);
      const external = `${await readFile(path, "utf8")}\n// Later external edit.\n`;
      await writeFile(path, external);
      await expect(saveLocalGuidanceContent(root, record.id, {
        expectedRevision: record.revision, expectedSourceRevision: record.source.sourceRevision,
        fields: { title: `${record.value.title} fixture edit` },
      })).rejects.toMatchObject({ status: 409 });
      expect(await readFile(path, "utf8")).toBe(external);
    } finally { await disposeFixture(root); }
  });

  it("serializes simultaneous edits to different supplements in one location file", async () => {
    const root = await fixture();
    try {
      await startGitSession(root);
      const catalog = await readLocalGuidanceCatalog(root);
      const address = catalog.details.get("kyoto-address-registration")!;
      const waste = catalog.details.get("kyoto-household-waste")!;
      expect(address.source.sourceRevision).toBe(waste.source.sourceRevision);
      const before = await readFile(resolve(root, address.source.path), "utf8");
      const results = await Promise.allSettled([
        saveLocalGuidanceContent(root, address.id, {
          expectedRevision: address.revision, expectedSourceRevision: address.source.sourceRevision,
          fields: { title: `${address.value.title} simultaneous edit` },
        }),
        saveLocalGuidanceContent(root, waste.id, {
          expectedRevision: waste.revision, expectedSourceRevision: waste.source.sourceRevision,
          fields: { title: `${waste.value.title} simultaneous edit` },
        }),
      ]);
      expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
      expect(results.filter((result) => result.status === "rejected" && (result.reason as { status?: number }).status === 409)).toHaveLength(1);
      const after = await readFile(resolve(root, address.source.path), "utf8");
      expect(after).not.toBe(before);
      expect(after.includes(`${address.value.title} simultaneous edit`)).not.toBe(after.includes(`${waste.value.title} simultaneous edit`));
    } finally { await disposeFixture(root); }
  });

  it("saves through the authenticated HTTP route in a temporary Git checkout", async () => {
    const root = await fixture();
    const server = createCmsServer(root);
    try {
      server.listen(0, "127.0.0.1");
      await once(server, "listening");
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("Expected an IPv4 CMS listener.");
      const base = `http://127.0.0.1:${address.port}`;
      const session = await (await fetch(`${base}/api/session`)).json();
      const detail = await (await fetch(`${base}/api/local-guidance/kyoto-household-waste`)).json();
      const title = `${detail.value.title} fixture update`;
      const response = await fetch(`${base}/api/local-guidance/kyoto-household-waste/content`, {
        method: "PUT",
        headers: { Origin: base, "X-CMS-Token": session.token, "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: detail.revision, expectedSourceRevision: detail.source.sourceRevision, fields: { title } }),
      });
      expect(response.status).toBe(200);
      expect((await response.json()).changed).toBe(true);
      const refreshed = await (await fetch(`${base}/api/local-guidance/kyoto-household-waste`)).json();
      expect(refreshed.value.title).toBe(title);
      expect(refreshed.revision).not.toBe(detail.revision);
      expect((await readFile(resolve(root, detail.source.path), "utf8"))).toContain(JSON.stringify(title));
    } finally {
      await new Promise<void>((done, reject) => server.close((error) => error ? reject(error) : done()));
      await disposeFixture(root);
    }
  }, 20_000);
});
