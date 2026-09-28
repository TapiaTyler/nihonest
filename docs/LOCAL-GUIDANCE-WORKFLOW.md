# Local guidance research workflow

How to add municipality-specific supplements to the national guides (for example Bunkyo's National Health
Insurance procedure on `joining-national-health-insurance`). The workflow is the same for any agent or person, and
the `local-guidance` script does the mechanical parts so research time goes to reading official pages and writing.
Which locations to cover, and in what order, is set in [LOCAL-GUIDANCE-COVERAGE-PLAN.md](LOCAL-GUIDANCE-COVERAGE-PLAN.md).

## Layout: one file per location

Research is done **by location**: all seven guides for one city in one batch, so the city's site structure, office
names, and foreign-resident pages are learned once. Each researched location has its own file:

```text
src/data/local-guidance/locations/
├── index.ts               one line per prefecture folder
├── tokyo/
│   ├── index.ts           the prefecture entry and one line per location
│   ├── chiyoda.ts
│   └── …
└── aichi/
    ├── index.ts
    └── nagoya.ts
```

A location file (`defineLocationGuidance`) holds everything for that location:

- `geography`: its selector entry (`id`, English `name`, `aliases`; `planGroup` for cities outside Tokyo that are not
  designated cities);
- `sources`: the official pages only this location cites. Organization defaults to the location's name and authority
  to municipal government. A page that an article or another location also cites belongs in `src/data/sources`;
- `supplements`: one per guide, ID `<location>-<guide>`. Records omit `geographyId`, which the file supplies;
- `recheck`: items to check later (see Rules).

`docs/LOCAL-GUIDANCE-RECHECK.md` and the status table in the coverage plan are **generated** from these files by
`npm run local-guidance -- generate`, which `verify` also runs. Never edit them by hand.

## Working in parallel

Two agents (or people) can research at the same time because each location's research touches only its own file.

- Assign work by prefecture or by location, never by guide. Each agent edits only the location files it was
  assigned, plus the one-line registrations `add-location` makes.
- Work in separate git worktrees or branches. When merging, the only expected conflicts are one-line additions to an
  `index.ts` (keep both lines) and the generated docs (take either side, then run `npm run local-guidance -- generate`).
- Put new shared sources (cited by an article or several locations) in `src/data/sources` only when needed, and
  mention them in the batch report; that file is shared.

## Commands

```bash
npm run local-guidance -- coverage
npm run local-guidance -- add-location <id> [--aliases A,B] [--plan-group prefectural-capital|major-city]
npm run local-guidance -- worksheet --location <id>
npm run local-guidance -- fetch <url> [<url> ...] [--keywords 国保,加入] [--follow] [--out <dir>]
npm run local-guidance -- check [--location <id>] [--article <guide-id>] [--only <id,id>] [--links] [--evidence]
npm run local-guidance -- generate
npm run local-guidance -- verify
```

- **coverage** lists, for each guide, how many selectable locations have a supplement and which come next.
- **add-location** creates `locations/<prefecture>/<location>.ts` from the registry ID (e.g. `jp-14100` for
  Yokohama), registers it in the prefecture's `index.ts`, and creates the prefecture folder the first time. The
  location must be in the geography registry (`src/data/geography`); cities outside Tokyo that are not designated
  cities need `--plan-group`. Then run `npm run local-guidance:ja -- sync` to create the location's Japanese translation file
  (`content/translations/LOCAL-GUIDANCE-TRANSLATION.md`); the translation catalog test requires one per location.
- **worksheet --location** writes `.local-guidance/location-<name>/WORKSHEET.md` for every guide at once: the
  location's IDs and file, official host, which guides exist, each guide's keywords and general fallback advice, the
  conventions, a model file, and a fetch command. (`worksheet --article <guide> --wards <ids>` still makes a
  single-guide sheet.)
- **fetch** downloads pages (decoding Shift_JIS and EUC-JP), reduces each to compact Markdown text (headings,
  lists, one line per table row, the page's stated date), and saves it. With `--keywords` it lists matching links;
  with `--follow` it also opens same-site category pages (くらし, 手続き, 健康, …) linked from the start page, which
  is how to get from a home page to a procedure page. PDFs and other files are reported, not extracted.
- **check** validates supplements: sources exist, one supplement per location and guide, the location has a file,
  Japanese sources carry a `sourceFormatNote`, and source hosts match the location's official domain. `--links`
  fetches every cited page and fails on unreachable ones. `--evidence` confirms that each deadline, clock time, and
  yen amount stated in the English appears on a cited page. Errors fail the command; warnings are for a researcher
  to judge.
- **generate** rebuilds the recheck schedule and the coverage plan's status table from the location files.
- **verify** is the whole verification for a research batch: it regenerates the docs, finds the supplements changed
  since the last commit (every record in a new location file counts), runs `check --links --evidence` on only those,
  and runs the data tests, including the location-layout rules and the unused-source check.

Output lives in `.local-guidance/` (gitignored).

## One batch (one location)

1. `coverage`, then `add-location <id>` for a new location and `worksheet --location <id>`.
2. Run the worksheet's fetch command and fetch the procedure pages you choose with `fetch <url> --out <same folder>`.
   **Read the saved `.md` files, not the live pages.** A procedure page is typically 3–10 KB of text this way.
3. Write the location's sources, supplements, and recheck items in its file, following the worksheet's conventions
   and the model file.
4. Record the batch in `docs/research/<PREFECTURE>-<LOCATION>-<n>.md` (inspection date, one row per guide: linked
   evidence and the claim boundary).
5. `npm run local-guidance -- verify`. Fix every ERROR; judge each warning. Commit the regenerated docs with the batch.

## Verification budget

A data-only batch (location files, research notes) needs **only** `npm run local-guidance -- verify`. The tests
check rules rather than inventories, so **a new batch needs no test edits**. For a data-only batch, **do not run**:

- the full `vitest` suite or other test folders;
- `tsc`, `eslint`, or `npm run architecture:check` (the records are validated by schemas in the data tests);
- Playwright (`e2e/`), `next build`, or the localization audits;
- `check` over every supplement, or `git diff --check` as a separate step.

Run those only when you change code: `scripts/local-guidance.ts`, `src/lib/editorial/local-guidance-research.ts`,
`src/data/local-guidance/define-location.ts`, components, or schemas. The browser tests cover the finder and panel
behavior once, not each location's text.

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
- Research a designated city (Nagoya, Osaka, Yokohama, …) at city level: the city runs these procedures and its
  administrative wards are counters. Ward records are not kept in the geography registry, and the selectors list
  the city once; the panel and finder add a note that each ward office may have its own procedures and local
  details. Write the city's supplements so they hold for every ward, and point to the ward office where a detail
  (counter, collection days, evacuation sites) depends on the address.
- Add a `recheck` item to the location file when a supplement states something tied to a date (`dated`: an opening
  or rule change), a tax-year deadline or channel (`tax-year`), cites a page older than about two years or undated
  (`old-source`), or when the pages did not give something worth adding later (`gap`). Remove the item when resolved.
