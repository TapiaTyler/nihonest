# Research brief: official fees and cost disclosure

## Research identity

- `researchId`: `official-fees-and-cost-disclosure`
- Research date: use the actual date on which you complete the work.
- Jurisdiction: Japan, with overseas Japanese diplomatic missions included where relevant.
- Output: one schema-valid JSON file and one concise Markdown memo.

Conduct the research independently. Do not assume that a previously quoted amount is accurate merely because it appears in the prompt, an article, or a secondary source.

## Objective

Establish which known, documented official fees or no-fee procedures should be explained in Nihonest's existing guidance. Capture current amounts, already-promulgated future amounts, effective dates, transition rules, payment channels, processing charges, reductions or exemptions, and responsible authorities.

Also identify where a cost is not a nationally fixed government fee and should instead be described as a tax, contribution, local charge, private price, deposit, financial threshold, or current-official-link handoff.

## Priority 1: national immigration and consular procedures

Research all of the following:

1. Permission to change status of residence
2. Permission to extend period of stay
3. Permanent residence permission
4. Ordinary single-use and multiple-use re-entry permission
5. Special re-entry permission, including whether there is an application fee
6. Certificate of authorized employment
7. Certificate of Eligibility application, including whether there is an application fee
8. Permission to engage in activity other than that permitted under the status of residence, including whether there is an application fee
9. Acquisition of status of residence, including whether there is an application fee
10. Residence-card issuance, ordinary renewal, loss or theft replacement, damaged-card replacement, and optional replacement or exchange where these procedures differ
11. Visa issuance through Japanese diplomatic missions, including single-entry, multiple-entry, transit if still applicable, local-currency treatment, exemptions or differences, non-issuance, and approved-agency handling charges

For every procedure, determine whether the fee is charged on filing, permission, issuance, collection, or another event. Do not infer that every application has a fee.

## Priority 2: effective-dated immigration changes

Specifically investigate:

- the fee schedule applying before October 1, 2026;
- the schedule applying to applications accepted on or after October 1, 2026;
- whether the acceptance date, decision date, granted period, or another date controls;
- every counter-versus-online distinction;
- separate payment-processing charges;
- payment methods, including revenue stamps, bank payment, and convenience-store payment;
- reductions or exemptions and whether they are available through online filing;
- the treatment of applications pending across the effective date; and
- any official anti-fraud warning tied to the new payment process.

Record current and future rules as separate atomic claims. Do not describe a future schedule as already effective.

## Priority 3: bounded catalog cost scan

Identify material cost categories implicated by the following existing guidance, but do not attempt to calculate an individual's total cost:

- municipal residence certificates and other commonly requested municipal records;
- My Number Card issuance and materially different reissuance cases;
- foreign driver's-license conversion, examinations, license issuance, and prefectural variation;
- vehicle registration, inspection, compulsory insurance, parking certification, and taxes;
- school application, admission, tuition, and refund information from appropriate official education sources;
- tax certificates, filing, and payment procedures;
- National Health Insurance and National Pension, which must be classified as circumstance-dependent premiums or contributions rather than simple application fees;
- housing deposits, key money, brokerage, guarantor, insurance, and move-out charges;
- utilities, internet, mobile service, banking, waste disposal, and professional or agency charges.

For Priority 3, the preferred output is a classification and authoritative handoff. Supply a precise amount only when it is official, materially useful, appropriately scoped, and safe to maintain with an effective or access date.

## Relevant existing article IDs

Use these exact IDs when mapping content impacts:

