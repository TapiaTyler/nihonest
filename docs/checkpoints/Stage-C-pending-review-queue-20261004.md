# Stage-C pending review queue — 2026-10-04

Consolidated handoff is held until the user requests it after Claude's usage reset. This record retains the
exact checkpoints, review scope and coordination requests; it is not a review approval or integration gate.
The designated integration branch remains `codex/hosting-native-integration` at `1a4ab65` (reviewed source
`4372d4a`). Working-branch checkpoints below stay outside integration until their reviews are complete.

## Handoff and checkpoint queue

| Item | Exact review input / base | Status and evidence |
| --- | --- | --- |
| Reviewed English v2 + N3 integration | `1a4ab65bc24161d0cd8db68c408f09a33d893735`; source `4372d4a` | Pushed; Claude receipt not yet reported. Reviewed source release 13/13, 1,028 tests / 181 files, 716 modules, 416 entries. N3 four markup comparisons, 108 message comparisons and 14 focused tests passed. |
| Three-renderer extraction | `f9681f9b7b510bdf2e6dc9091c39e8e82a20ad89` against `ded19b4` | Awaiting Claude independent en/ja parent-versus-extraction markup parity review. Six fixed parent snapshots match; 48 focused tests; release 13/13, 1,037 tests / 182 files. |
| Consolidated extraction status | `b0a3a864be9ddca465562dacf9d4c16092cae662` against `23ece61` | Documentation-only update; pending review. Includes deduplication of identical preparation history. |
| N1 component inventory | `b8e37f1b280d692ffebaf6484809557ae07cca2b` against `b0a3a86` | Documentation only; pending review. In-memory format-9 generation/integrity, en/ja component order, guide/source references and region/map coverage passed. |
| Numeric fee contract preparation | `c72bcd216eaacd317643e48f9d8e564f45e89fb9` against `b8e37f1` | Pending Claude review. Only new domain contract/calculation and tests plus record. 39 focused tests (37 new, two existing), types, targeted lint and architecture 717 passed. No canonical data, renderer, translation or export change. |
| Orientation region/map contract preparation | `dc9762991a89ad658f76f9f8d7839a47a3f3067d` against `97159da` | Pending Claude review. Standalone pure schemas/coverage validation only; 44 tests / two files, exact canonical JSON preservation, types, targeted lint and architecture 718 passed. Existing data, map/finder code, translations and exporter unchanged. |
| Component export/provenance proposal | `4fea7e9390064bfda947011fbde7efdec5561841` against `fe54e32` | Documentation only; pending review. Candidate 12 additions / format 10, registration/composition coverage and provenance decisions. Current format 9 / 28 files remains deterministic; raw interface artifact-key incompatibility recorded. No wiring or format change. |
| Finder projection/fallback audit | `f7968660fdfe94c7914483474addc1326eda54ab` against `6ae03cc` | Documentation only; pending review. Exact full payload reconstruction from existing bundle, 784 title-field parity, 16 existing tests / five files passed. Three Tokyo grouping labels added to coordination scope; no finder/catalog change. |
| Fee/map contract self-review | `393d324f7c5c8b0caa5b7f606a838ea84aa42c11` against `9a7a158` | Documentation only; Codex implementer review, no required fixes. 83 tests / five files, 2,002 geometry, 112 exact-arithmetic and 17 additional boundary probes passed. Claude independent review still required. |
| J1 current local acceptance status correction | `09748cafa44df08ed20dd45b3fbb3193e8aab78f` against `60e6591` | Documentation only; pending review. Operations/refactor current status reconciled to reviewed local evidence; scoped operator/hosted/scheduling gates retained. Three no-I/O help commands passed; no real acceptance rerun. |
| J1 operator reproduction harness | `832d9c7429c46ade2693bdc757ccf64b5f76f8bf` against `58bbc57` | Pending Claude review. New exact-source disposable PostgreSQL harness, 59 real assertions against reviewed `1a4ab65`; rehearsal negative control detected; cleanup verified. No production SQL/runtime change or real-row authorization. |

Records to include in the eventual documentation review:

- [N3 and English v2 integration](N3-English-v2-integration-20261004.md).
- [Three-renderer extraction](N2-component-renderer-extraction-20261004.md).
- [N1 Stage-C component inventory](N1-stage-c-component-inventory-20261004.md).
- [Numeric fee contract preparation](N1-numeric-fee-contract-preparation-20261004.md).
- [Orientation region/map contract preparation](N1-orientation-map-contract-preparation-20261004.md).
- [Component export/provenance proposal](N1-component-export-proposal-20261004.md).
- [Finder projection/fallback audit](N1-finder-binding-audit-20261004.md).
- [Fee/map contract self-review](N1-fee-map-contract-self-review-20261004.md).
- [J1 current local acceptance status](J1-local-acceptance-status-20261004.md) and corrected operations guide.
- [J1 repository-backed operator reproduction](J1-operator-reproduction-20261004.md).
- Consolidated `docs/refactor.md` / `docs/ROADMAP.md` updates and this queue; earlier limited documentation
  approvals remain limited. The Stage-C artifact/J1 record was approved and its two corrections applied.

## Claude-owned requests retained

1. Extract the existing selector's private validity rules unchanged into a pure translation-domain helper:

   ```ts
   areArticleComponentTranslationFieldsValid(
     component: ArticleComponentSource,
     fields: Readonly<Record<string, string>>,
   ): boolean
   ```

   Proposed file: `src/domain/translation/article-component-translation-fields.ts`. The web selector delegates
   to it; no catalog, Node hash, React/Next or `server-only` dependency belongs in the helper. Preserve exact
   keys, empty suffixes, untrimmed values, practical grammar/label/body and ordered links. Selection order
   stays unchanged. Codex reviews the exact helper checkpoint before bundle consumption.
2. Confirm fee-copy Japanese provenance and renderer/data ownership, or take the fee-copy extraction as a
   Claude-owned checkpoint. Current preparation uses only the existing numeric record; it assigns no
   translation or editorial approval and leaves the existing helper/types/renderer unchanged.
3. Agree catalog/artifact treatment of the four national and seven general abbreviated finder guide labels,
   preserving role-specific wording and targets. These labels were outside N3's migrated message groups.
4. Review proposed complete file set/format transition and component provenance bindings before final N1
   wiring. Two unused geography composition/alias registrations still require explicit coverage.

5. Decide interface-pack provenance/currency representation: plain catalog strings are not full artifacts,
   and 550 current message IDs do not fit the artifact field-key grammar. Preserve public IDs; no shared
   schema relaxation or invented generation metadata is assumed. See the export proposal.
6. On Claude's next translation-report touch, refresh its finder section: it still points to the removed
   `prefecture-finder-messages.ts` and older guide-label module location. N3 messages now live in the interface
   catalogs, and abbreviated guide labels remain in `src/lib/content/prefecture-finder-guides.ts`. Codex
   leaves that Claude-owned report unchanged.

7. Decide provenance/catalog treatment of the three Tokyo area labels in `tokyo-areas.ts` (special wards,
   Tama, islands), in addition to the eleven guide labels. They are not N3 interface keys. Keep the stable
   group IDs and code-based grouping; the unrepresented island group remains a supported dependency.

## Work boundaries while waiting

Independent read-only audits and standalone numeric/data contracts can continue within Codex ownership.
Dependent renderer/export adoption waits for reviewed exact integration. Japanese catalogs, source-field
rules, prompts, finder/map implementation and Claude's worktree remain under Claude's ownership. No
consolidated prompt is sent until requested. No main merge, hosted activation, real email or scheduling.
