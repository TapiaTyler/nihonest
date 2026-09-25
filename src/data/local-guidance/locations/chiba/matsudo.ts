import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.matsudo.chiba.jp";

/** Matsudo City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-12207", name: "Matsudo City", aliases: ["Matsudo", "Matsudo-shi"], planGroup: "major-city" },
  sources: [
    { id: "matsudo-address-registration-moving-in", title: "Moving-in notification", url: `${base}/kurashi/todokede/todokede_etsuran/hikkosi-tetuduki/tennyuu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsudo-national-health-insurance-notifications", title: "National Health Insurance notifications", url: `${base}/kurashi/hoken_nenkin/kokuho/kokuhonosikumi/shikaku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsudo-household-waste-foreign-languages", title: "Household waste guide in other languages", url: `${base}/kurashi/gomi_shinyou/wakekatadashikata/gaikokugobann.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsudo-household-waste-bulky", title: "Bulky waste", url: `${base}/kurashi/gomi_shinyou/wakekatadashikata/sodaigomi/index.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsudo-resident-tax-filing", title: "Municipal and prefectural inhabitant tax return", url: `${base}/kurashi/zeikin_top/kojiin/shikenminzei/kojin_shinkokusyo.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsudo-resident-tax-agent", title: "Tax agent for inhabitant tax", url: `${base}/kurashi/zeikin_top/kojiin/shikenminzei/nouzeikanrinin.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsudo-disaster-preparation-hazard-maps", title: "Matsudo flood hazard maps", url: `${base}/kurashi/anzen_anshin/sonae/bousai_taisaku/20183.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsudo-disaster-preparation-shelter-opening", title: "Shelter opening standards for storms and floods", url: `${base}/kurashi/anzen_anshin/sonae/hinanbasho/saigai_hinanjo.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsudo-language-and-consultation-consultation", title: "Consultation Service for Non-Japanese", url: `${base}/shiminnokoe/soudan/kouchou_gaikokujin.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsudo-language-and-consultation-japanese-classes", title: "Learning Japanese", url: `${base}/InternationalPortal/en/forforeignresidents/LearningJapanese.html`, language: "en", lastCheckedAt: "2026-09-25" },
    { id: "matsudo-national-pension-leaving-job", title: "National Pension when you leave a job", url: `${base}/kurashi/hoken_nenkin/nenkin/kokuho/scenebetsu_annai/nenkintaisyoku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "matsudo-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Matsudo",
      summary: "Matsudo takes moving-in notifications only at the counter, within 14 days, at the Citizens Section or a branch office on weekdays 9 a.m. to 4:30 p.m., and by reservation at the Administrative Service Center on the second and fourth Sundays.",
      applicability: "Residents moving into Matsudo from abroad or from another municipality.",
      responsibleBody: "Matsudo City", receivingOffice: "Citizens Section or a branch office",
      actions: [
        { title: "Notify at the counter within 14 days", description: "File within 14 days of starting to live in Matsudo; not filing without good reason can lead to a non-penal fine. The Citizens Section and branch offices are open weekdays 9 a.m. to 4:30 p.m. From July 2026 the Administrative Service Center also takes notifications on the second and fourth Sundays, 10 a.m. to 6 p.m., by advance reservation." },
        { title: "Bring your residence card", description: "If you received a residence card at the airport, bring it; if not, bring your passport. When a foreign head of household registers new foreign household members, documents proving the relationship, such as marriage or birth certificates, may be needed." },
      ],
      sourceIds: ["matsudo-address-registration-moving-in"],
      sourceFormatNote: `Matsudo's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "matsudo-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Matsudo",
      summary: "In Matsudo, the head of household notifies the National Health Insurance and Pension Section or a branch office within 14 days of joining or leaving; the service center inside Matsudo Station cannot handle it.",
      applicability: "For residents not covered by workplace insurance or public assistance.",
      responsibleBody: "Matsudo City", receivingOffice: "National Health Insurance and Pension Section (Main Building 1st floor), or a branch office",
      actions: [
        { title: "Join with the right document", description: "Bring the document for your case, such as proof that your previous health insurance ended, and a bank cash card for paying premiums. The eligibility certificate is posted to your home in principle." },
        { title: "Leave when you join other insurance", description: "Joining or leaving workplace insurance does not automatically change your National Health Insurance. Bring both insurance certificates, or proof of joining if the new one has not been issued. Some notifications can be made by post; ask the call center at 047-712-0141." },
      ],
      sourceIds: ["matsudo-national-health-insurance-notifications"],
      sourceFormatNote: `Matsudo's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "matsudo-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Matsudo",
      summary: "Matsudo's waste guide and area collection table are available in six other languages, and bulky waste (items about 50 cm or more on a side) is collected by reservation with a 1,000-yen ticket per item.",
      applicability: "Collection days follow the address of your collection point, across 12 areas.",
      responsibleBody: "Matsudo City",
      actions: [
        { title: "Get the guide and collection table", description: "The household waste guide and area collection table are in English, Chinese, Korean, Vietnamese, Nepali, and Indonesian, with simplified versions, and are handed out at the Waste Management Section, the Citizens Section, and branch offices. Paper and cloth alternate weekly with bottles and cans, so check your area." },
        { title: "Reserve bulky waste collection", description: "Call the Bulky Waste Reception Center at 047-391-0007 (8:30 a.m. to 5 p.m., closed Sundays and holidays) or apply online at any time; use the phone for dates within 13 days. Buy a 1,000-yen bulky waste ticket per item, write your name or reception number and collection date on it, and put the item out by 8:30 a.m. on the collection day." },
      ],
      sourceIds: ["matsudo-household-waste-foreign-languages", "matsudo-household-waste-bulky"],
      sourceFormatNote: `Matsudo's waste pages are in Japanese; the guide has versions in six other languages. ${note}`,
    },
    {
      id: "matsudo-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Matsudo",
      summary: "Matsudo's inhabitant tax return can be submitted online, and taxpayers who leave Japan name a tax agent, who can be a friend or a company, with the Citizen Tax Section.",
      applicability: "Use Matsudo's route when you lived in Matsudo on January 1 of the tax year; if not, file with your previous municipality.",
      responsibleBody: "Matsudo City",
      actions: [
        { title: "Check whether you must file", description: "File if you had business, rent, or dividend income, salary with other income of 200,000 yen or less, or salary your employer did not report to Matsudo. People with no income may also need to file, for example if they are not anyone's dependent. You do not need to file if you filed an income-tax return." },
        { title: "Name a tax agent before leaving", description: "If you leave Japan and cannot pay yourself, submit a tax agent approval application to the Citizen Tax Section, at the counter or by post. The agent can pay the tax and receive documents and refunds for you." },
      ],
      sourceIds: ["matsudo-resident-tax-filing", "matsudo-resident-tax-agent"],
      sourceFormatNote: `Matsudo's tax pages are in Japanese. ${note}`,
    },
    {
      id: "matsudo-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Matsudo",
      summary: "Matsudo's flood hazard maps cover the Edo River, smaller rivers, storm surge, tsunami, and inland flooding, and in heavy rain the city opens shelters in stages, starting with 12 voluntary-evacuation sites.",
      applicability: "Check whether your building is in an expected flooding area before a storm.",
      responsibleBody: "Matsudo City",
      actions: [
        { title: "Check the flood maps", description: "Download the flood and the inland flooding, storm surge, and tsunami hazard maps, or look up your address on the Yasa-City Map online. Some designated shelters changed from April 1, 2026." },
        { title: "Know when shelters open", description: "When heavy rain or flood warnings are likely, 12 citizen centers and halls open for voluntary evacuation; more shelters are added at alert level 3 (evacuation of older people and others). Shelters may close if they are damaged or at risk of flooding." },
      ],
      sourceIds: ["matsudo-disaster-preparation-hazard-maps", "matsudo-disaster-preparation-shelter-opening"],
      sourceFormatNote: `Matsudo's disaster pages are in Japanese. ${note}`,
    },
    {
      id: "matsudo-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Matsudo",
      summary: "Matsudo City Hall's Consultation Service for Non-Japanese gives free advice in English, Chinese, and Filipino on set days, with video interpreting for other languages, and a volunteer group runs Japanese classes with the Matsudo International Exchange Association.",
      applicability: "For foreign residents and workers; Japanese classes are for people 15 or older who live, study, or work in Matsudo.",
      responsibleBody: "Matsudo City", receivingOffice: "Consultation corner, Matsudo City Hall Main Building 2nd floor",
      actions: [
        { title: "Use the consultation service", description: "English is available Monday to Wednesday 1 to 4 p.m. and Thursday and Friday 10 a.m. to 1 p.m.; Chinese Monday to Wednesday 10 a.m. to 1 p.m. and Thursday and Friday 1 to 4 p.m.; Filipino Tuesday 1 to 4 p.m. and Friday 10 a.m. to 1 p.m. Call 047-366-9151; the last consultation starts 30 minutes before closing." },
        { title: "Join a Japanese class", description: "The Association of Japanese Language Volunteers in Matsudo City runs classes five days a week, Tuesday to Friday and Sunday. MIEA's beginner classes near Matsudo Station cost 1,000 yen per term plus MIEA membership; first-time students register at the MIEA office first." },
      ],
      sourceIds: ["matsudo-language-and-consultation-consultation", "matsudo-language-and-consultation-japanese-classes"],
      sourceFormatNote: `Matsudo's consultation page is in several languages and its Japanese class page is in English and Japanese. ${note}`,
    },
    {
      id: "matsudo-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Matsudo",
      summary: "In Matsudo, if you leave a job with employee pension coverage before age 60, you switch to Category I National Pension at the National Pension unit or a branch office.",
      applicability: "For residents under 60 who leave a job and do not become a dependent spouse.",
      responsibleBody: "Matsudo City", receivingOffice: "National Pension unit, National Health Insurance and Pension Section, or a branch office",
      actions: [
        { title: "Switch after leaving a job", description: "Bring a document showing your Basic Pension Number, a document showing your leaving date (such as a separation notice or loss-of-coverage certificate), and identification such as a My Number Card. If you become a dependent spouse instead, your spouse's employer handles it." },
      ],
      sourceIds: ["matsudo-national-pension-leaving-job"],
      sourceFormatNote: `Matsudo's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "gap", records: ["matsudo-resident-tax"], gap: "Filing deadline." },
    { kind: "gap", records: ["matsudo-national-pension"], gap: "The moving-abroad (leaving or voluntary membership) step." },
    { kind: "gap", records: ["matsudo-household-waste"], gap: "Burnable waste day, time, and bags (in the guide PDF)." },
  ],
});
