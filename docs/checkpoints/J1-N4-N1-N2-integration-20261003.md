# Reviewed J1/N4/N1/N2 preparation integration — 2026-10-03

Integration owner: Codex. Code reviewer: Claude. Reviewed input:
`29b212c1eb7340fabe975de5d44fcb60a1fcb343`, containing the 26 checkpoints through
`185add75b5ed86e3d788bc08b434dfae75e7b6e6` listed in [the queue](PENDING-REVIEW-QUEUE.md).
Integrated source: `b09cd2833855018bcf81d08130c1a8a17e1b2959` on
`codex/hosting-native-integration`, a conflict-free exact-hash merge into previous integration `e4fc1ff`.
Its tree is identical to the reviewed queue input. The following documentation commit is reported separately.

**Status: code reviewed/integrated; combined local checks passed. Final acceptance remains open.**
No main merge, hosted service, real job, schedule or email activation.

## Review receipt and limits

Claude reviewed exact per-commit code diffs and independently tested snapshot `185add7` in a detached LF
checkout. All four groups are approved for their scope: J1's six commits, N4's two, N1's twelve code
commits plus documentation-only `2c36708`, and N2's five. The queue `29b212c` is approved.
N1 per-family schemas were spot-checked with reliance on tests; this is not native-client acceptance.

Documentation approval is limited. Claude reports the older `b494ed0..e4fc1ff` consolidated delta approved.
Explicitly read records/sections include J1 database authority, lease budget, command, N1 integrity and
translation sections, and N2 handoff; N1 rejection-review documentation `2c36708` and queue are approved.
Other checkpoint records were not read line by line. Do not mark all later consolidated documentation
approved. This new integration/status record also awaits reciprocal documentation review.
Historical checkpoint records keep their original status/counts; this receipt supplies current status.

## Combined verification at b09cd28

A fresh detached checkout at the exact integrated source, outside contributor worktrees, had **zero tracked
CRLF files**, no inherited `.env.local`, and copied existing dependencies. Node 24.21.0 / Next 16.3.4;
not a clean install. A wrapper blanks NEXT_PUBLIC/Supabase/email/AWS settings, disables telemetry and
supplies a fixture HTTPS site origin; job preflight uses dummy server settings and disabled email.

- Full Vitest with four workers: **933 tests / 174 files passed**. Existing jsdom navigation diagnostic
  appeared without a failure. Full ESLint, post-build TypeScript and architecture (**709 modules**) passed.
- Production configuration preflights: public-only web and job-only dummy configuration passed.
- Public-only production build: **415 pages**; article/status/journey detail families remain SSG.
  CMS exclusion passed. All **42 browser scripts** (24 entry, 18 async/runtime) passed the boundary checker.
- Async map artifact probes: appended a canonical guidance marker, then all **1,607 unique source URLs**;
  each checker run exited 1 with the expected async violation. Original bytes restored in finally and
  checked identical; the restored checker passed again. No tracked source was modified.
- Content generation: **format 9 / 28 files**, unchanged catalog version
  `160b2acf9368dd4fce2855016fbfc496a8d69883b637c969b4895398585f86d2`.
  Independent disk inventory, per-file UTF-8 SHA-256/count, ordered catalog digest and reader acceptance passed.
- Editorial audit: **479 content / 0 approval records**, passed. Article translation check: **97 articles,
  zero findings**; glossary consistency: 97 articles/Japanese catalogs, zero findings. These consistency
  checks neither create approvals nor establish human translation review.
- Command help: usage/exit 0. With job settings blank: one sanitized configuration-error JSON line,
  setting names NEXT_PUBLIC_SUPABASE_URL/SUPABASE_SECRET_KEY, expected exit 1, no service construction.
- Validation checkout remained tracked-clean; whitespace passed. No package/lock change or fresh install.

No Playwright/manual UI, hosted account/cross-device, real PostgreSQL 17/Supabase, pgTAP/concurrency,
Auth/PostgREST or fake-sender integration test was run in this gate. No embedded SQL rerun is claimed.
Claude retains the stale Playwright repair and H4/H5/H3b work. Local combined validation is not final
hosting/native/notification acceptance.

## Follow-ups and final acceptance gates

| Area | Required follow-up / owner |
| --- | --- |
| J1 real database | Isolated PostgreSQL 17/Supabase pgTAP (authority fixture: 29 assertions), competing claims, post-lock expiry, Auth/PostgREST and fake-sender acceptance. Codex prepares; no services authorized by this record. |
| J1 local target | Command remains production-only. Acceptance must deliberately use the service's explicit local target or a separately reviewed command/harness; do not weaken production validation. Codex. |
| J1 exhausted backlog | Nonzero exhausted counts make every later run exit 1 while rows remain. Define an acknowledge/resolve operating procedure or reviewed distinct exit behavior before scheduling. No automatic reset/requeue/delete. Codex. |
| J1 uncertain send | SES timeouts can have uncertain acceptance; normal retry can duplicate. Keep the documented recovery limit and investigate provider acceptance before manual requeue. |
| N4/H5 | Web transport still ignores expected account ID. Claude coordinates authenticated request binding with Codex-owned coordinator/provider; combined refresh/switch/sign-out/navigation and hosted cross-device checks remain open. |
| N1 revision key ordering | Add a corpus test proving current localeCompare field-key order equals code-unit order, or verify during the Hermes spike. Codex may add read-only acceptance tests; existing translation revision code stays Claude-owned. |
| N1/N2 Stage C | Batch-1 completion and explicit renderer/component file handoff, component extraction/payloads, rendered/export parity and final acceptance remain open. Protected checklist policy and proposed practical IDs are accepted as proposals, not implemented consumers. |
| Japanese component provenance | Before extraction, agree machine-translated artifact versus human-authored editorial status and surface labeling. Claude owns that decision and byte-exact Japanese wording check. Version-1 bilingual component contracts alone carry no provenance/review state. |
| Documentation | Preserve the receipt's scope limits; remaining records and this consolidated update still need documentation review. |

Codex will report/push the documentation handoff commit whose implementation tree matches this validated
source and bring it into `codex/hosting-native-refactor`. Claude should merge that **exact reported hash**
into `claude/hosting-readiness` before depending on it. This record transfers no Stage-C file ownership.
