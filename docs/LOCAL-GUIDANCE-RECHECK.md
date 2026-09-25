# Local guidance recheck schedule

Local guidance supplements (`src/data/local-guidance/`) that state something tied to a date, or rest on an old or
undated source, and so need checking later. Research and verification follow
[LOCAL-GUIDANCE-WORKFLOW.md](LOCAL-GUIDANCE-WORKFLOW.md). Last updated September 24, 2026 (after Adachi, Katsushika, and Edogawa).

**Rechecking a record:** read the cited page again, update the supplement's wording and `lastCheckedAt`, then run
`npm run local-guidance -- check --only <record-id> --links --evidence`. When an item is resolved, delete its row here.
**Adding rows:** every research batch that writes a date-dependent statement, or cites a source older than about two
years or without a date, adds a row here in the same change.

## 1. Dated changes (recheck on or after the date)

| Recheck from | Location | Record | What changes | Action |
|---|---|---|---|---|
| 2026-10-01 | Nagoya | `nagoya-household-waste` | Bulky waste becomes "anything that does not fit in a 45-liter designated bag"; the record gives both the old (until September 2026) and new rule. | Drop the "until September 2026" wording. |
| 2026-10-01 | Taito | `taito-household-waste` | Electronic payment for online bulky waste applications starts. | Reword from "From October 1, 2026" to present tense. |
| 2026-10-01 | Kita | `kita-household-waste` | Electronic payment for online bulky waste applications starts. | Reword to present tense. |
| 2026-10-01 | Suginami | `suginami-disaster-preparation` | The Ogikubo community center returns as a flood shelter after renovation. | Reword to present tense; confirm the shelter list. |
| 2026-10-01 | Machida | `machida-disaster-preparation` | The revised hazard map is being delivered to every household from June 2026. | Reword once delivery is complete. |
| 2026-12-01 | Arakawa | `arakawa-disaster-preparation` | A hazard map for flooding from heavy rain is being prepared. | Add it once published. |
| 2026-12-01 | Arakawa | `arakawa-language-and-consultation` | Living-guide videos are Japanese only; other languages are promised. | Add the languages once published. |
| 2026-11-11 | Tachikawa | `tachikawa-address-registration` | Counter and phone hours change; the record points to the city's notice instead of giving new hours. | Add the new hours if needed, or confirm the City Hall and Window Service Center hours still hold. |
| 2026-11-15 | Taito | `taito-language-and-consultation` | The foreign resident consultation desk at the Lifelong Learning Center opens. | Reword to present tense; confirm hours and languages. |
| 2027-03-01 | Tachikawa | `tachikawa-language-and-consultation` | The Shibasaki Japanese class stops taking new students and moves venue from December 2026 to February 2027. | Remove the temporary wording; confirm the schedule and venues. |
| 2027-04-01 | Taito | `taito-language-and-consultation` | The ward office's Chinese, English, and Korean consultation ends at the end of March 2027. | Remove the ward-office wording. |

## 2. Tax-year statements (recheck each January)

Resident tax deadlines and filing channels change with each tax year. Check these when the ward publishes the next
year's filing page, usually in January.

| Location | Record | Statement |
|---|---|---|
| Minato | `minato-resident-tax` | "For the 2026 tax year, the filing deadline was March 16, 2026." Replace with the current year's deadline, or reword to a general "by mid-March". |
| Shinjuku | `shinjuku-resident-tax` | Online filing "from the 2026 tax year"; forms mailed in February. |
| Bunkyo | `bunkyo-resident-tax` | Online filing "from the 2026 tax year". |
| Fuchu | `fuchu-resident-tax` | Online filing "from the 2026 tax year"; filing later "may miss the June tax calculation". |

## 3. Old or undated sources (recheck at the next review)

Supplements are accurate to these pages, but the pages are old or undated and may have been replaced.

