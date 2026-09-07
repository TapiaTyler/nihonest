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

**Local implementation complete; hosted-provider validation remains in the post-Phase 13 integration gate.**

Develop against local or otherwise non-production infrastructure first. Do not provision the production Supabase project, production OAuth callbacks, or continuously hosted web application solely to begin this phase; final hosted integration belongs to the post-Phase 13 deployment gate.

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

Objectives:

- saved articles;
- saved glossary terms;
- richer glossary study and review tools built on saved terms, including review state and synchronized progress without turning Nihonest into a general language-learning platform;
- personalized roadmap;
- checklist definitions;
- user progress;
- cross-device synchronization;
- recommendation rules separated from taxonomy.

Implement and test synchronization contracts locally during this phase. Cross-network and production-environment validation remains part of the hosted integration gate.

Suggested checkpoints:

```text
feat: add synchronized saved content
```

```text
feat: add personalized journey roadmap
```

---

# Phase 10 — Reminders and Email

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

Objectives:

- select translation provider based on current quality/cost;
- evaluate Japanese text-to-speech quality, licensing, latency, and cost independently, even if the translation provider also offers speech generation;
- preserve canonical English;
- protect Japanese term structures;
- translate eligible prose;
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
- never autoplay pronunciation, expose clear play/pause/replay state, and retain kana and romaji as the non-audio fallback;
- cache or pre-generate stable pronunciation audio where provider terms and editorial workflow allow;
- add an optional reading-aid preference for showing kana, romaji, or both alongside Japanese terms across the product;
- translate semantic document-image annotations, captions, and example-field guidance while keeping the underlying reference image independent from any one interface language.

Provider integration may be developed locally with protected credentials. Production secret management, shared caching, quotas, and failure behavior are validated at the hosted integration gate.

Suggested checkpoint:

```text
feat: add protected machine translation
```

---

# Phase 12 — Source Review and Change Monitoring

Objectives:

- operationalize source dependency graph;
- source check dates;
- identify changed sources;
- flag dependent content;
- provide intelligent source-change assistance that summarizes detected differences, identifies potentially affected claims, and proposes review targets without automatically rewriting or publishing high-stakes guidance;
- editorial review queue;
- add focused contributor and editor workflows for assignment, review, revision notes, approval, and publication state while deferring a general-purpose CMS or external contributor portal until justified;
- revision/change notes.

Do not automatically republish high-stakes information solely from machine-generated changes.

Local/manual checks can establish the workflow, but continuous scheduled monitoring requires hosted execution and is activated only at the hosted integration gate.

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

Do not attempt every municipality simultaneously.

Suggested checkpoint:

```text
content: research visa guidance and add municipality coverage
```

---

# Post-Phase 13 — Hosted Integration and Public Deployment Gate

This is the first planned continuously hosted application environment and public web launch. It occurs only after the features that need hosted validation and the major editorial pass have already been implemented locally.

Objectives:

- provision production Supabase resources and apply reviewed database migrations, authorization policies, and backups;
- configure production authentication origins, passwordless email, and approved OAuth callbacks;
- deploy the web application to Railway from the intended production branch only after local tests and the production build pass;
- validate account migration, cloud synchronization, and cross-device behavior against the hosted environment;
- activate and verify opt-in email reminders and scheduled jobs without enabling unsolicited communication;
- configure production translation/TTS secrets, caching, quotas, and graceful fallback if those features remain approved;
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

# Phase 14 — Native Application Foundation

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

# Phase 15 — Native Convenience Features

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

# Phase 16 — Native Monetization

Direction:

- web knowledgebase remains free;
- native app may use a modest one-time purchase price;
- purchase supports development;
- important information is not artificially paywalled.

Exact price and store configuration are deferred until release planning.

---

# Deferred / Unscheduled Ideas

These should remain visible but have no implementation commitment:

- advanced search provider;
- CMS;
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
- translation provider;
- push provider;
- search SaaS;
- CMS;
- analytics SaaS;
- native database;
- AI functionality.

---

# Roadmap Maintenance

When priorities change:

1. update this roadmap;
2. update ARCHITECTURE.md if technical direction changes;
3. record significant decisions in DECISIONS.md;
4. keep completed phases historically understandable.

Codex should not silently redefine roadmap scope.

When a coherent phase/checkpoint is completed and tested, Codex should explicitly recommend a Git commit and provide an appropriate commit message.
