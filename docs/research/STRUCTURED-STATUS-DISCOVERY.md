# Structured Residence-Status Discovery

## Executive finding

The Phase 13 status model should be a source-backed rule map, not a larger collection of prose fields. Japan’s official status list distinguishes activity-based statuses from statuses based on personal status or position, while `Designated Activities` covers activities selected for an individual rather than one uniform eligibility rule.^1 A useful model therefore has to represent different legal shapes instead of assuming every route can be explained as “degree + job title + visa length.”

The recommended Iteration 2B pilot is a hybrid model: typed, reusable structures for durations, qualification alternatives, activity and work boundaries, institutions, transitions, and source provenance; concise reviewed prose for conditions that cannot safely be converted into executable logic. The future “Can I do this?” feature should cross-reference these reviewed facts and expose uncertainty. It should never return an eligibility verdict.

This is a discovery record, not publishable immigration guidance. Candidate fields and edge cases below still require route-by-route source review and explicit editorial approval.

## Why the current problem is not a flat requirements list

Official material exposes at least five fundamentally different rule shapes:

| Shape | Representative route | Why a flat model fails |
| --- | --- | --- |
| Activity plus alternative qualifications | Engineer / Specialist in Humanities / International Services | Actual duties matter; education, experience, international-services rules, graduate exceptions, and recognized IT examinations do not form one universal checklist.^2 |
| Japanese-license-gated activity | Legal/Accounting Services or Medical Services | An academic degree or overseas professional title cannot substitute automatically for the Japanese legal qualification required for the activity.^3 |
| Program and sector variants | Specified Skilled Worker | Category 1 and 2, designated fields, skills and language tests, family rules, support duties, and aggregate-duration rules vary.^4 |
| Compound/points route | Highly Skilled Professional | Activity subclass, points or J-Skip route, income and career facts, organization linkage, category 1/2, and permitted compound activities interact.^5 |
| Individual designation | Designated Activities | Duration and permitted activity depend on the named program and individual designation; one status-wide rule would be misleading.^6 |

Status-based routes add a sixth shape: the official catalog distinguishes statuses based on personal status or position from activity-limited routes. Their holders may be free of an immigration work restriction, but Japanese licensing, employment, contract, and tax rules are separate questions.^1

## Proposed field inventory

Iteration 2B should test the following field families. Names are conceptual; final TypeScript naming can be refined during implementation.

### Identity and legal shape

- Stable route ID, official English and Japanese names, aliases, and canonical parent status.
- `routeKind`: activity-based, status-or-position-based, or individually designated program.
- Official activity definition with source assertion, effective date, and editorial state.
- Parent/child structure for variants such as Highly Skilled Professional 1(a)/(b)/(c), Specified Skilled Worker (i)/(ii), and named Designated Activities.

### Activity and occupation fit

- Positive activity examples and reviewed occupation examples.
- Excluded or adjacent activities and links to plausible neighboring routes.
- Actual-duty notes, including primary, incidental, training, and mixed duties.
- Institution or workplace constraints, contract relationship, and designated organization where applicable.

Occupation names should improve explanation and retrieval, not become a whitelist. The official comparison of Engineer/Specialist in Humanities/International Services and Specified Skilled Worker, for example, places design, programming, and technical development on one side while placing production-line and sector work on another; the nature of the work remains more informative than the title alone.^7

### Qualification pathways

- Multiple named pathways rather than a single `requirements` array.
- Within each pathway: `allOf` conditions, `anyOf` alternatives, exceptions, and non-applicable markers.
- Condition types for education, field relevance, experience, examinations, qualifications/licenses, language, skills, remuneration, age, nationality, and relationship.
- Human-readable explanation and source link for every high-stakes condition.

Engineer/Specialist in Humanities/International Services demonstrates why alternatives are essential. Current ISA material describes a degree-level or experience route, a shorter experience rule for specified international-services work, a graduate exception for some translation/interpreting/language-instruction work, remuneration parity, and recognized IT examination/qualification exceptions.^2 The data structure must preserve those branches rather than flattening all of them into required booleans.

### Time, continuation, and transition

- Officially available periods of stay as values or individually designated ranges.
- Separate fields for route/program aggregate maximums.
- Explicit distinction among available, requested, and actually granted periods.
- Renewal/change availability, ordinary review considerations, non-renewable or program-limited cases, and transition targets.
- Effective dates and supersession for changed rules.

