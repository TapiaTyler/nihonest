import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.ichikawa.lg.jp/page";

/** Ichikawa City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-12203", name: "Ichikawa City", aliases: ["Ichikawa", "Ichikawa-shi"], planGroup: "major-city" },
  sources: [
    { id: "ichikawa-address-registration-foreign-residents", title: "Notifications for foreign residents", url: `${base}/4292.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "ichikawa-national-health-insurance-notifications", title: "National Health Insurance notifications", url: `${base}/2418.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "ichikawa-household-waste-foreign-languages", title: "Collection calendar and sorting guide in other languages", url: `${base}/1373.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "ichikawa-household-waste-bulky", title: "Large-item waste", url: `${base}/4312.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "ichikawa-resident-tax-filing", title: "Filing the municipal and prefectural inhabitant tax return", url: `${base}/3875.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "ichikawa-resident-tax-faq", title: "Inhabitant tax frequently asked questions", url: `${base}/3876.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "ichikawa-disaster-preparation-hazard-map", title: "Ichikawa flood hazard map", url: `${base}/4985.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "ichikawa-language-and-consultation-consultation", title: "Consultation desk for foreign residents", url: `${base}/4290.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "ichikawa-language-and-consultation-japanese-classes", title: "Volunteer Japanese classes", url: `${base}/6718.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "ichikawa-national-pension-notifications", title: "National Pension notifications", url: `${base}/2419.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "ichikawa-national-pension-faq", title: "National Pension frequently asked questions", url: `${base}/56943.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "ichikawa-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Ichikawa",
      summary: "Ichikawa asks foreign residents to file a moving-in notification within 14 days, and people settling after landing permission or re-entry permission must file at the Citizens Section of City Hall or the Gyotoku branch office.",
      applicability: "Foreign residents moving into Ichikawa from abroad or from another municipality. For a child under 16, a relative aged 16 or older in the household files.",
      responsibleBody: "Ichikawa City", receivingOffice: "Citizens Section, Ichikawa City Hall, or the Gyotoku branch office",
      actions: [
        { title: "File within 14 days", description: "File within 14 days of moving in. Arrivals from abroad (landing or re-entry permission) file at the Citizens Section of City Hall or the Citizens Section of the Gyotoku branch office." },
        { title: "Bring residence cards and passports", description: "Bring the residence card or special permanent resident certificate and, when moving from abroad, the passport of everyone moving, plus My Number Cards or notification cards if you have them. A document proving the relationship to the head of household, with a translation if in a foreign language, may be needed." },
      ],
      sourceIds: ["ichikawa-address-registration-foreign-residents"],
      sourceFormatNote: `Ichikawa's foreign-resident page is in Japanese. ${note}`,
    },
    {
      id: "ichikawa-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Ichikawa",
      summary: "Ichikawa takes National Health Insurance notifications at City Hall, the Gyotoku branch office, Minami-Gyotoku Citizen Center, Okashiwa branch office, and the Ichikawa Station administrative service center, and can issue the eligibility certificate the same day if you show photo identification.",
      applicability: "For residents not covered by workplace insurance or public assistance.",
      responsibleBody: "Ichikawa City", receivingOffice: "Ichikawa City Hall (1st building), Gyotoku branch office, Minami-Gyotoku Citizen Center, Okashiwa branch office, or Ichikawa Station administrative service center",
      actions: [
        { title: "Join with the right document", description: "After leaving workplace insurance, bring the certificate that it ended; you can also join by post. If you or a household member shows photo ID such as a driver's license or passport, the certificate can be issued the same day. Bring your own bank cash card to set up automatic payment." },
        { title: "Leave when you join other insurance", description: "Bring the workplace insurance certificate or notice for everyone who joined, or a certificate of joining if it has not been issued yet." },
      ],
      sourceIds: ["ichikawa-national-health-insurance-notifications"],
      sourceFormatNote: `Ichikawa's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "ichikawa-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Ichikawa",
      summary: "Ichikawa's collection calendar and sorting guide come in nine other languages for each of six areas, and large items are collected by application by phone, online, or LINE, up to five items per application.",
      applicability: "Check your area number (1 to 6) to find the right calendar.",
      responsibleBody: "Ichikawa City",
      actions: [
        { title: "Get your area calendar", description: "Find your area number from the list, then download the calendar and sorting guide in English, Chinese, Korean, Spanish, Portuguese, Thai, Vietnamese, Tagalog, or Nepali." },
        { title: "Apply for large-item collection", description: "Items about the size of an 18-liter kerosene tank or larger, or heavy items, are large-item waste. Apply by phone at 047-712-6300 (weekdays 9 a.m. to 5 p.m., Saturdays 9 a.m. to noon) or online or through LINE at any time. Each household can apply for up to five items at a time, at least seven days apart. Pay with tickets bought in cash at convenience stores, or with PayPay or a credit card." },
      ],
      sourceIds: ["ichikawa-household-waste-foreign-languages", "ichikawa-household-waste-bulky"],
      sourceFormatNote: `Ichikawa's waste pages are in Japanese; the calendar has versions in nine other languages. ${note}`,
    },
    {
      id: "ichikawa-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Ichikawa",
      summary: "Ichikawa's 2026 inhabitant tax filing period ran from February 16 to March 16, with filing by post or online preferred, and people leaving Japan before paying can use automatic bank payment or name a tax agent.",
      applicability: "Use Ichikawa's route when you lived in Ichikawa on January 1 of the tax year.",
      responsibleBody: "Ichikawa City",
      actions: [
        { title: "File by post or online", description: "Filing venues open at City Hall's 1st building and the Gyotoku branch office on weekdays during the period, but the city asks you to file by post with copies of your identification and My Number documents, or online, which started in January 2026." },
        { title: "Plan for leaving Japan", description: "If tax is deducted from your salary, it continues or the remainder is deducted when you leave the job. Otherwise pay the full notice, set up automatic bank payment, or name a tax agent. If you leave between January and June, you may be taxed on the previous year's income and should name a tax agent to receive the notice and pay." },
      ],
      sourceIds: ["ichikawa-resident-tax-filing", "ichikawa-resident-tax-faq"],
      sourceFormatNote: `Ichikawa's tax pages are in Japanese. ${note}`,
    },
    {
      id: "ichikawa-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Ichikawa",
      summary: "Ichikawa's flood hazard map, revised in April 2026, covers Edo River flooding, smaller rivers, inland flooding, landslides, and storm surge, with a shelter list and foreign-language versions.",
      applicability: "Check your home's flood risk and the shelter you would go to before typhoon season.",
      responsibleBody: "Ichikawa City",
      actions: [
        { title: "Check the flood hazard map", description: "Download the map pages for the shelter list, Edo River flooding, smaller rivers with inland flooding and landslides, and storm surge, plus the information pages with a personal evacuation timeline. Foreign-language versions reflect when they were made and may include outdated information." },
      ],
      sourceIds: ["ichikawa-disaster-preparation-hazard-map"],
      sourceFormatNote: `Ichikawa's hazard map page is in Japanese; the map has foreign-language versions. ${note}`,
    },
    {
      id: "ichikawa-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Ichikawa",
      summary: "Ichikawa's free consultation desks for foreign residents, on the 1st floor of City Hall's 1st building and the Gyotoku branch office, answer daily-life questions in 23 languages on weekdays, and the Ichikawa International Association runs volunteer Japanese classes with the city.",
      applicability: "For foreign residents of Ichikawa.",
      responsibleBody: "Ichikawa City", receivingOffice: "Consultation desk for foreign residents, City Hall 1st building 1st floor or Gyotoku branch office 1st floor",
      actions: [
        { title: "Use the consultation desk", description: "Desks at both locations are open weekdays 10 a.m. to 5 p.m. (phone 047-712-8675). Consultants or tablet interpreting cover 23 languages, including English, Chinese, Spanish, Korean, Portuguese, Filipino, Vietnamese, Thai, Ukrainian, Russian, French, Nepali, Hindi, and Indonesian." },
        { title: "Find a Japanese class", description: "Check the Ichikawa International Association (IIA) website for volunteer class locations and contact each class directly to join." },
      ],
      sourceIds: ["ichikawa-language-and-consultation-consultation", "ichikawa-language-and-consultation-japanese-classes"],
      sourceFormatNote: `Ichikawa's pages are in Japanese. ${note}`,
    },
    {
      id: "ichikawa-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Ichikawa",
      summary: "Ichikawa asks people moving abroad to choose between voluntary membership and leaving National Pension, and people arriving from abroad without employee pension coverage to join as Category I insured persons.",
      applicability: "For residents aged 20 to 59 who move abroad or arrive from abroad.",
      responsibleBody: "Ichikawa City",
      actions: [
        { title: "Moving abroad or arriving", description: "Bring your pension book or Basic Pension Number document and identification. Moving abroad, the city confirms whether you continue voluntarily or leave. Japanese nationals living abroad can join voluntarily from 20 to 64 if a relative in Japan acts as a helper." },
      ],
      sourceIds: ["ichikawa-national-pension-notifications", "ichikawa-national-pension-faq"],
      sourceFormatNote: `Ichikawa's National Pension pages are in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "tax-year", records: ["ichikawa-resident-tax"], statement: "2026 filing period \"from February 16 to March 16\"." },
    { kind: "old-source", records: ["ichikawa-language-and-consultation"], source: "Consultation desk for foreign residents page", date: "April 10, 2024" },
    { kind: "gap", records: ["ichikawa-household-waste"], gap: "Burnable waste day, time, and bags (in the calendar PDF)." },
  ],
});
