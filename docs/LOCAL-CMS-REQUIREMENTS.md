# Local Editorial CMS Requirements

Status: planned. This document specifies the next editorial tooling checkpoint in [ROADMAP.md](ROADMAP.md). It is a requirements and acceptance document, not a claim that the CMS exists.

## 1. Purpose and boundaries

Nihonest's canonical content lives in this Git repository. The local CMS is an editor-facing application that reads and writes those files, explains their relationships, previews the resulting site, and prepares a reviewable change. It must reduce the effort of maintaining a large, interlinked catalog while preserving the controls in [EDITORIAL-WORKFLOW.md](EDITORIAL-WORKFLOW.md), [SOURCE-REVIEW.md](SOURCE-REVIEW.md), and [CONTENT-GUIDELINES.md](CONTENT-GUIDELINES.md).

The first user is the repository owner, operating on their own machine. A future hosted, multi-user CMS remains a separate decision under the roadmap's CMS adoption requirements. No CMS database becomes the canonical content store. Git history remains the durable record of committed content, source resolutions, and approvals. A locally run CMS does not require Supabase, a continuously running server, or a public administrative route.

The CMS may present public `draft` content as a draft. It must not conflate public visibility with editorial verification or imply that a draft was approved. The project repository is currently private; the CMS must still avoid storing credentials or personal data in canonical files and must not rely on repository privacy as its only protection.

## 2. Core principles

1. **Repository first.** Existing schemas, stable IDs, validation, scripts, and source formats remain authoritative. The CMS adapts to them; it must not maintain a second competing copy of published content.
2. **Human editorial authority.** Source detection, AI suggestions, successful validation, and CMS actions cannot independently verify guidance, accept a source revision, or authorize publication.
3. **Explicit change boundary.** Every write has a visible target, an expected prior revision, an inspectable diff, and a recoverable outcome. No autosave may silently overwrite canonical files.
4. **English is canonical.** Japanese artifacts are revision-addressed derivatives. Translation work follows `content/translations/CLAUDE-TRANSLATION-REPORT.md`; the CMS does not assign human-reviewed status to machine translations.
5. **Accessible, local operation.** The editor can use keyboard and assistive technology for all core tasks. The local UI is served on loopback only and is not included in the public application build or route tree.
6. **Incremental support.** Unsupported record types remain editable through the existing file workflow. The CMS must disclose its supported types and must never rewrite an unsupported file to simulate support.

## 3. Content inventory and ownership

The CMS should discover records through the project's registries or a shared content inventory, rather than a hard-coded count or folder-name heuristic. At minimum, the inventory must identify record kind, stable ID, canonical file path, display title, locale, current content/editorial state, revision, and relevant relationships. It should distinguish a missing record from a parse or validation failure.

| Catalog | Canonical location or workflow | CMS responsibility |
| --- | --- | --- |
| English articles | `content/articles/*.mdx` and article registry | Edit supported metadata and the approved Markdown/component subset; preview full article and links. |
| Article groups, journeys, FAQs, glossary, residence statuses, activity cross-references, and structured guidance | Corresponding `src/data` modules | Inspect dependencies and edit supported fields while preserving IDs, references, ordering, and module ownership. |
| Official sources | `src/data/sources` and source registry | Inspect authority, URL, language, citations, and dependents; route observations through source-review commands. |
| Municipality guidance | `src/data/local-guidance/locations` | Display the location/guide matrix; support edits only after the per-location file contract and verification workflow can be preserved. |
| Annotated documents | Existing document-family/version modules | Preserve family, jurisdiction, immutable version, lifecycle, and source distinctions; initially inspect-only if a safe editor is not ready. |
| Japanese translations and localized interface text | `src/data/translations/ja` and localization catalogs | Show coverage and staleness; do not regenerate or edit Japanese artifacts in the initial CMS. Provide a handoff to the existing delegated translation workflow. |
| Editorial approvals and source reviews | `content/editorial-reviews`, `content/source-reviews`, and monitoring state | Display history and current validity; invoke the existing guarded commands only after explicit human action. Never rewrite an immutable record. |

The implementation should publish a per-kind capability matrix: inspect, create, edit, archive, preview, validate, and approve. The first usable slice must support an English article and at least one structured record end to end; expand record kinds in bounded passes after testing their round-trip behavior. Adding a new type to the codebase should produce a clear unsupported-type state until its adapter is implemented.

## 4. Finding and understanding content

- Search and filter by title, stable ID, kind, status, topic, journey, geographic scope, source, translation state, and review date where those fields exist. Search results should identify why a record matched.
- Open a record with its canonical file path, status, last review information, current revision, sources, and inbound/outbound relationships. The UI must distinguish direct relationships from inherited or inferred navigation exposure.
- Provide source-to-dependent and content-to-source views. A changed source must show the same dependency scope as the existing impact-report tooling, including gaps where a content family is not yet represented by that graph.
- Show cross-record validation problems in context, with links to affected records and the underlying command output. Do not suppress warnings or turn a failed check into a green status.
- Support a read-only view of unsupported records and of files with parse errors, preserving raw-file access for recovery.

