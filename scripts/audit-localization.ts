import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { TranslationArtifact } from "../src/domain/translation/translation.ts";
import { createArticleTranslationCoverageReport } from "../src/lib/editorial/localization-coverage.ts";

const projectRoot = process.cwd();
const articleDirectory = resolve(projectRoot, "content/articles");
const artifactDirectory = resolve(projectRoot, "src/data/translations/ja");

function revision(source: string): string {
  return createHash("sha256")
    .update(JSON.stringify({ source: source.replace(/\r\n?/g, "\n") }), "utf8")
    .digest("hex");
}

const articleFiles = (await readdir(articleDirectory)).filter((filename) => filename.endsWith(".mdx")).sort();
const articleSources = await Promise.all(articleFiles.map(async (filename) => {
  const source = await readFile(join(articleDirectory, filename), "utf8");
  const metadata = source.slice(source.indexOf("export const metadata"));
  const id = metadata.match(/\bid:\s*"([a-z0-9]+(?:-[a-z0-9]+)*)"/)?.[1];
  if (!id) throw new Error(`Cannot read article ID from ${filename}.`);
  return { id, source };
}));
const terminologySource = await readFile(resolve(projectRoot, "src/data/translations/ja/protected-terminology.ts"), "utf8");
const promptSource = await readFile(resolve(projectRoot, "content/translations/JAPANESE-ARTICLE-PROMPT.md"), "utf8");

function quoted(source: string, field: string, artifactPath: string): string {
  const value = source.match(new RegExp(`\\b${field}:\\s*"([^"]+)"`))?.[1];
  if (!value) throw new Error(`Cannot read ${field} from ${artifactPath}.`);
  return value;
}

function constant(source: string, name: string, artifactPath: string): string {
  const value = source.match(new RegExp(`\\b(?:export\\s+)?const\\s+${name}\\s*=\\s*"([^"]+)"`))?.[1];
  if (!value) throw new Error(`Cannot read ${name} from ${artifactPath}.`);
  return value;
}

const artifactFiles = (await readdir(artifactDirectory))
  .filter((filename) => filename === "article-translations.ts"
    || filename === "pilot-article-translations.ts"
    || (/^article-translations-.+\.ts$/.test(filename) && !filename.endsWith(".test.ts")))
  .sort();
const builderPath = resolve(artifactDirectory, "article-translation-builder.ts");
const builderSource = await readFile(builderPath, "utf8");
const sharedTerminologyRevision = constant(builderSource, "japaneseArticleTerminologyRevision", builderPath);
const sharedPromptRevision = constant(builderSource, "japaneseArticlePromptRevision", builderPath);
const artifacts = (await Promise.all(artifactFiles.map(async (filename) => {
  const artifactPath = join(artifactDirectory, filename);
  const source = await readFile(artifactPath, "utf8");
  const historicalPilot = filename === "pilot-article-translations.ts";
  const storedTerminologyRevision = historicalPilot
    ? constant(source, "terminologyRevision", artifactPath)
    : sharedTerminologyRevision;
  const storedPromptRevision = historicalPilot
    ? constant(source, "promptRevision", artifactPath)
    : sharedPromptRevision;
  const schemaArtifacts = source
    .split("translationArtifactSchema.parse({")
    .slice(1)
    .map((block) => ({
      contentKind: quoted(block, "contentKind", artifactPath),
      contentId: quoted(block, "contentId", artifactPath),
      targetLocale: quoted(block, "targetLocale", artifactPath),
      sourceRevision: quoted(block, "sourceRevision", artifactPath),
      terminologyRevision: storedTerminologyRevision,
      promptRevision: storedPromptRevision,
      reviewState: quoted(block, "reviewState", artifactPath),
      availability: quoted(block, "availability", artifactPath),
    }));
  const builderArtifacts = [...source.matchAll(/defineJapaneseArticleTranslation\(\s*"([^"]+)",\s*"([0-9a-f]{64})"/g)]
    .map((match) => ({
      contentKind: "article",
      contentId: match[1],
      targetLocale: "ja",
      sourceRevision: match[2],
      terminologyRevision: storedTerminologyRevision,
      promptRevision: storedPromptRevision,
      reviewState: "machine-translated",
      availability: "active",
    }));
  return [...schemaArtifacts, ...builderArtifacts];
}))).flat() as unknown as readonly TranslationArtifact[];

const report = createArticleTranslationCoverageReport({
  contentIds: articleSources.map(({ id }) => id),
  sourceRevisions: new Map(articleSources.map(({ id, source }) => [id, revision(source)])),
  artifacts,
  targetLocale: "ja",
  terminologyRevision: revision(terminologySource),
  promptRevision: revision(promptSource),
});

console.log(`Japanese article localization: ${report.current}/${report.total} current`);
console.log(`  Machine translated: ${report.machineTranslated}`);
console.log(`  Human reviewed: ${report.humanReviewed}`);
console.log(`  Stale: ${report.stale}`);
console.log(`  Historical stale artifacts retained: ${report.staleArtifacts}`);
console.log(`  Missing: ${report.missing}`);
console.log(`  Outdated but active: ${report.outdatedActive}`);

if (report.errors.length > 0) {
  for (const error of report.errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
}
