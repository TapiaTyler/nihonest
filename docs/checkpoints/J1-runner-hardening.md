# J1 runner hardening handoff

Implementer: Codex. Intended reviewer: Claude. Branch: `codex/hosting-native-refactor`.
Base: `85935ac03aeae9fe389edd4f298cadd9cf4567f4`. Date: 2026-09-28.

This is a bounded follow-up to the reviewed J1 preparation `6624e27`, addressing three carried-forward
review items while the latest integration documentation is being reviewed. Review and integration of this
follow-up remain pending. **J1 is not complete.** The reviewed H3a handoff is in both working branches, so
configuration wiring is unblocked; this follow-up does not implement the adapter or command.

## Behavior and scope

- A malformed or throwing clock now stops the entire pass. It reports one infrastructure error for that
  clock failure, makes no further claims, and leaves any current claim for lease recovery without attempting
  finalization using uncertain time. The error latch also catches an invalid clock in the provider send guard,
  where domain dispatch would otherwise sanitize it as a provider rejection. A later valid clock read does not
  clear the failure. Provider acceptance before a completion-clock failure remains an uncertain send, with the
  existing possible duplicate upon recovery; it is not acknowledged as sent in the aggregate report.
- Ordinary context/provider/finalization failures retain the existing retry and independent-work behavior.
  Raw clock values and exceptions do not leave the worker in its report.
- Added a successful critical-update fixture for a currently saved article, including acknowledged finalization
  and duplicate-pass protection. Added withdrawn reminder-topic consent while channel email consent stays enabled.
- Added clock regression fixtures at context loading, provider guard, and completion, including transient invalid
  reads, persistent invalid reads, and initial malformed/throwing clocks. They check stopped claims, no inappropriate
  finalization, retained processing/pending rows, aggregate counts, and privacy.

Only the existing runner, its own fixtures, and this checkpoint record change. No shared configuration modules,
SQL, package scripts/dependencies, translations, or Claude-owned application files change. The installed Next.js
server/client boundary guide was consulted again before editing the server-only runner.

## Verification

- Before the fix, three new transient-clock regression cases failed: context errors were converted to failed
  completions; provider-guard clock errors were classified as provider failures; completion-clock errors left the
  lease but continued claiming independent work. The persistent invalid-clock path also counted the same clock
  failure in nested handlers.
- Focused worker/dispatch/delivery suites passed: **38 tests across three files** (28 worker fixtures plus ten
  existing domain tests). Targeted ESLint, `tsc --noEmit`, architecture (679 production modules), and whitespace
  checks passed. TypeScript initially caught the fixture's inferred required context property; its return type now
  explicitly follows `ClaimedEmailContext`, preserving optional context for existing overrides.
- Full `vitest run --maxWorkers=4` passed **567 tests across 149 files**, with unchanged test timeout settings.
  The initial default-concurrency full run had 566 passes and one five-second timeout in the unrelated CMS HTTP
  read-only article test; the bounded-concurrency full rerun passed. Environment: LF Windows working checkout,
  Node 24.21.0 and existing installed dependencies (not a clean installation). No live services or real email
  are involved; the CMS fixture tests use temporary local test servers and repositories.
- Production build and CMS exclusion are not repeated for this unconsumed runner-only follow-up; they passed
  at the base integration gate. Final J1 acceptance still requires the actual command/adapter and combined gates.

## Remaining acceptance

Database-authoritative time and clock-skew protection are still required: valid but skewed timestamps are not
addressed by this fix. Exhausted failed deliveries and expired fifth-attempt processing claims still need
inspection/reporting. The real adapter, run-once command, H3a wiring, standalone server-only loading, bounded
network I/O, isolated PostgreSQL concurrency/token/RLS tests, and scheduler/operator documentation remain pending.
No schedule, hosted service, database reset, real email, or main merge is authorized by this checkpoint.
