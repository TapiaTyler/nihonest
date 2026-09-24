# Japanese glossary translation

Claude owns Japanese translation work for Nihonest, drafting and reviewing it; the user delegated it on 2026-09-23. There is no Codex review step. Every artifact stays `machine-translated` until a qualified human reviews it: Claude's review is not human review.

## Workflow

1. Draft with one command per batch of five. Several batches can run in parallel.

   ```bash
   npm run glossary:draft -- --next 5 --model opus
   ```

   Add `--topic <topicId>`, or pass `--ids a,b,c`. The command builds the prompt from `JAPANESE-GLOSSARY-PROMPT.md`, protected terms, accepted examples, and each term's linked-article excerpts in English and Japanese. It runs an isolated, tool-free Claude call, applies the mechanical checks, and writes `summary.md` under `.glossary-drafts/<run>/`.
2. Act on the exit code:
   - **0**: no errors and no blocking flags.
   - **2**: an ambiguity no linked article settles. Ask the user which meaning is intended; never propose editing the English. Integrate the rest of the batch.
   - **1**: a mechanical error. Rerun once. A protected-term error can be a false positive when the English uses the phrase in its everyday sense (e.g. "Student status" meaning being a student), so check before rerunning.
3. Read every draft against its English record and linked article before integrating, and fix anything wrong. Apply the rules and decisions below.
4. Integrate the catalog lines from `summary.md` into `src/data/translations/ja/glossary-translations.ts`, using `pipelineGenerator` (`claude-code-claude-reviewed`) and the batch's `generatedAt`. If the summary prints a new prompt revision, add it to `japaneseGlossaryPromptRevisions` under the batch date. Artifacts keep the revision they were made with, so prompt edits affect only new batches.
5. Update the counts in `glossary-translations.test.ts` and run that test. Update the coverage snapshot in `docs/LOCALIZATION-ROLLOUT-PLAN.md`.
6. Report the added IDs, anything held for the user, and local links to review.

## Rules from the user

- English pages are authoritative. A glossary record and its linked articles are one source: the record summarizes, and the article spells it out. Do not suggest English edits unless the user asks.
- Decide a word's sense from its own sentence first, then from the articles. A similar article passage does not override the record sentence's context.
- Prefer official Japanese terms; the site gives advice grounded in official sources.
- In this site's context, a person's "status" or "condition" usually means their residence status.

The last three rules are in `JAPANESE-GLOSSARY-PROMPT.md`.

## Decisions to preserve

Do not revert these user decisions:

- **hi-eijusha:** the remittance clause keeps the catalog form 「国外で支払われた国外源泉所得について、日本への送金が課税範囲に影響する場合があります」. Claude drafts tend to write 「…日本へ送金された国外源泉所得について」, which wrongly limits the rule to the remitted income.
- **tokubetsu-choshu:** "departure" means leaving a job (退職). The sentence lists job-status changes.
- **gino-jisshu:** 技能等の移転, the official term, not 技術移転.
- **unten-menkyo-sho:** "the holder's condition" means residence status: 所持者の在留資格などの立場.
- **shako-shomei:** "moving" means 引っ越し.
- **minashi-sainyukoku-kyoka:** 日本に戻る期限, not 帰国期限. For foreign residents, 帰国 means going to their home country.
- **Template terms:** records built from a shared English template get one standard Japanese wording, reused when integrating new terms of the same kind:
  - **Workforce fields (`*-bunya` and similar):** copy all three fields from kaigo-bunya.
  - **Residence statuses ("The Japanese status-of-residence category called X"):** the short definition states the activity from the Immigration Control Act activity table (別表), and the other two fields are copied from kigyonai-tenkin. Drafts often only restate the English name or paraphrase loosely, so rewrite them.
