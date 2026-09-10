# CONTENT-GUIDELINES.md

# Nihonest — Content and Editorial Guidelines

## 1. Purpose

Nihonest covers subjects where inaccurate or stale information can create significant problems for users.

These guidelines apply to articles, glossary entries, residence-status records, checklists, summaries, translated content, and future notifications.

---

## 2. Content Categories

Every substantive piece of guidance should distinguish between the following categories when relevant.

### Official Requirement

A rule, procedure, obligation, deadline, eligibility condition, or other requirement supported by an authoritative source.

Examples include information from:

- Japanese national government agencies;
- official municipal governments;
- official prefectural governments;
- official tax authorities;
- official public insurance/pension institutions.

### General Guidance

An explanation intended to help users understand or navigate a process.

General guidance may summarize practical implications but must not be presented as an official rule when it is not one.

### Cultural or Practical Advice

Common practices, etiquette, expectations, or practical recommendations.

These must not be confused with legal requirements.

---

## 3. Source Priority

Prefer sources in approximately this order:

1. authoritative Japanese government or public institution;
2. official prefectural or municipal government;
3. official organization responsible for the relevant system;
4. authoritative professional or institutional secondary source;
5. reputable secondary explanation where primary material is unavailable or insufficient.

Blogs, discussion forums, social media, and AI-generated text are not sufficient evidence for important legal, immigration, tax, employment, healthcare, or administrative claims.

They may occasionally identify questions that should then be verified against authoritative sources.

---

## 4. Canonical Content

English is the canonical editorial language.

All reviewed factual meaning should originate in the canonical version.

Future translated versions are derivatives and must not independently become the authoritative record.

---

## 5. Japanese Terminology

Japanese terms are structured instructional content.

Where useful, glossary entries should provide:

- Japanese form;
- kana;
- romaji;
- English equivalent;
- explanation;
- usage/context.

Example:

```text
住民票
じゅうみんひょう
jūminhyō
Certificate of Residence
```

Japanese terms should not be automatically replaced when surrounding prose is machine translated.

When an article links a glossary term, introduce the Japanese term naturally in the article body alongside a clear English equivalent wherever it can genuinely help the reader. Do not list unrelated terms merely because they concern the same broad subject.

Keep the consolidated Key Japanese terminology section after the main guidance so terminology supports rather than blocks the task explanation. Inline term interactions may expose kana and romaji, but the prose must remain understandable without hovering, tapping, opening a tooltip, or visiting the glossary.

---

## 6. Machine Translation

Machine translation uses a limited Codex-assisted Phase 11 pilot before catalog-wide generation after the Phase 13 canonical-English review. Codex-generated output remains machine translated; Codex must not confer human-reviewed status on its own translation.

When implemented:

- canonical English remains authoritative;
- Japanese terminology is protected;
- generated translations should be clearly identified;
- translation errors must not alter canonical content;
- translation failures should fall back to English;
- important official names should be preserved appropriately;
- translations should be cached where practical.
- cache currency must be determined from canonical source and protected-terminology revisions rather than dates alone;
- incomplete locale coverage must not be presented as a complete translation;
- high-risk machine translations require deliberate review before receiving a reviewed state.

A future notice may read:

> Automatically translated. This page was originally written and reviewed in English. Japanese terms and official document names are preserved.

---

## 7. High-Stakes Content

Use additional care for:

- immigration;
- status of residence;
- permitted employment;
- side work;
- taxes;
- healthcare;
- insurance;
- pension;
- legal obligations;
- deadlines;
- government procedures.

Avoid statements that imply individualized professional advice.

Prefer language that explains:

- the general rule;
- known exceptions;
- what circumstances matter;
- what the user should verify;
- which authority can provide definitive guidance.

---

## 8. Residence-Status Content

Clearly distinguish among:

- an entry visa issued by a Japanese diplomatic mission;
- landing permission and the period of stay granted at entry; and
- the status of residence governing activities or position in Japan.

Do not use “visa” as a casual substitute where that would obscure one of these distinctions.

For each visa, status, or named program, research and explain where applicable:

- available periods of stay and any separate visa-entry validity;
- whether extension is possible, the practical and legal limits on renewal, and when a change of status may be required;
- the authorized activity, relationship, or position;
- representative occupations and job titles supported by current official definitions and examples;
- adjacent occupations or duties that may fall elsewhere;
- education, experience, remuneration, sponsoring-organization, licensing, program, or field-specific conditions; and
- relevant transition, notification, and outside-activity-permission issues.

