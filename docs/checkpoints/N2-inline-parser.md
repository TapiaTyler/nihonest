# N2 Stage-B standalone inline parser

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-30.
Base: `2c6a95d1121696cd078bf6b696d884a553e97662` (N1 inventory, pushed; review pending).
Status: standalone parser contract implemented. Renderer/export integration and component data are pending;
N2 and N1 final acceptance remain open. No production consumer is wired in this checkpoint.

## Display grammar

- New `src/domain/article/article-inline.ts` exports `parseArticleInline` and the portable `ArticleInline`
  union. Nodes contain kind, exact raw source, UTF-16 start/end offsets, and display text or child nodes.
  No React, Next, filesystem, browser, CMS, translation registry or database dependency. `URL` is used only
  as the standard platform URL parser for absolute destinations, not for network access.
- Supported syntax: `*emphasis*`, `_emphasis_`, `**bold**`, `__bold__`, nested emphasis/bold including triple
  delimiters, punctuation escapes, exact-length backtick code runs and inline links with formatted labels.
  Code text stays literal, including markup and bracket characters. Quotes and ordinary text are preserved.
- Link destinations allow root-relative paths, fragments and valid HTTP/HTTPS URLs. Balanced destination
  parentheses and escaped parentheses are supported. Original destination spelling is retained except
  escaped parentheses are decoded for the href. The existing `]\(` link-opening convention is accepted
  for Japanese renderer compatibility. Protocol-relative links, unsupported schemes, whitespace/title
  syntax, images and nested links become protected spans. This is intentionally not all of CommonMark.
- Unsupported HTML/autolinks, MDX expressions, reference links, malformed/unclosed markup and excessive
  delimiter runs remain explicit `protected` nodes with raw source and a reason. An unclosed construct
  may protect the remainder of the input conservatively. No HTML/MDX execution, content dropping or rewrite.
  Consumers must explicitly handle protected nodes before claiming display/export acceptance.
- Input is limited to 200,000 UTF-16 units and parser nesting to 32 levels; exceeding a bound throws.
  This display model must not serialize or rewrite CMS source, locked blocks or byte-preserving content.
  The existing block parser/converter, exporter and React renderer are unchanged.

## Real corpus observations and remaining integration

- Corpus fixture reads canonical MDX through the existing exporter conversion and selects current Japanese
  portable articles. It exercises heading/paragraph/quote/list text and checks component identities without
  pretending component directives are inline text. Every top-level raw span reconstructs the exact input;
  nested offsets match source slices and trees survive JSON serialization. Original evidence stays unchanged.
- Current snapshot: **6,187 inline units**, with **30 protected `[ ]` checklist blanks** (15 English / 15
  Japanese). Counts are observations, not fixed acceptance requirements. No other protected construct was
  observed. Checklist blank presentation needs an explicit literal/protected renderer decision at integration.
- Synthetic tests additionally cover code runs, nested formatting, escapes, brackets inside code labels,
  balanced URLs, unsupported markup/destinations, serialization and oversized input. They are parser fixtures,
  not new translations or changes to canonical wording.
- Stage C must connect the shared parser to English/Japanese web/native display and export validation,
  including handling protected nodes. Native URL/navigation behavior and component payloads remain separate.
  Substantive tax/training/geography copy and renderer ownership still require the agreed handoff from Claude.

## Verification

- Focused inline/parser-corpus/existing block-parser suites: **36 tests / three files**.
- TypeScript, full lint, architecture (**707 production modules**) and whitespace passed with existing
  dependencies. Full four-worker suite: **880 tests / 171 files**, all passed.
- This standalone module does not change bundle generation or consumers. Format remains 9 / 28 files;
  no new generation, production build/browser, clean install, SQL, translation audit, hosted call, email or
  schedule is claimed. CMS code and serialization contracts are unchanged; existing CMS tests run in the
  full suite. Reviewed integration remains `e4fc1ff`; exact checkpoints/docs await Claude. Main/activation unchanged.

Next independent work: harden parser edge cases and define Stage-B component data contracts within ownership
limits. Actual renderer extraction, Japanese catalog edits and component payload wiring wait for Stage C.
