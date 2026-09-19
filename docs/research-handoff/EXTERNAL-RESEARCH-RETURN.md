# External research return contract

The returned JSON must validate against `external-research-result.schema.json`. Use UTF-8 and ISO `YYYY-MM-DD` dates.

## Required concepts

- `researchId`: exactly matches the active brief.
- `researchedAt`: date the research was completed.
- `scope`: what was and was not researched.
- `claims`: atomic factual propositions rather than article prose.
- `sources`: exact source records with claim mappings and locators.
- `conflicts`: evidence that could not be reconciled safely.
- `unresolvedQuestions`: missing facts that affect implementation.
- `contentImpacts`: repository content that may need creation, revision, or review.
- `followUpCandidates`: useful discoveries outside the approved scope.

## Claim-writing rules

One claim should express one independently verifiable proposition. Split a current amount, future amount, and transition rule when they rely on different evidence or dates.

Good:

> Applications accepted on or after 2026-10-01 are subject to the revised permanent-residence fee when permission is granted.

Too broad:

> Permanent residence costs more now and there may be exceptions depending on the application.

`statement` contains only the supported fact. Put cautions about interpretation, missing translations, or apparent inconsistencies in `researcherNotes`.

## Source locators

Use a locator that another reviewer can follow without repeating the whole search. Examples:

- `Heading: Fees; table row: Permission for permanent residence`
- `Q&A question 11`
- `PDF printed page 4, PDF page 6, table 2`
- `Section: 手数料, paragraph beginning 許可されるときは`

## Content impacts

Use only article IDs provided in the research brief. If the research suggests new guidance, set `contentId` to `null` and provide a proposed human-readable title. Codex and the editor will decide whether a new record and stable ID should exist.

## Markdown memo

Keep the companion memo compact. Recommended sections:

1. Executive finding
2. Confirmed findings
3. Conflicts and unresolved questions
4. Recommended content impacts
5. Source list

Do not duplicate every JSON field in prose.