The initial interface should have a catalog view, a record workspace, a source/relationship view, a change-review view, and a local activity view. The catalog view answers what needs attention; the record workspace keeps content, metadata, evidence, and preview together; change review shows exactly what would be written or handed to Git. Counts and filters must derive from the current checkout rather than a stale CMS index. Activity history records local CMS operations and command results for recovery, while committed Git history and approval files remain the durable editorial audit.

## 5. Editing and file fidelity

- Load a record from a known file and revision. Before writing, compare the on-disk revision with the one loaded; if it changed, stop and show a conflict rather than overwriting another editor or agent's work.
- Change only the intended record and related registration lines. Preserve unrelated files, unknown fields, comments, formatting where practical, ordering invariants, and existing uncommitted work. Any formatter or serializer that produces a broad rewrite must show the complete diff and require an explicit decision.
- Validate required fields, controlled vocabularies, IDs, references, dates, URLs, and locale-specific constraints using the same domain schemas as the application. UI checks help immediately but do not replace repository validators.
- Provide purpose-built controls where safe: source and glossary references, relationship selectors, status with its consequences, geographic scope, date/effective-period fields, and content body. Prevent accidental duplicate IDs and broken links.
- For articles, edit the supported Markdown/component block model without discarding unsupported constructs. If round-trip fidelity cannot be guaranteed, provide a guarded plain-text edit or read-only view rather than a lossy visual editor.
- A new or materially revised factual record remains `needs-review` unless it is intentionally an incomplete `draft`; a previously verified record loses current approval when its approved revision changes. Preserve its immutable historical approval files.
- Display pending changes and allow discarding only changes made by the CMS in the current operation. Never use repository-wide reset, clean, or checkout as an undo mechanism.
- Changes across several records should be reviewed as a deliberate batch with an itemized file list. A failed write must leave the file intact and report a recoverable error; use temporary-file/atomic replacement where supported.

Creation must require a proposed stable ID, slug or path where applicable, an initial status, and required relationships before registering the record. The UI must show which files and registry lines creation will add. Deletion of canonical records is not an initial capability: offer the existing archive state or an explicit manual migration path, since incoming relationships and historical URLs may depend on the ID. Duplicating a record must create a new ID and clear review/approval metadata rather than copying its verification.

## 6. Editorial and source-review workflow

The default path is: inspect evidence → edit canonical content → preview → validate → review exact diff and impact → request human approval where applicable → create the existing approval/source-resolution record → commit through the normal Git workflow. The CMS must name the current step and outstanding blockers without implying that completing a checklist verifies facts.

`draft`, `needs-review`, `verified`, and `archived` retain the meanings in [EDITORIAL-WORKFLOW.md](EDITORIAL-WORKFLOW.md). `verified` requires the current exact revision and the existing immutable approval record, with `lastReviewedAt` matching the human decision. The CMS may guide the editor through `npm run editorial:record` after an explicit approval, but cannot fabricate that approval or silently invoke `--approve`. It must show when an edit makes an old approval stale. Likewise, resolving an official-source candidate requires the explicit review evidence and separate human decision described in [SOURCE-REVIEW.md](SOURCE-REVIEW.md); accepting a source never verifies dependent content.

The source-review panel should show observed changes, accepted baseline, candidate status, official URL, detected date, direct and inherited dependents, and unresolved uncertainty. It should expose the dry-run check before a state-writing check, then show the generated impact report. Even a dry run may fetch an official page, so show the target URL and require an explicit start action. Do not edit monitoring fingerprints directly, commit fetched third-party page bodies, or publish a correction automatically. Important legal, immigration, tax, employment, healthcare, and municipal claims must remain linked to appropriate official evidence and meaningful recheck dates.

## 7. Preview, localization, and impact

- Render a preview using the same content parser and presentation components as the public site, including draft and editorial-review labels, source links, glossary interactions, local guidance, responsive widths, and accessibility semantics. A preview must identify uncommitted content and its status.
- Permit preview of the current file and the proposed edit, and show a text/field diff plus a rendered comparison where feasible. Link every preview to the exact revision under review.
- Show affected article groups, journeys, search entries, FAQs, glossary links, local supplements, activity cross-references, document versions, and portable content bundle outputs to the extent their dependency information supports it. Mark unknown impact explicitly rather than claiming completeness.
- On canonical English changes, calculate translation currency from the existing revision-addressed rules. Show current, missing, and stale artifacts; preview the established English fallback. Never patch a stale Japanese artifact to appear current by changing its revision metadata alone.
- Provide a handoff list for Claude's delegated Japanese translation workflow. Preserve unchanged artifacts and the `machine-translated` state until qualified human review. Translation completion is a separate gate from English editorial approval.

