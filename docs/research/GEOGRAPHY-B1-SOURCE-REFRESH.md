# Geography B1: Shinjuku and Nagoya source refresh

Manual source inspection: 2026-09-23. This is an evidence and draft-guidance
checkpoint for the 12 pilot supplements. The supplements remain `needs-review`.
The new `lastCheckedAt` date records inspection of the cited official pages;
it is neither human editorial approval nor acceptance of a source-monitoring
fingerprint. `content/source-monitoring/state.json` and existing source
baseline dates were not changed. Linked PDFs, forms, and every seasonal service
detail were not exhaustively reviewed.

| Supplement | Official evidence and finding | Draft action |
|---|---|---|
| `shinjuku-address-registration` | [Shinjuku's change-of-address index](https://www.foreign.city.shinjuku.lg.jp/en/kurashi/jyushohenko/) distinguishes overseas, intermunicipal, within-ward, and departure routes and explains translation of foreign-language relationship records. Its linked [overseas-arrival detail](https://www.city.shinjuku.lg.jp/todokede/koseki04_001009.html) directs interpreted and group visits to the main office. That detail still contains a COVID waiting-period note dated 2021; do not reuse that stale paragraph. | Clarified that some cases need the main office; continue to direct readers to the current route for their case. |
| `nagoya-address-registration` | [Nagoya's resident-register procedure](https://www.city.nagoya.jp/kurashi/todokede/1007833/1007834/1007835.html) distinguishes outside-city and within-city moves, names the receiving ward office or branch, and says inbound/within-city filings are at the counter. The cited [Easy Japanese checklist](https://www.city.nagoya.jp/kurashi/easyjapanese/1017885/1017886.html) does not establish those office details by itself. | Added the already registered detailed procedure as a cited source and distinguished the two source languages. |
| `shinjuku-national-health-insurance` | [Shinjuku's NHI procedure](https://www.foreign.city.shinjuku.lg.jp/en/kurashi/kokuhotodokede/) describes enrollment/withdrawal events, household-head notification, and retroactive eligibility. | Existing cautious eligibility and event wording remains supported; no fixed premium or coverage promise added. |
| `nagoya-national-health-insurance` | [Nagoya's NHI procedure](https://www.city.nagoya.jp/kurashi/hoken/1011736/1011750/1011751.html) gives the 14-day route and ward/branch contact. Its separate [electronic-service index](https://www.city.nagoya.jp/kurashi/hoken/1011736/1011815/index.html) permits online notification only for listed events, including specified employer-plan transitions. | Added the electronic-service source and narrowed the electronic-route wording. |
| `shinjuku-household-waste` | The [foreign-resident waste page](https://www.foreign.city.shinjuku.lg.jp/en/kurashi/shigenyagomi/) links multilingual guides. The current [household-waste index](https://www.city.shinjuku.lg.jp/seikatsu/index09_01s.html) separates collection days, battery routes, bulky waste, and appliances the ward cannot collect. | Added the direct household-waste index as evidence; address-specific day and item classification remain with Shinjuku. |
| `nagoya-household-waste` | [Nagoya's waste guide](https://www.city.nagoya.jp/kurashi/gomi/1012183/1012187/1042497.html) links multilingual PDFs and the city's collection-day search. It warns that some printed locations should be checked against current web pages. | Existing address-specific lookup and format note remain supported. |
| `shinjuku-resident-tax` | [Shinjuku's resident-tax page](https://www.foreign.city.shinjuku.lg.jp/en/kurashi/jyuminzei/) supports the January 1 municipality, reporting exceptions, and departure/payment advice. | No rates or annual threshold repeated; current caveats remain. |
| `nagoya-resident-tax` | The foreign-resident [tax guide](https://www.city.nagoya.jp/kurashi/zeikin/1012135/1017900/1042197.html) describes the system as of October 2025, while the [current personal resident-tax index](https://www.city.nagoya.jp/kurashi/zeikin/1037356/1011880/index.html) links assessment-year 2026 rules. | Added the current-year source and made the older guide's edition explicit. Readers must confirm the relevant tax year. |
| `shinjuku-disaster-preparation` | The [English flood page](https://www.foreign.city.shinjuku.lg.jp/en/kurashi/hazard/) gives the modeled scenario. The [current map page](https://www.city.shinjuku.lg.jp/anzen/file03_00016.html), updated August 25, 2026, explains that modeled inundation is not a live prediction and points to current map/evacuation resources. | Added the current map page; kept live-instruction and exact-address caveats. |
| `nagoya-disaster-preparation` | Nagoya's [foreign-resident portal](https://www.city.nagoya.jp/bousaiportal/international/index.html) links emergency-information tools, but by itself does not provide the claimed local preparedness details. The [city guidebook and ward information](https://www.city.nagoya.jp/bousaiportal/hazardmap/1013495.html) provide multilingual preparation and ward-specific risk material; [NIC](https://www.nic-nagoya.or.jp/en/) carries multilingual emergency information. | Added the guidebook source and split live information from preparation and local risk checks. |
| `shinjuku-language-and-consultation` | Shinjuku's [consultation page](https://www.foreign.city.shinjuku.lg.jp/en/sodan/) names the advisory counters and languages; its [Japanese-learning page](https://www.foreign.city.shinjuku.lg.jp/en/japanese/) lists classes with different ages, schedules, fees, and Shinjuku-resident priority. | Existing instruction to verify the specific service remains necessary; no volatile details copied. |
| `nagoya-language-and-consultation` | [Nagoya International Center](https://www.nic-nagoya.or.jp/en/) links consultation, interpretation, and living information, and its [information counter](https://www.nic-nagoya.or.jp/en/information-service-counter/) names the provider and languages. It is a support provider, not the decision maker for city or immigration procedures. | Existing provider attribution and referral caveat remain supported. |

## Remaining editorial boundary

These are source-alignment edits to structured English supplements, not a claim
that each linked annual form, language schedule, office hour, hazard PDF, or
tax calculation is fully current. No supplement was marked `verified`; no
source-monitoring candidate was accepted. A human editor must review the
current exact guidance and sources before approval under
`docs/EDITORIAL-WORKFLOW.md` and `docs/SOURCE-REVIEW.md`. If a monitoring check
later detects a changed fingerprint, that candidate needs its own dependency
review. Japanese localization is outside this iteration.
