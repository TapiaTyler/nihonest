import { residenceStatusSchema, type ResidenceStatusCategory } from "@/domain/residence-status/residence-status";
import { glossaryTerms } from "@/data/glossary";

const statusGlossaryTermIds: Readonly<Record<string, string>> = {
  diplomat: "gaiko",
  official: "koyo",
  professor: "kyoju",
  artist: "geijutsu",
  "religious-activities": "shukyo",
  journalist: "hodo",
  "highly-skilled-professional": "kodo-senmonshoku",
  "business-manager": "keiei-kanri",
  "legal-accounting-services": "horitsu-kaikei-gyomu",
  "medical-services": "iryo",
  researcher: "kenkyu",
  instructor: "kyoiku",
  "engineer-specialist-humanities-international-services": "gijutsu-jinbun-kokusai",
  "intra-company-transferee": "kigyonai-tenkin",
  "nursing-care": "kaigo",
  entertainer: "kogyo",
  "skilled-labor": "gino",
  "specified-skilled-worker": "tokutei-gino",
  "technical-intern-training": "gino-jisshu",
  "cultural-activities": "bunka-katsudo",
  "temporary-visitor": "tanki-taizai",
  student: "ryugaku",
  trainee: "kenshu",
  dependent: "kazoku-taizai",
  "designated-activities": "tokutei-katsudo",
  "permanent-resident": "eijusha",
  "spouse-or-child-japanese-national": "nihonjin-no-haigusha-to",
  "spouse-or-child-permanent-resident": "eijusha-no-haigusha-to",
  "long-term-resident": "teijusha",
};

type StatusInput = Readonly<{
  id: string;
  englishName: string;
  japaneseName: string;
  category: ResidenceStatusCategory;
  summary: string;
  purpose: string;
  typicalActivities: readonly string[];
  examples?: readonly string[];
  articleId?: string;
  sourceIds?: readonly string[];
}>;

function defineStatus(input: StatusInput) {
  const glossaryTermId = statusGlossaryTermIds[input.id];
  const glossaryTerm = glossaryTerms.find(({ id }) => id === glossaryTermId);
  if (!glossaryTerm?.kana || !glossaryTerm.romaji) {
    throw new Error(`Residence status \"${input.id}\" requires a glossary term with kana and romaji.`);
  }

  return residenceStatusSchema.parse({
    id: input.id,
    slug: input.id,
    englishName: input.englishName,
    japaneseName: input.japaneseName,
    japaneseKana: glossaryTerm.kana,
    romaji: glossaryTerm.romaji,
    glossaryTermId,
    category: input.category,
    summary: input.summary,
    purpose: input.purpose,
    typicalActivities: input.typicalActivities,
    examples: input.examples ?? [],
    considerations: [
      "Eligibility depends on the actual activity, relationship, or position—not the route's informal name alone.",
      "The evidence and procedure vary by application type and the applicant's circumstances.",
      "Confirm the current checklist with the Immigration Services Agency and the Japanese mission handling the visa application.",
    ],
    sourceIds: input.sourceIds ?? ["immigration-services-status-appendix", "isa-status-search", "mofa-work-long-term-stay"],
    relatedArticleIds: input.articleId ? [input.articleId] : [],
    lastReviewedAt: "2026-09-06",
    status: "draft",
  });
}

