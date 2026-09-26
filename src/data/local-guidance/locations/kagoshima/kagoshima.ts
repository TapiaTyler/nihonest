import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.kagoshima.lg.jp";

/** Kagoshima City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-46201", name: "Kagoshima City", aliases: ["Kagoshima","Kagoshima-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "kagoshima-address-registration-from-abroad", title: "Moving to Kagoshima from abroad", url: `${base}/shimin/shiminbunka/shimin/kurashi/koseki/hikkoshi/tetsuzuki/kaigaitennyu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kagoshima-national-health-insurance-foreign-residents", title: "How foreign residents join National Health Insurance (FAQ)", url: `${base}/faq-kurashi/kokuho/q10.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kagoshima-household-waste-rules", title: "Sorting and putting out waste (plain Japanese)", url: `${base}/soumu/shichoshitu/kokusai/ja/garbage/trash.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kagoshima-household-waste-bulky", title: "Bulky waste", url: `${base}/shigenseisaku/gomi/kate/dashikata/wakekata/sodaigomi.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kagoshima-resident-tax-filing", title: "Filing the fiscal 2026 inhabitant tax return", url: `${base}/soumu/zeimu/shiminzei/4_shiminzeikenminzeishinkoku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kagoshima-resident-tax-forms", title: "Inhabitant tax forms, including tax agent forms", url: `${base}/soumu/zeimu/shiminzei/shiminzeikenminzeikankeiyoushiki.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kagoshima-disaster-preparation-sakurajima", title: "Sakurajima volcano hazard map", url: `${base}/kikikanri/kurashi/bosai/bosai/map/sakurajima.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kagoshima-language-and-consultation-desk", title: "Foreign Residents Consultation Desk", url: `${base}/soumu/shichoshitu/kokusai/tabunkakyousei.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kagoshima-language-and-consultation-japanese-classes", title: "Where adults can learn Japanese (KagoTips)", url: `${base}/kikakuzaisei/kikaku/seisaku-k/kagotips/standard/kosodate/nihongogakushu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kagoshima-national-pension-leaving-job", title: "National Pension after leaving a job (FAQ)", url: `${base}/faq-kurashi/nenkin/q4.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "kagoshima-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Kagoshima",
      summary: "Kagoshima takes moving-in notifications from abroad within 14 days at the Citizens Section of City Hall or a branch office, weekdays 8:45 a.m. to 4:30 p.m.; the Kagoshima-Chuo Station service station cannot handle them.",
      applicability: "Residents moving into Kagoshima from abroad. You cannot file before you start living at the address.",
      responsibleBody: "Kagoshima City", receivingOffice: "Citizens Section of City Hall, or the Citizens Section of a branch office",
      actions: [
        { title: "File within 14 days", description: "File within 14 days of starting to live in Kagoshima, weekdays 8:45 a.m. to 4:30 p.m. The Kurashi no Tetsuzuki Navi online tool lists related procedures, such as child allowance or school transfers, before you visit." },
        { title: "Bring your residence card", description: "Foreign residents bring their residence card or special permanent resident certificate (or passport if the card will be issued later) and identification for the person filing. Families bring a translated document proving the relationship." },
      ],
      sourceIds: ["kagoshima-address-registration-from-abroad"],
      sourceFormatNote: `Kagoshima's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "kagoshima-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Kagoshima",
      summary: "In Kagoshima, foreign residents staying more than three months join National Health Insurance within 14 days of arriving or losing other coverage, with the head of household bringing identification and My Number documents.",
      applicability: "For residents not covered by workplace insurance or public assistance. People staying for medical treatment or tourism may not be able to join.",
      responsibleBody: "Kagoshima City",
      actions: [
        { title: "Join within 14 days", description: "Bring photo identification such as a passport or residence card for the person at the counter, the My Number of the head of household and each person joining, and, for Designated Activities status, the designation document. After leaving a job, also bring the loss-of-coverage certificate; you can file only from the date coverage ended." },
        { title: "Receive the certificate by post", description: "The eligibility certificate or notice is posted to the head of household. An agent from outside the household needs a letter of authorization." },
      ],
      sourceIds: ["kagoshima-national-health-insurance-foreign-residents"],
      sourceFormatNote: `Kagoshima's National Health Insurance FAQ is in Japanese. ${note}`,
    },
    {
      id: "kagoshima-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Kagoshima",
      summary: "In Kagoshima, sort waste and put it out by 8 a.m. on the set day at your designated place in clear bags of up to 45 liters, and apply for bulky waste collection online or by phone, up to five items per application.",
      applicability: "Burnable waste days depend on your area (Monday and Thursday, or Tuesday and Friday).",
      responsibleBody: "Kagoshima City",
      actions: [
        { title: "Follow the three rules", description: "Put waste out on the set day by 8 a.m., at the designated place near your home, sorted and in clear bags of up to 45 liters; tie old paper with string or put it in a paper bag. The San-a-ru sorting app also shows how to sort items." },
        { title: "Apply for bulky waste", description: "Apply online at any time (with credit card or PayPay) or by phone at 099-806-8141, weekdays 8:30 a.m. to 5:15 p.m. Collection takes about two weeks; each household can apply for up to five items at a time. Items over 2 m or 60 kg are not collected." },
      ],
      sourceIds: ["kagoshima-household-waste-rules", "kagoshima-household-waste-bulky"],
      sourceFormatNote: `Kagoshima's waste pages are in Japanese and plain Japanese. ${note}`,
    },
    {
      id: "kagoshima-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Kagoshima",
      summary: "Kagoshima's fiscal 2026 inhabitant tax return was due March 16, 2026, by post, online, or at a filing venue, and people leaving Japan name a tax agent with a declaration or approval application depending on where the agent lives.",
      applicability: "Use Kagoshima's route when you lived in Kagoshima on January 1 of the tax year.",
      responsibleBody: "Kagoshima City",
      actions: [
        { title: "Check whether you must file", description: "File if you left a job during the year, if your employer did not send a salary report to the city, if you had other income, or if you lived on savings or unemployment benefits and were not a relative's tax dependent. You need not file if you file an income-tax return. Late returns are accepted." },
        { title: "Name a tax agent before leaving", description: "Submit a tax agent declaration if the agent lives in Kagoshima, or a tax agent approval application if the agent lives elsewhere." },
      ],
      sourceIds: ["kagoshima-resident-tax-filing", "kagoshima-resident-tax-forms"],
      sourceFormatNote: `Kagoshima's tax pages are in Japanese. ${note}`,
    },
    {
      id: "kagoshima-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Kagoshima",
      summary: "Kagoshima publishes a Sakurajima volcano hazard map, updated in April 2026, showing past large eruptions and future volcanic risks, with versions in English, Korean, and Chinese.",
      applicability: "For residents and visitors to Sakurajima, and anyone living near the volcano.",
      responsibleBody: "Kagoshima City",
      actions: [
        { title: "Check the Sakurajima map", description: "Use the map to understand past eruptions and volcanic dangers, prepare in advance, and evacuate quickly in an emergency. The English, Korean, and Chinese versions were last updated in June 2023." },
      ],
      sourceIds: ["kagoshima-disaster-preparation-sakurajima"],
      sourceFormatNote: `Kagoshima's hazard map page is in Japanese; the map has English, Korean, and Chinese versions. ${note}`,
    },
    {
      id: "kagoshima-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Kagoshima",
      summary: "Kagoshima's Foreign Residents Consultation Desk at the Kagoshima International Exchange Center answers questions about work, childcare, residence procedures, and daily life in many languages, and the center also supports Japanese learning.",
      applicability: "For foreign residents of Kagoshima.",
      responsibleBody: "Kagoshima City", receivingOffice: "Foreign Residents Consultation Desk, Kagoshima International Exchange Center 1st floor, 19-18 Kajiya-cho",
      actions: [
        { title: "Use the consultation desk", description: "Visit or call 090-9407-2266, 9 a.m. to noon and 1 to 4 p.m., closed Sundays, Mondays, and at New Year. Languages include plain Japanese, English, Korean, Chinese, Spanish, Portuguese, Tagalog, Vietnamese, Nepali, Indonesian, Thai, Khmer, and Myanmar." },
        { title: "Learn Japanese", description: "Ask the Kagoshima International Exchange Center (099-226-5931) when its Japanese support runs, or join the Kagoshima Prefectural International Exchange Association's Japanese and Japan Understanding course." },
      ],
      sourceIds: ["kagoshima-language-and-consultation-desk", "kagoshima-language-and-consultation-japanese-classes"],
      sourceFormatNote: `Kagoshima's pages are in Japanese. ${note}`,
    },
    {
      id: "kagoshima-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Kagoshima",
      summary: "In Kagoshima, residents aged 20 to 59 who leave employee pension coverage join National Pension as Category I insured persons within 14 days at the National Pension Section, a branch office, or online.",
      applicability: "For residents aged 20 to 59 who leave a job, and dependent spouses of people who leave a job.",
      responsibleBody: "Kagoshima City", receivingOffice: "National Pension Section or the responsible counter at a branch office",
      actions: [
        { title: "Join after leaving a job", description: "Bring identification, your My Number or Basic Pension Number document, and a document showing your leaving date, such as a separation notice. File within 14 days; later filing is still accepted. You can also apply through Mynaportal." },
      ],
      sourceIds: ["kagoshima-national-pension-leaving-job"],
      sourceFormatNote: `Kagoshima's National Pension FAQ is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "tax-year", records: ["kagoshima-resident-tax"], statement: "Fiscal 2026 deadline \"March 16, 2026\"." },
    { kind: "gap", records: ["kagoshima-disaster-preparation"], gap: "Flood, tsunami, and landslide maps and shelters; volcanic ash (kokaibukuro) bags." },
  ],
});
