# Fee copy, interface packs and translated inline integration — 2026-10-04

Codex integration owner/reviewer. Tested combined source:
**`ea8ed5c3a65cccda7fa194f87369031e1c3f0e6c`**.
Subsequent consolidated status commit changes documentation only and awaits Claude review.

## Claude receipts and approvals

Claude merged exact `500c2db` as `69756a3`, checked the integrated code and approved its documentation,
including Stage-C-reviewed-integration-20261004.md. Claude approved interface pack `e0836f0` against
`059cbd1`, ran its ten tests against 775-key catalogs and targeted lint, and approved status `4935086`.

In the subsequent response, Claude approved translated inline `be231dd` against `4935086` and docs
`4ea3432`. Independent verification covered all 99 Japanese artifact bodies, including two non-current,
reported 446,448 characters, with byte-identical old/new output using placeholder components. Claude
reproduced seven new tests passing on the new renderer and failing on the old one. Parser-limit throws,
approximately 1.3 KB gzip increase and unchanged external-link attributes were accepted within scope.
Claude did not rerun the full release at `be231dd`. Previous review limits remain limited.

## Exact fee review

Codex approves **`ea2ba526a4de72d15ffaac8fb4770b7f5e7eaea1`** against `69756a3`, with no blocking findings.

- The new English v2 fee source has 19 messages in fixed display order, including labels derived from the
  domain period inventory. Strict schema rejects blank/unknown/missing/duplicate/reordered records and
  recognized placeholders outside the nine declared names. Brace patterns follow the declared word grammar;
  this is not arbitrary templating or HTML. The filler reads only own supplied properties.
- Dates and amounts come from the canonical numeric record, with explicit en/ja formatting. The existing
  online-total implementation is unchanged and checked against the domain calculation. Formatting helpers
  expect validated domain inputs; future bundle consumers must validate numeric data before use.
- Source fields enumerate messages in display order. Fee Japanese validation requires exact field keys,
  non-blank values and exactly the English placeholder set; reordering is allowed. Prior rules remain.
- The fourth artifact preserves machine-translated state and matches its canonical English revision.
  No human review or per-message currency is invented. The renderer applies the whole current artifact,
  otherwise renders English copy, amounts and dates together with lang=en. Locale-specific heading IDs
  remain stable for the requested locale.
- Data period/band types now import the domain owner through type-only imports and compatible re-exports.
  The prior duplicate period inventory is removed without changing numeric values.
- Codex approves Claude-owned report `cefaddfd0e79206abfe73991378cf30d12e8a737` for accurate fee-copy
  provenance, source-field and placeholder documentation. Codex edited no catalogs/shared translation rules.

Review used isolated LF worktree `fee-review-ea2ba52` at exact parent then checkpoint, with an existing
dependency junction for focused tests only. Six committed test files passed **58 tests** (copy, numeric,
renderer, validator, selector/artifact and contract suites). The temporary parity probe also passed one
test; **59 / seven files** includes that probe, not 59 committed tests. Targeted ESLint and architecture
720 passed there; types were checked by the combined post-build gate.

Two complete en/ja static strings at exact parent/checkpoint are byte-identical, including table values,
labels, caption, IDs, footer and spacing. Captures total **10,181 UTF-8 bytes** (en 4,836; ja 5,345), differing
slightly from Claude's reported 10,188 count. The equality result is independently established; no cause
for that count discrepancy is claimed. Probe removed and review checkout ended clean. No independent
browser run or separate exact-fee full release was claimed.

## Integration and combined gates

From `500c2db` on `codex/hosting-native-integration`:
- Merge exact fully reviewed `4ea3432` as `6e6b34d`, including approved interface/inline and status commits.
- Cherry-pick exact fee `ea2ba52` as `c77f5e3`.
- Cherry-pick exact report `cefaddf` as `ea8ed5c`.

No conflicts or unreviewed source included. Production J1 runtime/domain/SQL/command inputs remain
unchanged; real notification acceptance was not rerun.

The owned LF validation checkout `stage-c-validation-9b5d937` was clean before checkout to exact `ea8ed5c`,
with zero CRLF files and locally copied existing dependencies. Cleared all Supabase/AWS/SES/email/public
settings, delivery false, public origin https://nihonest.invalid. Command:

`npm run release:check -- --target local`

**13/13 passed in one invocation**, **1,147 tests / 190 files**, architecture **721 production modules**,
editorial/coverage/localization/article/glossary audits, production **416 static entries**, post-build
TypeScript, CMS exclusion and **43 browser JS files**. Article initial JS remains 826.2 KB raw / 209.5 KB
gzip (-9); no guidance/source registry in any browser file or map geometry in entries. Validation tree
ended clean; whitespace passed. No clean install, hosted/CI/browser/Auth/SQL/provider rerun or new service.

## Next checkpoint

The fee review prerequisite for format 10 is satisfied. Bring this exact validated integration handoff into
both branches before dependent work; Codex can then implement the agreed ten additions / 38-file format.
Use all four component owners/current artifacts, reviewed interface-pack schema, numeric/region/map contracts,
registered compositions/aliases and existing provenance. Do not revive the dropped component-copy files
or invent interface currency, artifact generation metadata or source approvals.

Final component/native acceptance, broader MDX/block-grammar boundaries and hosted/operator/scheduling
gates remain open. No main merge, hosted activation, real email or scheduler.
