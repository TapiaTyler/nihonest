# Nihonest — Architecture Specification

## 1. Purpose

This document defines the technical direction for Nihonest.

It contains both:

- architecture required for the current web implementation; and
- intentional future direction that should influence present design without being prematurely implemented.

The architecture should optimize for:

- maintainability;
- strong TypeScript typing;
- mobile-first web performance;
- future React Native reuse;
- privacy;
- reliable structured content;
- testability;
- clear separation of concerns;
- incremental development.

---

# 2. Initial Technology Direction

## Web

- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui where appropriate

## Content

- MDX for long-form canonical article bodies
- structured TypeScript/JSON/data records for reusable domain entities

## Validation

- Zod

## Forms

- React Hook Form when forms become sufficiently complex to justify it

## Testing

- Vitest
- React Testing Library
- Playwright

## Future Backend

Planned:

- Supabase
- PostgreSQL
- Supabase Auth

The backend is deferred until the application requires persistent synchronized user state.

## Future Native Applications

Planned:

- React Native
- Expo
- TypeScript

---

# 3. Architectural Principles

## 3.1 Public content and private user state are different systems

Public informational content must not depend on authentication.

Private user data should be stored separately and protected by authorization controls when cloud persistence is introduced.

---

## 3.2 Structured domain data should not be duplicated

Reusable entities such as:

- residence statuses;
- glossary terms;
- sources;
- topics;
- journey stages;

should have canonical definitions.

Articles reference stable entity IDs rather than duplicating structured definitions.

---

## 3.3 Platform-independent logic should be separated from platform UI

Business rules should not unnecessarily depend on Next.js.

Where practical, separate:

- domain types;
- Zod schemas;
- recommendation rules;
- content metadata;
- normalization;
- API contracts;
- utility functions;

from React/Next.js-specific rendering.

This supports later reuse from React Native.

---

## 3.4 External providers should be abstracted

Where an external service may change, expose functionality through an application-level interface or service.

Examples:

- authentication;
- search;
- translation;
- email delivery;
- push notifications;
- analytics.

Avoid scattering vendor-specific calls throughout UI components.

---

# 4. Proposed Project Organization

The exact folder structure may evolve, but a likely direction is:

```text
src/
├── app/
├── components/
│   ├── common/
│   ├── content/
│   ├── glossary/
│   ├── navigation/
│   ├── search/
│   └── ui/
├── domain/
│   ├── article/
│   ├── glossary/
│   ├── journey/
│   ├── residence-status/
│   ├── source/
│   └── taxonomy/
├── lib/
│   ├── content/
│   ├── search/
│   ├── storage/
│   └── validation/
├── services/
├── types/
└── test/

content/
└── articles/

data/
├── glossary/
├── residence-statuses/
├── sources/
├── taxonomy/
└── journey/
```

Codex may recommend reasonable modifications.

Do not create unnecessary abstraction layers solely because they appear in this example.

---

# 5. Content Architecture

## 5.1 MDX responsibilities

MDX should primarily contain long-form editorial content.

Example:

```text
content/articles/registering-your-address.mdx
```

Article frontmatter contains structured references, not duplicated definitions.

Example conceptual metadata:

```yaml
id: registering-your-address
title: Registering Your Address in Japan
slug: registering-your-address
stages:
  - recently-arrived
topics:
  - municipal-procedures
residenceStatuses:
  - all-residents
audiences:
  - employee
  - student
  - spouse
geographicScope:
  - national
importance: important
terms:
  - tennyu-todoke
  - juminhyo
  - shiyakusho
sources:
  - source-example
status: draft
```

Exact schema should be defined with TypeScript and Zod.

---

# 6. Stable IDs

Important entities must use stable machine identifiers.

Examples:

```text
planning
preparing
recently-arrived
living-in-japan
```

```text
juminhyo
tennyu-todoke
```

```text
engineer-specialist-humanities-international-services
```

Display labels may change without requiring relationships to be rewritten.

IDs should not encode temporary presentation choices.

---

# 7. Controlled Taxonomy

Taxonomy dimensions should be represented explicitly.

Potential domain types:

```ts
JourneyStage
Topic
Audience
GeographicScope
Importance
ContentType
```

Do not use uncontrolled free-form tags as the primary source of product behavior.

