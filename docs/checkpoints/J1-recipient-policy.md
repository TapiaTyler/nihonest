# J1 recipient policy and exhaustive event mapping

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-29.
Base: `6aa8f1cdee29f9b5ab7a924d106f5d8dd1b9d87a` (database-authority checkpoint, review pending).
Status: implemented; review/integration pending. J1 has no runnable command or activation.

## Contract and policy decision

- `ClaimedEmailContext.recipientAddress` becomes `recipient`, a strict union of
  `{ status: "eligible", address: string }` and `{ status: "suppressed" }`.
  Eligible addresses must pass the existing Zod email validator. No recipient data enters reports.
- After the Auth lookup succeeds and its user ID matches the claim, the adapter uses only the current
  `user.email` and a valid ISO timestamp in `user.email_confirmed_at`. Missing, malformed or unconfirmed
  email is a known ineligible recipient. General `confirmed_at`, phone confirmation, pending `new_email`
  and event payload addresses cannot substitute. Valid offset/microsecond confirmation timestamps are accepted.
  This is the explicit J1 policy chosen during Claude's absence, pending reciprocal review.
- Ineligibility produces terminal suppression through the existing token-bound, database-authoritative
  finalizer. It consumes the existing claim attempt, sends nothing and does not use further attempts.
  Later email confirmation does not revive that already-suppressed event/delivery; future events can deliver.
  No account-facing flow or automatic verification email is added.
- Auth transport errors, missing users and mismatched ownership remain retryable context failures with
  sanitized error summaries. An invalid purportedly eligible address also remains a context failure.
  Suppression is never a fallback for failed authentication or invalid event ownership.
- The runner validates the recipient union, event, preferences and event ID/user ID, and checks the lease
  before suppression. Finalization still rechecks time and uses the original claim token. Existing disabled
  jobs/delivery behavior is preserved: no recipient reads or claims when delivery is disabled.
- Known ineligible critical-update recipients skip saved-content/journey reads. Eligible recipients retain
  the bounded owner/target-filtered relevance reads. Event mapping uses an exhaustive switch for reminders,
  article updates and residence-status guidance updates, with a `never` check for future union additions.
  Unknown runtime variants fail event validation before target queries.

## Verification

- `npx vitest run src/lib/notifications/notification-worker.test.ts src/lib/notifications/supabase-notification-worker-store.test.ts src/lib/notifications/worker-recipient.test.ts src/lib/notifications/worker-database-fetch.test.ts --maxWorkers=4`:
  **84 tests / four files passed**. Covers confirmed-current-address sending, pending/payload address rejection,
  suppression without retry/provider use, no-email OAuth-style accounts, confirmation-field distinctions,
  timestamp/address validation, ownership checks on suppression, retryable Auth failures, skipped irrelevant
  lookups, both critical target kinds and unknown event rejection. Prior lease/clock/finalization tests pass.
- `npx vitest run --maxWorkers=4`: **644 tests / 155 files passed**.
- `npx tsc --noEmit`, targeted ESLint on all six changed notification source/test files,
  `npm run architecture:check` (**692 production modules**) and `git diff --check`: passed.
- Windows / Node 24.21.0 using the existing dependency installation, not a clean install.
  All Auth/database/provider responses are fixtures. SQL/build/browser/editorial checks were not repeated:
  no SQL, application consumer, renderer or content change is included. The preceding SQL smoke and
  validated integration build results remain attributed to their separate checkpoint records.

## Review and remaining gates

No integration before Claude reviews this checkpoint and its database-authority parent. Reviewed integration
remains `e4fc1ff`; consolidated documentation review since `b494ed0` is still deferred. Standalone command/config
wiring, bounded provider/whole-lease I/O, real isolated Supabase/PostgreSQL 17 concurrency/lock-wait and pgTAP
acceptance, and operator documentation remain pending. Docker's unavailable engine is not bypassed by these
fixture tests. No shared configuration/dependency, Claude-owned file, translation, main branch, hosted service,
recurring schedule or real email is changed or activated.