## 8. Validation and Git handoff

The CMS should select the narrowest meaningful checks for changed record kinds and show the exact command, duration, exit status, warnings, and output. It must support the existing `npm run editorial:audit`, source checks/reports, `npm run local-guidance -- verify`, localization checks, content bundle validation, type checking, focused tests, and a production build when relevant. A passing focused check cannot be presented as a full-site pass. Time-consuming or network checks require an explicit start action and clear cancellation behavior; a failed or canceled check never counts as passed.

Before handoff, display `git status` and a per-file diff that includes any generated files or approvals. Clearly separate CMS edits from pre-existing dirty files. Refuse an automatic commit if unrelated edits or conflicts cannot be distinguished; manual Git remains available. The CMS may prepare a commit message and optionally stage a selected file set, but it must not push, merge, deploy, or publish on its own. If commit support is added, it must require an explicit final action and show the exact staged diff. Git remains the rollback and audit mechanism after commit; the CMS should explain how to revert a committed change without altering approval history.

Prefer a dedicated local branch or worktree for a CMS editing session. The CMS must identify the repository, branch, worktree path, starting commit, and dirty-tree state before the first edit. It may offer to create an isolated worktree through an explicit action; it must never switch branches or move files behind the editor's back. A session started in an existing dirty checkout must either operate only on a clearly selected subset or stop with instructions to isolate the work. Closing a session must not delete the worktree or discard uncommitted work. Concurrent agent edits to the same checkout are detected by the expected-revision check, and the CMS must display both versions for manual resolution rather than choosing a winner.

## 9. Local operation, security, and failure recovery

- Start with a documented command such as `npm run cms`, bind to `127.0.0.1` by default, and fail closed if binding would expose the service to a network interface. Do not add the editor to public Next.js routes, static assets, or the production build.
- Restrict file operations to an allowlist of repository content and workflow paths. Resolve and check real paths to prevent path traversal and symlink escape; reject arbitrary shell commands or client-supplied paths. Use fixed command definitions and bounded arguments for validation scripts.
- Treat even a local browser UI as an administrative surface: defend write endpoints against cross-origin requests, use an unpredictable session capability or equivalent, and do not enable permissive CORS. Never display or log secrets. Keep runtime files and caches in a gitignored local directory.
- Make the working tree and file backup/recovery state visible. On crash or interrupted write, reload from disk and present any recoverable CMS draft separately from the canonical file. Never silently replay it over newer edits.
- Make the operator able to stop the CMS without affecting the public site, inspect logs locally, and restore from Git or a local recovery file. No hosted database, account system, cloud subscription, or continuous runtime is required for the first release.
- Test the local server boundary, path restrictions, conflict handling, and production exclusion before using it for canonical edits. Repository privacy is useful but does not substitute for these controls.

## 10. Accessibility and usability

Use semantic labels, headings, field descriptions, keyboard-operable controls, visible focus, and text equivalents for status/color cues. Validation must focus or link to the affected field and explain the correction. Long records need a clear outline and unsaved-change warning on navigation. Source and diff views must be readable without relying on side-by-side width; narrow screens should use a stacked comparison. Destructive actions require the target and effect to be stated plainly. The editor interface may initially be English, but user-facing content and locale labels must remain distinguishable, and the design should not block later interface localization.

## 11. Delivery slices and acceptance

1. **Inventory and read-only workspace:** discover supported records, show revisions, sources, relationships, states, and parse failures. Prove that reading does not change the tree.
2. **Safe editing slice:** edit one English article and one structured record, preserve round-trip fidelity, preview both, detect a concurrent file change, and recover from a failed write.
3. **Review workflow:** run focused checks, show exact diffs and dependency/translation impact, preserve a verified record's historical approval while requiring a new approval for its changed revision, and hand off to Git without automatic publication.
4. **Catalog expansion:** add adapters for high-value record kinds in bounded batches. Use existing local-guidance and source-review workflows rather than bypassing them; maintain a capability matrix and tests for each new adapter.
5. **Operational closure:** document setup, supported content, limitations, recovery, security boundary, and migration/export. Demonstrate that removing the CMS leaves canonical files and existing scripts usable.

Acceptance requires a representative article and structured-record edit through the whole local flow; accurate status and translation-staleness display; no data loss with a pre-existing dirty tree or concurrent edit; a blocked stale approval; an explicit human approval path; meaningful accessibility checks; and a verified production build that contains no CMS administrative endpoint. Document any content kind still read-only. These are release gates, not a promise that every catalog gets a visual editor in the first slice.

## 12. Explicitly deferred

Multi-editor accounts, assignments, review discussions, hosted database state, remote CMS access, live collaboration, external contributor portal, browser-based production publishing, automated Git pushes, AI-generated factual approval, and runtime Japanese translation remain outside this local checkpoint. If multiple editors later need durable collaboration, revisit the roadmap's hosted CMS adoption requirements and make a separate canonical-data and migration decision.
