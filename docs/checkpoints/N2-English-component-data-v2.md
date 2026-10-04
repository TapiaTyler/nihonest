# N2 English component data v2 preparation — 2026-10-04

Base: `2f1cfef`. This bounded preparation replaces the unused v1 bilingual contracts with English-only
v2 contracts and adds canonical data. Production renderers and Japanese catalogs remain unchanged.
Renderer adoption follows review/integration of Claude's artifact interface and this checkpoint.

`src/data/article-components.ts` exports `taxResidenceScopeComponent`, `trainingRouteComparisonComponent`,
`japanPracticalBasicsComponent` and `articleComponents`. Tables carry caption, two headers and stable row
IDs with two tax cells or three training cells; training hrefs stay canonical English data. Practical
paragraphs carry stable IDs and N2 inline strings. Strict schemas reject bilingual/v1 input, duplicate
IDs, protected practical markup, missing labels/body and noncanonical article targets. Link validation
resolves by article slug. Stored whitespace is preserved.

Source fields use the agreed display order: caption, headers.0..1, rows.<id>.<cell>; practical
paragraphs.time, money, measurements, emergencies. Five training suffixes intentionally remain exactly
empty: cultural-activities, student, training, specified-skilled-worker, ordinary-work. There are 37 fields.
Existing revision hashing gives:

- Tax: `f335debb0a217ad8717ba918891b8468b8cd365a1d309ccc5c21ac5dfe64091b`.
- Training: `e5ef1b2fa79ed82cf36bdad6318eeeb7fd6312ccfffbd9c709df4bdb922b9386`.
- Practical: `312907d08f6e7e42bec6f9ec96cabccc44fef24d9385aa4d404d505dca9588da`.

Read-only AST fixtures extract the current renderer's English and compare it exactly with the new data.
Existing contract tests now exercise v2; focused tests passed **32/32**. TypeScript and targeted ESLint
passed. Full public-only release gate passed **13/13**, **1,018 tests / 180 files**, architecture **714
modules**, production **416 entries**, lint/types/audits/CMS exclusion/client bundle boundaries passed.
Existing dependencies were reused. No new browser, real Auth/SQL, clean-install or hosted check was run.
No markup extraction has occurred; Claude's parent-versus-extraction static markup parity gate remains open.

Claude's `ea715b1` handoff merge receipt (`f1c3eec`) makes Stage-C ownership effective. Claude confirmed
these components' Japanese provenance as machine-translated and explicitly handed off tax/training
renderers. His artifact implementation `5b58f06` is separate and under review. This preparation introduces
no translation edits, bundle-format change, rendering change, main merge or activation.
