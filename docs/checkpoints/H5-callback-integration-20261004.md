# Callback rereview / H5 / J1 preflight integration — 2026-10-04

Reviewer/integration owner: Codex. Exact reviewed callback repair
`27f791af3ea2ad4cf27d0da794a5499d79bd621b`, original relative callback `1857817`, H5 `6866b97`.
Claude code-approved Codex's read-only J1 preflight `759a4e4` against `90804bb`, reran its 16 tests and
TypeScript; its documentation was not reviewed line by line.

## Review decisions

- **Callback P2 resolved; approved.** Validation rejects raw backslashes/control characters, normalizes
  against a fixed origin, checks origin and single-leading-slash path after normalization, and returns
  normalized path/query/hash. The route independently checks the final emitted Location. Malicious dot
  segments fall back safely; ordinary destinations and exchanged cookies are preserved. Percent-encoded
  slashes/backslashes remain URL path text, not a protocol-relative Location.
- **H5 approved for local scope**, with the repaired callback included. Account, account API and auth
  paths are matched; public pages, liveness/static assets and misleading prefix paths are excluded.
  Installed Next matcher tests pass. Existing verified-identity/cookie behavior in the proxy helper is
  preserved. The new opt-in tests assert expiry/public and direct API refresh, sign-out/authorization
  and account switching; updated lifecycle checks retain import/export/delete behavior.
- **PGRST303 remains an open hosted watch item.** Claude reports no recurrence in 22 investigation
  attempts, including fresh sign-ins, PostgREST restart/schema/config reload probes, lifecycle and
  180-second-expiry direct API runs. Prior occurrences were around local restarts/JWT lifetime changes,
  but that is a possible explanation, not a proven cause. No retry/masking change was added.
  Record/report any recurrence with sanitized evidence; do not hide account/export degradation.

Claude's earlier five H5 local scenarios and temporary N4-combined six-scenario run, plus the current
investigation, remain **Claude-reported evidence**. Codex did not rerun real browser Auth/expiry here.
The fixed exact review tree includes the reviewed expected-account binding. Git confirms combined
production source/e2e/migrations/config/package inputs are identical to that tree, except the unused
read-only preflight module and its tests. This supports integration of the reported combined scope;
it does not establish new hosted/session acceptance.

## Exact and combined checks

Isolated detached LF checkout at `27f791a`, copied existing dependencies:

- Callback/helper **28 tests passed**, with H5 matcher **30 total / three files**; targeted ESLint passed.
- Restoring exact `1857817` helper/route against the new tests: **13 failed / 15 passed**. Fixed bytes
  restored in finally; worktree clean. This is Codex's negative control count (Claude reported 12).
- Initial pre-build tsc lacked generated Next PageProps types in the fresh checkout; production build
  generated them and post-build tsc passed. This was not treated as a source defect.
- `node --import tsx scripts/release-check.ts`, explicit public fixture origin, hosted settings unset:
  **13/13 checks passed**, **995 tests / 179 files**, architecture **712 modules**, editorial **479**,
  guidance **97 articles / 30 statuses**, translation/glossary no findings, build **416 generation entries**,
  post-build types/CMS exclusion/bundle boundaries (42 JS files) passed. No clean install/GitHub Actions run.

Exact-hash cherry-picks with -x on `codex/hosting-native-integration` after `f70069c`:

| Input | Integration |
| --- | --- |
| 759a4e4 | dd7d0e7 |
| 1857817 | 98ff94c |
| 27f791a | 7aed06e |
| 6866b97 | 14e21ce |

**Combined source: `14e21ceb34aa6e2ee5a4b49cc5dc0534195007c7`.**
The unreviewed J1 fake-sender harness/evidence `733c827` are excluded.

Clean detached combined checkout: all **13 release checks passed**, **1,011 tests / 180 files**,
architecture **713 modules**, same audit/build/bundle totals. With site origin unset for loopback CSP,
fresh public build and `next start --hostname 127.0.0.1 --port 34128`, full Chromium
`playwright test --reporter=line --workers=1`: **32 passed / five skipped**, 25.2 seconds.
The lifecycle and four session tests were opt-in/skipped; previous browser intermittency is not declared cured.
Owned server stopped after checks; other contributor services were untouched.
SQL did not change in this integration; earlier concurrency/
pgTAP/operator evidence was not rerun. New real J1 Auth/fake-sender evidence is separately pending review.

## Batch 1 / Stage C boundary

H1–H5 implementation and local code review are complete with this fixed combined source. Hosted gate,
actual CI/clean-install execution, real host/CDN/CSP/Auth/signing-key checks and PGRST303 watch remain open.
This is not approval to deploy or activate services.

After the exact validated documentation handoff is merged into **both** working branches and Claude
reports its receipt, the agreed Stage-C ownership table can take effect:

- Codex: `src/components/localization/localized-article.tsx` and
  `src/components/content/japan-geography-reference.tsx` for N2 renderer/component work.
- Claude: N3 finder/map/messages; Japanese source/catalog/provenance decisions and byte-exact final checks.
- Tax/training renderer handoff still needs Claude's explicit coordination, as required by
  `N2-stage-c-handoff.md`. Neither renderer is changed or implicitly transferred by this receipt.

Consumer/extraction work has not begun. Japanese component provenance must be decided by Claude before
extraction, and the first extraction must preserve byte-exact wording with Claude's checks. Earlier accepted
protected-checklist policy and practical IDs remain scoped proposals until wired and verified.
J1 harness review, final local/hosted/operator/scheduling gates and N1/N2 native acceptance remain separate.
No main merge, hosted service, real email, scheduler, Japanese artifact approval or immediate ownership transfer.

Claude approved `H3b-H5-review-integration-20261003.md` after merging exact `f70069c` as `510553e`.
Other consolidated-doc scope limits remain. This new review/integration/status record awaits documentation
review. The following documentation handoff hash is reported separately.
