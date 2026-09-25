import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision";
import {
  currentJapaneseArticleTranslations,
  japaneseArticleTranslations,
} from "./article-translations";

vi.mock("server-only", () => ({}));

const sourcePaths: Readonly<Record<string, string>> = {
  "visa-and-status-of-residence-explained": "content/articles/visa-and-status-of-residence-explained.mdx",
  "preparing-to-enter-japan": "content/articles/preparing-to-enter-japan.mdx",
  "getting-a-phone-number-in-japan": "content/articles/getting-a-phone-number-in-japan.mdx",
  "understanding-my-number": "content/articles/understanding-my-number.mdx",
  "finding-japanese-language-and-local-support": "content/articles/finding-japanese-language-and-local-support.mdx",
  "setting-up-electricity-gas-water-and-home-internet": "content/articles/setting-up-electricity-gas-water-and-home-internet.mdx",
  "sorting-household-waste-and-arranging-disposal": "content/articles/sorting-household-waste-and-arranging-disposal.mdx",
  "calling-police-fire-and-ambulance-services-in-japan": "content/articles/calling-police-fire-and-ambulance-services-in-japan.mdx",
  "preparing-for-disasters-and-evacuation-in-japan": "content/articles/preparing-for-disasters-and-evacuation-in-japan.mdx",
  "planning-your-studies-in-japan": "content/articles/planning-your-studies-in-japan.mdx",
  "short-term-study-in-japan": "content/articles/short-term-study-in-japan.mdx",
  "choosing-a-school-and-understanding-admission-requirements": "content/articles/choosing-a-school-and-understanding-admission-requirements.mdx",
  "student-visa-and-certificate-of-eligibility": "content/articles/student-visa-and-certificate-of-eligibility.mdx",
  "working-part-time-on-student-status": "content/articles/working-part-time-on-student-status.mdx",
  "completing-school-arrival-procedures": "content/articles/completing-school-arrival-procedures.mdx",
  "accepting-international-students-and-supporting-coe-applications": "content/articles/accepting-international-students-and-supporting-coe-applications.mdx",
  "choosing-a-work-status-and-coe": "content/articles/choosing-a-work-status-and-coe.mdx",
  "accepting-foreign-workers-and-supporting-coe-applications": "content/articles/accepting-foreign-workers-and-supporting-coe-applications.mdx",
  "understanding-language-requirements-and-certifications-for-jobs-in-japan": "content/articles/understanding-language-requirements-and-certifications-for-jobs-in-japan.mdx",
  "understanding-your-employment-contract-and-working-conditions": "content/articles/understanding-your-employment-contract-and-working-conditions.mdx",
  "wages-working-hours-overtime-and-paid-leave": "content/articles/wages-working-hours-overtime-and-paid-leave.mdx",
  "resigning-dismissal-and-fixed-term-contract-endings": "content/articles/resigning-dismissal-and-fixed-term-contract-endings.mdx",
  "notifying-immigration-about-work-contract-changes": "content/articles/notifying-immigration-about-work-contract-changes.mdx",
  "renewing-or-changing-your-status-of-residence": "content/articles/renewing-or-changing-your-status-of-residence.mdx",
  "side-work-and-freelancing-on-a-work-status": "content/articles/side-work-and-freelancing-on-a-work-status.mdx",
  "freelance-contracts-and-client-obligations-in-japan": "content/articles/freelance-contracts-and-client-obligations-in-japan.mdx",
  "tax-for-side-work-and-sole-proprietors": "content/articles/tax-for-side-work-and-sole-proprietors.mdx",
  "payroll-withholding-and-year-end-adjustment": "content/articles/payroll-withholding-and-year-end-adjustment.mdx",
  "filing-a-japanese-income-tax-return": "content/articles/filing-a-japanese-income-tax-return.mdx",
  "tax-residence-and-taxable-income-in-japan": "content/articles/tax-residence-and-taxable-income-in-japan.mdx",
  "income-and-resident-tax-after-moving-to-japan": "content/articles/income-and-resident-tax-after-moving-to-japan.mdx",
  "foreign-income-tax-treaties-and-foreign-tax-credits": "content/articles/foreign-income-tax-treaties-and-foreign-tax-credits.mdx",
  "consumption-tax-and-the-invoice-system": "content/articles/consumption-tax-and-the-invoice-system.mdx",
  "tax-procedures-before-leaving-japan": "content/articles/tax-procedures-before-leaving-japan.mdx",
  "registering-your-address-after-arrival": "content/articles/registering-your-address-after-arrival.mdx",
  "joining-national-health-insurance": "content/articles/joining-national-health-insurance.mdx",
  "national-pension-after-moving-to-japan": "content/articles/national-pension-after-moving-to-japan.mdx",
  "employment-insurance-social-insurance-and-work-injury": "content/articles/employment-insurance-social-insurance-and-work-injury.mdx",
  "workplace-harassment-safety-and-getting-help": "content/articles/workplace-harassment-safety-and-getting-help.mdx",
  "documents-received-when-entering-japan": "content/articles/documents-received-when-entering-japan.mdx",
  "finding-housing-and-moving-in": "content/articles/finding-housing-and-moving-in.mdx",
  "opening-a-bank-account-after-moving-to-japan": "content/articles/opening-a-bank-account-after-moving-to-japan.mdx",
  "driving-in-japan-with-a-foreign-or-international-license": "content/articles/driving-in-japan-with-a-foreign-or-international-license.mdx",
  "driving-rules-and-traffic-accidents-in-japan": "content/articles/driving-rules-and-traffic-accidents-in-japan.mdx",
  "converting-a-foreign-drivers-license-in-japan": "content/articles/converting-a-foreign-drivers-license-in-japan.mdx",
  "buying-registering-and-insuring-a-vehicle-in-japan": "content/articles/buying-registering-and-insuring-a-vehicle-in-japan.mdx",
  "bicycle-rules-registration-and-accidents-in-japan": "content/articles/bicycle-rules-registration-and-accidents-in-japan.mdx",
  "consumer-contracts-cancellations-and-getting-help": "content/articles/consumer-contracts-cancellations-and-getting-help.mdx",
  "living-in-a-japanese-neighborhood-and-shared-spaces": "content/articles/living-in-a-japanese-neighborhood-and-shared-spaces.mdx",
  "preparing-for-long-term-entry-to-japan": "content/articles/preparing-for-long-term-entry-to-japan.mdx",
  "temporary-visitor-and-short-stay": "content/articles/temporary-visitor-and-short-stay.mdx",
  "reentry-permission-and-temporary-travel": "content/articles/reentry-permission-and-temporary-travel.mdx",
  "leaving-japan-and-closing-out-procedures": "content/articles/leaving-japan-and-closing-out-procedures.mdx",
  "permanent-residence-in-japan": "content/articles/permanent-residence-in-japan.mdx",
  "choosing-a-family-or-personal-status-in-japan": "content/articles/choosing-a-family-or-personal-status-in-japan.mdx",
  "dependent-family-stay-visa": "content/articles/dependent-family-stay-visa.mdx",
  "spouse-or-child-of-japanese-national": "content/articles/spouse-or-child-of-japanese-national.mdx",
  "spouse-or-child-of-permanent-resident": "content/articles/spouse-or-child-of-permanent-resident.mdx",
  "long-term-resident-status": "content/articles/long-term-resident-status.mdx",
  "choosing-a-residence-status-for-teaching-in-japan": "content/articles/choosing-a-residence-status-for-teaching-in-japan.mdx",
  "professor-status": "content/articles/professor-status.mdx",
  "instructor-status": "content/articles/instructor-status.mdx",
  "engineer-specialist-humanities-international-services-status": "content/articles/engineer-specialist-humanities-international-services-status.mdx",
  "side-jobs-and-multiple-employers-in-japan": "content/articles/side-jobs-and-multiple-employers-in-japan.mdx",
  "artist-status": "content/articles/artist-status.mdx",
  "journalist-status": "content/articles/journalist-status.mdx",
  "researcher-status": "content/articles/researcher-status.mdx",
  "intra-company-transferee-status": "content/articles/intra-company-transferee-status.mdx",
  "religious-activities-status": "content/articles/religious-activities-status.mdx",
  "technical-intern-training-status": "content/articles/technical-intern-training-status.mdx",
  "employment-for-skill-development-system": "content/articles/employment-for-skill-development-system.mdx",
  "specified-skilled-worker-status": "content/articles/specified-skilled-worker-status.mdx",
  "choosing-a-residence-status-for-creative-and-media-work": "content/articles/choosing-a-residence-status-for-creative-and-media-work.mdx",
  "entertainer-status": "content/articles/entertainer-status.mdx",
  "skilled-labor-status": "content/articles/skilled-labor-status.mdx",
  "cultural-activities-visa": "content/articles/cultural-activities-visa.mdx",
  "training-visa": "content/articles/training-visa.mdx",
  "designated-activities-status": "content/articles/designated-activities-status.mdx",
  "business-manager-status": "content/articles/business-manager-status.mdx",
  "highly-skilled-professional-status": "content/articles/highly-skilled-professional-status.mdx",
  "startup-visa": "content/articles/startup-visa.mdx",
  "choosing-a-status-for-medical-and-care-work-in-japan": "content/articles/choosing-a-status-for-medical-and-care-work-in-japan.mdx",
  "medical-services-status": "content/articles/medical-services-status.mdx",
  "nursing-care-status": "content/articles/nursing-care-status.mdx",
  "continued-job-hunting-after-study": "content/articles/continued-job-hunting-after-study.mdx",
  "future-creation-j-find": "content/articles/future-creation-j-find.mdx",
  "digital-nomad-designated-activities": "content/articles/digital-nomad-designated-activities.mdx",
  "long-stay-sightseeing-designated-activities": "content/articles/long-stay-sightseeing-designated-activities.mdx",
  "diplomatic-visa": "content/articles/diplomatic-visa.mdx",
  "official-visa": "content/articles/official-visa.mdx",
  "medical-stay-visa": "content/articles/medical-stay-visa.mdx",
  "working-holiday-in-japan": "content/articles/working-holiday-in-japan.mdx",
  "legal-accounting-services-status": "content/articles/legal-accounting-services-status.mdx",
  "choosing-a-training-or-workforce-development-route-in-japan": "content/articles/choosing-a-training-or-workforce-development-route-in-japan.mdx",
  "understanding-japan-geography-government-and-language": "content/articles/understanding-japan-geography-government-and-language.mdx",
  "using-ibkr-japan-to-trade-us-stocks": "content/articles/using-ibkr-japan-to-trade-us-stocks.mdx",
  "reporting-ibkr-japan-investments-on-japanese-taxes": "content/articles/reporting-ibkr-japan-investments-on-japanese-taxes.mdx",
};

