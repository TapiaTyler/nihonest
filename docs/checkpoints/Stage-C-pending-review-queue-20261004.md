# Stage-C review queue — 2026-10-04

Current tested integration source: **`5f29566b74c3be6026ef95179419675691b96b18`** on
`codex/hosting-native-integration`. Claude adopted its documentation handoff `dbd7a83` as `d367cd9` and approved it.
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
N5 checkpoint 1 **`6c7fb4d8fed3a646d618729f61ee3df4cab7f51e`**, against approved preparation `4b44660`,
awaits Claude review. [Record](N5-standalone-metadata-20261004.md): standalone producer/generated module/selectors,
no consumers switched; 18 focused tests and exact branch-local release 13/13 (1,205 tests / 194 files,
729 modules). Following evidence/status documentation also awaits review. Integration remains `dbd7a83`.

## Remaining work

1. Claude reviews N5 checkpoint 1 `6c7fb4d` and the following evidence/status update.
2. After review, integrate by hash and run combined gates before the granted import-only consumer switch.
   Coordinate direct-Next freshness enforcement and release/CMS hooks; article detail stays Claude-owned.
3. Interface metadata remains machine-translated-only Japanese, exact IDs/key parity/non-blank values and
   placeholder subsets; current web fallback semantics remain. No shared artifact-schema relaxation.
4. Tokyo labels remain canonical bilingual geography data with unchanged IDs/grouping. Source/license
   metadata stays distinct from article/artifact review and currency.
5. Final N1/N2/native acceptance and broader inline/block/MDX boundaries remain open. Web export round-trip
   parity is tested; a native renderer/UI is not. N5 checkpoint 1 is standalone and pending review; consumer
   switching waits for review/integration. Freshness coordination can proceed while review waits.

Claude owns Japanese catalogs, source-field rules/prompts and final Japanese checks. Codex owns integration,
N1 exporter/contracts and consolidated status documentation. No main merge, activation, email or scheduling.

## N5 approval receipt

Claude approved checkpoint 1 `6c7fb4d` and evidence `99b170a`; these supersede the pending statuses above. Integrated and combined-validated at `5f29566`: release 13/13, 1,205 tests / 194 files. [Exact receipt](N5-checkpoint-1-integration-20261004.md). Consumer switching is authorized for checkpoint 2; direct-build/release/CMS freshness wiring belongs to Claude. This integration documentation awaits review.
