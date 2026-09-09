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

**Status:** Accepted; foundation implemented

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

Active results are presented as content groups, guides, then glossary terms, alphabetized within each type. Conditional jump links expose only result types present in the current query and filter state.

Groups and guided journeys are separate structured records. Groups organize canonical subject matter; journeys hold ordered references and may reuse articles from several groups.

The homepage primary CTA becomes the entrance to optional journey-stage onboarding in Phase 6; it does not permanently belong to a single content group.

### Reason

Group-first browsing keeps a growing library understandable, while global article-level search serves users who already know what they need. Separating the homepage CTA from a specific group leaves room for optional personalized discovery without gating public content.

---

## ADR-043 — Journey steps carry route applicability

**Status:** Superseded by ADR-044

### Decision

Guided-journey steps reference canonical articles and declare controlled applicability: all students, Student status, Temporary Visitor, or registered resident. Articles also state their route scope in prose where a mistaken assumption could cause harm.

### Reason

Academic labels such as “short-term study” do not determine immigration status. A Temporary Visitor, a Student-status holder, and a registered mid- to long-term resident encounter different document, municipal, work, banking, and insurance procedures. Structured applicability keeps the sequence reusable for Phase 6 onboarding without copying shared articles.

---

## ADR-044 — Visa discovery uses canonical statuses, purpose groups, and typed journey steps

**Status:** Superseded by ADR-046

### Decision

Canonical residence-status records are separate from visa and program articles. Purpose-based Explore groups may reuse foundational articles and may present multiple named programs that share one residence status, such as Designated Activities.

Guided journeys reference a related group and use controlled applicability IDs. Each step is also classified as core, choose-one, or conditional so an ordered journey does not imply that users should complete every alternative visa route.

Unresearched expansion articles use the `draft` status and display a Draft label. Previously researched articles awaiting final editorial verification retain `needs-review` and display Editorial review.

### Reason

MOFA visa categories, legal statuses of residence, and user goals are related but not interchangeable. Keeping them separate supports accurate filtering and future personalization while purpose groups remain understandable to people who do not know the legal category they need. Typed steps provide Phase 6 with enough structure to personalize a journey without duplicating shared arrival guidance.

---

## ADR-045 — Journey-stage personalization remains broad and local

**Status:** Accepted

### Decision

Phase 6 stores one optional journey stage, an optional guided-journey ID, an optional route ID, an optional focused-guide article ID, and onboarding-completion state in a validated, versioned browser-local record. Users can search the established journey model and full article catalog using journey language and the titles of visa, status, or program guides. Selecting a mapped route guide also selects its containing journey and route; a specialized guide may be saved without a journey when no mapped journey currently contains it.

These preferences change a small set of starting-point recommendations on Home and Explore but do not hide public content, assert visa eligibility, or generate a legal checklist.

Users may skip onboarding, change their stage, or remove personalization. Missing, invalid, inaccessible, or cleared browser storage yields the generic public experience.

### Reason

A stage plus optional stable content IDs provides useful route-aware navigation without requesting sensitive details. Keeping search and recommendation rules separate from taxonomy and presentation preserves a path to a future roadmap engine, while explicit limits prevent user-selected navigation preferences from being mistaken for individualized immigration guidance.

---

## ADR-046 — Journey templates resolve explicit route branches into contextual sequences

**Status:** Accepted

### Decision

Guided journeys are modeled as ordered phases rather than flat article arrays. A journey may declare explicit route alternatives and exactly one route-choice position. Selecting a route inserts only that route's canonical article into the resolved sequence; unselected alternatives are not treated as earlier or later steps.

Article steps are either required or conditional. Conditional steps carry a user-facing condition explaining when they may apply. Steps may also be limited to named routes so, for example, resident-registration procedures can remain outside a Temporary Visitor study path.

Journey and route context are carried in article URLs. An article opened within a resolved journey displays a separate “Your journey” section with contextual previous and next guides plus the resolved table of contents. Direct article visits do not infer a journey. “Continue exploring” remains non-sequential discovery for related groups, journeys, and editorial article relationships; it must not derive a next guide from an article's position in every journey containing it.

