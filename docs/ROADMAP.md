# ROADMAP.md

# Nihonest — Development Roadmap

## 1. Purpose

This roadmap preserves the intended product direction without committing to release dates.

Items may move between phases as the project is tested and understood.

The presence of a feature in this roadmap does not authorize implementation during an earlier phase.

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
- map reusable journeys for students, professional workers, founders, skilled and sector workers, family members, culture or training participants, and working-holiday participants;
- distinguish core, choose-one, and conditional journey steps;
- retain draft labeling until high-stakes articles receive the planned research and editorial review pass.

The detailed research, geographic expansion, and review-ready content pass remains planned for Phase 13.

Suggested Git checkpoint:

```text
content: expand draft visa catalog and mapped journeys
```

---

# Phase 6 — Anonymous Personalization

Objectives:

- optional journey-stage onboarding;
- make the homepage primary CTA the entrance to that optional onboarding;
- store journey stage locally;
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

Objectives:

- complete responsive UX;
- improve accessibility;
- improve SEO;
- validate production build;
- expand representative content;
- improve source visibility;
- add appropriate testing;
- deploy public web version.

Deployment:

- Railway after local production build passes.

Suggested Git checkpoints may include:

```text
feat: improve public knowledgebase experience
```

```text
test: add critical public flow coverage
```

```text
chore: prepare web application for deployment
```

---

# Phase 8 — Cloud Persistence and Accounts

Deferred until public experience is solid.

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
- anonymous-to-account migration.

Accounts must remain optional for public content.

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
- personalized roadmap;
- checklist definitions;
- user progress;
- cross-device synchronization;
- recommendation rules separated from taxonomy.

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
- cache generated translations;
- display machine-translation notice;
- gracefully fall back to English;
- add an accessible pronunciation-audio control to individual glossary-term pages;
- never autoplay pronunciation, expose clear play/pause/replay state, and retain kana and romaji as the non-audio fallback;
- cache or pre-generate stable pronunciation audio where provider terms and editorial workflow allow;
- add an optional reading-aid preference for showing kana, romaji, or both alongside Japanese terms across the product.

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
- editorial review queue;
- revision/change notes.

Do not automatically republish high-stakes information solely from machine-generated changes.

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
- expand route-specific requirements, evidence, exceptions, transition rules, and practical guidance;
- audit every article, including content already marked ready for editorial review, so one or more relevant Japanese terms are introduced naturally in the article body rather than appearing only in the Key Japanese terminology section;
- verify that each article's linked glossary terms are actually taught in context alongside their English equivalents, removing or replacing terms that cannot be usefully integrated into the passage;
- move articles from draft to editorial review only after their important claims and source mappings have been checked.

Do not attempt every municipality simultaneously.

Suggested checkpoint:

```text
content: research visa guidance and add municipality coverage
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
- account data export;
- richer glossary study/review tools;
- additional reminder channels;
- improved offline emergency features;
- intelligent source-change assistance;
- additional residence-status exploration;
- "Can I do this?" rule cross-reference;
- expanded language support;
- product analytics;
- possible contributor/editor workflows.

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
