# Nihonest — Product Specification

## 1. Product Overview

Nihonest is a public-first knowledgebase and personal companion for foreigners who are preparing to move to Japan, have recently arrived in Japan, or already live in Japan.

Its purpose is to help foreign residents and prospective residents:

- understand their responsibilities in Japan;
- navigate official and administrative procedures;
- find reliable information relevant to their personal situation;
- understand Japanese terminology they are likely to encounter;
- track important tasks and progress;
- discover authoritative sources;
- stay informed when information relevant to them materially changes; and
- integrate into life in Japan legally, responsibly, and confidently.

Nihonest is not intended to replace the Immigration Services Agency of Japan, municipal governments, tax authorities, healthcare professionals, attorneys, administrative scriveners, or other qualified authorities and professionals.

The product should explain official systems and make authoritative information easier to discover and understand without pretending to provide individualized legal determinations.

---

## 2. Product Mission

Nihonest's mission is to help foreign residents and prospective residents understand their responsibilities, navigate official processes, learn the Japanese terminology they will encounter, and participate in Japanese society legally and responsibly.

### Core principle

**Reliable information should not require an account or payment.**

The public knowledgebase should remain freely accessible through normal desktop and mobile web browsers.

Accounts exist to provide continuity, synchronization, personalization, reminders, and other optional user-specific features rather than to gate access to important information.

---

## 3. Target Users

Nihonest is primarily designed for foreigners who:

- are considering moving to Japan;
- are actively preparing to move;
- have recently arrived;
- already live in Japan;
- are students;
- are employees;
- are spouses or dependents;
- may perform freelance or side work;
- are navigating Japanese government procedures;
- need practical information about housing, employment, taxes, healthcare, banking, transportation, and daily life; or
- want to learn important Japanese words and phrases encountered during those processes.

The canonical content language is English.

Future machine translation should make explanatory content accessible in additional languages without requiring separate manually maintained versions of every article.

Japanese terminology remains part of the instructional content and must be preserved rather than translated away.

---

## 4. Product Values

### 4.1 Public first

Users should be able to browse, search, filter, and read the knowledgebase without registration.

The core information experience must not depend on authentication.

### 4.2 Privacy minimalism

Nihonest should collect the minimum amount of information necessary to provide a requested feature.

The product should prefer:

- optional fields over mandatory fields;
- categories over highly specific personal details;
- local device storage where cloud storage is unnecessary;
- user-controlled notification preferences;
- transparent explanations for why information is requested.

### 4.3 Authoritative sourcing

Important immigration, legal, employment, tax, healthcare, and administrative information should be grounded in authoritative sources whenever possible.

The product must distinguish between:

- official requirements;
- general guidance;
- cultural or practical advice.

### 4.4 User control

Personalization should be helpful rather than mandatory.

Users should be able to:

- skip onboarding;
- use the public site anonymously;
- choose whether to create an account;
- choose whether to receive reminders;
- choose whether to receive informational updates;
- delete their account and associated data when account functionality is implemented.

### 4.5 Explain, do not overstate

Nihonest must avoid presenting complicated immigration, employment, legal, tax, or administrative questions as simplistic yes/no conclusions when the underlying rules contain exceptions or depend on individual circumstances.

When appropriate, users should be directed to the relevant official authority or qualified professional.

---

# 5. Core Product Systems

Nihonest is organized conceptually around four interconnected systems.

## 5.1 Knowledgebase

The public knowledgebase provides structured information about living in Japan.

Expected content areas include:

- immigration and statuses of residence;
- employment;
- side work and freelance considerations;
- documents to prepare;
- arrival procedures;
- residence cards;
- address registration;
- My Number;
- health insurance;
- pension;
- taxes;
- banking;
- phones and SIM cards;
- utilities;
- housing;
- transportation;
- driving;
- garbage and municipal rules;
- healthcare;
- emergencies;
- disaster preparedness;
- moving between municipalities;
- residence renewal;
- family considerations;
- cultural etiquette;
- Japanese-language resources;
- everyday administrative procedures.

All core knowledgebase content should be available without an account.

---

## 5.2 Personalized Roadmap

The future personalized roadmap helps users understand which information and tasks are most relevant to their situation.

Possible personalization attributes include:

