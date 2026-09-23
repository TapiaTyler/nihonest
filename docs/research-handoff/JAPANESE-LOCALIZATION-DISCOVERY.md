# Japanese localization discovery brief

Use this brief with ordinary ChatGPT web as a second linguistic perspective for Nihonest's Japanese localization. Answer directly in the chat using the Markdown structure at the end. Do not create a downloadable file, JSON artifact, canvas, spreadsheet, or Work task.

This is a terminology and language-discovery exercise. It is not a request to translate the article catalog, research Japanese law, or design application architecture.

## Product context

Nihonest is a mobile-first public guidance application for people planning to enter, move to, study, work, or live in Japan. It explains immigration, residence, employment, tax, municipal, housing, healthcare, transportation, education, and daily-life processes while directing readers to responsible authorities.

Nihonest provides general educational information, not individualized legal, immigration, tax, medical, or financial advice. All public guidance remains available without an account.

Readers may be:

- foreigners who prefer Japanese;
- Japanese-speaking friends, partners, employers, school staff, or other supporters helping a foreign resident;
- people with limited knowledge of Japanese government and immigration systems; or
- people who can search in Japanese but still need unfamiliar administrative concepts explained.

Do not assume Japanese readers already understand immigration law merely because they understand Japanese.

## Canonical and editorial rules

English is the canonical editorial language. Japanese is a derivative localization and must not silently change the meaning of the English guidance.

AI-generated translations remain labeled as machine translated until an independent qualified reviewer approves the exact translation revision. A translated source being fluent does not make it reviewed or authoritative.

Nihonest must continue to distinguish:

- a consular visa from a status of residence;
- a Certificate of Eligibility from a visa or landing permission;
- immigration permission from an employment contract or professional licence;
- national rules from prefectural or municipal procedures;
- legal requirements from employer, school, provider, or common-practice requirements; and
- general educational routing from an individualized eligibility determination.

High-risk wording includes immigration, permitted activity, employment authorization, side work, taxes, healthcare, deadlines, periods of stay, renewal limits, fees, evidence requirements, and transitions after a change of circumstances.

## Existing localization decisions

Japanese is the first localization target. The initial technical pilot translated two representative articles, but the complete catalog and interface have not been localized.

Translations are generated offline and stored as version-controlled repository artifacts. Page requests do not call an AI or translation provider. Every artifact is tied to:

- the stable content identity;
- the canonical-English revision;
- the protected-terminology revision;
- the translation-prompt revision;
- the target locale;
- the generator and model; and
- its machine-translated or human-reviewed state.

An outdated artifact is marked stale and excluded from rendering and localized search. Missing, malformed, incomplete, or stale translations fall back to canonical English.

The interface must not present a partially translated locale as complete.

## Protected content

Japanese terminology already embedded in canonical guidance is protected. Translation must not casually replace, translate back into a different expression, remove, duplicate, or romanize protected text.

Protected material can include:

- official Japanese names;
- Japanese legal and administrative terms;
- document and form names;
- glossary terms;
- kana readings;
- romaji;
- acronyms;
- proper names; and
- placeholders used to restore protected terminology after generation.

Translations should explain an unfamiliar official term without pretending that a convenient paraphrase is the official name. Where useful, retain the official Japanese term and add a clear explanation.

## Language and accessibility requirements

The Japanese should be understandable, calm, and respectful without sounding like a government notice or making the guidance more definitive than the English source.

Consider:

- standard Japanese versus Easy Japanese (やさしい日本語);
- when furigana, kana, or an inline explanation would help;
- sentence length and information density on mobile screens;
- clear link and button labels outside their surrounding visual context;
- dates, time, currency, numbers, punctuation, and Latin abbreviations;
- screen-reader pronunciation and language boundaries;
- text expansion or contraction in buttons, filters, cards, and navigation; and
- wording that distinguishes machine translation from official translation.

Do not assume that replacing every difficult word with Easy Japanese is safe. Some official and legal distinctions may require retaining the precise term and explaining it.

## Search and retrieval context

Nihonest uses locale-specific prebuilt search indexes. Japanese users should be able to find the same stable content through ordinary Japanese wording even when they do not know the official term.

Useful retrieval variants may include:

- official kanji;
- kana spellings;
- common abbreviations;
- loanwords;
- spacing and script variants;
- ordinary questions;
- common but technically imprecise wording that should route to an explanatory comparison; and
- terms used by employers, schools, municipalities, or foreign residents in everyday conversation.

Search aliases improve discovery only. They must not imply that an occupation, activity, or personal situation legally qualifies for a specific residence status.

