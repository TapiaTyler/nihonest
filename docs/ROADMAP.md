# ROADMAP.md

# Nihonest — Development Roadmap

## 1. Purpose

This roadmap preserves the intended product direction without committing to release dates.

Items may move between phases as the project is tested and understood.

The presence of a feature in this roadmap does not authorize implementation during an earlier phase.

## Ongoing Engineering Documentation Standard

Every newly created or substantially changed source file must be reviewed for the code documentation needed to make its behavior maintainable without relying on development-session context.

- add concise module-level context when a file's responsibility or relationship to the wider system is not evident from its name and exports;
- document non-obvious business rules, invariants, state transitions, lifecycle behavior, side effects, persistence formats, navigation contracts, and accessibility or safety constraints;
- use TSDoc/JSDoc for shared APIs, hooks, domain utilities, and complex types when callers need information that TypeScript alone cannot express;
- explain why a surprising implementation exists, not what plainly readable code does;
- do not add comments that merely translate syntax, narrate simple markup, or duplicate names;
- update or remove comments whenever behavior changes so documentation cannot silently become misleading;
- treat review of appropriate comments as part of completing every newly generated file, while allowing straightforward declarative data and self-explanatory presentation components to remain uncluttered.

Phase 7 should include an initial documentation audit of the existing higher-complexity areas, especially journey resolution, personalization state, browser storage and navigation safeguards, search state restoration, and content validation. Later phases must apply this standard as work is introduced rather than deferring all documentation to a cleanup pass.

---

# Phase 0 — Product Foundation

Status: Complete

Objectives:

- establish product specification;
- establish architecture;
- establish editorial standards;
- establish architectural decision log;
- initialize repository;
- establish Git workflow.

Deliverables:

- README.md
- PRODUCT.md
- ARCHITECTURE.md
- CONTENT-GUIDELINES.md
- ROADMAP.md
- DECISIONS.md

Exit condition:

Planning documentation is committed and pushed before application scaffolding begins.

---

# Phase 1 — Web Foundation

Status: Complete

Objectives:

- scaffold the Next.js application;
- establish TypeScript configuration;
- establish Tailwind;
- establish core project organization;
- establish testing;
- establish reusable layout;
- establish mobile-first navigation;
- establish basic design system direction.

Do not implement yet:

- Supabase;
- authentication;
- production database;
- email;
- translation API;
- native app.

Suggested Git checkpoint:

```text
chore: scaffold Next.js web application
```

---

# Phase 2 — Structured Content Foundation

Status: Complete

Objectives:

- establish MDX article system;
- define article schema;
- define controlled taxonomy;
- define journey stages;
- define topics;
- define audience/situation types;
- define geographic scopes;
- define importance/content types;
- define official-source entities;
- define content relationships;
- validate metadata using Zod.

Use a small number of clearly identified sample articles.

Suggested Git checkpoint:

```text
feat: add structured knowledgebase content model
```

---

# Phase 3 — Residence Status Domain

Status: Complete

Objectives:

- create first-class residence-status model;
- establish stable IDs;
- define source relationships;
- create initial sample records;
- create browsing/filtering UI where appropriate.

Do not attempt complete immigration coverage yet.

Suggested Git checkpoint:

```text
feat: add residence status domain model
```

---

# Phase 4 — Glossary

Status: Complete

Objectives:

- establish structured glossary entries;
- display Japanese, kana, romaji, and English explanations;
- connect terms to articles;
- connect articles to terms;
- add glossary browsing;
- add glossary search;
- support common romanization variants where practical.

Suggested Git checkpoint:

```text
feat: add searchable Japanese glossary
```

---

# Phase 5 — Search and Discovery

Status: Complete

Objectives:

- replace the flat Explore article listing with a group-first discovery page;
- present high-level content groups before showing their individual articles;
- add a dedicated group view that lists the articles within a selected group;
- implement article search;
- allow search on the Explore page to return individual articles across every group without requiring the user to open a group first;
- combine search with structured filtering;
- support taxonomy filters;
- integrate glossary discovery;
- provide good zero-result behavior;
- maintain a search-service boundary for future providers.

Do not add a dedicated external search vendor unless demonstrated necessary.

Suggested Git checkpoint:

```text
feat: add knowledgebase search and filters
```

---

# Pre-Phase 6 — Journey and Visa Content Expansion

Status: Complete at draft level

Objectives:

- expand the visa and residence catalog before onboarding depends on it;
- distinguish visas, statuses of residence, and named Designated Activities programs;
- organize detailed routes into purpose-based Explore groups;
- add canonical records for the complete high-level residence-status list;
- map reusable journeys for students, professional workers, founders, skilled and sector workers, family members, culture or training participants, special-purpose visitors, side workers, and established residents managing ongoing obligations;
- distinguish shared phases, explicit route choices, required steps, and clearly explained conditional steps;
- retain draft labeling until high-stakes articles receive the planned research and editorial review pass.

The detailed research, geographic expansion, and review-ready content pass remains planned for Phase 13.

Suggested Git checkpoint:

```text
content: expand draft visa catalog and mapped journeys
```

---

# Phase 6 — Anonymous Personalization

Status: Complete

Objectives:

- optional journey-stage onboarding;
- make the homepage primary CTA the entrance to that optional onboarding;
- let users select a broad stage, a guided journey, and an optional specific route within that journey;
- resolve route choices into focused phased sequences rather than displaying alternatives as consecutive steps;
- carry journey context through article URLs and provide contextual previous, next, and table-of-contents navigation;
- search journey options using visa, residence-status, program, and goal language;
- store the selected stage and optional journey/route locally;
- remember onboarding state;
- allow preference changes;
- personalize selected homepage/discovery content;
- do not require registration.

Potential later anonymous additions:

- local saved terms;
- local saved articles;
- local checklist progress.

Suggested Git checkpoint:

```text
feat: persist anonymous journey preferences
```

---

# Phase 7 — Public Web MVP Refinement

Status: Complete locally at representative-content level

Objectives:

- complete responsive UX;
- improve accessibility;
- improve SEO;
- validate production build;
- expand representative content;
- improve source visibility;
- add appropriate testing;
- audit existing non-obvious application logic against the ongoing engineering documentation standard and add durable explanatory comments where needed;
- establish a structured FAQ model whose questions use ordinary user language and point to relevant articles, content groups, journeys, glossary terms, or residence statuses without duplicating their canonical guidance;
- integrate FAQs into knowledgebase search as a distinct result type, with concise contextual links rather than full article cards where that produces a clearer answer path;
- when an Explore text query returns no results, offer a clear CTA to search the FAQ catalog; carry the entered query into the FAQ search and run it immediately when technically possible, while omitting unrelated Explore-only filters that the FAQ search cannot interpret;
- when an FAQ query returns no results, offer the reciprocal path into the complete Explore search and carry the same query so the reader does not have to re-enter it;
- keep generated FAQ candidates in draft until their wording, applicability, and linked guidance have been reviewed;
- complete local production-readiness checks without creating a continuously deployed public environment.

Suggested Git checkpoints may include:

```text
feat: improve public knowledgebase experience
```

```text
test: add critical public flow coverage
```

---

# Phase 8 — Cloud Persistence and Accounts

**Local implementation complete; hosted-provider validation remains in the post-Phase 14 integration gate.**

Develop against local or otherwise non-production infrastructure first. Do not provision the production Supabase project, production OAuth callbacks, or continuously hosted web application solely to begin this phase; final hosted integration belongs to the post-Phase 14 deployment gate.

Objectives:

- provision Supabase;
- PostgreSQL;
- Supabase Auth;
- passwordless email;
- Google authentication;
- Apple authentication where appropriate;
- persistent sessions;
- authorization/RLS;
- optional user profile;
- account deletion;
- account data export in a portable, understandable format, including the user-owned data covered by deletion and retention policies;
- anonymous-to-account migration.

Accounts must remain optional for public content.

Implemented locally:

- Supabase CLI configuration and PostgreSQL migrations for minimal profiles and journey preferences;
- passwordless email sign-in through local Mailpit, with provider-ready Google and Apple entry points kept behind explicit configuration flags;
- validated cookie-backed sessions and explicit sign-out;
- owner-only Row Level Security policies with database policy tests;
- optional display name, understandable JSON export, and confirmed account deletion;
- deterministic anonymous-to-account preference import and subsequent cross-device synchronization; and
- public routes and guidance that remain available when Supabase is absent or the user is signed out.

The hosted gate must still validate production email delivery, real OAuth origins/callbacks, cross-network synchronization, provider dashboards, key rotation, abuse controls, and production deletion/export behavior.

Suggested eventual Git checkpoints:

```text
feat: add optional account authentication
```

```text
feat: sync user preferences across devices
```

---

# Phase 9 — Saved Content and Roadmap

**Complete locally; cross-network synchronization and hosted-provider validation remain in the post-Phase 14 integration gate.**

Objectives:

- saved articles;
- saved glossary terms;
- richer glossary study and review tools built on saved terms, including review state and synchronized progress without turning Nihonest into a general language-learning platform;
- personalized roadmap;
- checklist definitions;
- user progress;
- cross-device synchronization;
- recommendation rules separated from taxonomy.
- replace the overflow-only small-screen header with an accessible fixed mobile navigation menu; once it offers equivalent access, the footer navigation may be hidden on mobile to avoid repetition;

Implement and test synchronization contracts locally during this phase. Cross-network and production-environment validation remains part of the hosted integration gate.

Delivery requirement: once Phase 9 is complete, the Account page must explain the practical benefits of an optional account, including synchronized saved content, glossary review progress, checklist progress, and the personalized roadmap. It must state equally clearly that every public article remains available without registration. A compact landing-page prompt may repeat these benefits but must not displace the primary onboarding journey or imply that registration is required.

Suggested checkpoints:

```text
feat: add synchronized saved content
```

```text
feat: add personalized journey roadmap
```

---

# Phase 10 — Reminders and Email

**Complete locally; production scheduling, SES credentials and domain verification, and hosted delivery validation remain in the post-Phase 14 integration gate.**

**Iteration 1 complete locally: reminder, notification-event, explicit-preference, and time-zone contracts are implemented. The generated database migration and RLS tests await the next deliberate local Supabase verification checkpoint.**

**Iteration 2 complete locally: signed-in users can configure optional notification topics, create custom or journey-linked reminder requests, review upcoming reminders, and cancel them. Email delivery remains disabled until the provider and scheduler iterations are complete.**

**Iteration 3 complete locally: trusted database functions atomically generate deduplicated due-reminder events, fulfill their reminder requests, and prepare one durable email-delivery decision per event using current explicit preferences. Delivery lifecycle and retry metadata are modeled, while provider calls and production scheduling remain disabled.**

**Iteration 4 complete locally: Amazon SES is selected for production delivery behind a provider-neutral boundary. Accessible transactional templates, official SES v2 client wiring, immediate consent re-checking, bounded retries, trusted claim/finalization functions, and fail-closed environment configuration are implemented. Tests use injected fakes and no messages are sent; credentials, DNS verification, production enablement, and scheduled execution remain disabled until the hosted-integration gate.**

**Iteration 5 complete locally: immutable, human-reviewed critical-update releases can target saved articles, saved residence statuses, or the user's selected journey route. Trusted generation creates one deduplicated event per relevant topic subscriber, excludes drafts and unrelated context, and carries a concise change summary plus verification note into the existing delivery pipeline. Delivery re-checks the user's current route and saved state, suppresses stale route-only events without changing explicit reminders, and explains the applicable relevance signal in the email. Route changes receive an in-app confirmation of this behavior. Database tests are generated; no scheduler or delivery service is enabled.**

Objectives:

- reminder model;
- event-based notification architecture;
- user notification preferences;
- email delivery;
- requested deadline reminders;
- targeted critical updates.

Select an email provider only at this phase.

Models, scheduling rules, preferences, and provider boundaries can be implemented locally. Actual scheduled delivery requires remotely reachable execution and provider credentials, so production delivery must remain disabled until the hosted integration gate.

Suggested checkpoint:

```text
feat: add opt-in reminder notifications
```

---

# Phase 11 — Automated Translation

**Complete locally at pilot scope.** The protected, cache-first architecture, Japanese sample artifacts, locale presentation and fallback, pilot search retrieval, reading aids, and browser pronunciation are implemented and verified without runtime translation or speech infrastructure. Phase 14 owns catalog-wide generation, interface localization, expanded multilingual indexes, language-specific retrieval quality, document-image localization, and any separately approved live-query fallback.

**Iteration 1 complete locally: provider-neutral translation artifacts, deterministic source and terminology revisions, cache identities, protected-term restoration, fail-closed provider validation, and an in-memory development cache are implemented. Two representative articles define the pilot corpus. No provider has been selected or contacted, no translation is visible in the UI, and catalog-wide generation waits until canonical English is finalized in Phase 13.**

**Iteration 2 complete locally: Codex-assisted repository generation is selected for pre-generated localization rather than runtime translation. The two pilot articles now have revision-addressed Japanese artifacts marked machine translated, backed by a versioned prompt and terminology map. Tests reject stale source, prompt, or terminology revisions. The artifacts remain outside the public UI pending locale presentation and fallback work.**

**Iteration 3 complete locally: a device-local guidance-language preference now exposes English and a clearly labeled Japanese pilot in desktop and mobile navigation. The two pilot guides render their translated title, summary, and structured body with a machine-translation notice and direct return-to-English action. Guides without a complete current Japanese artifact remain available through an explicit canonical-English fallback. Interface chrome, discovery results, search, and the rest of the catalog remain English until their planned localization work.**

**Iteration 4 complete locally: individual glossary-term pages now provide an accessible, user-initiated pronunciation control backed by browser `speechSynthesis`. It requests a Japanese voice, speaks the curated kana reading when available, exposes play, stop, replay, error, and unsupported states, never autoplays, and leaves Japanese, kana, and romaji visible regardless of audio support. Stop replaces pause because browser pause behavior is unreliable for short single-term utterances.**

**Iteration 5 complete locally: the compact language menu now includes a device-local Japanese reading-aid preference for kana, romaji, or both. The preference applies consistently to Glossary cards and pages, inline terminology disclosures, residence-status cards and pages, and saved residence statuses. Both remains the default, and an available reading is never hidden when a term only has one representation. Glossary review retains its separate session controls because those options intentionally manage quiz clues rather than general presentation.**

**Iteration 6 complete locally: Explore now builds a Japanese pilot index from the translated titles and descriptions of the two pilot guides. Japanese queries can retrieve and present those guides in Japanese, while canonical English fields remain searchable as a fallback under the Japanese preference. Article results sort through the active locale, Japanese glossary results use their kana reading as the locale-appropriate sort key, and Explore–FAQ handoffs preserve the selected locale alongside the original query. Full group, FAQ, glossary-definition, onboarding, and catalog localization remains deferred until translated artifacts exist.**

Objectives:

- use Codex-assisted offline generation for repository-cached localization, retaining the provider boundary for a future change if evidence justifies it;
- use browser `speechSynthesis` for basic glossary-word pronunciation, requesting an available `ja-JP` voice without adding a hosted speech provider;
- preserve canonical English;
- protect Japanese term structures;
- translate only the pilot corpus needed to validate the architecture; defer catalog-wide translation until Phase 14;
- expand supported content and interface languages through the protected translation architecture, prioritizing languages according to demonstrated user need and verified provider quality;
- build locale-specific search indexes from translated group titles, article titles and descriptions, article search terms, FAQ questions and summaries, FAQ aliases, glossary definitions, and onboarding discovery labels while retaining their stable canonical IDs;
- keep structured filters and content relationships language-independent while localizing their user-facing labels;
- apply language-aware query normalization, tokenization, and appropriate word-form handling rather than assuming every supported language uses English word boundaries;
- preserve protected Japanese, kana, romaji, acronyms, and official names as searchable forms across locales;
- use the selected-language index as the primary Explore, FAQ, Glossary, and onboarding search path, with canonical-English query translation only as a controlled zero-result or low-confidence fallback;
- document and test the privacy, latency, caching, quota, ambiguity, and failure behavior of query translation, and fall back without blocking access to canonical English guidance;
- preserve both locale and query when handing searches between Explore and FAQ;
- add representative cross-language retrieval tests for translated phrases, common aliases, protected Japanese terminology, and English fallback behavior;
- cache generated translations;
- display machine-translation notice;
- gracefully fall back to English;
- add an accessible pronunciation-audio control to individual glossary-term pages;
- never autoplay pronunciation, expose clear play/stop/replay state, and retain kana and romaji as the non-audio fallback;
- retain kana and romaji when browser speech synthesis or a Japanese voice is unavailable;
- add an optional reading-aid preference for showing kana, romaji, or both alongside Japanese terms across the product;
- translate semantic document-image annotations, captions, and example-field guidance while keeping the underlying reference image independent from any one interface language.
- sort translated lists by their visible labels using an `Intl.Collator` for the active locale, with locale-appropriate keys such as kana for Japanese glossary entries, canonical English fallback values, and preserved curated ordering where chronology or category priority matters more than alphabetization.

Codex-assisted generation runs as a deliberate editorial workflow and is never called by a page request. No translation credential or runtime quota is required for the initial rollout. If a future live-query fallback or automated generator is approved, its secrets, quotas, privacy, and failure behavior must be validated at the hosted integration gate.

**Iteration 4J complete locally — glossary and residence-status expansion:** twelve additional glossary artifacts raise current Japanese definition coverage from 6 to 18 of 225 terms, while eight additional residence-status artifacts raise status coverage from 4 to 12 of 30. The batch prioritizes terms and routes that recur across the now-complete localized journey catalog: entry and stay, study and outside work, temporary travel and re-entry, professional and sector work, business and high-skill activity, family residence, culture, permanent residence, and taxes. Source-revision contracts keep each machine translation tied to its canonical structured record; the existing localized cards, details, sorting, and disposable search indexes consume the additions without changing stable IDs or URLs.

**Iteration 5A complete locally — first practical article batch:** current Japanese article coverage expands from 4 to 7 of 95 guides with language and local support, utilities and home internet, and household-waste disposal. A shared article-artifact builder keeps new batches on the same terminology, prompt, generator, review-state, and provenance contract while bounded modules prevent the registry from becoming one oversized file. The translations preserve actionable distinctions, municipal and provider variation, internal links, cautions, and list structure supported by the constrained renderer. The interactive Japan geography overview is intentionally not flattened: its 47-prefecture disclosure cards and styled practical-basics panel require a component-aware localization path before the full guide can safely replace canonical English.

**Iteration 5B complete locally — emergency and disaster article batch:** current Japanese article coverage expands from 7 to 9 of 95 guides with emergency calling and disaster/evacuation preparation. The paired artifacts preserve critical callouts, 110/119 routing, location-first communication, regional interpretation limits, ambulance and cost caveats, hazard-specific evacuation, the legal and practical distinction between designated emergency evacuation sites and shelters, household accessibility planning, official-alert boundaries, and reciprocal guide links. Both remain revision-addressed machine translations requiring separate qualified review.

**Iteration 5C complete locally — initial education article batch:** current Japanese article coverage expands from 9 to 11 of 95 guides with study planning and short-term study route selection. The translations preserve the independent decisions around school admission, COE, visa, landing, residence status, permitted stay, resident registration, and work; distinguish institutional prices from government fees; and retain the source guide's exact caveats around visa exemption, common landing periods, the ten-hour study threshold, and paid activity. Detailed institution selection and admission requirements remain isolated for the next education-focused pass.

**Iteration 5D complete locally — school selection and admission:** current Japanese article coverage expands from 11 to 12 of 95 with the detailed school-selection guide. Its translation keeps each education route distinct, preserves official terminology links and the Japanese-language-institution transition date, treats common prior-education lengths as qualified examples rather than universal rules, and separates school admission from COE, visa, and landing decisions. It also retains institution-specific fees and refund rules, funding evidence, support promises, and fraud or misrepresentation warnings without turning one school's checklist into a national requirement.

**Iteration 5E complete locally — Student status and part-time work:** current Japanese article coverage expands from 12 to 14 of 95 with the paired Student COE/visa and outside-activity-permission guides. The first artifact preserves the independent decision makers, evidence roles, no-fee COE application, mission-local visa fees, 2026 language-evidence treatment, and material-change boundaries. The second preserves the separate permission requirement, no-fee application, combined weekly and long-vacation hour limits, prohibited workplaces, card-record check, study primacy, recordkeeping, and individualized treatment of internships, freelance work, online work, self-employment, performances, and research payments. Neither machine translation is presented as qualified immigration review.

**Iteration 5F complete locally — school arrival and provider responsibilities:** current Japanese article coverage expands from 14 to 16 of 95 with complementary student- and provider-facing operational guides. Arrival guidance preserves route-specific resident procedures, secure handling of sensitive identifiers, academic and support checklists, separate student and institution actions, and the boundary between school advice and each responsible authority. Provider guidance preserves truthful admission and COE workflows, role and representation limits, effective-dated language evidence, institutional transition status, arrival and work-permission checks, and the May/November reporting cycle without implying that an institutional report completes or changes the student's status.

**Iteration 5G complete locally — work-status and COE selection:** current Japanese article coverage expands from 16 to 17 of 95 with the first employment-focused artifact. The guide retains its activity-first method, contract and organization analysis, alternative education/experience/licensing paths, employer-versus-immigration language requirements, mixed-duty checks, COE-versus-change-of-status context, evidence categories, ordinary COE validity, and fee distinctions. It explicitly remains a machine-translated navigation method, not a finding that a job or applicant qualifies.

**Iteration 5H complete locally — employer acceptance and COE support:** current Japanese article coverage expands from 17 to 18 of 95 with the employer-facing workflow for accepting foreign workers. The translation preserves lawful recruitment and employment-condition disclosure, duties-to-status analysis, work-authority checks, language requirements, COE evidence and representation boundaries, government-fee distinctions, onboarding, recordkeeping, change management, and the separate employer and resident notification duties. Route-specific technical-intern, specified-skilled-worker, and employment-for-skill-development responsibilities remain distinct, and the machine translation is not represented as employer-specific legal advice.

**Iteration 5I complete locally — employment foundations:** current Japanese article coverage expands from 18 to 21 of 95 through a linked three-guide sequence covering language criteria, employment contracts, and pay and working time. The translations preserve the separation between employer preferences and legal or program rules; the measured limits of JLPT, JFT-Basic, BJT, and English tests; worker classification and document hierarchy; fixed-term and indefinite contracts; statutory working-time foundations; local minimum wages; Article 36 limits; premium rates; and annual paid leave. Each artifact remains machine translated and explicitly requires qualified review for fact-specific employment questions.

**Iteration 5J complete locally — job transition and residence applications:** current Japanese article coverage expands from 21 to 24 of 95 through resignation and dismissal guidance, organization and contract notifications, and residence-status extension or change. The cluster preserves employment-ending classifications, notice-versus-validity boundaries, closing records, the fourteen-day resident-notification rule, separate employer reporting, work-authorization checks, application timing, effective-dated fee bands, online payment charges, the limited special period, pending-travel constraints, and narrow post-employment support routes. A shared fee-section component now renders the same responsive, screen-reader-labeled table in English and Japanese from one typed dataset; base amounts, processing charges, totals, effective dates, relief, and the verified payment domain are no longer duplicated across translations. All three artifacts remain machine translated pending qualified review.

