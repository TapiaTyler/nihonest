# Administrative geography registry

Implemented 2026-09-23. This is the identity/schema slice of Geography A, not
the finder UI or a local-guidance expansion. Japanese translation ownership
remains with Claude; the Japanese names/readings below are official source
data, not newly generated translation artifacts.

## Scope and hierarchy

The snapshot contains 129 records:

- 47 prefectural-level records (46 `prefecture`, Tokyo as `metropolis`);
- Tokyo's 23 `special-ward` municipalities and its 26 `city`, 5 `town`, and 8 `village`
  municipalities (the Tama area and the islands), all directly under Tokyo;
- 20 `designated-city` municipalities under their prefectures.

The 171 `administrative-ward` records under designated cities were removed on 2026-09-25: the city runs local
procedures for all its wards, so Nihonest guidance is city-level. The schema and validation still accept
`administrative-ward` records if ward-level data (for example, evacuation sites) is needed later.

`prefecture` is an umbrella type covering Hokkaido, Kyoto, Osaka, and the other
prefectures. Regions such as Kanto and Kansai are not government parents.
The schema accepts `city`, `town`, and `village` for source-backed additions.
Tokyo's child list is complete (all 62 municipalities, added 2026-09-23 from the
same J-LIS table); outside Tokyo this snapshot does not yet contain ordinary
cities, towns, or villages, only designated cities.

```text
jp-13000  Tokyo (metropolis)
└── jp-13104  Shinjuku (special-ward / municipality)

jp-23000  Aichi (prefecture)
└── jp-23100  Nagoya (designated-city / municipality)
    └── (administrative wards such as Chikusa, jp-23101, are not in the registry)
```

Administrative wards are not interchangeable with Tokyo special wards. Their
municipal parent stays explicit even when the English word “ward” is shared.
Same-named wards have different IDs: Tokyo Chuo is `jp-13102`, while Sapporo
Chuo would be `jp-01101`, under Sapporo `jp-01100` and Hokkaido `jp-01000`.

## Record contract

| Field | Meaning |
|---|---|
| `id` | `jp-` plus the five-digit identity code, e.g. `jp-13104` |
| `code` | Five digits as a string; leading zeros are significant |
| `localGovernmentCode` | The published six-digit code including its check digit, e.g. `131041` |
| `prefectureCode` | Two-digit prefecture code, e.g. `13` |
| `type` | Government/administrative-unit type, independent of content coverage |
| `parentId` | Explicit immediate parent; absent for prefectural records |
| `names.ja` | Official Japanese name; city wards retain the full city-prefixed source name |
| `names.kana` | Official source reading when available; not inferred from the name |
| `names.en` | Existing English display label when available |
| `sourceId` | Reference to the dated source manifest |

Prefecture records use their prefectural five-digit form (`13000`), not the
two-digit form as the primary key. IDs never come from alphabetical position,
array index, translated text, or a generated romanization. Official code
changes create a new identity entry; this snapshot is not a historical alias
or address-conversion database.

Validation rejects duplicate identity codes, malformed/checksum-invalid codes,
mismatched prefecture prefixes, missing parents, cross-prefecture parents,
incorrect parent types, and Tokyo ward type confusion. Administrative ward
full names must begin with their designated-city parent's official name.
The allowed parent types strictly decrease in depth, preventing cycles.

## Code entry points

- `src/domain/geography/administrative-geography.ts`: strict Zod schema,
  check-digit validation, hierarchy validation, sorting, and immutable registry.
- `src/data/geography/administrative-records.ts`: explicit source-backed records.
- `src/data/geography/sources.ts`: J-LIS source URLs, retrieval dates, source
  update dates where retrieved, and selected-record counts.
- `src/data/geography/index.ts`: assembled registry, ID/code lookup, children,
  ancestors, and compatibility aliases.

```ts
import {
  getAdministrativeGeography,
  getAdministrativeGeographyByCode,
  getAdministrativeGeographyChildren,
  getAdministrativeGeographyAncestors,
} from "@/data/geography";

getAdministrativeGeography("jp-13104"); // Shinjuku
getAdministrativeGeographyByCode("131041"); // Same record, checksum checked
getAdministrativeGeographyChildren("jp-13000"); // 23 special wards, code order
getAdministrativeGeographyAncestors("jp-23100"); // Aichi
```

Unknown IDs return `undefined` from lookup and empty lists from traversal;
invalid six-digit codes are not truncated into a seemingly valid lookup.