Generic tags may exist for miscellaneous discovery purposes.

---

# 8. Residence Status Domain

Residence statuses are first-class domain entities.

Conceptual structure:

```ts
ResidenceStatus {
  id
  englishName
  japaneseName
  description
  purpose
  typicalActivities
  notes
  sourceIds
  lastReviewedAt
  status
}
```

Future additions may include:

- activity categories;
- work considerations;
- side-work considerations;
- renewal;
- family considerations;
- related status IDs.

Do not build a legal eligibility engine during the initial milestone.

---

# 9. Glossary Domain

Glossary entries should be reusable structured entities.

Conceptual structure:

```ts
JapaneseTerm {
  id
  japanese
  kana?
  romaji?
  englishName
  shortDefinition
  detailedExplanation?
  topicIds
  journeyStageIds
  relatedArticleIds
  relatedTermIds
  sourceIds
  lastReviewedAt?
}
```

Not every term requires kanji.

Japanese fields are protected content for future translation purposes.

The Phase 4 implementation keeps glossary records in validated structured data, links them bidirectionally with article metadata, and exposes normalization-based local search through a platform-independent module. Search normalization uses Unicode compatibility normalization and diacritic folding so readers can find terms using Japanese, kana, English, or romaji with or without macrons. Phase 5 may compose this module into broader knowledgebase search without coupling glossary records to the web UI.

Article pages surface their linked vocabulary after the guide body, where it supports review without delaying access to the primary guidance, and enhance glossary links with a shared pronunciation disclosure. Hover and keyboard focus reveal the disclosure on fine-pointer devices; on coarse-pointer devices the first tap reveals it and a second tap follows the glossary link. Residence-status records reference the same glossary entities and expose Japanese, kana, and romaji without duplicating separate definitions.

---

# 10. Source Domain

Sources should be structured entities.

Conceptual structure:

```ts
OfficialSource {
  id
  organization
  title
  url
  authorityLevel
  language
  lastCheckedAt?
}
```

Content references sources by ID.

This establishes the foundation for a future source dependency graph.

---

# 11. Source Dependency Graph

The long-term architecture should allow determining which content depends on a source.

Example:

```text
OfficialSource
   │
   ├── Article A
   ├── Article B
   ├── ResidenceStatus
   └── ChecklistDefinition
```

The initial milestone does not require automated monitoring.

The data model should simply avoid making future dependency tracking unnecessarily difficult.

---

# 12. Article Review State

Possible publication/review states:

```text
draft
verified
needs-review
archived
```

Important dates may include:

```text
createdAt
updatedAt
lastReviewedAt
```

Initial sample content may remain explicitly marked as placeholder or draft.

Sample legal/immigration content must not masquerade as verified production guidance.

---

# 13. Content Relationships

Content should support stable relationships such as:

```ts
relatedArticleIds
prerequisiteArticleIds
nextStepArticleIds
termIds
sourceIds
residenceStatusIds
```

Relationship logic should be modeled separately from article prose.

Browsing groups and guided journeys are also separate domain relationships:

```ts
ArticleGroup {
  id
  articleIds
}

GuidedJourney {
  id
  groupId
  introduction
  routes: Array<{ id, title, articleId }>
  phases: Array<{
    id
    title
    steps: Array<
      | { type: "route-choice" }
      | { articleId, requiredness, conditionLabel?, routeIds? }
    >
  }>
}
```

An article belongs to a reusable subject group independently of whether it appears in one or more journeys. An article may belong to more than one group when it is genuinely foundational. Journey templates separate common phases from explicit route branches. Route selection inserts one alternative at the route-choice position, while route-limited steps prevent resident-only or status-specific procedures from entering an incompatible resolved path. Conditional steps carry their reason instead of appearing as unexplained numbered requirements. Do not duplicate or relabel shared guidance for each audience.

Journey pages resolve the template using an optional stable route ID in the query string. Links from the resolved journey carry both journey and route into article URLs. Articles validate that context against their actual resolved sequence before rendering “Your journey” previous/next navigation and a table of contents. Without valid context, articles remain canonical standalone pages and expose only non-sequential discovery under “Continue exploring.”

