import { translationArtifactSchema } from "@/domain/translation/translation";

const terminologyRevision = "74c46a91ccec5c9de19e65a60b89acd0bde3f837a042c3fe08a6ce6f1899f5cf";
const promptRevision = "4c275d0982deb5cef4ad5c05b49c900bd2f71e8065991ff32aec2ba5739c1486";
const generator = { id: "codex-assisted", model: "gpt-5" } as const;

function defineArticleGroupTranslation(
  contentId: string,
  sourceRevision: string,
  title: string,
  description: string,
) {
  return translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "article-group",
    contentId,
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision,
    terminologyRevision,
    promptRevision,
    generator,
    fields: { title, description },
    availability: "active",
    reviewState: "machine-translated",
    generatedAt: "2026-09-19T00:00:00.000Z",
  });
}

/** Japanese presentation fields for every canonical Explore content group. */
export const japaneseArticleGroupTranslations = [
  defineArticleGroupTranslation("study-in-japan", "2db4ae0421091b6c69ba589e5d5b8eec37d9373733aba052419ac310b1b09476", "日本で学ぶ", "学校選び、「留学」の在留資格、学校での受入れ手続き、留学生と受入教育機関のためのガイドです。"),
  defineArticleGroupTranslation("arrival-essentials", "f10a2ddba8ccf3e9846663a27a112bc6e49f63a51e8a9a828e0322e3d7f77c9a", "来日後の生活手続き", "在留資格の名称だけでなく、在留状況、住民登録、年齢、保険の加入状況によって対象が決まる、来日直後の共通手続きです。"),
  defineArticleGroupTranslation("professional-work", "0b5c391a56bdd641176aaa1be63b877fc1baa2315eac7ad8711d1bc898a707a2", "専門職", "大学教員、芸術、宗教、報道、法律・会計、医療、研究、教育、技術、企業内転勤、介護などの就労資格と、受入機関に関するガイドです。"),
  defineArticleGroupTranslation("business-and-high-skill", "dd32c6405486c1c126b543e1f48a8f8874f0d01bccd86b42dd31ea18616049b0", "経営・高度専門職", "専門家、経営者、創業者のための「高度専門職」「経営・管理」、支援を受けるスタートアップの経路を扱います。"),
  defineArticleGroupTranslation("skilled-and-sector-work", "8d26cfe88ca649eb91deed2176f8c225e049b33bc7748f62dde99fb3a063ba2e", "技能・分野別の仕事", "興行、熟練した技能職、直接雇用の「特定技能」を、人材育成制度とは分けて説明します。"),
  defineArticleGroupTranslation("family-and-long-term-residence", "784b100ca9ba882dcf4a4a6ecd4cc2a42c0fad3f2d21933755241b982b5e9456", "家族・長期在留", "在留を支える正確な家族関係や身分に基づいて経路を比較し、入国または永住の準備をします。"),
  defineArticleGroupTranslation("culture-and-training", "45a3cd36641eb312b2e97913d51702bd42e926a5d3f5a754a0bb1e5e3410b621", "文化活動・研修", "報酬を受けない「文化活動」と「研修」の経路を、「留学」や雇用を伴う育成制度と分けて説明します。"),
  defineArticleGroupTranslation("workforce-development-programs", "f21ba55f1979e685ea537ec86d5d58c1829399a41493f88e040d0a5229039603", "人材育成制度", "従来の技能実習制度、後継となる育成就労制度、直接雇用の「特定技能」を比較します。"),
  defineArticleGroupTranslation("designated-activities", "5ba7917d22264a4632d7899c7df585ea2659bed2ec1de965f64dca45b53ba22f", "特定活動", "ワーキング・ホリデー、J-Find、長期観光、デジタルノマド、卒業後の就職活動など、別々の制度を含む在留資格です。"),
  defineArticleGroupTranslation("short-stay-and-medical", "a89e2a49c93b7c44f9984eb3960cccfad483098f515fe8799aa9961cb9d01e44", "短期滞在・医療目的の訪問", "ビザ、査証免除、eVISA、「短期滞在」、短期留学、計画的な医療滞在を、通常の居住者向け手続きと混同せずに比較します。"),
  defineArticleGroupTranslation("diplomatic-and-official", "add172ffa0ecf518a9c2299ab48fcf5ab7003b52df1e2bbba2b37df4568e55e9", "外交・公用", "認められた外交、公務、国際機関の活動のための特別な経路です。"),
  defineArticleGroupTranslation("taxes-and-resident-responsibilities", "488e81058065a506f3f4a6fe6fe3af6b79305a70a2477e8c625a010f982a4d25", "税金・居住者の責任", "税務上の居住者、所得税と住民税、給与、申告、国外所得、個人事業、在留資格の維持、一時出国、帰国前の手続きを扱います。"),
  defineArticleGroupTranslation("working-in-japan", "04f47c80c10ccca8b2ebc7c4aeabe35956d27f56e39891105f953414813b33aa", "日本で働く", "職場で必要な言語、労働契約、賃金と労働時間、保険と労災、相談窓口、副業、フリーランス、退職・解雇、関連する在留・税務上の問題を扱います。"),
  defineArticleGroupTranslation("transport-safety-and-emergencies", "ca566d5d72429ac8b96b81d12f552876f83c855ba304afa6201b1d1c4a2528f3", "交通・安全・緊急時", "運転資格、免許切替、自動車の所有、交通・自転車のルール、緊急通報、防災を、国と地域の違いが分かる形で説明します。"),
  defineArticleGroupTranslation("daily-life-and-local-community", "a10fb62f30ccab58f54772639b67a60e06f7d9b4c70185c18101f7e9d8101a9a", "日常生活・地域社会", "電気・ガス・水道・インターネット、地域別のごみ出し、消費者契約、共同生活、日本語学習、地域の支援を扱い、地域の慣習を全国共通の法律として扱いません。"),
] as const;