Occupation lists should be as useful and comprehensive as authoritative sources permit, but must not imply that a job title alone establishes eligibility. Describe the actual duties that control classification. For example, coverage of Engineer / Specialist in Humanities / International Services should explicitly discuss software developers and software engineers rather than relying only on the generic word “engineering.”

Do not label a user's proposed job or activity simply:

```text
LEGAL
```

or:

```text
ILLEGAL
```

unless the rule is genuinely unequivocal and appropriately sourced.

Prefer:

- permitted activities commonly associated with the status;
- activities requiring additional consideration;
- possible outside-activity permission issues;
- circumstances requiring verification;
- official sources.

Keep immigration authorization separate from employment-contract rules, professional licensing, tax treatment, social insurance, and local regulation. Permission or compliance in one area does not establish permission or compliance in the others.

---

## 9. Source Metadata

Critical content should eventually record:

```text
source ID
source organization
official URL
last reviewed
review status
```

Source references should be structured rather than existing only as prose links.

---

## 10. Review Metadata

Important content should support:

- created date;
- updated date;
- last reviewed date;
- status.

Possible statuses:

- draft;
- verified;
- needs-review;
- archived.

A recently modified article is not necessarily recently verified.

`updatedAt` and `lastReviewedAt` have different meanings.

---

## 11. Placeholder Content

Development samples must be clearly identifiable as examples or drafts.

Do not fabricate realistic-looking legal guidance merely to make a prototype appear complete.

It is preferable to use obviously limited sample content than misleading pseudo-authoritative information.

---

## 12. Changes to Official Sources

Future automation may identify that an official source has changed.

A detected source change should:

1. flag affected content;
2. identify dependencies;
3. request review.

It should not automatically publish AI-generated changes to critical content without review.

---

## 13. Article Structure

Where appropriate, articles should help users answer:

- What is this?
- Who does it apply to?
- When does it matter?
- What should I prepare?
- What should I do?
- What Japanese terms will I encounter?
- What happens next?
- Which official sources support this information?
- When was this information last reviewed?

Not every article must mechanically contain every heading.

For route-specific immigration articles, period of stay, extension or transition limits, covered activities, representative occupations, exclusions, and evidence should be easy to locate even when the precise heading structure varies.

Journey order belongs to structured journey data rather than being hard-coded into canonical article prose. When an article is opened with valid journey context, previous and next steps must come from that resolved route. Generic “Continue exploring” links are non-sequential discovery and must not be presented as mandatory next steps.

---

## 14. Article Metadata

Potential metadata includes:

```text
ID
title
description
slug
journey stages
topics
residence statuses
audiences
geographic scope
importance
content type
glossary terms
sources
relationships
review state
last reviewed date
```

Metadata values must use controlled IDs where applicable.

---

## 15. Geographic Differences

National requirements should not be presented as municipality-specific instructions when procedures differ locally.

When appropriate, content should distinguish:

- national rule;
- prefectural variation;
- municipal implementation.

Initial municipality coverage may intentionally be limited.

Do not pretend to provide exhaustive municipality-specific instructions before that data exists.

Shared resident procedures—such as address registration, My Number, public health insurance, and pension—should remain reusable guidance rather than being duplicated as though they belong only to a Student or work-status journey. Each article and conditional journey step must state the residence, age, coverage, municipal, or other facts controlling applicability.

Temporary Visitor and other short-stay guidance must be kept distinct from procedures that depend on mid- or long-term residence. Student-oriented content must say whether it applies to short-term study as a visitor, study under Student status, or both.

---

## 16. Glossary Quality

Glossary definitions should emphasize real-world usefulness.

Useful information may include:

- what the word means;
- where the user will see/hear it;
- why it matters;
- related procedures;
- related vocabulary;
- relevant articles.

The glossary should not attempt to replace a general Japanese dictionary.

---

## 17. Search Synonyms

Glossary/search metadata may include legitimate alternative terms.

Example:

```text
住民票
じゅうみんひょう
jūminhyō
juminhyo
certificate of residence
residence certificate
```

Do not create misleading synonyms merely to increase search matches.

For translated search, locale-specific aliases should reflect wording people genuinely use in that language. Do not blindly machine-translate English keywords when the result is unnatural, ambiguous, or changes the legal or administrative meaning. Protected official names, Japanese, kana, romaji, and common acronyms should remain available alongside localized terms.

---

## 18. FAQ Quality

FAQs are discovery bridges written in ordinary user language. They should help a reader recognize the right next resource without becoming a second, independently maintained version of an article.

Each FAQ should:

