# N5 consumer, freshness and hydration integration — 2026-10-04

Tested exact combined source **6f83d94f6c7deae49c73ab1698573a491ebbaee1** on codex/hosting-native-integration. The following documentation-only handoff records this gate and awaits Claude's documentation review. Article detail's later metadata-only switch stays Claude-owned.

## Review receipts and exact inputs

Claude adopted prior exact handoff 015c76d as 8052468, tree-equal, and approved its docs. Claude approved 068b07c consumer imports and de12151 evidence, independently reproducing 409 normalized HTML pages/sitemap parity and all 2,044 RSC payload string-content parity; 96 explore/FAQ-family payloads drop an async chunk. This evidence remains attributed to Claude. Claude confirmed a2b2aad's review record accurate for scope.

Codex approved f65adee's typing refinement and 1dfcf38 hydration. Codex's two findings on 41af62c are now **closed by reviewed 3df83d2**: external target revision/absence is compared before replacement, changed targets are preserved and temporary files cleaned; all four canonical article write paths surface metadata failure without changing canonical-save/recovery success. Read-only GET restores the warning on refresh/reload; POST repair requires exact Origin, session token and an empty object. The source and UI use the same guarded writer. No ownership objection to the bounded shared discovery/search changes or unrelated ownership transfer.

Independent review at exact 3df83d2: **97 CMS tests / 20 files** passed. Removing the final revision comparison made both race tests fail; exact source was restored. Fixture coverage includes external edit, missing target created externally, missing target creation without interference, dirty refusal, generator failure, read-only inspection, canonical body/status/review success despite regeneration failure, repair endpoint rejection, and editor warning/repair. Creation over HTTP is not exercised with a full registry: the wrapper source assertion and UI call wiring cover it; that limit is retained.

Conflict-free cherry-picks from exact 015c76d:

| Reviewed input | Integration commit |
| --- | --- |
| 068b07c consumer checkpoint | 3ac6a44 |
| de12151 approved consumer evidence | cf8b37b |
| a2b2aad accurate review record | 68eddd9 |
| 41af62c freshness, approved with follow-up | 9db922b |
| f65adee typing | 4b7dcb7 |
| 1dfcf38 hydration | 23ba4a8 |
| 3df83d2 CMS fixes | 6f83d94 |

The combined source/scripts/CMS/config/package/e2e tree differs from exact Claude head 3df83d2 only by the fifteen approved metadata import substitutions. No other contributor's uncommitted work was included.

## Combined validation

Owned detached LF checkout at exact 6f83d94, zero CRLF files, existing locally copied dependencies (no clean install). Supabase/AWS/SES/email/public settings cleared; email delivery false, public origin https://nihonest.invalid and the internal checked flag unset.

**npm run release:check -- --target local: 14/14 passed in one invocation**: **1,220 tests / 197 files**, lint, metadata freshness, architecture **731 production modules**, editorial/coverage/localization/article/glossary audits, production **416 build entries**, post-build TypeScript, CMS exclusion, and all **37 emitted browser JS files**. No guidance/source registry in browser JS or map geometry in route entries. Article initial JS: **826.5 KB raw / 209.4 KB gzip**. No controlled compilation or payload savings claim.

**Production Playwright: 35 passed / 5 Auth skipped at default eight workers**, all forty discovered cases, including three early-input and seven H2 query-context cases. Public-only local production server stopped after the run. This closes the prior browser gate for this combined checkpoint; historical failed baseline/consumer runs remain recorded.

**npm run cms:a11y passed** on exact combined source: no axe violations at 1280 and 375 px across every page, editable record kind, creation form, municipality guide and reference kind, with every tab opened; keyboard walkthrough passed. Read-only private CMS server stopped. This automated audit does not constitute a human screen-reader review.

The preceding direct stale-title production-build probe at exact 1dfcf38 rejected before compilation and preserved the generated SHA-256, with title restored. That deliberate mutation probe was not rerun on combined source; release freshness and stale-output tests reran here. Claude's prior repeated browser/a11y results and the normalized full-corpus parity are separate attributed evidence.

No clean install, hosted/CI/Auth/SQL/provider acceptance, human Japanese wording review, native UI/Hermes run, real email or scheduling. Checksums are integrity, not authenticity. Final documentation review/adoption and Claude's article-detail metadata switch remain; prior native/operational gates remain open. No main merge or activation.
