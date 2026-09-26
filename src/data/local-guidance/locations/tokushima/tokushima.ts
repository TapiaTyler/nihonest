import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.tokushima.tokushima.jp";

/** Tokushima City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-36201", name: "Tokushima City", aliases: ["Tokushima","Tokushima-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "tokushima-address-registration-moving-in", title: "Moving-in notification", url: `${base}/kurashi/todokede/koseki_nado/juminidou/tennyuu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "tokushima-national-health-insurance-procedures", title: "National Health Insurance procedures", url: `${base}/kenko_fukushi/kokuho/todokede.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "tokushima-household-waste-rules", title: "How to sort and put out waste", url: `${base}/kurashi/recycle/gomi/kateigomi/dashi/wakedashi.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "tokushima-household-waste-bulky", title: "Bulky waste", url: `${base}/kurashi/recycle/gomi/sodaigomi.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "tokushima-resident-tax-filing", title: "Filing the municipal and prefectural inhabitant tax return", url: `${base}/kurashi/zeikin/kojin_zei/sinkoku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "tokushima-disaster-preparation-earthquake-tsunami-map", title: "Tokushima earthquake and tsunami disaster prevention map", url: `${base}/anzen/shoubo_bousai/disaster_prevention/bousai_map/jishin.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "tokushima-language-and-consultation-support", title: "Support groups for foreign residents", url: `${base}/kurashi/soudan/foreign/Shien-dantai.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "tokushima-national-pension-notifications", title: "National Pension notifications and procedures", url: `${base}/kenko_fukushi/nenkin/todokede.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "tokushima-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Tokushima",
      summary: "Tokushima takes moving-in notifications from foreign residents only at the Resident Section (City Hall main building 1st floor, windows 3 and 4), within 14 days, including on the second and fourth Sunday mornings; branch offices cannot handle them.",
      applicability: "Foreign residents moving into Tokushima from abroad or from another municipality. You cannot file before moving.",
      responsibleBody: "Tokushima City", receivingOffice: "Resident Section, Tokushima City Hall main building 1st floor (windows 3 and 4)",
      actions: [
        { title: "File within 14 days", description: "File within 14 days of starting to live at the new address, weekdays 8:30 a.m. to 5 p.m. or on the second and fourth Sundays from 8:30 a.m. to noon. Late filing is still accepted but can lead to a non-penal fine; arrive with time to spare for related procedures." },
        { title: "Bring your residence card", description: "Foreign residents bring their residence card or special permanent resident certificate, or a passport marked that the card will be issued later. Relatives outside your household need a letter of authorization." },
      ],
      sourceIds: ["tokushima-address-registration-moving-in"],
      sourceFormatNote: `Tokushima's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "tokushima-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Tokushima",
      summary: "In Tokushima, the head of household notifies within 14 days at the Insurance and Pension Section (City Hall 1st floor, window 9), on weekdays or the second and fourth Sunday mornings, or by post; late notification means premiums back up to two years.",
      applicability: "For residents not covered by workplace insurance or public assistance.",
      responsibleBody: "Tokushima City", receivingOffice: "Insurance and Pension Section, Tokushima City Hall 1st floor (window 9)",
      actions: [
        { title: "Join with the right documents", description: "Bring the My Number of the head of household and each person joining, and identification for the person at the counter. Foreign residents arriving from abroad bring their passport and residence card; after leaving a job, bring a loss-of-coverage certificate that lists any dependents. Bring a bank cash card to set up automatic payment." },
        { title: "Leave when you join workplace insurance or move away", description: "Bring your eligibility certificate if you have one and the workplace insurance certificate or notice." },
      ],
      sourceIds: ["tokushima-national-health-insurance-procedures"],
      sourceFormatNote: `Tokushima's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "tokushima-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Tokushima",
      summary: "Tokushima collects burnable waste in clear or semi-transparent bags of up to 45 liters, and bulky waste six times a year on an area schedule, applied for by postcard or online.",
      applicability: "Bulky waste application and collection months depend on your district.",
      responsibleBody: "Tokushima City",
      actions: [
        { title: "Put out burnable waste", description: "Use clear or semi-transparent bags of up to 45 liters; drain food waste and tie the bag. Old paper is collected on a different day, and pruned branches must be cut to 30 cm and dried." },
        { title: "Apply for bulky waste", description: "In your district's application month, send the bulky waste postcard to the Eastern Environmental Office or apply online. A notice and stickers arrive by post in two to three weeks; put each item out with its sticker by 8:30 a.m. on the collection day, not before." },
      ],
      sourceIds: ["tokushima-household-waste-rules", "tokushima-household-waste-bulky"],
      sourceFormatNote: `Tokushima's waste pages are in Japanese. ${note}`,
    },
    {
      id: "tokushima-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Tokushima",
      summary: "Tokushima accepts inhabitant tax returns from late January, preferably by post, and online with a My Number Card from fiscal 2026.",
      applicability: "Use Tokushima's route when you lived in Tokushima on January 1 of the tax year.",
      responsibleBody: "Tokushima City",
      actions: [
        { title: "Check whether you must file", description: "File if you had income other than salary or public pension, or if your employer or pension payer did not report to the city. You do not need to if you file an income-tax return. People with no income may need to file for income certificates, and National Health Insurance premiums are based on the return." },
        { title: "File by post or online", description: "Fill in the return with the guide and send it with the required documents by post where possible; call the Citizen Tax Section at 088-621-5063 to have forms posted to you." },
      ],
      sourceIds: ["tokushima-resident-tax-filing"],
      sourceFormatNote: `Tokushima's tax page is in Japanese. ${note}`,
    },
    {
      id: "tokushima-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Tokushima",
      summary: "Tokushima's earthquake and tsunami map is split into numbered area maps with a town index, and Tokushima Prefecture published new tsunami flooding estimates in September 2025 and tsunami alert zones in March 2026.",
      applicability: "Check your area map and the latest prefectural tsunami estimates.",
      responsibleBody: "Tokushima City",
      actions: [
        { title: "Check your area map", description: "Find your town in the index, then open the matching map. The tsunami alert zone maps are also available at the Crisis Management Section counter at City Hall and on the prefecture's map system." },
      ],
      sourceIds: ["tokushima-disaster-preparation-earthquake-tsunami-map"],
      sourceFormatNote: `Tokushima's hazard map page is in Japanese. ${note}`,
    },
    {
      id: "tokushima-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Tokushima",
      summary: "The Tokushima International Association's one-stop consultation desk helps foreign residents with procedures and daily life on weekdays, using English interpreters and a 70-language translation device, and the prefectural association (TOPIA) takes consultations every day.",
      applicability: "For foreign residents of Tokushima.",
      responsibleBody: "Tokushima City", receivingOffice: "Tokushima International Association (TIA) one-stop consultation desk",
      actions: [
        { title: "Use the TIA desk", description: "Consultation runs weekdays 10 a.m. to noon and 2:30 to 5 p.m.; interpreters speak Japanese and English, and a translation device covers 70 languages." },
        { title: "Contact TOPIA", description: "The Tokushima Prefectural International Association takes consultations in English, Chinese, and Vietnamese every day from 10 a.m. to 6 p.m., with interpreting in 21 languages." },
      ],
      sourceIds: ["tokushima-language-and-consultation-support"],
      sourceFormatNote: `Tokushima's support page is in Japanese. ${note}`,
    },
    {
      id: "tokushima-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Tokushima",
      summary: "In Tokushima, notify the National Pension unit (window 11) when you leave a job, move abroad as a Category I insured person, or arrive from abroad; notifications can also be made online through Mynaportal.",
      applicability: "For residents aged 20 to 59 who are not covered by employee pension or as a dependent spouse.",
      responsibleBody: "Tokushima City", receivingOffice: "National Pension unit, window 11, Tokushima City Hall",
      actions: [
        { title: "Bring these documents", description: "Bring identification such as a My Number Card, driver's license, or residence card, and your pension book or Basic Pension Number notice." },
      ],
      sourceIds: ["tokushima-national-pension-notifications"],
      sourceFormatNote: `Tokushima's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "old-source", records: ["tokushima-household-waste"], source: "Bulky waste page", date: "June 5, 2023" },
    { kind: "gap", records: ["tokushima-resident-tax"], gap: "Filing deadline and the leaving-Japan (tax agent) step." },
    { kind: "gap", records: ["tokushima-household-waste"], gap: "Foreign-language waste guides." },
    { kind: "gap", records: ["tokushima-language-and-consultation"], gap: "Japanese classes for adults." },
  ],
});