**Iteration 5K complete locally — freelance and individual tax:** current Japanese article coverage expands from 24 to 29 of 95 with five connected guides for side-work permission, freelance transactions, sole-proprietor taxation, payroll adjustment, and final income-tax returns. The translations preserve immigration-before-tax ordering, individual versus blanket outside-activity permission, client and worker-classification boundaries, statutory disclosure and payment periods, income categorization and bookkeeping, blue-return deadlines, payroll and prior-employer records, overseas-relative evidence, filing triggers, the limited ¥200,000 rule, refund returns, and departure-tax coordination. Two bounded modules keep freelance and tax-year review ownership clear. All five artifacts remain machine translated pending qualified review.

**Iteration 5L complete locally — tax residence through departure:** current Japanese article coverage expands from 29 to 34 of 95 with tax-residence, income and resident-tax, cross-border relief, consumption-tax, and departure guides. The cluster preserves factual residence classification, non-permanent-resident timing, income-source and remittance analysis, the two tax calendars and collection methods, treaty-specific forms, foreign-tax-credit limits, taxable-business and invoice-registration triggers, and separate national and local departure obligations. A shared bilingual component renders the canonical tax-residence scope comparison as the same accessible table in English and Japanese. All five artifacts remain machine translated pending qualified tax review.

**Iteration 5M complete locally — resident and worker protections:** current Japanese article coverage expands from 34 to 39 of 95 with five guides spanning address registration, public health and pension enrollment, work-linked insurance, occupational injury, and workplace safety and support. The translations preserve resident-category and fourteen-day boundaries, municipal fee and procedure variation, health cost-sharing, pension relief distinctions, separate employee insurance tests, workers' compensation routing, evidence preservation, authority jurisdiction, and the separation of workplace and immigration consequences. All five artifacts remain machine translated pending qualified review.

**Iteration 5N complete locally — settling in and road mobility:** current Japanese article coverage expands from 39 to 44 of 95 with five guides covering entry documents, housing, banking, temporary driving authority, and traffic accidents. The translations preserve the distinction between pre-travel records and documents issued at or after landing, residence-card fee cases, private housing cost categories, the address-phone-bank dependency loop, bank-specific screening and security, each recognized foreign-license route, the shorter applicable driving period and no-reset re-entry rule, and separate emergency, police, compulsory-insurance, and voluntary-insurance actions after a collision. All five artifacts remain machine translated pending qualified review.

**Iteration 5O complete locally — mobility and daily life:** current Japanese article coverage expands from 44 to 49 of 95 with five guides covering foreign-licence conversion, owning a vehicle, bicycle use, consumer contracts, and shared neighborhood spaces. The translations preserve prefectural evidence, examination, and fee control; keep parking, registration, inspection, tax, and both insurance layers distinct; retain powered-cycle classification and the April 2026 bicycle-enforcement boundary; avoid presenting cooling-off as a universal return right; and separate binding legal and contractual rules from official advice, local practice, and individual preference. All five artifacts remain machine translated pending qualified review.

**Iteration 5P complete locally — immigration lifecycle:** current Japanese article coverage expands from 49 to 54 of 95 with five guides spanning long-term entry preparation, Temporary Visitor stays, re-entry, permanent departure, and Permanent Residence. The translations keep consular, border, residence-status, and resident-registration decisions separate; preserve ordinary and special re-entry eligibility and controlling dates; coordinate the records and obligations that remain after departure; and retain Permanent Residence residence-history exceptions, public obligations, effective-dated fees, the April 2027 period rule, and separate extension duties while an application is pending. Ordinary prose values remain in the revision-addressed article artifacts, while shared bilingual components remain reserved for genuine tables, calculations, archives, or broadly reused records. All five artifacts remain machine translated pending qualified review.

**Iteration 5Q complete locally — family and personal status:** current Japanese article coverage expands from 54 to 59 of 95 with a five-guide cluster for route selection, Family Stay, the two spouse-or-child statuses, and Long-Term Resident. The translations preserve exact sponsor and relationship boundaries, outside-activity permission and combined work limits, the different child definitions, birth-versus-status procedures, spouse-change notification and safety considerations, and the distinction between limited-period Long-Term Resident and Permanent Resident. Published examples and residence-history exceptions are not presented as automatic eligibility. All five artifacts remain machine translated pending qualified review.

**Iteration 5R complete locally — teaching and related employment:** current Japanese article coverage expands from 59 to 64 of 95 with a route comparison, Professor, Instructor, Engineer/Specialist in Humanities/International Services, and multiple-employer guidance. The translations preserve institution and contract classification, direct-hire and dispatch distinctions, route-specific education and experience criteria, extensive technical and creative occupation discovery, mixed-duty analysis, and the separation of employed side work from freelance contracting. Immigration permission, workplace disclosure, combined working time, health, conflicts, insurance, and tax remain independent checks. All five artifacts remain machine translated pending qualified review.

Suggested checkpoint:

```text
feat: add Japanese localization and multilingual search pilot
```

---

# Phase 12 — Source Review and Change Monitoring

Phase 12 uses a repository-first editorial workflow. Canonical content, accepted source state, review reports, revision notes, and approval metadata remain version-controlled. Codex may prepare changes and review evidence, but the human editor explicitly decides when content becomes `verified`.

**Iteration 1 — Source registry and dependency validation**

**Complete locally:** source metadata now separates successful reachability checks from human substantive review and records the intended automated or manual check method. A deterministic reverse dependency graph connects official sources to articles, glossary terms, residence statuses, and the groups and journeys that inherit those sources through article membership. Registry diagnostics report missing, duplicate, unknown, and unused relationships together, with focused contract coverage.

- expand operational source metadata and distinguish a successful link check from substantive editorial verification;
- build reverse source mappings for articles, glossary terms, residence statuses, groups, and journeys;
- report missing, duplicate, and unused source references; and
- add focused schema and dependency tests.

**Iteration 2 — Manual source-change detection**

**Complete locally:** a deliberately scoped `sources:check` command now checks named sources or an explicit `--all` selection, with a non-writing dry-run option. It creates normalized SHA-256 observations for HTML, text, PDF, and binary sources; classifies unchanged, changed, redirected, unavailable, and manual outcomes; updates reachability dates only after successful requests; and preserves unresolved candidates separately from human-accepted revisions. Deterministic fixtures cover content normalization, classification, and failure safety without contacting live sources.

- add an explicit local source-check command;
- compare normalized candidate fingerprints with the last human-accepted source revision;
- distinguish unchanged, changed, redirected, unavailable, and manually checked sources;
- retain unresolved candidate changes rather than silently advancing the accepted baseline; and
- use deterministic fixtures for automated tests, with live checks remaining optional and deliberate.

**Iteration 3 — Impact reports and revision records**

**Complete locally:** unresolved candidate revisions can now produce validated JSON review records and readable Markdown impact reports. Reports preserve the official source identity, concise fingerprint or normalized-text evidence, deterministic risk priority, potentially affected claim categories, and direct and inherited dependencies. Resolution is fail-closed: every registered dependency must be explicitly attested as examined, validation and uncertainty must be recorded, Codex notes remain labeled advisory, and only an explicit human-approved command can accept or reject the candidate baseline.

- summarize detected differences and identify dependent content and potentially affected claims;
- prioritize review targets using source authority, content importance, subject risk, and dependency breadth;
- generate a repository-controlled review report rather than a database-backed assignment queue;
- record reviewer notes, resolution, accepted source revision, and associated content changes; and
- allow Codex-assisted summaries while labeling them advisory.

**Iteration 4 — Human approval workflow and audit**

**Complete locally:** a documented single-editor lifecycle now distinguishes draft, review, verified, and archived content. Verified articles, glossary terms, residence statuses, and FAQs require a human review date, while a repository audit additionally requires an immutable approval record for the exact current SHA-256 revision. The approval command requires explicit human attestation, substantive change and approval notes, focused validation evidence, and consistent review/update dates. Source acceptance and content verification remain separate decisions, stale approvals fail closed, and Git history remains the authoritative audit trail. Phase 12 requires no Docker, Supabase, deployment, or automated publication.

- document the single-editor workflow from draft through `needs-review` to `verified`;
- require explicit human approval before Codex changes content to `verified` or accepts a substantive source revision;
- validate revision/change notes and review dates against content metadata;
- audit source-monitoring safety, failure states, documentation, and focused tests; and
- preserve Git history as the authoritative editorial audit trail.

Do not automatically republish high-stakes information solely from machine-generated changes.

Local/manual checks can establish the workflow, but continuous scheduled monitoring requires hosted execution and is activated only at the hosted integration gate.

A multi-user CMS, contributor portal, database-backed assignments, and in-browser publication controls are not Phase 12 requirements. Their adoption requirements remain documented under Deferred / Unscheduled Ideas.

Suggested checkpoint:

```text
feat: add source review tracking
```

---

# Phase 13 — Geographic and Editorial Expansion

Objectives:

- establish municipality model;
- distinguish national vs local guidance;
- support selected municipalities;
- provide official local links;
- validate architecture before expanding coverage;
- deeply research the draft visa and residence-status catalog against current primary sources;
- expand residence-status exploration using the reviewed canonical records, clearer category and activity comparisons, and links into relevant journeys and guidance;
- implement the educational “Can I do this?” rule cross-reference over reviewed activity, status, outside-permission, professional-licensing, employment, and tax relationships, with explicit uncertainty and authority checks rather than individualized eligibility conclusions;
- document the granted period or available periods of stay for every visa and status route, clearly distinguishing a visa's entry validity from the period of stay granted at landing;
- explain renewal eligibility and practical limitations for every renewable route, including maximum periods where applicable, non-renewable or program-limited categories, timing, evidence, and circumstances that commonly require a change of status instead;
- map the broadest defensible set of applicable occupations and job titles to every work status using current official activity definitions and occupational examples—for example, explicitly covering software developers and software engineers under Engineer / Specialist in Humanities / International Services—while warning that job title alone never determines eligibility;
- add validated `searchTerms` metadata to the article schema and populate each reviewed article with legitimate everyday wording, occupation names, abbreviations, official and informal names, and useful spelling or romanization variants; index these terms in Explore without treating them as visible claims or SEO keyword stuffing;
- identify jobs or activities that sound similar but fall outside each work status, and explain when professional licensing, degree or experience requirements, employer duties, or a different status may control;
- expand route-specific requirements, evidence, exceptions, transition rules, and practical guidance;
- add focused guidance for temporary travel by residents, including ordinary and special re-entry permission, departure and return timing, passport and residence-card handling, status expiry while abroad, exclusions, and circumstances that may require a new visa or residence procedure;
- compare education routes and school types—including Japanese-language schools, universities, graduate schools, professional training colleges, exchange programs, and short courses—together with academic, language, financial, admission, institutional, and Student-status requirements;
- add organization-facing guidance for education providers and employers that explains lawful recruitment or admission, activity and status fit, organization-side evidence, authorized COE representation, onboarding, recordkeeping, and applicable post-acceptance reporting; clearly state that ISA—not the accepting organization—issues the COE and that organizational support never guarantees approval;
- distinguish work-status qualification paths such as a relevant bachelor's degree or other education, professional experience alternatives, Japanese professional licensing, remuneration, employer or contracting-organization requirements, route-specific exceptions, and supporting evidence;
- audit material government fees and other foreseeable costs across the catalog; publish nationally fixed official amounts with effective dates, charged events, payment channels, transition rules, and material exemptions while keeping municipal, consular, school, agency, and private charges explicitly variable;
- explain common employment language expectations and credentials, including JLPT levels, occupation-specific Japanese needs, business communication, English-teaching requirements, and other relevant tests or evidence; distinguish immigration criteria, regulated-profession rules, employer preferences, and demonstrated workplace ability, and do not present “native English” wording as a universal legal requirement;
- expand carefully sourced practical-law and compliance guidance, including acquiring or converting a driver's license and understanding rules for driving in Japan;
- build a practical tax curriculum covering tax residence, national income tax, resident tax, payroll withholding and year-end adjustment, final returns, side income and self-employment, tax treaties and foreign tax credits, consumption-tax and invoice-system questions, departure filings, and appointing a tax agent;
- expand integration-focused legal guidance for the situations foreign residents regularly encounter: employment rights and workplace rules, social-insurance enrollment, leases and consumer contracts, traffic and bicycle rules, family and civil registration, waste and local ordinances, disaster preparedness, and access to qualified multilingual help;
- clearly separate immigration permission, employer or contract restrictions, tax obligations, professional licensing, and local rules so that approval in one area is never presented as approval in all others;
- add sourced cultural and daily-life guidance that clearly distinguishes law, official procedure, common practice, etiquette, and individual variation, using reputable cultural and Japanese-language learning organizations where government sources are not the right fit;
- add accessible annotated examples of important documents to relevant articles and glossary entries, with structured English explanations of each section and translatable text outside the image itself;
- provide clearly fictional or safely redacted completion examples for commonly encountered forms, explain what belongs in each field, and never expose real identity-document data;
- include commonly encountered tax documents in the document-literacy work, such as withholding slips, resident-tax notices, filing and payment records, and departure-related tax forms, while distinguishing examples from individualized tax-filing advice;
- retain useful document-specific history for year-dependent or materially redesigned records: show the latest applicable version by default, allow archived versions to replace the complete in-article schematic and explanation, distinguish document lifecycle from editorial review state, and present archives as interpretation aids rather than current submission forms;
- audit every article, including content already marked ready for editorial review, so one or more relevant Japanese terms are introduced naturally in the article body rather than appearing only in the Key Japanese terminology section;
- verify that each article's linked glossary terms are actually taught in context alongside their English equivalents, removing or replacing terms that cannot be usefully integrated into the passage;
- expand the FAQ catalog from reviewed user-language questions, audit common and zero-result search wording—including occupation variants such as teacher and teaching—validate each question's applicability and answer links, and ensure high-stakes questions lead to current sourced guidance rather than unsupported generated answers;
- move articles from draft to editorial review only after their important claims and source mappings have been checked.

“Broad coverage” means systematically checking the dimensions people are likely to encounter, not promising a personalized answer for every nationality, fact pattern, local practice, or discretionary decision. Articles must surface exceptions, uncertainty, and authoritative next checks rather than claiming exhaustive eligibility conclusions.

**Iteration 1 — Catalog inventory and research contract**

**Complete locally:** a validated, version-controlled guidance coverage manifest now assigns all 58 current articles and all 29 residence statuses to bounded research batches. Required coverage tracks prevent re-entry and temporary travel, school selection and admission, work-status education and experience, activity scope, tax, employment, family, insurance, housing, mobility, civic life, culture, municipal variation, documents, and discovery from silently falling outside the phase. The manifest explicitly plans new re-entry and school-selection guides, and `editorial:coverage:audit` will fail when catalog growth is not assigned. Translation artifacts now have an explicit stale state that removes outdated Japanese text from rendering and search while preserving it for Phase 14 regeneration.

**Research-first checkpoint protocol for Iterations 2–16**

Each remaining substantive workstream is split into two separately reviewable turns:

- **Discovery checkpoint:** research potentially relevant topics, user situations, edge cases, exceptions, jurisdiction differences, and primary-source candidates; map affected existing and proposed content; state scope boundaries and unresolved questions; then save a structured proposed discovery record without rewriting the guidance.
- **Implementation checkpoint:** begin only after the discovery scope is accepted; perform source-deep research, implement the agreed content or UI changes, and run focused validation.

Discovery is exploratory and may expand or divide the implementation batch. It must not present unverified candidate topics as factual guidance. Implementation may still uncover new evidence; material additions return to a small discovery amendment rather than silently expanding scope mid-edit.

**Iteration 2A — Structured-status discovery**

- inventory the distinctions that the status schema and educational cross-reference must represent, including edge cases that do not fit a simple degree-or-job-title model; and
- propose representative route fixtures and primary-source candidates for scope approval.

**Discovery complete locally; scope approval pending:** `content/editorial/discovery/structured-status-model.json` records the proposed rule dimensions, user situations, edge cases, authority boundaries, affected content, scope limits, and unresolved decisions. `docs/research/STRUCTURED-STATUS-DISCOVERY.md` presents the source-backed recommendation: test the model against eight deliberately different route shapes, use typed qualification pathways and source assertions without producing eligibility verdicts, and keep re-entry and school-detail implementation in their later dedicated workstreams.

**Iteration 2B — Structured status schema and representative UI pilot**

- add structured periods of stay, renewal and transition notes, qualification paths, activity examples, exclusions, licensing boundaries, evidence categories, and article search terms;
- validate the model on representative academic, technical, regulated, business, family, and special-purpose routes before catalog-wide use; and
- present structured distinctions accessibly without implying an eligibility determination.

**Complete locally:** the residence-status domain now supports typed route shape, available periods, work-authorization boundaries, alternative qualification pathways, organization conditions, renewal modes, transitions, evidence categories, reviewed search aliases, and effective-dated source assertions. Eight draft fixtures exercise technical, teaching, regulated-professional, business, sector-program, dependent-family, individually designated, and highly skilled routes. Their detail pages present the distinctions as an explicitly non-determinative research pilot, and Explore indexes the pilot articles' ordinary-language occupation and route aliases. Catalog-wide population remains assigned to Iterations 3B–8B.

**Iterations 3A–8A — Immigration and residence-route discovery checkpoints**

- complete and review one discovery record for each bounded route batch before editing its guidance.

**Iteration 3A discovery and scope approval complete locally:** `content/editorial/discovery/immigration-foundations.json` and `docs/research/IMMIGRATION-FOUNDATIONS-DISCOVERY.md` map the entry-and-residence decision chain, extension/change and organization-notification boundaries, status-maintenance risks, and the missing temporary-travel path. The approved direction creates one shared re-entry guide, keeps temporary travel separate from permanent departure, and makes competing status, re-entry, and pending-application deadlines explicit.

**Iterations 3B–8B — Immigration and residence-route implementation checkpoints**

- research primary sources deeply and implement the accepted scope for immigration foundations; Student, short-stay, arrival, and re-entry guidance; professional work statuses; business and workforce programs; and family, designated, visitor, diplomatic, and official routes according to `content/editorial/guidance-coverage-plan.json`.

**Iteration 3B complete locally:** the six immigration-foundation guides now form a focused lifecycle from route and COE planning through entry, extension or change, organization changes, and permanent departure. A new shared temporary-travel guide covers special and ordinary re-entry, competing deadlines, pending applications, exclusions, lost documents, and changed return plans. Supporting glossary terms, FAQs, source records, article search language, group placement, and an optional ongoing-resident journey step connect the guidance without duplicating it across every long-term route. All researched content remains `needs-review` pending explicit human editorial approval.

**Iteration 4A discovery and scope approval complete locally:** `content/editorial/discovery/student-school-and-arrival.json` and `docs/research/STUDENT-SCHOOL-AND-ARRIVAL-DISCOVERY.md` separate school admission, Student-status/COE review, consular visa processing, and landing permission; compare school and short-program routes; map shared arrival dependencies; and define a distinct education-provider guide. The wider coverage plan now also reserves an employer-facing counterpart for Iteration 5 so neither organization is inaccurately described as issuing or guaranteeing a COE.

**Iteration 4B complete locally:** a new comparative school-selection guide and a separate education-provider guide now distinguish admission, COE issuance, visa review, and landing; cover the current Japanese-language-institution transition and effective-dated 2026 evidence change; and connect students and schools through focused journeys rather than one mixed checklist. The six student-specific guides now handle short-program route ambiguity, school and financial evidence, entry preparation, enrollment changes, outside-activity limits, and temporary travel. The shared arrival set remains cross-route; only the entry-document guide required a substantive current airport-issuance update. All affected content remains `needs-review` pending explicit human approval.

**Iteration 5A discovery and scope approval complete locally:** `content/editorial/discovery/professional-work-academic-and-technical.json` and `docs/research/PROFESSIONAL-WORK-ACADEMIC-AND-TECHNICAL-DISCOVERY.md` map Engineer/Specialist in Humanities/International Services, Instructor, Professor, Researcher, and Intra-company Transferee by actual duties, institution, qualifications, and organization rather than title alone. The approved occupation audit prominently covers English teachers across university, qualifying school, ALT, private-company/eikaiwa, and ambiguously classified settings; adds software and other common professional titles; defines the employer-facing COE and lawful-acceptance counterpart reserved in Iteration 4; and requires a concise standalone teaching-status comparison.

**Iteration 5B-1 complete locally:** a new standalone teaching-status comparison now routes English teachers by institution and actual duties across Professor, Instructor, and Engineer/Specialist in Humanities/International Services. It covers university lecturers, direct and dispatched ALTs, private eikaiwa instructors, international schools, preschools, tutoring, online teaching, multiple institutions, qualification differences, and side work without treating a title as an eligibility result. The three linked status guides now expose common job titles, periods, renewal and transition boundaries, reviewed search language, source-backed Japanese terms, and an FAQ entry. All remain `needs-review`; the remaining technical, Researcher, Intra-company Transferee, structured-status, and employer-facing work is reserved for 5B-2.

**Creative and media work discovery amendment proposed locally:** `content/editorial/discovery/creative-and-media-work-overlap.json` and `docs/research/CREATIVE-AND-MEDIA-WORK-DISCOVERY.md` map graphic design, digital product and media work, games, film and video, photography, advertising, publishing, and independent creation across Engineer/Specialist in Humanities/International Services, Artist, Entertainer, Journalist, Cultural Activities, Business Manager, and unrestricted work statuses. The proposal adds reviewed design terms to Iteration 5B-2, reserves a standalone creative-and-media status comparison plus deeper Artist, Entertainer, and Journalist coverage for Iteration 6, and explicitly prevents search titles from being presented as immigration eligibility results. Scope approval is pending.

**Creative and media work discovery amendment approved locally:** the editor approved the central comparison guide, searchable role inventory, staged Engineer/Specialist expansion, and deeper Iteration 6 treatment on September 11, 2026.

**Iteration 5B-2A complete locally:** Engineer/Specialist discovery now includes reviewed graphic, visual, brand, UI, UX, web, digital-product, multimedia, motion, game, VFX, art-direction, and advertising titles while warning that Artist, Entertainer, and Journalist may control other creative work. Researcher and Intra-company Transferee now have source-backed guides and structured status records covering common roles, qualification or prior-service pathways, organization conditions, evidence, periods, renewal, transitions, and side-work boundaries. All materially revised guidance remains `needs-review`. The employer guide, employer audience, and employer journey remain in 5B-2B.

**Iteration 5B-2B complete locally:** a new employer-facing guide and journey now cover duty-first role design, lawful recruitment and work-authority checks, understandable employment conditions, truthful COE support, authorized representation, arrival onboarding, MHLW and ISA organization-side reporting, resident/employer responsibility boundaries, and later employment changes. The `employer` Audience filter exposes the guide and the five researched academic and technical routes, while two FAQs answer common sponsorship and hiring-compliance questions. The employer does not issue or guarantee a COE, visa, landing permission, change, or extension. All new employer guidance remains `needs-review`.

