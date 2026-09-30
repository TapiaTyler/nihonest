# N2 inline parser edge-case follow-up

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-30.
Base: `ca87cf61df7a3486a9735ab4edad8380f9ad5e17` (standalone parser, pushed; review pending).
Status: confirmed parser gaps fixed; exact review/integration pending. No production consumer is wired.

## Findings and fixes

- Intraword underscores were checked on opening but could close outer formatting. At the base commit,
  `_one_word_` became emphasis over `one` followed by literal `word_`. Closing and opening now share the
  intraword rule. English/Japanese words and supplementary Unicode letters keep internal underscores
  inside the outer emphasis/strong span. Offsets remain UTF-16; Unicode boundary checks use full code points.
- Excessive delimiter runs could satisfy the closer before the existing unsupported-run rule was reached.
  Closing runs longer than three now remain protected; e.g. `**value****` cannot silently become a valid
  bold span plus trailing delimiter text. The documented supported nesting/triple-delimiter cases still pass.
- Repeated unclosed `<` or `{` syntax previously searched the remaining input at every character. It now
  protects the remaining raw input in one span, matching the conservative behavior of other unclosed syntax.
  This removes that repeated-scan path. No general complexity/performance guarantee is claimed.
- The existing punctuation escape fixture now also asserts exact decoded display text. No canonical
  article, Japanese artifact, renderer, exporter or CMS serialization change; tree kinds and public API stay.

## Verification

- Focused inline/corpus/existing block-parser suites: **47 tests / three files**, including eleven new
  intraword/excessive-close/repeated-unclosed cases plus the strengthened escape assertion.
- TypeScript, full lint, architecture (**707 production modules**) and whitespace passed with existing
  dependencies. Full four-worker suite: **891 tests / 171 files**, all passed.
- Corpus probe again covered **6,187 text units**, with exact raw reconstruction and the same **30 protected
  `[ ]` blanks** (15 per locale). Counts are observations; their explicit renderer acceptance is still pending.
- No generation, production build/browser, clean install, SQL, translation audit, hosted call, email or
  schedule ran. Format remains 9 / 28 files; parser is still standalone. Existing CMS tests run in the full
  suite; CMS serialization stays unchanged. Reviewed integration remains `e4fc1ff`; main/activation unchanged.

## Read-only component inventory for the next contract step

- Tax scope currently has three stable row IDs, bilingual classification/scope pairs, a caption and two
  headers in `src/components/content/tax-residence-scope-table.tsx`. Its future portable contract must keep
  row IDs/order, exact copy and accessible caption/header roles.
- Training routes currently have seven stable row IDs, bilingual activity/route/suffix tuples and article
  hrefs in `src/components/content/training-route-comparison-table.tsx`. Empty suffixes are deliberate;
  extracting only the main route title would lose text. Captions/headers also need their own preserved fields.
- Practical basics currently have four bilingual React paragraphs with strong labels and emergency/disaster
  links in `src/components/content/japan-geography-reference.tsx`. The portable representation must preserve
  text/link ordering and labels. Existing plain prefecture region data is separate from those paragraphs.
- These observations do not transfer ownership or authorize renderer edits. Stage B can define new portable
  data contracts; actual copy extraction, Japanese checks, renderer wiring and bundle payloads require the
  Stage-C handoff. No component source was changed. Interface/message ownership remains Claude's.

N1/N2 final acceptance stays open. Review the exact follow-up and its pending ancestors separately; do not
integrate the unreviewed branch head. Next independent work is the Stage-B data contract preparation above.