- ask one recognizable practical question;
- include only a concise orientation that remains accurate across its linked resources;
- link through stable relationships to the relevant canonical articles, groups, journeys, glossary terms, or residence statuses;
- use alternative phrasings only when real users could reasonably ask the same question that way;
- avoid implying eligibility, certainty, or individualized legal advice; and
- remain a draft until its wording, applicability, and target relationships have been reviewed.

High-stakes details belong in sourced canonical guidance. If answering a question requires qualifications, exceptions, dates, or thresholds, the FAQ should direct the reader to that guidance rather than compressing away the conditions.

---

## 19. Tone

Content should be:

- clear;
- respectful;
- calm;
- practical;
- nonjudgmental;
- direct;
- careful about uncertainty.

Avoid sensational framing.

Avoid implying that normal administrative processes are inherently frightening or hostile.

---

## 20. Audience Assumptions

Do not assume users:

- speak Japanese;
- understand Japanese bureaucracy;
- know immigration terminology;
- are American;
- use the same tax/legal concepts as their home country.

Explain unfamiliar concepts when needed.

---

## 21. Dates

For rules, deadlines, or changing programs, prefer explicit dates when ambiguity could matter.

Review-sensitive information should carry a review date.

---

## 22. External Links

Official links should be preferred where possible.

The application should not imply that Nihonest controls or guarantees third-party content.

Broken or changed official links should eventually feed into the review workflow.

For cultural guidance or language-learning support where a government source is not the appropriate authority, use reputable cultural, educational, or Japanese-language organizations and identify the material as practice, interpretation, or learning support rather than law.

---

## 23. Notifications About Changes

Critical-update notifications should be:

- targeted;
- factual;
- concise;
- linked to updated content;
- clear about what changed;
- clear when users should verify something with an authority.

Before notification events are generated, each critical update must have a human-approved published release containing a stable revision, canonical article or residence-status target, concise change summary, and an appropriate verification note. Relevance may derive only from an explicitly saved target or the user's current selected journey route together with enabled critical-update preferences, and must be checked again immediately before delivery. The email must plainly identify whether it was relevant because of the current journey, Saved items, or both. Drafts, automated source-change detections, ordinary edits, browsing history, and search history must never notify users.

Avoid panic-oriented messages.

---

## 24. Editorial Rule for AI

AI tools may assist with:

- drafting;
- restructuring;
- summarization;
- metadata suggestions;
- identifying potentially relevant sources;
- translation assistance.

AI output is never, by itself, evidence supporting a high-stakes factual claim.

Important claims must be verified against appropriate sources before publication.

---

## 25. Content Integrity Principle

The goal is not to publish the greatest quantity of content.

The goal is to publish information that users can understand, trace, and appropriately trust.

---

## 26. Journey and Conditional Guidance

Canonical articles may participate in multiple journeys. Do not rewrite shared guidance to pretend it belongs exclusively to one audience or route.

Journey definitions should distinguish:

- shared phases;
- mutually exclusive route choices;
- required steps; and
- conditional steps with a concise explanation of when they may apply.

Do not number a conditional item as though every user must complete it. Do not place alternative visas, statuses, or occupations one after another as apparent next steps after the user has selected a specific route.

Journey navigation is organizational guidance, not an eligibility assessment. Articles must still explain what the user needs to verify with the responsible authority.

---

## 27. Document Images and Form Examples

Images of important documents should be sourced, licensed, current, and safe to reproduce. Never expose real personal data.

Annotated examples should:

- explain important sections in accessible text outside the image;
- provide English explanations that remain available to translation systems and assistive technology;
- identify editions or dates when document layouts can change;
- use clearly fictional or safely redacted data; and
- distinguish an illustrative completion example from instructions issued by the responsible authority.

Do not rely on color, arrows, hover, or the image alone to communicate required meaning.

---

## 28. Phase 13 Editorial Review Standard

An article may move from draft to editorial review only after its material claims have been checked against current appropriate sources and its structured metadata, terminology, relationships, and applicability have been reviewed together.

Phase 13 review should specifically check:

- visa/status terminology and current program names;
- periods of stay, renewal limits, transition paths, and important deadlines;
- occupation and activity coverage, including commonly searched job titles and meaningful exclusions;
- required evidence, financial thresholds, exceptions, and recent rule changes;
- national versus local scope;
- whether Japanese terms are actually introduced in context;
- whether conditional steps explain their conditions; and
- whether journey links remain route-relevant while Continue exploring remains non-sequential.

Previously reviewed content is not exempt from this audit when the schema, journey model, terminology behavior, or governing source has changed.