- **"Sponsor" and "guarantor":** "sponsor" is 受入れ機関 for institution- and work-based statuses and the supporting family member in Japan (日本にいる家族, 扶養者) for family routes. Use 身元保証人 only for an actual signed guarantee, such as the guarantor for spouse or child, Long-Term Resident, Permanent Resident, and visitor applications (the status-term template's "sponsor documentation" is 身元保証人の書類 for these). A Medical Stay guarantor is the registered 身元保証機関. The English sometimes says "sponsor" where it means a guarantor, to avoid the loan sense of "guarantor"; when the sponsor takes on a guarantor's (moral) responsibility, as in the Designated Activities guidance, 身元保証人 is correct.
- **Leaving Japan:** "permanent departure" is 日本を完全に離れる or 日本からの完全な出国, not 完全帰国; a return to Japan is 日本に戻る, not 帰国.
- **Official names over literal renderings:** 「労働条件相談ほっとライン」 for the MHLW after-hours hotline; 在留期間の更新 for extending a status; 「相当の理由」 for the grounds to approve an extension or change; 適格返還請求書 for credit notes; 経営・管理 for Business Manager.
- **Glossary links in articles:** the link text is the glossary headword; abbreviations and everyday words follow it in parentheses (「[在留資格認定証明書](/glossary/certificate-of-eligibility)（COE）」, 「[査証](/glossary/sasho)（ビザ）」). `npm run localization:glossary:check` checks this and the decisions above.
- **rentai-hosho-gaisha:** "recourse" is 求償. **kazei-jigyosha:** "consumption-tax notices" is 「届出や通知」. **keizoku-shushoku-katsudo:** "course relevance" is the relationship between the course and the job sought. **ichigenteki-sodan-madoguchi:** "authority" is 権限, which its own sentence settles.
- **Batch 4 readings settled by context:** 司法書士 and 土地家屋調査士 "registration" is 登記; the 36協定 "overtime authorization" is the legal basis for overtime; 労働基準監督署 "employer filings" are 雇用主による届出; フリーランス法 "care" is 育児・介護との両立への配慮; 副業・兼業 "second-job notices" is 「届出や通知」.
- **Circular-definition fixes:** where avoiding the headword forced an odd paraphrase (ナース for 看護師, a paraphrase of the 介護 status), use the natural term or name the status in quotes instead.
- **jumin-zei:** the English record and the Japanese both separate the prior year's income from residence information as of January 1.

## Catalog status (2026-09-23)

**All 236 terms translated** (glossary complete on 2026-09-23). New English terms can be drafted with `npm run glossary:draft -- --next 5 --model opus`.

| Generator ID | Terms | Meaning |
|---|---|---|
| `codex-assisted-claude-reviewed` | 28 | Codex drafts from before the trial. Claude reviewed them and made 13 corrections: official terms, 上陸 vs 入国, a circular 都道府県 definition, and minor wording. |
| `claude-code-codex-reviewed` | 18 | Trial Claude drafts, reviewed by Codex before the delegation. |
| `claude-code-claude-reviewed` | 190 | Pipeline batches 1 (40 terms, $1.96), 2 (40 terms, $1.88), 3 (40 terms, $1.83), and 4 (70 terms, $2.85), drafted by Opus 5.5 and reviewed by Claude. All workforce-field terms (`*-bunya`) use one standard wording, because their English records share one template: reuse it for new field terms. |


## Residence statuses

All 30 status record fields are translated. The last 18 were drafted by `npm run status:draft` for $0.40 and reviewed by Claude; they use the shared structured-content prompt, so the catalog's prompt-revision test is unchanged. The command drafts every untranslated status, five per parallel call, and passes each status's Japanese glossary definition so the two stay consistent. **Structured guidance (Phase B, done):** `npm run status:guidance:draft` extracts each status's reader-facing guidance snippets by path (`src/domain/residence-status/guidance-text.ts`), translates them in one isolated call per status, and checks key parity. `-- --integrate <draft dir>` regenerates `residence-status-guidance-translations.ts`; its test fails when any English snippet changes, and rerunning the draft command redrafts only stale statuses. The first run cost $2.91 for all 30. Claude checked key parity, numbers, and status names on all 30 and read Permanent Resident and Dependent in full. In Dependent guidance, "sponsor" means 扶養者.

## Activity cross-references

All 8 "Can I do this?" activities are translated with `npm run activity:draft` ($0.54). The command shares a pipeline with the guidance drafts (`scripts/glossary-translation/overlay-pipeline.ts`). At integration, identical English snippets across items get their most common Japanese wording, so shared questions read the same everywhere. Link labels are not translated; the explorer shows the existing Japanese article, status, and journey titles. **Decision:** in family routes, "sponsor" is the supporting family member in Japan (日本にいる家族, 扶養者), not 身元保証人. The first draft got this wrong, and the prompt rule is now corrected.

## How the pipeline was developed (background)

Codex first ran Claude with thin prompts, and review corrected 8 of 18 terms. The causes were missing project guidance: no glossary rules, no protected terms, no examples, and no linked-article context. There was also minimal reasoning, and no way to flag an ambiguous word. The pipeline supplies all of these. A temporary 18-term regression eval, since removed, went from 0 of 12 known issues avoided to 10 or 11 of 12 with Opus 5.5. Sonnet 5 silently resolved ambiguities, so use Opus. One over-strict rule against circular definitions briefly made definitions worse. The current rule allows category words such as 年金 and 役所.