## Sorting and language

The default order is the fixed-width official code. This provides deterministic
prefecture and child ordering independent of display language. Lookup and
sorting preserve the same IDs. `sortAdministrativeGeographies` and the children
helper also accept `en` or `ja`; label ties fall back to code order.

English sorting uses existing English labels, placing entries without them
after translated entries and sorting their Japanese fallback labels. Japanese
sorting uses official kana where supplied and falls back to the Japanese name.
The prefecture source table has no reading column, so this is not a claim of
complete kana-based prefecture ordering. Add verified readings if that is needed.
For complete existing English prefecture-name sorting, all 47 labels are present.

All 129 records have source Japanese names; all 82 municipality records have
source readings. English labels currently cover the 47 prefectures and the two
existing pilot municipalities. Other English names remain absent rather than
invented. A future UI must identify fallback appropriately; the registry alone
does not establish complete bilingual interface coverage.

Existing municipal controls retain their English alphabetical behavior. The
new code-order helpers are available for the future finder; this change does
not silently reorder today's selectors.

## English display labels

`englishGeographyName` (`src/domain/geography/english-name.ts`) gives every record an English label for
selectors: a record's own `names.en` when present, otherwise the official kana romanized in modified Hepburn
without macrons (n becomes m before b, m, and p, as in "Tempaku"), with the unit's suffix: "Chiyoda City",
"Hachioji City", "Okutama Town", "Ogasawara Village", and "Chuo Ward, Sapporo" for a designated-city ward. These
are display labels only; they are not stored in the registry and never identify a record.

## Existing content and saved-location compatibility

`tokyo`, `aichi`, `shinjuku`, and `nagoya` still resolve to their canonical IDs
and retain their saved-location values. The `supportedGeographies` export is an
explicit coverage projection, now also containing Chiyoda (`jp-13101`), Chuo
(`jp-13102`), Minato (`jp-13103`), Bunkyo (`jp-13105`), Taito (`jp-13106`), and
Sumida (`jp-13107`), Koto (`jp-13108`), Shinagawa (`jp-13109`), Meguro
(`jp-13110`), Ota (`jp-13111`), Setagaya (`jp-13112`), Shibuya (`jp-13113`),
Nakano (`jp-13114`), Suginami (`jp-13115`), Toshima (`jp-13116`), Kita
(`jp-13117`), Arakawa (`jp-13118`), Itabashi (`jp-13119`), Nerima (`jp-13120`),
Adachi (`jp-13121`), Katsushika (`jp-13122`), and Edogawa (`jp-13123`) under Tokyo.
New municipalities use their canonical IDs as
saved-location values. Type and parentage come from the canonical registry.

The original four IDs and supplements need no migration or regeneration. A
registry entry means the place has an identity record, not that Nihonest has
researched its services. Future coverage additions must be explicit; never
populate a coverage selector from `administrativeGeographies` without applying
content availability rules.

## Source evidence and maintenance

Records were transcribed from the public [J-LIS prefecture and municipality
directory](https://www.j-lis.go.jp/spd/code-address/jititai-code.html), accessed
2026-09-23. The per-table URLs are retained in `sources.ts`. Only identity,
name, and reading fields were retained; office addresses/telephone numbers and
unrelated municipalities were not imported. The [J-LIS code explanation](https://www.j-lis.go.jp/spd/code-address/cms_1750514.html)
documents the code/check-digit format.

Hamamatsu uses `22138`, `22139`, and `22140` for its three current wards.
The [city's reorganization notice](https://www.city.hamamatsu.shizuoka.jp/shisanze/zei/shisanze/oshirase_syoukyakusisann.html)
confirms the 2024-01-01 transition, including the code change for Tenryu despite
its unchanged name. Retired `22131`–`22137` entries are not included or silently
redirected: some reorganizations cannot be resolved without an exact address.

To update the snapshot:

1. Check J-LIS and the affected local authority for the current name, code,
   effective date, and parent. Do not infer parentage only from rounding codes.
2. Update explicit records and their source metadata; preserve source names.
3. Assess retired-code users before adding any separate migration. Do not
   reinterpret a stored ward as a successor automatically.
4. Update the expected per-city ward counts when supported by a real change.
5. Run the geography tests and existing local-guidance/document regression
   tests, type checking, targeted lint, and the architecture gate.

There is no live external-data dependency, schema migration, or production
fetch. Registry records are validated and frozen when assembled.