export const residenceStatuses = [
  defineStatus({ id: "diplomat", englishName: "Diplomat", japaneseName: "外交", category: "official", summary: "For qualifying diplomatic activities and accompanying household family members.", purpose: "Diplomatic activity on behalf of a foreign government or qualifying international organization.", typicalActivities: ["Serving as an ambassador or diplomatic agent", "Accompanying a diplomat as a qualifying household family member"], articleId: "diplomatic-visa" }),
  defineStatus({ id: "official", englishName: "Official", japaneseName: "公用", category: "official", summary: "For qualifying official duties of foreign governments or international organizations and accompanying family.", purpose: "Official business that does not fall within Diplomat status.", typicalActivities: ["Administrative or technical work for a diplomatic mission", "Official duties for a recognized international organization"], articleId: "official-visa" }),
  defineStatus({ id: "professor", englishName: "Professor", japaneseName: "教授", category: "work", summary: "For research, research guidance, or education at qualifying higher-education institutions.", purpose: "Academic teaching and research at universities and comparable institutions.", typicalActivities: ["Teaching at a university", "Conducting or supervising academic research"], articleId: "professor-status" }),
  defineStatus({ id: "artist", englishName: "Artist", japaneseName: "芸術", category: "work", summary: "For income-producing artistic activity that fits the statutory Artist category.", purpose: "Professional creative activity such as music, visual art, literature, or photography.", typicalActivities: ["Composing or writing", "Creating visual art or photography"], articleId: "artist-status" }),
  defineStatus({ id: "religious-activities", englishName: "Religious Activities", japaneseName: "宗教", category: "work", summary: "For religious work dispatched by a foreign religious organization.", purpose: "Missionary and other qualifying religious activity in Japan.", typicalActivities: ["Missionary work", "Religious instruction or ministry"], articleId: "religious-activities-status" }),
  defineStatus({ id: "journalist", englishName: "Journalist", japaneseName: "報道", category: "work", summary: "For journalistic activity performed under a contract with a foreign news organization.", purpose: "Reporting and related journalism for foreign media.", typicalActivities: ["News reporting or editing", "News photography or broadcasting"], articleId: "journalist-status" }),
  defineStatus({ id: "highly-skilled-professional", englishName: "Highly Skilled Professional", japaneseName: "高度専門職", category: "business", summary: "A points-based or special highly skilled route for qualifying advanced academic, professional, or business activity.", purpose: "Qualifying highly skilled activity with immigration advantages tied to the authorized category.", typicalActivities: ["Advanced academic research", "Advanced specialized professional work", "Advanced business management"], articleId: "highly-skilled-professional-status", sourceIds: ["immigration-services-status-appendix", "mofa-highly-skilled-professional"] }),
  defineStatus({ id: "business-manager", englishName: "Business Manager", japaneseName: "経営・管理", category: "business", summary: "For operating or managing a qualifying business in Japan.", purpose: "Substantive business operation or management from an appropriate Japanese business base.", typicalActivities: ["Operating a company", "Managing a qualifying business division"], articleId: "business-manager-status", sourceIds: ["immigration-services-status-appendix", "mofa-working-visa", "isa-business-manager-reform"] }),
  defineStatus({ id: "legal-accounting-services", englishName: "Legal/Accounting Services", japaneseName: "法律・会計業務", category: "work", summary: "For legal or accounting work that may be performed only by professionals certified under Japanese law.", purpose: "Regulated legal and accounting professional services.", typicalActivities: ["Practicing as an attorney qualified in Japan", "Working as a qualifying accountant or tax accountant"], articleId: "legal-accounting-services-status" }),
  defineStatus({ id: "medical-services", englishName: "Medical Services", japaneseName: "医療", category: "work", summary: "For regulated medical work performed by appropriately qualified professionals.", purpose: "Professional healthcare activity requiring Japanese legal qualification.", typicalActivities: ["Working as a physician or dentist", "Working in another covered licensed health profession"], articleId: "medical-services-status" }),
  defineStatus({ id: "researcher", englishName: "Researcher", japaneseName: "研究", category: "work", summary: "For qualifying research conducted under a contract with a Japanese organization outside the Professor route.", purpose: "Research activity at qualifying public or private organizations.", typicalActivities: ["Research at a company laboratory", "Investigation at a research institute"], articleId: "researcher-status" }),
  defineStatus({ id: "instructor", englishName: "Instructor", japaneseName: "教育", category: "work", summary: "For language education or other education at qualifying schools below the university level.", purpose: "Teaching at elementary, secondary, vocational, or comparable covered schools.", typicalActivities: ["Teaching at an elementary or secondary school", "Language instruction at a covered educational institution"], articleId: "instructor-status" }),
  defineStatus({ id: "engineer-specialist-humanities-international-services", englishName: "Engineer/Specialist in Humanities/International Services", japaneseName: "技術・人文知識・国際業務", category: "work", summary: "For qualifying professional work drawing on technical, humanities, or international-services expertise.", purpose: "Specialized professional services under a contract with an organization in Japan.", typicalActivities: ["Engineering or IT work", "Interpretation, design, or other qualifying specialist work"], examples: ["Software engineer", "Interpreter", "Designer"], articleId: "engineer-specialist-humanities-international-services-status" }),
  defineStatus({ id: "intra-company-transferee", englishName: "Intra-company Transferee", japaneseName: "企業内転勤", category: "work", summary: "For qualifying employees transferred within an international corporate group to a Japanese office.", purpose: "A time-limited intra-group transfer to perform covered technical, humanities, or international-services work.", typicalActivities: ["Transfer from an overseas office to a Japanese branch", "Transfer between qualifying affiliated entities"], articleId: "intra-company-transferee-status", sourceIds: ["immigration-services-status-appendix", "mofa-intra-company-transferee"] }),
  defineStatus({ id: "nursing-care", englishName: "Nursing Care", japaneseName: "介護", category: "work", summary: "For nursing-care work performed by a certified care worker under a qualifying contract.", purpose: "Professional care work or care instruction using the required Japanese qualification.", typicalActivities: ["Providing nursing care", "Teaching nursing-care practice"], articleId: "nursing-care-status" }),
  defineStatus({ id: "entertainer", englishName: "Entertainer", japaneseName: "興行", category: "work", summary: "For qualifying entertainment, performance, or professional sports activity.", purpose: "Covered performance, entertainment, or sports work under the applicable conditions.", typicalActivities: ["Music, acting, dance, or modeling", "Professional sports or related entertainment"], articleId: "entertainer-status", sourceIds: ["immigration-services-status-appendix", "mofa-entertainer"] }),
  defineStatus({ id: "skilled-labor", englishName: "Skilled Labor", japaneseName: "技能", category: "work", summary: "For work requiring skilled expertise in occupational fields specifically recognized by immigration rules.", purpose: "Specialized skilled work in a listed occupational category.", typicalActivities: ["Foreign-cuisine chef", "Aircraft pilot, sports trainer, or other covered skilled occupation"], articleId: "skilled-labor-status", sourceIds: ["immigration-services-status-appendix", "mofa-skilled-labor"] }),
  defineStatus({ id: "specified-skilled-worker", englishName: "Specified Skilled Worker", japaneseName: "特定技能", category: "work", summary: "For qualifying work in designated industrial fields under Specified Skilled Worker (i) or (ii).", purpose: "Employment addressing labor needs in officially designated fields under program-specific rules.", typicalActivities: ["Work in a designated industrial field under category (i)", "More advanced covered work under category (ii) where available"], articleId: "specified-skilled-worker-status", sourceIds: ["immigration-services-status-appendix", "mofa-specified-skilled-worker"] }),
  defineStatus({ id: "technical-intern-training", englishName: "Technical Intern Training", japaneseName: "技能実習", category: "work", summary: "For participation in the regulated technical intern training program and its approved training plan.", purpose: "Skills transfer through a supervised, approved technical training arrangement.", typicalActivities: ["Technical intern training under an approved plan", "Covered practical activity with a training implementer"], articleId: "technical-intern-training-status", sourceIds: ["immigration-services-status-appendix", "mofa-technical-intern-training"] }),
  defineStatus({ id: "cultural-activities", englishName: "Cultural Activities", japaneseName: "文化活動", category: "study", summary: "For qualifying unpaid academic, artistic, or Japanese cultural study activity.", purpose: "Non-remunerative research or specialized study of culture or skills particular to Japan.", typicalActivities: ["Researching Japanese culture", "Studying a traditional art under an expert"], articleId: "cultural-activities-visa" }),
  defineStatus({ id: "temporary-visitor", englishName: "Temporary Visitor", japaneseName: "短期滞在", category: "visitor", summary: "For qualifying short stays such as tourism, visiting relatives, meetings, or conferences without remunerative work.", purpose: "Short-term activities that fit Temporary Visitor status.", typicalActivities: ["Tourism or family visits", "Short business meetings or conferences"], articleId: "temporary-visitor-and-short-stay" }),
  defineStatus({ id: "student", englishName: "Student", japaneseName: "留学", category: "study", summary: "For education at universities, schools, and other qualifying educational institutions.", purpose: "Study at an institution covered by Student status.", typicalActivities: ["University or vocational study", "Study at an eligible language or other school"], articleId: "student-visa-and-certificate-of-eligibility" }),
  defineStatus({ id: "trainee", englishName: "Trainee", japaneseName: "研修", category: "study", summary: "For qualifying non-employment training that does not belong to Technical Intern Training.", purpose: "Acquiring skills through a covered training arrangement.", typicalActivities: ["Training through a public body", "Qualifying non-practical or public-sector training"], articleId: "training-visa" }),
  defineStatus({ id: "dependent", englishName: "Dependent", japaneseName: "家族滞在", category: "family", summary: "For a qualifying supported spouse or unmarried minor child of a foreign resident with an eligible status.", purpose: "Ordinary daily activities as a supported family member.", typicalActivities: ["Living as a supported spouse", "Living as a supported unmarried minor child"], articleId: "dependent-family-stay-visa" }),
  defineStatus({ id: "designated-activities", englishName: "Designated Activities", japaneseName: "特定活動", category: "designated", summary: "For an activity individually designated by the Minister of Justice under a relevant program or designation.", purpose: "A specifically designated activity whose permitted scope is recorded for the individual.", typicalActivities: ["Working holiday or qualifying internship", "Digital nomad, long-stay sightseeing, or another named designation"], articleId: "designated-activities-status", sourceIds: ["immigration-services-status-appendix", "mofa-designated-activities", "isa-designated-activities"] }),
  defineStatus({ id: "permanent-resident", englishName: "Permanent Resident", japaneseName: "永住者", category: "unrestricted", summary: "For a person granted permanent residence by the Minister of Justice.", purpose: "Residence without a fixed period of stay after permanent-residence permission is granted.", typicalActivities: ["Living and working without activity-based status restrictions"], articleId: "permanent-residence-in-japan", sourceIds: ["immigration-services-status-appendix", "isa-permanent-residence"] }),
  defineStatus({ id: "spouse-or-child-japanese-national", englishName: "Spouse or Child of Japanese National", japaneseName: "日本人の配偶者等", category: "unrestricted", summary: "For qualifying spouses, biological children, or specially adopted children of Japanese nationals.", purpose: "Residence based on the qualifying family relationship to a Japanese national.", typicalActivities: ["Living in Japan as a qualifying spouse", "Living in Japan as a qualifying child"], articleId: "spouse-or-child-of-japanese-national", sourceIds: ["immigration-services-status-appendix", "mofa-spouse-japanese"] }),
  defineStatus({ id: "spouse-or-child-permanent-resident", englishName: "Spouse or Child of Permanent Resident", japaneseName: "永住者の配偶者等", category: "unrestricted", summary: "For qualifying spouses and certain children of permanent or special permanent residents.", purpose: "Residence based on the qualifying relationship and circumstances defined for this status.", typicalActivities: ["Living as the spouse of a permanent resident", "Living as a qualifying child born in Japan"], articleId: "spouse-or-child-of-permanent-resident", sourceIds: ["immigration-services-status-appendix", "mofa-spouse-permanent"] }),
  defineStatus({ id: "long-term-resident", englishName: "Long-Term Resident", japaneseName: "定住者", category: "unrestricted", summary: "For residence authorized in consideration of special circumstances recognized by the Minister of Justice.", purpose: "Status-based residence for people within a relevant notification or an individually recognized case.", typicalActivities: ["Residence based on Japanese ancestry", "Residence based on another recognized special circumstance"], articleId: "long-term-resident-status", sourceIds: ["immigration-services-status-appendix", "mofa-long-term-resident"] }),
] as const;

export function getResidenceStatusBySlug(slug: string) {
  return residenceStatuses.find((status) => status.slug === slug);
}

export function getResidenceStatusById(id: string) {
  return residenceStatuses.find((status) => status.id === id);
}
