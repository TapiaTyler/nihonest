# DECISIONS.md

# Nihonest — Product and Architecture Decisions

This document records significant decisions and the reasoning behind them.

Future significant product or architecture choices should be appended rather than silently replacing historical decisions.

---

## ADR-001 — Nihonest is public first

**Status:** Accepted

### Decision

The core knowledgebase does not require an account.

### Reason

Reliable information about living in Japan should remain broadly accessible.

Accounts exist for synchronization and user-specific functionality rather than content access.

---

## ADR-002 — Account creation is optional

**Status:** Accepted

### Decision

Users register only when they want persistent cross-device features.

### Expected account features

- synchronized progress;
- saved articles;
- saved glossary terms;
- roadmap;
- reminders;
- preferences.

### Reason

Mandatory registration creates unnecessary friction and contradicts the privacy-minimal product mission.

---

## ADR-003 — Anonymous personalization persists locally

**Status:** Accepted

### Decision

Basic anonymous preferences should be stored locally where appropriate.

Initial examples:

- journey stage;
- onboarding state;
- preferred language.

### Reason

Users should not have to repeatedly answer personalization questions simply because they do not want an account.

---

## ADR-004 — Minimize personal information

**Status:** Accepted

### Decision

Nihonest will request only information necessary for a defined feature.

### Initially excluded data

- passport number/scans;
- residence-card number/scans;
- My Number;
- exact address;
- income;
- employer name;
- date of birth;
- unnecessary telephone numbers;
- immigration-document uploads.

### Reason

Avoiding sensitive data reduces privacy risk, security burden, and user hesitation.

---

## ADR-005 — English is canonical

**Status:** Accepted

### Decision

Canonical editorial content is written and reviewed in English.

### Reason

The primary audience is foreign residents and prospective residents, and maintaining many manually authored language versions would create significant editorial burden.

---

## ADR-006 — Additional languages use future machine translation

**Status:** Accepted in principle; implementation deferred

### Decision

Explanatory prose may eventually be automatically translated.

### Constraints

- English remains canonical;
- generated translations are derivative;
- Japanese instructional terms are preserved;
- translation status is disclosed;
- translations should be cached.

### Provider

Deferred.

---

## ADR-007 — Japanese terminology is structured protected content

**Status:** Accepted

### Decision

Important Japanese words and phrases are represented as reusable glossary/domain entities rather than duplicated text.

### Reason

This supports:

- glossary search;
- consistent definitions;
- article relationships;
- future saved vocabulary;
- protected translation behavior.

---

## ADR-008 — The glossary is a first-class product feature

**Status:** Accepted

### Decision

Nihonest will provide a dedicated searchable glossary, not merely inline article definitions.

### Scope

Japanese needed to navigate life in Japan.

### Non-goal

Building a general-purpose Japanese dictionary or full language-learning platform.

---

## ADR-009 — Use controlled taxonomy

**Status:** Accepted

### Decision

Core metadata uses controlled categories.

### Dimensions

- journey stage;
- topic;
- residence status;
- audience;
- geographic scope;
- importance;
- content type.

### Reason

Structured metadata powers filtering, personalization, recommendations, and notifications more reliably than arbitrary tags.

---

## ADR-010 — Residence statuses are first-class entities

**Status:** Accepted

### Decision

Statuses of residence are modeled as structured domain entities rather than simple article tags.

### Reason

They will eventually connect to:

- articles;
- source records;
- glossary;
- roadmap rules;
- updates;
- search/filtering.

---

## ADR-011 — Taxonomy and recommendation logic are separate

**Status:** Accepted

### Decision

Taxonomy describes applicability.

Roadmap logic decides what an individual user should see or do next.

### Reason

Combining them would make metadata difficult to maintain and would create implicit business logic inside tags.

---

## ADR-012 — Long-form content uses MDX

**Status:** Accepted

### Decision

Use MDX for canonical article prose while structured entities live separately.

### Reason

Nihonest requires content-heavy pages with embedded React-powered elements.

---

## ADR-013 — Structured entities have stable IDs

**Status:** Accepted

### Decision

Relationships use stable IDs rather than display labels.

### Reason

