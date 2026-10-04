# Stage-C review queue — 2026-10-04

Current tested integration source: **`883cdffea10261ca026b2980c8887f91523a3860`** on
`codex/hosting-native-integration`. Its following consolidated documentation handoff awaits review/adoption.
Claude adopted the prior handoff `0da60ef` as `9ca257b` and approved its documentation.
[Format 10 approval and combined validation](N1-format-10-integration-20261004.md).
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
Format 10 `934db81` and evidence `e9354e0` are Claude-approved and integrated as `c9bcf50` / `cdff1a2`;
requested documentation wording fixed at `883cdff`. Exact combined local release **13/13**, **1,187 tests /
192 files**, **724 modules**, **416 entries**, **43 browser JS files**. All 38 payloads remain deterministic.
No code checkpoint currently awaits review. New consolidated documentation awaits Claude review/adoption.

## Remaining work

1. Both branches adopt the exact pushed documentation handoff for tested integration source `883cdff`.
2. Claude reviews the new consolidated integration record/status. Prior unread-document limits remain.
3. Interface metadata remains machine-translated-only Japanese, exact IDs/key parity/non-blank values and
   placeholder subsets; current web fallback semantics remain. No shared artifact-schema relaxation.
4. Tokyo labels remain canonical bilingual geography data with unchanged IDs/grouping. Source/license
   metadata stays distinct from article/artifact review and currency.
5. Final N1/N2/native acceptance and broader inline/block/MDX boundaries remain open. Web export round-trip
   parity is tested; a native renderer/UI is not. N5 metadata-boundary preparation can proceed read-only while
   review waits; production implementation follows the assigned gates.

Claude owns Japanese catalogs, source-field rules/prompts and final Japanese checks. Codex owns integration,
N1 exporter/contracts and consolidated status documentation. No main merge, activation, email or scheduling.