The pre-Phase 6 catalog uses purpose-based browse groups rather than reproducing MOFA's administrative visa menu as one flat list. Canonical residence-status records remain separate from visa and program articles: for example, Digital Nomad, working holiday, and J-Find articles all reference the single Designated Activities status, while visa-versus-status guidance explains the legal distinction. This preserves a stable personalization key without hiding the program-specific guidance users search for.

---

# 14. Search Architecture

Initial search should remain lightweight.

The Explore information architecture should be group-first when no query is active: users see high-level content groups and open a group to browse its articles. Search is independent of that presentation hierarchy. A query from Explore must search the underlying FAQ, article, and glossary indexes across all groups and may return individual results directly, even when those records are not displayed on the default Explore landing page.

Potential initial sources:

- static indexed content;
- normalized article metadata;
- structured FAQ questions and search terms;
- glossary metadata;
- structured filtering.

Expose search behind an application-level module or service.

Example conceptual contract:

```ts
search(query, filters)
```

Future dedicated providers might include specialized search engines, but no vendor should be selected now.

Multilingual display does not by itself create multilingual retrieval. Phase 11 should produce locale-specific search documents from translated discovery metadata while retaining canonical content IDs and language-independent taxonomy relationships. Explore, FAQ, Glossary, and onboarding search should query the selected locale first. A canonical-English translation of the query may be used only as a controlled fallback when localized retrieval produces no useful result; this boundary must expose privacy, latency, caching, quota, confidence, and failure behavior instead of hiding a provider call inside UI components.

Search normalization and tokenization must be selected per supported language. The English whitespace-token strategy cannot be assumed for languages without the same word boundaries or morphology. Protected Japanese, kana, romaji, acronyms, and official names remain searchable alongside localized fields, and cross-search handoffs preserve both the locale and the original query.

The local implementation builds this boundary as a platform-independent search module over validated group, FAQ, article, and glossary metadata. FAQ records use ordinary question language and stable relationships to canonical content rather than duplicating substantive guidance. The Explore UI composes query matching with journey-stage, topic, audience, geographic-scope, content-type, importance, and residence-status filters. FAQ results inherit applicable structured filters from their linked articles. With no active query or filter, Explore renders only the reusable article groups; dedicated group routes reveal their articles, while separate journey routes preserve ordered, branch-aware guidance. This keeps discovery independent of the presentation hierarchy and leaves a clear replacement point if a dedicated full-text index becomes necessary.

Active search results use a predictable type hierarchy: matching content groups first, FAQs second, individual guides third, and glossary terms fourth, with alphabetical order inside each section. The UI renders these as separate labeled regions and generates jump links only for non-empty result types. FAQ results use compact contextual links instead of duplicating full content cards. When an Explore text query has no results, its FAQ recovery link carries the query but intentionally omits Explore-only filters. The reciprocal FAQ empty state carries the same wording into Explore's complete catalog search. Residence-status detail pages resolve their related article IDs back to the applicable content groups and guided journeys so the structured status directory does not become a dead end.

Explore search and filter values are serialized into the query string. Result links carry that Explore URL as a constrained return target, allowing browser Back and the explicit Back to Explore control to restore the user's discovery state.

Glossary query and topic state follow the same URL-backed return pattern. Term links carry a constrained Glossary return target, with session-scoped fallback state preserving the search when readers continue through related terms or guides before returning.

Search should eventually support:

- full text;
- structured filters;
- Japanese;
- kana;
- romaji;
- English equivalents;
- normalized romanization.

---

# 15. Anonymous Persistence

Anonymous user preferences should initially be stored locally when appropriate.

Potential data:

```ts
AnonymousPreferences {
  journeyStage?
  preferredLanguage?
  onboardingCompleted?
}
```

Possible later additions:

- locally saved terms;
- locally saved articles;
- local checklist progress.

Local storage access should be abstracted behind a small persistence interface rather than directly scattered throughout components.

The homepage primary CTA should become the entry point to optional journey-stage onboarding when Phase 6 is implemented. Before that phase, it may link to the current student journey as an intentional temporary destination.

The Phase 6 implementation stores a versioned preference record under one browser-local key and validates it before use. The record contains a journey stage plus optional guided-journey, route, and focused-guide IDs. A focused guide may exist without a journey because the article catalog is broader than the mapped routes and lifecycle paths. A root personalization provider owns browser access and exposes typed update operations; domain-level search and recommendation rules remain independent of React and Next.js. Invalid, unavailable, or cleared storage falls back to the complete generic public experience.

