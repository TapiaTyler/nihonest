import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.miyazaki.miyazaki.jp";

/** Miyazaki City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-45201", name: "Miyazaki City", aliases: ["Miyazaki","Miyazaki-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "miyazaki-address-registration-foreign-residents", title: "Resident registration changes for foreign residents", url: `${base}/life/resident/resident_card/1155.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "miyazaki-national-health-insurance-joining", title: "Joining and leaving National Health Insurance", url: `${base}/health/national_health_insurance/mechanism/84976.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "miyazaki-household-waste-rules", title: "Basic waste rules", url: `${base}/life/trash/fractionation/341389.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "miyazaki-household-waste-handbook", title: "Household waste handbook", url: `${base}/life/trash/fractionation/610.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "miyazaki-resident-tax-filing", title: "How to submit the inhabitant tax return", url: `${base}/life/tax/city_prefectural/269121.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "miyazaki-resident-tax-faq", title: "Inhabitant tax questions and answers", url: `${base}/life/tax/city_prefectural/2235.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "miyazaki-disaster-preparation-tsunami-map", title: "Miyazaki tsunami hazard map", url: `${base}/life/fire_department/hazard_map/803.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "miyazaki-disaster-preparation-flood-map-languages", title: "Plain Japanese and multilingual flood hazard maps", url: `${base}/life/fire_department/hazard_map/285486.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "miyazaki-language-and-consultation-m-hub", title: "M HUB consultation desk for foreign residents (plain Japanese)", url: `${base}/easy/news/379061.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "miyazaki-language-and-consultation-japanese-classes", title: "Miyazaki City Japanese classes", url: `${base}/city/international_policy/410561.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "miyazaki-national-pension-leaving-job", title: "Joining National Pension after leaving a job", url: `${base}/life/pension/join/311325.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "miyazaki-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Miyazaki",
      summary: "Miyazaki asks foreign residents arriving from abroad to register within 14 days at the Citizens Section or a general branch office (Sadowara, Tano, Takaoka, or Kiyotake), with their residence card.",
      applicability: "Foreign residents legally staying more than three months, other than short-term visitors.",
      responsibleBody: "Miyazaki City", receivingOffice: "Citizens Section or a general branch office (Sadowara, Tano, Takaoka, Kiyotake)",
      actions: [
        { title: "File within 14 days", description: "File within 14 days of starting to live in Miyazaki. You, the head or a member of your household, or an agent with a letter of authorization can file. Groups of five or more should contact the city in advance." },
        { title: "Bring your residence card and relationship documents", description: "Bring your residence card (or passport if it has not been issued). Foreign residents joining a foreign head of household bring a document proving the relationship, such as a birth or marriage certificate, with a translation naming the translator." },
      ],
      sourceIds: ["miyazaki-address-registration-foreign-residents"],
      sourceFormatNote: `Miyazaki's foreign-resident page is in Japanese. ${note}`,
    },
    {
      id: "miyazaki-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Miyazaki",
      summary: "In Miyazaki, National Health Insurance starts from the day you become eligible and tax is charged from that month, so notify within 14 days at the National Health Insurance and Pension Section, a general branch office, or a regional center, or online through Mynaportal.",
      applicability: "For residents not covered by workplace insurance or public assistance.",
      responsibleBody: "Miyazaki City", receivingOffice: "National Health Insurance and Pension Section, a general branch office, or a regional center",
      actions: [
        { title: "Join with the right documents", description: "After leaving workplace insurance, bring the loss-of-coverage form from your employer or a coverage period certificate from the pension office, plus government-issued photo ID. You can apply from 14 days before your coverage ends; without proof of the end date, the city cannot process it." },
        { title: "Leave when you join workplace insurance", description: "Bring your eligibility certificate and proof of the new insurance if its certificate has not been issued; this can also be done by post or online." },
      ],
      sourceIds: ["miyazaki-national-health-insurance-joining"],
      sourceFormatNote: `Miyazaki's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "miyazaki-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Miyazaki",
      summary: "In Miyazaki, put waste out by 8:30 a.m. at your collection point, up to five bags at a time, with burnable and non-burnable waste in designated bags; the handbook is also in English, Korean, and Chinese, and bulky waste is booked through the city call center.",
      applicability: "Collection points are managed by neighborhood associations; ask neighbors or your association where yours is.",
      responsibleBody: "Miyazaki City",
      actions: [
        { title: "Follow the basic rules", description: "Put waste out by 8:30 a.m. on collection day, up to five bags at a time. Burnable and non-burnable waste go in designated bags; wash and dry recyclables. Incorrectly sorted waste is left with a sticker for you to take back and sort." },
        { title: "Book bulky waste", description: "Items with any side of 1 m or more are bulky waste; apply through the Miyazaki City Call Center at 0985-25-2111." },
      ],
      sourceIds: ["miyazaki-household-waste-rules", "miyazaki-household-waste-handbook"],
      sourceFormatNote: `Miyazaki's waste pages are in Japanese; the handbook has versions in three other languages. ${note}`,
    },
    {
      id: "miyazaki-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Miyazaki",
      summary: "Miyazaki's fiscal 2026 inhabitant tax return was due March 16, 2026, by post or online, with filing venues open by reservation from February 2; tax may still be charged the year after you leave a job.",
      applicability: "Use Miyazaki's route when you lived in Miyazaki on January 1 of the tax year.",
      responsibleBody: "Miyazaki City",
      actions: [
        { title: "File by post or online", description: "Post the return with copies of your identification and income and deduction documents to the Citizen Tax Section, or prepare it online. Venues were open weekdays by reservation from February 2 to March 16, 2026; returns cannot be sent by fax or email." },
        { title: "Expect tax after leaving a job", description: "Inhabitant tax is charged on the previous year's income, so you may receive a tax notice after leaving a job, including the year after." },
      ],
      sourceIds: ["miyazaki-resident-tax-filing", "miyazaki-resident-tax-faq"],
      sourceFormatNote: `Miyazaki's tax pages are in Japanese. ${note}`,
    },
    {
      id: "miyazaki-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Miyazaki",
      summary: "Miyazaki made a new tsunami hazard map after Miyazaki Prefecture published new Nankai Trough estimates in August 2025, and its flood hazard map is available in plain Japanese and other languages.",
      applicability: "A Nankai Trough earthquake could happen without warning; check the maps now.",
      responsibleBody: "Miyazaki City",
      actions: [
        { title: "Check the tsunami map", description: "The map shows the expected tsunami flooding area and depth for the largest-class tsunami. In October 2025 the prefecture designated the city a tsunami disaster alert area." },
        { title: "Use the plain Japanese flood map", description: "The plain Japanese flood map explains evacuation information, emergency supplies, typhoons, landslides, and a personal evacuation timeline." },
      ],
      sourceIds: ["miyazaki-disaster-preparation-tsunami-map", "miyazaki-disaster-preparation-flood-map-languages"],
      sourceFormatNote: `Miyazaki's hazard map pages are in Japanese; the flood map has plain Japanese and multilingual versions. ${note}`,
    },
    {
      id: "miyazaki-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Miyazaki",
      summary: "Miyazaki's M HUB consultation desk, opened in June 2024, answers questions from foreign residents in 17 languages, and the city runs free Japanese classes taught by Japanese teachers at local community centers.",
      applicability: "For foreign residents of Miyazaki. Anyone can join the Japanese classes.",
      responsibleBody: "Miyazaki City",
      actions: [
        { title: "Ask M HUB first", description: "Take questions or problems to M HUB, which works in 17 languages; guides and leaflets are in English, Chinese, Korean, Vietnamese, and plain Japanese." },
        { title: "Join a Japanese class", description: "Classes are free and give a city certificate of completion; they meet at community centers such as Sumiyoshi, Tano, Kano, and Takaoka. Apply by form, phone (0985-23-8555), or email to the International Policy Division." },
      ],
      sourceIds: ["miyazaki-language-and-consultation-m-hub", "miyazaki-language-and-consultation-japanese-classes"],
      sourceFormatNote: `Miyazaki's pages are in plain Japanese. ${note}`,
    },
    {
      id: "miyazaki-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Miyazaki",
      summary: "In Miyazaki, residents aged 20 to 59 who leave a job switch from employee pension to Category I National Pension at the National Pension unit, a general branch office, a regional center, or online.",
      applicability: "For residents aged 20 to 59 who leave employee pension coverage.",
      responsibleBody: "Miyazaki City", receivingOffice: "National Pension unit, National Health Insurance and Pension Section (City Hall 2nd building 1st floor), a general branch office, a regional center, or the Miyazaki Pension Office",
      actions: [
        { title: "Switch after leaving a job", description: "Bring something showing your Basic Pension Number, photo ID, and a document showing your leaving date, such as the health insurance loss form or separation notice, and submit the notification form. You can also apply through Mynaportal or post it to the Miyazaki Pension Office." },
      ],
      sourceIds: ["miyazaki-national-pension-leaving-job"],
      sourceFormatNote: `Miyazaki's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "tax-year", records: ["miyazaki-resident-tax"], statement: "Fiscal 2026 deadline \"March 16, 2026\" and venue period from February 2." },
    { kind: "gap", records: ["miyazaki-resident-tax"], gap: "The leaving-Japan (tax agent) step." },
    { kind: "gap", records: ["miyazaki-language-and-consultation"], gap: "M HUB location and hours on a current city page." },
  ],
});