Extension should never be rendered as automatic. ISA states that a change or extension depends on sufficient grounds and a discretionary assessment of the activity, residence record, need to remain, and other circumstances; even satisfying listed considerations does not guarantee approval.^8

Business Manager is the strongest pilot for rule versioning. ISA identifies a revised standard effective October 16, 2025, including material changes concerning investment/capital and staffing.^9 A status record without assertion-level effective dates could silently display obsolete numbers after a reform.

### Work authorization and related law

- Work mode: unrestricted by immigration status, limited to the authorized activity, prohibited by default, or program-specific.
- Outside-activity relationship: not applicable, comprehensive permission may be available, individual permission may be required, or status change may be necessary.
- Links to separate professional-license, employer/contract, tax, and local-law guidance.

ISA distinguishes comprehensive and individual permission to engage in activity outside the current status, and notes that status-based residents such as permanent residents are not in that permission system because their immigration status does not restrict work.^10 This distinction should power explanations, not an automatic “allowed” result.

### Application context and evidence

- Context: COE/entry, change, extension, acquisition, employer/institution change, or post-grant notification.
- Stable evidence categories—identity, contract/activity, education/experience, license, remuneration, organization, finances, relationship, program, and compliance—rather than a supposedly universal checklist.
- Direct links to the current ISA checklist for the relevant context and organization category.
- A warning where nationality, consular post, organization category, or individual circumstances can change the requested evidence.

### Provenance and editorial safety

- Source ID, issuing authority, exact URL, supported claim/field, publication or revision date when available, `effectiveFrom`, optional `effectiveTo`, and last checked date.
- Assertion state: candidate, researched, editorial review, or approved.
- Plain-language uncertainty and “check this next” action.
- No use in public comparisons or “Can I do this?” cross-references until the assertion reaches the required reviewed state.

## Representative route fixtures

The pilot should use routes selected for structural coverage, not perceived popularity.

1. **Engineer / Specialist in Humanities / International Services** — alternative education and experience paths, international-services exception, IT-examination exception, remuneration, contract, actual duties, and explicit adjacent-status exclusions.
2. **Instructor** — institution-defined teaching boundary. Compare against Professor and private-company language instruction without treating all teachers as one route.
3. **Legal/Accounting Services** — Japanese-license-gated work and a hard boundary between immigration status and permission to practise.
4. **Business Manager** — conjunctive business conditions, evidence about the operating entity, a recent effective-dated reform, and startup-program transitions.
5. **Specified Skilled Worker** — category and sector variants, tests, support, family accompaniment, designated employer/field, and aggregate duration.
6. **Dependent** — relationship-based activity, no work by default, and outside-activity permission.
7. **Designated Activities** — mandatory child-program identity and designation-specific duration/work/renewal fields.
8. **Highly Skilled Professional** — subclasses, points versus J-Skip, compound activities, fixed/unlimited periods by category, and transition timing.

If keeping the first public UI intentionally small is preferable, fixtures 1–6 can be public while 7–8 remain internal model tests until their later research batches. The discovery recommendation is still to model all eight before locking the schema.

## Edge cases the pilot must prove

- One occupation label maps to different routes because the institution changes: university teaching, school teaching, and private-company language instruction.
- One route accepts different qualification pathways: relevant education, experience, or a recognized IT exception.
- A role mixes qualifying and non-qualifying duties, including onboarding or practical training.
- A contract is not necessarily a conventional employment contract; continuity and the Japanese contracting organization still matter.
- A professional is qualified abroad but not yet licensed for the reserved Japanese activity.
- A Specified Skilled Worker changes employer or field, or approaches the aggregate category-1 limit.
- A Highly Skilled Professional changes the designated organization or wants a compound activity.
- A Designated Activities holder knows only the umbrella label, not the activity written in the designation.
- A status-based resident asks an immigration work question that is actually controlled by professional licensing or employment law.
- A resident’s proposed freelance work is related to the primary activity but may still require an authority check or individual permission.
- A period of stay expires before the one-year special re-entry window ends. The official special re-entry rule uses the earlier expiry and excludes, among others, Temporary Visitor and periods of three months or less.^11
- A school is academically willing to admit someone but its program or institutional classification does not support the expected Student-status path.

## Scope boundaries for Iteration 2B