- journey stage;
- broad status of residence;
- employee/student/spouse/dependent/etc.;
- approximate arrival timing;
- whether the user is bringing family;
- housing situation;
- whether the user intends to drive;
- whether side work or freelance activity is relevant;
- prefecture or municipality where necessary.

The roadmap should be rule-driven rather than manually assembled for every possible user combination.

Personalization should never be presented as a legal determination.

---

## 5.3 Glossary

Nihonest should provide a first-class searchable glossary of important Japanese words and phrases encountered while living in Japan.

Examples include:

- 住民票
- 転入届
- 在留カード
- 市役所
- 区役所
- マイナンバー

Glossary entries may include:

- kanji or normal Japanese representation;
- kana;
- romaji;
- English meaning;
- short definition;
- detailed explanation;
- common context;
- related journey stages;
- related topics;
- related articles;
- related glossary terms;
- source references where appropriate;
- last-reviewed date.

Search should eventually recognize common forms such as:

- Japanese characters;
- kana;
- romaji;
- romanization without macrons;
- English terminology;
- common alternate wording.

The glossary is not intended to become a general Japanese dictionary or full language-learning platform.

Its focus is **Japanese needed to navigate life in Japan**.

---

## 5.4 Alerts and Reminders

Future notification functionality should help users avoid repeatedly checking information manually.

Possible notifications include:

- a user-created reminder becoming due;
- an important article relevant to the user's saved situation being materially updated;
- important guidance affecting a saved residence status changing;
- a requested deadline approaching.

Notifications should be opt-in where appropriate.

Authentication email addresses must not automatically be treated as consent for newsletters or promotional communications.

---

# 6. Journey Stages

Nihonest should support a controlled set of journey stages.

Initial stages:

1. **Planning**
   - researching whether and how to move to Japan;

2. **Preparing**
   - actively arranging relocation;

3. **Recently Arrived**
   - completing initial procedures after arrival;

4. **Living in Japan**
   - established in Japan and managing ongoing responsibilities.

Journey stages are used for:

- filtering;
- recommendations;
- roadmap generation;
- article metadata;
- glossary relevance;
- optional notifications.

Users may skip choosing a stage.

---

# 7. Anonymous User Experience

Anonymous use is a primary supported experience, not a temporary fallback.

Anonymous users should eventually be able to:

- browse all public articles;
- search;
- filter;
- use the glossary;
- choose a journey stage;
- select a display/translation language;
- receive basic personalization;
- potentially save limited progress locally.

Lightweight anonymous preferences should be stored locally in the browser when practical.

Examples:

- journey stage;
- onboarding completion;
- language preference;
- local temporary progress.

Users should not be repeatedly asked for the same preference on every visit when the browser can safely remember it.

Users must still be able to change or clear these preferences.

Anonymous data is device/browser-specific and may disappear if browser storage is cleared.

---

# 8. Account Experience

Accounts are optional.

An account exists primarily to unlock synchronization and persistent cloud features.

Potential account benefits include:

- synchronization across devices;
- persistent roadmap progress;
- saved articles;
- saved glossary terms;
- saved preferences;
- reminders;
- notification preferences;
- future native-app synchronization.

Account creation should be presented as a convenience, for example:

**Save your progress across devices**

rather than:

**Create an account to continue**

The public knowledgebase must remain usable without registration.

---

# 9. Authentication Direction

Authentication is deferred from the initial milestone but should be architected for.

Preferred future sign-in methods:

- passwordless email;
- Google;
- Apple.

Facebook and additional social providers are not currently planned.

The purpose is to provide a convenient authentication experience without requiring users to create another password.

Sessions should normally persist so users do not need to sign in every time they open the website or native application.

Authentication implementation must follow current security guidance at the time it is built.

---

# 10. Anonymous-to-Account Migration

When accounts are implemented, Nihonest should support converting useful local anonymous state into synchronized account state.

Possible migration data:

- journey stage;
- checklist progress;
- language preference;
- locally saved articles;
- locally saved glossary terms.

The user should understand what will be saved.

After migration, cloud data becomes the authoritative synchronized state for signed-in experiences.

---

# 11. Personal Information Policy

Nihonest should avoid collecting sensitive personal information unless a future feature provides an exceptional justification and the decision is explicitly reviewed.

The initial product should not request or store:

- passport numbers;
- passport scans;
- residence card numbers;
- residence card scans;
- My Number;
- My Number card scans;
- exact home address;
- income;
- employer name;
- date of birth;
- unnecessary phone numbers;
- immigration document uploads.

