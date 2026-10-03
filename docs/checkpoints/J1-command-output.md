# J1 command output and exit-path verification

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-30.
Base: `2c3670808faf9cba64295ea774f7f41981b3b68e`.
Status: local entry-boundary coverage implemented; reciprocal review/integration and J1 acceptance pending.

## Scope and behavior

The original command checkpoint tests configuration/client ordering, disabled-email behavior and provider
disposal in `executeNotificationWorkerJob`. This follow-up tests the committed entry script's argument,
stdout/stderr and exit-code boundary. No runtime change or new command option was needed.

`notification-worker-cli.test.ts` transpiles the actual `scripts/notification-worker.ts` source with the
existing TypeScript dependency and executes it with explicit process/import fixtures. The only supplied
imports are the real `ConfigurationError` class and a mocked job function. No global process/environment
mutation, SDK construction or inherited credentials occur. Unexpected imports fail the fixture instead
of loading another module. This executes trusted repository code; Node VM is not a security sandbox.

Eight cases cover:

- Help without reading the environment or invoking the job.
- An invalid argument and help combined with an extra argument: fixed stderr, exit 1, no argument echo
  or environment/job access.
- Completed, delivery-disabled and failed reports: exactly one aggregate JSON line, no stderr, matching
  process exit code and one job invocation with the explicit fixture environment.
- Configuration errors: deduplicated setting names only, without context, diagnostic messages or values.
- Unexpected startup errors: generic `startup-failed`, without the error message or nested cause.

These tests exercise entry serialization/selection. They do not replace the runner's report sanitization,
deadline/lease tests or the command service's client-construction ordering checks.

## Verification

- All notification suites: **141 tests / 16 files passed**, including eight new entry cases and the four
  original command-service cases. TypeScript, targeted ESLint and architecture (**709 modules**) passed.
- Four actual Node entry invocations passed with a child environment containing only system/path/temp
  variables: help (exit 0), invalid argument (exit 1), missing job settings (exit 1), and invalid URL with
  a dummy secret (exit 1). Failure output contained only the expected fixed text or configuration JSON;
  fixture argument/URL/secret canaries did not appear. Each child had a 15-second process timeout.
  Help/argument paths bypass the job; configuration cases fail before client construction.
- `npm test -- --maxWorkers=4`: **933 tests / 174 files passed**. The existing jsdom navigation
  diagnostic appeared without a test failure. `git diff --check` passed.

Existing dependencies; no clean install. No successful real job, hosted/database/Auth/SES call, production
build/browser UI or translation audit was run. The tests and child checks do not establish a deployed
scheduler, operational network behavior or a real-email send.

## Remaining gates

Original J1 authority `6aa8f1c`, recipient `904856e`, budget `4b4bb37`, command `7fdea85` and acceptance
preparation `b427fd4` still need reciprocal review/integration alongside this exact follow-up. Real isolated
Supabase/PostgreSQL 17, pgTAP, multi-connection and fake-sender acceptance remain open. The reviewed
integration remains `e4fc1ff`; do not merge the working branch head with unrelated pending checkpoints.
No main merge, hosted execution, schedule or real-email activation.
