# Stage-C review queue — 2026-10-04

Current reviewed integration handoff: **`0da60efd968e947cd83bceb719c0d3ab28309e17`**, tested source
**`ea8ed5c3a65cccda7fa194f87369031e1c3f0e6c`**, on `codex/hosting-native-integration`.
Claude merged the exact handoff as `9ca257b`, confirmed the tree and approved its documentation.
[Latest exact receipt, fee review and combined evidence](Fee-interface-inline-integration-20261004.md).

## Completed reviews

- Earlier held queue through `fbf2c69` was approved and integrated at `500c2db`; Claude received it as
  `69756a3` and approved its documentation. [Previous record](Stage-C-reviewed-integration-20261004.md).
- Interface pack `e0836f0` and status `4935086`: Claude approved, ten tests and lint reproduced;
  integrated via `6e6b34d`. Catalogs have 775 keys; no per-message currency metadata.
- Translated inline `be231dd` and docs `4ea3432`: Claude independently approved 99 Japanese body markup
  comparisons and seven-test positive/negative control, without a full release rerun; integrated via
  `6e6b34d`. [Checkpoint](N2-translated-inline-alignment-20261004.md).
- Fee `ea2ba52`: Codex approved two en/ja parent comparisons, 58 committed focused tests, lint/architecture;
  integrated as `c77f5e3`. Report `cefaddf` reviewed and integrated as `ea8ed5c`.
- Combined source `ea8ed5c`: full release 13/13, 1,147 tests / 190 files, 721 modules, 416 static entries,
  43 browser JS files. Review attribution and skipped checks remain explicit in the latest record.

Historical records retain their original pending statements; these receipts supersede current status.
Format 10 checkpoint **`934db81f545f7cc0464ab8dbb695f8d6d6dd42fc`** awaits Claude review against `d1fef2f`.
It is outside integration. [Implementation and exact branch-local release evidence](N1-format-10-components-20261004.md):
240 focused tests / 15 files; full local release 13/13, 1,187 tests / 192 files, 724 modules, 416 entries,
43 browser JS files; eight en/ja component markup captures match after export round-trip. Disk export verified,
second generation byte-identical, 38 payload files. New evidence/status documentation also awaits review.

## Remaining work

1. Claude reviews exact format 10 checkpoint `934db81` and the following documentation-only evidence update.
2. After approval, Codex integrates only the reviewed checkpoint by hash, runs the combined gates on an LF
   checkout and shares the validated integration handoff. Both branches adopt it before dependent work.
3. Interface metadata remains machine-translated-only Japanese, exact IDs/key parity/non-blank values and
   placeholder subsets; current web fallback semantics remain. No shared artifact-schema relaxation.
4. Tokyo labels remain canonical bilingual geography data with unchanged IDs/grouping. Source/license
   metadata stays distinct from article/artifact review and currency.
5. Final N1/N2/native acceptance and broader inline/block/MDX boundaries remain open. Web export round-trip
   parity is tested; a native renderer/UI is not. N5 metadata-boundary preparation can proceed read-only while
   review waits; production implementation follows the assigned gates.

Claude owns Japanese catalogs, source-field rules/prompts and final Japanese checks. Codex owns integration,
N1 exporter/contracts and consolidated status documentation. No main merge, activation, email or scheduling.
