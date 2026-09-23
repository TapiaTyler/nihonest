import { translationArtifactSchema } from "@/domain/translation/translation";

const terminologyRevision = "74c46a91ccec5c9de19e65a60b89acd0bde3f837a042c3fe08a6ce6f1899f5cf";
const promptRevision = "4c275d0982deb5cef4ad5c05b49c900bd2f71e8065991ff32aec2ba5739c1486";
const generator = { id: "codex-assisted", model: "gpt-5" } as const;
const sharedConsiderations = [
  "対象となるかどうかは、通称ではなく、実際の活動、関係、または身分・地位によって決まります。",
  "必要な資料と手続きは、申請の種類と申請者の事情によって異なります。",
  "出入国在留管理庁と、査証申請を担当する日本の在外公館の最新の提出資料一覧を確認してください。",
];

function defineResidenceStatusTranslation(
  contentId: string,
  sourceRevision: string,
  summary: string,
  purpose: string,
  typicalActivities: readonly string[],
  examples: readonly string[],
) {
  return translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "residence-status",
    contentId,
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision,
    terminologyRevision,
    promptRevision,
    generator,
    fields: {
      summary,
      purpose,
      "typical-activities": JSON.stringify(typicalActivities),
      examples: JSON.stringify(examples),
      considerations: JSON.stringify(sharedConsiderations),
    },
    availability: "active",
    reviewState: "machine-translated",
    generatedAt: "2026-09-19T00:00:00.000Z",
  });
}

