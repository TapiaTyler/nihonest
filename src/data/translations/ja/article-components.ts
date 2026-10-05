import { translationArtifactSchema, type TranslationArtifact } from "@/domain/translation/translation";
import { japaneseLocalGuidancePromptRevisions, localGuidanceTerminologyRevision } from "@/data/translations/ja/local-guidance/define";

/**
 * Japanese text of the shared article components: the tax-residence scope table, the training-route comparison
 * table, Japan practical basics, and the residence application fee section. The text was drafted by Claude inside
 * the React components and has never been human-reviewed, so it is machine-translated. It was carried over verbatim
 * from that component copy; in the fee copy, only the formatted amounts and dates became placeholders.
 *
 * Fields follow `translationSourceFields["article-component"]` (caption, headers, rows.<rowId>.<cell>; practical
 * basics as paragraphs.<id> in the N2 inline grammar). Each artifact is addressed to the revision of that English,
 * so an English change leaves it stale and the whole component renders in English until it is translated again.
 * Empty English route suffixes have exactly "" here; non-empty suffixes keep their leading punctuation. Fee copy
 * (messages.<id>) keeps exactly the English `{placeholders}`; amounts and dates are filled from the fee record.
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
  defineComponentTranslation("residence-application-fees", "aae78948340bfb61364ce631aadea4424777cbe19ef3d82a8a560dbb89b16e39", {
    "messages.heading": "手数料は受付日、申請方法、許可された期間によって異なる",
    "messages.previous-schedule": "{previousFrom}から{previousThrough}までに受け付けられた申請では、許可された在留資格変更または在留期間更新の手数料は、窓口で{previousCounter}、オンラインで{previousOnline}です。",
    "messages.current-schedule": "{currentFrom}以降に受け付けられた申請では、出入国在留管理庁が実際に許可した期間によって手数料が決まります。",
    "messages.caption": "{currentFrom}以降に受け付けられた在留資格変更および在留期間更新の手数料",
    "messages.header-period": "許可された期間",
    "messages.header-counter": "窓口",
    "messages.header-online-base": "オンライン基本手数料",
    "messages.header-online-total": "処理手数料を含むオンライン合計",
    "messages.period-up-to-three-months": "3か月以下",
    "messages.period-over-three-through-six-months": "3か月を超え6か月以下",
    "messages.period-over-six-months-under-one-year": "6か月を超え1年未満",
    "messages.period-one-year": "1年",
    "messages.period-over-one-under-three-years": "1年を超え3年未満",
    "messages.period-three-under-five-years": "3年以上5年未満",
    "messages.period-five-years-or-more": "5年以上",
    "messages.processing": "オンラインの処理手数料は、許可された期間が3年未満の場合{processingUnderThree}、3年以上の場合{processingThreeOrMore}です。出入国在留管理庁は審査後に支払方法を案内します。対象となるオンライン申請は、コンビニエンスストアまたは銀行で支払います。公表された手続きでは、クレジットカードとQRコード決済は利用できません。窓口申請では引き続き収入印紙を使用します。",
    "messages.schedule-rule": "適用される料金表は、申請の受付日によって決まります。{previousThrough}までに受け付けられた申請は、後から決定されても以前の手数料と収入印紙の手続きを使います。公表された軽減措置によって、要件を満たす変更または更新の手数料が{reducedFee}となる場合がありますが、オンラインシステムは軽減または免除の申出に対応していないため、窓口で申請する必要があります。",
    "messages.fraud-label": "詐欺への注意：",
    "messages.fraud-body": "出入国在留管理庁は、新しいオンライン支払手続きの正規のメールは、末尾が {emailDomain} のアドレスからのみ送信されると案内しています。送信元、方法、指示が異なる場合は、支払う前に公式ページを再確認してください。",
  }),
];