function markdownStructure(source: string) {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  return lines.flatMap((line) => {
    const heading = /^(#{2,6})\s/.exec(line);
    if (heading) return [`heading-${heading[1].length}`];
    if (/^\s*[-*+]\s+/.test(line)) return ["unordered-item"];
    if (/^\s*\d+\.\s+/.test(line)) return ["ordered-item"];
    return [];
  });
}

describe("Japanese article translation registry", () => {
  it("publishes one current machine-translated artifact for each regenerated guide", () => {
    expect(currentJapaneseArticleTranslations.map(({ contentId }) => contentId).sort()).toEqual(Object.keys(sourcePaths).sort());
    expect(currentJapaneseArticleTranslations.every(({ availability, reviewState }) => (
      availability === "active" && reviewState === "machine-translated"
    ))).toBe(true);
  });

  it("matches current canonical, terminology, and prompt revisions", () => {
    const terminology = readFileSync(resolve(process.cwd(), "src/data/translations/ja/protected-terminology.ts"), "utf8");
    const prompt = readFileSync(resolve(process.cwd(), "content/translations/JAPANESE-ARTICLE-PROMPT.md"), "utf8");
    const terminologyRevision = createTranslationSourceRevision({ source: terminology });
    const promptRevision = createTranslationSourceRevision({ source: prompt });

    const actualSourceRevisions = Object.fromEntries(currentJapaneseArticleTranslations.map((artifact) => {
      const source = readFileSync(resolve(process.cwd(), sourcePaths[artifact.contentId]), "utf8");
      return [artifact.contentId, createTranslationSourceRevision({ source })];
    }));
    expect(Object.fromEntries(currentJapaneseArticleTranslations.map(({ contentId, sourceRevision }) => [contentId, sourceRevision]))).toEqual(actualSourceRevisions);
    for (const artifact of currentJapaneseArticleTranslations) {
      expect(artifact.terminologyRevision).toBe(terminologyRevision);
      expect(artifact.promptRevision).toBe(promptRevision);
    }
  });

  it("preserves canonical Markdown heading and list structure", () => {
    const mismatches = currentJapaneseArticleTranslations.flatMap((artifact) => {
      const source = readFileSync(resolve(process.cwd(), sourcePaths[artifact.contentId]), "utf8");
      const canonicalBody = source.slice(source.indexOf("}\n") + 2);
      const canonical = markdownStructure(canonicalBody);
      const localized = markdownStructure(artifact.fields.body ?? "");
      return JSON.stringify(canonical) === JSON.stringify(localized)
        ? []
        : [{ contentId: artifact.contentId, canonical, localized }];
    });

    expect(mismatches).toEqual([]);
  });

  it("retains stale pilot history while exposing current linked Japanese guidance", () => {
    expect(japaneseArticleTranslations.filter(({ availability }) => availability === "stale")).toHaveLength(2);
    expect(currentJapaneseArticleTranslations[0].fields.body).toContain("[在留資格](/glossary/zairyu-shikaku)");
    expect(currentJapaneseArticleTranslations[1].fields.body).toContain("[上陸許可](/glossary/joriku-kyoka)");
    expect(currentJapaneseArticleTranslations[2].fields.body).toContain("[本人確認](/glossary/honnin-kakunin)");
    expect(currentJapaneseArticleTranslations[3].fields.body).toContain("[マイナンバー](/glossary/my-number)");
    expect(currentJapaneseArticleTranslations[4].fields.body).toContain("[生活日本語](/glossary/seikatsu-nihongo)");
    expect(currentJapaneseArticleTranslations[5].fields.body).toContain("[電気](/glossary/denki)");
    expect(currentJapaneseArticleTranslations[6].fields.body).toContain("[ごみ分別](/glossary/gomi-bunbetsu)");
    expect(currentJapaneseArticleTranslations[7].fields.body).toContain("[110番](/glossary/hyakutoban)");
    expect(currentJapaneseArticleTranslations[8].fields.body).toContain("[指定緊急避難場所](/glossary/shitei-kinkyu-hinan-basho)");
    expect(currentJapaneseArticleTranslations[9].fields.body).toContain("[短期滞在](/glossary/tanki-taizai)");
    expect(currentJapaneseArticleTranslations[10].fields.body).toContain("[上陸許可](/glossary/joriku-kyoka)");
    expect(currentJapaneseArticleTranslations[11].fields.body).toContain("[専門学校](/glossary/senmon-gakko)");
    expect(currentJapaneseArticleTranslations[12].fields.body).toContain("[在留資格認定証明書](/glossary/certificate-of-eligibility)");
    expect(currentJapaneseArticleTranslations[13].fields.body).toContain("[資格外活動許可](/glossary/shikakugai-katsudo-kyoka)");
    expect(currentJapaneseArticleTranslations[14].fields.body).toContain("[在留カード](/glossary/zairyu-card)");
    expect(currentJapaneseArticleTranslations[15].fields.body).toContain("5月1日および11月1日");
    expect(currentJapaneseArticleTranslations[16].fields.body).toContain("[在留資格変更許可](/glossary/zairyu-shikaku-henko-kyoka)");
    expect(currentJapaneseArticleTranslations[17].fields.body).toContain("[所属機関に関する届出](/glossary/shozoku-kikan-todokede)");
    expect(currentJapaneseArticleTranslations[18].fields.body).toContain("[日本語能力試験](/glossary/nihongo-noryoku-shiken)");
    expect(currentJapaneseArticleTranslations[19].fields.body).toContain("[労働条件通知書](/glossary/rodo-joken-tsuchisho)");
    expect(currentJapaneseArticleTranslations[20].fields.body).toContain("[36協定](/glossary/saburoku-kyotei)");
    expect(currentJapaneseArticleTranslations[21].fields.body).toContain("[退職証明書](/glossary/taishoku-shomeisho)");
    expect(currentJapaneseArticleTranslations[22].fields.body).toContain("[所属機関に関する届出](/glossary/shozoku-kikan-todokede)");
    expect(currentJapaneseArticleTranslations[23].fields.body).toContain("[特例期間](/glossary/tokurei-kikan)");
    expect(currentJapaneseArticleTranslations[24].fields.body).toContain("[資格外活動許可](/glossary/shikakugai-katsudo-kyoka)");
    expect(currentJapaneseArticleTranslations[25].fields.body).toContain("[フリーランス法](/glossary/freelance-ho)");
    expect(currentJapaneseArticleTranslations[26].fields.body).toContain("[青色申告](/glossary/aoiro-shinkoku)");
    expect(currentJapaneseArticleTranslations[27].fields.body).toContain("[年末調整](/glossary/nenmatsu-chosei)");
    expect(currentJapaneseArticleTranslations[28].fields.body).toContain("[納税管理人](/glossary/nozei-kanrinin)");
    expect(currentJapaneseArticleTranslations[29].fields.body).toContain(":::tax-residence-scope");
    expect(currentJapaneseArticleTranslations[30].fields.body).toContain("[特別徴収](/glossary/tokubetsu-choshu)");
    expect(currentJapaneseArticleTranslations[31].fields.body).toContain("[外国税額控除](/glossary/gaikoku-zeigaku-kojo)");
    expect(currentJapaneseArticleTranslations[32].fields.body).toContain("[適格請求書発行事業者](/glossary/tekikaku-seikyusho-hakko-jigyosha)");
    expect(currentJapaneseArticleTranslations[33].fields.body).toContain("[準確定申告](/glossary/jun-kakutei-shinkoku)");
    expect(currentJapaneseArticleTranslations[34].fields.body).toContain("[転入届](/glossary/tennyu-todoke)");
    expect(currentJapaneseArticleTranslations[35].fields.body).toContain("[国民健康保険](/glossary/kokumin-kenko-hoken)");
    expect(currentJapaneseArticleTranslations[36].fields.body).toContain("[学生納付特例制度](/glossary/gakusei-nofu-tokurei-seido)");
    expect(currentJapaneseArticleTranslations[37].fields.body).toContain("[労災保険](/glossary/rosai-hoken)");
    expect(currentJapaneseArticleTranslations[38].fields.body).toContain("[総合労働相談コーナー](/glossary/sogo-rodo-sodan-corner)");
    expect(currentJapaneseArticleTranslations[39].fields.body).toContain("[上陸許可](/glossary/joriku-kyoka)");
    expect(currentJapaneseArticleTranslations[40].fields.body).toContain("[賃貸保証会社](/glossary/rentai-hosho-gaisha)");
    expect(currentJapaneseArticleTranslations[41].fields.body).toContain("[本人確認](/glossary/honnin-kakunin)");
    expect(currentJapaneseArticleTranslations[42].fields.body).toContain("[国際運転免許証](/glossary/kokusai-unten-menkyo-sho)");
    expect(currentJapaneseArticleTranslations[43].fields.body).toContain("[自賠責保険](/glossary/jibaiseki-hoken)");
    expect(currentJapaneseArticleTranslations[44].fields.body).toContain("[運転免許センター](/glossary/unten-menkyo-center)");
    expect(currentJapaneseArticleTranslations[45].fields.body).toContain("[車庫証明](/glossary/shako-shomei)");
    expect(currentJapaneseArticleTranslations[46].fields.body).toContain("[青切符](/glossary/aokippu)");
    expect(currentJapaneseArticleTranslations[47].fields.body).toContain("[消費者ホットライン](/glossary/shohisha-hotline)");
    expect(currentJapaneseArticleTranslations[48].fields.body).toContain("[町内会・自治会](/glossary/chonaikai-jichikai)");
    expect(currentJapaneseArticleTranslations[49].fields.body).toContain("[在留資格認定証明書](/glossary/certificate-of-eligibility)");
    expect(currentJapaneseArticleTranslations[50].fields.body).toContain("[短期滞在](/glossary/tanki-taizai)");
    expect(currentJapaneseArticleTranslations[51].fields.body).toContain("合計は3,720円または6,720円");
    expect(currentJapaneseArticleTranslations[52].fields.body).toContain("[転出届](/glossary/tenshutsu-todoke)");
    expect(currentJapaneseArticleTranslations[53].fields.body).toContain("手数料は**200,000円**");
    expect(currentJapaneseArticleTranslations[54].fields.body).toContain("[家族滞在](/glossary/kazoku-taizai)");
    expect(currentJapaneseArticleTranslations[55].fields.body).toContain("[資格外活動許可](/glossary/shikakugai-katsudo-kyoka)");
    expect(currentJapaneseArticleTranslations[56].fields.body).toContain("[日本人の配偶者等](/glossary/nihonjin-no-haigusha-to)");
    expect(currentJapaneseArticleTranslations[57].fields.body).toContain("[永住者の配偶者等](/glossary/eijusha-no-haigusha-to)");
    expect(currentJapaneseArticleTranslations[58].fields.body).toContain("[定住者](/glossary/teijusha)");
    expect(currentJapaneseArticleTranslations[59].fields.body).toContain("[外国語指導助手](/glossary/gaikokugo-shido-joshu)");
    expect(currentJapaneseArticleTranslations[60].fields.body).toContain("[教授](/glossary/kyoju)");
    expect(currentJapaneseArticleTranslations[61].fields.body).toContain("[教育](/glossary/kyoiku)");
    expect(currentJapaneseArticleTranslations[62].fields.body).toContain("[技術・人文知識・国際業務](/glossary/gijutsu-jinbun-kokusai)");
    expect(currentJapaneseArticleTranslations[63].fields.body).toContain("[副業・兼業](/glossary/fukugyo-kengyo)");
    expect(currentJapaneseArticleTranslations[64].fields.body).toContain("[芸術](/glossary/geijutsu)");
    expect(currentJapaneseArticleTranslations[65].fields.body).toContain("[報道](/glossary/hodo)");
    expect(currentJapaneseArticleTranslations[66].fields.body).toContain("[研究](/glossary/kenkyu)");
    expect(currentJapaneseArticleTranslations[67].fields.body).toContain("[企業内転勤](/glossary/kigyonai-tenkin)");
    expect(currentJapaneseArticleTranslations[68].fields.body).toContain("[宗教](/glossary/shukyo)");
    expect(currentJapaneseArticleTranslations[69].fields.body).toContain("[技能実習](/glossary/gino-jisshu)");
    expect(currentJapaneseArticleTranslations[70].fields.body).toContain("[育成就労](/glossary/ikusei-shuro)");
    expect(currentJapaneseArticleTranslations[71].fields.body).toContain("[特定技能](/glossary/tokutei-gino)");
    expect(currentJapaneseArticleTranslations[72].fields.body).toContain("[技術・人文知識・国際業務](/glossary/gijutsu-jinbun-kokusai)");
    expect(currentJapaneseArticleTranslations[73].fields.body).toContain("[興行](/glossary/kogyo)");
    expect(currentJapaneseArticleTranslations[74].fields.body).toContain("[技能](/glossary/gino)");
    expect(currentJapaneseArticleTranslations[75].fields.body).toContain("[文化活動](/glossary/bunka-katsudo)");
    expect(currentJapaneseArticleTranslations[76].fields.body).toContain("[研修](/glossary/kenshu)");
    expect(currentJapaneseArticleTranslations[77].fields.body).toContain("[特定活動](/glossary/tokutei-katsudo)");
    expect(currentJapaneseArticleTranslations.find(({ contentId }) => contentId === "understanding-japan-geography-government-and-language")?.fields.body).toContain(":::japan-prefecture-regions");
  });
});
