import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.saitama.lg.jp";

/** Saitama City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-11100", name: "Saitama City", aliases: ["Saitama", "Saitama-shi"] },
  sources: [
    { id: "saitama-address-registration-from-abroad", title: "Moving to Saitama City from abroad (FAQ)", url: `${base}/faq/001/001/002/p110026.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saitama-national-health-insurance-foreign-residents", title: "National Health Insurance for foreign residents", url: `${base}/001/153/002/002/p064501.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saitama-household-waste-rules", title: "Putting out household waste", url: `${base}/001/006/010/003/p072158.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saitama-household-waste-bulky", title: "Putting out bulky waste", url: `${base}/001/006/010/003/p072165.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saitama-household-waste-foreign-languages", title: "Household waste manual in other languages", url: `${base}/001/006/010/003/p042362.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saitama-resident-tax-filing", title: "Filing the municipal and prefectural inhabitant tax return", url: `${base}/001/153/004/002/001/001/p001691.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saitama-disaster-preparation-guidebook", title: "Saitama City disaster prevention guidebook", url: `${base}/001/011/015/006/p072024.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saitama-disaster-preparation-flood-evacuation", title: "Evacuating from floods", url: `${base}/001/011/015/004/001/p069820.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saitama-language-and-consultation-multilingual", title: "Multilingual consultation", url: `${base}/jp/sc/living-consultation.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "saitama-national-pension-from-abroad", title: "National Pension when moving in from abroad", url: `${base}/001/153/003/003/p087553.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "saitama-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Saitama City",
      summary: "Saitama City takes moving-in notifications from abroad within 14 days at the Resident Section of any ward office or at any branch office, on weekdays from 8:30 a.m. to 5:15 p.m.; the Citizens' Windows (shimin no madoguchi) cannot take them.",
      applicability: "Foreign residents moving into Saitama City from abroad. You cannot file before you arrive, and a late filing may need a written reason.",
      responsibleBody: "Saitama City", receivingOffice: "Resident Section of any ward office, or a branch office",
      actions: [
        { title: "Notify within 14 days at any ward office", description: "File within 14 days of entering Japan or starting to live at your new address, on weekdays from 8:30 a.m. to 5:15 p.m. at any ward office's Resident Section or any branch office, whichever is convenient; if you moved into a newly built or rebuilt building in an area with residential address numbering, use your own ward's office. If more than 14 days have passed, you may be asked to write the reason." },
        { title: "Bring passports and residence cards", description: "Bring the passport of everyone moving in, showing the date of entry (if you used an automated gate, bring a boarding pass stub or similar), identification, and each person's residence card (or, before it is issued, the passport you entered with) or special permanent resident certificate. Someone outside your household needs a letter of authorization." },
      ],
      sourceIds: ["saitama-address-registration-from-abroad"],
      sourceFormatNote: `Saitama City's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "saitama-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Saitama City",
      summary: "Foreign residents of Saitama City must join National Health Insurance at their ward office's Insurance and Pension Section within 14 days of entering Japan, moving in, or leaving workplace insurance, unless an exclusion applies.",
      applicability: "Not for people with a period of stay of three months or less (with some exceptions), Temporary Visitors, diplomats, certain Designated Activities holders (medical stay or tourism), people with a social security agreement certificate, people in workplace insurance or on public assistance, or people aged 75 and over.",
      responsibleBody: "Saitama City", receivingOffice: "Insurance and Pension Section, ward office where you live",
      actions: [
        { title: "Join within 14 days", description: "Join within 14 days of your date of entry, moving in, or losing previous insurance (the day after leaving a job) at your ward office's Insurance and Pension Section. Bring your passport or residence card showing your status, your My Number Card or notification card, and, if you left workplace insurance, a loss-of-coverage certificate or separation notice. Designated Activities holders also bring the designation attached to their passport." },
        { title: "Who can file", description: "You or someone in the same household on the resident record can file; anyone else needs a letter of authorization." },
      ],
      sourceIds: ["saitama-national-health-insurance-foreign-residents"],
      sourceFormatNote: `Saitama City's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "saitama-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Saitama City",
      summary: "Saitama City collects sorted waste at collection points by 8:30 a.m. on set days (5:30 a.m. where burnable waste is collected early), in transparent or semitransparent bags, and collects bulky items of 90 cm to 2 m by paid application.",
      applicability: "Collection days differ by area and continue on holidays; check the city's waste dictionary and collection calendar for your address.",
      responsibleBody: "Saitama City",
      actions: [
        { title: "Sort and put out by 8:30 a.m.", description: "Put waste out by 8:30 a.m. on its collection day, or by 5:30 a.m. (or the time set locally) in areas with early burnable-waste collection. Use transparent or semitransparent bags; black bags and cardboard boxes are not collected. Burnable waste goes out twice a week; non-burnable waste, recyclables, and hazardous items such as batteries and spray cans once a week. The household waste manual is available in English, Chinese, Korean, Vietnamese, and Portuguese." },
        { title: "Book bulky waste", description: "Items with a side or diameter of 90 cm to less than 2 m cannot go to the collection point. Book collection with the bulky waste reception center by phone, Monday to Friday, 8:30 a.m. to 5 p.m. (holidays included), or online at any time, up to four items at a time. Buy fee stickers at a convenience store with the sign, a ward office, a branch office, or a Citizens' Window, write the collection date and reception number on them, and put the items at the agreed place by 8:30 a.m. on the day." },
      ],
      sourceIds: ["saitama-household-waste-rules", "saitama-household-waste-bulky", "saitama-household-waste-foreign-languages"],
      sourceFormatNote: `Saitama City's waste pages are in Japanese; its waste manual has versions in five other languages. ${note}`,
    },
    {
      id: "saitama-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Saitama City",
      summary: "Saitama City asks residents on January 1 to file an inhabitant tax return unless an exception applies, by post to the northern or southern city tax office for their ward, online through eLTAX, or at temporary filing counters in the ward offices from mid-February to mid-March.",
      applicability: "Use Saitama City's route when you lived in Saitama City on January 1 of the tax year. Even people with no income should file if they need tax certificates or have National Health Insurance or long-term care premiums calculated.",
      responsibleBody: "Saitama City", receivingOffice: "Individual Taxation Section, Northern or Southern City Tax Office",
      actions: [
        { title: "File if you need to", description: "File if you lived in Saitama City on January 1 and had business, real estate, dividend, or other income, unless you filed an income-tax return, had only employment income reported by your employer, or had only public pension income (in the last two cases, file if you add deductions). Residents of Nishi, Kita, Omiya, Minuma, and Iwatsuki wards post their return to the Northern City Tax Office; residents of Chuo, Sakura, Urawa, Minami, and Midori wards to the Southern City Tax Office. You can also file online through eLTAX." },
        { title: "Use the filing season counters", description: "During the filing season in 2026, temporary filing counters opened in the ward offices from February 16 to March 16 on weekdays, 9 a.m. to 3 p.m., and on Sunday, March 1 at the Northern and Southern City Tax Offices only. Check the current year's dates on the city's filing page." },
      ],
      sourceIds: ["saitama-resident-tax-filing"],
      sourceFormatNote: `Saitama City's tax page is in Japanese. ${note}`,
    },
    {
      id: "saitama-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Saitama City",
      summary: "Saitama City publishes its disaster prevention guidebook in Japanese, English, Chinese, and Korean, and designates emergency evacuation places by type of disaster; for floods, use places in each flood hazard map's safe areas or upper floors of designated buildings.",
      applicability: "Check the flood hazard map for your address and the evacuation places for each type of disaster ahead of time; during an event, follow the city's evacuation information.",
      responsibleBody: "Saitama City",
      actions: [
        { title: "Read the guidebook", description: "The disaster prevention guidebook (2020 revision, partly corrected in October 2025) covers what to do in a disaster and how to prepare, and lists designated emergency evacuation places and shelters. The Japanese booklet was delivered to every household; English, Chinese, and Korean versions are available as data only. Printed Japanese copies are at the Disaster Prevention Division and ward office General Affairs Sections." },
        { title: "Evacuate early from floods", description: "Emergency evacuation places are designated separately for earthquakes, floods, and other disasters. Flood evacuation places are generally in each flood hazard map's safe areas; some buildings in flood areas also open upper floors for people who could not leave in time. Schools serve as both evacuation places and shelters. Evacuate early when flood warnings are issued." },
      ],
      sourceIds: ["saitama-disaster-preparation-guidebook", "saitama-disaster-preparation-flood-evacuation"],
      sourceFormatNote: `Saitama City's disaster pages are in Japanese. ${note}`,
    },
    {
      id: "saitama-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Saitama City",
      summary: "Saitama City offers multilingual consultation at the Omiya Ward Office Citizen Consultation Room on set weekday mornings, and at the International Exchange Center in Urawa run by the Saitama Tourism and International Relations Bureau.",
      applicability: "For foreign residents of Saitama City. Both counters close on holidays and from December 29 to January 3.",
      responsibleBody: "Saitama City",
      actions: [
        { title: "Use the Omiya Ward Office consultation", description: "The Citizen Consultation Room on the second floor of Omiya Ward Office takes consultations from 9 a.m. to noon: English on Monday and Wednesday, Tagalog on Monday, Korean on Tuesday, Vietnamese on Wednesday, and Chinese on Thursday." },
        { title: "Use the International Exchange Center", description: "The International Exchange Center on the ninth floor of Comnare in Urawa takes consultations in English on Wednesday, Chinese on Tuesday, and Korean on Thursday, in morning and afternoon sessions (last reception 2 p.m.), and in Japanese on Tuesday to Thursday. The Saitama Prefecture Foreign Residents Consultation Center in Kita-Urawa also takes daily-life and immigration consultations by phone." },
      ],
      sourceIds: ["saitama-language-and-consultation-multilingual"],
      sourceFormatNote: `Saitama City's consultation page is in plain Japanese with readings. ${note}`,
    },
    {
      id: "saitama-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Saitama City",
      summary: "People aged 20 to 59 who move to Saitama City from abroad and are not in employee pension coverage must join National Pension, regardless of nationality, at their ward office's Insurance and Pension Section or a branch office after registering their address.",
      applicability: "For residents aged 20 to 59 who are not covered through an employer or as a dependent spouse; those covered through work join through their employer.",
      responsibleBody: "Saitama City", receivingOffice: "Insurance and Pension Section of your ward office, or a branch office",
      actions: [
        { title: "Join after registering your address", description: "After the moving-in notification, join at your ward office's Insurance and Pension Section or a branch office, bringing your pension book or Basic Pension Number notice and identification such as a passport. Someone other than you or your household head needs a letter of authorization." },
        { title: "Watch for the payment notice", description: "The Japan Pension Service sends the premium payment notice in about one to two months. You can apply for account transfer or credit card payment, and for exemption or postponement if paying is difficult." },
      ],
      sourceIds: ["saitama-national-pension-from-abroad"],
      sourceFormatNote: `Saitama City's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "tax-year", records: ["saitama-resident-tax"], statement: "Filing-season counter dates \"from February 16 to March 16\" in 2026." },
    { kind: "old-source", records: ["saitama-disaster-preparation"], source: "Disaster prevention guidebook (2020 revision, partly corrected October 2025)", date: "2020" },
    { kind: "gap", records: ["saitama-resident-tax"], gap: "Leaving-Japan (tax agent) step." },
    { kind: "gap", records: ["saitama-language-and-consultation"], gap: "Japanese classes." },
  ],
});
