# N2 Stage-B practical-basics rich-text contract

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-30.
Base: `04814ca91be62eb10a70bb9677b87527aa38cb7b` (table contracts, pushed; review pending).
Status: portable practical-basics contract implemented; review/integration pending. No canonical data file,
production consumer, renderer extraction or component bundle payload is added.

## Contract

- New `src/domain/article/article-practical-basics.ts` defines schema-version-1 `japan-practical-basics`
  content: ordered paragraphs with unique stable IDs and complete English/Japanese segment arrays.
  Segments are strict `text`, `strong` and `link` records. Strings are literal content, not Markdown/JSX/HTML;
  validation never trims, reorders, decodes or rewrites them. Whitespace inside text remains deliberate.
- Each paragraph requires a leading strong label and nonempty body content. Link labels and strong labels
  are nonblank. Undeclared properties, missing locales, duplicate IDs, empty bodies and unsupported node
  kinds fail. This bounded structure matches current practical-basics copy; new rich constructs require
  an explicit contract change rather than silent dropping.
- Article links have exact `/articles/<slug>` hrefs, resolved against caller-supplied canonical article
  slugs. Each paragraph's link targets and order must agree across locales, preserving emergency/disaster
  navigation while permitting different literal wording/spacing. IDs are not assumed to equal slugs.
- This content model imports only Zod. It does not reuse display-parser offsets or interpret Markdown
  embedded in a text segment. Consumers must render strings as escaped text, never inject them as HTML.
  Styling, paragraph/strong/link semantics and native URL handling remain consumer responsibilities.
- Proposed paragraph IDs `time`, `money`, `measurements`, `emergencies` derive from existing English labels
  in the read-only fixture. They are not adopted into canonical sources; Stage-C owners must review them
  before extraction. Complete bilingual schema validation does not approve the existing Japanese copy,
  generate translations or invent artifact provenance. Claude retains Japanese ownership and final checks.

## Read-only fixture and verification

- Test-only TypeScript syntax-tree inspection reads the literal JSX paragraphs in
  `src/components/content/japan-geography-reference.tsx`. It recognizes current text/strong/Link literals,
  executes no JSX or component module, and writes no content file. Unsupported fixture expressions/elements
  fail explicitly. This is scoped to the current literal owner, not a generic JSX extraction tool; future
  entities/multiline JSX or owner changes need explicit fixture and rendered-parity verification.
- The current four paragraph pairs validate unchanged, with exact label/text/link order and wording.
  Emergency paragraphs retain both article links and intervening/trailing text in each locale. Counts
  are observations, not permanent catalog requirements. Serialization preserves the complete content model.
- Negative cases cover locale/label/body/ID coverage, empty text, unknown fields, cross-locale link order,
  malformed hrefs and absent article targets. A separate ID/slug fixture checks correct link resolution;
  a literal Markdown-looking text fixture confirms text is not implicitly interpreted or trimmed.
- Focused practical-basics/table/inline suites: **66 tests / three files**. TypeScript, full lint,
  architecture (**709 production modules**) and whitespace passed with existing dependencies.
  Full four-worker suite: **916 tests / 173 files**, all passed.
- No generation, production build/browser, clean install, SQL, translation audit, hosted call, email or
  schedule ran. Format remains 9 / 28 files. Existing CMS tests run in the full suite; serialization is
  unchanged. Reviewed integration remains `e4fc1ff`. Main/activation unchanged.

## Remaining gates

Three N2 component contracts now exist (tax table, training table, practical basics), alongside the standalone
inline parser. Actual canonical copy extraction, web/native rendering, export alignment, Japanese checks
and N1 component payloads wait for reviewed Stage-C ownership handoff. N1/N2 final acceptance remains open.
Exact checkpoints and consolidated docs await Claude; do not integrate the unreviewed branch head.

Next independent work: review the parser/data contracts together and prepare the concrete Stage-C handoff,
including protected checklist handling and proposed paragraph IDs, before changing any consumer.