Onboarding first asks for one of the four controlled journey stages, then offers searchable guided journeys and explicit route alternatives within a selected journey. Users may remain unsure and save only a stage or skip the flow entirely. Preferences change a small set of homepage and Explore starting points without hiding content or asserting eligibility. Users can change or remove personalization at any time; after removal or a skip, the homepage returns to the same default onboarding invitation.

---

# 16. Optional Authentication

Phase 8 implements the account boundary locally with Supabase Auth. Public informational content does not depend on authentication, and an unavailable account backend must degrade to a clear setup message rather than block the knowledgebase.

Supported provider direction:

- passwordless email;
- Google;
- Apple.

Backend:

- Supabase Auth.

Application UI depends on application-level account services rather than importing the Supabase SDK throughout presentation components. Passwordless email is exercised against local Mailpit. Google and Apple entry points are configuration-gated until credentials and callback origins are available; their production behavior remains part of the hosted-integration gate.

---

# 17. Persistent Sessions

Web authentication uses Supabase SSR cookie storage and the Next.js request proxy to refresh sessions. Server authorization validates signed claims before using an account ID; reading an unverified session object alone is not an authorization decision.

Users should not ordinarily reauthenticate every time the web application or native application launches.

Sessions should be refreshed and validated securely according to current provider/platform guidance.

Explicit logout ends the local signed-in experience. Account deletion also invalidates the current session after deleting the provider identity.

Security-sensitive events may also invalidate sessions.

---

# 18. Future Native Authentication Storage

Native authentication credentials or tokens should use secure platform-appropriate storage.

Bulk offline articles, glossary content, or other nonsensitive application data should not be placed into credential storage.

Exact implementation should follow current Expo and authentication-provider guidance when native development begins.

---

# 19. User Database

Cloud persistence uses PostgreSQL through Supabase. Phase 8 creates only:

```text
profiles
user_preferences
```

The remaining potential user-owned tables belong to later phases:

Potential application tables include:

```text
saved_articles
saved_terms
checklist_progress
reminders
notification_preferences
```

Avoid creating a duplicate authentication-password database.

Authentication identity should remain managed by the authentication provider.

---

# 20. Authorization

Private user tables enable Row Level Security. Authenticated clients receive explicit table privileges, while owner-scoped select, insert, update, and delete policies require `auth.uid()` to equal the row's `user_id`. Anonymous clients receive no access to either table. Database tests exercise policy shape and cross-user isolation.

Public content permissions and private user permissions should be explicitly differentiated.

---

# 21. Minimal Profile

The Phase 8 profile contains only the authentication user ID and an optional display name. Email remains with the authentication provider and is not duplicated in `profiles`. The preference row stores only the existing optional journey-stage, journey, route, focused-guide, and onboarding-completion fields.

Potential later attributes, only when required by a reviewed feature, include:

```text
preferred language
residence status category
broad user situation
prefecture
municipality
notification preferences
```

Most situation fields should be optional.

Sensitive identity-document data should not be collected.

---

# 22. Anonymous-to-Registered Migration

Browser-local personalization remains the immediate offline copy. When a user signs in, an existing cloud preference record becomes the initial account-authoritative value and is copied locally unless the user changed local state while the request was in flight. If the account has no preference record, local data stays local until the user explicitly chooses **Import this device's starting point**.

Architecture should allow:

```text
LocalState
   ↓
Account creation/sign-in
   ↓
Migration/merge
   ↓
CloudState
```

After that initial decision, personalization changes write locally first and synchronize the same validated record to the signed-in account. Users can explicitly import the current device again to replace the cloud copy. Searches, browsing history, and unrelated device-local data are never migrated.

---

# 23. Roadmap Engine

The roadmap engine should be separate from taxonomy.

Taxonomy answers:

**What content applies to which situations?**

Roadmap logic answers:

**Given this user's situation and progress, what should be recommended next?**

Future roadmap rules might operate on:

- stage;
- residence status;
- audience;
- completed tasks;
- arrival timing;
- location.