Browser-local personalization chooses an initial journey and route, but URL context is authoritative during traversal so Back, refresh, and shared links retain the same resolved path.

### Reason

A flat list cannot distinguish route alternatives from sequential work. It caused one professional status—such as Legal / Accounting Services—to identify the next unrelated status—such as Medical Services—as the next journey step. Explicit branches preserve shared preparation and arrival guidance without duplicating whole journeys, while URL-scoped traversal allows one canonical article to participate in multiple journeys with different legitimate neighbors.

### Consequences

- all journeys define named phases;
- routed journeys define stable route IDs and one route-choice step;
- route-specific and conditional steps are validated independently;
- focused journey pages hide unselected alternatives;
- article-level previous and next navigation exists only with valid journey context; and
- adding a route or phase requires resolver and navigation tests, not edits to article prose.

---

## ADR-047 — Public deployment follows the major editorial and hosted-integration gate

**Status:** Accepted

### Decision

Phase 7 establishes local production readiness but does not deploy a continuously hosted public site. Phases 8–12 implement cloud persistence, synchronization, reminders, translation, and monitoring against local infrastructure or replaceable provider boundaries where practical. After Phase 13, a dedicated hosted-integration gate provisions production resources, validates the capabilities that genuinely require a reachable or scheduled environment, and makes the web application public only as its final step.

A restricted staging environment may be created during that gate. Production infrastructure must not be kept active merely to mirror every development push or expose unfinished branches.

### Reason

Responsive UI, search, content modeling, local persistence, editorial work, and most provider abstractions can be built and tested without a public deployment. Cloud synchronization needs a reachable backend; reminders and continuous source monitoring need scheduled execution; and production authentication needs real origins and callbacks. Grouping those validations into one late gate avoids ongoing hosting consumption and deployment churn without pretending the server-dependent features are complete before they are exercised in their real environment.

### Consequences

- Railway public deployment moves from Phase 7 to after Phase 13;
- production Supabase, OAuth, email, translation/TTS, and monitoring resources are provisioned only when required by the hosted gate;
- local completion remains the default for earlier implementation phases;
- server-dependent behavior receives hosted end-to-end validation before public launch; and
- public deployment uses the intended production branch rather than requiring routine branch switching throughout development.

---

## ADR-048 — FAQs are structured discovery bridges, not duplicate canonical answers

**Status:** Accepted

### Decision

Add structured frequently asked questions to the knowledgebase. Each FAQ uses ordinary question language, supports legitimate alternative phrasings for search, and maps to stable IDs for relevant articles, content groups, guided journeys, glossary terms, or residence statuses. The UI may provide a short reviewed orientation followed by compact contextual links; it should not reproduce whole article cards or maintain a second copy of substantive guidance.

Generated questions and high-stakes summaries begin as drafts. Canonical articles and their official sources remain authoritative, and Phase 13 expands and reviews the FAQ catalog alongside the content it references.

### Reason

People often search by a practical question whose wording does not appear in an official title or article summary. A structured FAQ layer adds those user-language retrieval paths and can connect one question to several appropriate resources without weakening the controlled taxonomy or requiring a dedicated search vendor.

### Consequences

- FAQ entries require stable IDs, review state, searchable wording, and validated target relationships;
- FAQ results become a distinct search type without changing the meaning of article, group, glossary, or journey records;
- link validation prevents questions from silently pointing to removed content;
- generated text alone is not evidence for immigration, tax, legal, healthcare, or administrative answers; and
- answer detail stays in canonical sourced content so corrections do not need to be made in multiple places.

---

## ADR-049 — Optional accounts synchronize only explicit, minimal personalization

**Status:** Accepted

### Decision

Phase 8 uses a local Supabase stack to implement passwordless authentication, cookie-backed web sessions, an optional display name, and one owner-scoped preference record matching the existing anonymous-personalization schema. Public content remains usable without Supabase or an account. Google and Apple entry points are provider-ready but configuration-gated until hosted credentials and callback origins can be validated.

On sign-in, an existing cloud preference is initially authoritative and may restore this browser's local preference. A new account does not silently upload anonymous state: the user explicitly chooses **Import this device's starting point**. Subsequent personalization changes update browser storage immediately and attempt to synchronize the same record to the signed-in account. A local change made during an initial cloud read is not overwritten.

