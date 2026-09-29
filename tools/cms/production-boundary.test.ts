// @vitest-environment node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { findCmsMarkers } from "./production-boundary";

const root = resolve(import.meta.dirname, "../..");

// Fixture I/O (Git repositories, local servers, catalog scans) exceeded the 5 s default under full-suite parallel load; see the other CMS suites.
describe("CMS production boundary", { timeout: 30_000 }, () => {
  it("keeps CMS code out of the application source", async () => {
    // Application code must not import the CMS or share its endpoints. The build-output check is `npm run cms:check-build`.
    expect(await findCmsMarkers(root, "src", { extensions: [".ts", ".tsx", ".js", ".mjs", ".json"] })).toEqual([]);
  });

  it("does not wire the CMS into the Next.js configuration or production scripts", async () => {
    const nextConfig = await readFile(resolve(root, "next.config.ts"), "utf8");
    expect(nextConfig).not.toMatch(/tools[/\\]cms|scripts[/\\]cms/);
    const { scripts } = JSON.parse(await readFile(resolve(root, "package.json"), "utf8")) as { scripts: Record<string, string> };
    for (const name of ["build", "start", "dev"]) expect(scripts[name]).not.toMatch(/cms/);
  });
});
