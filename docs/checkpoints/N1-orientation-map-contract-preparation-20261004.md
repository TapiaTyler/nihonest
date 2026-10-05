# N1 orientation region/map contract preparation — 2026-10-04

Base: `97159da04ad41fff8f26ec5a8504a72eb65c103b`. Implementer: Codex. Review and integration pending.
This is standalone preparation for later component payload work, not final N1/N2 acceptance.

## Scope and interface

New pure module `src/domain/geography/orientation-map-data.ts` exports:

- `orientationPrefectureReferenceSchema`: a caller-projected canonical prefecture/metropolis reference
  `{ id, code, names: { en, ja } }`; five-digit prefecture code and stable ID must agree.
- `orientationRegionSchema`: the existing ordered `{ name, prefectureIds, prefectures }` shape. No new
  region IDs or administrative-parent relationships are introduced.
- `orientationMapPathSchema` and `isOrientationMapPath`: existing `{ code, name, focus, d }` records.
  Focus is a finite numeric three-tuple with positive span. Geometry accepts only the generator's uppercase
  M/L/Z closed rings, at least three vertices per ring, with signed fixed-one-decimal projected coordinates.
  Multiple rings are supported. Invalid numbers, unsupported commands, whitespace/markup, open rings and
  paths longer than 200,000 characters fail. This input ceiling is a contract bound, not a measured maximum.
- `parseOrientationMapData(regions, paths, prefectures)`: validates unknown input and returns parsed
  `{ regions, paths }`. Both collections must exactly cover the supplied nonempty reference set; membership
  and map codes must be unique. Derived en/ja member lists must match reference names in member order;
  map names must match Japanese prefecture names. All collections are bounded to 47 entries.

The caller supplies the complete intended prefecture set; the helper itself does not import a registry or
prove that a supplied subset represents all Japan. Canonical acceptance supplies all 47 prefectures/metropolis
records. Labels are checked for nonblank content but returned untrimmed. No collection is sorted or rewritten.
These are projected orientation shapes, not longitude/latitude, navigation or legal-boundary geometry.

## Ownership and evidence

Only three new code/test files and this record are included. Existing geography data, generator, map/finder
renderers, Japanese catalogs/artifacts, source-field rules, content-bundle exporter and format remain unchanged.
The module has only a Zod runtime import; no browser, React/Next, Node, data or server-only dependency.
No source date, license binding, region translation provenance or approval is invented. Those payload bindings
and renderer/export adoption remain later reviewed work.

Commands run:

```text
npx vitest run src/domain/geography/orientation-map-data.test.ts src/lib/content/orientation-map-contract.test.ts
npx tsc --noEmit
npx eslint src/domain/geography/orientation-map-data.ts src/domain/geography/orientation-map-data.test.ts src/lib/content/orientation-map-contract.test.ts
npm run architecture:check
git diff --check
```

Results: 44 tests / two files passed; TypeScript, targeted lint and architecture (718 production modules) passed.
The canonical test proves exact JSON preservation of eight regions and all 47 paths, including 171 rings,
and no input mutation. Independent source inspection found 156,066 geometry-string characters in total,
maximum 12,163 per path; every path matches the generator's current grammar. Synthetic negative cases cover
focus shape/nonfinite values, geometry grammar/size, region membership/labels, path coverage/names and reference
identity. An initial table-driven focus fixture incorrectly spread array arguments; it was corrected to pass
each entire tuple, then focused tests, types and lint were rerun successfully.

No full release, production build, browser, SQL, external map-source/license revalidation or Japanese audit
was repeated: this unused domain preparation changes no production consumer. Reviewed integration remains
`1a4ab65` / source `4372d4a`. Consolidated handoff stays held at the user's request. No main merge or activation.
