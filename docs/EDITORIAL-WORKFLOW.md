# Editorial Workflow

Nihonest uses a single-editor, repository-first workflow. Git contains the canonical content, source observations, review evidence, approvals, and history. Codex may organize evidence and prepare changes, but it cannot independently approve factual guidance.

## Content states

- `draft`: incomplete or insufficiently researched material that must not appear reviewed.
- `needs-review`: material prepared for, awaiting, or undergoing human editorial review.
- `verified`: the human editor approved the exact current revision and its repository approval record.
- `archived`: retained content that is no longer part of normal discovery.

Changing verified prose or structured metadata invalidates the current approval. Keep or return the content to `needs-review` while editing. Historical approval files remain immutable evidence for their old revisions; they do not authorize a newer revision.

## Approving content

1. Review the complete current content, its official sources, important qualifications, metadata, terminology, and relationships.
2. Resolve any relevant candidate source reviews according to [the source-review guide](SOURCE-REVIEW.md). A source baseline and a content approval are separate decisions.
3. Apply corrections while the content remains `needs-review` and update its `updatedAt` date where that field exists.
4. Run focused validation appropriate to the record and review the rendered content when presentation changed.
5. The human editor explicitly approves the exact proposed revision.
6. In the same change, set `status` to `verified` and set `lastReviewedAt` to the approval date. The review date cannot precede `updatedAt`.
7. Generate the immutable approval record. For example:

```powershell
npm run editorial:record -- --kind "article" --id "article-id" --reviewed-at "2026-09-11" --change-note "Verified eligibility, limitations, terminology, relationships, and current official sources." --approval-note "I reviewed and approve this exact revision." --validation "Focused article and relationship tests passed." --source-review "optional-resolved-source-review-id" --approve
```

Supported kinds are `article`, `glossary-term`, `residence-status`, and `faq`. Repeat `--validation` or `--source-review` when needed. Linked source-review IDs must describe relevant resolved reviews.

8. Run the repository gate:

```powershell
npm run editorial:audit
```

9. Inspect and commit the content, metadata, approval JSON, and any source-review resolution together. Git history is the authoritative audit trail.

The record command fails unless the current content is already marked `verified`, its review date matches the command, required notes and validation are present, and `--approve` represents explicit human approval. The audit fails if verified content lacks an approval for its exact SHA-256 revision, has inconsistent dates, or points to an invalid ledger state.

## Revisions and corrections

- Never edit an existing approval JSON file to cover a different revision. Generate a new record after a new review.
- Never copy an old `lastReviewedAt` date onto changed content merely to satisfy validation.
- A layout-only or metadata change still changes the recorded revision. Decide whether the existing factual review remains sufficient, record that reasoning, and approve the exact result.
- If a detected official-source change does not affect guidance, the source candidate may be accepted without refreshing dependent content review dates.
- If guidance changes, keep it in `needs-review` until the correction itself receives human approval.
- Do not mark content verified solely because tests pass, a link is reachable, a source fingerprint is accepted, or Codex recommends approval.

## Git review checklist

- The diff contains only understood content and workflow files.
- Each new approval record matches a current verified revision.
- Change and approval notes explain what was actually reviewed.
- Source-review links, uncertainty, and validation are recorded where applicable.
- `npm run editorial:audit` passes before committing.
- No local source snapshot cache, credentials, or temporary service files are staged.
