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
- expand carefully sourced practical-law and compliance guidance, including acquiring or converting a driver's license and understanding rules for driving in Japan;
- build a practical tax curriculum covering tax residence, national income tax, resident tax, payroll withholding and year-end adjustment, final returns, side income and self-employment, tax treaties and foreign tax credits, consumption-tax and invoice-system questions, departure filings, and appointing a tax agent;
- expand integration-focused legal guidance for the situations foreign residents regularly encounter: employment rights and workplace rules, social-insurance enrollment, leases and consumer contracts, traffic and bicycle rules, family and civil registration, waste and local ordinances, disaster preparedness, and access to qualified multilingual help;
- clearly separate immigration permission, employer or contract restrictions, tax obligations, professional licensing, and local rules so that approval in one area is never presented as approval in all others;
- add sourced cultural and daily-life guidance that clearly distinguishes law, official procedure, common practice, etiquette, and individual variation, using reputable cultural and Japanese-language learning organizations where government sources are not the right fit;
- add accessible annotated examples of important documents to relevant articles and glossary entries, with structured English explanations of each section and translatable text outside the image itself;
- provide clearly fictional or safely redacted completion examples for commonly encountered forms, explain what belongs in each field, and never expose real identity-document data;
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

**Iterations 12A–13A / 12B–13B — Geographic and document discovery and implementation pilots**

- validate a small municipality model and introduce accessible, safely sourced document and form examples.

**Iterations 14A–16A / 14B–16B — Findability, decision support, and final discovery/audit**

- audit terminology, FAQs, search language, groups, journeys, residence-status exploration, and the educational “Can I do this?” cross-reference before completing a phase-wide source and editorial audit.

Do not attempt every municipality simultaneously.

Suggested checkpoint:

```text
content: research visa guidance and add municipality coverage
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
- complete multilingual accessibility, responsive-layout, and machine-translation-notice review;
- retain older artifacts only as explicitly stale data while a replacement is generated, never as silently current content.

Suggested checkpoint:

```text
feat: roll out reviewed multilingual content
```

---

# Post-Phase 14 — Hosted Integration and Public Deployment Gate

This is the first planned continuously hosted application environment and public web launch. It occurs only after the features that need hosted validation and the major editorial pass have already been implemented locally.

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
- multi-user CMS and external contributor portal (see the adoption requirements below);
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
- CMS;
- analytics SaaS;
- native database;
- AI functionality.

## CMS Adoption Requirements

A CMS should be reconsidered only when multiple independent editors or external contributors make the repository-first workflow materially limiting. Adoption would require:

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

# Roadmap Maintenance

When priorities change:

1. update this roadmap;
2. update ARCHITECTURE.md if technical direction changes;
3. record significant decisions in DECISIONS.md;
4. keep completed phases historically understandable.

Codex should not silently redefine roadmap scope.

When a coherent phase/checkpoint is completed and tested, Codex should explicitly recommend a Git commit and provide an appropriate commit message.
