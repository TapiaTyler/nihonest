# Structural refactor and native-app readiness

Status as of 2026-09-23. This tracks what must be true before Phase 15 (native application foundation) in
`docs/ROADMAP.md` begins, what is already done, and what remains.

## Principles (unchanged)

- The native app needs stable contracts, not a finished website. Content schemas, stable IDs, account
  synchronization, notification contracts, the localization artifact format, a portable offline content format,
  and a reachable hosted backend must be stable first.
- Native UI is built separately: navigation, screens, form controls, accessibility, notifications, offline
  downloads, secure credential storage, and app lifecycle. Next.js pages, DOM components, CSS, and MDX rendering
  are not shared.
- Shared code: Zod schemas, domain types, search normalization and ranking, journey resolution, roadmap
  recommendations, saved-content and progress contracts, merge logic, API contracts, content metadata, taxonomy,
  and validation.
- Articles stay repository-controlled (Git) until a CMS is justified. Accounts, preferences, saved items,
  progress, and reminders live in Supabase. Media and downloadable bundles belong in object storage. The native
  app caches a versioned content bundle in SQLite and keeps unsynchronized changes in a local outbox.

## Completed

- **File organization (`b00d344`).** The large registries and components named in the original plan were split
  along domain boundaries: glossary, sources, discovery, annotated documents, and structured residence-status
  guidance each have per-domain modules behind an `index.ts` that validates the combined catalog. The article
  registry is split into categorized registration modules, and the site header, onboarding form, Explore
  discovery, and annotated-document viewer are split by behavior. The largest of those files is now 159 lines.
- **Domain boundary.** `src/domain` imports nothing from Next.js, React, Supabase, `@/lib`, `@/data`, or
  `@/components`, and `npm run architecture:check` enforces this (343 production modules, no cycles).
  `src/data` may not import `@/app` or `@/components`.
- **Synchronization is client-agnostic.** `src/lib/sync/account-content-sync.ts` takes a `SupabaseClient`
  parameter and validates state with `src/domain/sync`, so a native client can reuse it unchanged.
- **Localization artifact format.** Translations are revision-addressed artifacts
  (`src/domain/translation`), rendered with English fallback. Server pages pass artifacts to client components as
  props; full translation catalogs are not imported by client components.
- **Portable article format and content bundle.** English bodies used the same Markdown subset as the
  Japanese translations, so one block model now serves both.
  - `src/domain/article/article-blocks.ts` defines the block schema (paragraph, H2/H3 heading, blockquote,
    ordered and unordered list, and a `component` block for the five shared components) and the parser. Inline
    text stays Markdown: `**bold**`, `*italic*`, and `[label](/path)` links.
  - `src/domain/article/article-source.ts` splits the MDX metadata literal from the body and converts the
    shared-component tags to `:::directive` lines without editing the English sources. Any other JSX, import,
    export, or expression is rejected. The Vitest MDX plugin and the translation scripts use the same splitter.
  - `npm run content:bundle` writes `build/content-bundle/` (gitignored): a manifest (format version, catalog
    version derived from SHA-256 file checksums, generation time) and JSON files for English articles, current
    Japanese article translations (stale ones are excluded so clients fall back to English), glossary, FAQs,
    sources, residence statuses, article groups, and journeys. About 2 MB before compression.
  - All 95 English articles convert, and English and Japanese block structure matches in all 95. The tier-1
    article check now reports structure differences.
  - Not yet bundled: Japanese overlays for glossary, FAQs, statuses, and journeys, local guidance, and annotated
    documents. Add them when the native catalog needs them.
- **One storage interface.** `src/lib/storage/key-value-store.ts` defines a synchronous `KeyValueStore`, a
  `StorageEnvironment` (which stores exist, plus change subscription and notification), and `storedValue(key,
  area)`, which handles fallbacks, removal, and change notification for one key. The browser environment binds
  persistent state to localStorage (with cross-tab `storage` events) and session state to sessionStorage.
  `setStorageEnvironment` swaps the binding; a native client can use Expo SQLite's synchronous key-value store
  without changing callers. The ten storage modules keep their exported functions and storage keys, so saved
  data is unaffected; each is now a few lines over `storedValue`. A test runs the saved-content module on a
  non-browser environment.
- **Stricter architecture gate.** `npm run architecture:check` also rejects browser globals (`window`,
  `document`, `localStorage`, `sessionStorage`, `navigator`, outside comments) and Node built-ins in
  `src/domain`. The portable `src/lib` subtrees (`search`, `sync`, `translation`) additionally may not import
  Next.js, React, `server-only`, `@supabase/ssr`, `@/app`, `@/components`, or the browser-bound `@/lib/supabase`,
  `@/lib/storage`, and `@/lib/accounts`. Server-only files inside those subtrees are listed with a reason
  (currently `translation/source-revision.ts`). `src/lib/notifications` is not portable: it mixes server email
  delivery with the browser client, and its shared rules live in `src/domain/notifications`.
- **Interface-message catalogs split by locale.** English and Japanese live in
  `src/domain/localization/interface-message-catalogs/english.ts` and `japanese.ts` (the Japanese file must
  supply every English key, checked by the type system and a test). `interface-message-lookup.ts` holds the shared
  lookup, placeholder filling, and service-message mapping. Server code keeps using `interface-messages.ts`, which
  loads both. In the browser, `useInterfaceMessages()` bundles only English and loads Japanese as a separate
  chunk when it is selected, starting during hydration for returning Japanese readers and showing English until
  it arrives. English pages no longer download the Japanese catalog (about 50 KB of source).
- **Lint clean.** The account-sync provider restarted itself through a self-referencing callback to handle an
  account switch mid-request, which the React Compiler's `react-hooks/immutability` rule rejects. It now runs one
  pass per account in a single loop under the same in-flight guard. A new test covers a switch during a request:
  the previous account's response is discarded and the new account synchronizes.
- **Baseline (2026-09-23).** Type checking, lint, and all 370 tests pass.

## Remaining before Phase 15

1. **Check `Intl` under Hermes.** Japanese collation (`Intl.Collator("ja")` in geography sorting and search)
   and time-zone formatting in `src/domain/notifications` should be verified in the first Phase 15 spike.

Account and sign-in (`src/lib/accounts/client-account-service.ts`) are tied to the browser Supabase client and
OAuth redirects by design; the native app implements its own sign-in with secure session storage while sharing the
account and sync contracts.

## Monorepo sequence (when Phase 15 starts)

One repository with workspaces, introduced only when the second app exists (Expo supports workspace monorepos):

```text
apps/web        the current Next.js application
apps/mobile     the Expo application
packages/*      only genuinely shared code: domain, content contracts, search, synchronization, API contracts
content/        canonical articles and review artifacts
```

1. Finish the remaining item above (the Hermes check happens in the first Phase 15 spike).
2. Finish canonical content, localization, and hosted integration.
3. Convert the repository to workspaces and move the web app into `apps/web`.
4. Create `apps/mobile`.
5. Move shared code into `packages/*` as the native app needs it, not speculatively.

## Native offline content

The native app ships with a baseline bundle, downloads newer immutable versions anonymously, verifies checksums,
and switches versions atomically. Expo SQLite persists across restarts and supports full-text search. Private
state continues to synchronize through Supabase. The content bundle (`npm run content:bundle`) is the input to that database.