Iteration 2B should create the reusable schema, source-backed assertion shape, fixtures, validation, and a representative accessible comparison/detail presentation. It should not rewrite the entire catalog, publish unreviewed candidate requirements, or build an individualized eligibility calculator.

The dedicated re-entry article belongs to a later immigration implementation checkpoint. The status schema only needs clean links between underlying period-of-stay data and cross-cutting re-entry rules. ISA’s special re-entry guidance confirms that the travel permission and current period of stay interact but are not the same concept.^11

Likewise, detailed school selection belongs to the student/school discovery checkpoint. The model should reserve a shared institution taxonomy because current ISA Student guidance distinguishes universities, professional training colleges, Japanese-language institutions, other schools, and institution compliance classifications.^12 Admission criteria and immigration criteria must remain separate.

## Decisions requested before Iteration 2B

1. Approve the eight-fixture model test, with either all eight or only fixtures 1–6 shown publicly in the initial UI.
2. Approve typed pathway arrays with `allOf`/`anyOf` structure for faithful display, but explicitly prohibit automated eligibility verdicts.
3. Approve source-backed assertions with field-level effective dates rather than versioning only the status record as a whole.
4. Approve Designated Activities programs as child route records under the umbrella status for the pilot, leaving open a later extraction to a shared program entity if another domain needs it.
5. Approve a shared institution-category vocabulary now, with school records deferred to the student research implementation.

## Sources

1. Immigration Services Agency of Japan, “[Status of Residence List](https://www.moj.go.jp/isa/applications/status/qaq5.html).” Accessed September 11, 2026.
2. Immigration Services Agency of Japan, “[Engineer / Specialist in Humanities / International Services: Clarification Material](https://www.moj.go.jp/isa/content/001413895.pdf)” and “[Recognized Information-Processing Examinations and Qualifications](https://www.moj.go.jp/isa/laws/nyukan_hourei_h09.html).” Accessed September 11, 2026.
3. Immigration Services Agency of Japan, “[Legal/Accounting Services](https://www.moj.go.jp/isa/applications/legalaccountingservices.html)” and “[Medical Services](https://www.moj.go.jp/isa/applications/status/medicalservices).” Accessed September 11, 2026.
4. Immigration Services Agency of Japan, “[Specified Skilled Worker](https://www.moj.go.jp/isa/applications/status/specifiedskilledworker).” Accessed September 11, 2026.
5. Immigration Services Agency of Japan, “[Highly Skilled Professional Points System](https://www.moj.go.jp/isa/applications/resources/newimmiact_3_system_index.html)” and “[J-Skip](https://www.moj.go.jp/isa/applications/resources/nyuukokukanri01_00009.html).” Accessed September 11, 2026.
6. Immigration Services Agency of Japan, “[Designated Activities](https://www.moj.go.jp/isa/applications/status/designatedactivities).” Accessed September 11, 2026.
7. Immigration Services Agency of Japan, “[Comparison of Engineer / Specialist in Humanities / International Services and Specified Skilled Worker](https://www.moj.go.jp/isa/content/001452975.pdf).” January 2026.
8. Immigration Services Agency of Japan, “[Guidelines for Change of Status and Extension of Period of Stay](https://www.moj.go.jp/isa/publications/materials/nyuukokukanri07_00058.html).” Revised January 2026.
9. Immigration Services Agency of Japan, “[Revision of the Landing Criteria for Business Manager](https://www.moj.go.jp/isa/applications/resources/10_00237.html)” and “[Summary of Revised Criteria](https://www.moj.go.jp/isa/content/001448070.pdf).” Effective October 16, 2025.
10. Immigration Services Agency of Japan, “[Permission to Engage in Activity Other Than That Permitted](https://www.moj.go.jp/isa/applications/guide/nyuukokukanri07_00045.html).” Accessed September 11, 2026.
11. Immigration Services Agency of Japan, “[Special Re-entry Permission](https://www.moj.go.jp/isa/applications/guide/minashisainyukoku.html).” Accessed September 11, 2026.
12. Immigration Services Agency of Japan, “[Student](https://www.moj.go.jp/isa/applications/status/student)” and “[Considering Admission to a Japanese-Language Institution](https://www.moj.go.jp/isa/applications/resources/nyuukokukanri07_00159).” Accessed September 11, 2026.
