# Official fees and cost disclosure

Prepared September 18, 2026 as a proposed Phase 13 closure workstream.

## Finding

The catalog discusses budgeting and financial eligibility, but it does not consistently tell readers what a government procedure costs. This is now a material gap because Japan has recently changed both consular and residence-procedure fees and has announced another major residence-fee revision.

For applications accepted through September 30, 2026, permanent residence currently costs ¥10,000 when granted. For applications accepted on or after October 1, 2026, the counter fee will be ¥200,000. Applications accepted before October 1 retain the earlier amount even if permission is granted later.[^1][^2][^3]

The same October revision makes change-of-status and extension fees depend on the period granted. Counter fees will range from ¥10,000 for three months or less to ¥75,000 for five years or more. Online base fees will range from ¥10,000 to ¥65,000, with a separate ¥330 or ¥550 processing charge depending on the amount. Online payment will use supported convenience-store or bank payment rather than revenue stamps. Defined reductions or exemptions may apply, and the online system does not handle reduction applications.[^1][^3][^4]

Other high-confidence examples show why the content must identify the procedure and channel precisely:

- an ordinary re-entry permit currently costs ¥4,000 for one use or ¥7,000 for multiple use at a counter, and ¥3,500 or ¥6,500 online; the separate special re-entry system must not be described as the same paid application;[^5]
- a certificate of authorized employment costs ¥2,000 at a counter or ¥1,600 online under the April 2025 schedule; online applications accepted from October 1, 2026 retain the ¥1,600 base amount and add a ¥220 processing charge;[^3][^6]
- a Certificate of Eligibility application has no government application fee;[^7]
- for visa applications accepted by overseas missions from July 1, 2026, the reference amounts are approximately ¥15,000 for single entry and ¥30,000 for multiple entry, collected in local currency, subject to nationality or purpose differences and exemptions; an approved agency may charge a separate handling fee.[^8]

These examples should not become isolated numbers pasted into prose. Every amount needs an effective date, charged event, responsible authority, payment channel, transition rule, material exception, and source. Future and historical schedules must be visibly labeled.

## Proposed implementation order

1. Update permanent residence, change/extension, re-entry, and visa/COE foundation guidance with the current and already-published future schedules.
2. Add fee details to the specific re-entry and Certificate of Eligibility paths, including explicit no-fee statements where useful.
3. Audit the rest of the catalog for material government charges: employment certificates, residence-card procedures, driving and vehicle procedures, municipal certificates, tax documents, and other official services.
4. Review school, housing, utilities, banking, medical, transport, and professional-service content for clear variable-cost and refund-language handoffs without inventing universal prices.
5. Decide after the first repeated implementations whether a typed effective-dated fee component reduces drift enough to justify the schema and UI work.
6. Run source, editorial, relationship, and coverage checks before the Phase 13 human-review handoff.

## Presentation contract

A useful fee disclosure should answer:

- What exact procedure or item is charged?
- Who charges it, and when is it due?
- What amount and currency apply?
- Which acceptance, issue, tax, academic, or service date controls?
- Does counter, online, local, or agency handling change the amount or payment method?
- Is the amount fixed nationally, locally variable, converted into local currency, or privately set?
- What exemptions, reductions, refunds, deposits, or non-refundable conditions materially change the user's planning?
- Which official page should the reader verify immediately before paying?

Taxes, premiums, contributions, proof-of-funds requirements, refundable deposits, and private prices must remain separately labeled rather than being folded into “fees.”

## Refactor timing

The retained `docs/refactor.md` is architectural context from the earlier project discussion. Its recommended behavior-preserving structural checkpoint should occur after Phase 13 closure and before Phase 14 multiplies content through localization. The fee work should establish only the smallest reusable content contract justified by actual repetition; it should not become a pretext for a CMS, database migration, or broad redesign.

## Sources

[^1]: Immigration Services Agency of Japan, [Revision of residence permission fees effective October 1, 2026](https://www.moj.go.jp/isa/01_00644.html), accessed September 18, 2026.
[^2]: Immigration Services Agency of Japan, [Permanent residence application](https://www.moj.go.jp/isa/applications/procedures/16-4.html), accessed September 18, 2026.
[^3]: Immigration Services Agency of Japan, [Online application fees and payment methods for applications from October 1, 2026](https://www.moj.go.jp/isa/11_00107.html), accessed September 18, 2026.
[^4]: Immigration Services Agency of Japan, [Questions and answers about the October 1, 2026 fee revision](https://www.moj.go.jp/isa/applications/faq/01_00650.html), accessed September 18, 2026.
[^5]: Immigration Services Agency of Japan, [Re-entry permission application](https://www.moj.go.jp/isa/immigration/procedures/16-5.html), accessed September 18, 2026.
[^6]: Immigration Services Agency of Japan, [Fees for immigration procedures revised April 1, 2025](https://www.moj.go.jp/isa/content/001433809.pdf), accessed September 18, 2026.
[^7]: Immigration Services Agency of Japan, [Certificate of Eligibility application](https://www.moj.go.jp/isa/applications/procedures/16-1.html), accessed September 18, 2026.
[^8]: Ministry of Foreign Affairs of Japan, [Visa fees for applications accepted from July 1, 2026](https://www.mofa.go.jp/j_info/visit/visa/procedure/pagewe_000001_00391.html), accessed September 18, 2026.
