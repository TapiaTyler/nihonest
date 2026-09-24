/**
 * Writes the versioned public content bundle (English and Japanese articles as portable blocks, plus the plain
 * catalogs) to build/content-bundle/. The output is generated and gitignored.
 *
 *   npm run content:bundle
 */
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { buildContentBundle } from "@/lib/content/content-bundle";

async function main(): Promise<void> {
  const outputDirectory = resolve(process.cwd(), "build/content-bundle");
  const { manifest, files } = await buildContentBundle({
    articleDirectory: resolve(process.cwd(), "content/articles"),
    generatedAt: new Date().toISOString(),
  });

  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });
  for (const [path, json] of files) await writeFile(join(outputDirectory, path), json);
  await writeFile(join(outputDirectory, "manifest.json"), `${JSON.stringify(manifest, null, 1)}\n`);

  for (const file of manifest.files) console.log(`${file.path}: ${file.records} records`);
  console.log(`Catalog version ${manifest.catalogVersion.slice(0, 12)} written to ${outputDirectory}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