/** Representative statuses spanning activity-based and status-based residence routes. */
export const japaneseResidenceStatusTranslations = [
  defineResidenceStatusTranslation("student", "4a65b969e1b0dbea5fd0afff1ed39f2a152b1bb48368d4145fff7401cd1e8a79", "大学、学校、その他の対象となる教育機関で学ぶための在留資格です。", "「留学」の在留資格の対象となる教育機関で学ぶことです。", ["大学または専門学校で学ぶこと", "対象となる日本語学校その他の学校で学ぶこと"], []),
  defineResidenceStatusTranslation("engineer-specialist-humanities-international-services", "45ec09d98226dab1eca2eb86e0cb517f3f2b44f3bbd648f88f3ed4b138656111", "技術、人文科学、または国際業務に関する専門知識を必要とする、要件を満たす仕事のための在留資格です。", "日本の機関との契約に基づいて、専門的な業務を行うことです。", ["エンジニアリングまたはITの仕事", "通訳、デザイン、その他の要件を満たす専門業務"], ["ソフトウェアエンジニア", "通訳者", "デザイナー"]),
  defineResidenceStatusTranslation("dependent", "c957e70b242f3e3c1e5048eabc046a643d79f01592058ad897d776a300e8598c", "対象となる在留資格を持つ外国人に扶養される、要件を満たす配偶者または未婚の未成年の子のための在留資格です。「特定技能2号」は対象に含まれますが、「特定技能1号」は含まれません。", "扶養を受ける家族として日常生活を送ることです。通常の報酬を受ける仕事には、別途、資格外活動許可が必要です。", ["扶養される配偶者として生活すること", "扶養される未婚の未成年の子として生活すること", "該当する資格外活動許可を受けた後に、制限の範囲内でアルバイトをすること"], ["対象となる就労資格を持つ人の配偶者", "「留学」の在留資格を持つ人の未婚の未成年の子"]),
  defineResidenceStatusTranslation("permanent-resident", "086f29ba9f3e9524c098e25d8729fd1d662460d9da19dbdcf4061d1399acaac5", "該当する在留歴の経路、素行、生計、公的義務、現在の在留期間、国益に関する事情などについて、別の審査を受けて永住を許可された人のための在留資格です。", "永住許可を受けた後、在留期間の定めや活動に基づく就労制限を受けずに在留することです。", ["活動に基づく在留資格の制限を受けずに生活し、働くこと", "在留カード、再入国、税、保険、その他の住民としての義務を継続して守ること"], []),
  defineResidenceStatusTranslation("temporary-visitor", "7e524b5a637014c5dde9343f7776553446186a06ec61b2ba782a1546ca189510", "観光、親族・知人訪問、会議、短期留学など、報酬を受けない要件を満たす短期の訪問のための在留資格です。査証、査証免除、上陸時の在留資格、認められた期間はそれぞれ別のものです。", "通常の報酬を受ける仕事や居住を目的としない一時的な活動を行うことです。", ["観光または親族・知人の訪問", "短期の商談、会議、または見学", "認められた期間内の報酬を受けない短期留学"], ["観光客", "親族・知人を訪問する人", "会議の参加者", "短期講座の参加者"]),
  defineResidenceStatusTranslation("designated-activities", "f9d4ed4710814af1a8a9dd9cf2083cbbd2a05652b17506a248b413d678a4e61d", "認められる活動、就労、家族の帯同、在留期間、更新、必要資料が、本人に指定された活動によって異なる包括的な在留資格です。", "名称のある制度または個別の決定によって、特に指定された活動を行うことです。", ["継続就職活動またはJ-Findの未来創造人材としての活動", "ワーキング・ホリデーまたはデジタルノマドとしての活動", "長期観光、起業準備、医療滞在、またはその他の指定された活動"], ["要件を満たす就職活動を続ける卒業者", "J-Find参加者", "デジタルノマド", "ワーキング・ホリデー参加者", "長期観光の滞在者"]),
  defineResidenceStatusTranslation("business-manager", "58612f5cb26a9e83b825f966faadbda0d22190a0823cea9b756f7d0e80179f53", "日本で要件を満たす事業を経営し、または管理するための在留資格です。", "適切な日本国内の事業拠点から、実体のある事業の経営または管理を行うことです。", ["会社を経営すること", "要件を満たす事業部門を管理すること"], []),
  defineResidenceStatusTranslation("highly-skilled-professional", "0d30cfd969b6587d14183e7cc92d959b222f334265288d4692429c39bad1632c", "要件を満たす高度な学術研究、専門・技術、または事業経営の活動のための、ポイント制その他の高度人材向け在留資格です。", "認められた活動区分に応じた出入国在留管理上の優遇措置を伴う、高度な専門活動を行うことです。", ["高度な学術研究", "高度な専門・技術活動", "高度な事業経営・管理"], []),
  defineResidenceStatusTranslation("specified-skilled-worker", "9721a35ce22e01aecea2bd773af96fd9ec0eeb5d09b850bf43c46a449758073e", "特定技能1号または2号の制度要件に基づき、現在指定されている産業分野で要件を満たす仕事に従事するための在留資格です。", "人手不足に対応する特定技能制度の下で、分野と業務を限定した仕事に従事することです。", ["技能、日本語、雇用主、支援体制に関する要件を満たす特定技能1号の仕事", "2号が認められる分野で、より熟練した技能を要する特定技能2号の仕事"], ["外食業の従事者", "建設作業員", "工業製品製造業の従事者", "農業従事者", "宿泊業の従事者", "自動車運送業の従事者"]),
  defineResidenceStatusTranslation("spouse-or-child-japanese-national", "9caa09cd3a48333d3f5f5ffe102eb1160431a3c974a69854bc438cbed6874a2d", "要件を満たす日本人の配偶者、日本人の子として出生した人、または要件を満たす特別養子のための在留資格です。", "活動に基づく就労制限を受けず、日本人との対象となる関係を継続していることに基づいて在留することです。", ["日本人の配偶者として日本で生活すること", "日本人の子として出生した人として日本で生活すること", "要件を満たす特別養子として日本で生活すること"], []),
  defineResidenceStatusTranslation("instructor", "1966e56ed6627fb2a7456686e3de54637fae016d4cb22579223a2be46244e6d2", "大学より下の段階にある対象の学校で、語学教育その他の教育を行うための在留資格です。", "小学校、中学校、高等学校、専修学校、またはこれらに相当する対象の学校で教育を行うことです。", ["小学校または中学校・高等学校で教えること", "対象となる教育機関で語学を教えること"], []),
  defineResidenceStatusTranslation("cultural-activities", "446b1f0195fa789cf334b105a1ae205c8d7ac9a8bb2095999c03f892605465ae", "報酬を受けない、要件を満たす学術・芸術活動または日本文化の研究・修得のための在留資格です。", "収入を伴わず、日本固有の文化または技能について研究し、専門的な指導を受けることです。", ["日本文化を研究すること", "専門家の指導を受けて伝統芸術を学ぶこと"], []),
] as const;
