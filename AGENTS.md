<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Claude owns Japanese translation: the prompts, shared translation modules, decisions, and final checks. Codex may draft Japanese only for the municipality-guidance locations the user assigns to it, following `content/translations/LOCAL-GUIDANCE-TRANSLATION.md` (`npm run local-guidance:ja`); it integrates them as `codex-drafted`, reports every flag, and Claude checks them before they count as reviewed. Codex does not edit other translation catalogs, `define.ts`, the indexes, or the prompts. All other translation work follows `content/translations/CLAUDE-TRANSLATION-REPORT.md`. Preserve existing translation artifacts, do not regenerate unchanged terms, and keep artifacts `machine-translated` until a qualified human reviews them.

For municipality-specific local guidance (supplements in `src/data/local-guidance/`), follow `docs/LOCAL-GUIDANCE-WORKFLOW.md` and use `npm run local-guidance` for worksheets, page fetching, and checks.
