# Aichi: Nagoya National Health Insurance

Official source inspection: September 24, 2026. This batch replaces the B1 pilot supplement for Nagoya
(`nagoya`, canonical `jp-23100`) on `joining-national-health-insurance` with a detailed one. It remains
`needs-review`; no Japanese translation artifacts were created or changed. Researched by Claude with
`npm run local-guidance` (fetch and `verify`).

Nagoya runs National Health Insurance city-wide; its 16 administrative wards are service counters, not separate
insurers. From this batch, a designated-city ward without its own supplement shows the city's supplement in the
local-guidance panel and the prefecture finder, labeled as applying city-wide. Aichi's other municipalities are not
in the registry yet.

| Location | Official evidence | Claim boundary |
|---|---|---|
| Nagoya | The [joining and withdrawal page](https://www.city.nagoya.jp/kurashi/hoken/1011736/1011750/1011751.html), updated April 1, 2026, requires a joining notice within 14 days and states that benefits after a late notice generally start from the filing date, while premiums run from the month of the event. It says no notice is needed during voluntary continuation, and it sets foreign-resident coverage: resident registration with a stay of more than three months, or listed statuses (Entertainer, Technical Intern Training, Dependent, Official, Designated Activities) with evidence of a longer stay; Designated Activities residents bring the designation document, and some purposes such as medical treatment are excluded. The [documents page](https://www.city.nagoya.jp/kurashi/hoken/1011736/1011750/1011752.html), updated August 1, 2026, lists (1) a coverage-loss certificate, retirement certificate, or separation notice with a cash card, (2) a moving-out certificate with a cash card, and (3) birth evidence; the filer brings photo identification and must be the person joining or a same-household member. The [electronic joining page](https://www.city.nagoya.jp/kurashi/hoken/1011736/1011815/1033741.html), updated August 1, 2026, covers leaving workplace coverage or the end of voluntary continuation, after the pre-check list is confirmed; otherwise residents use the ward office Insurance and Pension Section or a branch Resident Welfare Section. | The supplement does not reproduce the birth-case documents (childbirth-payment agreement and receipts), premium reductions, or the full list of excluded Designated Activities purposes. It does not claim ward-specific counter hours. |
