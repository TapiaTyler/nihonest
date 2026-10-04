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
