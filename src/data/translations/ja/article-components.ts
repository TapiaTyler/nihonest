import { translationArtifactSchema, type TranslationArtifact } from "@/domain/translation/translation";
import { japaneseLocalGuidancePromptRevisions, localGuidanceTerminologyRevision } from "@/data/translations/ja/local-guidance/define";

/**
 * Japanese text of the shared article components: the tax-residence scope table, the training-route comparison
 * table, and Japan practical basics. The text was drafted by Claude inside the React components and has never been
 * human-reviewed, so it is machine-translated. It was carried over verbatim from that component copy.
 *
 * Fields follow `translationSourceFields["article-component"]` (caption, headers, rows.<rowId>.<cell>; practical
 * basics as paragraphs.<id> in the N2 inline grammar). Each artifact is addressed to the revision of that English,
 * so an English change leaves it stale and the whole component renders in English until it is translated again.
 * Empty English route suffixes have exactly "" here; non-empty suffixes keep their leading punctuation.
 */
const generator = { id: "claude-code-claude-reviewed", model: "claude-opus-5-5" } as const;
const generatedAt = "2026-10-04T12:00:00.000Z";

function defineComponentTranslation(componentId: string, sourceRevision: string, fields: Readonly<Record<string, string>>): TranslationArtifact {
  return translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "article-component",
    contentId: componentId,
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision,
    terminologyRevision: localGuidanceTerminologyRevision,
    promptRevision: japaneseLocalGuidancePromptRevisions["2026-09-26-r2"],
    generator,
    fields,
    availability: "active",
    reviewState: "machine-translated",
    generatedAt,
  });
}

export const japaneseArticleComponentTranslations: readonly TranslationArtifact[] = [
  defineComponentTranslation("tax-residence-scope", "f335debb0a217ad8717ba918891b8468b8cd365a1d309ccc5c21ac5dfe64091b", {
    caption: "税務上の居住者区分ごとの日本の所得税の一般的な課税範囲",
    "headers.0": "税務上の居住者区分",
    "headers.1": "一般的な課税範囲",
    "rows.resident.0": "非永住者以外の居住者",
    "rows.resident.1": "一般に、全世界所得について日本の所得税の対象となります。",
    "rows.non-permanent-resident.0": "非永住者",
    "rows.non-permanent-resident.1": "一般に、国外源泉所得以外の所得に加え、日本で支払われた、または日本へ送金されたものとして扱われる国外源泉所得が課税対象となります。",
    "rows.non-resident.0": "非居住者",
    "rows.non-resident.1": "一般に、国内源泉所得について、その所得に適用される規則に基づいて課税されます。",
  }),
  defineComponentTranslation("training-route-comparison", "e5ef1b2fa79ed82cf36bdad6318eeeb7fd6312ccfffbd9c709df4bdb922b9386", {
    caption: "活動内容から最初に確認する研修・就学・就労経路",
    "headers.0": "予定する活動",
    "headers.1": "最初に確認する経路",
    "rows.cultural-activities.0": "無報酬の日本文化の学習または研究",
    "rows.cultural-activities.1": "文化活動",
    "rows.cultural-activities.2": "",
    "rows.student.0": "要件を満たす学校での教育",
    "rows.student.1": "留学",
    "rows.student.2": "",
    "rows.training.0": "受入先による体系的な非雇用研修",
    "rows.training.1": "研修",
    "rows.training.2": "",
    "rows.technical-intern-training.0": "現在有効な認定済みの技能実習計画",
    "rows.technical-intern-training.1": "技能実習",
    "rows.technical-intern-training.2": "（移行措置を含む）",
    "rows.employment-skill-development.0": "2027年4月から始まる3年間の雇用による育成",
    "rows.employment-skill-development.1": "育成就労",
    "rows.employment-skill-development.2": "（対象分野）",
    "rows.specified-skilled-worker.0": "分野別の技能・日本語要件を満たした後の直接雇用",
    "rows.specified-skilled-worker.1": "特定技能",
    "rows.specified-skilled-worker.2": "",
    "rows.ordinary-work.0": "通常の専門職その他の就労",
    "rows.ordinary-work.1": "活動内容に基づく就労資格を比較",
    "rows.ordinary-work.2": "",
  }),
  defineComponentTranslation("japan-practical-basics", "312907d08f6e7e42bec6f9ec96cabccc44fef24d9385aa4d404d505dca9588da", {
    "paragraphs.time": "**時刻：**日本は日本標準時（JST、UTC+9）を使用し、季節による夏時間の変更はありません。",
    "paragraphs.money": "**通貨：**日本の通貨は日本円（JPY）で、記号は「¥」または「円」です。",
    "paragraphs.measurements": "**単位：**公的な場面と日常生活では、キロメートル、メートル、キログラム、リットル、摂氏などのメートル法が一般的です。",
    "paragraphs.emergencies": "**緊急時：**警察への緊急通報は110番、火災・救助・救急車は119番です。[緊急通報のガイド](/articles/calling-police-fire-and-ambulance-services-in-japan)を読み、[災害・避難のガイド](/articles/preparing-for-disasters-and-evacuation-in-japan)で備えてください。",
  }),
];
