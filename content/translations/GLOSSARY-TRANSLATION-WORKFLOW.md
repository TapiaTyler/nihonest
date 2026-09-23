# Japanese glossary translation workflow

Claude owns Japanese glossary translation: drafting, review, and integration. Follow [CLAUDE-TRANSLATION-REPORT.md](CLAUDE-TRANSLATION-REPORT.md), which has the workflow, the user's rules and decisions, and the current catalog status.

Key files:

- English source records: `src/data/glossary/*.ts` (canonical)
- Japanese catalog: `src/data/translations/ja/glossary-translations.ts`, checked by its adjacent test
- Translation prompt: `content/translations/JAPANESE-GLOSSARY-PROMPT.md`
- Protected terminology: `src/data/translations/ja/protected-terminology.ts`
- Draft command: `npm run glossary:draft` (`scripts/draft-glossary-translations.ts`)

Preserve existing artifacts and their provenance, and do not retranslate unchanged terms. Keep every artifact `machine-translated`: Claude's review is not qualified human review. Do not commit or push unless the user asks.
