# Tokyo special wards: National Health Insurance batch 1

Official source inspection: September 23, 2026. This batch adds local
supplements to `joining-national-health-insurance` for Chiyoda (`jp-13101`),
Chuo (`jp-13102`), and Minato (`jp-13103`). The Shinjuku pilot already has a
supplement, so Tokyo ward coverage for this article is now 4/23. The other 19
wards continue to receive clearly labeled general lookup advice. All three
new supplements remain `needs-review`; no Japanese translation artifacts were
created or changed.

| Ward | Official evidence | Claim boundary |
|---|---|---|
| Chiyoda | The [procedure table](https://www.city.chiyoda.lg.jp/koho/kurashi/hoken/kenkohoken/kokuho.html), updated March 24, 2026, distinguishes a domestic move (National Health Insurance Section, General Service Counter, or branch) from a foreign resident's arrival from abroad (National Health Insurance Section or branch, with residence card or special permanent resident certificate, passport, and a Designated Activities designation where applicable). It asks for enrollment or withdrawal notice within 14 days. The [online-service page](https://www.city.chiyoda.lg.jp/koho/kurashi/hoken/kenkohoken/tetsuzuki-online.html) permits specified employer-plan transitions, but excludes enrollment due to a move or birth. | Do not call all enrollment events online-eligible or send an overseas arrival to the General Service Counter. Eligibility and the appropriate documents still depend on the resident's coverage and status. |
| Chuo | The [current notification page](https://www.city.chuo.lg.jp/a0024/kurashi/hokennenkin/kokuho/kokuhonitsuite/tetsuzuki/kanyu.html) sets a general 14-day notice period and lists different documents for moving in, losing another health plan, moving out, and joining another plan. It includes foreign-resident card and passport checks and notes a Designated Activities designation check. Its [postal instructions](https://www.city.chuo.lg.jp/a0024/kurashi/hokennenkin/kokuho/kokuhonitsuite/tetsuzuki/r2kokuhoyuusoutetuduki.html) describe eligible enrollment and withdrawal filings through the Insurance and Pension Section Qualification Desk. | Do not infer that every case can be completed by post or that documents sent by post will be returned. The current checklist and office should determine the route. |
| Minato | The [notification page](https://www.city.minato.tokyo.jp/shikaku/kurashi/hoken/kenkohoken/todokede.html), updated May 20, 2026, routes notices to district general branch offices and the Daiba branch. It rejects future-dated notices and asks for filing within 14 days after the event. Its table distinguishes a move from another municipality, loss of employer coverage, and withdrawal on joining a new plan. The [foreign-resident FAQ](https://www.city.minato.tokyo.jp/shikaku/kuse/kocho/faq/hoken/084.html), also updated May 20, lists exclusions that can apply to foreign residents. | Residence in Minato alone is not a sufficient eligibility test. The FAQ does not decide an individual's immigration or insurance case, and no premium estimate is copied into the supplement. |

The source pages are Japanese. The English supplements summarize the
procedure boundaries and link directly to those pages; they are not official
translations. The next NHI batch can continue in code order with Bunkyo,
Taito, and Sumida, after checking their current insurance and resident-service
routes. The generic fallback remains in place for unresearched ward/article
pairs.
