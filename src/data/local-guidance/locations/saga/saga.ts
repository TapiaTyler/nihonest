import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.saga.lg.jp";

/** Saga City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-41201", name: "Saga City", aliases: ["Saga","Saga-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "saga-address-registration-foreign-residents", title: "Moving-in notification for foreign residents", url: `${base}/kurashi/jyuminhyo-koseki-shomei/8/316.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saga-national-health-insurance-jobs", title: "Joining and leaving National Health Insurance when you leave or start a job", url: `${base}/kenko-fukushi/hoken-nenkin/1/2/2776.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saga-household-waste-rules", title: "Separate collection and how to put out waste", url: `${base}/kurashi/seikatsukankyo/1/1/3/106.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saga-household-waste-foreign-languages", title: "Waste guide for foreign residents", url: `${base}/kurashi/seikatsukankyo/1/1/6/359.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saga-household-waste-bulky", title: "Regular bulky waste collection (sticker system)", url: `${base}/kurashi/seikatsukankyo/1/1/5/3840.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saga-resident-tax-who-files", title: "Who must file an inhabitant tax return", url: `${base}/kurashi/zeikin/4/2/2881.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saga-resident-tax-how-to-file", title: "How to file and the filing period", url: `${base}/kurashi/zeikin/4/2/2884.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saga-resident-tax-agent", title: "Tax agents", url: `${base}/kurashi/zeikin/4/3/2663.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saga-disaster-preparation-flood-map", title: "Saga flood hazard map", url: `${base}/bosai-anzen/bosai/3/1133.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saga-language-and-consultation-welcome", title: "Welcome to Saga City (plain Japanese)", url: `${base}/kurashi/community/7/1/3643.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saga-national-pension-joining", title: "Joining National Pension", url: `${base}/kenko-fukushi/hoken-nenkin/4/1428.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saga-national-pension-online", title: "Applying for National Pension procedures through Mynaportal", url: `${base}/kenko-fukushi/hoken-nenkin/4/2736.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "saga-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Saga",
      summary: "Saga asks foreign residents arriving from abroad to file a moving-in notification within 14 days at City Hall or a branch office, with the residence cards of everyone moving.",
      applicability: "Foreign residents arriving from abroad or from another municipality.",
      responsibleBody: "Saga City", receivingOffice: "Saga City Hall (main building) or a branch office",
      actions: [
        { title: "File within 14 days", description: "File within 14 days of starting to live in Saga. An agent needs a letter of authorization and their own identification, such as a My Number Card or driver's license." },
        { title: "Bring residence cards and relationship documents", description: "Bring the residence card or special permanent resident certificate of everyone moving, or passports if cards will be issued later. Unless you arrive alone, bring a certificate showing your family relationship to the head of household, with a Japanese translation that names the translator." },
      ],
      sourceIds: ["saga-address-registration-foreign-residents"],
      sourceFormatNote: `Saga's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "saga-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Saga",
      summary: "In Saga, join National Health Insurance within 14 days of losing other coverage at the Insurance and Pension Section on the 1st floor of City Hall (windows 26 to 28), with a certificate that your previous insurance ended.",
      applicability: "For residents not covered by workplace insurance or public assistance.",
      responsibleBody: "Saga City", receivingOffice: "Insurance and Pension Section, Saga City Hall main building 1st floor (windows 26 to 28)",
      actions: [
        { title: "Join after leaving a job", description: "Bring a certificate that your previous health insurance ended (the employer or insurer fills it in), photo identification for the person at the counter, and the My Number of the head of household and each person joining. Take a number from the machine next to window 21." },
        { title: "Leave when you join workplace insurance", description: "Bring the workplace insurance certificate or notice for everyone who joined, your National Health Insurance certificate or notice, and the same identification; you can also leave by post. Until you notify, National Health Insurance tax keeps being charged." },
      ],
      sourceIds: ["saga-national-health-insurance-jobs"],
      sourceFormatNote: `Saga's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "saga-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Saga",
      summary: "In Saga, burnable waste goes out twice a week in pink designated bags by 8:30 a.m. at your neighborhood station, the waste guide is available in ten other languages and plain Japanese, and bulky waste is collected once a month by reservation.",
      applicability: "Items that do not fit in a designated bag are bulky waste and cannot go to the station. Morodomi and Mitsuse have their own rules.",
      responsibleBody: "Saga City",
      actions: [
        { title: "Use the designated bags", description: "Burnable waste goes in pink bags and non-burnable waste in green bags; bottles, cans, and PET bottles have their own bags. Put waste out at the station set by your neighborhood association by 8:30 a.m. on collection day. The guide is in plain Japanese, English, Chinese, Korean, Vietnamese, Tagalog, Nepali, Indonesian, Myanmar, Sinhala, and Bengali." },
        { title: "Book bulky waste collection", description: "Apply to the Saga City Waste Reservation Center online or by phone at 0952-20-0609 (weekdays 9 a.m. to 4 p.m.), pay the fee online or at a bank, and put the item out with its sticker by 8:30 a.m. on the collection day." },
      ],
      sourceIds: ["saga-household-waste-rules", "saga-household-waste-foreign-languages", "saga-household-waste-bulky"],
      sourceFormatNote: `Saga's waste pages are in Japanese; the guide has versions in ten other languages and plain Japanese. ${note}`,
    },
    {
      id: "saga-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Saga",
      summary: "Saga asks everyone living in the city on January 1 to file an inhabitant tax return by March 15, even without income, unless an exemption applies, and people moving abroad who cannot handle tax there must name a tax agent.",
      applicability: "Use Saga's route when you lived in Saga on January 1 of the tax year.",
      responsibleBody: "Saga City",
      actions: [
        { title: "File by March 15", description: "You need not file if you file an income-tax return, if your employer sent a salary report and you had no other income, or if your only income is a taxable public pension. Otherwise file by post to the Citizen Tax Section or at a filing venue by March 15 (the next day if it falls on a weekend)." },
        { title: "Name a tax agent before leaving", description: "If you move abroad and cannot receive notices or pay there, submit a tax agent form. You may still be taxed for the next year if you leave after January 1. Without an agent, the city may serve the notice by public posting and send a demand if you do not pay." },
      ],
      sourceIds: ["saga-resident-tax-who-files", "saga-resident-tax-how-to-file", "saga-resident-tax-agent"],
      sourceFormatNote: `Saga's tax pages are in Japanese. ${note}`,
    },
    {
      id: "saga-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Saga",
      summary: "Saga's flood hazard map, in northern, central, and southern sections, shows expected flooding if the Chikugo, Kase, and other rivers breach their banks, and some designated shelters are inside flood areas.",
      applicability: "Check your area's map and a safe route to a shelter before heavy rain.",
      responsibleBody: "Saga City",
      actions: [
        { title: "Check the flood map", description: "Download the map for your area, or get a printed copy from the Crisis Management and Disaster Prevention Section (City Hall 2nd floor) or a branch office. Some shelters are inside flood areas and may not be usable, so check the route and alternatives." },
      ],
      sourceIds: ["saga-disaster-preparation-flood-map"],
      sourceFormatNote: `Saga's hazard map page is in Japanese. ${note}`,
    },
    {
      id: "saga-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Saga",
      summary: "Saga gives new foreign residents a plain-Japanese Welcome to Saga City sheet with links on registration, insurance, pension, tax, waste, and disasters, and points them to the Saga City International Association, Saga Multicultural Center, and Japanese classes run by the Saga Prefectural International Association.",
      applicability: "For foreign residents starting life in Saga.",
      responsibleBody: "Saga City",
      actions: [
        { title: "Get the welcome sheet", description: "The sheet is handed out at City Hall and branch offices and is online in plain Japanese and other languages. For questions, contact the International Division's Multicultural Coexistence Unit at 0952-40-7406." },
        { title: "Find support and classes", description: "Follow the links on the welcome page to the Saga Multicultural Center for consultation and to the Saga Prefectural International Association's list of Japanese classes in Saga City." },
      ],
      sourceIds: ["saga-language-and-consultation-welcome"],
      sourceFormatNote: `Saga's welcome page is in plain Japanese, with versions in other languages. ${note}`,
    },
    {
      id: "saga-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Saga",
      summary: "Saga reminds residents aged 20 to 59 that National Pension is mandatory, and lets you apply to join or switch categories online through Mynaportal with a My Number Card.",
      applicability: "For residents aged 20 to 59 not covered by employee pension or as a dependent spouse.",
      responsibleBody: "Saga City", receivingOffice: "National Pension unit, Insurance and Pension Section, Saga City Hall main building 1st floor",
      actions: [
        { title: "Join or switch categories", description: "Apply online through Mynaportal with your My Number Card and its password, or contact the National Pension unit at 0952-40-7275. Japanese nationals living abroad can join voluntarily from 20 to 64." },
      ],
      sourceIds: ["saga-national-pension-joining", "saga-national-pension-online"],
      sourceFormatNote: `Saga's National Pension pages are in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "gap", records: ["saga-national-pension"], gap: "Documents for joining after leaving a job, and the moving-abroad step." },
    { kind: "gap", records: ["saga-language-and-consultation"], gap: "A city page with consultation days and languages." },
    { kind: "gap", records: ["saga-disaster-preparation"], gap: "Evacuation shelter list." },
  ],
});
