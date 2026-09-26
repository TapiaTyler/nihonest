# Kyushu and Okinawa: Saga, Nagasaki, Oita, Miyazaki, Kagoshima, Naha (all seven guides)

Official source inspection: September 25, 2026. This batch adds all seven local guidance supplements for six prefectural
capitals, each in a new prefecture folder under [`locations/`](../../src/data/local-guidance/locations/). The registry
gains `jp-41201`, `jp-42201`, `jp-44201`, `jp-45201`, `jp-46201`, and `jp-47201`, with new J-LIS sources `j-lis-41`,
`j-lis-42`, and `j-lis-44` to `j-lis-47` (codes and readings confirmed on the J-LIS prefecture pages in the browser). All
sources are official city pages. All records remain `needs-review`; no Japanese translation artifacts were created or changed.

| City | Location file | Notes and claim boundaries |
|---|---|---|
| Saga (`jp-41201`) | [saga.ts](../../src/data/local-guidance/locations/saga/saga.ts) | The city site was redesigned on June 1 and old `/main/` URLs mostly return 404, so current URLs were found through site navigation. March 15 filing deadline; tax agent and public-posting rule; waste guide in ten languages; plain-Japanese welcome sheet. Consultation is covered only through the welcome page's links (gap), and the pension page lacks leaving-job documents (gap). |
| Nagasaki (`jp-42201`) | [nagasaki.ts](../../src/data/local-guidance/locations/nagasaki/nagasaki.ts) | District offices cannot take foreign residents; plastic sorting changes in April or October 2026; bulky waste online since March 2026; the consultation desk is the prefecture's, described on the city's plain-Japanese page. Gaps: landslide maps, pension moving abroad. |
| Oita (`jp-44201`) | [oita.ts](../../src/data/local-guidance/locations/oita/oita.ts) | Citizens Section open until 6 p.m.; fiscal 2026 deadline March 16 (tax-year recheck); flood map information pages use pre-2021 evacuation terms, noted in the guide. The Japanese class source is the English living guide because its plain-Japanese version returned 404. Gaps: tax agent, regular waste rules. |
| Miyazaki (`jp-45201`) | [miyazaki.ts](../../src/data/local-guidance/locations/miyazaki/miyazaki.ts) | Waste by 8:30 a.m., up to five bags; bulky waste through the call center; new tsunami map after the prefecture's August 2025 estimates; M HUB in 17 languages. M HUB's location and hours come only from search snippets and are left out (gap). |
| Kagoshima (`jp-46201`) | [kagoshima.ts](../../src/data/local-guidance/locations/kagoshima/kagoshima.ts) | Moves from abroad weekdays 8:45 a.m. to 4:30 p.m., not at the Chuo Station service station; bulky waste up to five items; Sakurajima volcano map (Japanese April 2026, other languages June 2023); consultation desk at the International Exchange Center. Gap: volcanic ash bags and other hazard maps. |
| Naha (`jp-47201`) | [naha.ts](../../src/data/local-guidance/locations/okinawa/naha.ts) | The site was redesigned in January 2026; the NHI FAQ from 2020 was not used. Foreign residents file only at the main Haisai Citizens Section; tax filing is at the Times Building and paused March 17 to May 31; the city says there are no free Japanese classes. Gaps: residence card wording for arrivals, tsunami map. |

Recheck items are in [LOCAL-GUIDANCE-RECHECK.md](../LOCAL-GUIDANCE-RECHECK.md). Shikoku capitals from the same batch are in
[SHIKOKU-CAPITALS-1.md](SHIKOKU-CAPITALS-1.md).
