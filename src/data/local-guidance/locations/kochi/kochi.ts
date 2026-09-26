import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.kochi.kochi.jp";

/** Kochi City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-39201", name: "Kochi City", aliases: ["Kochi","Kochi-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "kochi-address-registration-moving-in", title: "Moving-in notification", url: `${base}/soshiki/18/html2-juki-ido-1.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kochi-national-health-insurance-overview", title: "National Health Insurance overview", url: `${base}/soshiki/25/k20190816.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kochi-national-health-insurance-moving", title: "National Health Insurance procedures when moving", url: `${base}/soshiki/25/kokuhohikkoshi.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kochi-household-waste-sorting", title: "Household waste sorting", url: `${base}/soshiki/64/gomitop1.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kochi-household-waste-bulky", title: "Burnable bulky waste", url: `${base}/soshiki/64/gomi1-kanenfunen01.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kochi-resident-tax-filing", title: "Inhabitant tax return", url: `${base}/soshiki/13/shinkoku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kochi-resident-tax-forms", title: "Inhabitant tax form downloads", url: `${base}/soshiki/13/kurasi-17down.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kochi-disaster-preparation-earthquake-tsunami", title: "Earthquake and tsunami hazard maps", url: `${base}/site/bousai/jisintsunami-hazardmap.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kochi-language-and-consultation-children", title: "Consultation and support for returnee and foreign children", url: `${base}/soshiki/89/sodan-tyugoku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kochi-national-pension-procedures", title: "National Pension procedures", url: `${base}/soshiki/18/kokuminnenkinnnotetuduki.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "kochi-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Kochi",
      summary: "Kochi takes moving-in notifications within 14 days on weekdays at the Central Service Center (City Hall main building 1st floor) or a regional service center; foreign residents bring the residence cards of everyone moving.",
      applicability: "Residents moving into Kochi from abroad or from another municipality. Mondays and days after holidays are busy.",
      responsibleBody: "Kochi City", receivingOffice: "Central Service Center (Kochi City Hall main building 1st floor) or a regional service center",
      actions: [
        { title: "File within 14 days", description: "You, your head of household, or an agent with a letter of authorization files within 14 days of starting to live at the new address, on weekdays. Bring identification (two documents if they have no photo)." },
        { title: "Bring passports and residence cards", description: "Arriving from abroad, bring the passports of everyone moving. Foreign residents also bring everyone's residence card or special permanent resident certificate, and may need a document proving the relationship to the head of household." },
      ],
      sourceIds: ["kochi-address-registration-moving-in"],
      sourceFormatNote: `Kochi's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "kochi-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Kochi",
      summary: "In Kochi, join National Health Insurance at the Insurance and Medical Care Section at City Hall or a regional service center with identification; regional centers cannot issue the certificate, which is posted to the head of household instead.",
      applicability: "For residents not covered by workplace insurance, late-stage elderly medical care, or public assistance.",
      responsibleBody: "Kochi City", receivingOffice: "Insurance and Medical Care Section (City Hall main building 1st floor) or a regional service center",
      actions: [
        { title: "Join with the right documents", description: "Bring identification such as a My Number Card, driver's license, or passport. After leaving workplace insurance, also bring a loss-of-coverage form, separation notice, or employment certificate if joining alone, or a loss-of-coverage form listing dependents if joining with family. An agent needs a letter of authorization." },
        { title: "Leave when you join workplace insurance", description: "Bring the workplace certificate or notice (or proof of joining if not yet issued) and your National Health Insurance certificate." },
      ],
      sourceIds: ["kochi-national-health-insurance-overview", "kochi-national-health-insurance-moving"],
      sourceFormatNote: `Kochi's National Health Insurance pages are in Japanese. ${note}`,
    },
    {
      id: "kochi-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Kochi",
      summary: "In Kochi, burnable waste goes to burnable waste stations twice a week, plastic containers on Wednesdays, and paper, bottles, cans, and burnable bulky items that do not fit in a 45-liter bag to resource and non-burnable waste stations; PET bottles go to store collection boxes.",
      applicability: "Station locations are not published online; ask your neighborhood.",
      responsibleBody: "Kochi City",
      actions: [
        { title: "Sort by station", description: "Burnable waste is collected Monday and Thursday or Tuesday and Friday depending on your area, and plastic containers on Wednesdays. Paper (five kinds), cloth, bottles (three colors), cans and metal, mercury items, small appliances, burnable bulky items, and non-burnable waste go to resource and non-burnable waste stations." },
        { title: "Handle items the city does not collect", description: "Take PET bottles to collection boxes at cooperating stores. The city does not collect TVs, air conditioners, refrigerators, washing machines, computers, tires, gas cylinders, or pianos." },
      ],
      sourceIds: ["kochi-household-waste-sorting", "kochi-household-waste-bulky"],
      sourceFormatNote: `Kochi's waste pages are in Japanese. ${note}`,
    },
    {
      id: "kochi-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Kochi",
      summary: "Kochi asks residents registered on January 1 who had income the previous year to file an inhabitant tax return unless they file an income-tax return, and provides a tax agent declaration form for people leaving Japan.",
      applicability: "Use Kochi's route when you lived in Kochi on January 1 of the tax year.",
      responsibleBody: "Kochi City",
      actions: [
        { title: "Check whether you must file", description: "Salaried workers file if their employer did not send a salary report (for example day labor or part-time work), if they had other income, or to claim deductions not handled by year-end adjustment. Other income of 200,000 yen or less needs an inhabitant tax return even without an income-tax return." },
        { title: "Name a tax agent before leaving", description: "Download and submit the tax agent declaration form to the Citizen Tax Section." },
      ],
      sourceIds: ["kochi-resident-tax-filing", "kochi-resident-tax-forms"],
      sourceFormatNote: `Kochi's tax pages are in Japanese. ${note}`,
    },
    {
      id: "kochi-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Kochi",
      summary: "Kochi updated its tsunami and earthquake hazard maps in March 2026 using Kochi Prefecture's October 2025 estimates for the largest-class Nankai Trough earthquake.",
      applicability: "Everyone in Kochi should know the expected tsunami area and shaking for their home.",
      responsibleBody: "Kochi City",
      actions: [
        { title: "Check the tsunami and earthquake maps", description: "The tsunami map shows the expected water level and area for the largest-class Nankai Trough earthquake, and the earthquake map shows expected shaking. Use the Kochi Prefecture disaster map to zoom in." },
      ],
      sourceIds: ["kochi-disaster-preparation-earthquake-tsunami"],
      sourceFormatNote: `Kochi's hazard map page is in Japanese. ${note}`,
    },
    {
      id: "kochi-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Kochi",
      summary: "Kochi's Education Research Institute gives educational consultation for returnee and foreign children on weekdays and Japanese-language and study support on Wednesday afternoons, by appointment.",
      applicability: "For returnee and foreign children and their families.",
      responsibleBody: "Kochi City", receivingOffice: "Kochi City Education Research Institute, 2-1-50 Sanbashi-dori",
      actions: [
        { title: "Book a consultation", description: "Educational consultation runs weekdays 8:30 a.m. to 5:15 p.m., and Japanese and study support on Wednesdays from 2 p.m. Call 088-832-4498 or 4497 to book a time in advance." },
      ],
      sourceIds: ["kochi-language-and-consultation-children"],
      sourceFormatNote: `Kochi's page is in Japanese. ${note}`,
    },
    {
      id: "kochi-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Kochi",
      summary: "In Kochi, notify within 14 days when you leave a job, and consult the National Pension counter at City Hall when moving abroad or arriving as a Category I insured person; regional service centers may not handle overseas moves.",
      applicability: "For residents aged 20 to 59 who are not covered by employee pension or as a dependent spouse.",
      responsibleBody: "Kochi City", receivingOffice: "National Pension counter, Kochi City Hall, or the nearest pension office",
      actions: [
        { title: "Join after leaving a job", description: "Bring your My Number Card (or identification and your Basic Pension Number) and a document showing your leaving date, such as a separation notice. An agent needs a letter of authorization and identification." },
      ],
      sourceIds: ["kochi-national-pension-procedures"],
      sourceFormatNote: `Kochi's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "gap", records: ["kochi-language-and-consultation"], gap: "Consultation desk and Japanese classes for adult foreign residents." },
    { kind: "gap", records: ["kochi-household-waste"], gap: "Foreign-language guides and collection times." },
    { kind: "gap", records: ["kochi-resident-tax"], gap: "Filing deadline." },
  ],
});