Authentication identity stays in Supabase Auth. Private application rows use `auth.users` foreign keys with cascading deletion and owner-only Row Level Security. Export returns authentication context plus all Phase 8 profile and preference rows in readable JSON. Confirmed deletion removes the authentication identity and therefore the dependent rows; it does not silently erase browser-local preferences.

### Reason

Accounts should provide continuity without turning access to public guidance into registration or collecting speculative personal data. Explicit first import avoids surprising users by uploading a device's anonymous choices, while deterministic cloud restoration and local-first subsequent writes keep behavior understandable. Local provider boundaries allow implementation now without provisioning production infrastructure before the hosted-integration gate.

### Consequences

- email used for authentication is not marketing consent;
- no password database or duplicate profile email is created;
- account UI reaches Supabase only through account-service modules;
- Google, Apple, production email delivery, and cross-network behavior require hosted validation after Phase 13; and
- later user-owned tables must add and test their own RLS policies before use.

---

## ADR-050 — Phase 9 user state is local-first, timestamped, and separate from public definitions

**Status:** Accepted

### Decision

Saved articles and glossary terms share a stable application-level record consisting of content kind, canonical content ID, `saved` or `removed` state, and update timestamp. Removal remains represented so an older device cannot silently resurrect content. Anonymous users may save locally. Account import remains explicit, and signed-in state later synchronizes through the same provider boundary established in Phase 8.

Glossary review progress uses only `new`, `learning`, and `reviewed`, plus review count and timestamps. Checklist definitions are public canonical records; user checklist progress is private and uses `not-started`, `in-progress`, and `complete`. Recommendation rules are separate from taxonomy, carry an explanation and priority, and match controlled journey-stage, journey, route, or audience context.

Roadmap resolution retains completed items and their article links, orders incomplete work first, then applies explicit priority and title ordering. Timestamp conflicts choose the newest record; exact-time conflicts prefer removal and then the cloud copy to remain deterministic.

When Phase 9 is complete, the Account page explains synchronization benefits while stating that all public articles remain available without an account. Any landing-page account prompt remains secondary to journey onboarding.

### Reason

Public content definitions should not be copied into each account, and progress must never become an access-control mechanism. A shared save contract avoids duplicate article and glossary implementations. Tombstones and deterministic ordering make later synchronization testable, while a deliberately small glossary state model supports administrative-language review without expanding Nihonest into a general language-learning product.

### Consequences

- local UI and domain behavior can be implemented before starting Supabase;
- saved-content, review, and checklist storage adapters must preserve update timestamps and removals;
- recommendation results must explain their applicability;
- synchronization tests must cover newer records and equal-time removal conflicts; and
- account-benefit promotion is deferred until the promised Phase 9 features actually exist.

---

## ADR-051 — Reminder instants, event generation, and delivery consent remain separate

**Status:** Accepted

### Decision

A reminder records the requested UTC instant, the IANA time zone used for the user's wall-clock choice, a controlled target, and a lifecycle state of `scheduled`, `cancelled`, or `fulfilled`. Nonexistent daylight-saving times are rejected, and repeated times use the earlier occurrence deterministically. Cancellation and fulfillment are mutually exclusive.

When a scheduled reminder becomes due, trusted scheduling code may create a deduplicated notification event and mark the reminder fulfilled. Event generation does not assert successful delivery. Email delivery is evaluated afterward against explicit, independently stored channel and topic preferences, all of which default to off. Authenticated clients can manage only their own preferences and reminders and cannot create notification events directly.

### Reason

Storing an instant prevents a deadline from moving when the user travels or time-zone rules change, while retaining the zone supports accurate presentation. Separating due events from delivery makes retries and future channels possible without regenerating business events. Default-off topic and channel controls preserve the distinction between authentication and optional communication consent.

### Consequences

- local reminder creation must resolve and validate wall-clock time before persistence;
- delivery workers must use deduplication keys and must re-check current preferences before sending;
- a cancelled reminder can never produce a due event;
- a fulfilled reminder may still have a pending or failed delivery; and
- production scheduling and delivery remain disabled until the hosted-integration gate.

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
