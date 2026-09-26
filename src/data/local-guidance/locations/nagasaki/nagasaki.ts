import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.nagasaki.lg.jp";

/** Nagasaki City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-42201", name: "Nagasaki City", aliases: ["Nagasaki","Nagasaki-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "nagasaki-address-registration-from-abroad", title: "Moving in from abroad", url: `${base}/page/66734.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "nagasaki-national-health-insurance-overview", title: "Nagasaki City National Health Insurance overview", url: `${base}/page/1033.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "nagasaki-household-waste-rules", title: "How to sort and put out household waste", url: `${base}/page/3432.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "nagasaki-household-waste-leaflet", title: "Nagasaki waste sorting leaflet", url: `${base}/page/3027.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "nagasaki-household-waste-bulky", title: "Putting out bulky waste", url: `${base}/page/3031.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "nagasaki-resident-tax-filing", title: "Filing the individual inhabitant tax return", url: `${base}/page/3881.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "nagasaki-resident-tax-forms", title: "Other city tax forms, including the tax agent declaration", url: `${base}/page/3968.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "nagasaki-disaster-preparation-flood-map", title: "Flood hazard maps", url: `${base}/page/1877.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "nagasaki-language-and-consultation-consultation", title: "Consultation desk (plain Japanese)", url: `${base}/site/foreigner/4408.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "nagasaki-language-and-consultation-japanese-classes", title: "Japanese classes (plain Japanese)", url: `${base}/site/foreigner/4413.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "nagasaki-national-pension", title: "National Pension", url: `${base}/page/1034.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "nagasaki-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Nagasaki",
      summary: "Nagasaki takes moving-in notifications from abroad within 14 days at a regional center or branch office on weekdays 8:45 a.m. to 5:30 p.m.; district offices cannot handle foreign residents.",
      applicability: "Residents moving into Nagasaki from abroad. File only after you have actually moved in.",
      responsibleBody: "Nagasaki City", receivingOffice: "A regional center (including the Central Regional Center at City Hall) or branch office",
      actions: [
        { title: "File within 14 days", description: "File within 14 days of moving, on weekdays 8:45 a.m. to 5:30 p.m. You can prepare the form in advance online for use at the Central, Nishiurakami, Nameshi, Higashi-Nagasaki, Sanwa, and Kinkai regional centers, where staff can also fill it in with you." },
        { title: "Bring passports, residence cards, and relationship documents", description: "Bring everyone's passport and residence card, or a passport stamped that the card will be issued later, plus identification for the person filing. A foreign head of household with foreign members needs original marriage or birth certificates proving the relationship, with a translation." },
      ],
      sourceIds: ["nagasaki-address-registration-from-abroad"],
      sourceFormatNote: `Nagasaki's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "nagasaki-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Nagasaki",
      summary: "In Nagasaki, notify the Central Regional Center on the 1st floor of City Hall or your nearest regional center within 14 days of joining or leaving National Health Insurance, with your My Number and identification.",
      applicability: "For residents not covered by workplace insurance or public assistance.",
      responsibleBody: "Nagasaki City", receivingOffice: "Central Regional Center (City Hall 1st floor) or the nearest regional center",
      actions: [
        { title: "Join with original documents", description: "After leaving workplace insurance, bring an original certificate that your coverage ended; the employer can fill in the city's form. If you move in between January and May, also bring proof of the previous year's income for you and the head of household." },
        { title: "Leave when you join workplace insurance", description: "Bring a document confirming you joined workplace insurance, and notify within 14 days." },
      ],
      sourceIds: ["nagasaki-national-health-insurance-overview"],
      sourceFormatNote: `Nagasaki's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "nagasaki-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Nagasaki",
      summary: "Nagasaki sorts waste into 10 types, put out in designated bags by 8 a.m. at your station, with burnable waste twice a week; the sorting leaflet is in English, Korean, and Chinese, and bulky waste is collected by application.",
      applicability: "Plastic sorting changes in April or October 2026 depending on where you live.",
      responsibleBody: "Nagasaki City",
      actions: [
        { title: "Sort and put out waste", description: "Put out up to three bags of each type by 8 a.m. on collection day. Burnable waste is collected twice a week; non-burnable waste, plastic containers, and recyclables once a week. The leaflet is handed out at City Hall and regional centers." },
        { title: "Apply for bulky waste collection", description: "Items that do not fit in a designated bag (roughly 70 cm or longer, under 2 m and 60 kg) are bulky waste. Call the Bulky Waste Collection Center at 095-801-2200 (weekdays 8 a.m. to 4:15 p.m.), or apply online for some items since March 2026. The contractor collects up to two items." },
      ],
      sourceIds: ["nagasaki-household-waste-rules", "nagasaki-household-waste-leaflet", "nagasaki-household-waste-bulky"],
      sourceFormatNote: `Nagasaki's waste pages are in Japanese; the leaflet has versions in three other languages. ${note}`,
    },
    {
      id: "nagasaki-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Nagasaki",
      summary: "Nagasaki takes inhabitant tax returns at district venues from February 1 to March 15 and at the Citizen Tax Section at other times, by post at any time, and online from fiscal 2026; people moving abroad name a tax agent.",
      applicability: "Use Nagasaki's route when you lived in Nagasaki on January 1 of the tax year.",
      responsibleBody: "Nagasaki City",
      actions: [
        { title: "Check whether you must file", description: "File if you lived in Nagasaki on January 1 and had income the previous year. You need not file if your employer reports your salary and you have no other income, if you have only a small public pension, or if you file an income-tax return. People with no income who need an income or tax-exemption certificate should file." },
        { title: "Name a tax agent before leaving", description: "If you move abroad, submit a tax agent declaration to the Citizen Tax Section (City Hall 3rd floor) at the counter or by post." },
      ],
      sourceIds: ["nagasaki-resident-tax-filing", "nagasaki-resident-tax-forms"],
      sourceFormatNote: `Nagasaki's tax pages are in Japanese. ${note}`,
    },
    {
      id: "nagasaki-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Nagasaki",
      summary: "Nagasaki, with homes on steep slopes, published new flood hazard maps in August 2025 for the Nakashima, Urakami, and Hachiro river systems, and asks residents to leave risky areas before a flood.",
      applicability: "Anyone living on slopes or near rivers should check the maps and a safe place to go.",
      responsibleBody: "Nagasaki City",
      actions: [
        { title: "Check the flood maps and evacuate early", description: "Check expected flooding areas and depths on the map for your river system. The basic action is to leave for a shelter or a safe relative's or friend's home before a disaster; if it is too late, move to the second floor or higher." },
      ],
      sourceIds: ["nagasaki-disaster-preparation-flood-map"],
      sourceFormatNote: `Nagasaki's hazard map page is in Japanese. ${note}`,
    },
    {
      id: "nagasaki-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Nagasaki",
      summary: "Nagasaki points foreign residents to the free Nagasaki Prefecture Foreign Residents Consultation Desk at the Dejima Exchange Hall, and runs free Japanese classes at City Hall taught by city volunteers.",
      applicability: "Japanese classes are for foreign residents of Nagasaki, Nagayo, and Togitsu, or people working or studying in Nagasaki.",
      responsibleBody: "Nagasaki City", receivingOffice: "Nagasaki Prefecture Foreign Residents Consultation Desk, Dejima Exchange Hall 1st floor, 2-11 Dejima-machi",
      actions: [
        { title: "Use the consultation desk", description: "Ask about residence status, work, or daily life by phone (095-820-3377), email, or in person, weekdays 9 a.m. to 4 p.m., in Japanese, English, Chinese, Korean, Vietnamese, Nepali, Indonesian, Thai, Tagalog, and other languages." },
        { title: "Join a Japanese class", description: "Free classes (a textbook fee applies) run on Tuesday and Thursday evenings and Wednesday afternoons in the multipurpose space on City Hall's 2nd floor. Apply to the International Division with the application form." },
      ],
      sourceIds: ["nagasaki-language-and-consultation-consultation", "nagasaki-language-and-consultation-japanese-classes"],
      sourceFormatNote: `Nagasaki's pages are in plain Japanese. ${note}`,
    },
    {
      id: "nagasaki-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Nagasaki",
      summary: "In Nagasaki, join National Pension or change category at a regional center or branch office, online, or by post to the Japan Pension Service, for example after leaving a job before age 60.",
      applicability: "For residents aged 20 to 59 not covered by employee pension or as a dependent spouse.",
      responsibleBody: "Nagasaki City", receivingOffice: "A regional center or branch office, or the Nagasaki-Minami Pension Office",
      actions: [
        { title: "Join after leaving a job", description: "Apply at a regional center or branch office, online, or by posting the notification form, with your Basic Pension Number or My Number, to the Japan Pension Service Fukuoka Regional Office Center. By post, include a copy of your My Number Card or equivalent documents." },
      ],
      sourceIds: ["nagasaki-national-pension"],
      sourceFormatNote: `Nagasaki's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "gap", records: ["nagasaki-disaster-preparation"], gap: "Landslide hazard maps and evacuation shelter list." },
    { kind: "gap", records: ["nagasaki-national-pension"], gap: "The moving-abroad step." },
  ],
});
