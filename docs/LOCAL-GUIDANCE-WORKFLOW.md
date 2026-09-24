# Local guidance research workflow

How to add municipality-specific supplements to a national guide (for example Bunkyo's National Health Insurance
procedure on `joining-national-health-insurance`). The workflow is the same for any agent or person, and the
`local-guidance` script does the mechanical parts so research time goes to reading official pages and writing.

## Commands

```bash
npm run local-guidance -- coverage
npm run local-guidance -- worksheet --article <guide-id> --next 3        # or --wards jp-13105,jp-13106
npm run local-guidance -- fetch <url> [<url> ...] [--keywords 国保,加入] [--follow] [--out <dir>]
npm run local-guidance -- check [--article <guide-id>] [--only <id,id>] [--links] [--evidence]
npm run local-guidance -- verify
```

- **coverage** lists, for each guide that takes local supplements, how many selectable locations have one and
  which come next in administrative code order.
- **worksheet** writes `.local-guidance/<batch>/WORKSHEET.md` for one guide and a few locations: names and IDs,
  each location's official host, sources already on record for it, the guide's general fallback advice, the
  conventions, an existing supplement as a model, and ready-to-run fetch commands.
- **fetch** downloads pages (decoding Shift_JIS and EUC-JP), reduces each to compact Markdown text (headings,
  lists, one line per table row, the page's stated date), and saves it. With `--keywords` it lists matching links;
  with `--follow` it also opens same-site category pages (くらし, 手続き, 健康, …) linked from the start page, which
  is how to get from a home page to a procedure page. PDFs and other files are reported, not extracted.
- **check** validates supplements: sources exist, one supplement per location and guide, the location is
  selectable, Japanese sources carry a `sourceFormatNote`, and source hosts match the location's official domain.
  `--links` fetches every cited page and fails on unreachable ones. `--evidence` confirms that each deadline, clock
  time, and yen amount stated in the English appears on a cited page. Errors fail the command; warnings are for a
  researcher to judge.
- **verify** is the whole verification for a research batch: it finds the supplements changed since the last
  commit, runs `check --links --evidence` on only those, runs the three data tests, and prints a few lines.
  Network errors are retried once.

Output lives in `.local-guidance/` (gitignored).

## One batch

1. `coverage`, then `worksheet --article <guide> --next 3` (three locations per batch keeps review manageable).
2. Run the worksheet's fetch commands. Open the listed procedure links with `fetch <url> --out <same folder>`.
   **Read the saved `.md` files, not the live pages.** A procedure page is typically 3–10 KB of text this way.
3. Write the supplements in `src/data/local-guidance/<topic>.ts` (code order) and any new sources in
   `src/data/sources/municipal-identity.ts`, following the worksheet's conventions and model record.
4. Record the batch in `docs/research/` (inspection date, one row per location: linked evidence and the claim
   boundary) and name the next locations.
5. `npm run local-guidance -- verify`. Fix every ERROR; judge each warning.

## Verification budget

A data-only batch (supplements, sources, research notes) needs **only** `npm run local-guidance -- verify`. The
tests check rules rather than inventories, so **a new batch needs no test edits**. For a data-only batch, **do not
run**:

- the full `vitest` suite or other test folders;
- `tsc`, `eslint`, or `npm run architecture:check` (the records are validated by schemas in the data tests);
- Playwright (`e2e/`), `next build`, or the localization audits;
- `check` over every supplement, or `git diff --check` as a separate step.

Run those only when you change code: `scripts/local-guidance.ts`, `src/lib/editorial/local-guidance-research.ts`,
components, or schemas. The browser tests cover the finder and panel behavior once, not each location's text.

## Rules

- Use the location's own official pages (or national government pages). Prefer the current Japanese procedure page
  to an older English overview, and note the page's date.
- A supplement adds only what is local: office and counters, filing period, documents that differ, online or postal
  routes, and local exceptions. The national guide keeps eligibility and general rules. Link to premiums, fees, and
  schedules instead of copying them.
- Every concrete deadline, time, or fee must be on a cited page. If `--evidence` reports one missing, either cite
  the page it comes from or remove it.
- New supplements stay `needs-review`. Do not create or change Japanese translation artifacts; Japanese for local
  guidance is translated in one batch after the English is stable.
- Only selectable locations can take supplements. A location outside `src/data/local-guidance/geographies.ts` must
  be added there first (the worksheet says so).
