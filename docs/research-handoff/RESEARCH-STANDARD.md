# Nihonest external research standard

> This is the optional formal evidence standard. The default ChatGPT web workflow is the lighter topic-discovery process in `TOPIC-DISCOVERY.md`; Codex performs the consequential primary-source research. Use this standard only when the editor explicitly requests a structured independent evidence return.

## 1. Work only within the brief

Answer the supplied research questions and respect its exclusions. Record a potentially important out-of-scope issue under `followUpCandidates`; do not silently expand the workstream.

## 2. Use the strongest available authority

Prefer, in order:

1. current statutes, regulations, official gazettes, and responsible government authorities;
2. official regulator, municipality, public institution, or program-owner guidance;
3. official forms, instructions, fee schedules, manuals, and published questions and answers;
4. reputable institutional material when government sources are not the appropriate authority; and
5. secondary sources only to discover primary material or document a genuine unresolved conflict.

Do not use a search-result snippet as final evidence when the underlying source can be opened. Do not cite an AI answer as a source.

## 3. Map evidence claim by claim

Each consequential claim must identify one or more source IDs. Each source must identify the exact heading, table, question number, page, paragraph context, or other locator supporting the claim. A general source list without claim mapping is insufficient.

Paraphrase instead of copying long passages. Include a short original-language phrase only when it is needed to locate or disambiguate the rule.

## 4. Preserve dates and transitions

For changing information, record when available:

- publication or revision date;
- effective date and end date;
- the date that controls applicability, such as application acceptance, approval, entry, tax year, assessment year, or academic year;
- transition rules for pending cases; and
- a separate current and future claim when both matter.

Use an explicit calendar date rather than “recently,” “currently changing,” or “next year.”

## 5. Report uncertainty honestly

Use the evidence states defined by the return schema:

- `confirmed`: directly supported by current authoritative evidence;
- `conflicting`: authoritative sources appear inconsistent or apply to different facts that cannot yet be separated;
- `incomplete`: part of the claim is supported but a material condition remains unknown;
- `not-found`: diligent research did not locate authoritative support.

Do not infer a definitive answer from silence. Put interpretation in `researcherNotes`, not inside the factual statement.

## 6. Handle Japanese and PDF sources carefully

Record the source language. For Japanese material, provide a concise English support summary and preserve the relevant Japanese heading or term in the locator where useful. For PDFs, record the printed page number when present and the PDF page index if they differ. Tables must be read with their headings, units, footnotes, and date scope.

## 7. Distinguish financial concepts

Do not use “fee” as a catch-all. Classify an amount as one of:

- government fee;
- tax or tax-related liability;
- insurance premium or social contribution;
- municipal or prefectural variable charge;
- consular fee collected in local currency;
- private or institutional price;
- refundable or conditionally refundable deposit;
- financial-eligibility threshold;
- estimate or budget example; or
- no-fee procedure.

For a precise amount, capture the currency, responsible body, charged event, effective dates, controlling transition date, payment channel, processing charge, and material exemption or reduction. Do not convert currencies unless the authority itself supplies the conversion.

## 8. Avoid eligibility conclusions

Describe rules, required facts, alternatives, exceptions, and authority checks. Do not determine that an unnamed or hypothetical person qualifies, owes a particular amount, may lawfully perform an activity, or will receive permission.

## 9. Deliver both structured and readable output

Return:

- JSON conforming to `external-research-result.schema.json`; and
- a concise Markdown memo organized around findings, conflicts, unresolved questions, content impacts, and sources.

The JSON is the transfer contract. The memo is for human review. They must agree.