Display wording can evolve without breaking references.

---

## ADR-014 — Sources are structured entities

**Status:** Accepted

### Decision

Official sources should exist as canonical records referenced by content.

### Reason

A URL at the bottom of an article is insufficient for future traceability and source-change review.

---

## ADR-015 — Plan for a source dependency graph

**Status:** Accepted; automation deferred

### Decision

The data model should support knowing which content depends on which official sources.

### Reason

Future source-change monitoring can identify affected content and request human review.

---

## ADR-016 — Critical changes require review

**Status:** Accepted

### Decision

Automation may flag changed sources but should not silently rewrite and publish high-stakes information.

### Reason

Immigration, legal, tax, employment, and administrative guidance requires contextual review.

---

## ADR-017 — Notifications are event based

**Status:** Accepted; implementation deferred

### Decision

Business events and delivery channels are separate.

Examples:

- REMINDER_DUE;
- ARTICLE_CRITICAL_UPDATE;
- RESIDENCE_STATUS_GUIDANCE_UPDATED.

Delivery may later use email or push.

### Reason

This allows web and native applications to share notification logic.

---

## ADR-018 — Authentication email does not equal marketing consent

**Status:** Accepted

### Decision

Using an email address for account authentication does not automatically subscribe the user to optional communications.

### Reason

Communication preferences should be explicit and trustworthy.

---

## ADR-019 — Preferred authentication methods

**Status:** Planned; implementation deferred

### Decision

Preferred future methods:

- passwordless email;
- Google;
- Apple.

Facebook and additional social providers are not planned initially.

---

## ADR-020 — Sessions should persist

**Status:** Planned

### Decision

Signed-in users should not normally be required to authenticate every time they reopen Nihonest.

### Reason

Persistent sessions provide the expected convenience of a modern web/mobile application.

Implementation must follow current platform/provider security guidance.

---

## ADR-021 — Supabase is the planned backend

**Status:** Planned; not yet provisioned

### Direction

- Supabase Auth;
- PostgreSQL;
- Row Level Security for user-owned data.

### Reason

It provides a practical shared backend direction for both Next.js and future React Native clients.

This decision may be revisited if future requirements materially change.

---

## ADR-022 — Do not provision the database prematurely

**Status:** Accepted

### Decision

Do not introduce production backend infrastructure until a feature actually requires persistent cloud data.

### Reason

The initial public knowledgebase can be built and validated without unnecessary infrastructure.

---

## ADR-023 — Shared web/mobile backend

**Status:** Accepted

### Decision

The future website and native applications should use the same account identity and cloud data.

### Reason

Progress and saved content should synchronize across platforms.

---

## ADR-024 — Future native client uses React Native + Expo

**Status:** Accepted; deferred

### Decision

Plan for native iOS/Android development using React Native, Expo, and TypeScript.

### Reason

This preserves React/TypeScript knowledge and enables sharing of non-UI logic.

---

## ADR-025 — Do not prematurely create a monorepo

**Status:** Accepted

### Decision

Keep the initial Next.js project straightforward.

Prepare reusable business logic for future sharing without adding monorepo complexity before a native client exists.

---

## ADR-026 — Native authentication secrets use secure storage

**Status:** Planned

### Decision

Future native authentication material should use appropriate secure platform storage.

Bulk cached content should use a separate storage mechanism.

---

## ADR-027 — Search starts simple

**Status:** Accepted

### Decision

Begin with application-level search/filtering based on structured content.

Abstract search sufficiently to replace the underlying implementation later.

### Deferred providers

- Algolia;
- Typesense;
- Meilisearch;
- other dedicated search services.

No provider has been selected.

---

## ADR-028 — Machine-translation provider is deferred

**Status:** Accepted

### Decision

Do not select a translation provider until translation development begins.

### Reason

Pricing, quality, and provider capabilities can change.

---

## ADR-029 — Email provider is deferred

**Status:** Accepted

### Decision

Select an email-delivery service only when reminders/authentication communication require it.

---

## ADR-030 — Analytics provider is deferred

**Status:** Accepted

### Decision

Use privacy-conscious aggregate analytics eventually, but do not couple the current architecture to a provider.