Do not encode complex recommendation behavior directly inside UI components.

---

# 24. Checklist Architecture

Checklist definitions and user completion state should be separate.

Example:

```text
ChecklistDefinition
- id
- title
- applicability rules
- related articles

UserChecklistProgress
- userId
- checklistId
- status
- completedAt
```

This avoids duplicating checklist definitions for every user.

---

# 25. Translation Architecture

English is canonical.

Future translation flow:

```text
Canonical English Content
       ↓
Translation Service
       ↓
Generated Translation
       ↓
Cache
```

Protected Japanese structures should bypass translation.

Translation should be exposed through an application service rather than directly calling a vendor from arbitrary page components.

Potential conceptual interface:

```ts
translateContent(content, locale)
```

Provider selection is deferred.

Translated search documents should be versioned against the canonical content revision and translation configuration so stale indexes can be invalidated with cached prose. Stable article, FAQ, glossary, group, journey, and taxonomy IDs must never be translated. Query translation is a retrieval fallback, not a source of canonical content and not permission to generate an answer independently of the reviewed guidance.

---

# 26. Notification Architecture

Notification generation and notification delivery should be separate.

Conceptual example:

```ts
NotificationEvent {
  type
  userId
  payload
  createdAt
}
```

Potential event types:

```text
REMINDER_DUE
ARTICLE_CRITICAL_UPDATE
RESIDENCE_STATUS_GUIDANCE_UPDATED
```

Delivery services later decide whether to send:

- email;
- push.

---

# 27. Update Targeting

Structured metadata should eventually allow determining which users opted into an update.

Example:

```text
Article update
Residence status: student
Importance: critical
       ↓
Match eligible subscribed users
       ↓
Notification event
       ↓
Email / push
```

This must respect explicit user communication preferences.

---

# 28. Source Change Monitoring

Future source monitoring may:

1. check authoritative pages for meaningful changes;
2. record that a source changed;
3. identify dependent Nihonest content;
4. flag affected content for review.

It should not:

1. detect a source change;
2. ask an AI to silently rewrite immigration/legal content;
3. automatically publish that rewrite.

Human review remains necessary for critical information.

---

# 29. Native Architecture

Future structure may conceptually become:

```text
Nihonest
├── Web
│   └── Next.js
├── Mobile
│   └── React Native + Expo
└── Shared
    ├── domain
    ├── schemas
    ├── API contracts
    ├── business rules
    └── utilities
```

Do not prematurely create a monorepo simply to anticipate this future state unless there is a clear current benefit.

The initial web repository should nevertheless avoid unnecessary Next.js coupling in reusable logic.

---

# 30. Offline Architecture

Offline native support is deferred.

Potential future offline content:

- saved articles;
- glossary entries;
- roadmap;
- checklist progress;
- emergency information.

Authentication secrets and offline content require different storage strategies.

Exact local database/storage technology is deferred.

---

# 31. SEO and Public Content

The public web application should take advantage of Next.js for discoverable content.

Important public pages should support:

- semantic HTML;
- meaningful metadata;
- stable URLs;
- sensible titles/descriptions;
- accessibility;
- crawlable canonical English content.

SEO should not compromise privacy.

The local public-MVP implementation emits shared metadata, a sitemap covering stable public routes, and an environment-aware robots policy. `NEXT_PUBLIC_SITE_URL` is the explicit public-origin switch: without it, metadata may use a localhost fallback for local builds and robots must disallow indexing; a hosted environment must set the real canonical origin before indexing is enabled.

---

# 32. Accessibility

Accessibility is a core quality requirement.

Expected practices include:

- semantic HTML;
- keyboard navigation;
- sufficient contrast;
- clear focus states;
- meaningful form labels;
- screen-reader-friendly structure;
- accessible dialogs;
- touch-friendly mobile controls;
- reduced-motion consideration where appropriate.

---

# 33. Responsive Design

The application is mobile-first but not mobile-only.

It must work well across:

- phones;
- tablets;
- laptops;
- desktop displays.

Native mobile development should not justify neglecting the mobile web experience.

---

# 34. Testing Strategy

Initial automated testing should focus on useful behavior rather than maximizing test count.

### Unit tests

Appropriate for:

- normalization;
- schemas;
- taxonomy utilities;
- search/filter logic;
- domain rules.

