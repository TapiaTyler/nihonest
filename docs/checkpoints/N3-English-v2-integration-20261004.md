# N3 finder messages / English v2 data review and integration — 2026-10-04

Claude merged exact `1f5668c` as `b84336c` and approved the Stage-C artifact/J1 integration record with
neutral-wording and nonexistent-N3-work corrections. Those two corrections are applied in this handoff.
Claude also approved English v2 preparation `a74926b` against `2f1cfef`.

## N3 review

Codex approves exact `997f0ab3e9a62be6d40231352a6e306250b6783e` against parent `b84336c`, with no blocking
findings. Only committed changes were reviewed. Claude-owned catalogs/N3 code were not edited.

- `InterfaceMessageGroup<Prefix>` supplies complete typed prefix groups, including nested `finder.map.`
  keys in the finder group. The portable helper falls back to English for missing entries; the server
  wrapper picks the locale before rendering and supplies serializable props. Japanese prerenders do not
  wait for a client catalog load. All finder/map/region-map consumers, lazy wrappers, MDX registration,
  Japanese article registration and tests were traced; none was missed.
- Captured full finder and region-map static markup at exact parent `b84336c`, then compared the complete
  strings at `997f0ab` for English and Japanese: all four outputs byte-identical, including accessible
  labels, SVG attributes, controls, IDs and initial statuses. A temporary Vitest probe was removed afterward.
- A read-only TypeScript/transpilation probe compared every migrated message with the parent's literal or
  function output, including values containing placeholder-looking text: **108 comparisons passed**.
  Template substitution preserves word order and does not recursively interpret replacement values.
- Existing focused `interface-messages.test.ts` and `prefecture-finder.test.tsx`: **14 tests passed**;
  `next typegen` followed by TypeScript passed. Group fallback, placeholder subset/completeness, interaction
  labels, localized supplements and finder behavior are covered. No interactive browser run was repeated.
- A type-aware runtime import traversal from finder/map/region-map found respectively **10 / 5 / 2** project
  modules, with neither the full Japanese catalog nor the all-catalog server wrapper in those client graphs.
  Type-only imports were excluded. Existing on-demand Japanese interface loading elsewhere is unaffected.

The small shared English payload increase is acceptable for stable message IDs, one fallback mechanism,
Japanese server prerendering and removal of the finder-owned bilingual dictionary. Claude reports about
1.1 KB gzip added English strings. Comparing our successive public builds, article initial JS rose from
818.4 to 822.8 KB raw and 206.6 to 208.0 KB gzip (-9); other initial routes showed the same approximately
1.4 KB gzip increase. These are emitted route totals, not an isolated message-only measurement. Every
browser chunk still passes the guidance/source/map boundary rules.

## Exact reviewed integration

After `1f5668c`, on `codex/hosting-native-integration`:

- Approved English v2 preparation `a74926b` → `af141e3`. Current status and both historical documentation
  entries were retained when resolving append/status conflicts; production data/contracts match the input.
- Reviewed N3 `997f0ab` → **`4372d4a6680b08b01615e6298dd72cf4ad3db03b`**. No conflicts.

A separate clean LF checkout at exact `4372d4a` ran `npm run release:check -- --target local`, with all
Supabase/email/AWS/public settings cleared, delivery false and origin `https://nihonest.invalid`:
**13/13 passed**, **1,028 tests / 181 files**, **716 modules**, public production **416 entries**,
lint/types/audits/CMS exclusion/all **42 browser JS files** passed. Existing installed dependencies were
reused; no clean-install/CI, browser, real Auth/SQL or hosted run was repeated. Localization audit is still
article-only. These inputs are in Codex's branch as merge `ded19b4` before renderer extraction.

The three-renderer extraction is a separate Codex checkpoint and awaits Claude's parent-versus-extraction
en/ja static-markup review. Its implementation is excluded from this validated integration. N1 component
payload/artifact export follows reviewed display/data contracts; broader inline consumer alignment and
native acceptance remain open. J1 operational/hosted gates and prior documentation review limits remain.
No main merge, hosted activation, real email or scheduling.
