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
N5 checkpoint 1 `6c7fb4d` and evidence `99b170a` are Claude-approved and integrated at tested source `5f29566`; documentation-only handoff `015c76d` is pushed. [Receipt](N5-checkpoint-1-integration-20261004.md). N5 checkpoint 2 `068b07c` switches exactly fifteen server imports and awaits review; branch-local release passed 13/13, but the full browser gate remains open with baseline-existing intermittent failures. [Consumer checkpoint](N5-metadata-consumers-20261004.md).

## Remaining work

1. Claude reviews N5 checkpoint 2 `068b07c` and its following evidence/status update; integration handoff `015c76d` documentation review is pending.
2. Resolve/explicitly disposition the browser failures recorded in the consumer checkpoint; shared e2e/finder files remain Claude-owned. Integrate checkpoint 2 by hash only after review. Claude owns direct-Next freshness enforcement and release/CMS hooks; article detail stays Claude-owned.
3. Interface metadata remains machine-translated-only Japanese, exact IDs/key parity/non-blank values and
   placeholder subsets; current web fallback semantics remain. No shared artifact-schema relaxation.
4. Tokyo labels remain canonical bilingual geography data with unchanged IDs/grouping. Source/license
   metadata stays distinct from article/artifact review and currency.
5. Final N1/N2/native acceptance and broader inline/block/MDX boundaries remain open. Web export round-trip
   parity is tested; a native renderer/UI is not. N5 checkpoint 1 is reviewed and integrated; consumer switching awaits checkpoint 2 review. Freshness wiring proceeds independently under Claude ownership.

Claude owns Japanese catalogs, source-field rules/prompts and final Japanese checks. Codex owns integration,
N1 exporter/contracts and consolidated status documentation. No main merge, activation, email or scheduling.

## N5 approval receipt

Claude approved checkpoint 1 `6c7fb4d` and evidence `99b170a`; these supersede the pending statuses above. Integrated and combined-validated at `5f29566`: release 13/13, 1,205 tests / 194 files. [Exact receipt](N5-checkpoint-1-integration-20261004.md). Consumer switching is authorized for checkpoint 2; direct-build/release/CMS freshness wiring belongs to Claude. This integration documentation awaits review.

## Latest N5 review disposition

Claude approved `068b07c`/`de12151` and adopted/documentation-approved `015c76d` as `8052468`; pending statements above are superseded. Codex approved `1dfcf38` hydration and `f65adee` typing. `41af62c` freshness requires two CMS fixes; [review record](N5-freshness-hydration-review-20261004.md). Individual exact `1dfcf38` release 14/14 and default-worker browser 35/5 pass; new combined integration stays held at 015c76d until fix review. Claude owns the fixes and later article-detail switch. This review/status documentation awaits Claude review.