**Iteration 6A discovery proposed locally:** `content/editorial/discovery/professional-work-regulated-and-creative.json` and `docs/research/PROFESSIONAL-WORK-REGULATED-AND-CREATIVE-DISCOVERY.md` map Artist, Entertainer, Journalist, Legal/Accounting Services, Medical Services, Nursing Care, Religious Activities, and Skilled Labor by actual activity, contract, organization, Japanese professional qualification, and category-specific criteria rather than English job title. The proposal carries forward the approved creative-and-media comparison, adds a focused medical-and-care route comparison, preserves Skilled Labor versus Specified Skilled Worker inside the relevant status guides unless that becomes too dense, and reserves eight source-backed rewrites plus structured status, search, FAQ, terminology, employer, and cross-link updates for Iteration 6B. Scope approval is pending.

**Iteration 6A scope approved locally:** the editor approved the regulated-and-creative scope, including the medical-and-care comparison guide and the recommendation to keep Skilled Labor versus Specified Skilled Worker inside the existing guides unless implementation demonstrates a need to split it.

**Iteration 6B-1 complete locally:** a new creative-and-media comparison routes design, art, performance, film, advertising, photography, journalism, content creation, freelance practice, unpaid study, and business operation by actual activity and relationship rather than title. Artist, Entertainer, and Journalist now document their distinct contract models, evidence, periods, renewal, transitions, and side-work boundaries; structured status records, ordinary-language search terms, three FAQs, group placement, and current ISA sources expose those distinctions throughout the application. All new or materially revised guidance remains `needs-review`.

**Iteration 6B-2A complete locally:** a new medical-and-care comparison separates Japanese-licensed medical practice, registered Certified Care Worker employment, Specified Skilled Worker nursing care, EPA Designated Activities, qualification study, the limited post-examination registration bridge, and adjacent research or specialist roles. Medical Services now names every profession in the current criteria and explains remuneration parity, foreign-license limits, the Assistant Nurse time condition, and institution requirements. Nursing Care now documents registration, the 2020 qualification-route amendment, the April 15, 2026 organization declaration, contracts, periods, renewal, and transitions. Four glossary terms, three FAQs, structured status records, search metadata, current primary sources, group placement, and coverage tracking support the guides. All new or materially revised guidance remains `needs-review`.

**Iteration 6B-2B complete locally:** Legal/Accounting Services now names all eleven qualification-gated professions in the current criteria, distinguishes Japanese-law authorization from overseas credentials, and separates reserved practice from paralegal, compliance, finance, consulting, and management work. Religious Activities now centers the foreign-religious-organization dispatch requirement, documents evidence from the worker and both organizations, and separates principal religious activity from teaching, volunteer, cultural-study, charity, and commercial work. Structured records, ordinary-language job search terms, four glossary updates, three FAQs, employer context, periods, renewal limits, transitions, and current ISA sources support both guides. All materially revised guidance remains `needs-review`.

**Iteration 6B-3 complete locally:** Skilled Labor now maps all nine special industrial-skill categories and their distinct experience, supervision, treaty, flight-history, competition, and certification pathways, including the Thai-cuisine exception and 2026 organization-document change. Specified Skilled Worker now documents the seventeen fields accepting workers as of June 1, 2026, category (i)/(ii) differences, tests and exemptions, employer and support duties, family and period rules, and employer-change procedure. Both guides directly compare overlapping restaurant, construction, aviation, care, and other settings without treating similar job titles as interchangeable. Structured status records, profession and field search aliases, three FAQs, status summaries, and current ISA sources support the guides. All materially revised guidance remains `needs-review`.

**Iteration 7A discovery and scope approval complete locally:** `content/editorial/discovery/business-and-workforce-programs.json` and `docs/research/BUSINESS-AND-WORKFORCE-PROGRAMS-DISCOVERY.md` map Business Manager after the October 2025 reform, the unified Start-up preparation program, Highly Skilled Professional through points or J-Skip, Cultural Activities, Training, Technical Intern Training, its Employment for Skill Development successor, and the already researched Specified Skilled Worker transition. The approved scope adds a standalone successor-system guide, a central training/workforce-development comparison, core successor terminology, and a distinct workforce-development journey. Implementation is divided into two passes.

**Iteration 7B-1 complete locally:** Business Manager now documents the complete combined criteria effective October 16, 2025, including qualifying business scale, staffing, Japanese capacity, applicant background, professional plan review, office, compliance, periods, renewal, and transitional treatment. Start-up is identified as the supported Designated Activities No. 44 preparation program, with local review, separate ISA decision, monitoring, maximum pathway length, and no guaranteed Business Manager transition. Highly Skilled Professional now separates the 70-point and J-Skip routes, three activity classes, remuneration thresholds, benefits, five-year and unlimited periods, category transitions, permanent residence, and organization changes. Cultural Activities and Training now distinguish unpaid cultural study and non-employment training from Student, work, and regulated workforce programs. All five guides remain `needs-review`.

**Iteration 7B-2 complete locally:** Technical Intern Training now documents its approved plans, organization models, stages, conditional five-year shape, labor protections, independent support, transfer procedure, SSW transition, and date-specific legacy handling. A new Employment for Skill Development guide and status record cover the April 1, 2027 successor, seventeen current fields, three-year development goal, Japanese and skill progression, organization duties, conditional transfers, prior Technical Intern Training time, limited examination-related continuation, and intended SSW transition. A route-comparison guide, dedicated workforce-development group and journey, core Japanese terminology, five FAQs, structured records for four routes, employer links, reviewed search language, and contextual links from comparison sections expose the distinctions without mixing development participants into the skilled-sector journey. All new and materially revised guidance remains `needs-review`.

**Iteration 8A discovery and scope approval complete locally:** `content/editorial/discovery/family-designated-and-special-routes.json` and `docs/research/FAMILY-DESIGNATED-AND-SPECIAL-ROUTES-DISCOVERY.md` map Dependent, spouse-or-child, Long-Term Resident, Permanent Resident, Designated Activities, graduate job hunting, J-Find, Digital Nomad, long-stay sightseeing, Working Holiday, Temporary Visitor, Medical Stay, Diplomat, and Official by the exact relationship, designation, purpose, or recognized assignment. The approved scope adds a standalone family-route comparison, keeps Designated Activities as a routing umbrella, keeps Medical Stay primarily in Short stay and medical visits with contextual cross-linking, and divides implementation into two passes.

**Iteration 8B-1 complete locally:** A new family and personal-status comparison now routes readers by the exact relationship or recognized position. Dependent, both spouse-or-child routes, Long-Term Resident, and Permanent Residence now document qualification boundaries, work authorization, current periods, evidence paths, renewals, relationship changes, and safe handling of separation or domestic violence. Permanent Residence includes the February 2026 guideline, its ordinary and exception routes, timely public-obligation requirement, the April 1, 2027 maximum-period change, and the need to extend an expiring current status separately. Five structured status records, the family group and journey, targeted FAQs, search language, and current official sources expose these distinctions. All new and materially revised guidance remains `needs-review`.

**Iteration 8B-2A complete locally:** Designated Activities now functions as a researched routing hub rather than a shared checklist. Continued job hunting distinguishes eligible Japanese graduates, ordinary and locally supported periods, pre-employment waiting, and outside-activity permission. J-Find documents degree, ranking, graduation-recency, funds, family, cumulative-duration, and transition boundaries. Digital Nomad covers the foreign-facing work test, 10-million-yen income, insurance, no Japanese-organization employment, six-month no-extension period, no residence card, family route, and repeat-use wait. Long-stay sightseeing covers visa-waiver nationality, age, savings above 30 million yen, insurance, spouse and child rules, no work, and the one-year ceiling. Working Holiday uses the April 1, 2026 partner list, bilateral eligibility, repeat-participation changes, prohibited work, and municipal registration. Structured guidance, journeys, FAQs, search language, two glossary terms, and current official sources support the routes. All revised guidance remains `needs-review`.

**Iteration 8B-2B complete locally:** Temporary Visitor now separates visa requirements, exemption conditions, eVISA eligibility, landing permission, admitted period, prohibited paid work, exceptional extensions, short study, and the absence of ordinary residence-card and settlement procedures. Medical Stay now distinguishes planned stays of up to ninety days, qualifying longer hospitalization through medical Designated Activities and a COE, multiple-entry validity, attendants, registered guarantors, funding, and unexpected hospitalization. Diplomat and Official now distinguish recognized assignment from passport type and private travel, document note-verbale coordination, same-household family scope, work boundaries, periods, and exclusion from the ordinary residence-card system. Three structured status records, focused journeys, five FAQs, one glossary term, expanded search language, and current ISA and MOFA sources support these routes. All materially revised guidance remains `needs-review`.

**Iterations 9A–11A / 9B–11B — Tax, law, integration, and culture discovery and implementation**

- build the tax curriculum, employment and side-work guidance, resident-law coverage, mobility and safety guidance, civic and disaster preparation, and sourced cultural and daily-life material.

**Iteration 9A discovery and scope approval complete locally:** `content/editorial/discovery/individual-tax-fundamentals.json` and `docs/research/INDIVIDUAL-TAX-FUNDAMENTALS-DISCOVERY.md` separate income-tax residence from immigration status; distinguish national income-tax and local resident-tax calendars; map salary withholding, year-end adjustment, overseas-relative evidence, prior-employer records, final returns, refund returns, and the limited ¥200,000 filing exception; and reserve treaty, foreign-tax-credit, independent-business, consumption-tax, invoice-system, and detailed departure guidance for 9B-2. The editor approved beginning the employee-and-resident fundamentals implementation on September 12, 2026.

**Iteration 9B-1 complete locally:** A four-guide tax sequence now covers tax residence and taxable scope; national income-tax and local resident-tax calendars; salary withholding, year-end adjustment, overseas-dependent evidence, prior-employer records, and the Salary Income Withholding Tax Slip; and employee final-return or refund-return decisions. It explicitly treats non-permanent resident as a tax-resident subcategory, separates tax from immigration and employment permission, explains delayed resident-tax billing and collection methods, and corrects the misconception that ¥200,000 of side income is universally tax-free. Six glossary terms, five focused FAQs, reviewed search language, group and journey placement, and current NTA and Tokyo tax sources support the curriculum. All materially revised guidance remains `needs-review`.

**Iteration 9B-2 complete locally:** Four additional guides now cover foreign-connected income, treaty analysis and foreign tax credits; the tax treatment and recordkeeping questions raised by side work and sole proprietorship; consumption-tax thresholds, elections, and qualified-invoice registration; and national and local tax procedures before departure. Ten Japanese tax terms, five search-oriented FAQs, contextual links from related immigration and departure guides, and conditional placement in the ongoing-responsibilities, side-work, and digital-nomad journeys extend the curriculum without implying that tax treatment authorizes work. Current NTA sources support the material, and all new guidance remains `needs-review` pending professional editorial review.

**Iteration 10A discovery and scope approval complete locally:** `content/editorial/discovery/employment-rights-and-independent-work.json` and `docs/research/EMPLOYMENT-RIGHTS-AND-INDEPENDENT-WORK-DISCOVERY.md` map employment classification and written terms; wages, hours, overtime, and leave; resignation, dismissal, and fixed-term endings; employment-linked insurance and work injury; workplace safety, harassment, evidence, and help; multiple employed jobs; and the statutory Freelance Act framework. The approved direction creates a Working in Japan group and employment-lifecycle journey, preserves the existing side-work guide as the immigration layer, and splits implementation into an employee-foundation pass followed by conditional coverage, problem, side-job, and freelance guidance.

**Iteration 10B-1 complete locally:** Three source-backed guides now cover the employment relationship, written working conditions, workplace rules, fixed and indefinite terms; wage records, minimum wage, hours, breaks, days off, overtime agreements and premiums, and annual paid leave; and the distinct paths for resignation, agreed separation, dismissal, fixed-term nonrenewal, and indefinite conversion. A Working in Japan group and employment-lifecycle journey separate workplace rights from residence-status selection while preserving immigration and tax handoffs. Seventeen Japanese employment terms, five focused FAQs, employer cross-links, and current MHLW sources support the sequence. All new guidance remains `needs-review`.

**Iteration 10B-2 complete locally:** Four additional guides now distinguish employee health and pension insurance, employment insurance, workers’ compensation, and municipal handoffs; provide a safety-first path through harassment, evidence, multilingual consultation, labor authorities, unions, legal help, and immigration threats; explain workplace rules, aggregate working time, health, conflicts, insurance, immigration, and tax across multiple employed jobs; and document the Freelance Act’s defined coverage, transaction terms, payment deadline, prohibited conduct, working-environment duties, and termination rules. The existing side-work guide is now the focused immigration layer and links to employment, freelance-contract, insurance, and tax guidance. Seventeen additional Japanese terms, seven FAQs, and completed Working in Japan and side-work journeys support retrieval. All new and materially revised guidance remains `needs-review`.

**Iteration 11A — Integration, mobility, and daily-life discovery**

- research driving authority and foreign-licence conversion, vehicle ownership, traffic and bicycle rules, accidents and emergency calls, disaster preparation and evacuation, household waste, consumer protection, shared-space living, cultural context, Japanese-language learning, and local support; and
- separate national law, prefectural administration, municipal rules and live instructions, private contracts, official recommendations, common practice, and individual preference before implementation.

**Iteration 11A discovery and scope approval complete locally:** `content/editorial/discovery/integration-mobility-and-daily-life.json` and `docs/research/INTEGRATION-MOBILITY-AND-DAILY-LIFE-DISCOVERY.md` map the safety-critical and locally variable decisions. The approved direction creates separate temporary-driving and licence-conversion guides; a transport, safety, and emergency pass; then a waste, consumer, neighborhood, language, and local-support pass. It treats the April 1, 2026 bicycle enforcement change and the emergency-evacuation-site versus shelter distinction as dated, explicit concepts rather than generic advice.

**Iteration 11B-1 — Mobility, emergencies, and disaster readiness**

- implement the approved driving, licence-conversion, vehicle, traffic-accident, bicycle, emergency-call, and disaster guidance; and
- add focused group, terminology, FAQ, search, and contextual-link integration without turning supporting safety topics into account-level journey preferences.

**Complete locally:** Seven current-source guides now separate temporary foreign-document driving, Japanese licence conversion, vehicle ownership, road and collision duties, bicycle rules, emergency calls, and disaster preparation. Nineteen contextual Japanese terms and seven FAQs expose ordinary search language through a Transport, safety, and emergencies group and focused cross-links. These supporting topics do not become selectable account-level journeys and cannot replace a user's relocation pathway. The guidance identifies national, prefectural, municipal, contract, insurer, and live-instruction boundaries; dates the April 1, 2026 bicycle notice system; and distinguishes a hazard-specific emergency evacuation site from a shelter. All new guidance remains `needs-review`.

**Iteration 11B-2 — Local responsibilities and community integration**

- implement the approved waste, consumer-contract, shared-space, cultural-context, Japanese-language, and local-support guidance; and
- complete daily-life group, terminology, FAQ, search, and cross-article integration without creating a competing account-level local-settlement journey.

**Complete locally:** Five current-source guides now cover setting up and closing electricity, gas, water, and home-internet services; address-specific household waste and regulated disposal; consumer contracts, limited cooling-off rights, evidence, and public help; neighborhood and shared-space communication without presenting custom as universal law; and the distinct roles of formal language schools, practical Japanese learning, interpretation, consultation, and specialist advice. Nineteen contextual Japanese terms, ten search-oriented FAQs, a Daily life and local community group, and links from housing, phone, banking, and departure guidance support discovery. No selectable journey was added, so these optional and concurrent topics cannot overwrite a user's primary relocation pathway. All new and materially revised guidance remains `needs-review`.

**Iterations 12A–13A / 12B–13B — Geographic and document discovery and implementation pilots**

- validate a small municipality model and introduce accessible, safely sourced document and form examples.

**Iteration 12A municipal discovery complete and scope approved locally:** `content/editorial/discovery/municipal-geography-pilot.json` and `docs/research/MUNICIPAL-GEOGRAPHY-PILOT-DISCOVERY.md` define Shinjuku and Nagoya as a paired pilot. The approved hierarchy distinguishes a Tokyo special ward from a designated city, while local supplements preserve one canonical national article. Six bounded surfaces test address registration, National Health Insurance, waste, resident tax, disaster information, and language or consultation support. Location remains optional context rather than a journey, and Fukuoka is outside this pilot.

**Iteration 12B paired municipal pilot implemented locally:** the application now models Tokyo Metropolis, Aichi Prefecture, Shinjuku City, and Nagoya City as distinct geographic records; adds sourced, dated, `needs-review` local supplements to the six approved canonical guides; and provides an explicit device-local location selector. Place-name search metadata reveals the supported national guides without creating local article copies or journeys. National content remains visible with no location selected, and local panels identify responsible bodies, source languages, review state, verification dates, and official handoffs.

**Iteration 13A — Document and form literacy discovery**

- inventory high-value immigration, residence, municipal, My Number, health-insurance, employment, and tax documents and forms;
- identify current official specimens, reuse constraints, versions, source formats, field meanings, accessibility needs, safe fictional completion examples, and redaction boundaries; and
- propose a bounded first annotated-document set for approval before implementing the reusable viewer in Iteration 13B.

**Iteration 13A discovery complete and scope approved locally:** `content/editorial/discovery/document-and-form-literacy.json` and `docs/research/DOCUMENT-AND-FORM-LITERACY-DISCOVERY.md` define a six-family pilot covering the 2026 residence card, paper or electronic COE context, My Number context, paired Shinjuku and Nagoya residence-change forms, the annual Salary Income Withholding Tax Slip, and a Nagoya-specific resident-tax notice. The approved viewer uses a Nihonest schematic with synthetic data plus complete semantic HTML; it records version, jurisdiction, source format, reuse basis, review state, and stale triggers. A full annotated final income-tax return is deferred from the first pilot because it is annual, multi-page, conditional, and already has detailed current NTA guidance.

**Iteration 13B — Accessible annotated-document pilot**

- implement the approved reusable document model and mobile-accessible viewer with searchable, translatable explanations outside the image; and
- default each family to its current applicable version and provide an in-article selector for useful immutable archived versions, replacing the visual, annotations, warnings, dates, sources, and lifecycle label together without requiring direct archive routes; and
- connect approved examples to their canonical articles and glossary terms without presenting fictional values as real records or filing advice.

**Iteration 13B-1 complete locally:** a validated annotated-document model now separates immutable version lifecycle from editorial state and requires one current version, valid article and glossary relationships, unique callouts, and current official sources. The accessible in-article viewer defaults the Residence Card to the design issued from June 14, 2026, retains a clearly labeled earlier design for interpretation, and presents the current paper-and-electronic Certificate of Eligibility context. Each concept map uses synthetic non-operational data, keyboard-connected callouts, complete semantic field explanations, source-language labels, verification dates, explicit non-submission warnings, an open-by-default disclosure, and collection-level quick-jump navigation that reopens a collapsed target. The Residence Card and Certificate of Eligibility glossary pages link directly to their canonical examples rather than duplicating them.

**Iteration 13B-2A complete locally:** the reusable viewer now covers the My Number Card, its protected Individual Number, separate electronic certificates, Individual Number Notice, and optional card-application context without generating realistic credentials. The My Number example also pilots an unmodified official J-LIS sample image under the agency's stated attribution-based reuse terms, with an immediate semantic citation and the separate accessible concept map retained. A second example maps common change-of-residence fields while explicitly distinguishing Shinjuku and Nagoya forms, evidence, and submission channels instead of inventing a national form. Both examples remain open by default, collapsible, quick-jump accessible, source-linked, glossary-connected, and `needs-review`. The COE example now appears in the pre-entry visa-and-status explainer rather than among documents issued at entry. The document-image standard requires an adjacent semantic caption with exact-asset attribution, edition or jurisdiction context, and modification disclosure whenever a sourced image is displayed; article-end sources alone are insufficient.

**Iteration 13B-2B-1 complete locally:** the Salary Income Withholding Tax Slip now has a national, employer-issued annotated-document family in the payroll and year-end-adjustment guide and its glossary entry. The viewer defaults to the 2026 tax-year record and preserves a complete 2025 archived explanation. Ten accessible field groups distinguish the recipient copy and omitted My Number, payer, gross payment, payroll-computed employment income, deductions, national tax withheld, family and nonresident-relative fields, insurance and housing details, remarks, and employment events without calculating tax or implying that the slip is take-home-pay evidence, resident tax, a final return, or proof that no return is required. Exact NTA annual guides support each immutable version; because the official specimen is embedded in a PDF rather than supplied as a standalone image asset, the pilot retains the fictional concept map and links the official source rather than manufacturing an image extraction. All new material remains `needs-review`.

**Iteration 13B-2B-2 complete locally:** the Nagoya resident-tax example now distinguishes the current 2026 assessment-year concepts from the city's still-published English layout reference dated June 1, 2022. The current concept map identifies the assessment year and prior income year, taxpayer and responsible office, income and deductions, taxable base, municipal and prefectural income-based amounts, credits and reductions, per-capita levies, the separately national forest environment tax, collection route, annual balance, installments, and exact-notice due dates. A complete archived version preserves only the 2022 layout concepts and warns that it predates later tax and form changes. The family is explicitly limited to Nagoya, appears in the national resident-tax guide and relevant glossary entries, links current Japanese and multilingual local sources, and does not copy the PDF image, calculate liability, reproduce payment credentials, or imply that another municipality uses the same notice. All new material remains `needs-review`.

**Iteration 13B-2B-3 complete locally:** the resident-tax example is now a general document family with a prefecture-first, municipality-second selector followed by that municipality's independent version selector. Prefectures and municipalities are alphabetized within their levels, and document variants reference the canonical geography hierarchy. Nagoya retains its current and archived records, while Shinjuku adds a current 2026 concept map covering special ward and metropolitan components, ordinary collection, salary and pension special collection, notice timing, payment schedules, and issue-specific tax contacts. The document selector and optional local context share the selected municipality, so changing either updates the other on the page. Issuer, jurisdiction, terminology, warnings, and sources change atomically with the municipality. The model prevents municipalities from being treated as versions of one another and provides a bounded structure for later municipal additions. All new material remains `needs-review`.

**Iterations 14A–16A / 14B–16B — Findability, decision support, and final discovery/audit**

- audit terminology, FAQs, search language, groups, journeys, residence-status exploration, and the educational “Can I do this?” cross-reference before completing a phase-wide source and editorial audit.

**Iteration 14A / 14B — Employment language credentials and findability**

- research and then implement a focused guide to common Japanese and English workplace expectations, JLPT and other relevant credentials, occupation and employer variation, and the boundary between hiring preferences and legal requirements; and
- integrate reviewed language-requirement search terms, FAQs, profession guides, employer guidance, and contextual links without claiming that one test level guarantees a job or residence status.

**Iteration 14A discovery complete and scope approved locally:** `content/editorial/discovery/employment-language-credentials.json` and `docs/research/EMPLOYMENT-LANGUAGE-CREDENTIALS-DISCOVERY.md` separate actual job communication, employer screening, immigration or program criteria, professional licensing, and the abilities demonstrated by a particular test. The approved implementation creates one canonical guide; defines JLPT, JFT-Basic, and BJT while keeping TOEIC contextual; covers technical, creative, office, customer-facing, teaching, skilled-sector, and regulated-profession examples; and adds concise employer-facing task-based guidance. It records current exceptions including Specified Skilled Worker tests, foreign-trained nurse recognition, Designated Activities No. 46, Highly Skilled Professional points, Business Manager capacity, Instructor evidence, and JET program differences without turning any score into a universal work requirement. The guide will belong to Working in Japan, receive Professional work cross-links, and remain optional rather than becoming a mandatory journey step.

