# N1 fee/map preparation contract self-review — 2026-10-04

Audited working source `9a7a158`, including fee `c72bcd2` and orientation `dc97629`.
Reviewer: Codex (implementer self-review). No findings requiring a code change. This is additional evidence,
not Claude's independent approval; neither preparation checkpoint advances into integration from this review.

## Reviewed behavior

- Fee records reject coercion, extra fields, unsafe/noninteger/negative yen, invalid calendar dates, reversed
  or overlapping intervals and missing/duplicate/reordered/unknown bands. Explicit gaps and exact zero amounts
  remain allowed under the prepared contract. Public sender-domain suffix spelling is preserved; whitespace
  and URL/address shapes fail. The helper uses supplied processing charges and does not infer policy or time.
- Orientation references require prefecture ID/code agreement. Region and path collections exactly cover the
  supplied reference set, with unique membership/codes and matching ordered bilingual member lists/map names.
  Strict object shapes retain source bytes/order. The caller remains responsible for supplying the intended
  complete registry; the canonical parity test supplies all 47 prefectures/metropolis records.
- The path scanner supports only bounded closed M/L/Z rings, three or more vertices per ring, fixed-one-decimal
  finite projected coordinates and finite focus values with positive span. It does not validate polygon area,
  topology, geographic truth or physical distances. Its 200,000-character ceiling is an explicit input limit.
- Checks for newline/control/space suffixes in IDs/codes and newline/calendar failures in acceptance dates
  reject them. No identifier/date normalization or schema relaxation was needed.

## Independent probes

Read-only PowerShell here-string JavaScript piped to `node --import tsx --input-type=module`:

- A deterministic seeded generator (`1042026`) created 1,000 paths with one to four rings, varied vertex counts
  and signed coordinates. All passed. One character mutation per path was compared against a separate complete
  closed-ring grammar expression, and all 1,000 acceptance/rejection results agreed. Small generated numbers
  avoid conflating grammar checks with floating-point limits.
- A valid path of exactly **200,000 characters** passed; appending one more ring failed. Total geometry probes:
  **2,002**. No wall-clock performance assertion or arbitrary SVG support is claimed.
- Each of seven fee periods was checked across all 16 combinations of base/charge values drawn from zero,
  one, `MAX_SAFE_INTEGER - 1` and `MAX_SAFE_INTEGER`. An independent BigInt sum determined whether the exact
  result must be returned or `RangeError` thrown. All **112** cases passed, including both period families.
- **17 additional boundary cases** passed: invalid newline/control/date values, a complete 47-prefecture
  synthetic input and an oversized reference collection. Initial narrower newline probes also rejected their
  inputs; they exposed no defect.

The combined existing focused command passed **83 tests / five files**:

```text
npx vitest run src/domain/article/residence-application-fees.test.ts src/lib/content/residence-application-fee-contract.test.tsx src/components/content/residence-application-fee-section.test.tsx src/domain/geography/orientation-map-data.test.ts src/lib/content/orientation-map-contract.test.ts
```

This includes original fee renderer tests and both canonical JSON parity suites. No source/artifact file or
generated output was changed by probes. No production implementation/test changes were needed, so no new
tests were committed. Earlier preparation TypeScript/lint/architecture evidence retains its scope; those
checks and a full release/build/browser/SQL/hosted/external-source audit were not repeated in this pass.

## Outstanding review/adoption

Retain this self-review with the held consolidated queue. The independent reviews of `c72bcd2`, `dc97629`,
renderer extraction `f9681f9`, the Claude-owned pure translation validator and copy/provenance decisions
remain open. Map resource/license and fee-copy bindings, full component payload wiring and format transition
remain unimplemented. Integration stays `1a4ab65` / `4372d4a`; no main merge, activation or scheduling.
