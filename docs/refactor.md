You do not need a permanently “finished” web application before starting the native app. You do, however, want the content model, shared domain logic, synchronization contracts, and backend API to be stable first. The current roadmap order—finish canonical content and localization, complete hosted integration, then begin native development—is sensible.

## Native application timing

The ideal native starting point is when these foundations are stable:

- Article, glossary, FAQ, journey, and roadmap schemas
- Stable content IDs and relationships
- Authentication and account synchronization contracts
- Saved-content and progress merge behavior
- Notification/reminder contracts
- Localization artifact format
- A portable content format suitable for offline storage
- A reachable hosted backend for real cross-device testing

The website does not need every future feature or every municipality completed. It needs a stable vertical foundation that the native client can consume without repeatedly redesigning its data model.

### Would work be duplicated?

Some work must be implemented separately because native UI is genuinely different:

- Navigation
- Screens and layouts
- Form controls
- Accessibility implementation
- Native notifications
- Offline downloads
- Secure authentication storage
- App lifecycle and network-state handling

Next.js pages, DOM components, CSS, and MDX rendering cannot simply be dropped into React Native. Trying to maximize UI sharing usually produces an inferior native application.

A substantial amount should remain reusable:

- Zod schemas
- Domain types
- Search normalization and ranking
- Journey resolution
- Roadmap recommendations
- Saved-content and progress contracts
- Merge logic
- API request/response contracts
- Content metadata
- Stable IDs and taxonomy
- Validation and integrity checks

That separation is already explicitly anticipated in [ARCHITECTURE.md](C:/Users/T3/Documents/Websites/nihonest/docs/ARCHITECTURE.md:861) and [DECISIONS.md](C:/Users/T3/Documents/Websites/nihonest/docs/DECISIONS.md:415).

### Same repository or separate project?

I recommend one repository with workspaces once native development actually begins:

```text
apps/
  web/
  mobile/
packages/
  domain/
  content-contracts/
  search/
  synchronization/
  api-contracts/
content/
```

