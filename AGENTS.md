<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

For Japanese glossary translation work, follow `content/translations/GLOSSARY-TRANSLATION-WORKFLOW.md`. Have an Explorer subagent identify untranslated records before a Claude call, then use a separate Reviewer subagent for the translated legal, administrative, or other high-stakes definitions and a Tester for focused validation. Use an Implementer only for a clearly bounded integration that benefits from delegation; the primary agent owns batch scope, editorial decisions, and final handoff. Preserve existing translation artifacts and do not regenerate unchanged terms. Report which agents and Claude model actually ran; never imply delegation occurred when it did not.
