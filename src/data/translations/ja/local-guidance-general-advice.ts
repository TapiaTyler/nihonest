import { translationArtifactSchema, type TranslationArtifact } from "@/domain/translation/translation";
import { japaneseLocalGuidancePromptRevisions, localGuidanceTerminologyRevision } from "@/data/translations/ja/local-guidance/define";

/**
 * Japanese general local advice: the title and steps shown when no municipality supplement exists for an article
 * ("Other" in the location selector). Each artifact is addressed to `createTranslationSourceRevision` over
 * `translationSourceFields["local-guidance-general-advice"]` of the English in src/data/local-guidance/general-advice.ts,
 * so an English change leaves it stale and hidden until it is translated again.
 */
const generator = { id: "claude-code-claude-reviewed", model: "claude-opus-5-5" } as const;
const generatedAt = "2026-09-28T12:00:00.000Z";

function defineGeneralAdviceTranslation(articleId: string, sourceRevision: string, title: string, steps: readonly string[]): TranslationArtifact {
  const fields: Record<string, string> = { title };
  steps.forEach((step, index) => { fields[`steps.${index}`] = step; });
  return translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "local-guidance-general-advice",
    contentId: articleId,
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

export const japaneseGeneralLocalAdviceTranslations = [
  defineGeneralAdviceTranslation("registering-your-address-after-arrival", "2c0525ef30afa1866b0f386aff115d3c6ce5bd90bb7668570114bcb2b1d584a9",
    "住所地の転入手続きを確認する", [
      "住む予定の市区町村の、転入届または住民登録に関する公式ページを探してください。海外から転入する場合と国内のほかの市区町村から転入する場合について、窓口、届出期間、必要書類を確認してください。",
      "特に海外から転入する場合、家族関係の書類が必要な場合、代理人が届け出る場合は、来庁する前に届出先の窓口と現在の受付時間を確認してください。",
    ]),
  defineGeneralAdviceTranslation("joining-national-health-insurance", "4ae71ebea477c483fecf7f3547edaca5c91e92c1b32e9fde28fbdc6c051b3c60",
    "地域の国民健康保険の手続きを調べる", [
      "まず全国向けのガイドで、市区町村の国民健康保険に加入するのが自分に合った方法かどうかを確認してください。勤務先の健康保険やその他の制度によって、答えが変わることがあります。",
      "市区町村の公式サイトで、自分の変更内容に応じた加入・脱退の手続き、必要書類、保険の担当窓口、オンラインでの手続きを調べてください。世帯の保険料や軽減については、その窓口に問い合わせてください。",
    ]),
  defineGeneralAdviceTranslation("sorting-household-waste-and-arranging-disposal", "fd240a9fdc66783509629fd907f9d8e5bc4550df9d9b84a6a10962325ee35509",
    "自分の住所のごみの出し方を調べる", [
      "市区町村の公式の分け方ガイドと、自分の通りや建物の収集日を調べる検索機能を使ってください。ごみを出す場所と時間は、建物の管理者に確認してください。",
      "粗大ごみ、家電製品、電池など、通常の収集に出せないものを処分する前に、別に定められた公式の方法を確認してください。",
    ]),
  defineGeneralAdviceTranslation("preparing-for-disasters-and-evacuation-in-japan", "5f48268a832fba0c31df58c924534502f17f18c3b0544c49260298be4d71755a",
    "地域の災害リスクと緊急情報を調べる", [
      "自分の住所と、自宅・職場・学校に関係する災害について、公式のハザードマップを確認してください。公式の緊急情報を受け取る方法と、近くの指定された避難場所などを確認しておいてください。",
      "事前の備えのための地図は、その時点の指示ではありません。災害時には、担当する行政機関の最新の警報や指示に従ってください。",
    ]),
  defineGeneralAdviceTranslation("finding-japanese-language-and-local-support", "06b4f18bcd376d7f5ed629587aa4dcd4728085ee615be1cf055d2d6c39be5681",
    "地域の日本語学習と相談の支援を探す", [
      "市区町村の外国人相談窓口、国際交流協会、通訳の支援、日本語教室の一覧を探してください。",
      "サービスを利用する前に、実際に提供している団体の現在の対応言語、対象者、費用、予約のルール、日程を確認してください。",
    ]),
  defineGeneralAdviceTranslation("income-and-resident-tax-after-moving-to-japan", "4c12d6bb5fab6812c9513f6897526855f0e948c3b25456584c020a2d454aa7b5",
    "担当の税務窓口と課税年度の案内を調べる", [
      "全国向けのガイドで、所得税と住民税の違いを確認してください。地域の申告や納付のページを使う前に、その年度の住民税を課税する市区町村を確認してください。",
      "その市区町村の公式サイトで、該当する年度の申告、通知、納付、証明書、出国時の手続きを確認してください。ほかの人の金額を参考にするのではなく、自分の通知について税務担当の窓口に問い合わせてください。",
    ]),
  defineGeneralAdviceTranslation("national-pension-after-moving-to-japan", "fc933eb420da68af42307bc8d8176f2de489880f604767e58df6a28717a49481",
    "国民年金の加入と保険料の免除・猶予の手続き先を調べる", [
      "全国向けのガイドで、自分の被保険者の種別と、勤務先での加入やその他の制度によって手続き先が変わるかどうかを確認してください。",
      "加入、保険料の免除、学生納付特例の申請をどこで行うか、どの書類を持参するかを、市区町村の年金窓口または日本年金機構に問い合わせてください。",
    ]),
] as const;
