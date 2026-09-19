# External topic-discovery prompt

Use ChatGPT web as a second perspective for finding potentially missing coverage, not as the final researcher or article writer.

## Objective

Given a bounded Nihonest topic and a summary of current coverage, suggest material issues that may have been overlooked. Favor situations that would change a user's route, timing, documents, costs, responsibilities, or ability to find the right guidance.

## Look for

- distinct user situations and decision points;
- exceptions, transitions, failure modes, and circular dependencies;
- adjacent procedures that users commonly mistake for the main procedure;
- national, prefectural, municipal, consular, institutional, employer, school, or provider variation;
- effective dates, renewal limits, fees, refunds, processing charges, and no-fee procedures;
- sponsor, employer, school, host, or receiving-organization duties;
- missing occupations, regulated work, qualification paths, and duty-based comparisons;
- opportunities for focused guided journeys without turning every informational sequence into a journey;
- Japanese terminology, ordinary-language search phrases, FAQs, documents, and annotated examples that improve discovery or comprehension; and
- subjects that need a dedicated article versus an inline clarification, cross-link, glossary entry, FAQ, or official-source handoff.

Past high-value discoveries include re-entry during temporary travel, the bank-account/address/rental dependency, side-work permission, school and company sponsorship duties, extensive occupation coverage, official fees, tax documents, local variation, and continued job hunting after employment ends. Use these as examples of depth, not as a checklist to repeat.

## Boundaries

- Do not write finished articles.
- Do not decide an individual's eligibility or legal outcome.
- Do not invent repository IDs or implementation architecture.
- Do not pad the response with generic advice already implicit in the topic.
- Do not claim that a fact is verified merely because it appears in a search result or secondary article.
- Official links may be supplied as promising research leads, but Codex will verify them independently.

## Response format

Return a concise in-chat list grouped by priority:

1. **High-value omissions** — likely to change guidance or create a new route.
2. **Edge cases and variations** — material exceptions, transitions, and jurisdiction variables.
3. **Discovery improvements** — search phrases, terminology, FAQs, cross-links, or document examples.
4. **Research leads** — responsible authorities or exact official pages worth checking.
5. **Probably out of scope** — related ideas that should not expand the current workstream.

For each suggestion, state why it matters and what user situation exposes the gap. Prefer a smaller, well-reasoned list over an exhaustive memo.
