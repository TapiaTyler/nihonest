import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.yokosuka.kanagawa.jp";

/** Yokosuka City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-14201", name: "Yokosuka City", aliases: ["Yokosuka", "Yokosuka-shi"], planGroup: "major-city" },
  sources: [
    { id: "yokosuka-address-registration-from-abroad", title: "Moving-in notification from abroad", url: `${base}/2740/g_info/l100000281.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "yokosuka-national-health-insurance-joining", title: "Joining National Health Insurance", url: `${base}/3155/g_info/l100000601.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "yokosuka-household-waste-guides", title: "Sorting pamphlets and collection calendars", url: `${base}/4150/kurashi/bunbetsupanfu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "yokosuka-household-waste-bulky", title: "Bulky waste (fee-based)", url: `${base}/4150/g_info/l100000701.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "yokosuka-resident-tax-filing", title: "Who must file the inhabitant tax return and what to bring", url: `${base}/2330/g_info/01_shiminzei_shinkoku2.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "yokosuka-disaster-preparation-tsunami-map", title: "Tsunami hazard map", url: `${base}/0525/bousainavi/sonae/hazardmap/tunami-map.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "yokosuka-language-and-consultation-counseling", title: "Multilingual counseling", url: `${base}/0535/foreign_languages/counselingforforeigners.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "yokosuka-language-and-consultation-support", title: "Daily-life support for foreign residents", url: `${base}/0535/g_info/l100050904_02.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "yokosuka-national-pension-joining", title: "Joining National Pension as a Category I insured person", url: `${base}/2740/g_info/l100000351.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "yokosuka-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Yokosuka",
      summary: "Yokosuka takes moving-in notifications from abroad within 14 days at the Counter Services Section (City Hall Building 1, windows 6 to 8) or one of nine administrative centers, and asks you to file even if you are late.",
      applicability: "Residents moving into Yokosuka from abroad.",
      responsibleBody: "Yokosuka City", receivingOffice: "Counter Services Section (City Hall Building 1, 1st floor, green windows 6 to 8) or an administrative center",
      actions: [
        { title: "File within 14 days", description: "File within 14 days of starting to live in Yokosuka; if you miss it, file anyway. You, the head or a member of your household, or an agent with a letter of authorization can file. You can prepare the form in advance online." },
        { title: "Bring your passport and residence card", description: "Bring your passport (and a boarding pass stub if it has no entry stamp) and your residence card, or a passport marked that the card will be issued later. Foreign family members joining an existing household bring documents proving the relationship, with a translation naming the translator." },
      ],
      sourceIds: ["yokosuka-address-registration-from-abroad"],
      sourceFormatNote: `Yokosuka's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "yokosuka-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Yokosuka",
      summary: "In Yokosuka, join National Health Insurance within 14 days of losing other coverage at the Counter Services Section (windows 16 and 17) or an administrative center, and get the certificate the same day if you bring photo identification.",
      applicability: "For residents not covered by workplace insurance or public assistance. Yakushoya service counters cannot handle it.",
      responsibleBody: "Yokosuka City", receivingOffice: "Counter Services Section (City Hall main building 1st floor, windows 16 and 17), or an administrative center",
      actions: [
        { title: "Join with a loss-of-coverage certificate", description: "After leaving a job, bring a certificate from your employer or health insurance society that your coverage ended; a separation certificate or notice is also accepted. You or a member of your household can file, weekdays 8:30 a.m. to 5 p.m." },
        { title: "Get the certificate", description: "With photo ID such as a driver's license, passport, or My Number Card, the certificate is issued at the counter the same day; otherwise it is posted to the head of household." },
      ],
      sourceIds: ["yokosuka-national-health-insurance-joining"],
      sourceFormatNote: `Yokosuka's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "yokosuka-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Yokosuka",
      summary: "Yokosuka's sorting pamphlet is available in seven other languages with district collection tables, waste goes out from about 6 to 8 a.m. on collection day, and bulky waste (about 50 cm to 2 m on a side) is collected by application through LINE, online, or by phone.",
      applicability: "Collection days differ by district.",
      responsibleBody: "Yokosuka City",
      actions: [
        { title: "Get the pamphlet and collection table", description: "The pamphlet is in English, Chinese, Korean, Spanish, Portuguese, Vietnamese, and Tagalog, with summary leaflets in Indonesian, Nepali, Thai, and Myanmar, and is free at the Environmental Policy Section, administrative centers, and Yakushoya. Put waste out at your district's collection point from about 6 to 8 a.m." },
        { title: "Apply for bulky waste collection", description: "Apply through the city's LINE account or online, paying by credit card, au PAY, or PayPay. Put items out by 8 a.m. at the place agreed, on the road side of your property. Fees rise from October 1: most items go from 520 to 800 yen." },
      ],
      sourceIds: ["yokosuka-household-waste-guides", "yokosuka-household-waste-bulky"],
      sourceFormatNote: `Yokosuka's waste pages are in Japanese; the pamphlet has versions in seven other languages. ${note}`,
    },
    {
      id: "yokosuka-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Yokosuka",
      summary: "Yokosuka asks everyone living in the city on January 1 to file an inhabitant tax return, even without income, unless an exemption applies; returns can be submitted by post.",
      applicability: "Use Yokosuka's route when you lived in Yokosuka on January 1 of the tax year.",
      responsibleBody: "Yokosuka City",
      actions: [
        { title: "Check whether you are exempt", description: "You need not file if you file an income-tax return, if you have only salary your employer reported to the city with no extra deductions, or if you have no income and are a relative's tax dependent in the city. People receiving a public pension from another country must file." },
        { title: "File in person or by post", description: "Forms are handed out at the Citizen Tax Section (City Hall 2nd floor), administrative centers, and Yakushoya. Bring your My Number and identification, income and deduction records, and, to claim relatives living abroad, relationship and remittance documents." },
      ],
      sourceIds: ["yokosuka-resident-tax-filing"],
      sourceFormatNote: `Yokosuka's tax page is in Japanese. ${note}`,
    },
    {
      id: "yokosuka-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Yokosuka",
      summary: "Yokosuka revised its tsunami hazard map in fiscal 2022 based on Kanagawa Prefecture's inundation estimates, with eight district maps and a shared learning page.",
      applicability: "Anyone living or working near the coast should check the map for their district.",
      responsibleBody: "Yokosuka City",
      actions: [
        { title: "Check the tsunami map for your district", description: "Download your district's map, or get a printed copy at City Hall (all eight districts) or at your administrative center or Yakushoya. The map shows expected conditions, not exactly what will happen; check the correction page for changes made during the year." },
      ],
      sourceIds: ["yokosuka-disaster-preparation-tsunami-map"],
      sourceFormatNote: `Yokosuka's hazard map page is in Japanese. ${note}`,
    },
    {
      id: "yokosuka-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Yokosuka",
      summary: "The Yokosuka International Association, working for the city, offers free daily-life counseling in several languages at Werk Yokosuka and a Japanese conversation salon for everyday Japanese.",
      applicability: "For foreign residents of Yokosuka. Counseling can also be in plain Japanese.",
      responsibleBody: "Yokosuka City", receivingOffice: "Yokosuka International Association, Werk Yokosuka, 1-5 Hinode-cho",
      actions: [
        { title: "Use multilingual counseling", description: "Counseling covers health, interpretation, education, visas, and residence status. It is in English on Mondays and Thursdays, Tagalog on Mondays, Chinese on Wednesdays, and Korean on Thursdays, 9 a.m. to noon; Nepali on Thursdays 10 a.m. to noon; Portuguese on the second Friday 2 to 5 p.m.; and Vietnamese on Mondays by reservation. Call 046-827-2166." },
        { title: "Join the Japanese conversation salon", description: "Volunteers teach basic everyday Japanese at the association's Japanese conversation salon; contact the association for details." },
      ],
      sourceIds: ["yokosuka-language-and-consultation-counseling", "yokosuka-language-and-consultation-support"],
      sourceFormatNote: `Yokosuka's counseling page is in Japanese and English. ${note}`,
    },
    {
      id: "yokosuka-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Yokosuka",
      summary: "In Yokosuka, residents aged 20 to 59 who leave employee pension coverage or stop being a dependent spouse join National Pension as Category I insured persons at the Counter Services Section, an administrative center, or the Yokosuka Pension Office.",
      applicability: "Not needed if you leave a job and become a dependent spouse.",
      responsibleBody: "Yokosuka City", receivingOffice: "Counter Services Section (City Hall Building 1, windows 16 and 17), an administrative center, or the Yokosuka Pension Office",
      actions: [
        { title: "Join with these documents", description: "Bring your pension book or Basic Pension Number notice and a certificate showing the date your employee pension or health insurance coverage ended." },
      ],
      sourceIds: ["yokosuka-national-pension-joining"],
      sourceFormatNote: `Yokosuka's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "dated", from: "2026-10-01", records: ["yokosuka-household-waste"], change: "Bulky waste fees rise from October 1.", action: "Replace the old and new fees with the current fee." },
    { kind: "gap", records: ["yokosuka-resident-tax"], gap: "Filing deadline and the leaving-Japan (tax agent) step." },
    { kind: "gap", records: ["yokosuka-national-pension"], gap: "The moving-abroad step." },
  ],
});
