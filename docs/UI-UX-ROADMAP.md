# UI/UX Roadmap

Findings from the best-practice review of the site (detector plus code audit), with fixes tracked in priority order. Work happens on `claude/ui-ux-improvements`.

This is a working checklist, separate from the product roadmap in `ROADMAP.md`. Items are re-prioritised as pages are reviewed. Review is code-level; visible changes are checked by the owner.

**Status:** `done` · `next` · `planned` · `decision` (needs an owner call) · `dropped`

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
| H4 | P2 | The dark hero aside is a policy statement for new visitors, not something to act on. Replace with useful shortcuts or tone it down. | decision |
| H5 | P2 | Light theme only; colours are hard-coded Tailwind classes (teal-800 repeated in 10+ places). Introduce semantic tokens first, dark mode after. | planned |
| H6 | P2 | Skip link text is English-only (`layout.tsx`). | planned |
| H7 | P3 | "What to expect" cards are plain text; consider numbers or icons for scannability. | decision |
| H8 | P3 | `py-32` hero spacing pushes content below the fold on large screens; revisit now that H1 exists. | planned |
| H9 | P3 | Stage labels lowercased with `.toLowerCase()` inside sentences; English-only habit. | planned |

## Explore

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| E1 | P1 | Advanced filters (stage, topic, audience, scope, type, importance, status) are hidden in a closed "More filters" section even when active, so links such as `/explore?stage=…` land on invisible filters. Open it when any is active and show removable filter chips. | next |
| E2 | P2 | Search sits below three competing prompts (country basics, "can I do this?" panel, recommendations). Put search first and demote the rest. | planned |
| E3 | P3 | Search placeholder is a hard-coded `locale === "ja"` ternary instead of a catalog message. | planned |
| E4 | P3 | Search area has no `role="search"` landmark. | planned |
| E5 | P3 | No obvious reset for a filter-only state (covered by E1 chips). | planned |

## Onboarding

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| O1 | P2 | "Save my starting point" is disabled with no explanation. Add an `aria-describedby` hint. | planned |
| O2 | P2 | Save is far below the only required choice (stage). Add a helper line, or a sticky save bar on mobile. | planned |
| O3 | P3 | Stage descriptions are duplicated between onboarding (inline strings) and the home stage-browse section (catalog) with different wording. Consolidate into the catalog. | planned |

## Article page

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| A1 | P2 | Long guides have no "On this page" outline. Add a collapsed contents list from the headings, including translated headings. | planned |
| A2 | -- | Save button placement was reviewed and is fine. | dropped |

## Cross-cutting

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| X1 | P3 | Inter is the only typeface and has no Japanese glyphs. Site-wide `:lang(ja)` font stack and line-height would extend H3, but changes every page's Japanese rendering. | decision |
| X2 | P3 | `border-l-4` blockquotes are flagged by the detector. They read as callouts here and are consistent; leave unless the visual direction changes. | dropped |
| X3 | -- | `gray-on-color` flag in `onboarding-actions.tsx` is the disabled state; false positive. | dropped |

## Not yet reviewed
My Journey, Roadmap, FAQ, Glossary, Residence statuses, Can I do this?, Saved, Reminders, Account, header and footer interaction states (keyboard, mobile drawer).
