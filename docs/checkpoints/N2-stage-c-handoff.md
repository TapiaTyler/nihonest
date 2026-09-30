# N2 combined contract review and Stage-C handoff

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-30.
Base: `8c56ed3b3ae64f690dd87bca2253381269beb044` (practical basics, pushed; review pending).
Status: Stage-B parser and three component contracts prepared, exact review/integration pending. This
handoff proposes the next implementation sequence; it does not transfer ownership or close acceptance.

## Exact review queue

| Checkpoint | Commit | Review scope |
| --- | --- | --- |
| Standalone inline parser | `ca87cf61df7a3486a9735ab4edad8380f9ad5e17` | `article-inline.ts`, direct/corpus fixtures, protected spans and grammar |
| Delimiter/repeated-scan follow-up | `802c61889ee91ec7ab1487b4fb713341d7f72e5e` | Intraword underscores, excessive closing runs, conservative unclosed spans |
| Tax/training tables | `04814ca91be62eb10a70bb9677b87527aa38cb7b` | Strict bilingual caption/header/row contracts; suffixes and slug references |
| Practical basics | `8c56ed3b3ae64f690dd87bca2253381269beb044` | Ordered literal rich text, labels, cross-locale targets and proposed paragraph IDs |
| This follow-up against `8c56ed3` | Commit reported in the handoff message | Combining-mark fix, depth-boundary fixtures and this integration plan |

N1, J1, N4 and consolidated documentation retain their separate pending reviews. A merge of this latest
checkpoint can carry unreviewed ancestors; review the complete included set or agree a checkpoint-specific
integration method. Reviewed integration is still `e4fc1ff`, not this working branch.

## Combined review finding and verification

- Combining marks were absent from the word-boundary rule. At the base, `é_word_` incorrectly emphasized
  `word`, and `_é_word_` closed after the decomposed accent. Word boundaries now include Unicode marks
  alongside letters/numbers, preserving decomposed accented and combining-script words. No normalization
  or source rewriting. Five new tests cover these cases and the documented 32/33 nesting boundary.
- No further blocking issue was found in the tax/training/practical schemas in this pass. This is Codex's
  self-review, not Claude approval, rendered parity or native acceptance. Current copy is inspected read-only;
  the fixtures remain scoped to existing literal owners and cannot prove arbitrary JSX extraction.
- Focused parser/corpus/table/practical suites: **72 tests / four files**. TypeScript, full lint, architecture
  (**709 modules**) and whitespace passed with existing dependencies. Full four-worker suite:
  **921 tests / 173 files**, all passed. Corpus remains **6,187 text units / 30 protected `[ ]` blanks**, 15 per locale.
- No consumer, schema format, canonical content, translation catalog or component copy change. Format stays
  9 / 28 files. No generation/build/browser, clean install, SQL, translation audit, hosted call, email or
  schedule ran. Existing CMS tests run in the full suite; CMS serialization stays unchanged. Main/activation unchanged.

## Prerequisites for consumer changes

1. Obtain Claude's exact checkpoint reviews and integrate only reviewed inputs into the designated checkout.
   Run applicable combined checks and bring the validated integration result into both branches.
2. Confirm Batch 1 is finished with the affected renderers, and record the Stage-C file handoff in
   `docs/refactor.md`. `localized-article.tsx` and `japan-geography-reference.tsx` remain Claude-owned during
   Stage B. Clarify the coordinated tax/training renderer handoff too; their current JSX copy is not moved yet.
3. Keep interface messages, finder/map work and Japanese catalogs with Claude. Codex supplies requested
   contract/renderer changes; Japanese source edits and final checks require the existing ownership workflow.

## Concrete Stage-C sequence

1. Decide protected checklist behavior before changing display/export validation. Proposed policy: render
   exact `[ ]` spans as literal escaped text, preserving current checklist blanks; reject or explicitly report
   every other protected construct with article/locale/block/offset context. No blanket silent fallback to
   arbitrary markup. This is a proposal for review, not an implemented consumer policy.
2. Wire the shared inline parser into the agreed display boundary and align export validation. English MDX
   and Japanese portable text must retain visible content, links, emphasis, code, escapes, quote/list semantics
   and component positions. Treat literal component segments as literal text rather than reparsing Markdown.
   Native navigation remains a separate platform binding. CMS source serialization remains untouched.
3. Extract tax/training caption/header/row literals into one canonical plain-data owner per component, using
   the version-1 schemas without rewriting bilingual copy. Preserve tax row IDs, all training row suffixes,
   hrefs and order. Update web renderers to consume those owners while preserving accessible table semantics.
4. Extract practical-basics literals with text/strong/link ordering intact. Review proposed stable IDs
   `time`, `money`, `measurements`, `emergencies` before adopting them. Preserve spacing/punctuation and both
   emergency/disaster targets. Replace read-only JSX fixtures with tests of the new canonical owner plus
   explicit before/after rendered parity; do not make fixture updates conceal content changes.
5. Add N1 component payloads only after the shared data owners and display contracts are reviewed/integrated.
   Cover every registered directive: fees, tax scope, training routes, prefecture regions/finder/cards, map and
   practical basics. Existing fee/region data is not yet a payload. Coordinate finder/messages with Claude;
   preserve H1 catalog boundaries and leave map interaction platform-specific. Review format compatibility.
6. Run full combined acceptance: focused English/Japanese rendered/export parity and unsupported-construct
   cases; every component payload/lookup; canonical/revision/provenance/reference/ID checks; unchanged CMS
   round-trip/write protections; full suite/types/lint/architecture; public-only production build, CMS
   exclusion and every-browser-chunk boundary checks; applicable UI checks. Record exact integrated hashes
   and remaining native/client limits. Only then consider final N1/N2 acceptance.

## Open items retained

Stage-C ownership/integration, protected-span policy, paragraph ID adoption and Japanese final checks are
pending. Personalized roadmap rule ownership/export, offline assets, native installation/authenticity and
platform navigation are not resolved by these contracts. Do not imply that Stage-B tests make the native
bundle complete. No main merge or activation is authorized by this handoff.
