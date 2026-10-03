# Stale Playwright repair review and integration — 2026-10-03

Implementer: Claude. Reviewer/integration owner: Codex.
Reviewed exact commit: `888c7a0bd55de8c07683da1999fa4db16610099f`;
parent: `93e44b4a04e42ea45a4ce17767afebb6d0b85649`.
**Review: approved; no blocking findings.**
Integrated by exact-hash cherry-pick (-x) as `ffdeef634e4cf14c91b1ef75052b104de217bb21`
on `codex/hosting-native-integration`, after validated handoff `29fe06f`.
Only `e2e/home.spec.ts` and `e2e/prefecture-finder.spec.ts` changed in that integration.
The following documentation handoff commit is reported separately.

## Review reasoning

The 42-insertion/35-deletion diff updates stale accessible names/content expectations while retaining
query forwarding, route-aware navigation, glossary/status navigation, keyboard selection, mobile control
sizes/overflow and saved-location isolation. Status filtering uses the displayed catalog count, requires a
strict subset and matches the number of rendered cards. Prefecture filtering tests option counts rather
than the removed match-count announcement and still checks the no-match message/recovery.

The old unresearched-ward navigation scenario is unreachable: finder data deliberately offers researched
municipalities only. The replacement checks that jp-01101 is not offered and that its direct ID URL does
not establish linked guidance. Existing local-guidance-panel fixtures retain municipal general-advice
coverage, including Chofu. This is a changed scenario, not proof of browser-level unlisted-municipality
fallback. No content, translation, runtime, diagnostic, timeout or retry change.

## Independent checks

A fresh detached **LF** checkout at exact `888c7a0`, copied dependencies (not a clean install), was built
with Supabase/account/email/AWS settings blanked, a fixture HTTPS origin and telemetry disabled.
Production build: **415 pages**, detail families SSG. Post-build TypeScript, targeted ESLint and whitespace
passed; the checkout remained tracked-clean.

- Full Playwright Chromium/Chrome suite against that production build, default **eight workers**, line
  reporter: **32 passed / 1 skipped**, 10.9 seconds. The opt-in account/Supabase lifecycle test was skipped;
  RUN_SUPABASE_E2E was disabled. The server listened only on 127.0.0.1.
- Combined source `ffdeef6`: **32 passed / 1 skipped**, default eight workers, 11.8 seconds. Combined types,
  targeted spec lint and whitespace passed; validation checkout remained clean.
- The combined run reused the isolated `b09cd28` production build. Git verified no source difference
  outside docs/e2e between that build source and `ffdeef6`; no second combined build is claimed.
- Neither independent run reproduced ERR_ABORTED/frame-detached navigation. This does not establish that
  the earlier transient is impossible. Only the expected color-environment warnings appeared.
- Claude's reported before/after baseline remains attributed to Claude: **14 failed / 10 passed before**;
  full **32 passed / 1 skipped after**, twice, plus repeated finder/home checks. Codex did not rerun the
  failing pre-repair baseline or those stress repetitions.
- Full Vitest/lint/architecture/content/translation/bundle gates were not repeated for this two-spec change;
  the prior combined `b09cd28` gate supplies their unchanged implementation evidence. No hosted account,
  real SQL, real email, manual UI session, dependency install or service activation.

Both temporary loopback servers were stopped after verification. No other contributor checkout was changed.

## Handoff and remaining gates

Claude reports merging exact `29fe06f` into its branch as `f7c21a0` and pushing. The documentation delta
`29b212c..29fe06f` is approved, including the integration receipt/operator record/queue/ROADMAP/refactor.
Earlier limitations on unread historical records still stand. This new consolidated record needs reciprocal
documentation review; the stale Playwright repair is now code-reviewed/integrated, not pending implementation.

J1 real PostgreSQL/Supabase/pgTAP/concurrency/Auth/fake-sender and backlog/local-target gates remain open.
N4/H5 authenticated binding and hosted checks remain open. Stage-C renderer/data handoff and Japanese
component provenance/byte-exact checks remain open. Claude retains H4/H5/H3b. Codex's next independent
checkpoint is the read-only revision-key ordering acceptance test, without translation revision-code edits.
The reported exact integration handoff should be merged into both working branches before dependent work.
No main merge or activation.
