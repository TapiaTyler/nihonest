import { resolve } from "node:path";
import { auditEditorialState } from "@/domain/editorial/editorial-review";
import { loadEditorialReviewRecords, loadEditorialTargets } from "@/lib/editorial/editorial-catalog";

async function main(): Promise<void> {
  const projectRoot = process.cwd();
  const [targets, records] = await Promise.all([
    loadEditorialTargets(projectRoot),
    loadEditorialReviewRecords(resolve(projectRoot, "content/editorial-reviews")),
  ]);
  const findings = auditEditorialState(targets, records, new Date().toISOString().slice(0, 10));
  for (const finding of findings) console.error(`[${finding.code}] ${finding.message}`);
  if (findings.length > 0) throw new Error(`Editorial audit found ${findings.length} blocking issue(s).`);
  console.log(`Editorial audit passed for ${targets.length} content records and ${records.length} approval records.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "The editorial audit could not be completed.");
  process.exitCode = 1;
});
