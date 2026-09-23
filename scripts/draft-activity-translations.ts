/**
 * Claude drafts of the "Can I do this?" activity cross-references, one isolated call per activity.
 *
 *   npm run activity:draft                                # all activities without a current translation
 *   npm run activity:draft -- --ids add-side-work
 *   npm run activity:draft -- --integrate .glossary-drafts/activity-<run>
 */
import { activityCrossReferences } from "@/data/activity-cross-references";
import { japaneseActivityTranslations } from "@/data/translations/ja/activity-translations";
import { extractActivityText } from "@/domain/activity-cross-reference/activity-text";
import { readOption } from "./glossary-translation/cli-options";
import { draftOverlays, integrateOverlays, overlaySourceRevision, type OverlayItem } from "./glossary-translation/overlay-pipeline";

function items(): OverlayItem[] {
  return activityCrossReferences.map((activity) => ({
    id: activity.id,
    english: extractActivityText(activity),
    context: [
      `Translate the reader-facing text of the educational "Can I do this in Japan?" cross-reference for the activity "${activity.label}" into Japanese.`,
      "It separates the questions a foreign resident must investigate; it never gives an eligibility decision. Keys ending in `.prompt` are questions to the reader; `.choices.N.label` are short answer options; `.verify.N` are facts to confirm; `assertion.statement` is a rule statement that must keep its exact scope and qualifications.",
    ].join("\n\n"),
  }));
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const all = items();
  const integrateDirectory = readOption(argv, "integrate");
  if (integrateDirectory) {
    return integrateOverlays(integrateDirectory, all, {
      path: "src/data/translations/ja/activity-translations.ts",
      exportName: "japaneseActivityTranslations",
      contentKind: "activity-cross-reference",
      description: "Japanese overlays for \"Can I do this?\" activity cross-references, keyed by activity-text paths (src/domain/activity-cross-reference/activity-text.ts).",
    });
  }
  const current = new Set(japaneseActivityTranslations.map(({ contentId, sourceRevision }) => `${contentId}:${sourceRevision}`));
  const ids = readOption(argv, "ids")?.split(",");
  await draftOverlays("activity", all.filter((item) => ids ? ids.includes(item.id) : !current.has(`${item.id}:${overlaySourceRevision(item.english)}`)));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
