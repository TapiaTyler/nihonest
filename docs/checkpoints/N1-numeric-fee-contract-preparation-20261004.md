# N1 numeric fee contract preparation — 2026-10-04

Base: `b8e37f1b280d692ffebaf6484809557ae07cca2b`. This bounded checkpoint implements only a portable
contract/calculation for existing numeric fee data. It awaits Claude review. It does not move fee copy,
change the existing fee data/helper/renderer, wire export, add a bundle file or change format 9.

## Prepared interface

`src/domain/article/residence-application-fees.ts` exports:

- `residenceApplicationFeePeriodIds` and `residenceApplicationFeePeriodIdSchema`: the seven existing IDs
  in current display order. Changing the period family requires a contract revision.
- `residenceApplicationFeeBandSchema` and `residenceApplicationFeeDataSchema`: strict schemas for the
  existing record, without adding translation, editorial or provider configuration fields.
- The inferred period, band, data and processing-fee types.
- `calculateResidenceApplicationOnlineTotal(band, processingFees)`: validated, platform-neutral base-plus-
  processing arithmetic. The two bands starting at three years use `threeYearsOrMore`; the other five
  use `underThreeYears`. Inputs are explicit, so this helper does not import canonical data.

Amounts are nonnegative safe integer yen without coercion. Zero is representable but grants no relief or
exemption eligibility. Both current and previous acceptance schedules remain explicit, with valid ISO
dates, an ordered previous interval and no overlap. A declared gap is preserved rather than filled by an
invented applicability rule. No helper chooses a schedule by wall-clock date or decides an application's
eligibility. The exact seven bands must occur once each in canonical order; no default/reordering is applied.

The sender-domain value remains a public data suffix beginning with `@`, not a full address, URL, credential
or email-provider setting. Validation checks ASCII DNS-label shape and length, rejects whitespace, and
preserves case/spelling. It does not perform DNS lookup or establish that a sender is legitimate.

Each operand and each derived online total must be an exact safe integer. Validation rejects a total that
would be rounded even when both operands individually pass. Direct calculation calls validate their input
records and fail on an unsafe sum. Strings, extra localized fields and ambiguous bands are rejected.

## Verification

`src/domain/article/residence-application-fees.test.ts` covers synthetic schedules/amounts independently of
canonical data: three-year boundaries, supplied charge changes, missing/duplicate/reordered/unknown bands,
invalid amounts across every numeric field, zero values, invalid/reversed/overlapping dates, retained gaps,
strict nested records, suffix spelling/shape and sum overflow.

`src/lib/content/residence-application-fee-contract.test.tsx` reads the existing owner without editing it.
The parsed data equals the original and has identical JSON serialization; all seven domain totals match
the existing `residenceApplicationOnlineTotal`. For both locales, every rendered counter/base/total cell
matches the parsed values in canonical band order. Existing fee renderer tests were run unchanged.

Commands:

- `npx vitest run src/domain/article/residence-application-fees.test.ts src/lib/content/residence-application-fee-contract.test.tsx src/components/content/residence-application-fee-section.test.tsx`: **39 tests / three files**, passed (37 new tests plus two existing).
- `npx tsc --noEmit`: passed.
- Targeted `npx eslint` on the three new source/test files: passed.
- `npm run architecture:check`: **717 production modules**, passed.
- `git diff --check` and consumer search: passed; only new tests import the new module.

No full web suite/release/build/browser, live database, hosted call, clean install or external fee-source
verification was repeated. The new module is unused by production consumers, so this checkpoint makes no
claim about a changed fee policy or deployed rendering. It uses the current repository data as its parity
reference, not as a new verification of the underlying law/rates. No source/translation artifact is generated.

## Pending review and adoption

The existing helper and its data-local types remain unchanged until ownership/adoption is agreed. Their
temporary correspondence with the prepared domain contract is covered by parity tests. This numeric
record is not the complete native fee component: localized headings, period labels, paragraphs, formatting,
payment caveats and source/review metadata still require the coordinated contract and provenance decision.

Retain the review queue while Claude is unavailable. Renderer extraction `f9681f9`, inventory `b8e37f1`,
the Claude-owned pure translation-field helper, fee-copy ownership/provenance and eleven finder-label
decisions remain pending. No reviewed integration advance, main merge, hosted service, real email or schedule.
