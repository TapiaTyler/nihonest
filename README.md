# README.md

# Nihonest

**Find your place in Japan.**

Nihonest is a mobile-first public knowledgebase and future personal companion for foreigners preparing to move to Japan or already living in Japan.

Its goal is to make reliable information easier to understand, connect users with authoritative sources, teach important Japanese terminology, and eventually help users track the parts of their Japan journey that are relevant to them.

## Core Philosophy

Nihonest is:

- public first;
- privacy minimal;
- source conscious;
- mobile first;
- structured for personalization;
- designed for future web/native synchronization.

The public knowledgebase does not require registration.

Future accounts exist for features such as synchronization, saved content, progress, reminders, and personalization.

## Project Status

Nihonest has completed its web, structured-content, discovery, and anonymous-personalization foundation phases.

The repository now contains a Next.js application shell, 58 validated MDX articles, controlled taxonomy, structured official sources, 29 canonical residence-status records, route-aware guidance, and a searchable 67-term Japanese administrative glossary. Explore presents 11 purpose-based groups while integrated search and structured filters can reveal groups, individual guides, and glossary terms across the knowledgebase. Sixteen mapped journeys use shared phases, explicit route branches, and explained conditional tasks, including ongoing tax, side-work, status-maintenance, special-purpose visit, and departure paths. Selecting a route resolves one focused sequence; contextual article URLs preserve previous, next, and table-of-contents navigation without making unrelated alternatives sequential. Optional onboarding stores a validated stage plus an optional searchable journey and specific route locally, then personalizes a few Home and Explore starting points without requiring an account, hiding public content, or asserting eligibility. Article terminology links expose kana and romaji through hover, focus, or a touch-safe first tap, and active Explore and Glossary discovery state persists in the URL. Newly expanded visa, legal, tax, and glossary coverage remains explicitly marked as draft pending the Phase 13 research and review pass.

## Planned Web Stack

- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS
- MDX
- Zod
- Vitest
- React Testing Library
- Playwright

Potential UI components may use shadcn/ui where appropriate.

## Planned Future Services

When required by later roadmap phases:

- Supabase Auth
- PostgreSQL
- passwordless email authentication
- Google authentication
- Apple authentication
- machine translation
- email reminders
- native push notifications

Providers that do not need to be selected yet remain intentionally deferred.

## Future Native Applications

Native iOS and Android applications are planned using:

- React Native
- Expo
- TypeScript

The web and native applications should eventually share:

- authentication;
- backend;
- user data;
- domain models where practical;
- validation;
- business logic.

## Documentation

Before contributing or asking an AI coding assistant to modify the project, read:

1. `docs/PRODUCT.md`
2. `docs/ARCHITECTURE.md`
3. `docs/CONTENT-GUIDELINES.md`
4. `docs/ROADMAP.md`
5. `docs/DECISIONS.md`

These documents are the project's current source of truth.

## AI-Assisted Development

Codex may be used to assist development.

Before implementation, Codex should read all project documentation.

Codex should:

- implement only the active roadmap scope;
- avoid prematurely building deferred features;
- explain architectural conflicts;
- update documentation when a significant decision changes;
- recommend appropriate Git commit checkpoints;
- provide a concise commit message at each checkpoint;
- recommend validation commands before committing.

Codex must not commit or push automatically unless explicitly requested.

## Git Commit Style

Preferred format:

```text
type: concise description
```

Examples:

```text
docs: add initial product and architecture specifications
chore: scaffold Next.js web application
feat: add structured content taxonomy
feat: add searchable Japanese glossary
fix: correct glossary search normalization
test: add knowledgebase search coverage
refactor: separate persistence from journey UI
```

## Current Development Order

1. Commit product and architecture documentation.
2. Scaffold the Next.js application.
3. Establish structured content and taxonomy.
4. Add residence-status domain model.
5. Add searchable glossary.
6. Add search and filters.
7. Add anonymous journey personalization.
8. Refine and deploy the public web MVP.
9. Add cloud accounts and synchronized functionality later.

See `docs/ROADMAP.md` for the complete long-term plan.

## Deployment

The initial web application is expected to deploy through Railway after the project:

- runs locally;
- passes tests;
- successfully completes a production build.

Do not provision cloud infrastructure solely because it is mentioned in the long-term architecture.

## Product Mission

Nihonest exists to help foreign residents and prospective residents understand their responsibilities, navigate official processes, learn the Japanese terminology they will encounter, and participate in Japanese society legally and responsibly.

It should make official information easier to navigate without presenting itself as a replacement for Japanese authorities or qualified professionals.

## License

No license has been selected yet.
