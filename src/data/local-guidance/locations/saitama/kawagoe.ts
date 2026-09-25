import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.kawagoe.saitama.jp/kurashi";

/** Kawagoe City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-11201", name: "Kawagoe City", aliases: ["Kawagoe", "Kawagoe-shi"], planGroup: "major-city" },
  sources: [
    { id: "kawagoe-address-registration-moving-in", title: "Moving into Kawagoe from another municipality or abroad", url: `${base}/koseki/1001847/1001854.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawagoe-national-health-insurance-joining", title: "Joining and leaving National Health Insurance", url: `${base}/kokuho/1002164/1002167.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawagoe-household-waste-rules", title: "Sorting and putting out household waste", url: `${base}/gomi/1002380/1002381.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawagoe-household-waste-foreign-languages", title: "Household waste guide in other languages", url: `${base}/gomi/1002380/1002386.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawagoe-household-waste-bulky", title: "Bulky waste collection from your home", url: `${base}/gomi/1002469/1002474/1002476.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawagoe-resident-tax-filing", title: "Filing the 2026 inhabitant tax return", url: `${base}/zeikin/1001957/1001964.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawagoe-disaster-preparation-hazard-maps", title: "Hazard maps", url: `${base}/anshin/1001545/1001576/index.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawagoe-language-and-consultation-consultation", title: "Consultation for foreign residents", url: `${base}/bunka/1003482/1003508/1003509.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawagoe-language-and-consultation-japanese-classes", title: "Japanese classes", url: `${base}/bunka/1003482/1003499/1003503.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawagoe-national-pension-joining", title: "Joining National Pension", url: `${base}/nenkin/1002128/1002129.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "kawagoe-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Kawagoe",
      summary: "Kawagoe takes moving-in notifications only in person, within 14 days, at the Citizens Section of City Hall or a citizen center, weekdays 8:45 a.m. to 4:30 p.m.; missing the deadline can lead to a non-penal fine of up to 50,000 yen.",
      applicability: "Residents moving into Kawagoe from abroad or from another municipality. Post, online, and phone notifications are not accepted.",
      responsibleBody: "Kawagoe City", receivingOffice: "Citizens Section (City Hall 1st floor) or a citizen center",
      actions: [
        { title: "Notify in person within 14 days", description: "File the resident change form at the counter within 14 days of starting to live at your new address, weekdays 8:45 a.m. to 4:30 p.m.; you cannot file before moving in. You or a member of your new household can file, with identification." },
        { title: "Bring passports, residence cards, and relationship documents", description: "Foreign residents bring the passport showing the entry date and the residence card or special permanent resident certificate of everyone moving in. A household with a foreign head and members also needs original documents proving the relationship, such as birth or marriage certificates issued by a government, with a Japanese translation." },
      ],
      sourceIds: ["kawagoe-address-registration-moving-in"],
      sourceFormatNote: `Kawagoe's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "kawagoe-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Kawagoe",
      summary: "In Kawagoe, foreign residents with a period of stay over three months who are not in other health insurance must join National Health Insurance within 14 days, and can apply from seven days before their previous insurance ends.",
      applicability: "For residents not covered by workplace insurance or public assistance. Premiums are collected as National Health Insurance tax.",
      responsibleBody: "Kawagoe City",
      actions: [
        { title: "Join within 14 days", description: "Notify within 14 days of becoming eligible, with your residence card and passport and your My Number. You can apply from seven days before your previous health insurance ends. Even with a My Number Card registered as a health insurance card, you still need to file." },
        { title: "Leave when you get other insurance", description: "When you join workplace insurance or start public assistance, notify the city to leave. If you use Kawagoe's coverage after it ended, you may have to repay the costs the city covered, and late notices may limit how far the tax can be corrected." },
      ],
      sourceIds: ["kawagoe-national-health-insurance-joining"],
      sourceFormatNote: `Kawagoe's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "kawagoe-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Kawagoe",
      summary: "Kawagoe's sorting guide is in the citizens' handbook and in seven other languages, and bulky waste is collected from your home by paid reservation made by phone on weekdays.",
      applicability: "Collection days differ by area; check the guide for your address.",
      responsibleBody: "Kawagoe City",
      actions: [
        { title: "Get the sorting guide", description: "The household waste guide is in the Kawagoe citizens' handbook and can be downloaded. Versions in English, Chinese, Korean, Portuguese, Tagalog, Vietnamese, and Thai are available online and at the Resource Circulation Promotion Section, the Citizens Section, and the International Culture Exchange Section, with simplified guides in English, Chinese, Vietnamese, and Nepali." },
        { title: "Reserve bulky waste by phone", description: "Reserve a collection date and time slot by phone on weekdays. Put the items out before the reserved time, at the road edge of your property for a house or at the collection point for an apartment. Collection runs 8:30 to 11:30 a.m. and 12:45 to 4 p.m." },
      ],
      sourceIds: ["kawagoe-household-waste-rules", "kawagoe-household-waste-foreign-languages", "kawagoe-household-waste-bulky"],
      sourceFormatNote: `Kawagoe's waste pages are in Japanese; the guide has versions in seven other languages. ${note}`,
    },
    {
      id: "kawagoe-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Kawagoe",
      summary: "Kawagoe's 2026 inhabitant tax filing period ran from February 12 to March 16; returns filed later may miss the May and June tax notices and delay income certificates.",
      applicability: "Use Kawagoe's route when you lived in Kawagoe on January 1 of the tax year.",
      responsibleBody: "Kawagoe City",
      actions: [
        { title: "File if you need to", description: "If you do not need to file an income-tax return but have income other than salary or pension, or want to claim extra deductions for inhabitant tax only, file an inhabitant tax return. The Citizen Tax Section does not give filing consultations at its counter during the filing period." },
        { title: "File on time", description: "Returns filed after the deadline may not be reflected in the first tax notices sent in May and June; the tax is then corrected later in the year, and income certificates, insurance premiums, and allowances calculated from tax data can be affected." },
      ],
      sourceIds: ["kawagoe-resident-tax-filing"],
      sourceFormatNote: `Kawagoe's tax page is in Japanese. ${note}`,
    },
    {
      id: "kawagoe-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Kawagoe",
      summary: "Kawagoe publishes earthquake, flood, inland flooding, and landslide hazard maps, viewable on the Koedo Kawagoe online map, and a record of past flooding from 1998 to 2024.",
      applicability: "Check the hazard maps and flooding record for your address ahead of time.",
      responsibleBody: "Kawagoe City",
      actions: [
        { title: "Check the hazard maps", description: "The flood and inland flooding hazard maps can be opened on the Koedo Kawagoe online map, and PDFs cover earthquakes, floods, inland flooding, rainwater flooding areas, and landslides. Saitama Prefecture's audio hazard map app reads the information aloud." },
        { title: "Check past flooding", description: "The city's flooding record lists damage from heavy rain between August 1998 and August 2024, grouped by blocks of ten lot numbers. It does not include every incident." },
      ],
      sourceIds: ["kawagoe-disaster-preparation-hazard-maps"],
      sourceFormatNote: `Kawagoe's hazard map page is in Japanese. ${note}`,
    },
    {
      id: "kawagoe-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Kawagoe",
      summary: "Kawagoe's International Exchange Center, five minutes from Kawagoe Station's east exit, offers free daily-life consultation in Japanese with Chinese or Vietnamese on set days, lawyer and residence-status consultations, and volunteer-run Japanese classes four days a week.",
      applicability: "Consultation is for foreign residents living in Kawagoe; apart from daily-life consultation it is in Japanese, so bring an interpreter or ask the International Culture Exchange Section in advance.",
      responsibleBody: "Kawagoe City", receivingOffice: "Kawagoe International Exchange Center, Classe Kawagoe 5th floor, 23-10 Sugahara-cho",
      actions: [
        { title: "Use the consultation days", description: "Daily-life consultation runs in Japanese and Chinese on the second and fourth Mondays and in Japanese and Vietnamese on the first and third Saturdays, 1 to 6 p.m. A lawyer is available on the fourth Friday from 3 to 5 p.m., and an administrative scrivener for residence-status questions on the fourth Saturday from 1 to 6 p.m." },
        { title: "Join a Japanese class", description: "Volunteer groups run Japanese classes at the International Exchange Center on Mondays, Thursdays, Fridays, and Saturdays, in morning, afternoon, and evening sessions. Parents must bring and pick up elementary and junior high school students." },
      ],
      sourceIds: ["kawagoe-language-and-consultation-consultation", "kawagoe-language-and-consultation-japanese-classes"],
      sourceFormatNote: `Kawagoe's pages are in Japanese. ${note}`,
    },
    {
      id: "kawagoe-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Kawagoe",
      summary: "In Kawagoe, join National Pension as a Category I insured person when you leave a job, lose employee pension coverage, leave a spouse's coverage, or return from abroad aged 20 to 59.",
      applicability: "For residents aged 20 to 59 who are not covered through an employer or as a dependent spouse.",
      responsibleBody: "Kawagoe City", receivingOffice: "National Pension unit, Citizens Section, Kawagoe City Hall",
      actions: [
        { title: "Join with these documents", description: "Bring your pension book or Basic Pension Number notice, your My Number Card or a document showing your My Number, and identification such as a driver's license." },
      ],
      sourceIds: ["kawagoe-national-pension-joining"],
      sourceFormatNote: `Kawagoe's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "tax-year", records: ["kawagoe-resident-tax"], statement: "2026 filing period \"from February 12 to March 16\"." },
    { kind: "gap", records: ["kawagoe-household-waste"], gap: "Burnable waste day, time, and bags (in the guide PDF); bulky waste phone hours and fees." },
    { kind: "gap", records: ["kawagoe-resident-tax"], gap: "The leaving-Japan (tax agent) step." },
  ],
});
