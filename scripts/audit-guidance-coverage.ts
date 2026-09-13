import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { residenceStatuses } from "@/data/residence-statuses";
import { auditGuidanceCoverage } from "@/domain/editorial/guidance-coverage-plan";
import { loadArticleSourceMetadata } from "@/lib/source-monitoring/article-source-metadata";

async function main(): Promise<void> {
  const projectRoot = process.cwd();
  const [plan, articles] = await Promise.all([
    readFile(resolve(projectRoot, "content/editorial/guidance-coverage-plan.json"), "utf8").then(JSON.parse),
    loadArticleSourceMetadata(resolve(projectRoot, "content/articles")),
  ]);
  const findings = auditGuidanceCoverage(plan, articles.map(({ id }) => id), residenceStatuses.map(({ id }) => id));
  for (const finding of findings) console.error(`[${finding.code}] ${finding.message}`);
  if (findings.length > 0) throw new Error(`Guidance coverage audit found ${findings.length} blocking issue(s).`);
  console.log(`Guidance coverage accounts for ${articles.length} articles and ${residenceStatuses.length} residence statuses.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "The guidance coverage audit could not be completed.");
  process.exitCode = 1;
});
