# Educational Activity Cross-Reference Discovery

Prepared September 13, 2026. The editor approved this Iteration 15A scope on September 13, 2026.

## The feature should answer a smaller, safer question

“Can I do this?” sounds binary, but the useful product question is: **which independent rules and facts must I check before I do this?** The same proposed activity can involve immigration authorization, an employer or contract restriction, working-time rules, a Japanese professional licence, tax, social insurance, and local procedure. Approval in one layer does not settle the others.

The recommended feature is therefore an educational cross-reference, not an eligibility questionnaire. It should identify potentially relevant routes and explain why they deserve examination, expose missing facts and exceptions, and send the reader to canonical Nihonest guidance and the responsible authority. It must not announce that an activity is legal, that a status will be granted, or that one route is the user's “best visa.”

ISA's status table itself organizes activity-based statuses around what a person may do in Japan, while status-based residence categories have different work consequences.[^1] That makes activity a useful discovery entrance, but not a sufficient legal conclusion.

## Recommended pilot activity families

The complete taxonomy should be capable of representing eight common intentions:

1. take a job, change employer, or materially change duties;
2. add side work, freelance work, or another paid activity;
3. study, train, or complete an internship while already resident;
4. start, own, operate, or manage a business;
5. join family in Japan or support a family member's move;
6. perform work governed by a Japanese professional licence;
7. leave Japan temporarily and return under the same status; and
8. receive income and determine which tax questions follow.

For a manageable Iteration 15B, implement the first four as the deepest interactive pilot. They exercise the most important reusable distinctions: principal versus secondary activity, paid versus unpaid activity, employer and client relationships, current work authorization, outside-activity permission, changed duties, and business ownership versus operation. Family, regulated-profession, re-entry, and tax-only entrances can initially appear as direct structured handoffs and be expanded after the interaction is validated.

This is a scope boundary, not a statement that the later families are less important. Paid-activity results must still show tax and licensing layers when relevant.

## Ask only facts that change the handoff

The first flow should use progressive controlled choices. A user should be able to begin without knowing a Japanese residence-status name.

Useful questions include:

- Are you outside Japan, visiting temporarily, or residing under a named status or program?
- What activity do you plan to perform, and is it the principal reason you will be in Japan or something secondary?
- Will it be paid, income-producing, or connected to operating a business?
- Is the relationship employment, a client contract, a school or host arrangement, independent activity, or investment only?
- Is the organization or client in Japan, overseas, or both, and where will the work be performed?
- Are the new duties materially different from the present authorized activity?
- Does the work require a Japanese professional licence or registration?
- Has the activity begun, and what application, permission, notification, departure, or expiry dates apply?

The flow should not request a personal narrative, identity numbers, passport details, exact income, uploaded documents, medical facts, or other sensitive evidence. Those details are not needed to route someone to education, and collecting them would make a static guidance feature resemble a case-assessment service.

## Results need layers, not a verdict

Each result should have the same predictable structure:

1. **Why this guidance appears** — restate the selected activity and the distinctions that triggered the result.
2. **Residence routes to examine** — present candidate statuses or permissions as comparisons, never recommendations or a whitelist.
3. **Rules to check separately** — immigration, employer or contract, professional licensing, tax, social insurance, and local rules as applicable.
4. **Facts still to verify** — a short checklist of missing facts that could change the analysis.
5. **Important exceptions** — only current, source-backed exceptions relevant to this branch.
6. **Read next** — canonical guides, residence-status pages, FAQs, glossary terms, and optionally a relevant journey.
7. **Check with the authority** — current official sources and the correct help channel.

Avoid green and red results, pass/fail icons, percentage confidence, and phrasing such as “likely eligible.” A label may describe Nihonest's **coverage**, not the person's prospects: `Reviewed coverage`, `Limited coverage`, or `Authority check required`.

## Side work demonstrates why the layers matter