**Iteration 14B-1 complete locally:** the canonical employment-language guide now separates workplace communication, employer screening, immigration or program rules, professional regulation, and what a credential actually measures. It defines JLPT, JFT-Basic, and BJT in the article and glossary; explains tested-skill and certificate-recency limits; preserves current Specified Skilled Worker, foreign-trained nurse, Designated Activities No. 46, Highly Skilled Professional, Business Manager, Instructor, and JET boundaries; and gives task-based examples for technical, creative, office, customer-facing, skilled, medical, and teaching work. TOEIC remains a bounded module example. All new content is `needs-review`; profession-guide links, FAQs, group placement, and broader search integration remain in Iteration 14B-2.

**Iteration 14B-2 complete locally:** the employment-language guide now leads the Working in Japan group and is contextually linked—without becoming a journey step—from the work-status chooser, teaching comparison, Instructor, Engineer/Specialist, Specified Skilled Worker, Medical Services, Business Manager, Highly Skilled Professional, Designated Activities, and employer-acceptance guidance. Focused updates distinguish employer preferences from legal criteria, add searchable profession and credential language, and expose the current JFT-Basic/JLPT SSW route, foreign-trained nurse N1 rule, Business Manager B2 boundary, HSP language points, Instructor education-through-language evidence, and Designated Activities No. 46. Five `needs-review` FAQs answer no-Japanese, developer N2, JLPT job-guarantee, native-level English, and SSW test questions through canonical links. Existing journey sequences remain unchanged.

**Iteration 15A — Educational activity cross-reference discovery**

- inventory ordinary-language “Can I do this?” situations and the immigration, employment or contract, professional-licensing, tax, social-insurance, and local-rule layers that must remain separate;
- define a non-determinative interaction and result model that surfaces relevant statuses, missing facts, exceptions, canonical guidance, coverage limits, and authority checks without calculating eligibility; and
- propose a bounded pilot, reviewed-assertion gate, privacy boundary, URL-state behavior, and search or FAQ handoffs for approval before implementation.

**Iteration 15A discovery complete and scope approved locally:** `content/editorial/discovery/educational-activity-cross-reference.json` and `docs/research/EDUCATIONAL-ACTIVITY-CROSS-REFERENCE-DISCOVERY.md` recommend a deterministic, activity-first educational lookup rather than a legal decision engine. The complete taxonomy covers work changes, side work, study, business, family, regulated professions, re-entry, and tax; the first deep implementation is limited to the first four, with structured handoffs for the rest. Results separate rule layers, explain why guidance appears, list facts still requiring confirmation, link canonical content and authorities, and describe coverage rather than personal eligibility. Non-sensitive controlled selections may use URL state, but answers are not stored. A newly identified prerequisite requires explicit assertion-level editorial approval before a structured claim can drive a public result; unapproved or incomplete branches must stop at canonical reading and an authority check.

**Iteration 15A scope approved; Iteration 15B-1 complete locally:** `/can-i-do-this` now provides four controlled guided checks for taking or changing work, side work or freelancing, study or training, and starting or managing a business, plus focused handoffs for family, regulated professions, re-entry, and tax. Non-sensitive selections survive refresh and browser navigation through URL state without device or account persistence. Results separate rule layers, facts to verify, canonical reading, and official sources; researched assertions remain hidden behind an explicit public-use gate until individually approved. Explore and Residence statuses link to the tool without replacing homepage onboarding or changing a saved journey. The homepage, tool, and footer now state that Nihonest provides general educational information rather than legal advice. Search and FAQ preselection remain for Iteration 15B-2.

**Iteration 15B-2 complete locally:** Explore and FAQ queries now receive a separate, clearly labelled activity-check suggestion when their wording matches editor-curated activity names or aliases. This retrieval does not alter ordinary result grouping and does not infer a legal answer. Selected FAQs may also declare an explicit stable activity relationship. Both entry routes preselect the relevant cross-reference and carry a validated local return path, so the tool's return link restores the originating query and filters. Activity selection, answers, reset, refresh, and browser history retain that origin without storing the user's answers.

**Search-performance refinement, pass 1 complete locally:** Explore and FAQ inputs now keep keystrokes in an isolated local component, commit a query after a short typing pause, and schedule catalog rendering as lower-priority work. Blur or Enter commits immediately. URL persistence still follows the committed query, while intermediate keystrokes no longer trigger full catalog filtering and card reconstruction. Pass 2 will pre-index normalized catalog text and relationship lookups to reduce the cost of each committed search.

**Search-performance refinement, pass 2 complete locally:** Explore now builds one locale-aware in-memory index of normalized group, article, FAQ, glossary, and translated text, together with direct article and translation maps. FAQ builds one reusable question index. Committed searches normalize only the query and reuse these prepared records; group and FAQ relationship checks resolve article IDs through maps instead of repeatedly scanning the article catalog. The index is derived, session-local data—canonical editorial records remain unchanged and no database, external provider, or persistent cache is introduced.

**Iteration 16A — Final catalog and Japan-basics audit**

- audit terminology use in article prose, FAQ and search language, content relationships, groups, journeys, residence-status discovery, activity cross-references, editorial state, and source-review readiness;
- research a standalone national-orientation guide covering physical geography, qualified region labels, prefectural and municipal government, place and jurisdiction vocabulary, climate and hazard variation, language and dialect context, and reliable official starting points; and
- propose a bounded 16B structural-and-content repair sequence without placing general orientation in a mandatory journey or creating a one-article group.

**Iteration 16A discovery complete and scope approved locally:** `content/editorial/discovery/final-catalog-and-japan-basics-audit.json` and `docs/research/FINAL-CATALOG-AND-JAPAN-BASICS-AUDIT.md` define **Understanding Japan: geography, local government, and language** as a standalone guide surfaced through a compact Explore orientation link, footer, FAQs, search aliases, and contextual links. The editor approved a collapsible 47-prefecture reference grouped under qualified common regions and a concise practical-basics box. The audit confirms 94 articles with nonempty source, search, terminology, and relationship metadata, all correctly retained at `needs-review`; a conservative static check flags 55 articles for manual review because at least one declared glossary term is not visibly linked in prose. After working around a host-level Node `uv_os_get_passwd` failure for the audit process only, `npm run editorial:audit` completed successfully across 408 content records with no blocking editorial-state inconsistencies. Proposed 16B-1 implements the orientation and structural repairs; 16B-2 handles bounded terminology/content repairs and final automated audit handoff.

**Iteration 16B-1 complete locally:** **Understanding Japan: geography, local government, and language** now provides a concise physical-geography and government mental model, an accessible collapsible 47-prefecture reference under explicitly non-authoritative common regions, careful language-variation guidance, practical time/currency/measurement/emergency basics, and current-authority handoffs. Six linked glossary records explain region, prefectures, municipalities, special wards, regional dialect, and common Japanese. Two searchable FAQs answer ordinary questions about prefectures and local dialects. Explore and the desktop footer expose the standalone guide without creating a one-guide group or inserting it into a journey, while local-support and address-registration articles provide contextual entry points. The article remains `needs-review`; focused coverage and article/FAQ catalog tests pass. Iteration 16B-2 retains the bounded inline-terminology repair and final Phase 13 audit handoff.

**Iteration 16B-2 first bounded pass complete locally:** the profession-retrieval sweep confirms that the remaining risk is ambiguous or regulated work rather than a need for thin articles for every job title. Veterinary, psychology/counseling, social-work, childcare, architecture, electrical, and laboratory searches now route into duty-based comparison guidance; the medical/care chooser explains the principal qualification and activity questions without assigning a status from a title. The research record is preserved in `content/editorial/discovery/profession-retrieval-and-terminology-closure.json` and `docs/research/PROFESSION-RETRIEVAL-AND-TERMINOLOGY-CLOSURE.md`. Twelve high-confidence single-term mismatches were repaired naturally in existing prose, reducing the conservative terminology queue from 55 to 43 articles (115 unmatched references). Focused discovery and retrieval-metadata tests pass. The next closure pass reviews that bounded remainder, then runs the coverage, editorial, and source workflows for the Phase 13 human-review handoff.

**Iteration 16B-2 second bounded pass complete locally:** seven connected arrival-and-settlement guides now teach their declared Japanese terminology in context: address registration, My Number, National Health Insurance, National Pension, housing, mobile service, and banking. The pass adds the Japanese terms where they clarify actual documents, offices, verification, accounts, or contract costs rather than inserting them solely to satisfy metadata. The conservative queue is reduced to 36 articles and 91 unmatched references. The remaining status-heavy set stays reserved for further contextual review.

**Iteration 16B-2 third bounded pass complete locally:** six student-entry and school-transition guides now introduce their declared Japanese terms in the passages that distinguish Student and Temporary Visitor routes, visa and COE records, landing permission, residence documentation, and outside-activity permission. The conservative queue is reduced to 30 articles and 70 unmatched references. The remaining queue is primarily residence-status guidance and will continue in bounded route families.

**Iteration 16B-2 fourth bounded pass complete locally:** six professional-work guides now introduce every declared Japanese term in context: Engineer/Specialist in Humanities/International Services, Instructor, Professor, Researcher, Intra-company Transferee, and Legal/Accounting Services. Status of Residence, Certificate of Eligibility, and applicable extension terminology now appear where the route, first-entry evidence, and renewal distinctions are explained. The conservative queue is reduced to 24 articles and 55 unmatched references.

**Iteration 16B-2 fifth bounded pass complete locally:** six connected Designated Activities guides now introduce their declared status, period, permission, visa, change, and residence-card terminology in context. The post-employment sequence also teaches Designated Activities and Employment Continuation Support in Japanese across the job-ending, notification, and renewal/change guides. This preserves the distinction between graduate continued job hunting, ordinary job loss, and the narrow employment-continuation route. After including the terminology newly declared for that sequence, the conservative queue is reduced to 18 articles and 41 unmatched references.

**Iteration 16B-2 sixth bounded pass complete locally:** five family and personal-status guides now introduce every declared Japanese term in context: Dependent, Long-Term Resident, Permanent Residence, Spouse or Child of Japanese National, and Spouse or Child of Permanent Resident. Status of Residence, Certificate of Eligibility, Permanent Resident, and Residence Card terminology now appears where the route, overseas-entry evidence, or continuing documentation is explained. The conservative queue is reduced to 13 articles and 31 unmatched references.

**Iteration 16B-2 seventh bounded pass complete locally:** the Training, Technical Intern Training, Employment for Skill Development, and Specified Skilled Worker guides now introduce every declared Japanese term in context. Status of Residence and Certificate of Eligibility appear in route and entry explanations, while the SSW guide teaches Technical Intern Training and Employment for Skill Development where it distinguishes the two transition paths. The conservative queue is reduced to 9 articles and 21 unmatched references.

**Iteration 16B-2 eighth bounded pass complete locally:** Business Manager, Start-up, Highly Skilled Professional, Cultural Activities, Religious Activities, and Skilled Labor now introduce every declared Japanese term in context. Status of Residence and Certificate of Eligibility appear where route scope and entry evidence are explained, while Start-up also distinguishes the consular Visa term from the COE and residence permission. The conservative queue is reduced to 3 articles and 8 unmatched references.

**Iteration 16B-2 route-field terminology supplement complete locally:** all nineteen distinct fields represented across Specified Skilled Worker and Employment for Skill Development and all nine Skilled Labor occupational categories now have glossary-backed Japanese, kana, and romaji explanations. Shared fields reuse one glossary record without implying that the two workforce routes have identical requirements. Training and Cultural Activities also link each named neighboring route directly within their comparison sections. The additions introduce every newly declared term in prose, so the remaining conservative queue stays at 3 articles and 8 unmatched references.

**Iteration 16B-2 ninth and final bounded pass complete locally:** Diplomatic and Official now introduce Status of Residence, Visa, and Landing Permission in the application sequence, while Consumption Tax and the Invoice System introduces Taxable Business and Licensed Tax Accountant where they affect registration and advice. The conservative static terminology queue is now empty: every glossary term declared by an article has a visible contextual link in that article's prose. This closes the bounded inline-terminology portion of Phase 13; broader prose quality and human editorial review remain separate requirements.

**Iteration 16B-3 official-fee and cost-disclosure discovery approved; external comparison reconciled:** `content/editorial/discovery/official-fees-and-cost-disclosure.json` and `docs/research/OFFICIAL-FEES-AND-COST-DISCLOSURE.md` identify a material gap in immigration and adjacent practical guidance. The independent external pilot corroborated the principal findings and added useful local and residence-card detail; the canonical record corrects its omitted 220-yen processing claims and its mistaken uncertainty about MOFA's no-fee rule when a visa is not issued. The implementation pass will first cover the current and October 1, 2026 immigration-fee regimes, the July 1, 2026 consular-visa revision, no-fee COE applications, re-entry permits, and employment-authorization certificates. It will then audit the remaining catalog for useful official charges while separating taxes and contributions, variable municipal charges, and private costs. Future ChatGPT web passes will default to concise topic discovery—overlooked situations, edge cases, journeys, occupations, fees, terminology, documents, and source leads—while Codex performs primary-source verification and implementation. The formal structured return contract remains optional. Amounts must be effective-dated and source-maintained; a copied price without its charged event, payment channel, transition rule, and variability boundary is not acceptable.

**Iteration 16B-3 official-fee and cost-disclosure implementation complete locally:** all 26 mapped guides now carry the applicable fee, no-fee, liability, contribution, deposit, local-charge, or private-price treatment. The high-risk immigration guidance presents the current and October 1, 2026 schedules, acceptance-date transition, granted-period tiers, online processing charges, payment channels, bounded relief, and anti-fraud warning. Visa/COE guidance separates free ISA filing, MOFA reference fees, mission-local collection, non-issuance, and external handling charges. Residence-card, municipal-record, driving, vehicle, education, tax, social-insurance, housing, utility, phone, banking, and waste guidance now uses the bounded classification and current-authority handoff appropriate to each cost.

**Iteration 16B-3 article-comparison presentation audit complete locally:** the catalog was reviewed for repeated fields that become materially easier to understand as tables. The exact immigration-fee schedule, training/workforce route overview, and broad tax-residence scope now use accessible semantic JSX tables with captions, row and column headers, and narrow-viewport overflow. Longer teaching, creative/media, medical/care, school, and notification comparisons remain headings or prose because their qualifications would create dense mobile table cells. A focused catalog test rejects unsupported Markdown pipe-table syntax in article MDX.

**Iteration 16B-4 complete locally — Final Phase 13 closure:** the bounded inline-terminology queue is empty, guidance coverage accounts for all 95 articles and 30 residence statuses, and the editorial audit validates 454 records without claiming unreviewed material is verified. Focused article, relationship, editorial, coverage, and source-registry checks pass. The source registry has no blocking errors; three useful but unattached official sources now support their relevant guides, and one generic source with no claim-level purpose has been removed. The remaining warnings expose an architectural boundary rather than missing evidence: annotated documents and municipal guidance are not yet included in the core source dependency graph. `docs/CANONICAL-CONTENT-HANDOFF.md` records the exact review-state inventory, risk-ordered human-review queue, empty accepted-source baseline, source-graph limitation, refactor constraints, and localization readiness conditions. Phase 13 implementation and automated closure are complete; human editorial approval remains explicit, revision-specific work and is not inferred from this milestone.

Do not attempt every municipality simultaneously.

Suggested checkpoint:

```text
content: research visa guidance and add municipality coverage
```

---

# Post–Phase 13 Structural Refactor Checkpoint

The behavior-preserving organization checkpoint before Phase 14 localization is complete, as recorded in the iteration notes below. It split oversized registries by domain, preserved stable IDs and public behavior, and clarified module ownership and cross-module contracts. Its completed working notes have been replaced by the next hosting and native readiness plan in [`docs/refactor.md`](refactor.md).

**Iteration 1 complete locally — inventory, contracts, and source coverage:** `docs/STRUCTURAL-REFACTOR-PLAN.md` records the size and ownership inventory, dependency rules, eight bounded iterations, validation strategy, and explicit non-goals. Annotated-document families and local-guidance supplements are now direct members of the source dependency model and retain their associated canonical articles for risk and claim analysis. This closes the nineteen false `unused-source` warnings without changing public routes or content presentation and establishes the compatibility-first contract for later registry splits.

**Iteration 2 complete locally — official-source registry:** the 286-record registry is split into seven modules for Immigration Services, foreign affairs, employment/health/welfare, tax/business/consumer policy, education/language, municipal/identity, and daily life/safety. `@/data/sources` remains the sole public compatibility entry point, source-monitoring dates are still applied after deterministic module assembly, and focused validation rejects duplicate IDs, incomplete module membership, and source-dependency defects.

**Iteration 3A complete locally — glossary registry:** all 213 glossary additions are split across the ten existing primary browse topics rather than a new organizational taxonomy. Shared constructors have one typed owner, `@/data/glossary-additions` remains compatible, and deterministic module and local array order preserve every term's ID, slug, relationship, and editorial state. FAQ and structured residence-status data remain isolated for Iterations 3B and 3C.

**Iteration 3B complete locally — FAQ registry:** all 104 FAQs are split across the six established browse groups. Group ownership now lives at each module boundary rather than in a second ID-to-group mapping, while `@/data/faqs` follows the canonical browse-group order and each module owns its local order. Focused validation preserves record count, IDs, search metadata, relationships, and rendered grouping; structured residence-status guidance remains the only unfinished Iteration 3 data split.

**Registry-order cleanup complete locally:** FAQs, glossary additions, and official sources no longer coordinate globally unique `catalogOrder` values. Public compatibility modules establish deterministic module order, local arrays establish local editorial order, and consumer-specific sorting remains independent. Across all canonical MDX articles, `termIds` now exactly follow the first appearance of inline glossary links; focused validation prevents Key Japanese terminology from drifting out of sequence or membership.

**Iteration 3C complete locally — structured residence-status guidance:** structured guidance for all 30 residence statuses is split across the eight canonical categories, including newly completed Professor and Student records that close the prior catalog gap. One shared builder retains schema validation and the evidence-check date, while the established public registry and string lookup remain compatible. Focused validation prevents missing or duplicate records, category drift, lookup divergence, and incomplete status coverage. Iteration 3 registry organization is now complete.

**Iteration 4A complete locally — discovery registry:** all 15 content groups and 20 guided journeys are separated from the public compatibility module. Shared journey-step builders, the resident settlement sequence, and the professional-route alternatives each have one owner; journeys are organized across eight durable families while the compatibility entry point explicitly preserves established presentation order. Focused validation protects registry membership, Student route filtering, and professional-route consistency. Static MDX article registration remains isolated for Iteration 4B.

**Iteration 4B complete locally — article registration:** all 95 canonical MDX articles retain explicit build-time imports while registrations are divided across six bounded subject modules. The existing `@/lib/content/articles` API, catalog order, schema parsing, cross-registry validation, static route generation, and article URLs remain unchanged. Focused repository validation now requires every file in `content/articles` to be registered exactly once and every registration family to be assembled exactly once.

**Iteration 5 complete locally — documents and local guidance:** the six annotated-document families are separated by document identity without splitting their version or jurisdiction histories. Supported geographies have one registry, and the twelve pilot local supplements are separated into six stable subjects, each retaining its Shinjuku and Nagoya pair. Existing imports and presentation order remain compatible; focused validation protects exact membership, current-version selection, municipal parentage and selectors, article and glossary relationships, official-visual rights records, and source dependencies.

**Iteration 6A complete locally — site navigation:** the site header now composes dedicated desktop navigation, mobile drawer, account controls and actions, and shared route definitions rather than owning every concern in one component. Current labels, destinations, responsive breakpoints, active states, dropdown exclusivity, account behavior, mobile transitions and scroll locking, keyboard dismissal, and focus restoration remain unchanged. Focused header and homepage accessibility coverage passes; Explore state and presentation remain isolated for Iteration 6B.

**Iteration 6B complete locally — Explore presentation:** Explore now separates validated URL and session-state synchronization, search and filter controls, grouped result rendering, and alphabetical default-group browsing from the search-index coordinator. Existing query responsiveness, filter order, search indexing, result-type grouping and jump links, locale-aware article presentation, browser-return persistence, activity suggestions, and bidirectional FAQ recovery remain compatible. Existing Explore and knowledgebase tests pass, with additional focused coverage for URL parsing, invalid-value fallback, and locale-preserving serialization.

**Iteration 7A complete locally — onboarding presentation:** onboarding retains one workflow owner for derived selections, search-driven journey and route inference, unsaved-change warnings, local preference persistence, route-change notices, and source-aware return routing. Its four visual responsibilities—journey stage, journey and focused-guide search, route narrowing, and save/privacy actions—now live in focused components without changing labels, control semantics, optional-personalization behavior, or saved data. The annotated-document viewer remains isolated for Iteration 7B.

**Iteration 7B complete locally — annotated-document presentation:** each document family retains one workflow owner for shared municipality state, current-version fallback, version and field selection, live announcements, and callout focus. Quick navigation, hierarchical selectors, lifecycle/date labels, and version-artifact rendering now have focused components. Default-open and quick-jump behavior, archived-document access, official-image citations and reuse evidence, fictional concept maps, source verification links, and two-way synchronization with local guidance remain compatible.

**Iteration 8A complete locally — static closure audit:** `npm run architecture:check` now validates the production TypeScript graph for cycles and the checkpoint's prohibited domain/data dependencies. Pure text normalization and the source-review article projection now belong to the platform-independent domain layer, with compatibility exports preserving existing callers. The gate passes across 267 production modules; TypeScript, targeted lint, and 113 catalog, editorial, source, search, journey, geography, document, and synchronization tests also pass. Iteration 8B remains the single production-build, critical-path browser, and final documentation handoff.

**Iteration 8B complete locally — structural-refactor closure:** the production build compiles, type-checks, and generates all 402 static pages. All 17 public Playwright flows pass across core navigation, Explore and FAQ handoffs, focused journeys, optional onboarding, glossary navigation, and residence-status filtering without requiring Supabase. Browser assertions now follow durable accessible roles and current catalog behavior rather than obsolete totals, labels, or no-result assumptions. The canonical handoff records the compatibility boundaries and architecture gate that Phase 14 localization must preserve. The post–Phase 13 structural checkpoint is complete.

This checkpoint does not authorize a CMS, article database, monorepo, native client, or broad UI rewrite. Run it as small reviewable moves with focused validation so localization begins from stable content and domain boundaries.

Suggested checkpoint:

```text
refactor: organize content and domain modules before localization
```

---

# Phase 14 — Localization Rollout

Objectives:

The objectives below define the complete localization direction. Phase 11 validates that direction through the Japanese pilot; objectives requiring content outside the pilot corpus or interface-wide localization are Phase 14 deliverables after canonical content stabilizes in Phase 13.

- translate the finalized canonical catalog through the protected, cache-first Phase 11 architecture;
- generate only artifacts whose canonical source and terminology revisions are current;
- review high-risk immigration, legal, tax, healthcare, and administrative translations before treating them as reviewed;
- regenerate and validate locale-specific search indexes;
- verify translated links, structured fields, filters, sorting, search handoffs, and English fallback;
- measure translation coverage and avoid presenting a partially translated locale as complete;
- localize all public-facing interface copy and structured content, not just article bodies, while keeping stable IDs and routes language-independent;
- complete multilingual accessibility, responsive-layout, and machine-translation-notice review;
- retain older artifacts only as explicitly stale data while a replacement is generated, never as silently current content.