| Location | Record | Source | Date |
|---|---|---|---|
| Fuchu | `fuchu-disaster-preparation` | Evacuation areas page | September 5, 2013 |
| Fuchu | `fuchu-disaster-preparation` | Hazard maps page | June 8, 2021 |
| Toshima | `toshima-household-waste` | English garbage page | September 17, 2020 |
| Toshima | `toshima-disaster-preparation` | English disaster preparedness page | October 28, 2016 |
| Shinjuku | `shinjuku-address-registration` | Moving in from abroad page | September 10, 2021 (contains an outdated pandemic note, not used) |
| Suginami | `suginami-language-and-consultation` | English learning Japanese page | November 25, 2019 |
| Hachioji | `hachioji-language-and-consultation` | Japanese classes page | December 1, 2023 |
| Machida | `machida-language-and-consultation` | Consultation page | June 13, 2023 |
| Chiyoda | `chiyoda-disaster-preparation` | Stay-in-district and shelter pages | November 17, 2023 |
| Chiyoda | `chiyoda-household-waste` | Wakechiyo app page | June 2, 2023 |
| Shibuya | `shibuya-household-waste`, `shibuya-disaster-preparation`, `shibuya-language-and-consultation`, `shibuya-resident-tax` | English guide, Living in Shibuya | Not dated |
| Nerima | `nerima-household-waste` | Burnable waste page | March 24, 2023 |
| Nerima | `nerima-language-and-consultation` | Foreign-language consultation page | March 9, 2023 |
| Itabashi | `itabashi-household-waste` | Collection timing page | August 31, 2023 |
| Itabashi | `itabashi-language-and-consultation` | Multilingual consultation page | September 12, 2024 |
| Sumida | `sumida-disaster-preparation` | Earthquake evacuation page | September 29, 2022 |
| Adachi | `adachi-disaster-preparation` | Earthquake evacuation page; flood maps page | September 1, 2022; not dated |
| Katsushika | `katsushika-disaster-preparation` | Flood page | Not dated |

## 4. Known gaps to fill later

Not errors, but information the cited pages did not give; worth adding when the ward publishes it.

| Location | Record | Gap |
|---|---|---|
| Koto | `koto-household-waste` | Bulky waste reception hours. |
| Koto | `koto-disaster-preparation` | Earthquake shelters. |
| Meguro | `meguro-household-waste` | Burnable waste deadline. |
| Chuo | `chuo-household-waste` | Burnable waste deadline. |
| Suginami | `suginami-household-waste` | Burnable waste deadline. |
| Suginami | `suginami-disaster-preparation` | Earthquake shelters. |
| Setagaya | `setagaya-household-waste` | Bulky waste phone hours. |
| Ota | `ota-household-waste` | Bulky waste phone days. |
| Toshima | `toshima-household-waste` | Bulky waste booking details. |
| Toshima, Shibuya | `toshima-disaster-preparation`, `shibuya-disaster-preparation` | Flood hazard maps. |
| Minato, Taito | `minato-resident-tax`, `taito-resident-tax` | Leaving-Japan (tax agent) step. |
| Machida | `machida-resident-tax`, `machida-language-and-consultation` | Leaving-Japan step; Japanese classes. |
| Meguro | `meguro-language-and-consultation` | Japanese classes. |
| Itabashi, Nerima | `itabashi-household-waste`, `nerima-household-waste` | Bulky waste phone hours. |
| Nerima | `nerima-resident-tax` | Who must file (shown only as a flowchart image). |
| Arakawa, Itabashi | `arakawa-language-and-consultation`, `itabashi-language-and-consultation` | A ward-run multilingual daily-life desk, if one exists. |
| Adachi, Edogawa | `adachi-disaster-preparation`, `edogawa-disaster-preparation` | Flood depths (Adachi); earthquake shelters (Edogawa). |
| Edogawa | `edogawa-household-waste` | Bulky waste ticket prices (drop-off fees change from October 1, 2026). |