---

## ADR-031 — CMS is deferred

**Status:** Accepted

### Decision

Initial canonical content lives in repository-controlled MDX/structured data.

Evaluate CMS adoption only when editorial workflow demonstrates a need.

---

## ADR-032 — Mobile application may be paid

**Status:** Accepted in principle

### Decision

The future native application may charge a modest one-time download price.

### Constraint

The web knowledgebase remains freely accessible in desktop and mobile browsers.

### Reason

The native purchase supports development and pays for native convenience rather than access to essential information.

---

## ADR-033 — Native app must provide native value

**Status:** Accepted

### Decision

Do not ship a paid native application that is merely a webview wrapper.

Potential native value:

- offline content;
- push reminders;
- native roadmap;
- saved glossary;
- emergency information;
- native sharing.

---

## ADR-034 — Mobile-first web remains important

**Status:** Accepted

### Decision

The free website must remain highly usable from mobile browsers even after native apps exist.

---

## ADR-035 — Privacy-conscious analytics

**Status:** Accepted in principle

### Decision

Prefer aggregate product analytics and avoid unnecessary advertising trackers or invasive profiling.

---

## ADR-036 — Users should eventually control account data

**Status:** Planned

### Decision

Account functionality should eventually support deletion and potentially export of saved user data.

---

## ADR-037 — Nihonest does not store identity documents initially

**Status:** Accepted

### Decision

Track completion/state rather than storing scans or identifiers.

### Example

Store:

```text
Residence card received = complete
```

Do not store:

```text
Residence card image
Residence card number
```

---

## ADR-038 — Important content distinguishes source type

**Status:** Accepted

### Decision

Nihonest distinguishes:

- official requirement;
- general guidance;
- cultural/practical advice.

---

## ADR-039 — AI output is not evidence

**Status:** Accepted

### Decision

AI may assist editorial work but cannot independently validate high-stakes factual content.

---

## ADR-040 — Git checkpoints are part of the development workflow

**Status:** Accepted

### Decision

Codex should tell the developer when a coherent, tested checkpoint is ready to commit.

At each appropriate checkpoint Codex should provide:

- a short summary;
- recommended validation commands;
- an exact recommended commit message;
- whether pushing is appropriate.

Codex should not commit or push automatically unless explicitly instructed.

---

## ADR-041 — Documentation governs implementation

**Status:** Accepted

### Decision

AI coding sessions must read the repository documentation before significant work.

If implementation conflicts with an accepted architectural decision, the conflict should be surfaced instead of silently overriding the documentation.

---

## ADR-042 — Explore is group-first while search remains article-level

**Status:** Accepted

### Decision

The default Explore page presents high-level content groups. Users select a group to browse its articles on a focused group view.

Search on Explore indexes the complete knowledgebase independently of that browsing hierarchy and can return direct links to individual articles from any group.

Groups and guided journeys are separate structured records. Groups organize canonical subject matter; journeys hold ordered references and may reuse articles from several groups.

The homepage primary CTA becomes the entrance to optional journey-stage onboarding in Phase 6; it does not permanently belong to a single content group.

### Reason

Group-first browsing keeps a growing library understandable, while global article-level search serves users who already know what they need. Separating the homepage CTA from a specific group leaves room for optional personalized discovery without gating public content.

---

## ADR-043 — Journey steps carry route applicability

**Status:** Accepted

### Decision

Guided-journey steps reference canonical articles and declare controlled applicability: all students, Student status, Temporary Visitor, or registered resident. Articles also state their route scope in prose where a mistaken assumption could cause harm.

### Reason

Academic labels such as “short-term study” do not determine immigration status. A Temporary Visitor, a Student-status holder, and a registered mid- to long-term resident encounter different document, municipal, work, banking, and insurance procedures. Structured applicability keeps the sequence reusable for Phase 6 onboarding without copying shared articles.

---

# Future ADRs

Append new decisions using:

```text
## ADR-XXX — Decision name

Status:

Decision:

Reason:

Consequences:
```

Do not renumber historical decisions merely because a decision is superseded.

Instead mark the old decision appropriately and add a new ADR explaining the replacement.
