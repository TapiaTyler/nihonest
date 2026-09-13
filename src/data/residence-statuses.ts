import { residenceStatusSchema, type ResidenceStatusCategory } from "@/domain/residence-status/residence-status";
import { glossaryTerms } from "@/data/glossary";
import { getStructuredResidenceStatusGuidance } from "@/data/structured-residence-status-guidance";

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
  "employment-for-skill-development": "ikusei-shuro",
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
  status?: "draft" | "needs-review";
  lastReviewedAt?: string;
}>;

function defineStatus(input: StatusInput) {
  const glossaryTermId = statusGlossaryTermIds[input.id];
  const glossaryTerm = glossaryTerms.find(({ id }) => id === glossaryTermId);
  const structuredGuidance = getStructuredResidenceStatusGuidance(input.id);
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
    sourceIds: [...new Set([
      ...(input.sourceIds ?? ["immigration-services-status-appendix", "isa-status-search", "mofa-work-long-term-stay"]),
      ...(structuredGuidance?.sourceAssertions.map(({ sourceId }) => sourceId) ?? []),
    ])],
    relatedArticleIds: input.articleId ? [input.articleId] : [],
    lastReviewedAt: input.lastReviewedAt ?? "2026-09-06",
    status: input.status ?? "draft",
    structuredGuidance,
  });
}