ISA describes permission for activity outside the status as permission needed for income-producing business or remunerated activity outside the current status scope. Its current guidance distinguishes blanket and individual permission, identifies individual treatment for activities outside the blanket pattern, and expressly includes sole-proprietor work or activity whose hours are objectively difficult to verify among individual-permission examples.[^2]

That does not mean every secondary activity requires the same application. A work-status holder may propose duties within the current authorized scope, a Student or Dependent may have a blanket permission with defined limits, a status-based resident may have no immigration activity restriction, and an individual Designated Activities document may control. The tool must first explain which distinction needs checking.

Employment is separate. MHLW maintains side-job and concurrent-employment guidance, model work-rule material, and working-time resources.[^3] Tax is separate again. NTA's final-return and individual-tax guidance depends on income, taxpayer position, withholding, and other facts; “immigration allowed it” is never a filing answer.[^4][^5]

## Changed work is more than a notification question

A worker changing employers or duties may need to compare the new activity with the current status, consider a change-of-status application, complete a personal notification, and account for an employer's separate report. These actions do not substitute for one another.

ISA's change-of-status process examines the activity a person proposes to perform.[^6] Its current extension and change guidelines also describe a discretionary review that considers activity fit and wider residence circumstances; meeting a short list cannot guarantee permission.[^7] The cross-reference should therefore say “compare these routes and facts” rather than infer continuity from a similar job title.

A Certificate of Authorized Employment can help clarify remunerative activities a resident may perform, but ISA states that the certificate is evidence rather than the underlying permission and is not universally required where authorization is otherwise clear.[^8] The feature should surface that distinction when a user asks how to confirm work scope, not present the certificate as an approval the user must always obtain.

## Professional licensing must remain independent

An unrestricted immigration work status removes an activity-based immigration restriction; it does not authorize reserved professional practice. Conversely, a Japanese professional licence does not create a residence status or outside-activity permission. The structured model already represents licence conditions for Medical Services and Legal/Accounting Services, but a public cross-reference must route each profession to its current regulator and canonical guide rather than extrapolate one licensing rule across occupations.

The first deep pilot does not need a universal registry of regulated professions. It needs a reusable `professional licensing may apply` layer and one verified medical-or-care example to prove the boundary. A later expansion can add regulators profession by profession.

## The current structured data needs an approval gate

Nihonest already models route kind, periods, work-authorization mode, activity boundaries, alternative qualification pathways, organization conditions, renewal, transitions, evidence, search terms, and effective-dated source assertions. This is a strong base for deterministic cross-referencing.

The missing prerequisite is assertion-level editorial state. Current structured records use `researchState: draft-pilot`, and each source assertion records what a source supports and when it was checked, but not whether a human editor approved that exact assertion for decision support. A status record's existence or `needs-review` label must not be silently interpreted as approval.

Iteration 15B should introduce an explicit assertion state and enforce a public-use gate. The strict recommended policy is:

- approved assertions may generate concise rule statements and exceptions;
- researched or needs-review assertions may support editorial preview but not public conclusions; and
- missing, stale, conflicting, future-dated, or inapplicable assertions produce `Authority check required`, canonical reading links, and no inferred rule.

This preserves ADR-057: structured criteria explain official alternatives but never execute a personal eligibility decision.

## Deterministic mappings are preferable to AI here

The first release should use curated activity IDs, controlled choices, reviewed aliases, and inspectable mapping rules. FAQ and Explore searches can recognize ordinary phrases such as “Can I freelance on my work visa?” and open a preselected activity. That is retrieval, not legal inference.

Generative AI would add non-deterministic classification, difficult provenance, translation variability, and the risk of filling a missing rule with a plausible answer. It is unnecessary for this pilot. Later search improvements may suggest an activity from free text, but the user should confirm the interpretation before any cross-reference appears, and the result must still come entirely from approved mappings.

## Navigation and state recommendation

Create a dedicated `/can-i-do-this` route linked from Explore and the Residence statuses area. Keep it secondary to the homepage's `Find my starting point` journey onboarding: the two features solve different problems. Onboarding helps choose and remember a journey; the cross-reference investigates one proposed action.

