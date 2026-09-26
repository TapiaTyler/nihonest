# Shikoku: Tokushima, Takamatsu, Matsuyama, Kochi (all seven guides)

Official source inspection: September 25, 2026. This batch adds all seven local guidance supplements for the four Shikoku
prefectural capitals, each in a new prefecture folder under [`locations/`](../../src/data/local-guidance/locations/). The
registry gains `jp-36201`, `jp-37201`, `jp-38201`, and `jp-39201`, with new J-LIS sources `j-lis-36` to `j-lis-39` (the
Shikoku pages use the `…14186` suffix; codes and readings confirmed in the browser). All sources are official city pages.
All records remain `needs-review`; no Japanese translation artifacts were created or changed.

| City | Location file | Notes and claim boundaries |
|---|---|---|
| Tokushima (`jp-36201`) | [tokushima.ts](../../src/data/local-guidance/locations/tokushima/tokushima.ts) | Foreign residents file only at the Resident Section, including second and fourth Sunday mornings; NHI by post; bulky waste six times a year by district; consultation through the Tokushima International Association and TOPIA. The bulky waste page dates from June 5, 2023 (old-source recheck). Gaps: tax deadline and agent, foreign-language waste guide, adult Japanese classes. |
| Takamatsu (`jp-37201`) | [takamatsu.ts](../../src/data/local-guidance/locations/kagawa/takamatsu.ts) | Households with foreign residents file only at Citizens Section window 4; combined residence card requests until 4 p.m.; bulky waste with 510-yen stickers; tsunami areas on the map use the prefecture's 2013 estimates. The fiscal 2026 filing page was found by URL pattern because the index link text had no URL. Gaps: tax deadline and agent, foreign-language guidebook. |
| Matsuyama (`jp-38201`) | [matsuyama.ts](../../src/data/local-guidance/locations/ehime/matsuyama.ts) | Moves from abroad weekdays 9 a.m. to 4:30 p.m. at the General Service Center only; free bulky waste collection by area group; fiscal 2026 deadline March 16 (tax-year recheck); tax agent must live in the city; MIC and EPIC consultation. The Japanese class FAQ dates from March 31, 2023 (old-source recheck). |
| Kochi (`jp-39201`) | [kochi.ts](../../src/data/local-guidance/locations/kochi/kochi.ts) | Burnable bulky items go to resource and non-burnable waste stations; PET bottles to store boxes; tsunami and earthquake maps updated March 2026. No city page on adult consultation or Japanese classes was found, so the language guide covers the Education Research Institute's support for children (gap). Gaps: waste guides in other languages, tax deadline. |

Recheck items are in [LOCAL-GUIDANCE-RECHECK.md](../LOCAL-GUIDANCE-RECHECK.md).
