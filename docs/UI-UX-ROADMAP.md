# UI/UX Roadmap

Findings from the best-practice review of the site (detector plus code audit), with fixes tracked in priority order. Work happens on `claude/ui-ux-improvements`.

This is a working checklist, separate from the product roadmap in `ROADMAP.md`. Items are re-prioritised as pages are reviewed. Review is code-level; visible changes are checked by the owner.

**Status:** `done` (built and checked) · `planned` (agreed, not started) · `decision` (waiting for the owner) · `parked` (owner decision pending; do not implement without a preview or discussion) · `open` (cannot be closed from here, needs a person or a device) · `dropped` (decided not to do, with the reason in the row)

**Rules that apply to every item**
- Interface text goes through the message catalogs (`english.ts` and `japanese.ts`) in the same change; Japanese stays `machine-translated` until a qualified human reviews it.
- No right-facing arrows in the UI; the whole row or card is the link.
- Run `npm run test:e2e` before merge; CI runs it, `release:check` does not.

## Status at a glance

Updated 2026-10-12. Every row has exactly one status word in its last column. Counts: done 44, dropped 8, planned 1, decision 1, open 1 (55 rows).

**Still open**

| # | What | Needs |
|---|------|-------|
| H5 | Replace the repeated Tailwind teal and slate classes with named colour tokens (dark mode comes after) | agreed, not started; a code-structure change with no visible difference |
| M6 | Title case versus sentence case for labels (the drawer's "Adjust Starting Point" and others) | the owner's list or rule; no record of it exists |
| M10 | Sticky hover, tap delay, scroll bounce and the on-screen keyboard cannot be checked in emulation | a real phone, after the branch is deployed |
| (M13 caveat) | The prefecture map is about 17% larger on phones since the D8 flatten removed the panel padding | the owner's call: keep or restore the old size |

**Not part of the table but still to do:** merge `main` into this branch (brings in the favicon from Codex; deliberately not done yet), run `npm run test:e2e` against a clean server before merge, and a pass of the Japanese rendering of the flattened components and the not-found and error pages.

## Home page

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| H1 | P1 | New visitors saw no guides until they picked a stage. Added stage-browse section linking to Explore. | done |
| H2 | P1 | Hero CTA and aside swapped after preferences loaded. Placeholder holds space; `noscript` fallback. | done |
| H3 | P2 | Japanese hero typography (leading, tracking, size, font stack, `lang` tags). | done |
| H4 | P2 | The dark hero aside is a policy statement for new visitors, not something to act on. Owner decision: keep as is for now; revisit suggestions when we reach it. Resolved by C2: the aside is now a one-line note. | done |
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
| X1 | P3 | Japanese typography site-wide. Owner approved the preview and asked for it. Done: `<html lang>` now follows the selected language (set in `ContentLocaleProvider`, so screen readers can use a Japanese voice) and `globals.css` has `:lang(ja)` rules: phrase-aware line breaks (`word-break: auto-phrase`, Chromium only, ignored elsewhere), balanced headings with no negative tracking, 1.85 body leading, slightly open eyebrow tracking. Elements marked `lang="en"` are unaffected. Existing hero rules stay. Verified rendered on the roadmap, an article with its outline rail, the not-found page and Can I do this?; e2e checks `lang`, `word-break`, tracking and leading in Japanese and the English defaults. The body font stack was left as it was, as in the preview. | done |
| X2 | P3 | `border-l-4` blockquotes are flagged by the detector. They read as callouts here and are consistent; leave unless the visual direction changes. | dropped |
| X3 | -- | `gray-on-color` flag in `onboarding-actions.tsx` is the disabled state; false positive. | dropped |

## Bugs found during review

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| B1 | P1 | The Japanese version of an article logs three React hydration mismatch errors on load (checked on `/articles/artist-status` with Japanese selected; English and the other Japanese pages are clean). The mismatch is inside `RelatedJourneyLink` and `LocalizedText` in the "continue exploring" section, code this branch has not changed apart from a back-link class in the same file, so it looks pre-existing, but it has not been checked against `main`. React recovers by re-rendering on the client; the cost is a flash and an error in the console. Needs a fix and a check on `main`. Fixed: the locale is now read per component from the store instead of through context, so a boundary that hydrates late uses the server snapshot like everything else. Verified clean on the Japanese article, home, Explore and onboarding; e2e regression test added (`e2e/hydration.spec.ts`). Whether `main` had the same bug was not checked, but the cause was in code shared with it. | done |
| B2 | P3 | The site had no favicon or app icon (`/favicon.ico` returned 404 on the first load of every page). Added by Codex and pushed to the main branch; this branch picks it up when main is merged in. | done |

## Page review and mobile pass

Measured with a script across 19 pages (plus the four articles with special content sections) at 1280px and 375px, in English and Japanese: contrast, tap-target size, horizontal overflow and tiny text. Results: no contrast failures, no page-level horizontal overflow, no text under 12px. The first pass did not follow the `mobile-native` checklist; M8 to M10 come from applying it afterwards. Card titles that use a stretched link (`before:absolute before:inset-0`) are whole-card targets and were ignored.

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| M1 | P1 | Regression from E1: on phones, arriving with a filter (for example from a home stage card) auto-opened the filter panel, a tall stack of seven selects that pushed results out of view. The panel now stays closed below 640px; the chips already show what is applied. | done |
| M2 | P2 | Wide article tables force sideways scrolling on phones even with two columns (tax scope: `min-w-56` plus `min-w-80` is about 576px against a 343px column). Relax the minimum widths below `sm` so two-column tables wrap, and for the wider ones (renewal 596px, route comparison 497px) make the scroll area keyboard-focusable with an accessible name and a visible hint. The two text tables now wrap on phones; the numeric fee table keeps its scroll and is now a labelled, keyboard-focusable region. Verified at 375px. | done |
| M3 | P2 | Small touch targets on phones: "Back to ..." links are 19px tall on onboarding, My Journey, articles, glossary terms, statuses, journeys; the header logo is 28px and the footer logo 21px; the Japanese translation notice button "英語で読む" is 24px. Padded to 44px (`min-h-11`); remaining flagged rows are stretched-link card titles, which are whole-card targets. | done |
| M4 | P3 | Index pages put callouts before the main control and used `py-16 sm:py-24` against `py-12 sm:py-16` on the personal pages. Explore, FAQ, Glossary, Residence statuses and Can I do this? now use `py-12 sm:py-16`; the Glossary scope note is plain text instead of a box. Checked at 1280x800 and 375px. | done |
| M5 | P3 | My Journey and Roadmap had near-identical empty states. Resolved by C9: each now says what the page shows. | done |
| M6 | P3 | Drawer label "Adjust Starting Point" was title case while the same action reads "Adjust my starting point" elsewhere. Owner decision: limited scope, only this label, and disregard the earlier title-case idea. Changed to "Adjust my starting point" (the Japanese was already consistent); the header test follows. No other labels were changed. | done |
| M8 | P2 | iOS Safari zooms the page when a form field under 16px gets focus and does not zoom back. Measured at 375px: all seven Explore filter selects, the prefecture finder's search input and select on the geography article, and the selects in articles with local guidance or annotated documents are 14px. Fix: 16px font size on form controls on touch devices (`pointer: coarse`), never `maximum-scale`. Done with an unlayered `@media (pointer: coarse)` rule; every field measures 16px at 375px. | done |
| M9 | P3 | Platform-layer gaps from the `mobile-native` checklist: no `theme-color` meta (browser bar does not match the page), body uses `min-h-screen` (`100vh`, slightly taller than the visible area on phones with the URL bar showing; use `min-h-dvh`), no `touch-action: manipulation` on links and buttons, no tap-highlight handling. Hover styles are already gated by Tailwind v4. Done: `theme-color` and `color-scheme` (light) through the Next viewport export, `min-h-dvh` on the body, and `touch-action: manipulation` on links, buttons, summaries and labels. Deliberately not done: removing the tap highlight (touch devices have no hover feedback, so the highlight is the only press feedback until every tappable element has an `:active` style), `user-select: none` on controls, and `viewport-fit=cover` (no edge-to-edge UI; the sticky bars already fall back to zero safe-area padding). | done |
| M10 | -- | Not verifiable here: sticky hover, tap delay, rubber-banding and the on-screen keyboard do not reproduce in emulation. Needs a pass on a real phone. | open |
| M11 | P2 | Prefecture map ("Guidance by location") trapped vertical swipes on phones: the map surface was `touch-action: none`, so a swipe that started on it (about a third of a phone screen) could not scroll the page. Confirmed with raw touch events. Now `pan-y` at 1x so the page scrolls, `none` once zoomed so drags pan the map. Verified at 1x and 7.3x; e2e regression test added (`e2e/map-touch.spec.ts`). | done |
| M12 | -- | Map pan buttons use arrow glyphs. Settled exception to the no-arrows rule (map controls, the glossary study prompt labels and an official source title); do not raise again. | dropped |
| M13 | P3 | Prefecture shapes are small at full view. Owner decision: do not change how prefectures are rendered or their sizes; add hover labels instead. Done: hovering a prefecture (mouse or pen) shows a small label beside the pointer, English users see "Kyoto · 京都府" and Japanese users "京都府" (the same convention as the finder list); keyboard focus shows it too; touch never does, so a tap leaves no sticky label; it flips to the left near the right edge and hides while dragging or zooming. The Okinawa inset has it as well. Shape rendering is untouched. Caveat: the map measures about 17% larger on phones (smallest 9px, median 17px, up from 8px and 14px) because the D8 flatten removed the finder panel's padding; owner call whether to keep that. Not exercised: the region map has no hover label (not requested), and mouse-wheel zoom was not tested. | done |
| M14 | P3 | Open review for after deployment: the prefecture map measures about 17% larger on phones (smallest 9px, median 17px, up from 8px and 14px) because the D8 flatten removed the finder panel's padding. Owner call, made on a real phone: keep or restore. Reviewed together with the other mobile checks (M10). | open |
| M7 | -- | Reviewed with no change needed: Saved, Reminders and Account empty and sign-in states, the mobile drawer, the geography article (the region map has legend buttons as a full-size alternative to the small map regions), glossary term and status pages. | done |

## Critique (impeccable, dual-agent)

Method: two isolated sub-agents (A: design review, B: detector and browser evidence), run after the owner approved spawning them. Target: home, Explore (filtered), onboarding, long articles, index pages. Detector: 2 findings, both known false positives. Browser evidence: no console errors, no failed requests, no overflow. The overlay could not be injected because the site's Content Security Policy blocks it, so only the CLI detector and measured evidence were used. Design Health Score from A: 28/40 (Good, lower edge). Not persisted to `.impeccable/` to keep the repo clean.

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| C1 | P1 | Onboarding: Save sits about 8 screens below the stage choice on a phone (7174px page; 20 journey cards in step 2). Owner decision: a sticky bottom action bar once a stage is chosen (safe-area padding, same "Save my starting point" and skip actions). The journey step is not collapsed. Built as a bar fixed to the bottom of the viewport once a stage is chosen. Revised on the owner's request: Save and Skip (or Remove) share one line with Skip on the right; phones show "Save Starting Point" and "Skip", wider screens the full wording. | done |
| C2 | P1 | Phone fold on home: the stage cards start about 1160px down because the dark aside fills the first screen. Owner decision (resolves H4 for phones): reduce the aside to a one-line note. Now one quiet line under the call-to-action; the hero is single column. | done |
| C3 | P2 | Explore (desktop): the auto-opened filter panel duplicated the chips. Owner decision: keep the panel closed everywhere and rely on the chips. No extra result count; the existing one is enough. Remove the auto-open from E1 and update its tests. The panel never auto-opens; E1's auto-open and its tests were removed. | done |
| C4 | P2 | Long articles lose the outline once you scroll. Owner decision: try a floating "On this page" button on phones (opens the same outline) and a sticky side rail on wide screens. Needs a preview or a visible check before it is kept. Built: a sticky rail beside the article from 1280px up that marks the current section; below that, the collapsed row plus a floating "On this page" button (shown once the row has scrolled away) that opens the same list as a bottom sheet. Only one presentation shows at a time. Rendered check at 1440px and 375px; the Japanese rendering and the owner's keep-or-change decision are still open. | done |
| C5 | P2 | Checked and not needed: each group card link already has an accessible name ("Explore {group title}") through `aria-label`, and the visible "Browse this group" line is decorative and hidden from screen readers. | dropped |
| C6 | P2 | Public copy reads as unfinished. Owner decision: rewrite to describe a finished product, in English and Japanese. Rewrite scope (present tense, no "becoming", no "draft" framing): `home.description`, the three `home.principle*Description` cards, `faq.pageDescription`, `statusesPage.intro`, `statusExplorer.showing`, `guidance.intro`, and the future-tense lines in `activityPage.intro`, `roadmap.emptyBody`, `onboarding.description`. Keep as written because they are accurate status statements: machine-translation and pilot labels (`translation.*`, `language.japanesePilot`, `explore.japanesePilotNotice`), `notify.deliveryNote` (email delivery is not active yet), and the local-guidance coverage notices. These need the owner to confirm before any change. Done: rewritten in English; the Japanese had no future or draft framing except `statusesPage.intro`, `statusExplorer.showing`, `guidance.intro` and `home.principleAccessDescription`, which were updated. Left as written by owner decision: machine-translation and pilot labels, the email-delivery note, the local-guidance coverage notices, and the Draft badges and the "Draft coverage" notice on statuses (`status.draft`, `statusesPage.draftStrong` and `draftBody`, `article.statusDraft`, `faq.statusDraft`). Those last ones still say records are incomplete; flag for the owner. | done |
| C7 | P3 | Search placeholders were too long for phones on the Explore, FAQ and glossary pages. Shortened in English and Japanese; measured to fit at 375px and 320px. | done |
| C8 | P3 | Residence statuses: callouts stacked before the first status. The activity prompt is now one inline line under the heading; the Special Permanent Resident note moved below the list as a footnote (wording changed from "listed below" to "listed above", English and Japanese). | done |
| C9 | P3 | Verified: this is not a sign-in issue. Both pages depend only on whether a starting point is saved in this browser. With none saved, My Journey shows "Choose your journey through Japan" and Roadmap shows "Build your roadmap from a starting point", each with one button to the same onboarding page. Once a stage is saved they differ: My Journey shows suggested guides or the guided journey; Roadmap shows an overview, a progress bar, phases and checklists. The critique called the empty states dead ends because both are only a prompt. Options: leave as is; make each empty state say what that page will show; or add a clearly labelled example. Chosen: option 2. Both empty states now say what the page shows (English and Japanese). | done |
| C10 | -- | Critique claims checked and not adopted: "32px rows on Explore results" (whole-card stretched links) and "journey stage line near contrast limit" (measured: all text passes). | dropped |

## Skill coverage audit

Some early work was done without loading the UI skills (the owner called this out on 2026-10-11). This table records, per item, whether a skill was used at implementation, what skill-based check happened afterwards, and what is still owed. Both critiques (the first dual-agent, the second single-session) and the `typeset` pass on the Japanese surfaces have since been run.

| Item | At implementation | Checked afterwards | Still owed |
|---|---|---|---|
| H1 stage cards, H8 hero spacing | none / layout guidance | critique 1; reshaped by C2 | nothing |
| H2 CTA placeholder | none | critique 1 evidence (no console or layout errors) | a look at the loading transition itself, which has not been viewed |
| H3 Japanese hero typography | none | `typeset` pass; superseded by the site-wide X1 rules | nothing |
| H6 skip link | none | none | keyboard and focus-style check in English and Japanese |
| H9 in-sentence stage names | none | none | Japanese phrasing read-through |
| E1 to E4 Explore | craft floor for E1 | critique 1; C3 and C7 follow-ups | nothing |
| O1 to O3 onboarding | none | critique 1; C1 follow-up; Japanese bar checked | nothing |
| A1 article outline | none at first; layout and polish after the rework | critique 1; C4 rail and sheet; Japanese rendered | nothing |
| First page review and mobile pass | none | `mobile-native` and `adapt` applied afterwards (M2, M3, M8, M9) | real-device pass (M10) |
| C1 to C9 | `impeccable` skills and `mobile-native` | second critique; rendered at phone and desktop; Japanese checked for C1, C2, C4, C9 | Japanese rendering of C3 |
| D1 to D8 | `impeccable` harden, clarify, layout, distill | rendered checks | Japanese rendering of the flattened components and of the not-found and error pages |

## Second critique (pages the first pass missed)

Method: degraded single-context (sub-agents were approved for the first critique only; design review and measurements were run in sequence by one session). Pages: Saved, Reminders, Account, Can I do this?, glossary term, residence status detail, content group, guided journey, and the not-found page, at 1280px and 375px. Measurements (36 page-views in English and Japanese): no contrast, overflow, tap-target or tiny-text findings; no repeated link names. Detector findings: none new. Overlay injection is blocked by the site's Content Security Policy.

| # | Pri | Finding | Status |
|---|-----|---------|--------|
| D1 | P2 | There was no custom not-found page: an unknown address showed the framework's white 404 with tiny text and no way back. Added `src/app/not-found.tsx` (eyebrow, plain explanation, "Search the guides" and "Go to the home page"), English and Japanese, still HTTP 404; e2e test added. | done |
| D2 | P2 | No error pages: a runtime failure would show the framework's default error screen. Added `src/app/error.tsx` (keeps the site chrome; says the fault is not the visitor's; retry and home) and `src/app/global-error.tsx` (own markup, English with a Japanese line, because it replaces the root layout and cannot read the saved language). Uses `retry`, this Next version's recovery prop (not `reset`). Rendered with a probe page that threw (since deleted); unit tests for both languages. `global-error` itself has not been triggered. | done |
| D3 | P2 | Cards nested inside a card. Owner decision: drop the outer panel's border and fill. Done for residence status guidance, the activity picker, local guidance, the article journey section and glossary study. The sweep (D8) then found and flattened the rest. | done |
| D4 | P3 | Can I do this?: the disclaimer box pushed Step 1 down. Owner decision: a one-line note under the intro, like the home hero. Now "General information, not legal advice. This tool does not determine eligibility or permission. The full notice is below."; the original full notice follows the tool unchanged, as a plain note. English and Japanese. Checked at 375px: Step 1 and the first card are on the first screen. | done |
| D5 | P3 | Guided journey pages open with two stacked introduction paragraphs and use the wide layout. Owner decision: leave as is. | dropped |
| D7 | P2 | Owner request: "Change route" in a guided journey must scroll to the selectable journey phase. The link now carries `#choose-route`; an anchor at the top of the route-choice phase gives the browser a target, and `ScrollToRouteChoice` scrolls there on mount (instant under reduced motion, smooth otherwise) and moves focus to the phase heading. Works from the journey page and from My Journey (`?changeRoute=1`). Two e2e tests added (`e2e/change-route.spec.ts`). Follow-up: the first version snapped instead of scrolling because the site's `data-scroll-behavior="smooth"` makes Next force instant scrolling on route changes, and Next also jumped to the anchor. The link now passes `scroll={false}`; an e2e test samples the scroll position and fails if it jumps. | done |
| D8 | P3 | Nested-card sweep, based on a rendered-DOM scan of 23 pages plus saved-preference and chosen-location states. Flattened: the accordion groups on FAQ, Residence statuses and Glossary (heading row with a rule, cards on the page); the Key Japanese terminology panel; the Guidance by location panel; the Roadmap phase list; the guided journey outline; and the annotated document viewer. Kept on purpose: the diagram of the sample document (it represents the document), single panels that hold inputs or chips rather than cards (search, filters, notices), and the hidden term tooltips the scan flagged by mistake. The scan was run on desktop only. | done |
| D6 | -- | Reviewed with no change needed: glossary term page (clear hierarchy, the Japanese term as the anchor), content group page (the ordered-path callout is well placed), Saved, Reminders and Account empty and sign-in states, activity cards (distinct link names). | done |

## Decisions
- Eyebrow labels stay: they act as the page titles while headings summarise the page.

## Not yet reviewed
Nothing is waiting for a first review. Remaining checks are the real-device pass (M10) and the Japanese rendering of the newest components, listed under Status at a glance.
