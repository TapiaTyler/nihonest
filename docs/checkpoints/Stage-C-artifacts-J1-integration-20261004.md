# Stage-C article artifacts / J1 acceptance integration — 2026-10-04

Codex approves exact Claude checkpoint `5b58f064b801bc04651d922c4551e3b9920a4d22` against parent
`f1c3eec`, for the article-component source-field, artifact and selector scope. No blocking findings.
Claude's uncommitted N3 work was excluded; his checkout was never modified.

The three schema-validated artifacts retain `machine-translated` provenance, existing Japanese text,
terminology/prompt metadata and source revisions. The selector runs through the server-only hash wrapper
and requires active Japanese identity, exact current revision, complete exact field keys and visible
nonblank values. Five empty English training suffixes must remain exactly empty. Practical paragraphs
must parse without protected spans, have a leading strong label and body, and retain ordered link targets.
Stored values are returned untrimmed. Undefined means whole-component English fallback.

The exported `ArticleComponentSource` maps directly to Codex's proposed English v2 data. A read-only
assertion probe compared every field with Claude's fixture and all three artifact revisions: **37 fields**
(9 tax, 24 training, 4 practical), all equal. Full revisions are in
[N2-English-component-data-v2.md](N2-English-component-data-v2.md) on Codex's preparation branch; that
checkpoint `a74926b` remains unreviewed and is deliberately absent from this integration.

Exact review commands, in a clean detached LF worktree at `5b58f06` with copied existing dependencies:

- `git diff 5b58f06^ 5b58f06` and committed six-file inspection.
- `npx vitest run src/lib/content/article-component-translations.test.tsx`: **7 passed**.
- Targeted `npx eslint` on all six files: passed.
- `npx next typegen`, then `npx tsc --noEmit`: passed. The initial fresh-checkout type check lacked generated
  `PageProps`; type generation resolved it. No source change was required.
- `node --import tsx --input-type=module`: read-only field/revision probe above. The first Windows absolute
  import needed a `file:///` URI; corrected run passed.
- `git diff --check`, `git status --short`: clean. No translation catalog was edited for testing.

Existing tests establish exact visible text/label/link-text parity and practical link href parity, not
full static markup equality. The table helper captures hrefs but does not assert them. Canonical training
hrefs stay outside the translation source contract; extraction must explicitly preserve them. Claude's
parent-versus-extraction English/Japanese byte-exact static markup gate remains pending.

## Exact integration and combined gate

On `codex/hosting-native-integration`, after documentation handoff `ea715b1`:

- Claude scope-approved J1 Auth/PostgREST harness `733c827` → `b3742db`. Only append-only ROADMAP/refactor
  conflicts; both historical records were retained. Claude reviewed code without rerunning the real-stack
  scenarios or approving every documentation line. The earlier 14-scenario local fake-sender evidence
  retains its attribution and production/operator limits.
- Approved Claude artifact checkpoint `5b58f06` → `4139f0cc8480cb5ccbc93c17583b3c84c4a7df90`.

A separate clean LF validation checkout at exact `4139f0c` ran
`npm run release:check -- --target local`, clearing Supabase/email/AWS/public settings, with delivery false
and public origin `https://nihonest.invalid`: **13/13 passed**, **1,018 tests / 181 files**, architecture
**716 modules**, production **416 entries**, lint/types/editorial/coverage/article/glossary audits, CMS
exclusion and all **42 browser JS files** passed. Localization audit remains article-only. Existing
installed dependencies were reused; no clean install/CI, browser, real Auth/SQL or hosted run was repeated.

Claude's `ea715b1` handoff merge receipt (`f1c3eec`) and documentation approval were received; Stage-C
ownership is effective and tax/training renderers are explicitly handed off. Japanese provenance decision
is received. Next: Claude reviews `a74926b`; integrate that exact reviewed data checkpoint before consumer
extraction, then preserve markup and have Claude perform parity review. N1 component payload/artifact
family export follows reviewed data/display contracts. No main merge, hosted service, real email or schedule.
