/**
 * Release gate for the local CMS: after `npm run build`, confirm the production output contains no CMS code or endpoint.
 * Usage: npm run build && npm run cms:check-build
 */
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { findCmsMarkers } from "../tools/cms/production-boundary";

async function main(): Promise<void> {
  const projectRoot = resolve(import.meta.dirname, "..");
  const buildDirectory = resolve(projectRoot, ".next");
  const built = await stat(buildDirectory).catch(() => undefined);
  if (!built?.isDirectory()) throw new Error("No .next build output found. Run `npm run build` first.");
  // The build cache holds inputs, not deployed output.
  const findings = await findCmsMarkers(projectRoot, ".next", { skip: (path) => path.startsWith(".next/cache") });
  if (findings.length) {
    for (const { path, marker } of findings) console.error(`${path}: contains "${marker}"`);
    throw new Error(`The production build contains CMS code (${findings.length} finding(s)).`);
  }
  console.log("The production build output contains no local CMS code or endpoints.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
