# Local editorial CMS

A locally run editing workspace for this repository's canonical content. It reads and writes the same files as the rest of the project, never commits or publishes, and can be removed without affecting the site (see [Removing the CMS](#removing-the-cms-and-exporting-content)). Requirements: [docs/LOCAL-CMS-REQUIREMENTS.md](../../docs/LOCAL-CMS-REQUIREMENTS.md).

## Setup

Run `npm run cms` from the repository root and open `http://127.0.0.1:4177`. Use that exact address: the server refuses other host names, including `localhost:4177`, to block DNS-rebinding requests. Set `CMS_PORT` to another local port if needed. Stop the process with Ctrl+C; stopping it does not affect the site or the dev server. The server binds only to `127.0.0.1` and is separate from the production Next.js application.

The start command includes a CMS-scoped fallback for a Windows host issue where Node's `os.userInfo()` fails before `tsx` starts. It handles only that specific OS lookup failure; it does not change the application's content behavior.

Before editing, commit or set aside unrelated work, or start the CMS from a separate worktree (`git worktree add`), because it will not write files that were already dirty when it started (see [Git session](#git-session)).

## Workspace pages

A navigation bar links the pages, and **Go to…** in the header (Ctrl+K or Cmd+K, or / outside a text field) opens a searchable list of every page, record, municipality guide, reference record, and common action (new records, Start reviewing, Refresh); type any words from a title, ID, location, or prefecture, then press Enter. Each page, record, and municipality guide has its own address (`#/content/faq/<id>`, `#/guidance/<supplement-id>`), so bookmarks and the Back button work. Switching pages only hides the others, so unsaved edits survive; leaving or reloading the CMS with unsaved edits asks for confirmation.

| Page | Purpose |
|---|---|
| Overview | What needs attention in the loaded checkout: records in review or draft, stale or missing Japanese artifacts, unreadable files, the session's own changes, files dirty before the session, data modules changed outside the CMS, and recovery drafts. Each item links to the page that resolves it. |
| Content | Articles, FAQs, residence statuses, and glossary terms, filtered by kind, category or topic, and status. Search covers titles, IDs, categories, and topics; a result that did not match on its title says why it matched. |
| Municipality guidance | The location/guide coverage matrix (each cell shows its Japanese state and marks unchecked Codex drafts; a summary counts them, **Show only locations with …** hides rows that need nothing, and arrow keys move between cells with one tab stop) and per-location guide lists, with locations grouped by prefecture; opens a guide's English editor. |
| Sources & references | Source impact (an official source's direct and derived dependents) and the inspect-only reference catalogs: official sources, guided journeys, article groups, and annotated document families. |
| Translations | The Japanese translation handoff: stale and missing artifacts across supported kinds, with a plain-text download. |
| Checks | Fixed, named validation commands (see [Checks and release gates](#checks-and-release-gates)). |
| Changes | The Git session and per-file diffs, grouped into this session's edits, files dirty before it, and outside changes; and local recovery drafts. |
| Activity | The local operation log, newest first. |

Long lists show 200 entries at a time with a **Show more** control; counts always cover every match. Overview counts link to the list or page they count. Activity is grouped by day in plain sentences, collapses repeated events, and links each record. The Checks page describes the selected check and keeps its exact command under **Command**. Source impact starts with a choice rather than a preselected source. The header shows when the session started and when data was last refreshed.

## Records

Every editable record opens in the same workspace: a header with its kind, title, editorial status, Japanese state, and file path, then these tabs (click, or arrow keys, Home, and End):

- **Edit.** Articles open in the **Formatted editor**: supported paragraph, H2/H3, quote, and flat list blocks are edited directly. The toolbar changes block type, emphasis, links, and components and supports Undo/Redo; Enter adds a paragraph or list item, and paste uses clipboard plain text. **MDX source** is the precision mode. Switching modes without an edit preserves the loaded MDX byte for byte; editing a formatted block rewrites only that block's source. Unknown syntax and component blocks stay as locked, named blocks with an explicit source-mode route. The body editor is available for `draft` and `needs-review` articles without a `lastReviewedAt` date; move a dated article between statuses first, which removes the date. The structured editor changes FAQ questions and answers; residence-status summaries, purposes, activities, examples, and considerations; and glossary English definitions and usage context (direct glossary entries also their English names). IDs, relationships, sources, Japanese fields, and residence decision-support rules are read-only. Each editor shows the generated source and a diff before Save, and a **Preview** control reveals an approximate website rendering that follows unsaved edits; **Open full website view** opens saved content on the dev server at port 3000.
- **Review & approve.** The saved content, its official sources (with link-check dates), and the checks run this session sit beside the decision form, so the approval is made against what it covers. Change status (articles and residence statuses: `draft`, `needs-review`, `archived`; FAQs and glossary terms: `draft`, `needs-review`), or record approval. **Mark reviewed** requires your explicit approval of the exact revision, a review date, change and approval notes, and the validation actually performed. It writes `verified` and an immutable approval record. A status change is not an approval and removes any old review date; historical approval records stay in Git. Run `npm run editorial:audit` before committing.
- **Linked articles**, **Sources** (with content-to-source impact), and **Details** (identity, revisions, metadata, and the raw stored record).

A factual edit keeps an incomplete draft as Draft and returns other statuses to Editorial review, so an old approval never covers new text. Saves check the record's SHA-256 revision and, for records in shared TypeScript modules, the whole file's revision, then replace the file atomically; a conflict (HTTP 409) asks you to refresh. The CMS changes only the selected record's supported fields and preserves the surrounding source text. Defaults a record relies on when a field is omitted are read from the data modules, not copied into the CMS. FAQs cite related articles rather than official sources, so review those articles' sources too.

Municipality guides use the same header with **Edit**, **Sources & rechecks**, and **Details & checks** tabs. Their English prose and existing action text can be edited; status stays `needs-review`, and sources, rechecks, geography, registration, action count, and Japanese text stay in the local-guidance workflow (see [Municipality guidance support](#municipality-guidance-support)).

Question-mark disclosures beside each editable, status, and review field explain what belongs there.

**Save state and review queue.** The bar under each editor stays in view and shows whether the record has unsaved edits and when its local recovery draft was kept; the record header shows **Unsaved edits** too. Ctrl+S (Cmd+S) saves the open editor; **Discard edits** asks first when there are edits. **Mark reviewed** stays disabled until the confirmation is ticked and Edit holds no unsaved edits, and checks that passed in this session can be selected instead of retyped under validation. The content list's **Order** (catalog, title, oldest review first, least recently updated, most important first) and filters define a queue: the record header shows the position ("3 of 397 in this list") with **Previous** and **Next**, J and K step through it outside text fields, and after an approval the confirmation offers the next record. The Overview's **Start reviewing** item opens the editorial-review queue, oldest review first.

## Creating records

**New record** on the Content page (Article, FAQ, or Glossary term), and **New official source** on the Sources & references page, open a creation form; **Duplicate as new** on an existing FAQ or glossary term opens the same form prefilled from it, with a new ID and no dates or review data. The form asks for the English content first, then a stable ID (a lowercase hyphenated identifier other records will link to, filled from the title, question, or romaji until you type your own), an optional slug (defaults to the ID), relationships, and an initial status of Draft or Editorial review. Optional relationships and search terms are folded under a disclosure, and **Cancel** closes the form. ID lists have a finder that suggests known IDs.

**Preview addition** validates the record and shows the exact text and the file and line where it will be added. A FAQ is appended to its browse group's module (`src/data/faqs/<group>.ts`) as one `defineFaq` entry dated today; a glossary term is appended to its primary topic's module (`src/data/glossary/<topic>.ts`) as a direct `japaneseTermSchema.parse` entry. **Create** is available only for the previewed fields; changing any field requires a new preview. The server rechecks everything on Create: the domain schema, the same collection validators the site uses (unique IDs and slugs; every related article, group, journey, glossary term, residence status, activity, and source must exist; a FAQ must link at least one resource), that the module still matches the previewed revision, and that it was not dirty when the CMS started. It then appends the entry atomically without changing any existing text.

**Articles.** A new article is two coordinated changes: a new `content/articles/<id>.mdx` file (metadata dated today, then the body you enter) and an import line plus registration entry in the article registry module you choose under `src/lib/content/article-registry/`, which sets its place in the catalog order. The preview shows the whole MDX file and both registry lines. The form covers the metadata the schema requires (title, description of up to 180 characters, journey stages, topics, geographic scope, importance, content type) and the optional audiences, sources, glossary terms, residence statuses, relationships (related, prerequisite, next step), and search terms; every reference must exist. The body must use the supported Markdown and component subset; refine it later in the formatted editor. Create writes the MDX file create-only (it never replaces an existing file) and then the registry change; if the registry write fails, the new MDX file is removed again, so every article file stays registered exactly once. A new article appears in catalog and search listings, but not on article group or guided journey pages until those registries include it; the preview warns about this, and those registries stay in code.

**Generated article metadata.** Every article write (body save, status change, approval, or creation) then regenerates `src/data/generated/article-metadata.ts` from the canonical MDX and registrations, under the same file lock, dirty-file guard, revision recheck, and atomic replacement, and lists it among this session's writes. It never replaces the file if someone else changed or created it during regeneration. The save response reports `generatedMetadata` as `current`, `updated`, or `failed`. A failure never undoes or misreports the article write: a banner below the header says the article changes are saved but the generated module is out of date, gives the reason, and offers **Regenerate article metadata** (the same guarded write) or `npm run content:metadata`. The banner comes from a read-only check (`GET /api/generated-metadata`), so it returns after a reload until the module is current; a production build refuses stale metadata.

**Official sources.** A new source is appended as one `officialSourceSchema.parse` entry to the subject module you choose under `src/data/sources/`. It needs an ID, organization, page title, https URL, authority level, and language, and optionally a manual link-check method. The preview warns when another source already uses the URL. Records created in the same session can cite the new source at once; the reference catalogs and source-impact view list it after the CMS restarts, and source monitoring checks it on its next run. Monitoring dates and source reviews stay in the source-review workflow.

A new article, FAQ, or glossary term appears in the catalog immediately, with Japanese state `missing`, so it enters the translation handoff. It is never created as Reviewed: review and approve it like any other record. Residence statuses and glossary terms generated from residence statuses or occupational routes cannot be created here; add them in code.

## Translation state and data freshness

Japanese translation state is `current` when the artifact's `sourceRevision` matches the record's English fields (the rule in `src/domain/translation/translation-source-fields.ts`, shared with the translation tests), `stale` when the English changed after the artifact was made, and `missing` when there is none. The CMS never edits Japanese artifacts; hand stale or missing ones to the translation workflow in `content/translations/CLAUDE-TRANSLATION-REPORT.md`.

**Refresh** rereads article MDX and the CMS's own structured changes. Source, reference, municipality, and translation registries are TypeScript modules loaded when the CMS starts, so their state is only as current as the process. The CMS checks the Git checkout once a minute: when a file under `src/` changes outside the CMS, the header shows **Restart needed** and the Overview lists it. Restart the CMS then; until you do, it also rejects saves to a changed data module.

## Security boundary

The CMS is an administrative tool for one editor on one machine.

- It listens only on `127.0.0.1` and answers only requests whose `Host` is exactly `127.0.0.1:<port>`, which blocks DNS rebinding. It sends no CORS headers.
- Every write requires the exact local `Origin` and an unpredictable per-process session token, and validates its payload on the server.
- Responses carry a strict Content Security Policy (scripts and styles only from the CMS itself), `X-Frame-Options: DENY`, `nosniff`, and `no-referrer`.
- Writes are limited to records the adapters recognize, and creation only appends validated entries to an existing FAQ, glossary, source, or article registry module chosen from a fixed list, or creates a new article file named by its validated ID, never a client-supplied path: IDs are validated, paths come from registries rather than the client, and only targeted literal ranges change. The diff viewer serves only files Git reports as changed, and resolves links so an untracked symlink cannot expose a file outside the worktree.
- Checks run fixed command definitions; the browser cannot supply a command, path, or argument.
- Runtime state lives in the gitignored `.cms/` directory and holds no secrets. The CMS never displays or logs credentials.
- The production build contains no CMS code: `tools/cms` stays outside `src/`, a source-level test guards the boundary, and `npm run cms:check-build` inspects the build output.

## Git session

When the CMS starts it records the worktree, repository, branch, starting commit, and every file that already has uncommitted changes, and prints them in the terminal. The Changes page shows the same identity and groups changed files into those written by this CMS session, those already changed before it started, and those changed by another editor or agent during it; open a file to see its diff against HEAD. The CMS refuses to write a file that was already dirty when it started (HTTP 423), so its edits never mix with unreviewed work in the same file. Commit or set those changes aside and restart the CMS, or run it from a separate worktree. It also refuses all writes if it cannot read the Git checkout, and warns if the branch or commit changes after it started; restart it in that case. The CMS never stages, commits, pushes, switches branches, or discards changes. Its Git reads use `--no-optional-locks`, so its status checks never hold `index.lock` while you stage or commit. For concurrent editing with other agents, run the CMS from a dedicated worktree with its own dependencies so CMS code, source registries, and content files come from the same checkout; the revision checks catch collisions in a shared checkout, but a separate worktree is the reliable isolation boundary.

## Local activity and recovery

The CMS stores its short activity log and unsaved English article/structured-content snapshots under the gitignored `.cms/` directory in the current worktree. The log records operation kind, result, record ID, and time; it excludes article text, approval notes, and credentials. It is local recovery history, not a replacement for Git history or the editorial approval ledger. The Activity page shows recent events, including named check results.

Edits are captured locally while you type. Reopening the CMS shows a recoverable draft beside the current canonical record; it never inserts or saves that draft automatically. **Load draft into editor** is available only when the draft's base record and source-file revisions still match. If the canonical record changed, inspect the two versions and reconcile them manually in the current editor. A failed or interrupted canonical save leaves the recovery snapshot intact. A successful save removes only the exact matching snapshot, so a newer draft from another session cannot be deleted accidentally. Draft writes compare the current recovery revision and report a conflict when it changed. Run only one CMS server per worktree; use separate worktrees for parallel sessions. Use **Discard recovery** only after inspecting the named record; it does not change canonical content. Runtime files can be inspected or copied from `.cms/` while the CMS is stopped. Removing `.cms/` discards this local recovery history but leaves canonical repository files intact.

The Changes page identifies the existing worktree and its dirty state. CMS-4 does not create a new worktree in the interface; use `git worktree add` outside the CMS when isolation is needed, then start `npm run cms` from that checkout. The CMS never switches or removes worktrees.

## Checks and release gates

The **Checks** page runs only the named commands shown in its selector. Starting one requires an explicit click; the browser cannot supply a command, path, or extra arguments. Only one check runs at a time. The panel shows its scope, exact command, elapsed time, exit code, output, and distinct running, passed, review-findings, failed, or canceled state. A focused test result applies only to its named paths; no individual result is presented as a full-site pass. Glossary consistency findings are review signals even when its script exits successfully, so the panel shows them as **Review findings**. Cancel or stopping the CMS terminates the current process tree. Output is bounded and truncation is marked. The production option runs the build and then `cms:check-build` as one ordered check; it passes only if both succeed. Stop the web dev server first because it shares `.next`. Local-guidance verification may refresh generated coverage documents and is refused if either generated coverage or recheck document was already dirty at startup or is currently changed; inspect the Changes page afterward.

Run the focused checks with `npx vitest run tools/cms`, `npx tsc --noEmit`, and `npx eslint scripts/cms.ts scripts/cms-a11y.ts tools/cms`. The CMS tests include a source-level production boundary check. Before a release, stop the dev server (it shares `.next`), then run `npm run build` and `npm run cms:check-build`, which fails if any CMS code or endpoint marker appears in the production output.

## Accessibility

`npm run cms:a11y` starts a private, read-only CMS instance on a spare loopback port and opens it in Chrome (the same browser channel as the Playwright end-to-end tests). It runs axe-core, including color contrast, on every page, a record of each editable kind, a municipality guide, and each reference kind, with every tab opened, at 1280px and 375px widths. It then walks the core flow by keyboard: skip link, page navigation, opening a record, arrow keys between tabs, and a visible focus outline. It exits non-zero on any violation. Run it after interface changes.

The interface provides a skip link, a labeled page navigation with `aria-current`, focus moved to the page heading on navigation, labeled fields with help disclosures, keyboard-operable tabs, text for every status (color is never the only cue), and stacked layouts at narrow widths. An automated pass does not replace a screen-reader walkthrough (for example NVDA with Chrome) of editing, previewing, and approving a record; do one before relying on the CMS for approvals with assistive technology.

## Removing the CMS and exporting content

The CMS holds no content of its own. Articles, structured records, approvals, and translations stay in their canonical repository files, and Git is the record of every change, so there is nothing to export or migrate. To remove the CMS, delete `tools/cms`, `scripts/cms.ts`, `scripts/cms-a11y.ts`, and `scripts/check-cms-build-exclusion.ts`; the `cms`, `cms:check-build`, and `cms:a11y` entries in `package.json`; the `tools/cms` pattern in `vitest.config.ts`; and optionally the `axe-core` dev dependency and the local `.cms/` directory.

Demonstrated on 2026-09-28 in a throwaway worktree holding the current working tree with those files removed: `npm run build` after a clean `npm ci` (37 route entries), and `npx tsc --noEmit`, `npx vitest run` (121 files, 405 tests), `npm run editorial:audit`, and `npm run local-guidance:ja -- check` all passed.

## Acceptance status

Against the release gates in [the requirements](../../docs/LOCAL-CMS-REQUIREMENTS.md) §11:

| Gate | Status |
|---|---|
| Representative article and structured-record edit through the local flow | Done for article bodies and supported structured fields. |
| Article formatting controls with lossless MDX round trip | CMS-1 ready for commit after Claude review: supported blocks edit directly; five real articles round-trip unchanged through formatted/source modes; every editable block in every current article reproduces its normalized source. Unsupported constructs and formatting the editor cannot preserve remain locked and named. Full website-component preview remains separate. |
| Validation checks from the local interface | CMS-2 implemented locally: fixed named checks with explicit start, scoped results, warnings, output, duration, exit code, and cancellation. Build and CMS exclusion are one ordered gate; local-guidance generated files get a dirty-file preflight. Broader automatic check selection remains later work. |
| Dependency, impact, and translation handoff views | CMS-3 implemented locally: source-to-dependent and content-to-source views use the repository source dependency graph, with unknown FAQ coverage labeled. The deterministic plain-text handoff includes stale or missing Japanese article, FAQ, residence-status, glossary, and municipality-guidance artifacts. |
| Local activity and recovery | CMS-4 implemented locally: metadata-only append log and revision-addressed drafts in gitignored `.cms/`; a recovered draft is shown beside canonical content and cannot be silently replayed. Stale drafts require manual reconciliation. In-interface worktree creation remains optional and deferred. |
| Remaining catalog visibility | CMS-5 implemented locally: official sources, guided journeys, article groups, and annotated document families appear in a separate inspect-only reference workspace. Their records remain in their authoritative registries; the matrix below lists actual per-kind support. |
| Municipality guidance | CMS-6 implemented locally: registered location/guide matrix, per-supplement Japanese currency and provenance, and guarded English prose edits in one location file. Action text can be edited without changing action count. Source/recheck/geography/registration/Japanese files, status, and approval remain outside this editor. Location-specific link/evidence checks and verify remain explicit commands. |
| Catalog, record, source, change-review, and activity views | CMS-7 implemented locally: hash-routed pages (Overview, Content, Municipality guidance, Sources & references, Translations, Checks, Changes, Activity) with a sticky navigation bar and counts; one record header and tab order (Edit, Review & approve, Linked articles, Sources, Details) for every editable kind; paged long lists; search that explains non-title matches. The Overview derives its attention items from the current checkout, and a restart notice appears when a data module changes outside the CMS. |
| Record creation | CMS-9 implemented locally: FAQs and direct glossary terms can be created or duplicated with an exact-text preview, full schema and collection validation, a previewed-revision check, and the dirty-file guard; fixture tests cover creation, unchanged surrounding source, duplicates, unknown references, stale previews, dirty modules, and the HTTP session checks. |
| Article and source creation | CMS-10 implemented locally: articles (MDX file plus registry import and entry, rolled back together) and official sources, with previews of every written line, schema and collection validation, previewed-revision checks, and the dirty-file guard. Fixture tests cover creation, unchanged surrounding source, duplicates, unknown references, unsupported bodies, stale previews, existing files, and rollback; an end-to-end check built a CMS-created article with the production build. |
| Operational closure | CMS-8 implemented locally: setup, pages, records, data freshness, security boundary, recovery, accessibility, and removal are documented here; the removal demonstration and the production build with `cms:check-build` pass. |
| Accurate status and translation-staleness display | Done for articles, FAQs, residence statuses, glossary terms, and municipality supplements. Reference catalogs appear inspect-only without CMS editorial status. |
| No data loss with a pre-existing dirty tree or concurrent edit | Shared process-local file locks serialize CMS body, status, structured, municipality, and approval writes through revision re-read, replacement, bookkeeping, and rollback. A checkout-wide creation lock covers collection validation, writing, and registration, preventing duplicate IDs across modules. Dirty-file refusal and external revision checks remain; run one CMS server per checkout. Regression tests use temporary Git fixtures. |
| Blocked stale approval and explicit human approval path | Done: approvals bind the exact revision, and edits return records to editorial review. |
| Meaningful accessibility checks | Automated: `npm run cms:a11y` reports no axe violations on every page, record kind, guide, and reference kind with every tab opened, at desktop and phone widths, and its keyboard walkthrough passes. A human screen-reader walkthrough remains to be done (see [Accessibility](#accessibility)). |
| Production build contains no CMS endpoint | Done: source check in the test suite, and `npm run build` followed by `npm run cms:check-build` passes (2026-09-28). |

Not built (optional in requirements §8): isolated worktree creation from the interface, commit-message preparation, and selected-file staging; use Git directly. Full website-component preview, richer structured metadata editing, and adding or removing local-guidance actions through the CMS are also still to come.

## Review fixes after CMS-10

- All CMS canonical writers use the shared file lock, and creation uses one checkout-wide lock. Concurrent stale writes report a conflict rather than replacing a successful edit; concurrent creations cannot both register the same ID in different modules.
- Article preview, save, and creation compile the proposed MDX with the default options used by `next.config.ts`, plus an editor subset check. Inline expressions and JSX are rejected with line and column information; escaped braces and braces inside code remain valid. No MDX is executed during validation.
- Creation routes identify their form kind, replace a different kind, and preserve edits when revisiting the same form. The accessibility audit waits for the specific kind and heading before scanning each creation form.
- The long CMS UI regression flow has a 30-second timeout to accommodate full-suite parallel load. Splitting that flow into smaller tests remains a future cleanup.

Verified after these fixes: CMS tests (19 files, 86 tests), full tests with two workers (140 files, 491 tests), TypeScript, ESLint, editorial audit, and `cms:a11y` all pass. The production build and `cms:check-build` pass in an isolated copy of the current checkout, with only its Turbopack filesystem root adjusted to resolve the shared installed dependencies; the active dev server's `.next` is untouched.

## Catalog capability matrix

The inspect-only reference workspace reads the effective registered values. Its registry path identifies the assembly module; a record's literal may live in an imported module. No source, journey, group, or annotated-document mutation endpoint exists in CMS-5. The Checks page runs named repository commands and does not imply that a displayed record has passed a dedicated editorial review.

| Catalog | Inspect | Edit in CMS | Status and approval in CMS | Preview in CMS | Create in CMS |
|---|---|---|---|---|---|
| Articles | Yes | Draft/needs-review MDX body | Status and exact-revision human approval | Supported blocks; components are placeholders | Yes; article group and journey membership stays in code |
| FAQs | Yes | Question and summary | Status and exact-revision human approval | Editable content approximation | Yes, or duplicate an existing FAQ |
| Residence statuses | Yes | Selected English prose fields | Status and exact-revision human approval | Editable content approximation | No |
| Glossary terms | Yes | Selected English definition/context fields; direct English names | Status and exact-revision human approval | Editable content approximation | Direct entries, or duplicate an existing term; builder-generated terms stay in code |
| Official sources | Yes | No; use source workflow | No; source monitoring and review use separate workflow | Official URL only | Yes |
| Guided journeys | Yes | No | No | No | No |
| Article groups | Yes | No | No | No | No |
| Annotated document families | Yes, including variants and versions | No | No; version review state is displayed only | No | No |
| Municipality guidance | Yes; location/guide matrix and supplement details | English prose and existing action text only | No; schema keeps `needs-review` | English editor with source and recheck context, no full site preview | No |

## Implementation rules

These apply to every CMS change, including the checkpoints in [the roadmap](../../docs/ROADMAP.md#next-checkpoint--local-editorial-cms). They come from reviewing the first slices.

**Writes**

- All canonical replacements share `withCmsFileLock` from `write-locks.ts`; hold the lock through the revision re-read, replacement, bookkeeping, and approval rollback. Creation also holds `withCmsCreationLock` through collection validation, persistence, and session registration. These are process-local locks: run one CMS server per checkout. External editors do not participate in these locks, so keep the dirty-file guard and revision checks.
- Every write goes through the existing pattern: validate IDs and revisions, re-read the file, compare the expected revision (and, for shared TypeScript modules, the whole-file revision), call `guardCmsWrite` before writing, write a temporary file in `.cms/`, re-check the revision, rename atomically, then call `noteCmsWrite`. New approval or record files use a create-only operation (`link` or `wx`) so an existing file is never replaced.
- Change only the targeted literal ranges and registration lines. Never reformat a whole module, reorder records, or rewrite a file to add support for it.
- Every new write endpoint requires the session token and the exact `Origin`, keeps the loopback `Host` check, and validates its payload on the server; UI checks are never the only check.

**Rules and data**

- Never copy a rule or default from a data module or script into the CMS. Import it, exporting it from its owner if needed (as with `residenceStatusDefaults`, `glossaryBuilderDefaultStatus`, and `defaultFaqDates`). If a value can only be derived by duplicating logic, stop and add a shared export first.
- Translation currency for any kind uses `createTranslationSourceRevision` from `src/lib/translation/source-revision-core.ts` over the fields in `src/domain/translation/translation-source-fields.ts`. A new translatable kind gets a selector there, and its catalog test uses the same selector. Do not hard-code field lists in the CMS.
- Status and review semantics come from `docs/EDITORIAL-WORKFLOW.md` and the domain schemas. The CMS never writes `verified` except through the explicit approval action, and never creates, edits, or re-dates Japanese artifacts.
- Discover records through registries and index modules, never through folder-name heuristics or fixed counts.

**Tests**

- Test every write path in a temporary fixture that is initialized as a Git repository (see `cms.test.ts` and `git-session.test.ts`), including a stale-revision rejection, a dirty-file refusal, and an unchanged-neighbors check. Never run write tests against the real checkout.
- Do not commit records produced by manual trials. Try approvals and edits in a throwaway worktree, or remove the trial's approval file and restore the record before committing; an approval file claims a real human decision.
- Keep `tools/cms` out of `src/`: the production-boundary test must stay green, and `npm run build` plus `npm run cms:check-build` must pass before a checkpoint is marked done.
- Run `npx vitest run tools/cms`, `npx tsc --noEmit`, `npx eslint scripts/cms.ts tools/cms`, and `npm run editorial:audit`, plus the full `npx vitest run` when a shared module changes.

**Documentation and coordination**

- Update the acceptance-status table above and the roadmap's CMS entry in the same commit as the change, stating what remains partial.
- Claude and Codex may work in the same checkout. The CMS refuses files that were dirty when it started, so run it from a separate worktree when others have uncommitted work, and never discard, stash, or commit another agent's changes.

## Municipality guidance support

Japanese translation of municipality guidance uses one file per location so several agents can translate in parallel; Codex drafts assigned locations and Claude checks them (`content/translations/LOCAL-GUIDANCE-TRANSLATION.md`). The CMS-6 adapter follows this contract. It reads registered English and Japanese locations, displays translation currency and generator provenance separately from the `machine-translated` review state, and writes only supported English text fields through the Git-session guard. The location-specific link/evidence command is displayed for manual execution; a save does not claim that command passed. Unsaved local-guidance edits do not yet use the CMS-4 recovery snapshots.

- **English (exists):** one file per location at `src/data/local-guidance/locations/<prefecture>/<city>.ts`, built with `defineLocationGuidance`, registered in the prefecture's `index.ts` and in `locations/index.ts`. Supplement status is always `needs-review`; the schema allows nothing else, so the adapter offers no status or approval actions for supplements.
- **Japanese:** one file per location at `src/data/translations/ja/local-guidance/<prefecture>/<city>.ts`, built with `defineLocalGuidanceTranslations` from `define.ts`. Read them through `japaneseLocalGuidanceLocationTranslations` (per location, with `locationId`, `entries`, and `artifacts`) or `japaneseLocalGuidanceTranslations` (flat artifacts) from `src/data/translations/ja/local-guidance/index.ts`; never scan the folders. Artifacts use content kind `local-guidance-supplement`, `contentId` = supplement ID, path-keyed `fields`, and `reviewState: "machine-translated"`. `entries[].generator` is `codex-drafted` (not yet checked by Claude), `codex-drafted-claude-reviewed`, or `claude-code-claude-reviewed`; show an unchecked Codex draft as such.
- **Currency:** a supplement's Japanese artifact is current when its `sourceRevision` equals `createTranslationSourceRevision` (from `source-revision-core.ts`) over `translationSourceFields["local-guidance-supplement"]`. The adapter shows current, stale, or missing per supplement and lists stale or missing ones in the translation handoff view, matching `npm run local-guidance:ja -- status`. It never writes these files; `integrate` and `review` do.
- **Edits:** English edits change only the targeted supplement fields in one location file, follow the write rules above, and must pass `npm run local-guidance -- check --location <id> --links --evidence`. The adapter does not edit sources, recheck items, geography, or registrations; those stay in the `npm run local-guidance` workflow (`docs/LOCAL-GUIDANCE-WORKFLOW.md`).