export const residenceStatuses = [
  defineStatus({ id: "diplomat", englishName: "Diplomat", japaneseName: "外交", category: "official", summary: "For a recognized diplomatic or comparable protected assignment and qualifying family members belonging to the same household; a diplomatic passport alone does not establish the status.", purpose: "Diplomatic, consular, or comparable protected activity formally coordinated with Japan.", typicalActivities: ["Serving in a recognized diplomatic or consular function", "Accompanying the principal holder as a qualifying same-household family member"], examples: ["Ambassador or diplomatic agent", "Consular officer in a covered function", "Qualifying same-household family member"], articleId: "diplomatic-visa", sourceIds: ["immigration-services-status-appendix", "mofa-diplomatic-visa", "mofa-diplomatic-official-exemptions", "isa-residence-management-overview"], status: "needs-review", lastReviewedAt: "2026-09-12" }),
  defineStatus({ id: "official", englishName: "Official", japaneseName: "公用", category: "official", summary: "For recognized official business of a foreign government or international organization outside Diplomat status, plus qualifying family members belonging to the same household.", purpose: "Formally coordinated government or international-organization duties that do not fall within Diplomat status.", typicalActivities: ["Performing recognized foreign-government official business", "Performing recognized international-organization official business", "Accompanying the principal holder as a qualifying same-household family member"], examples: ["Administrative or technical official", "International-organization official", "Qualifying same-household family member"], articleId: "official-visa", sourceIds: ["immigration-services-status-appendix", "mofa-official-visa", "mofa-diplomatic-official-exemptions", "isa-residence-management-overview"], status: "needs-review", lastReviewedAt: "2026-09-12" }),
  defineStatus({ id: "professor", englishName: "Professor", japaneseName: "教授", category: "work", summary: "For research, research guidance, or education at qualifying higher-education institutions.", purpose: "Academic teaching and research at universities and comparable institutions.", typicalActivities: ["Teaching at a university", "Conducting or supervising academic research"], articleId: "professor-status" }),
  defineStatus({ id: "artist", englishName: "Artist", japaneseName: "芸術", category: "work", summary: "For income-producing music, fine-art, literary, or other artistic activity outside the Entertainer category.", purpose: "A supported contracted or independent professional artistic practice in Japan.", typicalActivities: ["Composing, writing, or creating fine art", "Carrying out a documented independent artistic practice"], examples: ["Composer", "Painter", "Writer or author", "Illustrator", "Fine-art photographer"], articleId: "artist-status" }),
  defineStatus({ id: "religious-activities", englishName: "Religious Activities", japaneseName: "宗教", category: "work", summary: "For missionary and other religious work performed by a religious professional dispatched by a foreign religious organization.", purpose: "Qualifying religious activity in Japan through a documented foreign-organization dispatch.", typicalActivities: ["Missionary work", "Worship leadership, ministry, or religious instruction within the qualifying dispatch"], examples: ["Missionary", "Minister or pastor", "Priest", "Rabbi", "Imam", "Monk or nun"], articleId: "religious-activities-status" }),
  defineStatus({ id: "journalist", englishName: "Journalist", japaneseName: "報道", category: "work", summary: "For reporting and other journalism performed under a qualifying contract with a foreign news organization.", purpose: "Foreign-news reporting through dispatch, employment, or a qualifying non-employment contract.", typicalActivities: ["Reporting as a foreign correspondent", "News photography or other journalistic camera work"], examples: ["Reporter", "Correspondent", "Photojournalist", "News photographer", "Broadcast journalist"], articleId: "journalist-status" }),
  defineStatus({ id: "highly-skilled-professional", englishName: "Highly Skilled Professional", japaneseName: "高度専門職", category: "business", summary: "A points-based or special highly skilled route for qualifying advanced academic, professional, or business activity.", purpose: "Qualifying highly skilled activity with immigration advantages tied to the authorized category.", typicalActivities: ["Advanced academic research", "Advanced specialized professional work", "Advanced business management"], articleId: "highly-skilled-professional-status", sourceIds: ["immigration-services-status-appendix", "mofa-highly-skilled-professional"] }),
  defineStatus({ id: "business-manager", englishName: "Business Manager", japaneseName: "経営・管理", category: "business", summary: "For operating or managing a qualifying business in Japan.", purpose: "Substantive business operation or management from an appropriate Japanese business base.", typicalActivities: ["Operating a company", "Managing a qualifying business division"], articleId: "business-manager-status", sourceIds: ["immigration-services-status-appendix", "mofa-working-visa", "isa-business-manager-reform"] }),
  defineStatus({ id: "legal-accounting-services", englishName: "Legal/Accounting Services", japaneseName: "法律・会計業務", category: "work", summary: "For reserved legal or accounting services performed under one of eleven professional qualifications recognized by Japanese law.", purpose: "Regulated legal and accounting professional services within the holder's Japanese qualification.", typicalActivities: ["Practicing as an attorney qualified in Japan", "Working as a qualifying accountant, tax accountant, scrivener, or another listed professional"], examples: ["Attorney", "Registered foreign lawyer", "Certified public accountant", "Certified tax accountant", "Judicial scrivener", "Administrative scrivener", "Patent attorney"], articleId: "legal-accounting-services-status" }),
  defineStatus({ id: "medical-services", englishName: "Medical Services", japaneseName: "医療", category: "work", summary: "For covered medical work performed within an effective Japanese professional qualification.", purpose: "Licensed medical practice in one of the professions named by the current immigration criteria.", typicalActivities: ["Practicing as a Japanese-licensed physician, dentist, pharmacist, or nurse", "Working in another allied-health profession expressly covered by the criteria"], examples: ["Physician", "Dentist", "Pharmacist", "Nurse", "Midwife", "Physical therapist", "Occupational therapist", "Clinical engineer"], articleId: "medical-services-status" }),
  defineStatus({ id: "researcher", englishName: "Researcher", japaneseName: "研究", category: "work", summary: "For qualifying research conducted under a contract with a Japanese organization outside the Professor route.", purpose: "Research activity at qualifying public or private organizations.", typicalActivities: ["Research at a company laboratory", "Investigation at a research institute"], articleId: "researcher-status" }),
  defineStatus({ id: "instructor", englishName: "Instructor", japaneseName: "教育", category: "work", summary: "For language education or other education at qualifying schools below the university level.", purpose: "Teaching at elementary, secondary, vocational, or comparable covered schools.", typicalActivities: ["Teaching at an elementary or secondary school", "Language instruction at a covered educational institution"], articleId: "instructor-status" }),
  defineStatus({ id: "engineer-specialist-humanities-international-services", englishName: "Engineer/Specialist in Humanities/International Services", japaneseName: "技術・人文知識・国際業務", category: "work", summary: "For qualifying professional work drawing on technical, humanities, or international-services expertise.", purpose: "Specialized professional services under a contract with an organization in Japan.", typicalActivities: ["Engineering or IT work", "Interpretation, design, or other qualifying specialist work"], examples: ["Software engineer", "Interpreter", "Designer"], articleId: "engineer-specialist-humanities-international-services-status" }),
  defineStatus({ id: "intra-company-transferee", englishName: "Intra-company Transferee", japaneseName: "企業内転勤", category: "work", summary: "For qualifying employees transferred within an international corporate group to a Japanese office.", purpose: "A time-limited intra-group transfer to perform covered technical, humanities, or international-services work.", typicalActivities: ["Transfer from an overseas office to a Japanese branch", "Transfer between qualifying affiliated entities"], articleId: "intra-company-transferee-status", sourceIds: ["immigration-services-status-appendix", "mofa-intra-company-transferee"] }),
  defineStatus({ id: "nursing-care", englishName: "Nursing Care", japaneseName: "介護", category: "work", summary: "For care or care instruction performed by a registered Certified Care Worker under a Japanese organization contract.", purpose: "Professional care work based on Certified Care Worker qualification and registration.", typicalActivities: ["Providing care as a registered Certified Care Worker", "Teaching care practice using the professional qualification"], examples: ["Certified Care Worker", "Care instructor holding Certified Care Worker registration"], articleId: "nursing-care-status" }),
  defineStatus({ id: "entertainer", englishName: "Entertainer", japaneseName: "興行", category: "work", summary: "For qualifying performance, sports, entertainment, advertising, or commercial production under an applicable activity category.", purpose: "Category-specific performance, entertainment, professional-sports, or commercial-production work.", typicalActivities: ["Music, acting, dance, modeling, or professional sports", "Advertising, broadcast, film, commercial-photography, or recording production"], examples: ["Actor", "Singer or musician", "Dancer or model", "Professional athlete", "Film or broadcast production worker", "Commercial photographer"], articleId: "entertainer-status", sourceIds: ["immigration-services-status-appendix", "mofa-entertainer"] }),
  defineStatus({ id: "skilled-labor", englishName: "Skilled Labor", japaneseName: "技能", category: "work", summary: "For skilled work in one of nine special industrial categories, each with its own experience or achievement criteria.", purpose: "Specialized skilled work in a closed occupational category under contract with a Japanese organization.", typicalActivities: ["Foreign-cuisine cooking or another foreign-specific craft", "Aircraft piloting, sports instruction, animal training, or wine appraisal"], examples: ["Foreign-cuisine chef", "Aircraft pilot", "Sports instructor", "Sommelier", "Jewelry or precious-metal craftsperson", "Animal trainer"], articleId: "skilled-labor-status", sourceIds: ["immigration-services-status-appendix", "isa-skilled-labor-status", "isa-skilled-labor-criteria"] }),
  defineStatus({ id: "specified-skilled-worker", englishName: "Specified Skilled Worker", japaneseName: "特定技能", category: "work", summary: "For qualifying employment in a currently designated industrial field under category (i) or (ii) program rules.", purpose: "Field- and duty-specific employment addressing labor needs through the Specified Skilled Worker program.", typicalActivities: ["Category (i) work with the required skill, language, employer, and support arrangements", "Higher-skill category (ii) work in a field where that category is available"], examples: ["Food-service worker", "Construction worker", "Industrial manufacturing worker", "Agricultural worker", "Accommodation worker", "Automobile transportation worker"], articleId: "specified-skilled-worker-status", sourceIds: ["immigration-services-status-appendix", "isa-specified-skilled-worker-status", "isa-specified-skilled-worker-fields"] }),
  defineStatus({ id: "technical-intern-training", englishName: "Technical Intern Training", japaneseName: "技能実習", category: "work", summary: "For participation in the regulated legacy technical-intern program under an approved plan, stage, work category, and organization structure.", purpose: "Skills transfer through supervised employment and instruction under an approved technical-intern plan.", typicalActivities: ["Technical Intern Training 1, 2, or 3 under an approved plan", "Covered employment and instruction with an implementing organization"], examples: ["Technical intern in an approved occupation and work category"], articleId: "technical-intern-training-status", sourceIds: ["isa-technical-intern-training-status", "otit-technical-intern-support", "isa-technical-intern-transition"], status: "needs-review", lastReviewedAt: "2026-09-12" }),
  defineStatus({ id: "employment-for-skill-development", englishName: "Employment for Skill Development", japaneseName: "育成就労", category: "work", summary: "Beginning April 1, 2027, for planned employment that develops workers toward Specified Skilled Worker (i) skills in covered shortage fields.", purpose: "Develop and retain workers through an approved employment plan in a covered field, ordinarily over three years.", typicalActivities: ["Employment and skills development under an approved field plan", "Japanese and skills development toward Specified Skilled Worker (i)"], examples: ["Development worker in a covered nursing-care, manufacturing, construction, accommodation, agriculture, food-service, or other approved field"], articleId: "employment-for-skill-development-system", sourceIds: ["isa-employment-skill-development", "isa-employment-skill-development-fields", "isa-employment-skill-development-qa"], status: "needs-review", lastReviewedAt: "2026-09-12" }),
  defineStatus({ id: "cultural-activities", englishName: "Cultural Activities", japaneseName: "文化活動", category: "study", summary: "For qualifying unpaid academic, artistic, or Japanese cultural study activity.", purpose: "Non-remunerative research or specialized study of culture or skills particular to Japan.", typicalActivities: ["Researching Japanese culture", "Studying a traditional art under an expert"], articleId: "cultural-activities-visa" }),
  defineStatus({ id: "temporary-visitor", englishName: "Temporary Visitor", japaneseName: "短期滞在", category: "visitor", summary: "For qualifying short, non-remunerative visits such as tourism, family visits, meetings, conferences, or short study; the visa, exemption, landing status, and granted period are distinct.", purpose: "Temporary activities that do not amount to ordinary paid work or resident settlement.", typicalActivities: ["Tourism or visiting relatives and friends", "Short business meetings, conferences, or observation", "Short non-remunerative study within the admitted period"], examples: ["Tourist", "Family visitor", "Conference attendee", "Short-course participant"], articleId: "temporary-visitor-and-short-stay", sourceIds: ["immigration-services-status-appendix", "isa-temporary-visitor-status", "mofa-short-stay", "mofa-visa-exemption", "mofa-evisa", "isa-residence-management-overview"], status: "needs-review", lastReviewedAt: "2026-09-12" }),
  defineStatus({ id: "student", englishName: "Student", japaneseName: "留学", category: "study", summary: "For education at universities, schools, and other qualifying educational institutions.", purpose: "Study at an institution covered by Student status.", typicalActivities: ["University or vocational study", "Study at an eligible language or other school"], articleId: "student-visa-and-certificate-of-eligibility" }),
  defineStatus({ id: "trainee", englishName: "Trainee", japaneseName: "研修", category: "study", summary: "For qualifying non-employment training that does not belong to Technical Intern Training.", purpose: "Acquiring skills through a covered training arrangement.", typicalActivities: ["Training through a public body", "Qualifying non-practical or public-sector training"], articleId: "training-visa" }),
  defineStatus({ id: "dependent", englishName: "Dependent", japaneseName: "家族滞在", category: "family", summary: "For a qualifying supported spouse or unmarried minor child of a foreign resident with an eligible principal status, including Specified Skilled Worker (ii) but not (i).", purpose: "Ordinary daily activities as a supported family member; ordinary paid work requires separate outside-activity permission.", typicalActivities: ["Living as a supported spouse", "Living as a supported unmarried minor child", "Limited part-time work after receiving applicable outside-activity permission"], examples: ["Spouse of a qualifying work-status holder", "Unmarried minor child of a qualifying Student-status holder"], articleId: "dependent-family-stay-visa", sourceIds: ["immigration-services-status-appendix", "isa-dependent-status", "isa-dependent-outside-activity"], status: "needs-review", lastReviewedAt: "2026-09-12" }),
  defineStatus({ id: "designated-activities", englishName: "Designated Activities", japaneseName: "特定活動", category: "designated", summary: "An umbrella status whose permitted activity, work, family options, period, renewal, and evidence depend on the person's exact designation.", purpose: "A specifically designated activity under a named program or individual decision.", typicalActivities: ["Continued job hunting or J-Find future-creation activity", "Working Holiday or Digital Nomad activity", "Long-stay sightseeing, Start-up preparation, medical stay, or another named designation"], examples: ["Graduate continuing a qualifying job search", "J-Find participant", "Digital nomad", "Working Holiday participant", "Long-stay sightseeing visitor"], articleId: "designated-activities-status", sourceIds: ["immigration-services-status-appendix", "mofa-designated-activities", "isa-designated-activities", "isa-continued-job-hunting", "isa-j-find", "isa-digital-nomad", "mofa-long-stay-sightseeing", "mofa-working-holiday"], status: "needs-review", lastReviewedAt: "2026-09-12" }),
  defineStatus({ id: "permanent-resident", englishName: "Permanent Resident", japaneseName: "永住者", category: "unrestricted", summary: "For a person granted permanent residence after a separate assessment of the applicable residence-history route, conduct, livelihood, public obligations, current period, and national-interest considerations.", purpose: "Residence without a fixed period of stay or activity-based work restriction after permanent-residence permission is granted.", typicalActivities: ["Living and working without activity-based status restrictions", "Maintaining residence-card, re-entry, tax, insurance, and other resident obligations"], articleId: "permanent-residence-in-japan", sourceIds: ["immigration-services-status-appendix", "isa-permanent-residence", "isa-permanent-residence-guidelines"], status: "needs-review", lastReviewedAt: "2026-09-12" }),
  defineStatus({ id: "spouse-or-child-japanese-national", englishName: "Spouse or Child of Japanese National", japaneseName: "日本人の配偶者等", category: "unrestricted", summary: "For a qualifying spouse, person born as the child of a Japanese national, or qualifying special adoptee.", purpose: "Residence based on the continuing covered relationship to a Japanese national, without an activity-based work restriction.", typicalActivities: ["Living in Japan as the qualifying spouse of a Japanese national", "Living in Japan as a person born as the child of a Japanese national", "Living in Japan as a qualifying special adoptee"], articleId: "spouse-or-child-of-japanese-national", sourceIds: ["immigration-services-status-appendix", "isa-spouse-japanese-status", "isa-spouse-notification", "isa-spouse-activity-reasons"], status: "needs-review", lastReviewedAt: "2026-09-12" }),
  defineStatus({ id: "spouse-or-child-permanent-resident", englishName: "Spouse or Child of Permanent Resident", japaneseName: "永住者の配偶者等", category: "unrestricted", summary: "For a qualifying spouse of a Permanent or Special Permanent Resident, or their biological child born in Japan who has continued residing in Japan.", purpose: "Residence based on the continuing covered relationship and circumstances, without an activity-based work restriction.", typicalActivities: ["Living as the qualifying spouse of a Permanent or Special Permanent Resident", "Living as a qualifying biological child born in Japan and continuously residing here"], articleId: "spouse-or-child-of-permanent-resident", sourceIds: ["immigration-services-status-appendix", "isa-spouse-permanent-status", "isa-spouse-notification", "isa-spouse-activity-reasons"], status: "needs-review", lastReviewedAt: "2026-09-12" }),
  defineStatus({ id: "long-term-resident", englishName: "Long-Term Resident", japaneseName: "定住者", category: "unrestricted", summary: "For a person within a relevant notification category or individually granted residence because of recognized special circumstances; it is not a general fallback status.", purpose: "Status-based residence for a qualifying personal position, without an activity-based work restriction.", typicalActivities: ["Residence under a covered Japanese-descendant or family category", "Residence through third-country refugee resettlement", "Residence based on another individually recognized special circumstance"], articleId: "long-term-resident-status", sourceIds: ["immigration-services-status-appendix", "isa-long-term-resident-status", "isa-long-term-resident-spouse-cases"], status: "needs-review", lastReviewedAt: "2026-09-12" }),
] as const;

export function getResidenceStatusBySlug(slug: string) {
  return residenceStatuses.find((status) => status.slug === slug);
}

export function getResidenceStatusById(id: string) {
  return residenceStatuses.find((status) => status.id === id);
}
