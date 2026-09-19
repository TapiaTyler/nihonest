# Canonical Content Handoff

This handoff records the repository state at the end of the Phase 13 implementation and automated-audit work. It does not assert that the catalog has received human editorial approval. Canonical English remains repository-controlled, and every approval must follow `docs/EDITORIAL-WORKFLOW.md` for the exact revision reviewed.

## Catalog snapshot

As of 2026-09-19, the editorial catalog contains 454 records:

| Content kind | Needs review | Draft | Verified |
|---|---:|---:|---:|
| Articles | 95 | 0 | 0 |
| Glossary terms | 176 | 49 | 0 |
| Residence statuses | 11 | 19 | 0 |
| FAQs | 84 | 20 | 0 |
| **Total** | **366** | **88** | **0** |

`needs-review` means the material is prepared for human review; it is not an editorial approval. `draft` means the record still needs substantive research or development before approval should be considered. The empty approval ledger is therefore accurate rather than an audit defect.

## Automated closure evidence

The following gates passed on 2026-09-19:

- guidance coverage accounts for all 95 articles and 30 residence statuses;
- editorial state validates all 454 records without false `verified` claims or approval-ledger inconsistencies;
- article metadata, internal article relationships, glossary references, source IDs, route metadata, and unsupported Markdown-table syntax pass the catalog integrity checks;
- the guidance-coverage plan, editorial review model, editorial catalog, source dependency model, and article-source metadata pass their focused tests; and
- the bounded inline-terminology queue is empty: every glossary term declared by an article has a visible contextual link in that article.

Automated checks establish structural consistency. They do not establish that a legal rule, fee, translation, local instruction, or practical recommendation is correct.

## Human-review queue

Review should proceed in risk-based batches rather than by marking the whole catalog verified at once.

### 1. Time-sensitive and high-consequence guidance

Review immigration procedures, residence-status selection, employment authorization, taxes, social insurance, healthcare, and emergency guidance first. Confirm effective dates, transition rules, fees, periods, renewal limits, required evidence, and authority handoffs against the cited current sources.

The review must pay particular attention to:

- the immigration fee schedule taking effect for applications accepted on or after October 1, 2026;
- the consular visa reference-fee revision effective July 1, 2026 and each mission's local collection rules;
- the Employment for Skill Development system scheduled to begin April 1, 2027;
- Business Manager and related Start-up pathway changes;
- tax-year, municipal, and form-edition differences; and
- any statement that could be mistaken for an individual eligibility or legal determination.

### 2. Cross-record consistency

Review each article together with its linked residence statuses, glossary terms, FAQs, journey steps, activity cross-references, and search aliases. Approve records individually only after the shared rule, terminology, and handoffs agree. Draft glossary, status, and FAQ records require completion before they can enter the approval workflow.

### 3. Documents, images, and local guidance

Review fictional annotated-document examples, official-image attribution and reuse conditions, version labels, municipality selectors, and the Shinjuku and Nagoya supplements. Confirm that examples remain non-operational, accessible without an image, and clearly separated from current official forms and local instructions.

### 4. Lower-risk practical guidance

Review housing, banking, phone, utilities, waste, transportation, language support, and general Japan orientation after their legal and municipal boundaries have been confirmed. Variable private prices should remain examples or verification prompts rather than apparent official charges.

## Source-monitoring handoff

The core source dependency graph contains 286 registered source entries and has no blocking errors. Three previously unattached official sources are now connected to the Legal/Accounting Services, Start-up, and Skilled Labor guides. A generic government portal with no claim-level evidentiary purpose has been removed.

Nineteen sources still appear as `unused-source` warnings in the core graph even though they are used by annotated-document or local-guidance data. The structural refactor should extend dependency registration to those content types before source monitoring is activated. The affected sources cover:

- Residence Card and My Number sample-image rights and assets;
- withholding-slip and resident-tax document examples;
- Nagoya moving, tax, waste, disaster, and international-support guidance; and
- Shinjuku tax, waste, disaster, consultation, and language-support guidance.

`content/source-monitoring/state.json` has no human-accepted source baselines. Do not run a bulk live check and accept the resulting candidates automatically. Establish baselines in deliberate, risk-based batches under `docs/SOURCE-REVIEW.md`; a successful fetch is not editorial approval.

## Structural-refactor constraints

The next checkpoint is the behavior-preserving organization work in `docs/refactor.md`. It must preserve:

- every stable content ID, slug, relationship, and public route;
- metadata and revision semantics used by editorial approval;
- source dependency identity and review history;
- search, journey, saved-content, progress, and synchronization behavior;
- canonical-English article output and Japanese pilot fallback behavior; and
- the distinction between repository-owned canonical content and account data stored through Supabase.

The refactor should also make annotated documents and local guidance first-class source-dependency containers. It does not authorize a CMS, article database, monorepo, native client, or broad UI redesign.

## Localization readiness

Phase 14 may begin only after the structural refactor preserves the canonical content contracts. Translation artifacts must remain revision-addressed so an English change deterministically invalidates its dependent translation. A locale must not be presented as complete while catalog coverage or high-risk human review remains partial.

Human editorial review can continue across the refactor and localization work, but no record should be changed to `verified` without explicit review of its exact current revision and a matching immutable approval record.
