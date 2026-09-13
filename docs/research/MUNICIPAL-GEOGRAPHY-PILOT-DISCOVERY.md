# Municipal geography pilot discovery

Prepared September 13, 2026 for Phase 13 Iteration 12A.

## Recommendation

Use **Shinjuku City and Nagoya City together as a paired pilot**.

This is more valuable than choosing two structurally similar municipalities:

- Shinjuku is a Tokyo special ward with a dedicated foreign-resident website and unusually strong English HTML coverage.
- Nagoya is a designated city whose residents use one of sixteen ward offices. Its foreign-resident information is distributed across city HTML, Easy Japanese pages, multilingual PDFs, and Nagoya International Center services.

The pair forces the model to represent both governmental hierarchy and source-format differences before wider geographic expansion. Fukuoka is not part of the proposed pilot.

## Proposed product model

Keep one canonical national article and attach small local supplements. Do not create a full Shinjuku or Nagoya copy of an article.

Each supplement should identify:

- the supported geography and its type;
- the parent prefecture or metropolis;
- the procedure owner and receiving office;
- what local action, document, lookup, or contact differs;
- the authoritative source and source language;
- the effective date when known and last verification date;
- whether the information is a rule, office route, practical aid, or live-information link; and
- a warning when exact address, household, coverage, tax year, or current conditions still control.

The geography hierarchy must distinguish:

1. Japan;
2. Tokyo Metropolis or Aichi Prefecture;
3. Shinjuku special ward or Nagoya designated city; and
4. a Nagoya ward office or another service area when it controls where the resident files—not as a separate municipality unless it actually is one.

## Proposed first implementation surfaces

Iteration 12B should pilot local supplements on six existing guides:

1. **Registering your address after arrival** — moving from overseas, another municipality, or within the municipality; responsible counter; household-relationship and translation issues.
2. **Joining National Health Insurance** — local enrollment and withdrawal route while preserving national coverage distinctions.
3. **Sorting household waste and arranging disposal** — local categories, multilingual guides, collection lookup, and oversized waste.
4. **Income and resident tax after moving to Japan** — local information and office routing without individualized calculation.
5. **Preparing for disasters and evacuation in Japan** — official local hazard maps and multilingual information, subordinate to live instructions.
6. **Finding Japanese-language and local support** — consultation, learning, interpretation, and referral services with the actual provider named.

This set is deliberately small. It exercises national rules administered locally, genuinely local rules, address-level variability, yearly material, safety information, and third-party city-linked support.

## Why not local journeys or copied articles

Location is context, not a primary relocation route. A user moving to Japan for work or study should not lose that journey because they selected Shinjuku or Nagoya. The local layer should enrich the relevant journey steps and articles.

Copied local articles would drift from the national version, duplicate search results, and make a future municipality expansion unmanageable. A supplement makes the difference visible while leaving the full canonical explanation intact.

## Location selection

The pilot should use an explicit optional selector. It must not infer location from an IP address or browser permission. Users who make no selection continue to see national guidance and a prompt to check their municipality.

Initially, a device-local preference is the smallest useful implementation. Account synchronization should remain optional until the pilot shows that saved location materially improves repeated use. Search should still find supported local information by typing “Shinjuku” or “Nagoya” even when neither is selected.

## Accessibility and language

Shinjuku's English HTML pages are useful for accessible direct links. Nagoya exposes a different but realistic mix: Easy Japanese HTML, multilingual PDFs, city pages, and Nagoya International Center content. Nihonest must provide its own concise accessible explanation outside a PDF and label the source language and format. It must not describe its summary as an official translation.

Telephone schedules, languages, fees, office hours, form editions, collection dates, and live warnings can change quickly. Prefer links to the current official page over copying volatile values. If a value must be shown, date it and include it in source monitoring.

## Important jurisdiction findings

- Shinjuku is not an ordinary city even though its English name uses “City”; it is a special ward under the Tokyo metropolitan structure.
- Nagoya's wards are administrative subdivisions of a designated city and are not equivalent to Tokyo's special wards.
- A national rule may be filed through a municipal counter without becoming a municipal rule.
- Tokyo Metropolitan and Aichi Prefectural sources can apply alongside the immediate Shinjuku or Nagoya procedure.
- Nagoya International Center should be attributed as the provider of its services and guidance, not treated as the author of every city rule.
- Waste collection may vary below municipality level. The product should link to address-specific official tools rather than generating a collection date.
- Hazard maps are scenario-specific planning resources, not live evacuation decisions.

## Primary-source base

### Shinjuku

- [First-time visitors to Japan](https://www.foreign.city.shinjuku.lg.jp/en/first/)
- [Notification procedures for a change of address](https://www.foreign.city.shinjuku.lg.jp/en/kurashi/jyushohenko/)
- [National Health Insurance enrollment and withdrawal](https://www.foreign.city.shinjuku.lg.jp/en/kurashi/kokuhotodokede/)
- [Recyclable resources and garbage](https://www.foreign.city.shinjuku.lg.jp/en/kurashi/shigenyagomi/)
- [Shinjuku flood hazard map](https://www.foreign.city.shinjuku.lg.jp/en/kurashi/hazard/)
- [Foreign Resident Advisory Corner](https://www.foreign.city.shinjuku.lg.jp/en/sodan/)

### Nagoya

- [Nagoya Living Guide](https://www.city.nagoya.jp/shisei/kokusai/1017227/1017236.html)
- [Easy Japanese procedures checklist](https://www.city.nagoya.jp/kurashi/easyjapanese/1017885/1017886.html)
- [National Health Insurance enrollment and withdrawal](https://www.city.nagoya.jp/kurashi/hoken/1011736/1011750/1011751.html)
- [Nagoya garbage reduction and recycling guide](https://www.city.nagoya.jp/kurashi/gomi/1012183/1012187/1042497.html)
- [Guide to Japanese personal taxes](https://www.city.nagoya.jp/kurashi/zeikin/1012135/1017900/1042197.html)
- [Disaster information for foreign residents](https://www.city.nagoya.jp/bousaiportal/international/index.html)
- [Nagoya International Center](https://www.nic-nagoya.or.jp/en/)

## Decisions requested before Iteration 12B

1. Approve Shinjuku and Nagoya as a paired pilot.
2. Approve the six initial guide surfaces listed above.
3. Approve local supplements on canonical articles instead of local article copies or journeys.
4. Approve a device-local optional location preference for the pilot, with account synchronization deferred until its value is demonstrated.

No Docker, Supabase, provider account, or active development server is required for this discovery checkpoint.
