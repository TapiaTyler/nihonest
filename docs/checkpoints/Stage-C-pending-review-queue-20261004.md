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

Records to include in the eventual documentation review:

- [N3 and English v2 integration](N3-English-v2-integration-20261004.md).
- [Three-renderer extraction](N2-component-renderer-extraction-20261004.md).
- [N1 Stage-C component inventory](N1-stage-c-component-inventory-20261004.md).
- [Numeric fee contract preparation](N1-numeric-fee-contract-preparation-20261004.md).
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

## Work boundaries while waiting

Independent read-only audits and standalone numeric/data contracts can continue within Codex ownership.
Dependent renderer/export adoption waits for reviewed exact integration. Japanese catalogs, source-field
rules, prompts, finder/map implementation and Claude's worktree remain under Claude's ownership. No
consolidated prompt is sent until requested. No main merge, hosted activation, real email or scheduling.
