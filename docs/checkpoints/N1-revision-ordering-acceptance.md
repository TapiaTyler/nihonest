# N1 revision-key ordering acceptance — 2026-10-03

Implementer: Codex. Reviewer: Claude. Base: `a39d01b` (N4 binding checkpoint, still awaiting review).
Checkpoint hash is reported in the handoff. **Test implementation complete; review/integration pending.**

The integration receipt requested a read-only corpus test comparing current `localeCompare` revision-key
ordering with code-unit ordering before the native runtime spike. This checkpoint adds only a test and
documentation. Claude's revision implementation, source-field builders, translation catalogs, prompts,
provenance and review states are unchanged; no translation or bundle artifact is regenerated.

## Coverage and result

`src/lib/content/content-bundle-revision-ordering.test.ts` obtains revision inputs from the same canonical
English builders used by the bundle. Every present record is checked, including untranslated records:

| Family | Records |
| --- | ---: |
| FAQ | 116 |
| Glossary | 236 |
| Residence-status summaries | 30 |
| Municipality supplements | 784 |
| General local advice | 7 |
| Structured status guidance | 30 |
| Article groups | 15 |
| Journeys | 20 |
| Annotated document families | 6 |
| Activity cross-references | 8 |
| Article whole-source revisions | 97 |
| Total | 1,349 |

For all ten structured families, current locale sorting equals UTF-16 code-unit sorting. The production
revision digest equals an independent code-unit-sorted digest with the existing line-ending normalization,
and reversing field insertion order preserves it. All 97 article sources are also read directly; their
single-field normalized whole-source digests match `articleSourceRevision`. Counts above describe this
snapshot; the tests read the current corpus and do not freeze catalog counts or revise curated order.

The test includes a deliberately reversed comparator control that the assertion rejects, using a restored
runtime spy without changing production source. An explicit mixed-case fixture demonstrates that locale
collation and code-unit order are not equivalent for arbitrary keys. This is current-corpus evidence on
Node 24 / Windows, **not Hermes execution, proof across all locales or permission to change revision rules**.
Future source-field additions are covered by the same corpus checks; native/runtime acceptance remains open.

## Commands and checks

- Vitest on the new test plus seven related bundle translation/discovery/guidance/document/activity/article
  provenance files: **71 tests / eight files passed**.
- New file alone after adding the explicit comparator `this` type: **13 tests passed**; TypeScript and
  targeted ESLint passed. The initial TypeScript run caught that missing test-only annotation; it was fixed.
- Read-only corpus count probe and `git diff --check` passed. No deployed resources or database was accessed.
- Full Vitest/build/architecture/browser/SQL/content/localization audits were not repeated for this test-only
  change. The prior N4 checkpoint has its own **945-test** and production-build evidence; those are not a
  new combined or reviewed-integration result here. Existing dependencies, no clean install.

## Handoff

Review this exact checkpoint separately from its unreviewed N4 parent `a39d01b`. Both await Claude; do not
merge the branch head into integration on a single-checkpoint approval. If only this test is approved,
integrate its bounded diff by exact-hash cherry-pick and retain the N4 gate. Validated integration remains
H4 source `52f8a08`, documentation handoff `3bf4e94`.

N1 revision-key ordering has this local acceptance evidence; N1/N2 Stage-C renderer/component handoff,
Japanese component provenance and native/Hermes acceptance remain open. H3b CI repair, H5/N4 real
Auth/PostgREST/session acceptance and J1 database/operator gates remain open. No main merge or activation.