### Component tests

Appropriate for:

- important interactive components;
- filters;
- glossary cards;
- content metadata components.

### End-to-end tests

Playwright should eventually cover critical public flows such as:

- load homepage;
- select journey stage;
- browse category;
- search;
- open glossary entry;
- navigate to an article.

Authentication tests are deferred until authentication exists.

---

# 35. Error Handling

Failures should degrade gracefully.

Examples:

- invalid content metadata should fail clearly during development/build;
- missing entity references should be detectable;
- search with no results should provide useful recovery;
- future translation failure should fall back to canonical English;
- future notification failure should not corrupt reminder state.

---

# 36. Privacy and Security

Security should be proportional to the data Nihonest actually handles.

The strongest initial security decision is to avoid collecting unnecessary sensitive information.

Future private-data systems should use:

- proper authorization;
- secure session handling;
- server-side secret protection;
- input validation;
- least privilege;
- dependency maintenance;
- database policies;
- logging that avoids exposing sensitive data.

---

# 37. Analytics

Analytics provider selection is deferred.

Architecture should not require analytics for core product behavior.

Avoid tightly coupling UI components to a specific analytics vendor.

---

# 38. CMS

A CMS is deferred.

Initial content may live in the repository through MDX and structured data files.

If editorial scale later makes a CMS useful, it should be evaluated based on actual needs.

---

# 39. Deployment

Initial production deployment is expected to use Railway through the connected GitHub repository, but public deployment is deferred until the post-Phase 13 hosted-integration gate.

Phases 7–13 should remain local-first. A hosted integration environment is justified only when the already-implemented feature set needs validation of one or more capabilities that local execution cannot faithfully provide:

- cross-network account and data synchronization;
- production authentication origins or OAuth callbacks;
- scheduled email delivery;
- production secret management and shared translation/TTS caching;
- continuously scheduled source monitoring; or
- native-client access to the shared backend.

The hosted gate must begin in a restricted staging mode. Do not make the site public until:

```text
npm run build
```

passes locally, applicable automated tests pass, migrations and authorization policies are reviewed, rollback and backup procedures exist, cost limits are understood, and the major Phase 13 editorial pass is complete.

Local Supabase or replaceable service boundaries should be used where practical before this gate. Production backend/database, email, translation, monitoring, and public web resources should not be provisioned merely because they appear in the architecture.

---

# 40. Explicitly Deferred Technical Decisions

Do not prematurely select or implement:

- translation provider;
- email provider;
- push provider;
- dedicated search vendor;
- analytics provider;
- CMS;
- native offline database;
- native payment implementation;
- exact app price;
- AI features;
- full municipality dataset;
- automated legal-information rewriting.

These decisions should be revisited when their corresponding roadmap phase begins.

---

# 41. Documentation as Source of Truth

Before significant implementation work, contributors and AI coding tools must read:

- README.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- docs/ROADMAP.md
- docs/CONTENT-GUIDELINES.md
- docs/DECISIONS.md

If implementation conflicts with an established decision, the conflict should be surfaced rather than silently overriding documentation.

Architecture changes should be reflected in documentation.

Significant decisions should be recorded in `docs/DECISIONS.md`.

---

# 42. Git Workflow for AI-Assisted Development

Codex and other coding assistants working on Nihonest must help maintain a clean Git history.

At the completion of a coherent, tested development checkpoint, Codex should explicitly tell the developer:

1. that the current state is an appropriate commit checkpoint;
2. which files/features were completed;
3. which validation/tests should be run before committing;
4. a concise recommended commit message;
5. whether pushing to the remote repository is appropriate.

Codex must not create commits or push automatically unless explicitly instructed by the developer.

Recommended commit style:

```text
type: concise description
```

Examples:

```text
docs: add initial product and architecture specifications
chore: scaffold Next.js application
feat: add structured content taxonomy
feat: add searchable glossary
feat: persist anonymous journey preferences
test: add search and filtering coverage
fix: preserve Japanese terms during content rendering
refactor: separate search service from UI
```

Commits should represent coherent working checkpoints rather than arbitrary numbers of changed files.

The developer should be encouraged to commit after a feature or architectural checkpoint has been tested, not after every minor edit.
