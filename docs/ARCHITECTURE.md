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

---

# 14. Search Architecture

Initial search should remain lightweight.

Potential initial sources:

- static indexed content;
- normalized article metadata;
- glossary metadata;
- structured filtering.

Expose search behind an application-level module or service.

Example conceptual contract:

```ts
search(query, filters)
```

Future dedicated providers might include specialized search engines, but no vendor should be selected now.

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

---

# 16. Future Authentication

Authentication is deferred.

Planned provider direction:

- passwordless email;
- Google;
- Apple.

Planned backend direction:

- Supabase Auth.

Application UI should depend on application-level authentication state/interfaces rather than tightly coupling every component to Supabase SDK calls.

---

# 17. Persistent Sessions

Future authentication should provide a normal modern persistent-session experience.

Users should not ordinarily reauthenticate every time the web application or native application launches.

Sessions should be refreshed and validated securely according to current provider/platform guidance.

Explicit logout should end the local signed-in experience.

Security-sensitive events may also invalidate sessions.

---

# 18. Future Native Authentication Storage

Native authentication credentials or tokens should use secure platform-appropriate storage.

Bulk offline articles, glossary content, or other nonsensitive application data should not be placed into credential storage.

Exact implementation should follow current Expo and authentication-provider guidance when native development begins.

---

# 19. Future User Database

Cloud persistence is expected to use PostgreSQL through Supabase.

Potential application tables include:

```text
profiles
user_preferences
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

When private cloud data is introduced, access controls must ensure users can access only records they are authorized to access.

For Supabase/PostgreSQL, Row Level Security should be part of the design for user-owned tables.

Public content permissions and private user permissions should be explicitly differentiated.

---

# 21. Minimal Profile

The future user profile should contain only information needed for features.

Potential attributes:

```text
auth user ID
email via auth provider
journey stage
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

Local anonymous state should eventually be migratable into a user account.

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

Conflicts should eventually have deterministic behavior.

The detailed merge strategy is deferred.

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

Initial production deployment is expected to use Railway through the connected GitHub repository.

Do not configure production deployment until:

```text
npm run build
```

passes locally.

Backend/database deployment should not be provisioned until needed.

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