Expo officially supports workspace-based monorepos and describes them as useful when multiple applications share code. It also acknowledges their additional tooling complexity, which supports the existing decision not to introduce one before the second application exists. [Expo monorepo guidance](https://docs.expo.dev/guides/monorepos/).

A completely separate repository would require coordinating schema releases, content artifacts, tests, and compatibility across repositories. That is feasible, but unnecessarily cumbersome for one developer and one closely related product family.

The likely sequence should be:

1. Refactor reusable web logic into cleaner platform-independent modules.
2. Finish localization and canonical content stabilization.
3. Complete hosted integration.
4. Convert the repository into workspaces.
5. Move the existing web application into `apps/web`.
6. Create the Expo application under `apps/mobile`.
7. Move only genuinely shared code into `packages/*`.

That avoids copying the current repository and avoids creating packages speculatively.

## Current project organization

The overall architecture is sound. The meaningful boundaries are already present:

- `src/app` — Next.js routing
- `src/components` — presentation and interaction
- `src/domain` — schemas and rules
- `src/lib` — orchestration and adapters
- `src/data` — canonical registries
- `content` — editorial bodies and review artifacts
- `supabase` — database migrations and policies

The main scalability concern is centralized file size and ownership, not a fundamentally incorrect structure.

The files most likely to benefit from splitting include:

- `src/data/glossary-additions.ts`
- `src/data/structured-residence-status-guidance.ts`
- `src/data/annotated-documents.ts`
- `src/data/discovery.ts`
- `src/data/sources.ts`
- `src/lib/content/articles.ts`
- `src/components/site-header.tsx`
- `src/components/personalization/onboarding-form.tsx`
- `src/components/discovery/explore-discovery.tsx`
- `src/components/documents/annotated-document-viewer.tsx`

### Recommended data organization

Large registries should be divided by a stable domain boundary rather than an arbitrary line limit:

```text
src/data/
  glossary/
    immigration.ts
    employment.ts
    education.ts
    taxes.ts
    municipal.ts
    index.ts

  sources/
    immigration.ts
    employment.ts
    education.ts
    taxes.ts
    municipal.ts
    index.ts

  discovery/
    groups.ts
    shared-steps.ts
    journeys/
      study.ts
      professional-work.ts
      family.ts
      business.ts
    index.ts

  annotated-documents/
    identity.ts
    municipal.ts
    tax.ts
    index.ts
```

Each `index.ts` would combine and validate its modules. This preserves a single public catalog while reducing merge conflicts and making ownership clear.

The article registry should eventually be generated or split into categorized registration modules. Any change there must respect Next.js MDX compilation behavior, so it should not be replaced with unrestricted runtime file discovery without verifying Next.js bundling requirements.

### Recommended component splitting

Large interactive components should be divided by behavior:

```text
components/navigation/
  site-header.tsx
  desktop-navigation.tsx
  mobile-navigation-drawer.tsx
  account-navigation-menu.tsx

components/discovery/
  explore-discovery.tsx
  explore-filter-panel.tsx
  explore-results.tsx
  grouped-results.tsx
  use-explore-state.ts

components/documents/
  annotated-document-viewer.tsx
  document-location-selector.tsx
  document-version-selector.tsx
  document-field-list.tsx
```

The parent component should retain orchestration while smaller components handle a coherent interaction or presentation responsibility.

### Comments and developer orientation

Adding comments everywhere is not ideal. The existing documentation standard is correct: comments should explain invariants, ownership, synchronization, or surprising behavior—not restate JSX or variable names.

The most useful combination would be:

- Module-level comments describing responsibility and prohibited dependencies
- JSDoc on exported contracts and complex functions
- Comments beside non-obvious merge, routing, applicability, and fallback logic
- Small `README.md` files inside complex domains such as synchronization, localization, notifications, and annotated documents
- A dependency map explaining flows such as:

```text
data → schema validation → content adapter → page/component
local state → account service → synchronization contract → Supabase
source record → monitoring → editorial review → article dependency
```

Cross-file comments should refer to stable concepts or exported symbols instead of brittle line numbers or file paths.

I would schedule a dedicated structural-refactoring checkpoint before full Phase 14 localization. Localization will greatly increase catalog volume, so splitting the registries before multiplying language artifacts would reduce future work.

## Database and content storage

The ideal architecture is hybrid rather than “put everything in a database.”

| Information | Recommended home |
|---|---|
| Canonical article text and editorial history | Repository/Git |
| Taxonomy, sources, relationships, and content metadata | Repository now; relational database only if a CMS is later justified |
| Accounts, preferences, saved items, progress, reminders | PostgreSQL/Supabase |
| Images, PDFs, downloadable bundles, audio | Object storage |
| Native offline catalog | Versioned bundle cached in SQLite |
| Authentication credentials | Platform-secure credential storage |
| Native unsynchronized mutations | Local SQLite/outbox plus cloud reconciliation |

### Articles should remain repository-controlled for now

Moving the current articles into object storage would add more overhead than value:

- No meaningful query capability inside MDX files
- Additional network dependency
- Cache invalidation and version coordination
- More complicated previews and editorial approval
- Separate backup and migration concerns
- Harder Git diffs and human review
- Runtime failure modes for otherwise public static content

Object storage is designed primarily for files and media. Supabase itself recommends storing media files outside the database because of their size. [Supabase Storage guidance](https://supabase.com/docs/guides/storage/quickstart).

For Nihonest, object storage would be appropriate for:

- Officially reusable document images
- Annotated image derivatives
- PDFs
- Future audio files
- Versioned downloadable native content bundles
- Possibly prebuilt localization bundles

It is not presently the ideal canonical home for article bodies.

### If a CMS is eventually introduced

A future content database should combine relational fields with limited JSONB rather than storing each article as one opaque object:

```text
content_items
content_revisions
localized_revisions
content_sources
content_relationships
content_taxonomy
publication_events
media_assets
editorial_approvals
```

Fields such as stable ID, slug, status, locale, revision, publication state, and dates should be ordinary relational columns. Flexible article blocks or document annotations could use carefully validated `jsonb`. PostgreSQL supports indexing and querying JSONB, but that does not mean every related entity should be collapsed into one document. [PostgreSQL JSONB documentation](https://www.postgresql.org/docs/17/datatype-json.html).

### Native offline storage

When native development begins, a versioned catalog bundle backed by SQLite is likely the best fit:

```text
manifest
  catalogVersion
  generatedAt
  locale
  checksum

articles
glossary
faqs
groups
journeys
sources
```

The native application could ship with a baseline database or content bundle, download newer immutable versions, verify the checksum, and atomically switch versions. Expo’s current SQLite library provides persistent databases across application restarts and supports full-text-search extensions, making it a plausible choice for offline catalog search. [Expo SQLite documentation](https://docs.expo.dev/versions/latest/sdk/sqlite/).

Private user state would continue synchronizing through Supabase, while public content could be downloaded anonymously.

## Overall recommendation

I would not move articles into a database now, and I would not begin full native development yet.

The best next architectural sequence is:

1. Complete the remaining Phase 13 discovery and audit.
2. Run a behavior-preserving file-organization refactor.
3. Complete Phase 14 canonical localization artifacts.
4. Perform hosted integration and validate the shared backend.
5. Introduce the monorepo and Expo native application.
6. Add versioned offline content bundles and SQLite during the native phases.

This keeps the current low-cost repository-first model, reduces future duplication, and gives the native app stable contracts without waiting for Nihonest to be “finished forever.”