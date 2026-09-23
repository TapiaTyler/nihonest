/**
 * Claude drafts of the structured guidance on residence-status pages, one isolated call per status.
 *
 *   npm run status:guidance:draft                        # all statuses without a current guidance translation
 *   npm run status:guidance:draft -- --ids professor,student
 *   npm run status:guidance:draft -- --integrate .glossary-drafts/guidance-<run>
 */
import { residenceStatuses } from "@/data/residence-statuses";
import { japaneseGlossaryTranslations } from "@/data/translations/ja/glossary-translations";
import { japaneseResidenceStatusGuidanceTranslations } from "@/data/translations/ja/residence-status-guidance-translations";
import { japaneseResidenceStatusTranslations } from "@/data/translations/ja/residence-status-translations";
import { extractGuidanceText } from "@/domain/residence-status/guidance-text";
import { readOption } from "./glossary-translation/cli-options";
import { draftOverlays, integrateOverlays, overlaySourceRevision, type OverlayItem } from "./glossary-translation/overlay-pipeline";

function items(): OverlayItem[] {
  return residenceStatuses.filter((status) => status.structuredGuidance).map((status) => {
    const record = japaneseResidenceStatusTranslations.find(({ contentId }) => contentId === status.id);
    const glossary = japaneseGlossaryTranslations.find(({ contentId }) => contentId === status.glossaryTermId);
    return {
      id: status.id,
      english: extractGuidanceText(status.structuredGuidance!),
      context: [
        `Translate the reader-facing text of the structured guidance for the residence status 「${status.japaneseName}」 (${status.englishName}) into Japanese.`,
        "Durations such as \"5 years, 3 years, 1 year, or 3 months\" become 「5年、3年、1年または3月」.",
        "## Accepted Japanese wording for this status (keep consistent)",
        `Glossary definition: ${glossary?.fields["short-definition"] ?? "none"}`,
        `Summary: ${record?.fields.summary ?? "none"}`,
        `Purpose: ${record?.fields.purpose ?? "none"}`,
      ].join("\n\n"),
    };
  });
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const all = items();
  const integrateDirectory = readOption(argv, "integrate");
  if (integrateDirectory) {
    return integrateOverlays(integrateDirectory, all, {
      path: "src/data/translations/ja/residence-status-guidance-translations.ts",
      exportName: "japaneseResidenceStatusGuidanceTranslations",
      contentKind: "residence-status",
      description: "Japanese overlays for the structured guidance on residence-status pages, keyed by guidance-text paths (src/domain/residence-status/guidance-text.ts).",
    });
  }
  const current = new Set(japaneseResidenceStatusGuidanceTranslations.map(({ contentId, sourceRevision }) => `${contentId}:${sourceRevision}`));
  const ids = readOption(argv, "ids")?.split(",");
  await draftOverlays("guidance", all.filter((item) => ids ? ids.includes(item.id) : !current.has(`${item.id}:${overlaySourceRevision(item.english)}`)));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
