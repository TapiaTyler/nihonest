# N5 metadata boundary preparation — 2026-10-04

Codex read-only production-source inventory at `dfe6c09`, whose tree equals validated format 10 handoff
`dbd7a83`. This checkpoint adds documentation only. No generator, metadata payload, selector, registry,
consumer, route, translation, configuration or compatibility behavior changes. Implementation is proposed;
Claude has not yet acknowledged adoption of `dbd7a83` or reviewed this preparation.

## Current boundary

`src/lib/content/articles.ts` imports six registration families. Each family statically imports canonical
MDX's metadata **and default component**, then exports ordered `[metadata, Content]` tuples. The compatibility
catalog schema-parses metadata, validates article/status/glossary/discovery/local-guidance/document
relationships, and exposes both selectors and component-bearing records. Metadata-only consumers therefore
share the source dependency on the web MDX registry; this is not a claim about emitted browser bytes or a
measurement of which modules Next eliminates.

| Family, in established assembly order | Records |
| --- | ---: |
| entry-and-arrival | 17 |
| route-selection-and-visas | 12 |
| work-statuses | 19 |
| family-and-designated-activities | 15 |
| tax-work-and-resident-lifecycle | 21 |
| transport-safety-and-daily-life | 13 |

All **97** canonical MDX files are registered exactly once, with 97 unique metadata IDs and slugs.
Family/local tuple order is meaningful and **differs from N1's article-ID-sorted export**. Using bundle order
as a drop-in selector inventory would change the web catalog order.

There are **16 direct production importers** of `articles.ts` (tests excluded). Only
`src/app/articles/[slug]/page.tsx` consumes `Content`; its static params, metadata and related links also
need metadata. The remaining 15 use metadata/discovery selectors:

| Consumer group | Files |
| --- | --- |
| Metadata-only pages | home; explore; explore group; explore journey; glossary detail; residence-status detail; my-journey; onboarding; roadmap; saved; sitemap |
| Metadata-only library helpers | article-journey-data.ts; checklists.ts; faqs.ts; source-registry.ts |

FAQ links, checklist titles, source dependency context and journey indexes are affected acceptance surfaces,
not only route titles. The Japanese translation lookups stay with existing owners and behavior.

## Proposed bounded implementation

1. Generate a plain, validated metadata inventory from canonical MDX **in the existing tuple assembly order**.
   The existing six registration families remain the single ordering inventory. A build-time reader can parse
   their imports and tuple arrays with TypeScript's AST, resolve each tuple's metadata binding to its MDX path,
   then use the existing `splitArticleSource` and metadata schema. Reject unsupported registration syntax,
   missing/duplicate/unregistered files and unresolved bindings. Do not infer order from directory/import order,
   execute MDX, or add a second hand-maintained ID list.
2. Keep Node filesystem/VM/TypeScript work in a build-time module. Runtime metadata and selectors must have
   no React, Next, MDX or Node dependency. Reuse the existing metadata and cross-reference validation rules;
   prove a transitive import boundary, not merely the absence of a direct React import.
3. Separate metadata/discovery selection from the web-only component registry, preserving ID/slug resolution,
   unknown-ID behavior, family/local order, group/journey ordering, route conditions and duplicate handling.
   Keep the current component-bearing API available to rendering callers. A metadata-record facade with
   `{ metadata }` can preserve existing metadata-only destructuring without returning a fake `Content`.
4. Ensure generation/freshness is enforced for tests, builds and editorial/CMS changes, including direct
   `next build`. A checked-in generated file without a stale-output gate is insufficient. A build-only file
   that disappears in clean checkouts also needs an explicit generation step. The mechanism is an open
   integration choice; package/release/Next/CMS wiring must follow each file owner's rules.
5. Switch metadata-only consumers only after the metadata boundary and parity checks are reviewed. Detail
   rendering must still resolve the same MDX component; static params and metadata keep their exact results.

## Ownership and acceptance before wiring

Codex owns the proposed metadata contract, producer, selectors and checkpoint tests. Detail routes remain
Claude-owned under the concurrency table. Do not edit the eleven metadata-only page consumers or the article
detail page without a Claude handoff/coordinated change. `article-journey-data.ts` is an H2 query-context helper;
coordinate its wiring. Release/Next configuration and CMS freshness integration also need their respective
owners. This preparation requests coordination; it does not transfer those files or change translation ownership.

Required acceptance: generated metadata deep-equals the current schema-parsed web records **in order**;
every canonical MDX file occurs once; all current validation remains; each selector has equivalent results for
known/unknown IDs, groups, journeys and route variants; metadata-only transitive graph has no React/MDX/Node;
detail component identity, static route inventory, discovery/search/FAQ/checklist/source graph and H2 query
context remain unchanged. Run applicable full release/browser checks after actual wiring. Measure before
claiming compilation, memory, server artifact or browser savings. N5 remains lowest priority, not a native app.

## Read-only evidence and limits

Commands: `rg`, targeted `Get-Content` reads, and PowerShell literal JavaScript probes piped to `node` /
`node --import tsx`. TypeScript AST inspection covered production import declarations, registration-family
assembly and tuple binding resolution. Canonical metadata was extracted through the existing splitter,
evaluated as trusted repository object literals in an empty VM with a timeout, and schema-validated.

Compact schema-parsed metadata plus one LF is **146,793 UTF-8 bytes**; all canonical MDX normalized to LF is
**664,309 bytes**. These are source/serialization sizes, not emitted chunk sizes or build savings.
Initial exploratory probes failed (sandbox `uv_os_get_passwd` ENOMEM; whole-MDX TypeScript parsing consumed
Markdown as syntax). The successful probe used the existing metadata splitter in the normal approved execution
environment. Import resolution was corrected to include the `.ts` extension and cross-checked with `rg`.

No new tests, full build/release/browser, production graph isolation, generated artifact or runtime behavior
was implemented or verified in this preparation. The preceding format 10 combined gate remains attributed to
exact source `883cdff`; it is not N5 implementation evidence. No main merge or activation.
