# N1 Stage-B coverage inventory and translation contract follow-up

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-30.
Base: `a0bd248a98c64fc7e535aa3d71957835c0fb1425` (catalog relationships, pushed; review pending).
Status: explicit N1 catalog families are represented on the working branch. Review/integration and final
acceptance remain pending; this inventory does not establish a complete native offline application.

## Registered catalog coverage

Files are format 9, 28 mandatory JSON payloads. Catalog counts are observations, not permanent requirements.
Family parity and translation currency are tested against existing registrations and revision helpers.

| Canonical owner | Bundle files | Reader acceptance / evidence |
| --- | --- | --- |
| `content/articles/*.mdx`, current Japanese article artifacts | `articles.en.json`, `article-translations.ja.json`, `article-provenance.en.json`, `article-translation-artifacts.ja.json` | Metadata/blocks, exact provenance coverage, source revision and compact/artifact correspondence; producer hashes whole normalized MDX |
| `src/data/sources.ts` | `sources.en.json` | Complete source records, dates and Japanese source labels; dependent source IDs validated |
| `src/data/glossary.ts` | `glossary.en.json`, `glossary-translations.ja.json` | Canonical parity, current complete artifacts, sources/article/term links and unique slugs |
| `src/data/faqs.ts` | `faqs.en.json`, `faq-translations.ja.json` | Canonical parity, current artifacts, six target families and unique slugs |
| `src/data/residence-statuses.ts`, structured guidance | `residence-statuses.en.json`, `residence-status-translations.ja.json`, `residence-status-guidance-translations.ja.json` | Canonical structured guidance and approval/source metadata; summary and path-based overlays use separate source revisions |
| `src/data/discovery.ts` | `article-groups.en.json`, `journeys.en.json`, `article-group-translations.ja.json`, `journey-translations.ja.json` | Discovery relationships/choices, nested translation IDs and current provenance; localization preserves behavior |
| `src/data/local-guidance.ts`, general advice | `local-guidance.en.json`, `supported-geographies.en.json`, `general-local-advice.en.json`, `local-guidance-translations.ja.json`, `general-local-advice-translations.ja.json` | Article/source/geography references; supplement per-field fallback, complete general-advice fallback |
| `src/data/annotated-documents.ts` | `annotated-documents.en.json`, `annotated-document-translations.ja.json` | Versions, field identities, lifecycle, visual URLs/rights and sources; complete family translation fallback |
| `src/data/activity-cross-references.ts` | `activity-cross-references.en.json`, `activity-translations.ja.json` | Rule/answer/target identities, sources and assertion approval metadata; partial text fallback |
| `src/data/geography/index.ts` | `administrative-geographies.en.json`, `geography-sources.en.json`, `geography-aliases.en.json` | Registered administrative snapshot, check digits/hierarchy, provenance/counts and legacy saved IDs |

## Audit finding and bounded fix

FAQ, glossary and status-summary translation field objects previously allowed extra field keys. Schema
validation ignored these keys while export retained the original JSON. The new strict field contracts reject
undeclared fields instead of implicitly accepting them. Tests use the syntactically valid `editorial-state`
key so rejection exercises the per-kind contract rather than the base artifact field-name regex.
No canonical data, translation catalogs, revision rules or review state changes. Format/file inventory and
all payload checksums remain unchanged; current catalog version is
`160b2acf9368dd4fce2855016fbfc496a8d69883b637c969b4895398585f86d2`.

## Explicit remaining boundaries

- All eight registered article component directives still require Stage-C payload/shared-data acceptance:
  residence application fees, tax-residence scope, training-route comparison, prefecture regions/finder/cards,
  region map and practical basics. Existing plain fee/region data does not substitute for a delivered payload.
  Substantive React copy is still owned by Claude until the Stage-C handoff. Map interaction stays native-specific.
- Taxonomy IDs are already validated through portable domain schemas. Localized taxonomy/interface messages
  are not exported as catalogs here; N3/message ownership stays with Claude. No translation tooling/prompt,
  terminology generation, historical stale artifact or pilot corpus is presented as current native content.
- `src/data/roadmap.ts` generates personalized recommendation rules from stages/journeys. Those rules are not
  exported. Native offline roadmap behavior must choose a shared portable rule owner or an explicit payload
  before parity can be accepted; this is an open scope/contract item, not a silent exclusion or completion.
- Inline grammar, unsupported MDX/Markdown constructs and renderer/export alignment retain N2's gates.
  Stage B permits a new standalone domain parser; shared renderer wiring waits for Stage C.
- Visual assets remain external references; offline image caching, rights acceptance, atomic client installation
  and authenticity are separate unresolved client/release concerns. No native consumer exists in this pass.
- Exact working-branch checkpoints and consolidated docs require Claude's review and designated integration.
  Reviewed integration remains `e4fc1ff`; branch-local checks do not validate that combined result.

## Verification

- Focused catalog-translation/relationships/integrity suites: **117 tests / three files**. Six new regression
  cases check each affected family directly and in a rehashed whole bundle; artifact evidence stays unchanged.
- TypeScript, full lint, architecture (**706 modules**), whitespace and generation passed with existing
  dependencies. Full four-worker suite: **849 tests / 169 files**, all passed. Independent disk acceptance and unchanged catalog
  version confirm no payload changes.
- No clean install, production build/browser, SQL, translation audit, research fetch, hosted call, email or
  schedule ran. Main and activation unchanged. N1 final acceptance remains open.

Next independent work: N2 supported inline grammar and standalone parser/data contracts, with real English
and Japanese fixtures. No renderer integration or Japanese catalog edit is authorized by this checkpoint.