**Iteration 1 complete locally — readiness and measurable coverage:** `docs/LOCALIZATION-ROLLOUT-PLAN.md` records the Japanese language direction, risk-ordered rollout sequence, review boundary, and explicit non-goals. A repository localization audit now compares every article artifact with the current canonical MDX, protected-terminology, and prompt revisions; it reports current machine-translated, human-reviewed, stale, missing, and incorrectly active outdated coverage without treating intentional English fallback as an error. The initial Japanese baseline is 0 of 95 current articles, 2 explicitly stale pilot artifacts, 93 missing artifacts, and no human-reviewed translations. The existing stale artifacts remain excluded from rendering and localized search.

**Iteration 2 complete locally — terminology and shared interface foundation:** Japanese protected terms now live in a scalable locale-owned registry, while a typed English/Japanese message catalog supplies desktop and mobile navigation, account controls, language options, translation and fallback notices, shared article/glossary/status actions, Saved-card actions, and Continue exploring. Selecting Japanese updates these controls and accessible labels while untranslated records continue to use explicit canonical-English fallback. Focused tests preserve navigation behavior, distinct mobile control names, shared-card prompts, Japanese notices, and the 30-status catalog total; the language remains visibly marked as a pilot.

**Iteration 3A complete locally — current representative articles:** the two Phase 11 guides have been regenerated from their complete current canonical English revisions through the expanded Japanese article prompt. The scalable Japanese article registry exposes only current active artifacts while retaining both original pilot translations as explicit stale history. Translated article Markdown now preserves and renders internal glossary links. The localization audit reports 2 of 95 current machine-translated articles, 93 missing articles, no incorrectly active outdated artifacts, two historical stale artifacts, and no human-reviewed translations; focused artifact, revision, rendering, and Japanese search tests pass.

**Iteration 3B complete locally — practical and structured samples:** `Getting a phone number in Japan` and `Understanding My Number after arrival` now provide current Japanese artifacts for a lower-risk practical guide and a higher-risk structured guide. Nested bold glossary links render as interactive links, relevant identity and My Number terminology is protected, and both artifacts remain explicitly machine translated. The localization audit reports 4 of 95 current machine-translated articles, 91 missing articles, no incorrectly active outdated artifacts, two historical stale artifacts, and no human-reviewed translations. Structured annotated-document, terminology, and source presentation remains in canonical English until the structured-record iteration.

**Iteration 4A complete locally — content groups and taxonomy:** all 15 Explore content groups now have current revision-addressed Japanese title and description artifacts. Typed Japanese presentation maps cover the existing taxonomy and residence-status category IDs without translating URLs, filter state, or relationships. Explore localizes group cards, group-page headings, filter controls, residence-status names, and relevant sorting, while its disposable search index searches localized group fields and retains canonical English fallback. Remaining FAQ, glossary-definition, residence-status detail, journey, and onboarding records stay bounded to later structured iterations.

**Iteration 4B complete locally — first FAQ batch:** eight high-value arrival and orientation FAQs now have current revision-addressed Japanese question and summary artifacts. FAQ presentation, browse-group labels, state labels, relationship kinds, locale-aware sorting, and no-result recovery use the shared Japanese interface catalog. Both FAQ and Explore search index current Japanese FAQ fields while retaining canonical English fallback; stable IDs, links, and content relationships remain unchanged. Untranslated FAQs continue to show canonical English until later bounded batches.

**Iteration 4C complete locally — glossary and residence-status foundations:** six representative glossary records and four representative residence statuses now have current revision-addressed Japanese artifacts. Localized cards and detail pages present translated definitions, explanations, purposes, activities, examples, and considerations where available, with explicit canonical-English fallback everywhere else. Glossary, Statuses, and Explore use locale-aware presentation and sorting, while their disposable search documents include current Japanese fields plus canonical English aliases without translating stable IDs, URLs, or relationships. Focused artifact, revision, component, and cross-catalog search tests pass.

**Iteration 4D complete locally — journey and onboarding foundations:** the Student and Short visit journeys provide route-aware and route-free Japanese structured samples. Current artifacts cover journey titles, descriptions, introductions, route cards, phase labels, and conditional-step notices while preserving every canonical journey, route, phase, step, and article ID. Guided-journey pages, My Journey, and onboarding use client-safe stable-ID overlays; onboarding localizes its shared controls and stages, searches Japanese journey and route fields, and preserves canonical-English query fallback. Remaining journeys and untranslated linked guides retain canonical English for later bounded batches.

**Iteration 4E complete locally — education, professional-work, and family journey expansion:** current Japanese artifacts now cover International student acceptance, Professional worker, and Joining family in Japan in addition to the two foundation samples. The batch localizes an institutional workflow, all eleven professional-work alternatives, four relationship-based family alternatives, phase labels, and applicable conditional notices without changing canonical routing, preference, or relationship data. Japanese professional and family route terms are discoverable in onboarding while English queries remain valid. Current structured journey coverage is 5 of 20 records.

**Iteration 4F complete locally — business, workforce, and designated-activity journey expansion:** current Japanese artifacts now cover Founder and highly skilled, Workforce development, Working holiday, and Digital nomad paths. Their business, high-skill, program-transition, remote-work, tax, and departure presentation fields remain revision-addressed overlays on canonical relationships. Onboarding search recognizes `高度専門職`, `育成就労`, `ワーキング・ホリデー`, and `デジタルノマド` while canonical English queries remain valid. Current structured journey coverage is 9 of 20 records.

**Iteration 4G complete locally — worker, employer, side-work, and designated-activity expansion:** current Japanese artifacts now cover Skilled and sector worker, Foreign worker acceptance, Side work while employed, J-Find future creation, and Long-stay sightseeing. Shared professional-route translations prevent wording drift across resident and employer views, while route-specific phases and conditional employment, insurance, tax, travel, extension, and departure notices remain stable-ID overlays. Japanese onboarding search recognizes `興行`, `外国人材受入れ`, `副業`, `未来創造人材`, and `長期観光`. Current structured journey coverage is 14 of 20 records.

**Iteration 4H complete locally — journey-record closure:** all 20 canonical guided journeys now have current Japanese structured artifacts. The final batch covers Culture and training, Medical stay, Diplomatic and official assignment, Permanent residence preparation, Ongoing resident responsibilities, and Employment lifecycle. Artifact tests compare the translation ID set directly with the canonical journey registry and verify source, terminology, prompt, nested route, phase, and condition revisions. Japanese onboarding search covers every closure record while retaining canonical-English fallback. Journey records are complete; linked guide translations and remaining FAQ, glossary, and residence-status records remain independent coverage tracks.

**Iteration 4I complete locally — balanced FAQ expansion:** twelve additional high-value FAQs provide two current Japanese records in every browse group, raising FAQ coverage from 8 to 20 of 104. The batch spans immigration, study, arrival and daily life, work and business, family and long-term residence, and ongoing responsibilities. Revision tests bind every translated question and summary to its canonical record; the existing localized FAQ and Explore indexes search Japanese text while retaining canonical-English fallback. Remaining FAQs stay in later risk-ordered batches.

**Iteration 4J complete locally — glossary and status expansion:** Japanese structured coverage reached 18 of 225 glossary terms and 12 of 30 residence statuses. These are separate from the completed 95-article translation track; remaining records and page chrome still require localized passes. The current coverage and next bounded work are recorded in `docs/LOCALIZATION-ROLLOUT-PLAN.md`.

**Iteration 4K complete locally — second balanced FAQ batch:** twelve more current machine-translated FAQ question/summary artifacts, two per browse group, raise Japanese FAQ coverage to 32 of 104. Their canonical relationships, IDs, and search fallback remain unchanged; qualified review and the remaining 72 questions are separate work.

**Iteration 4L complete locally — practical FAQ expansion:** twelve more machine-translated FAQs raise Japanese coverage to 44 of 104, including all five Study questions. Short visits, local services, worker protections, family eligibility, and tax records are represented; the time-sensitive 2027 permanent-residence-period item remains for a separately checked pass. Canonical relationships and English fallback remain unchanged.

**Iteration 4M complete locally — safety and resident-responsibility FAQ expansion:** twelve more machine-translated FAQs raise Japanese coverage to 56 of 104. This batch spans driving, evacuation, contract comprehension, labor and insurance, immigration status boundaries, and tax/side-work duties. The date-sensitive permanent-residence-period question remains deferred for source and wording review; untranslated FAQs still fall back to canonical English.

**Iteration 4N complete locally — regional-life and route-comparison FAQ expansion:** twelve more machine-translated FAQs raise Japanese coverage to 68 of 104. They address local-life decisions, J-Find and Working Holiday, medical and professional work routes, business-startup criteria, and tax misconceptions. The Business Manager FAQ does not hard-code an obsolete capital figure; canonical links and fallback remain unchanged.

**Iteration 4O complete locally — route, safety, and work-obligation FAQ expansion:** twelve more machine-translated FAQs raise Japanese coverage to 80 of 104. They cover Digital Nomad and Working Holiday boundaries, medical-stay attendants, vehicle insurance and bicycle enforcement, skills-based work transitions, dismissal, side-work income, and invoice registration. Date-sensitive answers retain the canonical qualifiers and await human editorial review; the separately deferred 2027 permanent-residence-period question remains untranslated.

**Iteration 4P complete locally — work-route and worker-protection FAQ expansion:** twelve more machine-translated FAQs raise Japanese coverage to 92 of 104. The batch covers status distinctions, training transition, employer-change notice, fixed-term conversion, work injury, multi-employer hours, and freelance-law duties. Canonical relationships and English fallback remain unchanged; date-sensitive and legal wording still requires human editorial review.

**Iteration 4Q complete locally — routine FAQ translation closure:** eleven more machine-translated FAQs raise Japanese coverage to 103 of 104. This batch spans bicycle and consumer rules, sightseeing restrictions, language and creative work, regulated medical care, and legal/accounting occupations. The only remaining canonical-English fallback is the 2027 permanent-residence-period question, reserved for a separate source and transitional-wording review.

**Iteration 4R complete locally — dated FAQ closure:** an official-source check of the permanent-residence guideline and transition notice clarified the final FAQ's English summary before Japanese translation. FAQ question/summary artifact coverage is now 104 of 104, with all artifacts still machine-translated and requiring human editorial review. Recheck the 2027 effective-date guidance before it takes effect; continue the separate interface, glossary, status, and regional localization work before claiming whole-site coverage.

**Iteration 4S complete locally — Glossary index interface:** the Glossary entry page and its search/filter, result-count, browse-group, and empty-state controls use typed Japanese interface messages and existing localized topic labels. Canonical term fields, URLs, saved-term behavior, and the partial 18/225 glossary-artifact coverage remain unchanged. Study/review controls and term detail pages are later bounded passes.

**Iteration 4T complete locally — saved-term review interface:** the review-panel opener, saved-glossary heading, study prompts, progress/readings controls, assessment actions, navigation, and accessible status messages now have typed Japanese interface copy. Canonical term content, saved state, storage IDs, and deep-link behavior are unchanged. The rest of Saved, glossary detail pages, and glossary-definition expansion remain separate passes.

**Iteration 4U complete locally — glossary term-page interface:** back links, speech-control feedback, topic and journey-stage context, annotated-document framing, and related-content headings have Japanese interface text. Related-guide links use current Japanese titles where available and fall back to English; term identity, URLs, and speech behavior remain canonical. Shared official-source presentation and glossary-definition expansion are separate passes.

**Iteration 4V complete locally — Certificate of Residence and official sources:** a Japanese 住民票 glossary artifact lifts term-definition coverage to 19 of 225 while preserving the resident-record versus certified-copy distinction. The shared Official sources component now localizes presentation labels and date formatting across article, term, and status pages without changing source titles, URLs, or provenance meaning. Both changes remain subject to human review; further glossary and status artifact batches are still needed.

**Planned interface and structured-content closure — before claiming Japanese coverage complete:**

- **Interface inventory and shared chrome:** audit every public route and interaction state for untranslated static text, including Home, Explore, content-group pages, articles, FAQ, Glossary, individual glossary terms, Statuses, onboarding, journeys, My Journey, Roadmap, Saved, Reminders, Account/authentication, search/filter/empty/error states, header/mobile navigation, and footer. Extend the typed message catalog in bounded page-family batches; translate visible labels, helper text, notices, calls to action, form validation, and accessible names together. Do not equate the translated shared controls from Iteration 2 with complete page localization.
- **FAQ and relationship closure:** translate the remaining FAQ questions and summaries in risk-ordered batches. Localize the FAQ page's section text and the labels of its related-guide, content-group, journey, glossary, and other answer links using the current translated target record where available, with explicit English fallback otherwise. Keep canonical relationship IDs and routes unchanged; verify localized FAQ and Explore search against both Japanese and English queries.
- **Glossary and status closure:** translate the remaining glossary definitions and individual term-page explanatory text, plus remaining residence-status records and their page chrome. Preserve Japanese headwords, kana, romaji, and pronunciation data as their own fields rather than translating them into prose; localize linked-content labels, filters, review controls, and accessible interaction text. Complete locale-aware sorting and search without changing canonical IDs.
- **Final coverage and UX pass:** separately report article, FAQ, glossary, status, journey, interface-message, annotated-document, and local-supplement coverage and revision state. Review cross-page links, untranslated fallback notices, mobile layouts, keyboard/screen-reader flows, and high-risk wording before removing the Japanese pilot label or describing the locale as complete. Partial tracks may remain available with clear English fallback, but must not be hidden by an article-only completion count.

**Planned geographic discovery and localization track — complete before the hosted integration gate:**

- **Geography A — prefecture finder:** turn the existing 47-prefecture reference into a mobile-first, searchable, selectable English/Japanese finder using stable prefecture identities. A selected prefecture should show useful national guidance and clearly identify whether researched local guidance actually exists. Keep the text/list control fully usable by keyboard and screen reader. Consider a lightweight selectable map only after its source, reuse rights, accessibility, and maintenance costs are checked; the map must not replace the list.
  - **Map implemented locally (September 2026):** a reusable SVG selector now shares the finder's 47-prefecture selection and keeps the searchable list available. Source rights, geometry generation, accessibility, and maintenance are recorded in `docs/research/JAPAN-PREFECTURE-MAP.md`.
