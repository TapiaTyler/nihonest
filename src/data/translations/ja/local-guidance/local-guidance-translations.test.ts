import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { localGuidanceLocations } from "@/data/local-guidance";
import { checkLocalGuidanceTranslation } from "@/domain/translation/local-guidance-translation-checks";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";
import { japaneseLocalGuidancePromptRevisions, localGuidanceGenerators, localGuidanceTerminologyRevision } from "./define";
import { japaneseLocalGuidanceLocationTranslations, japaneseLocalGuidanceTranslations } from "./index";

const fileRevision = (path: string) => createTranslationSourceRevision({ source: readFileSync(resolve(process.cwd(), path), "utf8") });

describe("Japanese municipality guidance translations", () => {
  it("has one registered file per English location", () => {
    // `npm run local-guidance:ja -- sync` creates these; a new English location needs a sync before it can be translated.
    expect(japaneseLocalGuidanceLocationTranslations.map(({ locationId }) => locationId).sort())
      .toEqual(localGuidanceLocations.map(({ geography }) => geography.id).sort());
  });

  it("uses the current terminology and a recorded prompt revision", () => {
    expect(localGuidanceTerminologyRevision).toBe(fileRevision("src/data/translations/ja/protected-terminology.ts"));
    expect(Object.values(japaneseLocalGuidancePromptRevisions)).toContain(fileRevision("content/translations/JAPANESE-LOCAL-GUIDANCE-PROMPT.md"));
    const known: readonly string[] = Object.values(japaneseLocalGuidancePromptRevisions);
    for (const artifact of japaneseLocalGuidanceTranslations) expect(known).toContain(artifact.promptRevision);
  });

  it("keeps every artifact current, complete, and in its own location's file", () => {
    const problems: string[] = [];
    for (const { locationId, entries } of japaneseLocalGuidanceLocationTranslations) {
      const location = localGuidanceLocations.find(({ geography }) => geography.id === locationId)!;
      for (const entry of entries) {
        expect(Object.keys(localGuidanceGenerators)).toContain(entry.generator);
        const supplement = location.supplements.find(({ id }) => id === entry.supplementId);
        if (!supplement) { problems.push(`${entry.supplementId}: not a supplement of ${locationId}`); continue; }
        const english = translationSourceFields["local-guidance-supplement"](supplement);
        // A stale artifact means the English changed: redraft it with `npm run local-guidance:ja -- worksheet` or `draft`.
        if (entry.sourceRevision !== createTranslationSourceRevision(english)) problems.push(`${entry.supplementId}: stale`);
        for (const issue of checkLocalGuidanceTranslation(english, entry.fields)) {
          if (issue.level === "error") problems.push(`${entry.supplementId} ${issue.key}: ${issue.message}`);
        }
      }
    }
    expect(problems).toEqual([]);
    expect(japaneseLocalGuidanceTranslations.every(({ contentKind, reviewState }) => (
      contentKind === "local-guidance-supplement" && reviewState === "machine-translated"
    ))).toBe(true);
  });
});