Instead of storing a document, Nihonest may track that a task was completed.

Example:

**Residence card received: Complete**

rather than storing a photograph of the user's residence card.

---

# 12. Structured Taxonomy

Nihonest should use controlled structured metadata rather than arbitrary blog-style tags for important dimensions.

Primary taxonomy dimensions include:

### Journey stage
Examples:
- planning
- preparing
- recently-arrived
- living-in-japan

### Topic
Examples:
- immigration
- employment
- taxes
- housing
- healthcare
- banking
- municipal-procedures
- transportation
- language
- daily-life

### Residence status
Handled as first-class domain entities rather than merely free-form tags.

### Audience or situation
Examples:
- employee
- student
- spouse
- dependent
- parent
- freelancer
- business-owner

### Geographic scope
Examples:
- national
- prefectural
- municipal

### Importance
Examples:
- informational
- recommended
- important
- critical

### Content type
Examples:
- guide
- reference
- checklist
- glossary
- official-procedure

A small generic tag system may exist for miscellaneous concepts, but core product behavior should rely on controlled structured fields.

---

# 13. Residence Status Explorer

Statuses of residence should be first-class structured entities.

The future explorer may provide:

- official English name;
- Japanese name;
- purpose;
- typical permitted activities;
- examples;
- relevant restrictions;
- job-change considerations;
- side-work considerations;
- renewal information;
- family considerations;
- related articles;
- official sources;
- last-reviewed date.

The system should avoid reducing complicated questions to an oversimplified statement such as:

**This job is legal for you.**

Instead, it should explain the applicable rules, identify what must be checked, and link to authoritative information.

---

# 14. "Can I Do This?" Exploration

A future feature may allow users to investigate how a proposed activity relates to a status of residence or other rules.

This is an educational cross-reference system, not an individualized legal decision engine.

It should surface:

- relevant statuses;
- related official rules;
- important exceptions;
- questions the user should verify;
- authoritative sources.

---

# 15. Search and Discovery

The default Explore experience should present high-level content groups rather than a flat list of every article. Selecting a group opens a focused view of the articles belonging to it.

Search remains available from Explore and operates across the complete knowledgebase. Search results may reveal and link directly to individual articles from any group without requiring the user to browse into that group first.

Search should eventually combine:

- full-text matching;
- glossary lookup;
- structured frequently asked questions written in ordinary user language;
- controlled taxonomy;
- structured filters.

FAQ entries should act as reviewed discovery bridges rather than duplicate articles. A question may contain a concise orientation and searchable alternative wording, then link directly to the relevant canonical articles, groups, journeys, glossary terms, or residence statuses. High-stakes generated questions or answer summaries remain drafts until reviewed, and the linked sourced guidance remains authoritative.

Potential filters include:

- journey stage;
- topic;
- residence status;
- audience;
- geographic scope;
- content type;
- importance.

The initial architecture should expose search through an abstraction so a dedicated search provider can be adopted later without rewriting the entire application.

A dedicated external search platform is explicitly deferred.

---

# 16. Content Relationships

Articles and structured entities should support meaningful relationships.

Relationship types may include:

- related;
- prerequisite;
- next step;
- glossary terms;
- residence statuses;
- official sources.

Example:

Registering Your Address

- prerequisite: receive residence card where applicable;
- related: My Number;
- next step: health insurance enrollment;
- glossary: 転入届, 住民票, 市役所.

These relationships should eventually help power roadmap recommendations.

---

# 17. Source Traceability

Important content should link to its authoritative sources as structured data.

A source is not merely a URL displayed at the bottom of an article.

Nihonest should eventually know which content depends on which source.

Conceptually:

Official Source  
→ Article  
→ Residence Status  
→ Checklist Item

If a source changes, dependent content can eventually be flagged for human review.

Machine automation must not silently rewrite critical guidance solely because an external page changed.

---

# 18. Source Status and Review

Content may eventually support states such as:

- draft;
- verified;
- needs-review;
- archived.

Important content should support metadata such as:

- created date;
- updated date;
- last reviewed date;
- source references;
- review status.

A future administrative/editorial workflow should surface content that may be stale.

---

# 19. Translation

English is the canonical editorial language.

Future automated translation may translate explanatory prose into additional languages.

Japanese instructional terminology must remain protected.

