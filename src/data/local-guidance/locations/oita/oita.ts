import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.oita.oita.jp";

/** Oita City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-44201", name: "Oita City", aliases: ["Oita","Oita-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "oita-address-registration-moving-in", title: "Moving-in notification", url: `${base}/o048/kurashi/jumintetsuzuki/1214286710937.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "oita-national-health-insurance-notifications", title: "Joining, leaving, and other National Health Insurance notifications", url: `${base}/o052/kurashi/kokumin/1167022646935.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "oita-national-health-insurance-joining", title: "National Health Insurance joining notification", url: `${base}/o052/kurashi/kokumin/1230447094109.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "oita-household-waste-bulky", title: "Bulky and one-time large amounts of waste (plain Japanese)", url: `${base}/o017/homepage/bulkygarbage.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "oita-resident-tax-filing", title: "Filing the fiscal 2026 inhabitant tax return", url: `${base}/o035/kurashi/zekin/20260101.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "oita-disaster-preparation-flood-map", title: "Oita flood hazard map", url: `${base}/o165/kurashi/anshinanzen/1214958872500.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "oita-disaster-preparation-tsunami-map", title: "Oita tsunami and earthquake hazard map", url: `${base}/o009/kurashi/anshinanzen/1367470455977.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "oita-language-and-consultation-consultation", title: "Consultation and help (plain Japanese living guide)", url: `${base}/livingguide/jp/soudan/consultation.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "oita-language-and-consultation-japanese-classes", title: "Learn Japanese (living guide)", url: `${base}/o017/livingguide/en/support/nihongo.html`, language: "en", lastCheckedAt: "2026-09-25" },
    { id: "oita-national-pension-joining", title: "Joining National Pension", url: `${base}/o053/kurashi/kokumin/1161305983621.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "oita-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Oita",
      summary: "Oita takes moving-in notifications only in person, within 14 days, at the Citizens Section, a branch office, or a liaison office (except Imaichi); the Citizens Section at City Hall is open until 6 p.m. on weekdays.",
      applicability: "Foreign residents staying in Japan for more than three months, other than short-term visitors, arriving from abroad or another municipality. Post is not accepted.",
      responsibleBody: "Oita City", receivingOffice: "Citizens Section (City Hall), a branch office, or a liaison office (except Imaichi)",
      actions: [
        { title: "File within 14 days", description: "File within 14 days of starting to live in Oita, weekdays 8:30 a.m. to 5:15 p.m. (6 p.m. at the Citizens Section in the main building). Filing late without good reason can lead to a non-penal fine. You or an agent with a letter of authorization can file. Check sheets list the related procedures in advance." },
        { title: "Bring your residence card", description: "Foreign residents bring their residence card or special permanent resident certificate, or a passport if the card has not been issued yet, plus identification for the person filing." },
      ],
      sourceIds: ["oita-address-registration-moving-in"],
      sourceFormatNote: `Oita's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "oita-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Oita",
      summary: "In Oita, the head of household notifies within 14 days at window 9 on the 1st floor of City Hall, a branch office, or the Honkozaki or Isshakuya liaison office; joining can also be done online with a My Number Card.",
      applicability: "For residents not covered by workplace insurance or public assistance.",
      responsibleBody: "Oita City", receivingOffice: "National Health Insurance and Late-Stage Elderly Medical Care window (City Hall 1st floor, window 9), a branch office, or the Honkozaki or Isshakuya liaison office",
      actions: [
        { title: "Join with the right documents", description: "Foreign residents joining on arrival bring their passport, residence card, and the copy of the moving-in form from the Citizens Section. After leaving workplace insurance, bring a loss-of-coverage certificate or the city's contact form filled in by your employer. Write your My Number on the form and bring identification; the window is open weekdays 8:30 a.m. to 6 p.m. (5:15 p.m. at branch offices)." },
        { title: "Leave when you depart or join other insurance", description: "When leaving Japan, bring your eligibility certificate and the copy of the moving-out form; when joining workplace insurance, bring its certificate or notice." },
      ],
      sourceIds: ["oita-national-health-insurance-notifications", "oita-national-health-insurance-joining"],
      sourceFormatNote: `Oita's National Health Insurance pages are in Japanese. ${note}`,
    },
    {
      id: "oita-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Oita",
      summary: "Oita explains waste sorting in plain Japanese, and large furniture or large amounts of waste from moving are collected for a fee by calling the Cleaning Operations Section, or taken to the Fukumune or Sano cleaning centers.",
      applicability: "Waste from business activities is excluded.",
      responsibleBody: "Oita City",
      actions: [
        { title: "Arrange bulky waste disposal", description: "For paid collection, call the Cleaning Operations Section at 097-568-5763. To take items yourself, go to the Fukumune Environment Center or Sano Cleaning Center; call the Cleaning Facilities Section at 097-537-5659 if you are not sure an item is accepted." },
      ],
      sourceIds: ["oita-household-waste-bulky"],
      sourceFormatNote: `Oita's waste page is in plain Japanese. ${note}`,
    },
    {
      id: "oita-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Oita",
      summary: "Oita's fiscal 2026 inhabitant tax return was due March 16, 2026, preferably by post or online, and is needed even for income of 200,000 yen or less that needs no income-tax return.",
      applicability: "Use Oita's route when you lived in Oita on January 1 of the tax year.",
      responsibleBody: "Oita City",
      actions: [
        { title: "Check whether you must file", description: "File if your employer did not send a salary report to the city (including if you left a job during the year), if you had other income, or if you had no income and are not anyone's dependent. You need not file if you file an income-tax return." },
        { title: "File by post or online", description: "The city asks you to file by post to the Citizen Tax Section to avoid crowded venues, or to prepare and file online." },
      ],
      sourceIds: ["oita-resident-tax-filing"],
      sourceFormatNote: `Oita's tax page is in Japanese. ${note}`,
    },
    {
      id: "oita-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Oita",
      summary: "Oita publishes a flood hazard map with expected depths and emergency evacuation places, and a tsunami and earthquake map for a Nankai Trough earthquake, both also on the Oita Map website.",
      applicability: "Check whether your home is in a flood or tsunami area and how you would evacuate.",
      responsibleBody: "Oita City",
      actions: [
        { title: "Check the flood map", description: "Check whether your home is in an expected flooding area, which direction is safe, and whether your nearest shelter could flood. The information pages use evacuation terms from before May 2021, so read them with the current alert levels." },
        { title: "Check the tsunami map", description: "The tsunami and earthquake map shows expected flooding areas and depths for a Nankai Trough earthquake; check the latest evacuation places and tsunami evacuation buildings on the linked pages." },
      ],
      sourceIds: ["oita-disaster-preparation-flood-map", "oita-disaster-preparation-tsunami-map"],
      sourceFormatNote: `Oita's hazard map pages are in Japanese. ${note}`,
    },
    {
      id: "oita-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Oita",
      summary: "Oita's International Division on the 3rd floor of City Hall has staff who speak English and Chinese, the Oita Prefecture Foreign Residents Consultation Center is at the iichiko Cultural Center, and local volunteer groups run Japanese classes.",
      applicability: "For foreign residents of Oita.",
      responsibleBody: "Oita City", receivingOffice: "International Division, Oita City Hall main building 3rd floor",
      actions: [
        { title: "Ask for help", description: "Call or visit the International Division (097-537-5719, weekdays 8:30 a.m. to 5:15 p.m.), or the Oita Prefecture Foreign Residents Consultation Center (097-533-4021) in the basement of the iichiko Cultural Center." },
        { title: "Join a Japanese class", description: "AIUEO Club classes are free, and HIMAWARI classes cost a small fee. Online learning options are also listed." },
      ],
      sourceIds: ["oita-language-and-consultation-consultation", "oita-language-and-consultation-japanese-classes"],
      sourceFormatNote: `Oita's living guide is in plain Japanese and English. ${note}`,
    },
    {
      id: "oita-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Oita",
      summary: "In Oita, residents aged 20 to 59 who leave a job or return from abroad join National Pension at window 10 on the 1st floor of City Hall, a branch office, or online through Mynaportal.",
      applicability: "For residents aged 20 to 59, including dependent spouses whose spouse leaves a job.",
      responsibleBody: "Oita City", receivingOffice: "National Pension Office (City Hall 1st floor, window 10), a branch office, or the Honkozaki or Isshakuya liaison office",
      actions: [
        { title: "Join with these documents", description: "Bring identification such as a My Number Card or driver's license, and your Basic Pension Number notice if you have it. Window 10 is open weekdays until 6 p.m.; branch offices until 5:15 p.m." },
      ],
      sourceIds: ["oita-national-pension-joining"],
      sourceFormatNote: `Oita's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "tax-year", records: ["oita-resident-tax"], statement: "Fiscal 2026 deadline \"March 16, 2026\"." },
    { kind: "gap", records: ["oita-resident-tax"], gap: "The leaving-Japan (tax agent) step." },
    { kind: "gap", records: ["oita-household-waste"], gap: "Regular sorting rules, designated bags, collection times, and foreign-language guides." },
  ],
});
