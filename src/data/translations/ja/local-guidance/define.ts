import { translationArtifactSchema, type TranslationArtifact } from "@/domain/translation/translation";

/**
 * Japanese municipality-guidance artifacts, one file per location under `local-guidance/<prefecture>/<city>.ts`,
 * mirroring `src/data/local-guidance/locations`. Each file holds only its own location's supplements, so several
 * agents can translate different locations at once without touching shared files.
 *
 * Workflow and rules: `content/translations/LOCAL-GUIDANCE-TRANSLATION.md`. Files are written by
 * `npm run local-guidance:ja -- integrate`; hand edits are allowed for corrections and survive re-integration.
 */

/** Hash of `src/data/translations/ja/protected-terminology.ts`, shared with the other structured catalogs. */
export const localGuidanceTerminologyRevision = "74c46a91ccec5c9de19e65a60b89acd0bde3f837a042c3fe08a6ce6f1899f5cf";

/**
 * Revisions of `content/translations/JAPANESE-LOCAL-GUIDANCE-PROMPT.md`, keyed by the date each took effect.
 * Artifacts keep the revision they were drafted with; add a new entry when the prompt changes.
 */
export const japaneseLocalGuidancePromptRevisions = {
  "2026-09-26": "455850164c7691fd6a8ff21600b6f6aa478228d630105cc8642aff1633f5a17f",
  "2026-09-26-r2": "38b04f51f3132122d8b63fa8f0bae6e4e73f960689d9c549c976c1b527d20f13",
} as const;

/**
 * Who drafted and who checked an artifact. Codex drafts stay `codex-drafted` until Claude checks them; Claude's own
 * pipeline drafts are reviewed by Claude before integration.
 */
export const localGuidanceGenerators = {
  "codex-drafted": "Drafted by Codex; not yet checked by Claude.",
  "codex-drafted-claude-reviewed": "Drafted by Codex and checked, and corrected where needed, by Claude.",
  "claude-code-claude-reviewed": "Drafted by the Claude pipeline and reviewed by Claude.",
} as const;
export type LocalGuidanceGenerator = keyof typeof localGuidanceGenerators;

export type LocalGuidanceTranslationEntry = Readonly<{
  supplementId: string;
  /** `createTranslationSourceRevision` over `translationSourceFields["local-guidance-supplement"]` of the English supplement. */
  sourceRevision: string;
  generator: LocalGuidanceGenerator;
  model: string;
  promptRevision: string;
  generatedAt: string;
  /** Path-keyed Japanese text with exactly the English supplement's keys. */
  fields: Readonly<Record<string, string>>;
}>;

export type LocationTranslations = Readonly<{
  locationId: string;
  entries: readonly LocalGuidanceTranslationEntry[];
  artifacts: readonly TranslationArtifact[];
}>;

export function defineLocalGuidanceTranslations(locationId: string, entries: readonly LocalGuidanceTranslationEntry[]): LocationTranslations {
  const seen = new Set<string>();
  const artifacts = entries.map((entry) => {
    if (seen.has(entry.supplementId)) throw new Error(`Duplicate Japanese artifact for ${entry.supplementId} in ${locationId}.`);
    seen.add(entry.supplementId);
    if (!(entry.generator in localGuidanceGenerators)) throw new Error(`Unknown generator "${entry.generator}" for ${entry.supplementId}.`);
    return translationArtifactSchema.parse({
      schemaVersion: 1,
      contentKind: "local-guidance-supplement",
      contentId: entry.supplementId,
      sourceLocale: "en",
      targetLocale: "ja",
      sourceRevision: entry.sourceRevision,
      terminologyRevision: localGuidanceTerminologyRevision,
      promptRevision: entry.promptRevision,
      generator: { id: entry.generator, model: entry.model },
      fields: entry.fields,
      availability: "active",
      reviewState: "machine-translated",
      generatedAt: entry.generatedAt,
    });
  });
  return { locationId, entries, artifacts };
}
