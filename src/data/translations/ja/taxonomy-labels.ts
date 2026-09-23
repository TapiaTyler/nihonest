import type {
  AudienceId,
  GeographicScopeId,
  JourneyStageId,
  TopicId,
} from "@/domain/taxonomy/taxonomy";
import type { ArticleMetadata } from "@/domain/article/article";
import type { ResidenceStatusCategory } from "@/domain/residence-status/residence-status";
import type { FaqBrowseGroupId } from "@/domain/faq/faq";

export const japaneseTaxonomyLabels = {
  journeyStage: {
    planning: "計画中",
    preparing: "準備中",
    "recently-arrived": "来日直後",
    "living-in-japan": "日本で生活中",
  } satisfies Record<JourneyStageId, string>,
  topic: {
    banking: "銀行",
    "daily-life": "日常生活",
    employment: "仕事",
    healthcare: "医療・健康",
    housing: "住居",
    immigration: "出入国在留管理",
    language: "言語",
    "municipal-procedures": "自治体の手続き",
    taxes: "税金",
    transportation: "交通",
  } satisfies Record<TopicId, string>,
  audience: {
    newcomer: "新しく来日した人",
    student: "留学生",
    "education-provider": "教育機関",
    employer: "雇用主",
    employee: "労働者",
    freelancer: "フリーランス",
    "business-owner": "事業主",
    spouse: "配偶者",
    dependent: "扶養家族",
    parent: "親",
  } satisfies Record<AudienceId, string>,
  geographicScope: {
    national: "全国",
    prefectural: "都道府県",
    municipal: "市区町村",
  } satisfies Record<GeographicScopeId, string>,
  contentType: {
    checklist: "チェックリスト",
    glossary: "用語集",
    guide: "ガイド",
    "official-procedure": "公的手続き",
    reference: "参考資料",
  } satisfies Record<ArticleMetadata["contentType"], string>,
  importance: {
    informational: "参考情報",
    recommended: "推奨",
    important: "重要",
    critical: "最重要",
  } satisfies Record<ArticleMetadata["importance"], string>,
  residenceStatusCategory: {
    work: "就労",
    business: "経営・高度専門職",
    study: "留学・文化活動・研修",
    family: "家族",
    designated: "特定活動",
    visitor: "短期滞在",
    official: "外交・公用",
    unrestricted: "身分・地位に基づく在留資格",
  } satisfies Record<ResidenceStatusCategory, string>,
  faqBrowseGroup: {
    "immigration-and-entry": "出入国・入国",
    study: "日本で学ぶ",
    "arrival-and-daily-life": "来日後・日常生活",
    "work-and-business": "仕事・事業",
    "family-and-long-term-residence": "家族・長期在留",
    "ongoing-responsibilities": "在留中の継続的な責任",
  } satisfies Record<FaqBrowseGroupId, string>,
} as const;
