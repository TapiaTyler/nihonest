import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.fujisawa.kanagawa.jp";

/** Fujisawa City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-14205", name: "Fujisawa City", aliases: ["Fujisawa", "Fujisawa-shi"], planGroup: "major-city" },
  sources: [
    { id: "fujisawa-address-registration-from-abroad", title: "Foreign residents moving to Fujisawa from abroad", url: `${base}/mado-c/gai-kaigaitennyu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fujisawa-national-health-insurance-joining", title: "Joining National Health Insurance", url: `${base}/honen/kurashi/hoken/kokuho/todokede/kanyu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fujisawa-national-health-insurance-foreign-residents", title: "National Health Insurance for foreign residents", url: `${base}/honen/kurashi/hoken/kokuho/todokede/gaikokujin.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fujisawa-household-waste-rules", title: "Sorting and putting out resources and waste", url: `${base}/kankyo-j/kurashi/gomi/wakekata/wakekata.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fujisawa-household-waste-bulky", title: "Large and extra-large waste", url: `${base}/kankyo-j/kurashi/gomi/wakekata/h30bunrui.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fujisawa-resident-tax-filing", title: "Filing the municipal and prefectural inhabitant tax return", url: `${base}/siminzei1/kurashi/zekin/shimin/setsume/shinkoku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fujisawa-resident-tax-forms", title: "Inhabitant tax forms, including the tax agent declaration", url: `${base}/siminzei1/kurashi/zekin/shimin/syorui.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fujisawa-disaster-preparation-tsunami-map", title: "Tsunami hazard map", url: `${base}/bousai/bosai/bosai/hazardmap/tsunami/h25hazardmap.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fujisawa-language-and-consultation-consultation", title: "Consultation for foreign residents (Spanish and Portuguese)", url: `${base}/soudanc2-1/shise/kocho/shiminsodan/gaikokujin.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fujisawa-language-and-consultation-japanese-classes", title: "Japanese classes in Fujisawa", url: `${base}/jinkendanjyo/kurashi/tabunka/nihongokyoushitsumap2014.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fujisawa-national-pension-notifications", title: "National Pension notifications", url: `${base}/honen/kurashi/hoken/nenkin/todokede/todokede.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "fujisawa-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Fujisawa",
      summary: "Fujisawa asks foreign residents arriving from abroad to file within 14 days at the Citizens' Service Center at City Hall, a citizen center, or the Ishikawa annex; the Fujisawa and Muraoka citizen centers do not handle it.",
      applicability: "Foreign residents legally staying over three months who will live in Japan for a year or more; short-term visitors cannot register.",
      responsibleBody: "Fujisawa City", receivingOffice: "Citizens' Service Center (City Hall), a citizen center, or the Ishikawa annex (except Fujisawa and Muraoka citizen centers)",
      actions: [
        { title: "File within 14 days", description: "You or the head of household files within 14 days of starting to live in Fujisawa. Mondays and days after holidays are especially busy, and late filings may not get certificates the same day." },
        { title: "Bring residence cards, passports, and relationship documents", description: "Bring the residence cards (or passports marked that the card will be issued later) and passports of everyone moving in, and identification for the person filing. A household with a foreign head and members needs original documents proving the relationship, such as marriage or birth certificates, with a Japanese translation naming the translator." },
      ],
      sourceIds: ["fujisawa-address-registration-from-abroad"],
      sourceFormatNote: `Fujisawa's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "fujisawa-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Fujisawa",
      summary: "In Fujisawa, join National Health Insurance within 14 days of moving in or leaving workplace insurance, or you will have to pay premiums back to the date you became eligible; foreign residents with a stay of three months or less cannot join.",
      applicability: "For residents not covered by workplace insurance or public assistance. Some statuses, such as short-term stay, are excluded.",
      responsibleBody: "Fujisawa City", receivingOffice: "Insurance and Pension Section at City Hall, or a citizen center or the Ishikawa annex (except Fujisawa and Muraoka)",
      actions: [
        { title: "Join with the right documents", description: "Bring your residence card and, after leaving a job, a loss-of-coverage certificate, separation certificate, or similar. If your identity is confirmed, the certificate or notice can be issued at the counter, but after moving in it is posted later. Counters are open 8:30 a.m. to 5 p.m. on weekdays; citizen centers close from noon to 1 p.m." },
        { title: "Leave when you join other insurance or leave Japan", description: "Notify within 14 days when you join workplace insurance or leave Japan; Fujisawa's coverage cannot be used once you have other insurance or no longer live in the city." },
      ],
      sourceIds: ["fujisawa-national-health-insurance-joining", "fujisawa-national-health-insurance-foreign-residents"],
      sourceFormatNote: `Fujisawa's National Health Insurance pages are in Japanese. ${note}`,
    },
    {
      id: "fujisawa-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Fujisawa",
      summary: "Fujisawa publishes separate rules for each waste type and a search system for items and collection days, and large waste (50 cm to under 2 m) is collected by reservation with a 500-yen ticket per item.",
      applicability: "Collection days depend on your address; some rules differ for residents of Block 1.",
      responsibleBody: "Fujisawa City",
      actions: [
        { title: "Check how to sort", description: "Use the waste search system to look up an item or check your area's collection schedule, and follow the rules for each type, such as burnable waste, plastics, and bottles." },
        { title: "Reserve large waste collection", description: "Reserve by phone at 0466-23-5301 (weekdays 8:30 a.m. to noon and 1 to 5 p.m.) or online. Buy a 500-yen ticket per item (two for extra-large items), write your name or reception number on it, and put the item out at the date and place you were given, even if it rains." },
      ],
      sourceIds: ["fujisawa-household-waste-rules", "fujisawa-household-waste-bulky"],
      sourceFormatNote: `Fujisawa's waste pages are in Japanese. ${note}`,
    },
    {
      id: "fujisawa-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Fujisawa",
      summary: "Fujisawa's inhabitant tax return is due every year by March 15 at the Citizen Tax Section of the city where you lived on January 1, and people moving abroad who may have trouble paying must name a tax agent.",
      applicability: "Use Fujisawa's route when you lived in Fujisawa on January 1 of the tax year.",
      responsibleBody: "Fujisawa City",
      actions: [
        { title: "Check whether you must file", description: "You do not need to file if you filed an income-tax return, or if you had only salary and your employer sent a salary report to the city, unless you want deductions not on your withholding slip. People with no income may still need to file, for example if they are in National Health Insurance or need an income certificate." },
        { title: "Name a tax agent before leaving", description: "If you move abroad and may have trouble paying, submit a tax agent declaration to the Citizen Tax Section. The agent pays tax and receives notices for you; both of you sign the form." },
      ],
      sourceIds: ["fujisawa-resident-tax-filing", "fujisawa-resident-tax-forms"],
      sourceFormatNote: `Fujisawa's tax pages are in Japanese. ${note}`,
    },
    {
      id: "fujisawa-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Fujisawa",
      summary: "Fujisawa's tsunami hazard map is based on Kanagawa Prefecture's worst-case assumptions, where the first tsunami could arrive in as little as 6 minutes, and shows ground height and tsunami evacuation buildings.",
      applicability: "Anyone living or working near the coast should know the nearest high ground or tsunami evacuation building.",
      responsibleBody: "Fujisawa City",
      actions: [
        { title: "Check the tsunami map", description: "The map shows land elevation as a guide for moving to higher ground and tsunami evacuation buildings for when a tsunami arrives quickly. Areas outside the mapped zone can also flood. Check the latest list of tsunami evacuation buildings, and use the Fujisawa Kyun Map to see the expected depth at a specific spot." },
      ],
      sourceIds: ["fujisawa-disaster-preparation-tsunami-map"],
      sourceFormatNote: `Fujisawa's hazard map page is in Japanese. ${note}`,
    },
    {
      id: "fujisawa-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Fujisawa",
      summary: "Fujisawa has a free consultation service in Spanish and Portuguese for city procedures and daily life at City Hall and Shonandai Cultural Center, and a map of local Japanese classes in seven versions.",
      applicability: "For foreign residents of Fujisawa. No reservation is needed.",
      responsibleBody: "Fujisawa City", receivingOffice: "Foreign Residents' Consultation Room, City Hall main building 4th floor, or Shonandai Cultural Center 2nd floor",
      actions: [
        { title: "Use the consultation service", description: "At City Hall, consultation runs weekdays 8:30 a.m. to noon and 1 to 5 p.m., in person or by phone at 0466-50-3568; in-person reception ends at 11:30 a.m. and 4 p.m. Shonandai Cultural Center has in-person consultation on Mondays, Tuesdays, and Fridays." },
        { title: "Find a Japanese class", description: "The Fujisawa Japanese class map is in Spanish, Portuguese, English, Chinese, Korean, Vietnamese, and plain Japanese, and is also handed out at City Hall and citizen centers. Call the class listed on the map to ask whether you can join." },
      ],
      sourceIds: ["fujisawa-language-and-consultation-consultation", "fujisawa-language-and-consultation-japanese-classes"],
      sourceFormatNote: `Fujisawa's consultation page is in Japanese and Spanish, and the class page is in plain Japanese. ${note}`,
    },
    {
      id: "fujisawa-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Fujisawa",
      summary: "In Fujisawa, notify the Insurance and Pension Section or a citizen center when you leave a job, move abroad as a Category I or voluntary member, or return from abroad.",
      applicability: "For residents aged 20 to 59. Address changes and joining employee pension usually need no notification.",
      responsibleBody: "Fujisawa City", receivingOffice: "National Pension unit, Insurance and Pension Section, or a citizen center (except Fujisawa and Muraoka)",
      actions: [
        { title: "Notify when your situation changes", description: "After leaving a job, bring identification and a loss-of-coverage or separation certificate. When moving abroad or returning, bring identification. For all procedures, bring your My Number Card or Basic Pension Number notice." },
      ],
      sourceIds: ["fujisawa-national-pension-notifications"],
      sourceFormatNote: `Fujisawa's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "gap", records: ["fujisawa-household-waste"], gap: "Burnable waste day, time, and bags; foreign-language collection calendars." },
    { kind: "gap", records: ["fujisawa-disaster-preparation"], gap: "Flood and landslide hazard map and evacuation shelters." },
  ],
});
