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

## Page review and mobile pass

Measured with a script across 19 pages (plus the four articles with special content sections) at 1280px and 375px, in English and Japanese: contrast, tap-target size, horizontal overflow and tiny text. Results: no contrast failures, no page-level horizontal overflow, no text under 12px. The first pass did not follow the `mobile-native` checklist; M8 to M10 come from applying it afterwards. Card titles that use a stretched link (`before:absolute before:inset-0`) are whole-card targets and were ignored.

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| M1 | P1 | Regression from E1: on phones, arriving with a filter (for example from a home stage card) auto-opened the filter panel, a tall stack of seven selects that pushed results out of view. The panel now stays closed below 640px; the chips already show what is applied. | done |
| M2 | P2 | Wide article tables force sideways scrolling on phones even with two columns (tax scope: `min-w-56` plus `min-w-80` is about 576px against a 343px column). Relax the minimum widths below `sm` so two-column tables wrap, and for the wider ones (renewal 596px, route comparison 497px) make the scroll area keyboard-focusable with an accessible name and a visible hint. The two text tables now wrap on phones; the numeric fee table keeps its scroll and is now a labelled, keyboard-focusable region. Verified at 375px. | done |
| M3 | P2 | Small touch targets on phones: "Back to ..." links are 19px tall on onboarding, My Journey, articles, glossary terms, statuses, journeys; the header logo is 28px and the footer logo 21px; the Japanese translation notice button "英語で読む" is 24px. Padded to 44px (`min-h-11`); remaining flagged rows are stretched-link card titles, which are whole-card targets. | done |
| M4 | P3 | Index pages (Residence statuses, Glossary, FAQ) put one or two callout boxes before the main control, and their top padding (`py-16 sm:py-24`) pushes the list below the fold at 1280x800, the same pattern as H8 and E2. Candidate fix: tighter top padding and the callouts after the control. | planned |
| M5 | P3 | My Journey and Roadmap have near-identical empty states with the same "Find my starting point" button. Consider a single clearer difference in purpose, or merging. | decision |
| M6 | P3 | The mobile drawer label "Adjust Starting Point" uses title case; the rest of the interface uses sentence case ("Adjust my starting point"). | planned |
| M8 | P2 | iOS Safari zooms the page when a form field under 16px gets focus and does not zoom back. Measured at 375px: all seven Explore filter selects, the prefecture finder's search input and select on the geography article, and the selects in articles with local guidance or annotated documents are 14px. Fix: 16px font size on form controls on touch devices (`pointer: coarse`), never `maximum-scale`. Done with an unlayered `@media (pointer: coarse)` rule; every field measures 16px at 375px. | done |
| M9 | P3 | Platform-layer gaps from the `mobile-native` checklist: no `theme-color` meta (browser bar does not match the page), body uses `min-h-screen` (`100vh`, slightly taller than the visible area on phones with the URL bar showing; use `min-h-dvh`), no `touch-action: manipulation` on links and buttons, no tap-highlight handling. Hover styles are already gated by Tailwind v4. | planned |
| M10 | -- | Not verifiable here: sticky hover, tap delay, rubber-banding and the on-screen keyboard do not reproduce in emulation. Needs a pass on a real phone. | open |
| M7 | -- | Reviewed with no change needed: Saved, Reminders and Account empty and sign-in states, the mobile drawer, the geography article (the region map has legend buttons as a full-size alternative to the small map regions), glossary term and status pages. | done |

## Critique (impeccable, dual-agent)

Method: two isolated sub-agents (A: design review, B: detector and browser evidence), run after the owner approved spawning them. Target: home, Explore (filtered), onboarding, long articles, index pages. Detector: 2 findings, both known false positives. Browser evidence: no console errors, no failed requests, no overflow. The overlay could not be injected because the site's Content Security Policy blocks it, so only the CLI detector and measured evidence were used. Design Health Score from A: 28/40 (Good, lower edge). Not persisted to `.impeccable/` to keep the repo clean.

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| C1 | P1 | Onboarding: Save sits about 8 screens below the stage choice on a phone (7174px page; 20 journey cards in step 2). The helper line is not enough. Options: sticky bottom action bar once a stage is chosen; collapse the journey step behind an optional "Narrow by route" disclosure with a handful of featured journeys plus search. | decision |
| C2 | P1 | Phone fold on home: the stage cards start about 1160px down because the dark aside fills the first screen. Overlaps the parked H4. Option: on phones, place the aside after the stage cards or reduce it to a one-line note. | decision |
| C3 | P2 | Explore (desktop): auto-opening the filter panel duplicates what the chips already show and pushes results to about 1170px. Option: keep it closed everywhere and rely on the chips; add a result count near the chips and say when a filter matches the whole catalog (stage plus topic immigration returns 210). | decision |
| C4 | P2 | Long articles lose the outline once you scroll. Options: "back to outline" at each h2, a floating "On this page" button on phones, or a sticky side rail on wide screens. | decision |
| C5 | P2 | "Browse this group" repeats 12 times as link text; screen readers get no context. Give each link its group name. | planned |
| C6 | P2 | Home copy reads as unfinished ("Nihonest is becoming...", future tense on the what-to-expect cards); FAQ intro says "draft questions". Owner call on whether UI copy is in scope. | decision |
| C7 | P3 | Search placeholders truncate on phones on the FAQ, glossary and Explore pages. | planned |
| C8 | P3 | Residence statuses: three stacked callouts precede the first status; category chips orphan "Work" and "Visitor" on a second row (overlaps M4). | planned |
| C9 | P3 | Signed-out My Journey and Roadmap are dead ends (overlaps M5); consider a sample roadmap. | decision |
| C10 | -- | Critique claims checked and not adopted: "32px rows on Explore results" (whole-card stretched links) and "journey stage line near contrast limit" (measured: all text passes). | dropped |

## Decisions
- Eyebrow labels stay: they act as the page titles while headings summarise the page.

## Not yet reviewed
My Journey, Roadmap, FAQ, Glossary, Residence statuses, Can I do this?, Saved, Reminders, Account, header and footer interaction states (keyboard, mobile drawer).
