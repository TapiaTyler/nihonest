# N1 Stage-B article, FAQ and glossary relationships

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-30.
Base: `13344ab0f4a156a4a8c560a17cbba446bfc12f54` (article provenance, pushed; review pending).
Status: relationship acceptance implemented; exact checkpoint and consolidated documentation await review.

## Contract

- Portable bundle acceptance now calls the existing `validateArticleCollection`, `validateGlossaryCollection`
  and `validateFaqCollection` using only records from the candidate bundle. No web registry, filesystem,
  browser, database, React or Next dependency is introduced into the reader.
- Article checks cover unique slugs, source/glossary/status references, known related article IDs and rejected
  self-links. Glossary checks cover unique slugs, source/article/term references and rejected self-links.
  FAQ checks cover unique slugs and every article/group/journey/glossary/status/activity target family.
- The checks reuse existing content policy. Canonical relationships, review metadata, translation artifacts
  and source catalogs are unchanged; reference integrity does not approve content or legal assertions.
- Format stays **9**, with **28 files**. No file contract or payload changes. The exact previous catalog version
  remains `160b2acf9368dd4fce2855016fbfc496a8d69883b637c969b4895398585f86d2`.
  Acceptance is stricter for invalid candidates; current valid bundles remain compatible.
- These checks cover structured catalog references. They do not validate every inline Markdown URL or
  supply native navigation, component payloads, renderer wiring or publisher authenticity.

## Verification

- Focused relationship/integrity/article-provenance suites: **119 tests / three files**. Nineteen new cases
  cover unchanged canonical acceptance and rehashed broken article/glossary references, self-links, slugs,
  all six FAQ target families and duplicate FAQ slugs. Each negative case retains valid JSON/schema and
  matching file/catalog checksums, proving reference validation runs beyond transport integrity.
- TypeScript, full lint, architecture (**706 production modules**) and whitespace passed with existing
  dependencies. Full four-worker suite: **843 tests / 169 files**, all passed.
- `npm run content:bundle` ran after output-path containment verification. Independent disk verification
  passed, with the same catalog version proving every existing payload checksum remains unchanged.
- No clean install, production build/browser, SQL, translation audit, hosted call, email or schedule ran.
  Main/activation unchanged; reviewed integration remains `e4fc1ff`. Do not integrate the unreviewed head.

## Remaining scope

Final Stage-B coverage inventory and review remain pending. N2 parser/data work can proceed independently;
unsupported constructs, component payloads and renderer wiring retain the N2/Stage-C gates. Final N1
acceptance requires the reviewed combined result with Stage-C payloads; this pass does not close that gate.
