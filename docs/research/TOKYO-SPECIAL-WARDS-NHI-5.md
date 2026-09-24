# Tokyo special wards: National Health Insurance batch 5

Official source inspection: September 24, 2026. This batch adds local
supplements to `joining-national-health-insurance` for Nakano (`jp-13114`),
Suginami (`jp-13115`), and Toshima (`jp-13116`). Tokyo special-ward coverage
is now 16/23; the other 7 wards retain clearly labeled general lookup advice.
All three new supplements remain `needs-review`; no Japanese translation
artifacts were created or changed. Researched by Claude with
`npm run local-guidance` (worksheet, fetch, and `check --links --evidence`).

| Ward | Official evidence | Claim boundary |
|---|---|---|
| Nakano | The [joining page](https://www.city.tokyo-nakano.lg.jp/kurashi/hoken/tetsuduki/kanyu.html), updated October 16, 2025, asks for notice within 14 days after the event and states that a notice cannot be filed before it. It asks for the moving-in notification first, then lists a moving-out certificate, identity evidence, and the household head's My Number evidence; leaving workplace or dependent coverage needs an official loss certificate. Postal joining is limited to leaving workplace or dependent coverage, with a loss certificate and no unpaid premiums, sent by registered or tracked mail. The [regional-office FAQ](https://www.city.tokyo-nakano.lg.jp/faq/kokuho/kokuho27.html), updated October 1, 2025, says the Egota, Saginomiya, Eastern, Minami-Nakano, and Nogata regional offices accept joining on weekdays from 8:30 to 17:00, but not at the Tuesday extended-hours or third-Sunday holiday counters. | The supplement does not describe foreign-resident eligibility; the page lists residence cards only as identity evidence. It does not cover the ward's bank-transfer setup at the counter. |
| Suginami | The [joining page](https://www.city.suginami.tokyo.jp/s035/1986.html), updated April 1, 2026, says a person moving in raises National Health Insurance during the move-in procedure and a birth starts with the family-register procedure. Other events are filed within 14 days after the event and, in principle, not before it. Counters are the Qualification Section (East Building 2F, counter 9), district resident offices, and the Residents Section (East Building 1F) on the first, third, and fifth Saturdays. A representative from another household needs authorization. Postal joining covers leaving workplace or dependent coverage and is limited to the household head or a same-household member; an electronic application accepts uploaded document images. | The page does not state which events the electronic application covers, so the supplement does not narrow it. It does not repeat the page's identity-document list or its roughly one-week postal turnaround. |
| Toshima | The [notification page](https://www.city.toshima.lg.jp/109/tetsuzuki/nenkin/kenkohoken/todokede/004920.html), updated August 19, 2026, asks for notice within 14 days. The National Health Insurance Division is open weekdays 8:30–17:00 and the second Saturday 9:00–17:00. Joining is filed at the division or a district resident office, with electronic filing also listed for leaving workplace coverage and postal filing of the joining form. A foreign resident newly covered by resident registration brings a passport and residence card or Special Permanent Resident Certificate, plus the designation document for Designated Activities. Premiums are paid by account transfer, applied for at joining with a Pay-easy cash card and PIN or a passbook and registered seal. A non-household representative needs authorization, and people with unpaid premiums may not be able to file at a district office. | The supplement does not state the three-month stay threshold for foreign residents beyond "newly covered by resident registration", or holiday-counter dates, which change. |

The cited procedure pages are Japanese. The English supplements summarize
their local procedure boundaries and link directly to the official pages;
they are not official translations. The next NHI batch in code order is Kita
(`jp-13117`), Arakawa (`jp-13118`), and Itabashi (`jp-13119`). The finder
browser test now uses Kita as its unresearched ward.
