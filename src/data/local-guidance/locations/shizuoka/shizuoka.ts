import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.shizuoka.lg.jp";

/** Shizuoka City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-22100", name: "Shizuoka City", aliases: ["Shizuoka", "Shizuoka-shi"] },
  sources: [
    { id: "shizuoka-address-registration-from-abroad", title: "Moving-in notification from abroad", url: `${base}/s8436/s013644.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shizuoka-national-health-insurance-joining", title: "Joining National Health Insurance after leaving other insurance", url: `${base}/s8435/s000658.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shizuoka-national-health-insurance-counters", title: "National Health Insurance counters", url: `${base}/s8435/s000628.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shizuoka-household-waste-guidebook", title: "Waste sorting guidebook downloads", url: `${base}/gomi/s000668.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shizuoka-household-waste-bulky", title: "Non-burnable and bulky waste", url: `${base}/gomi/s000679.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shizuoka-resident-tax-municipal", title: "Individual municipal tax", url: `${base}/s8374/s000518.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shizuoka-resident-tax-agent", title: "Tax agent forms for individual municipal tax", url: `${base}/shinsei/s8374/p2532.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shizuoka-disaster-preparation-map", title: "Shizuoka City disaster map", url: `${base}/s4268/s000309.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shizuoka-disaster-preparation-evacuation-places", title: "Designated emergency evacuation places and shelters", url: `${base}/s4268/s000061.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shizuoka-language-and-consultation-center", title: "Shizuoka City Multicultural General Consultation Center", url: `${base}/s9328/s002675.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shizuoka-national-pension-procedures", title: "National Pension procedures", url: `${base}/s8435/s000620.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "shizuoka-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Shizuoka City",
      summary: "Shizuoka City requires a moving-in notification at a ward office counter within 14 days of moving from abroad, once you actually live at the new address, with the passport of everyone who moved.",
      applicability: "Residents moving to Shizuoka City from abroad; a relative in a separate household needs a letter of authorization to file for you.",
      responsibleBody: "Shizuoka City", receivingOffice: "Ward office counter (Aoi, Suruga, or Shimizu)",
      actions: [
        { title: "Notify within 14 days", description: "File at a ward office counter within 14 days of moving to Shizuoka City from abroad; you must already be living at the new address. You, your household head, or someone in your household can file; anyone else needs a letter of authorization, which can be downloaded." },
        { title: "Bring passports and identification", description: "Bring the passport of everyone who moved; if it has no entry stamp, also bring your boarding pass stub or other proof of the entry date. The person at the counter also needs identification, such as a residence card, My Number Card, or passport, or two documents without a photo." },
      ],
      sourceIds: ["shizuoka-address-registration-from-abroad"],
      sourceFormatNote: `Shizuoka City's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "shizuoka-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Shizuoka City",
      summary: "Shizuoka City handles joining National Health Insurance at the Insurance and Pension Section of each ward office and at three branch offices; after leaving other insurance you can also apply by post or online.",
      applicability: "For residents not covered by workplace health insurance. Coverage and premiums start from the day your previous insurance ended, not the day you file.",
      responsibleBody: "Shizuoka City", receivingOffice: "Insurance and Pension Section of the Aoi, Suruga, or Shimizu ward office, or the Ikawa, Osada, or Kambara branch office",
      actions: [
        { title: "Join at the ward office", description: "The Insurance and Pension Sections of the Aoi, Suruga, and Shimizu ward offices handle joining and leaving. The Ikawa, Osada, and Kambara branch offices also accept them, but Ikawa and Osada cannot issue certificates the same day." },
        { title: "Apply by post or online after leaving insurance", description: "If you left workplace insurance and cannot visit, post the change form to your ward's Insurance and Pension Section with the loss-of-coverage certificate from your employer and a copy of your identification; the certificate is posted to the household head. You can also apply online. To continue your previous employer's insurance instead, apply to that insurer within 20 days of leaving." },
      ],
      sourceIds: ["shizuoka-national-health-insurance-joining", "shizuoka-national-health-insurance-counters"],
      sourceFormatNote: `Shizuoka City's National Health Insurance pages are in Japanese. ${note}`,
    },
    {
      id: "shizuoka-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Shizuoka City",
      summary: "Shizuoka City publishes a waste sorting guidebook for each area, including multilingual editions, and collects non-burnable and bulky waste once a month, from your home by application in most areas.",
      applicability: "Rules and collection days differ by area, and the Abe 6 districts of Aoi Ward use collection points; use the guidebook for your area.",
      responsibleBody: "Shizuoka City",
      actions: [
        { title: "Use your area's guidebook", description: "The guidebook shows your area's collection days and rules. Multilingual editions are available in Japanese with English, Portuguese, Spanish, and Chinese, or with Vietnamese, Nepali, Filipino, and Korean, for Aoi (except the Abe 6 districts) and Suruga wards and for Shimizu Ward." },
        { title: "Book non-burnable and bulky waste", description: "In Aoi Ward (except the Abe 6 districts), Suruga Ward, and Shimizu Ward, non-burnable and bulky waste are collected from your home once a month on your area's set day, by application at least a week before. Households of older people who cannot carry items out can ask for help." },
      ],
      sourceIds: ["shizuoka-household-waste-guidebook", "shizuoka-household-waste-bulky"],
      sourceFormatNote: `Shizuoka City's waste pages are in Japanese; the guidebook has multilingual editions. ${note}`,
    },
    {
      id: "shizuoka-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Shizuoka City",
      summary: "Shizuoka City asks residents to file by March 15 unless an exception applies, bills self-payers in four installments from June, and requires a tax agent within 10 days when leaving Japan would make paying difficult.",
      applicability: "Use Shizuoka City's route when you were registered in Shizuoka City on January 1 of the tax year. A working holiday abroad is treated as travel, so you are still taxed.",
      responsibleBody: "Shizuoka City", receivingOffice: "Citizen Tax Section, Shizuoka City Hall (New Building 2nd floor)",
      actions: [
        { title: "File by March 15 if needed", description: "Residents file their previous year's income by March 15, except people with only salary or public pension income reported to the city, people who filed an income-tax return, and people below the non-taxable limit. Other small income that needs no income-tax return must still be declared for inhabitant tax. You can prepare and submit the return online. Self-payers pay in four installments: June, August, October, and the following January." },
        { title: "Leaving Japan", description: "If you move abroad for a year or more across January 1, you are generally not taxed for that year, but any tax already due remains. If paying will be difficult after you leave, submit a tax agent (nozei kanrinin) declaration within 10 days, at the Citizen Tax Section or by post; this is not needed if payment is covered, for example by account transfer. Employees may have the rest deducted from their last salary." },
      ],
      sourceIds: ["shizuoka-resident-tax-municipal", "shizuoka-resident-tax-agent"],
      sourceFormatNote: `Shizuoka City's tax pages are in Japanese; the city also has plain-Japanese and multilingual tax pages. ${note}`,
    },
    {
      id: "shizuoka-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Shizuoka City",
      summary: "Shizuoka City's disaster map shows expected earthquake, tsunami, and landslide damage with evacuation places, and its evacuation places differ by disaster type; anyone can use any evacuation place or shelter regardless of where they live.",
      applicability: "Check the evacuation places for each type of disaster near your home ahead of time.",
      responsibleBody: "Shizuoka City",
      actions: [
        { title: "Check the disaster map", description: "The Shizuoka City disaster map (booklet, e-book, and the ShizuMap online GIS) shows areas expected to be damaged by earthquakes, tsunami, and landslides, and evacuation places and shelters. Separate maps cover flooding, Mount Fuji eruptions, and tsunami." },
        { title: "Know where to go", description: "Emergency evacuation places differ by disaster: wide-area and temporary places for earthquakes and large fires, tsunami evacuation places and buildings, and storm and flood places. Shelters, such as gymnasiums, are for people who cannot stay home. Anyone can use them regardless of address." },
      ],
      sourceIds: ["shizuoka-disaster-preparation-map", "shizuoka-disaster-preparation-evacuation-places"],
      sourceFormatNote: `Shizuoka City's disaster pages are in Japanese. ${note}`,
    },
    {
      id: "shizuoka-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Shizuoka City",
      summary: "The Shizuoka City Multicultural General Consultation Center, at City Hall in Aoi Ward and the Shimizu office, takes consultations in 17 languages on weekdays from 8:30 a.m. to 5:15 p.m., by phone, at the counter, or through Facebook Messenger.",
      applicability: "For foreign residents of Shizuoka City. When no counselor for your language is present, the center uses video interpreting on a tablet.",
      responsibleBody: "Shizuoka City", receivingOffice: "Shizuoka City Hall New Building 16th floor (Aoi Ward) or Shimizu Office 4th floor",
      actions: [
        { title: "Contact the center", description: "The center is open Monday to Friday, 8:30 a.m. to 5:15 p.m. (closed weekends, holidays, and the New Year period). Languages include English, Filipino, Spanish, Portuguese, Chinese, French, Vietnamese, Korean, Nepali, Thai, Indonesian, Hindi, Russian, Burmese, Malay, and Ukrainian." },
        { title: "When counselors are in", description: "At the Aoi Ward counter, English and Spanish counselors are in on weekdays from 8:30 a.m. to 5:15 p.m., Chinese on Thursday afternoons, and Filipino on Wednesdays. At Shimizu, English is on Fridays, Vietnamese on Mondays, Nepali and Filipino on Tuesdays, Portuguese on Wednesdays, and Spanish on Thursdays." },
      ],
      sourceIds: ["shizuoka-language-and-consultation-center"],
      sourceFormatNote: `Shizuoka City's page on the center is in Japanese. ${note}`,
    },
    {
      id: "shizuoka-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Shizuoka City",
      summary: "After leaving a job, you join National Pension Category I yourself at a ward office's Insurance and Pension Section, a branch office, or a pension office; joining and relief applications can also be filed online through Mynaportal.",
      applicability: "For residents aged 20 to 59 who become self-employed or unemployed, or who are otherwise not covered through an employer or as a dependent spouse.",
      responsibleBody: "Shizuoka City", receivingOffice: "Insurance and Pension Section of a ward office, or the Ikawa, Osada, or Kambara branch office",
      actions: [
        { title: "Join after leaving a job", description: "Bring something showing your Basic Pension Number or My Number, the health insurance withdrawal notice from your former employer, and photo identification (or two documents without a photo). If you then join a company, you join employee pension through work and must notify National Health Insurance that you are leaving it." },
        { title: "File online", description: "Joining as Category I, exemption and postponement, the student payment special system, and other notices can be filed online with a My Number Card through Mynaportal. Ward offices do not give help with using Mynaportal." },
      ],
      sourceIds: ["shizuoka-national-pension-procedures"],
      sourceFormatNote: `Shizuoka City's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "gap", records: ["shizuoka-household-waste"], gap: "Burnable waste day, time, and bags (in the area guidebook PDF); bulky waste phone hours." },
    { kind: "gap", records: ["shizuoka-address-registration"], gap: "Counter hours." },
  ],
});
