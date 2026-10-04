# N2 translated article inline renderer alignment — 2026-10-04

Implementer: Codex. Base: `4935086`. Checkpoint awaits Claude review and integration. Production dependency
is the already reviewed shared inline parser; the unrelated standalone interface-pack preparation inherited
from this base is not consumed by this change and remains separately pending review.

## Audit and change

The translated article renderer previously supported only regex-based bold and simple links. A read-only
probe covered **6,187 text units** from 97 English and 97 current Japanese portable articles (3,104 / 3,083).
It found **35 English-unit differences**, chiefly literal emphasis delimiters, when these portable fixtures
were passed through the translated renderer. Current English pages use compiled MDX, so this is not a claim
of 35 defective live English paragraphs. The Japanese corpus had zero semantic differences. Each locale
contains 15 units with protected form-blank syntax, retained as visible text.

`src/components/localization/localized-article.tsx` now renders `parseArticleInline` nodes recursively:
text, strong/emphasis, code and formatted links. It retains existing strong/link classes and the escaped
link-opening convention, adding reviewed grammar support for nested formatting, punctuation escapes,
balanced destination parentheses and fragment links. Unsupported/protected spans render their original raw
text through React, never HTML or evaluated MDX. Adjacent literal/protected spans coalesce so form blanks
do not introduce new text boundaries. Parser size/depth failures propagate; unknown future node kinds fail.

English MDX rendering, article/block parsing, bundle format/payloads, catalogs, Japanese artifacts and CMS
serialization are unchanged. Portable exports still retain inline strings. This aligns one web consumer with
the shared grammar; it does not establish complete MDX/CommonMark parity or final N1/N2/native acceptance.

## Focused evidence

- Before/after static markup of **all 97 current Japanese article bodies is byte-identical**, using stable
  placeholders for all component blocks. This independently checks inline/block wrappers, not component
  markup or translation editorial quality. The temporary probe was removed; captures are retained only
  in the external artifact directory. Claude's independent final Japanese checks remain required.
- Seven new tests cover nested/label formatting, escapes/fragments/balanced links, inert code, headings/
  quotes/lists, explicit raw protected syntax and unsafe-link rejection, parser limits and every current
  portable text unit's rendered text/link/tag semantics. The 6,187-unit test exercises both locales without
  changing source or artifacts and verifies the protected path is actually reached.
- Focused new/existing translated renderer, shared parser and corpus suites: **64 tests / four files passed**.
  A temporary restoration of the exact `4935086` renderer made **all seven new tests fail**; restored afterward.
- TypeScript, targeted ESLint, architecture **720 production modules** and whitespace passed. TypeScript
  required an explicit link-kind branch because the parser union groups text/code; an unknown-kind failure
  remains explicit. No dependency change, service fixture, hosted call or real email.

The committed source will receive the full local release gate in the owned LF validation checkout; its
exact source/results are recorded in the subsequent consolidated verification update. No integration
advance is authorized before Claude review. Format 10 remains gated on Claude's fee component/parity work.
No main merge, activation or scheduling.

## Full committed-source release verification

Exact source **`be231dd67f07c8f6c2a9c55b8bb27461aa865350`** ran
`npm run release:check -- --target local` in the owned detached LF validation checkout
`stage-c-validation-9b5d937`, checked out to that exact hash with zero CRLF files and no tracked edits.
All **13/13 checks passed in one invocation**: **1,140 tests / 189 files**, architecture **720 modules**,
editorial/coverage/localization/article/glossary audits, production **416 static entries**, post-build types,
CMS exclusion and **43 browser JS files**. No guidance prose/source registry in any browser chunk; map
geometry remains outside route entries. Existing dependencies were locally copied in the preceding gate,
not freshly installed; generated route/build output was reused normally by the tooling.

All Supabase/AWS/SES/email/public settings were cleared, email delivery false, and public origin
`https://nihonest.invalid`. No server/provider/database fixture or scheduler was started.
The article initial route measured **826.2 KB raw / 209.5 KB gzip (-9)** versus reviewed source `9b5d937`'s
823.4 / 208.2 KB: approximately **+2.8 KB raw / +1.3 KB gzip**. These are emitted route totals, not an
isolated parser-size measurement. Validation checkout ended clean; temporary probes/negative controls restored.

No interactive browser, hosted, SQL/Auth or real-provider acceptance was repeated. This branch-local gate
includes the separately pending interface-pack preparation `e0836f0`; it is not a validated integration of
unreviewed changes. Both code checkpoints require Claude review before integration. Current integration
remains `500c2db` / source `9b5d937`; all final N1/N2 and fee/format gates retain their scope.
