# Source Review Workflow

Phase 12 source checks are deliberate local editorial actions. They do not rewrite or publish guidance.

## Check one source

Preview the result without modifying repository state:

```powershell
npm run sources:check -- --source mofa-visa-faq --dry-run
```

Record the observation and any candidate revision:

```powershell
npm run sources:check -- --source mofa-visa-faq
```

Multiple `--source` arguments may be supplied. Checking the entire registry requires the explicit `--all` option so an accidental command does not send many requests to official sites.

## Interpret results

- `unchanged`: normalized content matches the human-accepted fingerprint.
- `changed`: content differs, or no accepted baseline exists. The observation remains a candidate.
- `redirected`: the source resolved to another URL and requires confirmation.
- `unavailable`: the request failed or returned an unsuccessful HTTP status. Existing state remains authoritative.
- `manual`: the source is configured not to be fetched automatically.

Successful `unchanged`, `changed`, and `redirected` requests update the operational link-check date. Failed and manual observations do not. A candidate never replaces the accepted revision merely because a request succeeded.

The checker stores fingerprints and operational metadata in `content/source-monitoring/state.json`; it does not commit copies of third-party webpages. Human candidate resolution and impact reports are added in the next Phase 12 iteration.

## Resolve an observation

Work on one source observation at a time unless several sources clearly describe the same official change.

1. Start from a clean or understood Git working tree so unrelated edits are not mistaken for source-review work.
2. Run a dry check first, then record the observation only when the selected source and result are expected.
3. Open the official source directly. Confirm its organization, canonical URL, language, publication or revision date when available, and whether linked documents also changed.
4. Review every direct dependency and every group or journey dependency reported for the source. Inherited group and journey matches identify navigation exposure; they do not necessarily require edits to those definitions.
5. Compare the changed official wording with the actual claims Nihonest makes. Pay particular attention to eligibility, permitted activities, exclusions, amounts, periods of stay, renewal rules, deadlines, fees, required evidence, forms, and transition rules.
6. Select one resolution outcome from the list below and record why it applies.
7. If guidance must change, update all affected canonical English content and its structured metadata together. Do not fix one article while leaving a linked glossary term, residence status, FAQ, or journey instruction contradictory.
8. Re-run focused schema, relationship, search, and affected-component tests appropriate to the changed records.
9. Ask the human editor for explicit approval. Detection, a successful fetch, or a Codex recommendation is not approval.
10. Only after approval, record the source resolution and review date and accept or reject the candidate revision. Approve corrected content separately through [the editorial workflow](EDITORIAL-WORKFLOW.md).

Generate or refresh the candidate's validated impact report with:

```powershell
npm run sources:report -- --source "source-id"
```

An optional note can be recorded at report generation. Human notes are the default; Codex-prepared observations must be labeled:

```powershell
npm run sources:report -- --source "source-id" --note-kind "codex-advisory" --note "Potential eligibility wording changed; confirm against the official section."
```

This writes canonical JSON plus a readable Markdown report under `content/source-reviews`. Review the official page and every dependency shown in that report. Do not hand-edit monitoring fingerprints or mark a JSON record resolved.

After the human editor has completed the review, applied any content changes, and run focused validation, resolve the record with an explicit attestation. `--reviewed-all` means the editor actually examined every dependency listed in the report; it is not an automation shortcut.

```powershell
npm run sources:resolve -- --source "source-id" --decision "accept" --outcome "guidance-update-required" --reviewed-at "2026-09-11" --approval-note "I reviewed the official revision and the corrected dependent guidance." --uncertainty "None identified." --validation "Focused source and content tests passed." --reviewed-all --content "article:affected-guide" --approve
```

Use repeated `--reviewed "kind:id"` values instead of `--reviewed-all` only when individually enumerating every listed dependency. Use repeated `--content "kind:id"` values for content or metadata changed during the review. Omitting `--approve`, required review evidence, or any dependency leaves the candidate unresolved. Accept advances the candidate to the reviewed baseline; reject clears it while retaining the earlier accepted baseline. Neither action marks an article `verified` automatically.

## Resolution outcomes

### No substantive source change

Use when only layout, navigation, accessibility markup, contact details unrelated to the cited claim, or other non-substantive page material changed.

- Record what changed and why no guidance claim is affected.
- Review enough of the official page to rule out a hidden substantive change.
- Accepting the new source baseline does not refresh article `lastReviewedAt` unless the article itself was substantively reviewed.

### Source changed, guidance remains accurate

Use when the official source changed substantively but Nihonest does not make the changed claim, or its existing wording remains correct.

- Identify the changed official subject.
- List the dependent content actually checked.
- Explain why no content edit is required.
- Update review dates only for records that were genuinely reviewed.

### Guidance update required

Use when an official change affects a Nihonest claim, instruction, threshold, deadline, route, or warning.

- Keep affected content in or return it to `needs-review` while corrections are prepared.
- Cite the current primary source and remove obsolete wording rather than merely adding a contradictory note.
- Recheck related content, search metadata, glossary explanations, journeys, FAQs, and document examples.
- Treat canonical English changes as invalidating any translation artifact whose recorded source revision no longer matches.
- Do not create a critical-update notification merely because content changed. That requires a separately reviewed and published critical-update release.

### Redirect or replacement source

Use only after confirming that the destination is an official successor controlled by the responsible organization.

- Update the registered URL and title or language when appropriate.
- Preserve the stable source ID when the authority and subject are continuous.
- Create a new source ID when the authority or evidentiary purpose materially changes.
- Check the replacement's substance before resolving the candidate; a working redirect is not proof that the guidance is unchanged.

### Temporarily unavailable

- Retry later and check the responsible organization's official index or publication catalog.
- Do not replace a primary source with an unofficial summary simply to clear the warning.
- Keep the last accepted revision and record uncertainty if the information cannot currently be verified.
- Move dependent content to `needs-review` when loss of the source creates a material trust problem.

### Manual review required

- Open and inspect the source manually, including relevant attachments, tables, footnotes, and publication dates.
- Record the exact edition, page, section, or heading reviewed when possible.
- Do not convert the source to automated checking unless the extracted fingerprint can represent its meaningful content reliably.

## Required review record

Every resolved candidate should record:

- source ID and official URL;
- candidate fingerprint and detection time;
- date of human review;
- concise description of the detected difference;
- direct and inherited dependencies examined;
- potentially affected claims;
- selected resolution outcome and reasoning;
- content files and metadata changed, if any;
- unresolved uncertainty or follow-up work;
- focused validation performed; and
- explicit approval to accept or reject the candidate.

Use [the source-change review template](templates/SOURCE-CHANGE-REVIEW.md) for planning or discussion only. The generated JSON record is the authoritative validated format.

## Useful Codex requests

For analysis without edits:

> Analyze the candidate change for `[source-id]`. Show the detected difference, affected dependencies, and claims that may need review. Do not change content or accept the candidate.

For a proposed correction:

> Prepare corrections for `[source-id]` using the current official source. Keep affected records in `needs-review`, add a draft source-change review record, and do not accept the candidate or mark anything verified.

For final approval:

> I reviewed the proposed changes and official source for `[source-id]`. Resolve the source review as `[outcome]` and accept the candidate as of `[date]`. Then prepare the separate editorial approval records for `[content IDs]` without inferring any additional approval.

The last instruction is an editorial attestation. Use it only after personally reviewing the relevant official source and proposed changes. Each content record must still satisfy `docs/EDITORIAL-WORKFLOW.md` for its exact revision.
