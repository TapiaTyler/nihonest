# N1 Stage-B FAQ, glossary and residence-status translation export

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-29.
Base: `fb5f999` (canonical identity fix, pushed; review pending).
Status: three catalog translation families implemented; review/integration pending. Stage-B coverage
and final N1 acceptance remain incomplete. This checkpoint has pending J1/N4/N1 ancestors.

## Payload and selection contracts

- Adds `faq-translations.ja.json`, `glossary-translations.ja.json` and
  `residence-status-translations.ja.json`. Each contains complete existing translation artifacts:
  source/terminology/prompt revisions, generator/model, fields, availability, review state and dates.
  Currency never promotes an artifact to human reviewed. No Japanese text or translation module changed.
- Uses the existing read-only `getActiveTranslations` selector and canonical `translationSourceFields`
  with `createTranslationSourceRevision`. Only active Japanese artifacts with a registered target and
  matching English source revision are included, in repository registration order. Missing/stale overlays
  are absent; English catalogs remain available for deliberate consumer fallback.
- New per-kind schemas validate artifact kind/locale/availability and required fields. Residence-status
  list fields must be JSON arrays of nonempty strings. The complete artifact is serialized unchanged.
- The portable verifier validates canonical `contentId` uniqueness, English target existence and source
  revision for these three families, even if a modified payload has matching file/version checksums.
  Its injected SHA-256 also implements the repository's sorted, LF-normalized source-field hash rule.
  Registration parity and successful acceptance exercise equivalence with the existing Node revision helper.
  Prompt/terminology revisions remain recorded provenance; this pass does not introduce a new invalidation
  policy or alter Claude's translation-review rules.

## Format compatibility

The expanded mandatory file set changes the format from **1 to 2** and adds `catalog-translations` as a
file kind. Format-1 consumers must reject version 2; this implementation rejects version 1 and must not
be advertised as its backwards-compatible reader. Existing eight payloads retain their representation,
ordering and serialization. Catalog version hashing retains the original ordered path/checksum rule;
the three new files intentionally change the catalog version. No native application or installed offline
catalog exists in this checkpoint; no deployed consumer is migrated or activated.

## Validation and remaining scope

- Focused fixtures cover exact canonical-registration selection and artifact preservation; missing targets,
  changed source revisions, explicit stale availability, other locales, machine/human review preservation,
  wrong kinds, missing fields, malformed arrays, canonical identity overrides and consumer target/revision rejection.
- `npm run content:bundle` wrote eleven verified files to the ignored workspace build directory: current
  Japanese FAQ **116**, glossary **236** and residence-status **30** artifacts. These are observations,
  not pinned acceptance counts. Output directory containment was checked before the regenerating command.
- TypeScript, full lint, architecture (**699 modules**) and whitespace passed with existing dependencies.
  Focused **38 tests / three files** and full **710 tests / 161 files** with four workers passed.
  Generated files also passed a separate read-from-disk acceptance run. Production build/browser/SQL and
  translation audits were not repeated; no hosted calls, email, schedule, main merge or integration occurred.

Remaining N1 families include municipality guidance/general advice, structured status guidance, localized
discovery/journeys, annotated documents, activity cross-references and native-required geography. Existing
article translations still use their earlier compact representation; full article provenance and broader
cross-catalog relationship validation remain pending. Component payloads wait for Stage C and N2 renderer
integration. Reviewed integration remains `e4fc1ff`; review exact checkpoints rather than the branch head.