Arbitrary live query translation is not part of this task. Recommend vocabulary for deterministic localized indexes, not an AI search-answer system.

## Phase objective

The broader localization rollout will eventually:

- translate current canonical content through the protected, revision-addressed workflow;
- localize relevant interface and structured metadata;
- generate Japanese search documents;
- preserve translated links, filters, sorting, search handoffs, and English fallback;
- report translation coverage honestly;
- review responsive layout and multilingual accessibility; and
- require deliberate review before high-risk translations can be treated as reviewed.

This discovery pass should help establish the language rules and vocabulary before bulk generation begins.

## Terms and interface areas to examine

Consider at least these recurring labels and concepts. Do not translate a label mechanically if a different Japanese label would communicate its product function more clearly.

### Primary navigation and account

- Home
- Explore
- Journey
- My Journey
- Roadmap
- Resources
- Saved
- Reminders
- Account
- Login
- Logout

### Discovery and personalization

- Find my starting point
- Adjust my starting point
- Save my starting point
- Change route
- Guided journey
- Journey phase
- Journey stage
- Focused route
- Next action
- Continue in My Journey
- Search every guide and term
- More filters
- Browse all groups
- No matching guidance found

### Content and editorial state

- Guide
- Content group
- Frequently asked questions / FAQ
- Glossary
- Residence status / Statuses
- Key Japanese terminology
- Official sources
- Continue exploring
- Related guidance
- Read guide
- View term and context
- View status and related guidance
- Draft
- Editorial review / Needs review
- Verified
- Last checked

### Saved content and progress

- Save / Saved
- Removed from saved list
- Not started
- In progress
- Complete
- New
- Learning
- Reviewed
- Glossary review
- Set reminder
- Scheduled reminders

### Localization notices

- Guide language
- Machine translated
- Automatically translated
- Canonical English
- This guide is not yet available in the selected language
- Return to English
- This is not an official translation

## Requested analysis

Provide a bounded recommendation covering:

1. The overall Japanese register and tone.
2. Whether Nihonest should offer standard Japanese, Easy Japanese, or a carefully defined hybrid for the initial rollout.
3. Recommended translations for the recurring interface and editorial labels above.
4. Terms where the best label depends on context or where a literal translation would mislead.
5. A starter retrieval vocabulary for the following domains:
   - immigration and residence;
   - employment and side work;
   - study and schools;
   - municipal procedures and documents;
   - taxes and social insurance;
   - healthcare;
   - housing, banking, and utilities;
   - transportation and emergencies; and
   - daily life and local support.
6. Wording that should be protected or escalated for human review.
7. Mobile-layout and accessibility risks created by Japanese localization.
8. Questions that Nihonest must decide before bulk translation.

Prefer a smaller set of well-reasoned recommendations over an exhaustive translation dictionary. Flag uncertainty rather than inventing one universal answer.

## Boundaries

- Do not translate full articles.
- Do not research or summarize current laws, fees, eligibility rules, or procedures.
- Do not decide whether a person qualifies for a visa or status.
- Do not propose a CMS, database migration, runtime translation provider, or AI answer engine.
- Do not claim that a translation is human reviewed.
- Do not treat Japanese government wording as automatically plain, accessible, or appropriate for a button label.
- Do not output JSON or create a downloadable artifact.
- Do not repeat this brief in the response.

## Response format

Answer directly in the chat using the following Markdown headings.

### 1. Recommended language direction

Give concise recommendations for register, politeness, standard versus Easy Japanese, official terms, and explanatory wording.

### 2. Interface terminology recommendations

Use a Markdown table with these columns:

| English label | Recommended Japanese | Alternative or contextual variant | Reason and risk |

If the complete label list would make the response unreliable, prioritize ambiguous, high-frequency, and high-consequence labels and identify what remains.

### 3. Japanese search vocabulary

Group suggestions by domain. For every concept, provide:

- the English concept;
- the official or preferred Japanese expression;
- useful kanji, kana, abbreviation, loanword, or ordinary-question variants; and
- a short warning when an imprecise query should route to a comparison rather than a direct answer.

### 4. Protected and high-risk wording

List terms or patterns that should be preserved, explained, or separately reviewed.

### 5. Mobile and accessibility considerations

List specific Japanese-language risks for controls, cards, navigation, reading aids, and screen readers.

### 6. Decisions still needed

List only questions that materially affect the localization workflow or user experience.

### 7. Suggested first review batch

Recommend one small, representative set of interface labels and content/search concepts for a human Japanese-language review before catalog-wide generation. Explain why that set is representative.
