# Example Source Review: fictional-immigration-guidance

> **Illustrative file only.** This example is not an official source observation, does not describe a real legal change, and is intentionally stored outside `content/source-reviews` so the editorial tooling cannot mistake it for a live review.

- Official source: [Fictional immigration procedure page](https://example.go.jp/immigration/procedure)
- Status: **open**
- Detected as: `changed`
- Priority: **critical** (94/100)
- Candidate: `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`
- Detected: 2026-09-11T10:00:00.000Z

## Priority reasons

- National government source
- Dependent guidance reaches critical importance
- Dependent guidance covers a high-risk subject
- Five direct or inherited dependencies

## Detected difference

Normalized text changed from 8,420 to 8,617 bytes. The excerpts below show textual differences only; they do not determine the legal meaning of the change.

### Before excerpts

- Example old wording describing when an applicant must complete a fictional procedure.

### After excerpts

- Example revised wording that appears to add a qualification and a different fictional filing period.

## Potentially affected claims

- Eligibility and route scope
- Periods, renewals, deadlines, and evidence
- Municipal forms, timing, evidence, and local variation

## Dependencies

### Articles

- `example-arrival-procedure`
- `example-renewal-guide`

### Glossary terms

- `example-permission-term`

### Content groups

- `example-arrival-group` via `example-arrival-procedure`

### Guided journeys

- `example-moving-journey` via `example-arrival-procedure`, `example-renewal-guide`

## Review notes

- **Codex advisory (2026-09-11T10:15:00.000Z):** The revised passage may affect the deadline and exception described in two guides. Compare the complete official section, its footnotes, and any linked form before changing content. This observation is not an editorial conclusion.

## Resolution

- Awaiting explicit human resolution.

## What the human editor checks

- Open the official page and confirm that the candidate represents the intended current publication.
- Determine whether the changed passage is substantive or merely a layout or wording change.
- Examine every direct dependency and evaluate the inherited group and journey exposure.
- Correct affected content while it remains `needs-review`.
- Record unresolved uncertainty and focused validation.
- Explicitly accept or reject the source candidate.
- If content changed, approve each exact content revision separately before setting it to `verified`.

Automated differences and Codex suggestions are advisory. Only explicit human approval resolves a real review record.
