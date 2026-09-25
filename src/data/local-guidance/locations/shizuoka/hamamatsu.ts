import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.hamamatsu.shizuoka.jp";

/** Hamamatsu City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-22130", name: "Hamamatsu City", aliases: ["Hamamatsu", "Hamamatsu-shi"] },
  sources: [
    { id: "hamamatsu-address-registration-moving-in", title: "Moving-in notification", url: `${base}/siminkj/sinsei/jyumin/tennyu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "hamamatsu-national-health-insurance-moving-in", title: "National Health Insurance when moving into Hamamatsu", url: `${base}/kokuho/kokuho_nenkin/kokuho/kokuho_tetuduki/kanyuu1.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "hamamatsu-national-health-insurance-counters", title: "National Health Insurance counters", url: `${base}/kokuho/kokuho_nenkin/kokuho/kokuho_tetuduki/madoguti.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "hamamatsu-household-waste-rules", title: "Putting out household waste", url: `${base}/ippai/gomi/dashikata/index.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "hamamatsu-household-waste-bulky-line", title: "Waste sorting help and bulky waste booking through LINE", url: `${base}/ippai/gomi/dashikata/dashikata/renrakugomi_line.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "hamamatsu-resident-tax-who-files", title: "Who must file the 2026 municipal and prefectural inhabitant tax return", url: `${base}/shiminze/zei/siminze/siminze_sinkoku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "hamamatsu-disaster-preparation-evacuation-places", title: "Emergency evacuation places and shelters", url: `${base}/kiki/disaster/bousai/hinannjo.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "hamamatsu-disaster-preparation-earthquake-maps", title: "Earthquake disaster prevention maps", url: `${base}/kiki/hazard_map/bousaimap.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "hamamatsu-language-and-consultation-multicultural-center", title: "Hamamatsu Multicultural Center (Canal Hamamatsu)", url: `${base}/hamaj/02life/02_7.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "hamamatsu-language-and-consultation-learning-center", title: "Hamamatsu Foreign Learner Support Center (Canal Hamamatsu)", url: `${base}/hamaj/11japanese/11_1.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "hamamatsu-national-pension-leaving-japan", title: "Pension when foreign residents leave Japan", url: `${base}/kokuho/kokuho_nenkin/nenkin/dattai.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "hamamatsu-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Hamamatsu",
      summary: "Hamamatsu takes moving-in notifications, including on arrival from abroad, within 14 days on weekdays from 8:30 a.m. to 5:15 p.m.; households that include foreign nationals must go to a ward office or administrative center, not a branch or service center.",
      applicability: "Residents moving into Hamamatsu from abroad or from another municipality. Ward offices are very busy in March and April.",
      responsibleBody: "Hamamatsu City", receivingOffice: "Resident Life Section of a ward office, or an administrative center",
      actions: [
        { title: "Notify within 14 days at a ward office or administrative center", description: "File within 14 days of moving, weekdays 8:30 a.m. to 5:15 p.m. (except holidays and December 29 to January 3); you can use the counter in any ward. Notifications for households that include a foreign national must be made at a ward office or administrative center, not at a branch office or citizen service center. Ward offices are very busy around March and April." },
        { title: "Who can file", description: "The person moving or the household head (not under 15) can file; a representative needs a letter of authorization from one of them. Forms can be downloaded in advance." },
      ],
      sourceIds: ["hamamatsu-address-registration-moving-in"],
      sourceFormatNote: `Hamamatsu's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "hamamatsu-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Hamamatsu",
      summary: "After the moving-in notification, join Hamamatsu's National Health Insurance within 14 days; foreign residents must file at the ward office or administrative center where they live, and the certificate is posted to confirm the address.",
      applicability: "For residents not covered by workplace health insurance; the household head or a household member files.",
      responsibleBody: "Hamamatsu City", receivingOffice: "National Health Insurance counter of your ward office or administrative center",
      actions: [
        { title: "Join within 14 days", description: "Join within 14 days of moving in, after the moving-in notification, weekdays 8:30 a.m. to 5:15 p.m. Bring something showing the household head's My Number, such as a My Number Card; if you moved from another municipality in Japan, also bring the moving-out certificate (not needed when arriving from abroad). A representative needs a letter of authorization and identification." },
        { title: "Foreign residents use their own ward's office", description: "Foreign residents are handled only at the ward office or administrative center for where they currently live, not at branch or community center counters. The Certificate of Eligibility or Notice of Eligibility Information is posted to your address." },
      ],
      sourceIds: ["hamamatsu-national-health-insurance-moving-in", "hamamatsu-national-health-insurance-counters"],
      sourceFormatNote: `Hamamatsu's National Health Insurance pages are in Japanese. ${note}`,
    },
    {
      id: "hamamatsu-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Hamamatsu",
      summary: "Hamamatsu publishes a sorted collection calendar and an A–Z sorting list, collects batteries, lighters, spray cans, and heated tobacco as special items, and collects large items (renraku gomi) by application through LINE, phone, or online.",
      applicability: "Collection days differ by area; check the sorted collection calendar for your address.",
      responsibleBody: "Hamamatsu City",
      actions: [
        { title: "Follow the calendar and sorting list", description: "Put waste at your collection point by type: burnable, non-burnable, plastic packaging, bottles, cans, and PET bottles, and special items. Batteries, lighters, spray cans, and heated tobacco products go out as special items, not with other waste." },
        { title: "Book large items", description: "Large items are collected by application. Register with Hamamatsu's official LINE account and use its large-item menu, or, for items not on the LINE list or to take items in yourself, apply by phone or online." },
      ],
      sourceIds: ["hamamatsu-household-waste-rules", "hamamatsu-household-waste-bulky-line"],
      sourceFormatNote: `Hamamatsu's waste pages are in Japanese. ${note}`,
    },
    {
      id: "hamamatsu-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Hamamatsu",
      summary: "Hamamatsu asks for an inhabitant tax return from people with business, real estate, or other income beyond salary, people claiming extra deductions, and people who need an income certificate, unless they file an income-tax return.",
      applicability: "Use Hamamatsu's route when you lived in Hamamatsu on January 1 of the tax year.",
      responsibleBody: "Hamamatsu City", receivingOffice: "Citizen Tax Section, Hamamatsu City Hall Motome Annex",
      actions: [
        { title: "Check whether you must file", description: "File if you had business or real estate income, income other than salary, pension income with other small income, deductions such as medical costs or insurance premiums to claim, or need an income certificate from mid-June. You do not need to file if you file an income-tax return, if your employer reported your salary and you have no other income or deductions, or if you had only public pension income with no added deductions." },
      ],
      sourceIds: ["hamamatsu-resident-tax-who-files"],
      sourceFormatNote: `Hamamatsu's tax page is in Japanese. ${note}`,
    },
    {
      id: "hamamatsu-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Hamamatsu",
      summary: "Hamamatsu opens emergency evacuation places (by disaster type) and shelters when disaster strikes or is expected, publishes their locations and opening status, and has earthquake maps in Japanese, English, and Portuguese.",
      applicability: "Check your evacuation places for each type of disaster, including tsunami, ahead of time.",
      responsibleBody: "Hamamatsu City",
      actions: [
        { title: "Know where to go", description: "Emergency evacuation places are for staying safe temporarily from typhoons, heavy rain, earthquakes, or tsunami, and differ by disaster type; shelters are for people who cannot live at home. Lists of evacuation places, tsunami evacuation places, shelters, and main evacuation routes are published, and opening status is on TV, radio, the city's disaster email, and its disaster map. Bring your own masks and other supplies." },
        { title: "Check the earthquake and hazard maps", description: "The earthquake disaster prevention maps show expected shaking, liquefaction, landslide risk, and tsunami inundation, in Japanese, English, and Portuguese, based on Shizuoka Prefecture's 2013 damage estimate. The online Hamamatsu disaster map shows other hazards." },
      ],
      sourceIds: ["hamamatsu-disaster-preparation-evacuation-places", "hamamatsu-disaster-preparation-earthquake-maps"],
      sourceFormatNote: `Hamamatsu's disaster pages are in Japanese; the earthquake maps are trilingual. ${note}`,
    },
    {
      id: "hamamatsu-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Hamamatsu",
      summary: "The Hamamatsu Multicultural Center offers consultation in several languages, and the Hamamatsu Foreign Learner Support Center runs Japanese classes for foreign residents; both are described on Canal Hamamatsu, the city's portal for foreign residents.",
      applicability: "For foreign residents of Hamamatsu; details and schedules are on the centers' websites.",
      responsibleBody: "Hamamatsu City",
      actions: [
        { title: "Consult the Multicultural Center", description: "The center offers consultation in several languages, community consultation for anyone who wants to connect with foreign residents, and daily-life information. A Portuguese counseling line (Hamamatsu Inochi no Denwa) runs on Fridays from 7:30 to 9:30 p.m." },
        { title: "Learn Japanese", description: "The Foreign Learner Support Center holds Japanese classes for foreign residents and training for Japanese-teaching volunteers, and sends Japanese teachers to foreign schools." },
      ],
      sourceIds: ["hamamatsu-language-and-consultation-multicultural-center", "hamamatsu-language-and-consultation-learning-center"],
      sourceFormatNote: `Canal Hamamatsu's pages are in plain Japanese. ${note}`,
    },
    {
      id: "hamamatsu-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Hamamatsu",
      summary: "Hamamatsu explains the lump-sum withdrawal payment for foreign residents who leave Japan after paying into National Pension or employee pension for at least six months without becoming entitled to a pension.",
      applicability: "For foreign residents who paid pension premiums in Japan and are leaving.",
      responsibleBody: "Hamamatsu City",
      actions: [
        { title: "Claim within two years of leaving", description: "You qualify if you are not a Japanese national, paid National Pension or employee pension premiums for six months or more, no longer live in Japan, and never became entitled to a pension. Claim within two years of ceasing to live in Japan; a certificate showing you moved out, such as a copy of your removed resident record, may be needed. Periods covered by the payment no longer count toward a pension." },
      ],
      sourceIds: ["hamamatsu-national-pension-leaving-japan"],
      sourceFormatNote: `Hamamatsu's pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "old-source", records: ["hamamatsu-disaster-preparation"], source: "Earthquake disaster prevention maps page", date: "June 20, 2018" },
    { kind: "old-source", records: ["hamamatsu-language-and-consultation"], source: "Multicultural Center page (Canal Hamamatsu)", date: "January 1, 2024" },
    { kind: "gap", records: ["hamamatsu-household-waste"], gap: "Collection times and bags." },
    { kind: "gap", records: ["hamamatsu-resident-tax"], gap: "Filing period and the leaving-Japan (tax agent) step for inhabitant tax." },
    { kind: "gap", records: ["hamamatsu-national-pension"], gap: "Joining National Pension (counter and documents)." },
    { kind: "gap", records: ["hamamatsu-language-and-consultation"], gap: "Consultation languages and hours." },
  ],
});
