# UI/UX Roadmap

Findings from the best-practice review of the site (detector plus code audit), with fixes tracked in priority order. Work happens on `claude/ui-ux-improvements`.

This is a working checklist, separate from the product roadmap in `ROADMAP.md`. Items are re-prioritised as pages are reviewed. Review is code-level; visible changes are checked by the owner.

**Status:** `done` · `next` · `planned` · `parked` (owner decision pending; do not implement without a preview or discussion) · `dropped`

**Rules that apply to every item**
- Interface text goes through the message catalogs (`english.ts` and `japanese.ts`) in the same change; Japanese stays `machine-translated` until a qualified human reviews it.
- No right-facing arrows in the UI; the whole row or card is the link.
- Run `npm run test:e2e` before merge; CI runs it, `release:check` does not.

## Home page

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| H1 | P1 | New visitors saw no guides until they picked a stage. Added stage-browse section linking to Explore. | done |
| H2 | P1 | Hero CTA and aside swapped after preferences loaded. Placeholder holds space; `noscript` fallback. | done |
| H3 | P2 | Japanese hero typography (leading, tracking, size, font stack, `lang` tags). | done |
| H4 | P2 | The dark hero aside is a policy statement for new visitors, not something to act on. Owner decision: keep as is for now; revisit suggestions when we reach it. | parked |
| H5 | P2 | Light theme only; colours are hard-coded Tailwind classes (teal-800 repeated in 10+ places). Introduce semantic tokens first, dark mode after. | planned |
| H6 | P2 | Skip link text is English-only (`layout.tsx`). Now a localized `SkipLink` component. | done |
| H7 | P3 | "What to expect" cards are plain text; Owner decision: keep as is; numbers or icons would add AI-looking UI. | dropped |
| H8 | P3 | `py-32` hero spacing pushes content below the fold on large screens; revisit now that H1 exists. Hero padding is now `py-14 sm:py-20` with no extra large-screen increase; the stage cards start above the fold at 1440x900. | done |
| H9 | P3 | Stage labels lowercased with `.toLowerCase()` inside sentences; English-only habit, and it produced "living in japan". Stage names in sentences now come from `stage.inSentence.*` catalog messages; also stopped lowercasing journey titles on group pages. | done |

## Explore

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| E1 | P1 | Advanced filters (stage, topic, audience, scope, type, importance, status) are hidden in a closed "More filters" section even when active, so links such as `/explore?stage=…` land on invisible filters. Open it when any is active and show removable filter chips. The panel opens when a filter applies and is never closed automatically. | done |
| E2 | P2 | Search sits below three competing prompts (country basics, "can I do this?" panel, recommendations). Put search first and demote the rest. Search now follows the heading; the prompts sit between search and the group browser and hide while searching. | done |
| E3 | P3 | Search placeholder is a hard-coded `locale === "ja"` ternary instead of a catalog message. | done |
| E4 | P3 | Search area has no `role="search"` landmark. | done |
| E5 | P3 | No obvious reset for a filter-only state (covered by E1 chips). | done |

## Onboarding

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| O1 | P2 | "Save my starting point" is disabled with no explanation. The button is now `aria-disabled` (still focusable) with a visible, associated hint. | done |
| O2 | P2 | Save is far below the only required choice (stage). Add a helper line, or a sticky save bar on mobile. Added a helper line under the stage options; no sticky bar. | done |
| O3 | P3 | Stage descriptions are duplicated between onboarding (inline strings) and the home stage-browse section (catalog) with different wording. Consolidated: both pages use the `onboarding.stage*Description` catalog messages. | done |

## Article page

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| A1 | P2 | Long guides have no "On this page" outline. Add a collapsed contents list from the headings, including translated headings. Built from the portable body parser for both languages; shown for guides with 4+ headings; every rendered heading has a matching anchor (verified against all articles). | done |
| A2 | -- | Save button placement was reviewed and is fine. | dropped |

## Cross-cutting

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| X1 | P3 | Inter is the only typeface and has no Japanese glyphs. Site-wide `:lang(ja)` font stack and line-height would extend H3, but changes every page's Japanese rendering. Owner decision: leave open; show a simulated preview of the change before implementing. | parked |
| X2 | P3 | `border-l-4` blockquotes are flagged by the detector. They read as callouts here and are consistent; leave unless the visual direction changes. | dropped |
| X3 | -- | `gray-on-color` flag in `onboarding-actions.tsx` is the disabled state; false positive. | dropped |

## Decisions
- Eyebrow labels stay: they act as the page titles while headings summarise the page.

## Not yet reviewed
My Journey, Roadmap, FAQ, Glossary, Residence statuses, Can I do this?, Saved, Reminders, Account, header and footer interaction states (keyboard, mobile drawer).