FAQ and search results may link into a preselected activity while retaining the original query in browser history. Encode only non-sensitive controlled selections in the URL so Back, Forward, refresh, and optional sharing work without an account. Do not save these selections to local device or account state by default.

Journey links in results are optional handoffs and must never overwrite the user's saved journey preference.

## Authority handoffs are part of the answer

ISA's Foreign Resident General Information Centers provide multilingual general guidance about entry and residence procedures, while the agency expressly says they cannot predict permission or case outcomes.[^9] That distinction should be visible in the interface. MHLW separately provides multilingual labour consultation routes.[^10] Tax and professional questions need their own responsible authorities or qualified advisers.

The product should name the question an authority can help with—for example, “confirm which outside-activity application fits these duties”—rather than use a generic disclaimer as the only safety mechanism.

## Recommended Iteration 15B scope

1. Add assertion-level editorial state and a validator that prevents an unapproved assertion from appearing as a public rule.
2. Define typed activity, question, branch, rule-layer, coverage-state, link, and authority-handoff records.
3. Implement the four deep pilot activities: take or change work, side work or freelancing, study or training, and start or manage a business.
4. Provide direct structured handoffs for family, regulated-profession, re-entry, and tax-only questions without pretending those branches are fully interactive.
5. Add `/can-i-do-this`, responsive controlled inputs, layered results, browser-history-safe URL state, and accessible reset/change controls.
6. Connect approved FAQ and Explore phrases to preselected activities, and link from Residence statuses.
7. Keep the feature available without an account and do not persist answers.

## Approved scope decisions

The editor approved the recommended direction:

- use a dedicated route linked from Explore and Residence statuses, not the primary homepage CTA;
- deeply implement four activity families first and use clear handoffs for the other four;
- expose rule statements only from explicitly approved assertions; unapproved branches show reading links and an authority check instead;
- encode non-sensitive selections in the URL but do not persist them;
- allow FAQ and search links to preselect an activity while preserving browser history; and
- label the state of the material `Coverage status`, never eligibility confidence.

## Sources

[^1]: Immigration Services Agency of Japan, “[List of statuses of residence](https://www.moj.go.jp/isa/applications/status/qaq5.html).” Accessed September 13, 2026.
[^2]: Immigration Services Agency of Japan, “[Permission to engage in activity other than that permitted under the status of residence](https://www.moj.go.jp/isa/applications/guide/nyuukokukanri07_00045.html).” Accessed September 13, 2026.
[^3]: Ministry of Health, Labour and Welfare, “[Side jobs and concurrent employment](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000192188.html).” Accessed September 13, 2026.
[^4]: National Tax Agency, “[Final tax return](https://www.nta.go.jp/english/taxes/individual/12011.htm).” Accessed September 13, 2026.
[^5]: National Tax Agency, “[Individual income tax](https://www.nta.go.jp/english/taxes/individual/).” Accessed September 13, 2026.
[^6]: Immigration Services Agency of Japan, “[Application for permission to change status of residence](https://www.moj.go.jp/isa/applications/procedures/16-2.html).” Accessed September 13, 2026.
[^7]: Immigration Services Agency of Japan, “[Guidelines for change of status and extension of period of stay](https://www.moj.go.jp/isa/applications/resources/nyuukokukanri07_00058.html).” Accessed September 13, 2026.
[^8]: Immigration Services Agency of Japan, “[Certificate of Authorized Employment](https://www.moj.go.jp/isa/applications/procedures/syuurou_00001.html).” Accessed September 13, 2026.
[^9]: Immigration Services Agency of Japan, “[Foreign Resident General Information Center](https://www.moj.go.jp/isa/consultation/center/).” Accessed September 13, 2026.
[^10]: Ministry of Health, Labour and Welfare, “[Multilingual government inquiry and call centers](https://www.mhlw.go.jp/stf/otoiawase/index_en.html).” Accessed September 13, 2026.