- **Geography B — supported local guidance:** review the current Shinjuku and Nagoya source-backed supplements, then localize their interface and prose as revision-addressed Japanese artifacts tied to stable supplement IDs. Provide an explicit canonical-English fallback for missing or stale translations. Do not imply that the other prefectures or municipalities have local coverage, and never silently change a user's saved location from browsing the finder.
- **Geography C — incremental expansion:** research, implement, and translate additional local supplements in bounded location batches, with source dates and a clear national-versus-prefectural-versus-municipal scope. Add a location to the supported-local-guidance list only when its researched content is ready; pair each later local-content batch with its translation rather than postponing regional localization to a large end-of-project pass.
  - **Updated 2026-09-24:** expansion follows [LOCAL-GUIDANCE-COVERAGE-PLAN.md](LOCAL-GUIDANCE-COVERAGE-PLAN.md): the major areas of each prefecture (Tokyo's 23 special wards plus Hachioji, Tachikawa, Fuchu, and Machida; elsewhere the prefectural capital, every designated city, every other city of 300,000+ residents, and the largest city when it is not the capital), in phases G1–G3, with broader coverage deferred until after full deployment including the native app. By the user's decision, local-guidance Japanese is translated in large batches after each phase's English is stable rather than paired with every batch.

The bilingual prefecture names in the existing article are not translations of the separate local-guidance modules. Track article, finder-interface, and local-supplement coverage independently, and do not count the Japanese local experience as complete until the Shinjuku and Nagoya modules and their interface are current.

Suggested checkpoint:

```text
feat: roll out reviewed multilingual content
```

---

# Next Checkpoint — Local Editorial CMS

**Planned next after the current Phase 14 work; before the hosted integration gate.** Build a locally run editorial workspace for the existing repository. [LOCAL-CMS-REQUIREMENTS.md](LOCAL-CMS-REQUIREMENTS.md) defines its scope, safety rules, workflows, and acceptance criteria. This is a single-editor tool for preparing and reviewing Git changes, not the deferred hosted multi-user CMS.

**Foundation started locally:** `npm run cms` serves a loopback-only inventory of articles, FAQs, residence statuses, and glossary terms, with kind/status/search filters, source references, relationships, Japanese translation currency for all four kinds, catalog errors, and Git status. Article detail separates editing, linked articles, sources, and file metadata into accessible tabs. A guarded body editor saves `draft` and `needs-review` articles with a first MDX formatting toolbar, optional formatted preview below the editor, expected-revision check, and atomic file replacement. Structured editors now save selected English FAQ, residence-status, and glossary prose, show the proposed field diff, and return revised content to editorial review. All four editorial content kinds support guarded status changes and an explicit human approval action that records the exact verified revision in the existing editorial ledger. Shared TypeScript source writes check both record and file revisions. Interactive article components remain explicit preview placeholders until a full preview can use the website renderer. The CMS lives outside the production application and cannot commit or publish. A Git session records the checkout at start, refuses to write files that were already dirty, and separates CMS edits from other changes with per-file diffs; `npm run cms:check-build` checks the production output for CMS code. Next: a block-aware article editing surface, validation checks and dependency/impact views in the interface, activity log and recovery, richer structured metadata editing, and adapters for the remaining catalogs. `tools/cms/README.md` tracks each acceptance gate and current limits.

Objectives:

- make the existing English content catalogs, source records, relationships, and editorial states easier to inspect and edit without replacing their canonical files or stable IDs;
- provide field-aware editing, article formatting controls for the supported MDX block model, rendered previews, dependency and revision impact, focused validation, and a reviewable Git diff;
- preserve the distinction between draft, needs-review, verified, and archived content, and require the existing explicit human approval records for any verified revision;
- show translation currency and handoff needs without generating, reviewing, or silently changing Japanese translation artifacts;
- run only on the editor's machine, keep its working state local, and require a deliberate Git commit and existing deployment process to publish changes.

Deliverables:

- local CMS application and documented start command;
- safe file adapters for an initial, explicitly supported content set, followed by bounded expansion to the remaining catalogs;
- preview, validation, dependency review, and Git change review integrated with current repository commands;
- end-to-end checks for preserving unrelated edits, blocking stale approvals, and preventing accidental publication;
- operator instructions, recovery steps, and a demonstrated export path consisting of the canonical repository files.

Exit condition: the editor can complete a representative article and structured-record change through the CMS, inspect the exact proposed diff and affected translations, run the relevant gates, and hand the result to the existing human approval and Git workflow without data loss or hidden publication.

Suggested checkpoint:

```text
feat: add local editorial CMS for repository content
```

Remaining CMS checkpoints, in order. Each is a separate commit; follow the implementation rules in [`tools/cms/README.md`](../tools/cms/README.md#implementation-rules) and update its acceptance-status table in the same commit. Claude reviews each checkpoint against the requirements before the next begins.

1. **CMS-1 — Formatted article editor (reviewed; ready for commit).** The block-aware editing surface follows [the requirements' article editing controls](LOCAL-CMS-REQUIREMENTS.md#article-editing-controls). Five real articles round-trip through formatted → source → formatted without changing saved MDX; every editable block in the article corpus reproduces its normalized source, while unsupported or lossy constructs stay as locked, named blocks. Do not begin CMS-2 until the user confirms.
2. **CMS-2 — Checks in the interface (implemented locally; awaiting review).** Fixed, named commands only (`editorial:audit`, `localization:glossary:check`, `local-guidance -- verify`, focused `vitest` paths, `tsc --noEmit`, and `build` followed by `cms:check-build`) have an explicit start action, duration, exit status, bounded output, warning state, and cancellation. A dirty-file preflight protects generated local-guidance documents. Failed, canceled, warning, and focused-only runs cannot display as a full pass; client input cannot add arguments or commands.
3. **CMS-3 — Dependency, impact, and translation handoff views (implemented locally).** Source-to-dependent and content-to-source views reuse the repository source dependency graph, with unknown FAQ impact explicit. The plain-text handoff lists stale and missing Japanese artifacts across articles, FAQs, residence statuses, glossary terms, and (since CMS-6) municipality guidance. Tests compare a representative source with the graph and exercise the read-only views and export.
4. **CMS-4 — Activity log, recovery, and worktree sessions (implemented locally).** A metadata-only append log and recoverable unsaved drafts live under gitignored `.cms/`. Recovery is shown beside current content and loaded only by explicit action when base revisions match; stale drafts remain available for manual reconciliation. Fixture tests cover interrupted save, restart, stale canonical content, and exact-snapshot deletion. The existing Git session identifies the worktree; in-interface worktree creation remains optional and deferred.
5. **CMS-5 — Read-only and structured adapters for the remaining catalogs (implemented locally; awaiting review).** Official sources, guided journeys, article groups, and annotated document families are inspectable through read-only registry adapters. Their nested data and registry order remain intact; no CMS mutation endpoint exists for them. The README capability matrix records each catalog's actual support level, with municipality guidance reserved for CMS-6. Stop for review before CMS-6.
6. **CMS-6 — Municipality guidance (implemented locally; awaiting review).** Uses the per-location Japanese translation layout and the contract in [`tools/cms/README.md`](../tools/cms/README.md#municipality-guidance-support). The registered location/guide matrix, supplement translation state and provenance, translation handoff, and guarded English text edits are implemented. Source/recheck/geography/registration/Japanese changes, status and approval, and action count changes remain outside the CMS. Run `npm run local-guidance -- check --location <id> --links --evidence` and `verify` as explicit research gates; a CMS save does not claim those checks passed. Stop for review before CMS-7.
7. **CMS-7 — Workspace layout and navigation (implemented locally by Claude; awaiting review).** The single long page is split into hash-routed pages with a top navigation bar: Overview (what needs attention, with links to the page that resolves each item), Content, Municipality guidance, Sources & references (source impact with the reference catalogs), Translations, Checks, Changes (working tree and recovery drafts), and Activity. Records, pages, and guides have addresses (`#/content/<kind>/<id>`, `#/guidance/<id>`), so Back and bookmarks work; switching pages hides the others, so unsaved edits survive. Every record uses one header (kind, title, status, Japanese state, file path) and the same tab order: Edit, Review & approve (status and approval, moved out of file details), Linked articles, Sources, Details. Municipality guides use Edit, Sources & rechecks, Details & checks. Long lists render 200 entries at a time, the source picker lists the first 200 matches, and long Git file groups collapse. The header shows when the session started and when data was last refreshed.
8. **CMS-8 — Operational closure (implemented locally by Claude; awaiting review).** `tools/cms/README.md` documents setup, pages, records, translation state and data freshness, the security boundary, recovery, accessibility, and removal. `npm run cms:a11y` runs axe-core on every page, record kind, guide, and reference kind with every tab opened at desktop and phone widths, plus a keyboard walkthrough; it reports no violations. `npm run build` plus `npm run cms:check-build` pass, and a throwaway worktree with the CMS removed builds after a clean install and passes the type check, tests, editorial audit, and translation check. Also added: a restart notice when a data module changes outside the CMS, search results that explain non-title matches, and real-path containment for untracked files in the diff viewer. Remaining: a human screen-reader walkthrough of editing, previewing, and approving a record.
9. **CMS-9 — Create FAQs and glossary terms (implemented locally by Claude; awaiting review).** Follows [the requirements' creation rules](LOCAL-CMS-REQUIREMENTS.md#5-editing-and-file-fidelity): the editor proposes a stable ID and slug, an initial `draft` or `needs-review` status, and the required relationships; the CMS shows the exact target file and the text it will add before writing; creation never produces `verified` content. A new FAQ appends one `defineFaq` entry to its browse group's module; a new glossary term appends one direct `japaneseTermSchema.parse` entry to its primary topic's module. The proposed record passes the domain schema and the same collection validators the site uses (`validateFaqCollection`, `validateGlossaryCollection`), with IDs and slugs unique and every referenced article, group, journey, term, status, activity, and source known. Writes use the existing guarded path (dirty-file refusal, expected source revision, atomic replacement), the new record appears in the CMS without a restart, and its Japanese state is `missing` so it enters the translation handoff. **Duplicate as new** opens the form prefilled from an existing FAQ or glossary term with a new ID and no review data. Glossary terms generated by the residence-status and occupational-route builders, and residence statuses, are not created in the CMS. Fixture tests cover creation, the unchanged surrounding source, duplicate IDs, unknown references, stale revisions, and dirty-file refusal.
10. **CMS-10 — Create articles and official sources (implemented locally by Claude; awaiting review).** A new article is a create-only MDX file plus its import and registration entry in one article registry module, written together and rolled back together if either fails, so every MDX file stays registered exactly once. The form covers the article metadata the schema requires, starts from a minimal body, and warns that the article is not yet in any article group or guided journey (those stay in code). A small form adds an official source to the source registry so a new article can cite a source that does not exist yet; source monitoring and review stay in their existing workflow. Same preview, validation, guard, and test requirements as CMS-9.

**CMS-9/10 review fixes:** all canonical CMS writers share a per-file process lock, including approval transactions and rollback; creation holds one checkout-wide lock through collection validation, writes, and registration. Regression tests cover concurrent edits, duplicate IDs across modules, and article registry conflicts without orphan files. Article preview, save, and creation now compile proposed MDX and enforce the supported subset, with line/column errors and tests for inline MDX, escaped braces, and code spans. Creation routes distinguish form kinds, the accessibility audit asserts each specific creation form, and the long UI test has a 30-second timeout. Run one CMS server per checkout; the human screen-reader walkthrough remains outstanding.

---

# Post-Phase 14 — Hosted Integration and Public Deployment Gate

This is the first planned continuously hosted application environment and public web launch. It occurs only after the features that need hosted validation and the major editorial pass have already been implemented locally.

Implementation sequence: follow [the hosting and native readiness refactor roadmap](refactor.md). **Batch 1 (H1–H5)** reduces browser catalog payloads, prebuilds public detail pages while preserving query behavior, adds configuration validation and CI/release gates, adds appropriate headers and health checks, and narrows session handling after testing refresh behavior. **Batch 2 (J1–J2)** adds the notification worker and scheduled source monitoring after choosing its execution location. These checkpoints are planned and require measured builds, regression checks, and review. Suggested ownership is Claude for Batch 1 and Codex for the notification worker, with reciprocal review. Deployment and delivery activation remain separate gates.

**2026-09-28 checkpoint progress:** Claude's H3a configuration/preflight commits `9d3442b` and `86218cc`
are reviewed by Codex. Codex's J1 preparation commit `6624e27` is reviewed by Claude for its injectable runner
and fixture scope; the real database adapter, run-once command, configuration wiring, and SQL integration
acceptance remain pending. Codex owns the separate `codex/hosting-native-integration` branch and consolidated
documentation at this gate. Exact reviewed inputs, including Claude's separately reviewed LF checkout policy
and CMS test-diagnostic fix `63dd167`, are integrated there, excluding ongoing H1 work. Combined source commit
`669fa99622bf916ed5b1423cdb28fb4ee538f75d` passed verification in a fresh LF checkout: all 559 tests across
149 files, lint, TypeScript, architecture, editorial audit, mechanical article/glossary localization checks,
public/job preflights, a public-only production build (415 pages), and CMS exclusion passed. Both baseline CMS
failures are resolved on this checkout. [The refactor completion record](refactor.md#h3a--j1-preparation-gate--2026-09-28)
records exact inputs, environment, commands, skipped checks, and operating limits. The completion-record commit
changes only documentation; Claude approved that record at `6eb2fa6` and merged the exact handoff into Claude's
working branch as `8e8a9c7`. The handoff is now in both working branches, unblocking J1 configuration wiring.
H1's later committed checkpoint is under review and excluded (see the follow-up below). H3b, full J1 implementation, wider batch gates,
CRLF CMS byte preservation, staging approval, and hosted activation remain pending.

**2026-09-28 shared-file cleanup:** Codex reviewed and approved Claude's exact `07ab272` (parent `63dd167`),
which untracks 398 binary Node compile-cache files and ignores root `.tmp/`. Combined source commit
`5241670614de0b966d0abe7111d2a13fe3a78202` integrates this hash on `codex/hosting-native-integration` without
later Claude work. The isolated LF checkout passed all 559 tests across 149 files on a full rerun, lint,
TypeScript, architecture, editorial/localization checks, public/job fixture preflights, a public-only build
(415 pages), and CMS exclusion. The initial parallel run had one five-second CMS source-scan timeout;
the rerun alone passed with unchanged code/settings. No `.tmp` files remain tracked, the ignore rule works,
and the validation checkout has zero tracked CRLF/mixed files. [The cleanup completion record](refactor.md#compile-cache-cleanup-integration--2026-09-28)
records the environment, commands, and limits. The following documentation-only commit was approved by Claude
at `85935ac`; Claude merged the exact handoff as `f9dee65`. No hosted activation
or main merge occurred.

**2026-09-28 J1 follow-up / H1 review:** Claude approved Codex's runner-hardening checkpoint `7c272d2`
against `85935ac`; the integration branch fast-forwarded to that exact tested source commit. It stops on clock
failure and adds relevant critical-send and withdrawn reminder-topic fixtures. Its full suite passed 567 tests
across 149 files with four workers; focused tests, targeted lint, TypeScript, and architecture passed.
[The hardening record](checkpoints/J1-runner-hardening.md) preserves the default-worker CMS timeout and rerun,
and the remaining real adapter/command/config/SQL acceptance work. H1 `119b872` passed independent full tests
(563 / 150 files), static/build/localization gates, and current JS catalog checks, but Codex requested a P2
production-checker fix: async chunks bypass catalog detection. H1 remains unintegrated; Claude is working on H2.
[The H1 review](checkpoints/H1-review.md) records evidence and interface changes for later N2/N3 handoff.
Claude approved the consolidated documentation at `861ee5f` and merged the exact handoff as `397eb87`.
Production activation none; no main merge.

**2026-09-28 H1 rereview / J1 adapter preparation:** H1 checker fix `efc2837` resolves async inventory
coverage and passes seven new fixtures, but its extracted marker regex excludes ordinary `n` instead of
newline. Canonical guidance markers drop from 640 to 113; a real Sapporo summary bypasses the check.
Codex requested a bounded correction and character/coverage regression tests; H1 remains unintegrated.
Codex separately implemented adapter mapping/transport checkpoint `9dee0a0` on the working branch:
48 focused tests and the full 587-test/151-file suite with four workers, lint, TypeScript, and architecture
passed. That code is unreviewed/unintegrated and has no live command consumer. Database clock authority,
exhausted-claim inspection, command/provider wiring, and isolated SQL acceptance remain pending.
[The refactor record](refactor.md#h1-checker-rereview-and-j1-adapter-preparation--2026-09-28) distinguishes
both pending checkpoints from the reviewed integration source. The new documentation awaits review.
H2 and the separate Claude-owned CMS stability follow-up continue. Production activation none; no main merge.

**2026-09-28 H2 review / CMS stability integration:** Codex approved H2 scope at exact `581ed1e`;
independent checks at `68aa4e8` passed 585 tests / 152 files with four workers, lint, TypeScript,
architecture (689 modules), editorial/article checks, public-only 415-page SSG build, CMS exclusion and
seven production browser tests. A separate probe verified a non-default saved municipality survives
a different linked municipality. H2 integration waits for H1's unresolved marker-regex correction;
approval does not include that ancestor. The existing 14 browser failures and reported baseline payload
measurements were not independently repeated. Claude owns a separate bounded stale-test repair.

CMS stability `68aa4e8` is reviewed/approved and cherry-picked independently as combined source
`2a35d9aa7352834f9219243837324d9d9ab7f856` on `codex/hosting-native-integration`, excluding
H1/H2 and the unreviewed adapter. Its Git index-refresh negative control fails without the fix.
Combined gates passed **568 tests / 149 files at default concurrency**, lint, TypeScript, architecture
(679 modules), public-only build (415 pages), CMS exclusion and whitespace checks in an isolated LF
checkout with copied dependencies. The earlier review run alongside the H2 build had a worker-pool
error; it was not counted as passed. Artificial CPU-saturation stalls remain unresolved.
[The review record](checkpoints/H2-CMS-review.md) and
[completion record](refactor.md#h2-review-and-independent-cms-stability-integration--2026-09-28)
separate branch review from combined validation. This documentation delta and prior `b494ed0` await
Claude's review; `9dee0a0` adapter review is also pending. H4 is Claude's next checkpoint. No hosted
activation, provider delivery or main merge.

**2026-09-28 H1/H2/adapter combined handoff:** Codex approved marker correction `1d46b0d` after
ten fixtures and an independent 784-summary probe (640 markers restored; original 144-summary omission
documented). H1 merged as `53baa86` and passed its combined 582-test/151-file gate and emitted-artifact
negative controls. Reviewed H2 `581ed1e` then merged as `d0f9028`. Claude approved adapter `9dee0a0`
for mapping/transport scope and documentation `b494ed0`, merging the latter as `88b4d3e`.

**Validated combined source:** `4f41ec57e092ba78deb6b153e418ec0efe760295` on
`codex/hosting-native-integration`, including H1/H2, the already-reviewed CMS stability patch and the
scope-approved adapter. Full Vitest passed **608 tests / 154 files with four workers**; lint, types,
architecture (691 modules), editorial/article/glossary checks, public/job fixture preflights, public-only
415-page build (SSG detail families), CMS exclusion, bundle checking with four restored artifact-injection
controls, and seven production H2 browser tests passed. Dependencies were copied, not clean-installed.
[The completion record](refactor.md#h1-h2-and-j1-adapter-integration--2026-09-28) records exact inputs,
environment and limitations. H1/H2 are integrated; H4/H5/H3b have not started and remain Claude-owned.

J1 still has no runnable command: mixed clock authority must be resolved before shipping; exhausted/expired
fifth claims, recipient suppression/confirmation policy, exhaustive critical-event mapping, command/provider
wiring, real SQL acceptance and operating docs remain pending. Claude's absence plan permits Codex-owned
J1 and Stage-A N4 work; new checkpoints wait for Claude's review. Shared browser-test repairs and other
Claude-owned files require an explicit temporary user-approved handoff. J2 still awaits the execution-location
decision. Documentation at `e374bbe` and this consolidation await Claude's review after reset. No main merge,
hosted activation, schedule or real email.

**2026-09-29 J1 database-authority preparation:** Claude reports merging exact handoff `e4fc1ff` as
`93e44b4`; consolidated documentation review remains deferred until reset. Codex's new working-branch
[checkpoint](checkpoints/J1-database-authority.md) implements service-only database time/finalization and
aggregate exhausted-failure/expired fifth-claim inspection. Finalization reads advancing database time
after the token-bound row lock, computes backoff there and accepts no caller timestamp. The runner removes
its worker wall-clock input, conservatively accounts for response age and preserves the clock-failure latch.
No new command or provider consumer exists.

61 focused tests, full **621 tests / 154 files**, types, targeted lint, architecture (691 modules) and
whitespace passed. The actual migrations passed 26 temporary embedded PostgreSQL 18.3/PGlite SQL assertions
with fixture Auth roles. PostgreSQL 17/Supabase, multi-connection/lock-wait acceptance and the new 24-assertion
pgTAP fixture remain unrun because Docker is unavailable. No repository dependency/configuration changes;
no service was started/reset. Review/integration are pending Claude; reviewed integration stays at `e4fc1ff`.
Recipient policy, exhaustive event mapping, command/provider budgets, real SQL acceptance and operator docs
remain J1 work. No main merge, hosted activation, schedule, real email or translation edit.

**2026-09-29 J1 recipient-policy preparation:** the preceding database-authority checkpoint is pushed as
`6aa8f1c`, awaiting review. The next [checkpoint](checkpoints/J1-recipient-policy.md) requires a valid current
Auth email with email-specific confirmation. Missing, malformed or unconfirmed addresses are terminally
suppressed, without provider use or further attempts; later confirmation does not revive old suppressed
deliveries. Auth lookup/ownership failures remain retryable. The runner checks event identity and lease even
for suppression; critical target mapping is exhaustive. General/phone confirmation, pending email and payload
addresses do not authorize delivery. No command/app consumer is added.

84 focused tests, full **644 tests / 155 files**, TypeScript, targeted lint, architecture (**692 modules**)
and whitespace passed with fixture services and existing dependencies. SQL/build/browser/editorial gates
were not repeated for this source-only checkpoint. Claude's review of both J1 checkpoints and consolidated
docs remains pending after reset; integration stays at `e4fc1ff`. Command/config wiring, provider/whole-lease
budgets, real SQL concurrency/pgTAP acceptance and operator docs remain open. No main merge or activation.

**2026-09-29 J1 provider and claim-lease budget preparation:** following pending recipient-policy `904856e`,
Codex's [bounded checkpoint](checkpoints/J1-lease-io-budget.md) adds cancellable store/provider deadlines,
a monotonic budget beginning before each claim, database-expiry shortening and reserved time before sends
and finalization. Insufficient time leaves the claim for recovery. Explicit SES configuration uses one SDK
attempt, a bounded request, abort propagation and resource disposal for the future command. Provider
timeouts can still mean uncertain acceptance and later duplicate sends; SQL owns final expiry.

86 focused tests, full **656 tests / 157 files**, TypeScript, targeted lint, architecture (**693 modules**)
and whitespace passed with fixture services. No SQL/build/browser/editorial check was repeated. This and
the preceding J1 checkpoints plus consolidated documentation await Claude; integration remains `e4fc1ff`.
Standalone command/H3a wiring, real PostgreSQL 17 SQL concurrency/pgTAP acceptance and operator docs remain.
No main merge, schedule, activation or real email.

**2026-09-29 J1 standalone command preparation:** after pushed lease-budget `4b4bb37`, Codex added a
[one-pass Node command](checkpoints/J1-command.md) using H3a's production job validation, scoped
`server-only` loading, matched 10-second runner/SES deadlines, provider disposal and aggregate-only JSON.
Email-disabled passes still generate and prepare database work but do not claim or contact a provider.
Exactly one package script line is added; no scheduler or web endpoint exists. The
[operating record](NOTIFICATION-WORKER-OPERATIONS.md) covers configuration, monitoring, costs, concurrency,
uncertain sends and rollback without authorizing activation.

Four command fixture tests, full **660 tests / 158 files**, TypeScript, targeted lint, architecture
(**694 modules**), whitespace and `npm run notification:once -- --help` passed. SQL/build/browser/editorial
gates were not repeated. This and three preceding J1 checkpoints plus docs await Claude; reviewed
integration remains `e4fc1ff`. Real PostgreSQL 17 concurrency/lock-wait/pgTAP and combined acceptance
are open. No main merge, hosted service, schedule or real email.

Objectives:

- provision production Supabase resources and apply reviewed database migrations, authorization policies, and backups;
- configure production authentication origins, passwordless email, and approved OAuth callbacks;
- deploy the web application to Railway from the intended production branch only after local tests and the production build pass;
- validate account migration, cloud synchronization, and cross-device behavior against the hosted environment;
- activate and verify opt-in email reminders and scheduled jobs without enabling unsolicited communication;
- validate repository-cached localization, browser pronunciation, and graceful English fallback without introducing translation or speech secrets;
- activate source-change monitoring schedules and editorial alerts without automated publication;
- complete security, privacy, accessibility, observability, rollback, cost-limit, and deployment-frequency checks;
- keep draft and review-state content visibly labeled and prevent incomplete administrative tools from becoming public accidentally.

The hosted environment may use a restricted staging mode during this gate. Public availability is the final step, not a prerequisite for implementing earlier phases.

Suggested checkpoints:

```text
chore: configure hosted integration environment
```

```text
chore: deploy public web application
```

---

# Phase 15 — Native Application Foundation

Preparation: complete or explicitly schedule **Batch 3 (N1–N5)** in [the refactor roadmap](refactor.md): localized content-bundle coverage, portable component content and shared inline parsing, finder messages, a platform-independent account coordinator, and the lower-priority metadata/MDX boundary. These extend existing domain, storage, and sync contracts. Introduce workspaces only when the second application exists; select the offline engine against Phase 16 requirements. Claude owns Japanese catalog changes; the account coordinator is a suggested Codex assignment for Claude to review.

**2026-09-29 N4 Stage-A preparation:** Codex's [coordinator checkpoint](checkpoints/N4-account-coordinator.md)
extracts account-sync queueing, retries, cache ownership, account revisions, stale results and disposal into
a module with injected storage/transport/status contracts and no React/browser/SDK dependency. The web
provider retains browser/auth lifecycle bindings. Existing keys, merge rules and RPC payloads remain;
new fixtures cover stale initial identity, sign-out failure, cleanup, token refresh and A -> B -> A races.
The record documents the H5 account/session coordination contract and remaining request/auth binding gate.

20 focused tests, full **675 tests / 159 files**, types, targeted lint, architecture (**696 modules**),
whitespace, public-only **415-page** build, CMS exclusion and bundle checking (**42 scripts**) passed.
Existing dependencies were used; no hosted account/cross-device, browser UI, SQL or editorial/localization
check is claimed. This and the four new J1 checkpoints plus consolidated docs await Claude; reviewed
integration remains `e4fc1ff`. N4 is not fully accepted until review/integration and combined H5/hosted
checks pass. No native app, main merge, hosted service or activation.

**2026-09-29 N1 Stage-B integrity preparation:** the [bounded bundle checkpoint](checkpoints/N1-bundle-integrity.md)
validates the existing eight format-1 payloads and adds a portable whole-bundle acceptance contract with an
injected UTF-8 SHA-256 function. It rejects incomplete or unsupported bundles, invalid records, duplicate
IDs/paths and checksum/count/version mismatches before returning a manifest. Existing canonical JSON and
version inputs remain unchanged. Catalog expansion, translation provenance/fallback coverage, cross-catalog
reference validation and Stage-C component payloads remain pending; Stage B and N1 are not complete.
Focused **21 tests / two files**, full **693 tests / 160 files**, types, full lint, architecture (**697 modules**)
and whitespace passed using existing dependencies. Build/browser/SQL/localization gates were not repeated.
This checkpoint and its pending ancestors await Claude; reviewed integration remains `e4fc1ff`.
Follow-up self-review fixed extra top-level IDs overriding canonical article/translation identities;
four regression cases, focused **25 tests / two files**, types and targeted lint passed. Review pending.

**2026-09-29 N1 first catalog expansion:** [the translation export checkpoint](checkpoints/N1-catalog-translations.md)
adds complete current Japanese FAQ, glossary and residence-status artifacts, preserving provenance/review
state and omitting missing/stale overlays using existing availability/source-revision rules. English catalogs
remain available. The expanded mandatory file set explicitly bumps format **1 to 2**; format-1 readers must
reject it. Portable acceptance checks target/source revisions for these three families. Observed output:
**116 FAQ, 236 glossary and 30 status artifacts**, eleven files total; generated files passed disk acceptance.
Focused **38 tests / three files**, full **710 tests / 161 files**, types, full lint, architecture (**699 modules**)
and whitespace passed. Other catalog families, broader references/article provenance and Stage-C component
payloads remain pending; N1 is incomplete. Claude review/integration pending; integration remains `e4fc1ff`.

**2026-09-29 N1 local guidance expansion:** [the municipality/general-advice checkpoint](checkpoints/N1-local-guidance-bundle.md)
adds canonical supplements, supported geography, general lookup prompts and complete current Japanese
artifacts. Supplement overlays preserve per-field English fallback; general advice requires a complete
title/step overlay or falls back as a whole. Consumer acceptance checks article/source/geography references,
hierarchy, translation target/revisions and known field keys. Five mandatory files bump format **2 to 3**;
previous formats are rejected. All previous eleven payload checksums remain unchanged.
Observed output: **784 supplements, 159 supported geographies, 7 general-advice entries**, plus **784/7**
Japanese overlays; sixteen files total. Focused **53 tests / four files**, full **725 tests / 162 files**,
types, full lint, architecture (**700 modules**), whitespace, export and independent disk acceptance passed.
Other N1 families and Stage-C component payloads remain pending. No canonical/translation edits or
production build/browser/SQL/translation audit repeated. Claude review pending; integration remains `e4fc1ff`.

**2026-09-29 N1 structured status guidance:** [the guidance overlay checkpoint](checkpoints/N1-status-guidance-bundle.md)
adds complete current Japanese path-keyed guidance artifacts. English structured guidance already remains
inside canonical status records. Dedicated file/revision validation distinguishes guidance from summary
artifacts despite their shared historical kind, preserves per-path English fallback, and rejects unsupported
paths. Bundle acceptance now checks direct and structured status source/article/glossary/transition references.
Tests confirm localization leaves source assertions, approval metadata and authorization mode canonical.
One mandatory file bumps format **3 to 4**, seventeen files total with **30** observed guidance overlays;
previous sixteen payload checksums are unchanged. Focused **72 tests / five files**, full **744 tests / 163 files**,
types, full lint, architecture (**701 modules**), whitespace, export and disk verification passed using existing
dependencies. No canonical/Japanese/renderer edits or production build/browser/SQL/translation audit repeated.
Remaining N1 families and Stage-C payloads stay pending; reviewed integration remains `e4fc1ff`.

**2026-09-29 N1 localized discovery:** [the article-group/journey checkpoint](checkpoints/N1-discovery-bundle.md)
adds complete current Japanese discovery artifacts with existing revision rules and full provenance.
Strict schemas validate serialized route/phase/condition arrays; partial entries retain English fallback.
Consumer acceptance checks canonical discovery relationships, nested translation IDs and unsupported
relationship fields. Tests compare current web presentation and all journey route choices before/after
localization. Two mandatory files bump format **4 to 5**, nineteen files total, with **15 group/20 journey**
artifacts observed; previous seventeen payload checksums are unchanged. Focused **90 tests / six files**,
full **762 tests / 164 files**, types, full lint, architecture (**702 modules**), whitespace, export and disk
verification passed using existing dependencies. No canonical/Japanese/renderer/configuration edits or
production build/browser/SQL/translation audit repeated. Other N1 families and Stage-C payloads remain
pending; Claude review/integration pending. Reviewed integration remains `e4fc1ff`.

**2026-09-29 N1 annotated documents:** [the document checkpoint](checkpoints/N1-annotated-documents-bundle.md)
adds complete canonical families and current complete Japanese artifacts, preserving version/variant
structure, dates, review status, fictional notices, source/rights attribution and whole-family English
fallback. Acceptance validates bundled references, lifecycle shape, source/rights membership and stable
overlay paths. Visuals remain external URL metadata; no asset download or new rights review. Two mandatory
files bump format **5 to 6**, twenty-one files total, with **6 families/6 overlays** observed; prior nineteen
payload checksums remain unchanged. Focused **107 tests / seven files**, full **779 tests / 165 files**, types,
full lint, architecture (**703 modules**), whitespace, export and disk verification passed using existing
dependencies. No canonical/Japanese/renderer/configuration edits or production build/browser/SQL/translation
audit repeated. Remaining N1 coverage and Stage-C payloads stay pending; reviewed integration remains `e4fc1ff`.

**2026-09-29 N1 activity cross-references:** [the activity checkpoint](checkpoints/N1-activities-bundle.md)
adds complete canonical activities and current Japanese artifacts with per-path English fallback and
preserved provenance. Acceptance checks target/source identities, question/choice conditions and unambiguous
IDs/overlay paths. Tests exercise all registered answer combinations and preserve canonical rule selection,
links, source assertions and approval decisions after localization. Two mandatory files bump format **6 to 7**,
twenty-three files total, with **8 activities/8 overlays** observed; prior twenty-one checksums unchanged.
Focused **126 tests / eight files**, full **798 tests / 166 files**, types, full lint, architecture (**704 modules**),
whitespace, export and disk verification passed using existing dependencies. No canonical/Japanese/renderer/
configuration edits or production build/browser/SQL/translation audit repeated. Geography/article provenance,
remaining relationships and Stage-C payloads stay pending; reviewed integration remains `e4fc1ff`.

Objectives:

- React Native;
- Expo;
- TypeScript;
- shared backend;
- shared domain/API contracts where practical;
- persistent authentication;
- native navigation;
- synchronized account features.

Do not merely embed the website in a native wrapper.

Suggested checkpoint:

```text
feat: scaffold Nihonest native application
```

---

# Phase 16 — Native Convenience Features

Potential objectives:

- push notifications;
- offline saved articles;
- offline glossary;
- offline roadmap/checklist;
- emergency information;
- improved offline emergency guidance with clearly dated cached content, essential official contacts, stale-content warnings, and deliberate update behavior;
- native sharing;
- polished mobile interaction.

Exact offline storage technology should be selected based on requirements at this phase.

---

# Phase 17 — Native Monetization

Direction:

- web knowledgebase remains free;
- native app may use a modest one-time purchase price;
- purchase supports development and article updates;
- important information is not artificially paywalled.

Exact price and store configuration are deferred until release planning.

---

# Deferred / Unscheduled Ideas

These should remain visible but have no implementation commitment:

- advanced search provider;
- hosted multi-user CMS and external contributor portal (see the adoption requirements below);
- analytics provider;
- broad municipality coverage;
- additional reminder channels;
- product analytics;

---

# Explicitly Avoid Premature Implementation

Do not implement a technology merely because the roadmap mentions it.

In particular, defer until justified:

- production database;
- authentication;
- email provider;
- runtime translation API provider;
- push provider;
- search SaaS;
- hosted multi-user CMS;
- analytics SaaS;
- native database;
- AI functionality.

## CMS Adoption Requirements

A hosted multi-user CMS should be reconsidered only when multiple independent editors or external contributors make the repository-first workflow materially limiting. This is separate from the planned local editorial CMS above. Hosted adoption would require:

- authenticated editor, reviewer, publisher, and administrator roles with least-privilege authorization;
- durable assignments, comments, review requests, approval gates, and conflict handling;
- versioned drafts, field-level or rendered diffs, previews, revision notes, rollback, and immutable audit events;
- a clear canonical-content decision and a migration/import-export path that preserves stable IDs, relationships, source dependencies, and Git history;
- source-review queue integration without allowing detected changes or AI suggestions to publish content;
- staging and publication controls that separate editorial approval from deployment;
- protection for unpublished content, personal data, credentials, and administrative routes;
- backup, recovery, retention, moderation, and account-removal procedures;
- accessibility and localization support for the editorial interface; and
- hosted database, storage, observability, and security validation before editors rely on it.

Until those needs are demonstrated, repository files, explicit human approval, review metadata, and Git provide the smaller and more auditable workflow.

---


**2026-09-30 N1 administrative geography checkpoint:**

- Following pushed activity checkpoint `d443e9d`, Codex added [administrative geography export](checkpoints/N1-geography-bundle.md).
- Preserves 194 registered places, 48 dated source records and four saved-ID aliases unchanged. Acceptance
  checks hierarchy/check digits, source references/snapshot counts, alias targets/collisions and supported
  guidance identity/type/parent parity. Counts are observations, not pinned acceptance requirements.
- Format 7 → 8 adds three mandatory files (26 total); prior twenty-three payload checksums are unchanged.
- Focused 105 tests / four files, types, full lint, architecture (705 modules), whitespace, export and
  independent disk verification passed. Full four-worker suite: **808 tests / 167 files**, all passed. Existing dependencies;
  no clean install, production build/browser, SQL, research fetch or translation audit repeated.
- Article provenance, remaining relationships and Stage-C payloads remain pending. Exact checkpoints and
  consolidated docs await Claude; reviewed integration remains `e4fc1ff`. Main/activation unchanged.


**2026-09-30 N1 article provenance checkpoint:**

- Following pushed geography checkpoint `b276cf4`, Codex added [article provenance](checkpoints/N1-article-provenance.md).
- Exports canonical whole-MDX revisions and complete current active Japanese artifacts; compact translations
  use the same selection. Reader checks exact article coverage and artifact/portable target, revision, review,
  title/description/body agreement. Canonical sources and translation artifacts are unchanged.
- Source revisions are producer declarations; portable blocks cannot reconstruct original MDX. Checksums
  establish integrity, not publisher authenticity. Existing parser/component gates remain open.
- Format 8 → 9 adds two mandatory files (28 total); prior twenty-six payload checksums are unchanged.
- Focused 115 tests / five files, types, full lint, architecture (706 modules), whitespace, export and
  independent disk verification passed. Full four-worker suite: **824 tests / 168 files**, all passed. Existing dependencies;
  no clean install, production build/browser, SQL or translation audit repeated.
- Remaining relationships and Stage-C payloads remain pending. Exact checkpoints and consolidated docs
  await Claude; reviewed integration remains `e4fc1ff`. Main/activation unchanged.


**2026-09-30 N1 catalog relationship checkpoint:**

- Following pushed provenance checkpoint `13344ab`, Codex added [catalog relationship acceptance](checkpoints/N1-catalog-relationships.md).
- Reader reuses existing article, glossary and FAQ collection validators against candidate bundle records.
  Checks cover known source/content targets, article/glossary self-links, unique slugs and all six FAQ
  target families. No canonical or translation edits and no added platform dependency.
- Format remains 9 / 28 files; the prior catalog version and all payload checksums are unchanged.
- Focused 119 tests / three files, types, full lint, architecture (706 modules), whitespace, export and
  independent disk verification passed. Full four-worker suite: **843 tests / 169 files**, all passed. Existing dependencies;
  no clean install, production build/browser, SQL or translation audit repeated.
- Stage-B coverage inventory/review and Stage-C payloads remain pending. Exact checkpoints and consolidated
  docs await Claude; reviewed integration remains `e4fc1ff`. Main/activation unchanged.


**2026-09-30 N1 Stage-B inventory checkpoint:**

- Following pushed relationship checkpoint `a0bd248`, Codex recorded [the Stage-B coverage inventory](checkpoints/N1-stage-b-inventory.md).
  All explicit N1 catalog families are represented; exact review/integration and final acceptance remain open.
- Audit found FAQ/glossary/status-summary translation field contracts allowed undeclared fields. Strict
  per-kind validation now rejects them, with six direct/whole-bundle cases using a valid extra field name.
- Format remains 9 / 28 files, with unchanged catalog version/payload checksums and no canonical or translation
  catalog edits. Component payloads/renderer alignment remain Stage C; messages remain Claude/N3-owned.
- Personalized roadmap rules are not exported; native offline rule ownership/payload parity remains an
  explicit open contract item. The inventory does not claim a complete native offline application.
- Focused 117 tests / three files, types, full lint, architecture (706 modules), whitespace, export and
  independent disk verification passed. Full four-worker suite: **849 tests / 169 files**, all passed. Existing dependencies;
  no clean install, production build/browser, SQL or translation audit repeated.
- Next independent work is N2 standalone inline parser/data contracts. Reviewed integration remains
  `e4fc1ff`; exact checkpoints/docs await Claude. Main/activation unchanged.


**2026-09-30 N2 inline parser checkpoint:**

- Following pushed N1 inventory `2c6a95d`, Codex added [a portable inline display parser](checkpoints/N2-inline-parser.md).
- Supports text, emphasis/bold nesting, escaped punctuation, code runs and formatted-label links with
  balanced destinations. Unsupported/malformed markup remains protected raw spans with offsets/reasons;
  bounded inputs fail loudly. No renderer/export/CMS/translation changes or production consumer.
- Real current corpus: 6,187 text units with exact source reconstruction and serializable trees. The only
  protected spans observed are 30 `[ ]` checklist blanks (15 per locale); literal/protected renderer handling
  remains an explicit integration decision. Counts are observations, not pinned acceptance requirements.
- Focused 36 tests / three files, types, full lint, architecture (707 modules) and whitespace passed.
  Full four-worker suite: **880 tests / 171 files**, all passed. Existing dependencies; no generation/build/browser, clean
  install, SQL, translation audit or hosted execution repeated. Format remains 9 / 28 files.
- N2 renderer/export alignment, component contracts/payloads, Stage-C ownership handoff and N1/N2 final
  acceptance remain pending. Reviewed integration remains `e4fc1ff`; exact checkpoints/docs await Claude.
  Main/activation unchanged.


**2026-09-30 N2 inline hardening checkpoint:**

- Following pushed standalone parser `ca87cf6`, Codex fixed [confirmed delimiter and repeated-scan gaps](checkpoints/N2-inline-hardening.md).
  Intraword underscores no longer close outer formatting early, including supplementary Unicode letters;
  excessive closing runs remain protected. Unclosed angle/brace syntax protects the remaining raw input
  once rather than repeatedly scanning. Supported nesting/API and production consumers are unchanged.
- Focused 47 tests / three files, types, full lint, architecture (707 modules) and whitespace passed. Full
  four-worker suite: **891 tests / 171 files**, all passed. Corpus remains 6,187 units / 30 protected checklist blanks.
- Read-only component inventory records tax row pairs, training row suffixes/links and practical-basics
  labels/links for Stage-B contract preparation. No component copy extraction, renderer or translation edits.
- Existing dependencies; no generation/build/browser, clean install, SQL or translation audit repeated.
  N1/N2 acceptance and Stage-C payload/renderer handoff remain open. Reviewed integration stays `e4fc1ff`;
  exact checkpoints/docs await Claude. Main/activation unchanged.


**2026-09-30 N2 table contract checkpoint:**

- Following pushed inline hardening `802c618`, Codex added [two portable table contracts](checkpoints/N2-table-contracts.md).
  Strict bilingual caption/header/row shapes preserve tax pairs and training activity/route/suffix tuples;
  suffixes remain required even when empty. Training hrefs validate against canonical article slugs.
- Test-only TypeScript literal inspection reads existing component data without executing JSX or writing
  content files. Actual bilingual wording/order/captions/headers/suffixes/links survive validation unchanged.
  No renderer, canonical data, translation catalog or bundle edit; format remains 9 / 28 files.
- Focused 56 tests / three files, types, full lint, architecture (708 modules) and whitespace passed. Full
  four-worker suite: **905 tests / 172 files**, all passed. Existing dependencies; no generation/build/browser, clean
  install, SQL or translation audit repeated.
- Practical-basics contract, content extraction, Stage-C renderer/payload wiring and Japanese final checks
  remain pending. N1/N2 acceptance stays open; reviewed integration remains `e4fc1ff`. Exact checkpoints/docs
  await Claude. Main/activation unchanged.


**2026-09-30 N2 practical-basics checkpoint:**

- Following pushed table contracts `04814ca`, Codex added [practical-basics rich-text validation](checkpoints/N2-practical-basics-contract.md).
  Strict ordered bilingual paragraphs preserve literal text, leading strong labels and article links.
  Target order agrees across locales; hrefs resolve by slug. Proposed paragraph IDs require Stage-C review.
- Test-only TypeScript literal inspection reads existing JSX without executing it or writing content files.
  Current bilingual paragraph/label/link wording and order survive unchanged. No canonical/translation,
  renderer or bundle edit; format remains 9 / 28 files and no production consumer is wired.
- Focused 66 tests / three files, types, full lint, architecture (709 modules) and whitespace passed. Full
  four-worker suite: **916 tests / 173 files**, all passed. Existing dependencies; no generation/build/browser, clean
  install, SQL or translation audit repeated.
- Parser and three component contracts are prepared; actual extraction, Stage-C wiring/payloads and Japanese
  final checks remain pending. N1/N2 acceptance stays open; reviewed integration remains `e4fc1ff`. Exact
  checkpoints/docs await Claude. Main/activation unchanged.


**2026-09-30 N2 combined review/handoff checkpoint:**

- Following pushed practical-basics contract `8c56ed3`, Codex recorded [the exact review queue and Stage-C sequence](checkpoints/N2-stage-c-handoff.md).
  Self-review fixed combining marks being omitted from inline word boundaries; decomposed accents and
  combining-script words now preserve internal underscores. Five cases also verify the 32/33 depth boundary.
- No additional blocker found in the three component schemas; Claude review and rendered/native parity
  remain pending. The handoff proposes explicit checklist handling, paragraph IDs, canonical copy extraction,
  renderer/export alignment and all-directive payload gates; it does not transfer Stage-B ownership.
- Focused 72 tests / four files, types, full lint, architecture (709 modules) and whitespace passed. Full
  four-worker suite: **921 tests / 173 files**, all passed. Corpus remains 6,187 units / 30 protected checklist blanks.
- No consumers/content/translations or format/payload change. Existing dependencies; no generation/build/
  browser, clean install, SQL or translation audit repeated. Reviewed integration stays `e4fc1ff`; exact
  checkpoints/docs await Claude. Stage-C handoff and N1/N2 final acceptance remain open. Main/activation unchanged.

# Roadmap Maintenance

When priorities change:

1. update this roadmap;
2. update ARCHITECTURE.md if technical direction changes;
3. record significant decisions in DECISIONS.md;
4. keep completed phases historically understandable.

Codex should not silently redefine roadmap scope.

When a coherent phase/checkpoint is completed and tested, Codex should explicitly recommend a Git commit and provide an appropriate commit message.


### J1 acceptance preparation and operator review — 2026-09-30

- Following pushed N2 handoff `810e262`, Codex reviewed the J1 worker, adapter, command, authority SQL,
  acceptance fixture and operator contract together; no new runtime defect was found.
- [The preparation record](checkpoints/J1-acceptance-preparation.md) defines the outstanding PostgreSQL 17
  multi-connection claim/lock-wait, real Auth/PostgREST and fake-sender acceptance. It records transaction-start
  claim defaults separately from completion clock authority. No runtime/migration/configuration change.
- Authority pgTAP fixture grows from 24 to 29 assertions: upper attempt bound, invalid failed/suppressed
  metadata, unchanged rows after rejection and rejection of the original token after reclaim.
- Local embedded SQL: **30 assertions passed**, PostgreSQL 18.3 / PGlite 0.5.8, stub Auth, one connection.
  Static pgTAP plan count passed; pgTAP itself and PostgreSQL 17/concurrency acceptance remain unrun.
- Focused notification suite: **133 tests / 15 files passed**; no-service command help and whitespace passed.
  Existing dependencies; no full-suite/types/lint/build/browser, clean install or translation audit repeated.
- Exact checkpoint and four J1 implementation checkpoints still await Claude. Reviewed integration remains
  `e4fc1ff`; no working-head integration, main merge, hosted execution or activation.


### N4 foreign-cache handoff follow-up — 2026-09-30

- Following pushed J1 acceptance preparation `b427fd4`, Codex confirmed and fixed a foreign-cache
  ownership race. A newer family retained during B-to-A canonical application could be relabeled A and
  uploaded on the next pass. The new saved-family regression failed against the prior implementation.
- [The follow-up record](checkpoints/N4-foreign-cache-handoff.md) documents the stable-snapshot handoff:
  changes to any foreign-owned family queue a fresh empty import without applying canonical data or
  transferring ownership. The existing foreign-cache replacement policy remains; no per-account cache
  preservation is added. Same-account newer-edit handling is unchanged.
- Three portable family cases plus a browser storage-event fixture pass. Focused **24 tests / three files**,
  types, targeted lint, architecture (**709 modules**) and whitespace passed. Full four-worker suite:
  **925 tests / 173 files**, all passed; existing jsdom navigation diagnostic remained non-failing.
- Existing dependencies; no clean install, production build/browser UI, hosted cross-device, SQL or
  translation audit repeated. No RPC, auth/session, storage-key or provider implementation change.
- Exact follow-up and original N4 extraction `9061031` await Claude. H5 request/session binding and combined
  acceptance remain open; reviewed integration stays `e4fc1ff`. No main merge, hosted execution or activation.


### N1 reader rejection-path review — 2026-09-30

- Following pushed N4 ownership fix `f14bf04`, Codex reviewed the manifest/registered payload contracts,
  candidate reader and provenance/translation/geography/relationship rejection paths. No new defect found;
  [the review record](checkpoints/N1-reader-rejection-review.md) is self-review evidence, not Claude approval.
- All bundle suites: **177 tests / 11 files passed**. Independent local disk inventory/hash/count/catalog
  verification and reader acceptance passed for format 9 / 28 files, with unchanged catalog version
  `160b2acf9368dd4fce2855016fbfc496a8d69883b637c969b4895398585f86d2`.
- Additional read-only probes rejected duplicate canonical identities in all **28 rehashed payloads**,
  including unrelated extra IDs, and rejected **eight malformed manifests**. No runtime, test, canonical,
  translation, generated-file, consumer or dependency changes; no regeneration.
- Existing dependencies; no clean install, full-suite/types/lint/build/browser, editorial/translation,
  SQL or hosted checks repeated. Exact checkpoints/docs still await Claude. N1/N2 acceptance and Stage-C
  payload/renderer handoff remain open; reviewed integration stays `e4fc1ff`. Main/activation unchanged.


### J1 command output and exit-path verification — 2026-09-30

- Following pushed N1 reader review `2c36708`, Codex added [exact entry-script boundary coverage](checkpoints/J1-command-output.md).
  Eight fixtures cover help/argument no-I/O paths, completed/disabled/failed aggregate reports, deduplicated
  configuration setting names and generic startup failure without error/cause disclosure. No runtime change.
- The committed script is transpiled with existing TypeScript and run with explicit process/import bindings;
  global environment/process and real SDKs are untouched. Four real Node child probes also passed with a
  system/path/temp-only environment: help, invalid argument, missing settings and invalid URL/dummy secret.
- Notification suites: **141 tests / 16 files passed**. Types, targeted lint, architecture (**709 modules**)
  and whitespace passed. Full four-worker suite: **933 tests / 174 files**, all passed; existing jsdom
  navigation diagnostic remained non-failing.
- Existing dependencies; no clean install, successful real job, hosted/Auth/database/SES call, production
  build/browser UI or translation audit. J1 reciprocal review/integration and PostgreSQL 17/pgTAP/concurrency
  acceptance remain open. Reviewed integration stays `e4fc1ff`; no main merge or activation.


### Consolidated pending review queue — 2026-09-30

- Codex prepared [the exact pending review queue](checkpoints/PENDING-REVIEW-QUEUE.md), snapshot ending
  at `185add75b5ed86e3d788bc08b434dfae75e7b6e6`: **26 commits** grouped as J1 (six), N4 (two),
  N1 (thirteen, including documentation-only self-review), and N2 (five). All remain review/integration pending.
- Queue generation verified every full hash/actual parent against Git, exact coverage since handoff
  `ece6c4a`, all checkpoint links, and identical handoff/reviewed-integration trees. Deferred consolidated
  documentation since `b494ed0` is listed separately. Current refactor overview now reflects Stage-B coverage.
- Code dependencies and Git ancestry are distinguished: later group approval does not authorize merging
  unrelated ancestors. Shared-doc overlaps require agreed integration and consolidated conflict handling.
- Documentation only; no implementation/content/translation/test/generated changes or new test/build run.
  Existing verification is attributed to exact checkpoints. Combined, real SQL, H5/hosted and Stage-C gates
  remain open; reviewed integration stays `e4fc1ff`. No main merge or activation.


### Reviewed J1/N4/N1/N2 preparation integration — 2026-10-03

- Claude approved all 26 queue checkpoints for code scope and queue `29b212c`; exact input integrated
  conflict-free at `b09cd2833855018bcf81d08130c1a8a17e1b2959`. The source tree matches reviewed input.
- [The receipt](checkpoints/J1-N4-N1-N2-integration-20261003.md) records limited documentation approval and remaining gates.
  Combined isolated LF checks: **933 tests / 174 files**, full lint, post-build types, architecture (**709 modules**),
  public/job fixture preflights, **415-page public-only build**, CMS exclusion and **42 browser scripts** passed.
- Async guidance/source-registry injections failed as expected; bytes restored identically and clean check passed.
  Format 9 / 28-file export and independent disk/reader verification reproduced the unchanged catalog digest.
  Editorial **479 / 0 approvals**, article translation and glossary consistency checks passed without findings.
- Command help and unset-job configuration failure passed without service construction. Existing dependencies,
  no clean install, Playwright/manual UI, real SQL/hosted/Auth/fake-sender integration or email execution.
- J1 backlog-resolution/local-target and N1 revision-ordering follow-ups are recorded. N4/H5 binding,
  Stage-C handoff, Japanese component provenance/wording checks and final acceptance remain open.
  New consolidated documentation awaits review. No main merge, ownership transfer or activation.


### Stale Playwright repair review/integration — 2026-10-03

- Codex approved exact Claude test-only `888c7a0` against parent `93e44b4`, no blockers, and cherry-picked
  it as `ffdeef634e4cf14c91b1ef75052b104de217bb21` after `29fe06f`. Only two e2e specs changed.
  [The review record](checkpoints/Playwright-stale-spec-review-20261003.md) preserves the reachable-scenario change and baseline attribution.
- Exact-commit production build **415 pages**; full Chromium Playwright **32 passed / 1 skipped**. Combined
  production run also **32 passed / 1 skipped**, default eight workers. Account/Supabase lifecycle remained
  opt-in/skipped. Types, targeted lint and whitespace passed; both isolated checkouts remained clean.
- Combined run reused the validated `b09cd28` build after verifying source equality outside docs/e2e.
  No ERR_ABORTED in either run; no claim of repeated stress verification or Codex's own pre-repair baseline.
  Existing copied dependencies; no full unit/lint/architecture/export/audit gate repeated for test-only changes.
- Claude merged exact `29fe06f` as `f7c21a0` and approved its documentation delta. Earlier unread-record
  limits remain; this new documentation awaits review. Temporary loopback servers stopped; no hosted calls.
- J1 real-database/operator, N4/H5 hosted/binding and N1/N2 Stage-C/Japanese provenance gates remain open.
  Next Codex checkpoint: read-only revision-key ordering test. Claude retains H4/H5/H3b. Main/activation unchanged.

### H4 / H3b review and H5 coordination — 2026-10-03

- Claude's H4 `d4a4b1f` is approved for local scope and integrated alone as
  `52f8a08b8b5d3953fe91cea280b67bd2b858d12c` after `10883fa`. H3b `3feb37f` is excluded:
  its CI readiness loop continues when every health probe fails. Codex requests a bounded Claude-owned
  fix with a negative readiness check before approval.
- [The review record](checkpoints/H4-H3b-review-20261003.md) records exact-commit release checks (13/13),
  **940 tests / 176 files**, **712 modules**, public-only build, headers/liveness and a verified CSP sweep.
  Browser intermittency remains recorded; real Auth/hosted/CI/clean-install acceptance is not claimed.
- H5 coordination selects database-authoritative expected-account binding before writes. Codex owns
  SQL/adapter/provider binding; Claude owns proxy/session. RLS/invoker security and stale-response
  rejection remain required; combined isolated-Auth and hosted acceptance stays open.
- Claude approved documentation `ffdeef6..10883fa` and merged the exact handoff as `0d7021e`.
  This new consolidated record awaits documentation review. J1 database/operator and N1/N2 Stage-C
  gates remain open; no ownership transfer, main merge or activation.

### N4 / H5 expected-account binding checkpoint — 2026-10-03

- Codex implemented the bounded SQL/adapter/provider binding on base `adaf2b9`; review and integration
  await Claude. [The checkpoint](checkpoints/N4-expected-account-binding.md) documents the required
  `p_expected_user_id` RPC argument, pre-write `auth.uid()` comparison and removal of the old unbound
  signature. Invoker security, RLS, merge rules and coordinator stale-response rejection are preserved.
- Focused tests: **29 passed**. Full Vitest: **945 tests / 176 files**; TypeScript, targeted lint,
  architecture (**712 modules**), public-only build, CMS exclusion and bundle boundaries passed.
  Disposable network-isolated PostgreSQL 17: **27 existing + 13 new SQL assertions passed**;
  removing the guard failed seven assertions, restoring it passed. The container was removed.
- These SQL fixtures do not establish real JWT/Auth/PostgREST or combined H5 session acceptance.
  Claude retains proxy/session changes. Source integration remains `52f8a08`, documentation handoff
  `3bf4e94`; this checkpoint has not been integrated. H3b repair and the other open gates remain.
  No main merge, hosted service, email, schedule or translation activation.

### N1 revision-key ordering acceptance checkpoint — 2026-10-03

- Codex added [a read-only corpus regression test](checkpoints/N1-revision-ordering-acceptance.md) on
  base `a39d01b`; review/integration await Claude. All **1,349 current revision inputs** across ten
  structured families and articles match code-unit ordering/digests; insertion order is immaterial.
  Production revision code, translation catalogs/prompts and artifacts are unchanged.
- New test: **13 passed**; related bundle gate: **71 tests / eight files passed**. TypeScript, targeted
  lint and whitespace passed. No full build or full-suite repetition is claimed for this test-only change.
- This is Node/current-corpus evidence, not Hermes or universal locale equivalence. The N4 parent
  `a39d01b` remains unreviewed; approval of this test alone must not integrate that parent implicitly.
  Integration remains H4 `52f8a08` / documentation `3bf4e94`. Stage-C/native, H5/Auth, H3b and J1
  acceptance remain open; no main merge, artifact approval or activation.

### J1 local acceptance target and exhausted-backlog procedure — 2026-10-03

- Codex implemented [the bounded follow-up](checkpoints/J1-local-target-backlog-procedure.md) on base
  `938b869`; review/integration await Claude. The command defaults to production; explicit local mode
  requires loopback Supabase and disabled email before client construction. Production validation stays
  intact. Disabled-email runs still write events/deliveries and are not dry runs.
- The operator contract retains exhausted-backlog exit 1 and adds private incident acknowledgement plus
  manual one-row terminal suppression. The psql procedure defaults to ROLLBACK; only an explicitly
  committed, separately reviewed abandonment resolves an eligible exhausted row. No automatic retry/reset.
- **154 notification tests / 16 files**, types, targeted lint and actual help/config-error probes passed.
  Network-isolated PostgreSQL 17: all migrations applied, **72 notification pgTAP assertions** and
  **49 operator-procedure assertions** passed. Containers removed. Real concurrent connections,
  Auth/PostgREST/fake-sender and full-stack acceptance remain open.
- N4 `a39d01b` and N1 `938b869` remain unreviewed ancestors; single-checkpoint approval must not bring
  them into integration implicitly. Integration remains H4 `52f8a08` / documentation `3bf4e94`.
  H3b/H5/Stage-C/native and J1 activation gates remain; no main merge or activation.

### J1 real PostgreSQL concurrency acceptance — 2026-10-03

- Codex added [a reproducible standalone harness](checkpoints/J1-postgres-concurrency-acceptance.md)
  on base `8f9646a`; harness/evidence review and integration await Claude. The harness loads SQL only
  from exact reviewed integration `3bf4e94`, avoiding the working branch's unreviewed migrations.
- PostgreSQL **17.6**, independent backend connections: **36 assertions passed**. B claims different
  work while A holds its claim transaction; persisted attempts/tokens match. Reclaimed old tokens fail.
  A finalizer genuinely blocked before expiry rejects after lock release past expiry, leaving the row
  unchanged. A transaction-time negative control wrongly accepts the expired claim and is detected.
- Fifth-attempt backlog remains aggregate-only and unchanged. No network/ports/host volumes; owned
  container and temporary files removed. Existing H5 containers were untouched. No app/SQL/translation
  implementation changed; no repeated web build or full suite is claimed.
- This supplies local concurrency evidence, not Auth/PostgREST/fake-sender or final combined acceptance.
  All pending checkpoints still require review; integration remains `52f8a08` / `3bf4e94`.
  No main merge, hosted email, scheduling or activation.

### H3b / H5 review and approved checkpoint integration — 2026-10-03

- H3b `3feb37f` plus `8d6f6dc` approved for local scope. The exact readiness run block fails before
  Playwright on permanent probe failure and reaches it on success. GitHub Actions/clean-install execution
  remains unverified. [The review record](checkpoints/H3b-H5-review-integration-20261003.md) details evidence.
- Callback `1857817` needs a Claude-owned P2 fix: accepted `/account/..//attacker.example` normalizes
  to a protocol-relative external Location. H5 `6866b97` is excluded with that parent; reported
  intermittent PGRST303 account/export failures need investigation. No Batch 1 completion/Stage-C handoff.
- Claude code-approved `a39d01b`, `938b869`, `8f9646a`, `7758622` for their bounded scopes;
  these and H3b were integrated by exact hash. **Combined source `0e5fcf9`**: release checks 13/13,
  **971 tests / 177 files**, **712 modules**, public-only build **416 entries**, audits/types/lint/CMS/bundles
  passed. PostgreSQL concurrency rerun **36 assertions passed** against all eight exact-source migrations.
- Browser first full run: 30 passed / 2 failed / 1 skipped; both failures passed unchanged on targeted
  rerun. Second full run: **32 passed / 1 skipped**, one worker. Account/Auth opt-in skipped; intermittency
  remains recorded. Existing copied dependencies; no new pgTAP/operator, real Auth/fake-sender or hosted run.
- Claude approved the earlier H4-H3b review record; consolidated ROADMAP/refactor were only skimmed.
  This new documentation awaits review. Owned server/container stopped; Claude's checkout/stack untouched.
  Next Codex: J1 dedicated-stack preflight and fake-sender acceptance preparation. No main merge or activation.

### J1 Auth/PostgREST preflight preparation — 2026-10-04

- Codex added [the dedicated-stack read-only preflight](checkpoints/J1-auth-postgrest-preflight.md) on
  validated handoff `f70069c` / working merge `90804bb`; review/integration await Claude. Explicit
  loopback credentials, exact HEAD and a clean checkout are required. Auth administration, eleven empty
  table inventories and database-clock reads are bounded; there are no fixtures, worker writes or sender.
- New guard/SDK transport tests **16 passed**; with existing CLI/command cases **41 passed / three files**.
  TypeScript, targeted lint, architecture **713 modules**, help/argument and whitespace checks passed.
  These are fetch-fixture tests; no real Auth/PostgREST stack or fake-sender acceptance is claimed.
- The checkpoint lists the next owned disposable-stack scenarios and separates preflight from migration
  identity/exclusive ownership. J1 real full-stack/operational acceptance, H5 callback/PGRST303 reliability,
  hosted and Stage-C/provenance gates remain open. No main merge or activation.

### J1 real local Auth/PostgREST acceptance — 2026-10-04

- Claude code-approved preflight `759a4e4` and reran its 16 tests/types; documentation not read line by line.
  Codex's [new acceptance harness/record](checkpoints/J1-auth-postgrest-acceptance.md) await review/integration.
- A separately owned local Auth/PostgREST stack applied all eight migrations from exact reviewed `f70069c`.
  Real production runner/adapter plus fake sender: **14 scenarios passed**, final Auth/table inventory empty.
  Recipient confirmation/no-email, consent/relevance withdrawal, disabled delivery, retry/timeout, lost
  finalization acknowledgement and expired/reclaimed token rejection were exercised. A copied-migration
  mismatch was rejected before fixture creation. Types, targeted lint, help and whitespace passed.
- Missing preferences create a suppressed row, never eligible for claim/send; the earlier planned assertion
  was corrected. Deadline withdrawal means consent withdrawal, not deleting/cancelling a fulfilled reminder.
  No new production runtime/SQL/dependencies or repeated web release/build/browser checks.
- Owned stack/volumes removed; Claude's H5 stack untouched. This is local worker acceptance, not browser
  session/hosted/real-provider proof. Operator acknowledgement, final review/integration and scheduling gates
  remain open. Claude's callback repair `27f791a` now awaits Codex review; PGRST303 remains a watch item
  following Claude's reported non-reproduction investigation. No main merge, Stage-C handoff or activation.

### Repaired callback / H5 / approved J1 preflight integration — 2026-10-04

- Codex approved callback repair `27f791a` and H5 `6866b97` for local scope with original `1857817`.
  [The review/handoff](checkpoints/H5-callback-integration-20261004.md) records **28 callback/helper tests**,
  two matcher tests, and a **13-failure** original-code negative control. Exact review release: 13/13,
  **995 tests / 179 files**. P2 resolved; PGRST303 remains a hosted watch item, not a proven local cause.
- Claude code-approved `759a4e4`; integrated by hash with the three Claude inputs. **Combined source
  `14e21ce`**: release 13/13, **1,011 tests / 180 files**, **713 modules**, public build **416 entries**,
  audits/types/lint/CMS/bundles passed; full serial browser **32 passed / five Auth tests skipped**.
  Copied existing dependencies, no new real Auth/expiry, SQL/operator or CI/clean-install run by Codex.
- Combined web/runtime/migration inputs match Claude's fixed exact tree apart from the unused read-only
  preflight and tests. Claude's H5+N4 real-session/investigation evidence is attributed, not independently
  repeated. Owned server stopped; main/other contributor worktrees/services untouched.
- H1–H5 implementation/local review complete; hosted acceptance is open. Stage-C renderer ownership takes
  effect only after this exact validated handoff is in both branches and Claude reports its receipt.
  Japanese component provenance/wording and tax/training coordination remain prerequisites. No consumer
  extraction has begun. J1 real fake-sender harness/evidence `733c827` remain separate pending review.
- Claude approved the prior H3b-H5 review record after merging `f70069c` as `510553e`; other documentation
  scope limits remain. This consolidated update awaits review. No main merge, hosted/email/scheduler activation.

### N2 English-only component data v2 preparation — 2026-10-04

- Claude merged and documentation-approved `ea715b1` as `f1c3eec`; Stage-C ownership is effective. Japanese
  component provenance is machine-translated; tax/training renderer ownership is explicitly handed to Codex.
- [The preparation checkpoint](checkpoints/N2-English-component-data-v2.md) adds English-only v2 data and
  strict contracts, preserving stable IDs, link targets, empty suffixes and whitespace. AST parity fixtures
  compare the new data to current English literals. Renderers/catalogs and bundle format remain unchanged.
- Focused 32 tests passed; full public-only release 13/13, 1,018 tests / 180 files, 714 modules, 416 entries.
  Browser/Auth/SQL/hosted checks not repeated. This checkpoint awaits Claude review; artifact `5b58f06`
  awaits Codex review. Extraction and byte-exact static markup parity remain pending.
- Claude code-approved J1 `733c827` for scope without rerunning real acceptance; integration remains pending.
  Earlier documentation limits remain. No main merge or activation.

### Stage-C article artifacts / J1 acceptance integration — 2026-10-04

- Codex approves Claude artifact/selector `5b58f06` for scope: seven focused tests, generated route types,
  TypeScript and targeted lint passed. All 37 source fields/revisions match proposed English v2 data.
  Whole-component fallback, empty suffixes, ordered practical links and machine provenance are preserved.
- Integrated exact approved `733c827` as `b3742db` and `5b58f06` as `4139f0c`, after `ea715b1`.
  [Review and combined evidence](checkpoints/Stage-C-artifacts-J1-integration-20261004.md): release **13/13**,
  **1,018 tests / 181 files**, **716 modules**, public production **416 entries**, CMS/all-chunk checks passed.
  No browser, real Auth/SQL, hosted or clean-install checks repeated. J1 operator/scheduling gates remain.
- Claude merged and documentation-approved `ea715b1` as `f1c3eec`; Stage-C handoff and Japanese provenance
  decision are received. Codex English v2 preparation `a74926b` awaits Claude review and is excluded here.
  Extraction/full markup parity and N1 component export remain pending. New docs await review; no main merge
  or activation. Prior documentation review limits remain.


### N3 messages / approved English v2 integration — 2026-10-04

- Claude merged `1f5668c` as `b84336c`, approved its checkpoint record (two wording corrections applied),
  and approved English v2 preparation `a74926b`. Integrated it by hash as `af141e3`.
- Codex approves exact N3 `997f0ab` against `b84336c`; integrated as `4372d4a`. Four en/ja parent markup
  outputs byte-identical, 108 old/new message comparisons and 14 focused tests passed; types passed.
  Complete typed group props/fallback and all consumers checked. Finder client import closures exclude
  the full Japanese catalog/server wrapper. The small shared English payload increase is accepted.
- [Combined source `4372d4a`](checkpoints/N3-English-v2-integration-20261004.md): release 13/13, 1,028 tests /
  181 files, 716 modules, 416 public build entries, lint/types/audits/CMS/all-chunk boundaries passed.
  No browser, real Auth/SQL, hosted or clean-install checks repeated. Extraction is separate and awaits
  Claude markup parity review; N1 payload/export and final N1/N2 gates remain open. No main merge/activation.

### N2 three-renderer extraction review handoff — 2026-10-04

- Reviewed English v2/N3 integration is pushed as documentation handoff `1a4ab65`, source `4372d4a`;
  source release passed 13/13, 1,028 tests / 181 files. Claude's artifact/J1 record review was approved;
  its two wording corrections were applied. New N3/consolidated documentation awaits review.
- Codex extraction checkpoint `f9681f9` against `ded19b4` is ready for Claude's independent en/ja static
  markup parity review. [The checkpoint](https://github.com/TapiaTyler/nihonest/blob/f9681f9/docs/checkpoints/N2-component-renderer-extraction-20261004.md)
  removes bilingual renderer literals, uses canonical English plus the reviewed server selector, preserves
  all training hrefs and marks whole-component English fallback correctly. No Japanese catalog was edited.
- Six full parent snapshots, href/fallback cases and updated canonical contracts passed: 48 focused tests.
  Extraction release 13/13, 1,037 tests / 182 files, 716 modules, 416 entries, CMS/all 43 JS boundaries passed.
  No browser, real Auth/SQL, clean-install/CI or hosted checks repeated. Extraction remains outside the
  integration branch pending review. N1 export and broader inline/native gates remain open.
- Removed a duplicated, identical preparation-history entry introduced by the working-branch merge.
  No main merge, hosted service, real email or schedule activation.

### N1 Stage-C component payload inventory — 2026-10-04

- [The read-only inventory](checkpoints/N1-stage-c-component-inventory-20261004.md) covers all eight
  registrations at `b0a3a86`: format 9 / 28 files still export component markers only. Six kinds are used
  once per locale; all 97 current Japanese articles preserve English component order. Two unused geography
  composition/alias kinds still require coverage. No payload/export contract was wired.
- In-memory generation/integrity, all guide targets/host source references, region partition and map-code
  parity passed. Snapshot: 47 prefectures, eight regions, 112 researched municipalities, 784 supplements,
  seven fee bands, eleven guide labels and 47 map paths. Counts are observations, not schema requirements.
- Coordination requests: Claude-owned pure article-component field validator shared with the server selector;
  fee-copy provenance/renderer ownership; eleven finder guide labels outside N3. The server-only selector
  cannot be imported directly by the ordinary Node exporter or portable verifier. Format/file-set and
  component provenance bindings require review; proposed format 10 is not implemented.
- Renderer extraction `f9681f9` still awaits Claude parity review/integration. Native map interaction and
  broader inline/N1/N2 acceptance remain open. This checkpoint changes documentation only; no release/build,
  browser, database, hosted or external-source checks repeated. No main merge or activation.

### N1 numeric fee contract preparation / held review queue — 2026-10-04

- Codex checkpoint `c72bcd2` prepares a strict portable contract/calculation for existing numeric fees:
  seven period IDs/order, safe integer yen/totals, acceptance intervals and sender-domain suffix. It adds
  no translated prose, eligibility/date-selection rule, canonical data change or export wiring.
- [Focused validation](checkpoints/N1-numeric-fee-contract-preparation-20261004.md): 39 tests / three files
  passed (37 new plus two existing), canonical JSON and all en/ja table amounts preserved, types/targeted
  lint/architecture 717/whitespace passed. No full release/build/browser/SQL/hosted/source refresh repeated;
  the new domain module has no production consumer yet. This checkpoint awaits Claude review.
- [The pending review queue](checkpoints/Stage-C-pending-review-queue-20261004.md) retains `1a4ab65` receipt,
  renderer parity `f9681f9`, inventory `b8e37f1`, this preparation and the pure translation-validator,
  fee-copy ownership/provenance and finder-label requests. Consolidated handoff is held at the user's request
  until Claude's reset. Reviewed integration is unchanged; no main merge or service activation.

### N1 orientation region/map contract preparation — 2026-10-04

- Codex checkpoint `dc97629` adds standalone pure contracts for existing orientation groups and projected
  M/L/Z geometry, finite focus tuples, identity/name checks and exact coverage of supplied prefecture references.
  Collection/member order and untrimmed labels/geometry are preserved; no new region IDs are introduced.
- [Focused validation](checkpoints/N1-orientation-map-contract-preparation-20261004.md): 44 tests / two files,
  exact canonical JSON parity (eight regions, 47 paths, 171 rings), TypeScript, targeted lint and architecture
  718 passed. Existing source data, map/finder implementations, Japanese artifacts and bundle wiring remain
  unchanged. No full release/build/browser/SQL/external-source/license verification repeated.
- Claude review and subsequent adoption remain pending. The helper validates coverage of the caller-supplied
  reference set; canonical acceptance supplies all 47 prefectures/metropolis records. Source/provenance bindings
  remain open. The held queue retains this checkpoint; integration stays `1a4ab65` / source `4372d4a`.
  No main merge or activation.

### N1 component export/provenance proposal — 2026-10-04

- [Codex read-only proposal](checkpoints/N1-component-export-proposal-20261004.md), checkpoint `4fea7e9`,
  specifies a candidate 12 additions (40 total) for reviewed format 10, all eight directive bindings including
  unused composition/alias kinds, canonical references and separate article/translation/map provenance.
  These names/counts are proposals; no payload schema, exporter or format is changed.
- Two in-memory builds retain deterministic format 9 / 28 files; the existing verifier rejects version 10.
  Interface catalogs have 764 keys each with key/placeholder coverage, but 550 raw IDs do not satisfy the
  existing artifact field grammar. Claude's representation/provenance decision is required; public IDs and
  shared translation contracts remain unchanged. The retained map license's LF text hash is recorded.
- This documentation-only checkpoint and consolidated updates await review in the held queue. No full
  release/build/browser/SQL/external-source/license revalidation repeated. Integration remains `1a4ab65` /
  source `4372d4a`; no main merge or activation.

### N1 finder projection/fallback binding audit — 2026-10-04

- [Codex read-only audit](checkpoints/N1-finder-binding-audit-20261004.md), checkpoint `f796866`, reconstructs
  the entire finder payload exactly from existing bundle catalogs: 47 prefectures, 112 researched municipalities,
  47 coverage groups and 784 summaries. Guide targets resolve; locale/order, designated-city, local-link,
  temporary-selection and English-title fallback semantics are recorded for later native binding.
- Current bundled titles match the inspected server-selection rule exactly (784 titles, no duplicate IDs);
  the standalone Next selector was not directly executable in Node, so no runtime/cache execution is claimed.
  Six requested test paths selected five existing files: 16 tests passed; the absent selector-test path
  contributes no coverage. No production/catalog code changed or full release/build/SQL/hosted checks repeated.
- Three Tokyo grouping labels outside N3 require Claude's provenance decision; even the currently unused
  island group remains a dependency. This documentation checkpoint is retained in the held queue. Integration
  remains `1a4ab65` / `4372d4a`; no main merge, activation or scheduling.

### N1 fee/map preparation boundary self-review — 2026-10-04

- Codex [implementer self-review](checkpoints/N1-fee-map-contract-self-review-20261004.md), checkpoint
  `393d324`, found no code defect requiring a fix in fee `c72bcd2` or orientation `dc97629`.
  Combined focused verification passed 83 tests / five files; independent deterministic probes passed
  2,002 geometry cases (including the exact length ceiling), 112 BigInt-oracle fee calculations and
  17 additional date/identity/collection boundaries. No implementation or test change was needed.
- This additional evidence does not replace Claude's independent review or authorize adoption. Earlier
  type/lint/architecture results retain their scope; no full release/build/browser/SQL/hosted/source refresh
  was repeated. Held handoff and integration `1a4ab65` / `4372d4a` remain unchanged; no main merge/activation.

### J1 current local acceptance status reconciliation — 2026-10-04

- Codex documentation checkpoint `09748ca` corrects stale current operations/refactor text: reviewed local
  evidence already includes 72 pgTAP, 49 operator, 36 concurrency (also rerun on reviewed combined SQL) and
  14 real Auth/PostgREST/fake-sender cases. [The current status](checkpoints/J1-local-acceptance-status-20261004.md)
  preserves exact source/review attribution and distinguishes these from later web gates, which did not rerun
  real acceptance. Historical checkpoint records remain historical.
- Scoped row/environment/operator approval, host/schedule/credentials/monitoring decisions and real-provider/
  hosted acceptance remain separate gates. Source comparisons confirm the accepted worker/SQL inputs are
  unchanged; three no-I/O help commands exited 0. No stack, credentials, fixtures or sender was used this pass.
- These documentation corrections await review in the held queue. Independent follow-up can make the
  session-only operator regression harness portable and reproducible against exact reviewed source, without
  borrowing another contributor's stack. Integration remains `1a4ab65` / `4372d4a`; no main merge/activation.
