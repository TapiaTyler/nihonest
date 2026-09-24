# Tokyo special wards: local-guidance coverage audit

Audited September 23, 2026, after address-registration batches C1–C7. This is
an English-content and source-link audit, not human editorial approval or a
source-monitoring baseline acceptance. Japanese localization remains deferred
by the user.

## Coverage and integrity

| Surface | Tokyo special-ward coverage | Finding |
|---|---:|---|
| Registering your address after arrival | 23/23 | One supplement per special ward, in administrative code order `13101`–`13123`. Shinjuku keeps its public legacy ID while mapping to canonical `jp-13104`. |
| Joining National Health Insurance | 1/23 | Shinjuku only. |
| Sorting household waste and arranging disposal | 1/23 | Shinjuku only. |
| Preparing for disasters and evacuation in Japan | 1/23 | Shinjuku only. |
| Finding Japanese-language and local support | 1/23 | Shinjuku only. |
| Income and resident tax after moving to Japan | 1/23 | Shinjuku only. |

Nagoya has one supplement on each of these six guides. Across both areas the
collection contains 34 supplements: 23 Tokyo address records, one Nagoya
address record, and ten Shinjuku/Nagoya records for the other five subjects.
All remain `needs-review`, with a September 23 supplement inspection date.
The finder projects the 23 Tokyo wards and Nagoya from actual supplements;
it does not infer guide-level coverage for a ward from prefecture membership.
For a selected ward without a supplement on the current guide, the local panel
shows the national guide and an explicit no-local-supplement message.

The 23 Tokyo address supplements reference 41 distinct official source records
(38 Japanese, three English). Every referenced ID resolves in the registry,
and each supplement resolves to an existing article and canonical geography.
The browser opened all 41 linked municipal pages or PDFs during this audit;
none returned a missing-page result through that browser. This checks reachability,
not every statement, future availability, embedded document, or source fingerprint.
The earlier B1 refresh records a September 23 inspection of Shinjuku's English
address page; its source metadata still said September 13. The source record's
`lastCheckedAt` has been aligned to that documented inspection and this audit.

The repository's dry-run source checker first failed to start in the sandbox:
Node's `os.userInfo()` returned `uv_os_get_passwd returned ENOMEM`. An
outside-sandbox dry run then attempted three representative ward sources
(Chiyoda, Arakawa, Edogawa); all three returned `unavailable` with a fetch
`TypeError`, even though the browser opened those official pages. This is an
environment or client failure, not evidence that the pages are missing. No
monitoring state, candidate fingerprint, or accepted baseline was changed.
The local-guidance and finder test files passed (four tests), confirming the
expected membership and reference invariants.

## Next local-guidance documents, in priority order

1. **Joining National Health Insurance.** Address registration leads directly
   to coverage decisions. The ward owns enrollment and withdrawal routing,
   document checks, and any eligible online route. Keep national eligibility
   and employer-plan exclusions in the canonical guide; link to each ward's
   current procedure rather than reproducing premiums. [Edogawa's enrollment
   page](https://www.city.edogawa.tokyo.jp/e053/kurashi/iryohoken/kokuho/shikaku/kanyu.html)
   and [Koto's online-procedure page](https://www.city.koto.lg.jp/250102/kokuho/pittari.html)
   illustrate the local difference.
2. **Sorting household waste and arranging disposal.** This is immediately
   useful at a new address and genuinely local: categories, collection areas,
   and oversized-item booking differ. Link to the ward's current sorting and
   address-specific collection tools; do not store a ward-wide collection day.
   [Edogawa's foreign-resident waste guide](https://www.city.edogawa.tokyo.jp/foreign/joho/gomi.html)
   says collection days depend on where the resident lives.
3. **Preparing for disasters and evacuation in Japan.** Give each ward's
   official hazard-map and live-information entry points, with clear exact-
   address and scenario limits. The local supplement must distinguish a
   planning map from live evacuation instructions. [Koto's disaster portal](https://bosai.city.koto.lg.jp/)
   offers map and shelter lookups.
4. **Finding Japanese-language and local support.** Name the ward or actual
   provider and link consultation and class directories. Do not copy volatile
   languages, places, fees, or schedules. [Nerima's learning page](https://www.city.nerima.tokyo.jp/kurashi/kokusai/nihongokouza.html)
   illustrates the changing class calendar.
5. **Income and resident tax after moving to Japan.** Add ward-specific
   reporting, notice, payment, departure, and contact routes after the more
   immediate arrival and daily-life subjects. Preserve the January 1
   municipality and tax-year boundary; do not calculate a person's tax or
   copy annual figures into a standing supplement.

**Next candidate outside the six-guide pilot:** `national-pension-after-moving-to-japan`.
It is linked to address registration, has municipal enrollment and relief
routes, and currently has no local supplement. Research its jurisdiction and
counter differences before adding it to the local-guidance model.

The next bounded implementation batch should extend **National Health
Insurance** to a small group of already supported Tokyo wards, checking
enrollment, withdrawal, office/online route, and eligibility caveats from
current ward sources. Keep each supplement `needs-review` pending human
editorial approval. Translation remains outside this geography iteration.