For example:

**住民票 / じゅうみんひょう / jūminhyō**

must not be transformed into another language by the translation pipeline.

Its English explanation may be translated.

Translated pages should clearly identify that:

- the canonical version is English;
- the displayed content may be machine translated;
- Japanese terms and official names have intentionally been preserved.

Generated translations should eventually be cached to avoid unnecessary repeated API usage.

The translation provider is intentionally deferred.

---

# 20. Notifications

Notification logic should be event-based and independent from the delivery channel.

Possible events include:

- REMINDER_DUE
- ARTICLE_CRITICAL_UPDATE
- RESIDENCE_STATUS_GUIDANCE_UPDATED

Delivery channels may eventually include:

- email;
- native push notification.

This separation allows the website and future mobile applications to share notification logic.

Users should control optional notification categories.

---

# 21. Email Preferences

Future notification preferences may include:

- required account/security messages;
- requested reminders;
- critical updates relevant to the saved journey;
- updates affecting a saved residence status;
- new article announcements;
- product news.

Promotional or general informational messages should not be inferred from the existence of an authentication email address.

---

# 22. Native Applications

The initial product is web-first.

Future native applications are expected to use React Native with Expo for iOS and Android.

The native applications should share:

- account identity;
- backend;
- database;
- domain models where practical;
- validation;
- API contracts;
- business rules.

Potential native-specific benefits include:

- push notifications;
- offline saved articles;
- offline glossary access;
- offline roadmap/checklist;
- emergency information;
- native sharing;
- more convenient mobile navigation.

The Next.js application itself will not be converted directly into a React Native application.

The architecture should instead maximize reuse of platform-independent logic.

---

# 23. Monetization Philosophy

The web knowledgebase should remain free.

A future native application may be sold for a small one-time purchase price.

The intended message is:

**Nihonest's information remains freely available on the web. Purchasing the native app supports continued development and provides additional native convenience.**

Important immigration, legal, administrative, or integration-related information should not be placed behind an app purchase merely to force monetization.

The native application should provide meaningful convenience beyond being a simple wrapper around the website.

Exact pricing is deferred.

---

# 24. Analytics Philosophy

Analytics should support product improvement without undermining the privacy-minimal product philosophy.

Useful aggregate information may include:

- popular content;
- searches returning no useful results;
- broad device categories;
- general traffic patterns;
- high-level feature usage.

Nihonest should avoid unnecessary invasive profiling or advertising trackers.

The analytics provider is deferred.

---

# 25. Account Data Rights

When accounts are implemented, users should eventually be able to:

- review relevant stored preferences;
- change notification preferences;
- delete their account and associated personal application data;
- potentially export their saved progress and preferences.

Implementation details are deferred until authentication and persistence are developed.

---

# 26. Initial Web Experience

The initial website should emphasize:

- mobile-first usability;
- clear navigation;
- approachable information architecture;
- strong search/discovery;
- trust;
- source transparency;
- optional personalization.

The landing page may invite users to select where they are in their journey.

This should preferably be an integrated, optional experience rather than an intrusive mandatory modal.

Users who skip personalization receive the generic knowledgebase experience.

---

# 27. Product Navigation Direction

Exact navigation is subject to UX iteration, but likely primary destinations include:

- Home
- Explore
- Glossary
- Roadmap
- Saved

Roadmap and Saved may initially be placeholders or omitted until their corresponding features exist.

Navigation should not imply that an account is necessary for public knowledgebase functionality.

---

# 28. Out of Scope for Initial Milestone

The initial milestone should not implement:

- production authentication;
- production user database;
- Google login;
- Apple login;
- passwordless email login;
- email delivery;
- native push notifications;
- React Native applications;
- payments;
- translation API integration;
- dedicated search service;
- complete municipality coverage;
- source-change automation;
- AI legal analysis;
- document uploads;
- advanced analytics;
- CMS;
- complete personalized roadmap;
- full notification infrastructure.

These remain part of the planned product direction and must not be forgotten or architecturally blocked without good reason.

---

# 29. Product Success

Nihonest succeeds when a user can quickly answer:

- What do I need to know?
- What applies to my situation?
- What should I do next?
- What does this Japanese term mean?
- Where did this information come from?
- Has this guidance been reviewed recently?

The product should feel like a trustworthy companion for navigating life in Japan rather than merely a collection of articles.