- `permanent-residence-in-japan`
- `renewing-or-changing-your-status-of-residence`
- `reentry-permission-and-temporary-travel`
- `visa-and-status-of-residence-explained`
- `student-visa-and-certificate-of-eligibility`
- `choosing-a-work-status-and-coe`
- `accepting-international-students-and-supporting-coe-applications`
- `accepting-foreign-workers-and-supporting-coe-applications`
- `side-work-and-freelancing-on-a-work-status`
- `working-part-time-on-student-status`
- `documents-received-when-entering-japan`
- `understanding-my-number`
- `registering-your-address-after-arrival`
- `converting-a-foreign-drivers-license-in-japan`
- `buying-registering-and-insuring-a-vehicle-in-japan`
- `choosing-a-school-and-understanding-admission-requirements`
- `planning-your-studies-in-japan`
- `income-and-resident-tax-after-moving-to-japan`
- `filing-a-japanese-income-tax-return`
- `joining-national-health-insurance`
- `national-pension-after-moving-to-japan`
- `finding-housing-and-moving-in`
- `setting-up-electricity-gas-water-and-home-internet`
- `getting-a-phone-number-in-japan`
- `opening-a-bank-account-after-moving-to-japan`
- `sorting-household-waste-and-arranging-disposal`

If another existing article appears relevant but its ID was not supplied, name its visible subject under `followUpCandidates`; do not invent an ID.

## Current content gaps to evaluate

The five highest-priority articles currently explain their procedures but do not provide a complete effective-dated fee treatment:

- `permanent-residence-in-japan` explains routes, evidence, pending applications, and the April 2027 period-of-stay rule.
- `renewing-or-changing-your-status-of-residence` tells readers to use the current fee but does not state the fee schedules.
- `reentry-permission-and-temporary-travel` compares special and ordinary re-entry but does not state their fee distinction.
- `visa-and-status-of-residence-explained` separates COE, visa, landing permission, status, and period of stay but does not separate their costs.
- `student-visa-and-certificate-of-eligibility` separates admission, COE, visa, and landing but does not say which government application is free or locally charged.

Research whether each gap should be filled, and with what bounded wording. Do not draft complete replacement articles.

## Required primary-source starting points

Search the responsible authorities directly, including:

- Immigration Services Agency of Japan (`moj.go.jp/isa`)
- Ministry of Foreign Affairs of Japan and the responsible diplomatic-mission fee pages (`mofa.go.jp` and official mission domains)
- e-Gov laws and regulations where administrative guidance does not establish the controlling rule
- National Police Agency and prefectural police for driving procedures
- J-LIS and municipalities for My Number and local records
- National Tax Agency for national tax procedure
- Japan Pension Service and responsible health-insurance or municipal authorities
- Ministry of Education, Culture, Sports, Science and Technology and JASSO for education costs
- Ministry of Land, Infrastructure, Transport and Tourism and other responsible authorities for housing and vehicle procedures

These are starting points, not permission to cite a general home page for a specific claim.

## Exclusions

Do not:

- calculate personalized taxes, insurance premiums, pension contributions, tuition, housing costs, or relocation budgets;
- treat financial eligibility thresholds as fees;
- present an exchange-rate conversion as an official amount;
- collect commercial price comparisons;
- recommend immigration lawyers, agents, schools, banks, carriers, housing providers, or other businesses;
- determine whether an individual qualifies for a reduction, exemption, status, or permission;
- draft notification copy or mark any content as reviewed; or
- propose database, CMS, localization, or UI architecture.

## Required comparison questions

Your memo must answer:

1. Which official fees are important enough to state directly in current Nihonest articles?
2. Which procedures are explicitly free and worth saying so?
3. Which amounts need current-versus-future presentation?
4. Which application or event date controls each transition?
5. Which amounts differ by counter, online, consular post, nationality, municipality, prefecture, or provider?
6. Which apparent “fees” are actually taxes, contributions, deposits, financial thresholds, or private costs?
7. Which claims could not be verified confidently from an accessible primary source?
8. Which source changes would warrant a high-priority editorial review or user-facing critical update?

## Deliverables

Return:

1. `official-fees-and-cost-disclosure.json`, conforming exactly to `external-research-result.schema.json`.
2. `OFFICIAL-FEES-AND-COST-DISCLOSURE.md`, containing:
   - an executive finding;
   - a compact current/future fee comparison;
   - confirmed no-fee procedures;
   - variable-cost classifications;
   - conflicts and unresolved questions;
   - recommended article impacts; and
   - direct official sources.

Before returning the files, check that every claim's source IDs exist, every source's claim IDs exist, every precise amount includes its scope and effective date where applicable, and the JSON and Markdown agree.
