import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.kawaguchi.lg.jp/soshiki";

/** Kawaguchi City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-11203", name: "Kawaguchi City", aliases: ["Kawaguchi", "Kawaguchi-shi"], planGroup: "major-city" },
  sources: [
    { id: "kawaguchi-address-registration-from-abroad", title: "Moving to Kawaguchi from abroad (FAQ)", url: `${base}/01060/060/faq/6132.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawaguchi-national-health-insurance-joining", title: "Joining and leaving National Health Insurance", url: `${base}/01090/030/1_1/3313.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawaguchi-household-waste-rules", title: "Sorting and putting out household waste", url: `${base}/01100/040/4/1/1946.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawaguchi-household-waste-foreign-languages", title: "Household waste guide in other languages", url: `${base}/01100/040/4/1/3522.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawaguchi-household-waste-bulky", title: "Applying for bulky waste collection", url: `${base}/01100/060/1/1/13399.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawaguchi-resident-tax-filing", title: "Filing the municipal and prefectural inhabitant tax return", url: `${base}/01050/080/1/51466.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawaguchi-disaster-preparation-flood-maps", title: "Flood hazard maps (from the disaster handbook)", url: `${base}/01040/010/7/1/35751.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawaguchi-disaster-preparation-evacuation-places", title: "Evacuation places and shelters", url: `${base}/01040/010/7/10/2851.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawaguchi-language-and-consultation-counter", title: "Consultation counter for foreign residents", url: `${base}/01060/020/4/3584.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawaguchi-language-and-consultation-japanese-classes", title: "Japanese classes", url: `${base}/01060/020/4/4970.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawaguchi-national-pension-after-leaving-a-job", title: "Pension procedures after leaving a job (FAQ)", url: `${base}/01060/050/faq/7032.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "kawaguchi-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Kawaguchi",
      summary: "Kawaguchi takes moving-in notifications at the Citizens Section of City Hall, branch offices, and station administrative centers; moves from abroad are accepted only on weekdays from 9 a.m. to 4:30 p.m., even though the station centers also open evenings and weekends.",
      applicability: "Foreign residents moving to Kawaguchi from abroad.",
      responsibleBody: "Kawaguchi City", receivingOffice: "Citizens Section of City Hall, a branch office, or a station administrative center",
      actions: [
        { title: "Go on a weekday", description: "File the moving-in notification at the Citizens Section, a branch office, or a station administrative center. Moves from abroad are handled only on weekdays from 9 a.m. to 4:30 p.m." },
        { title: "Bring residence cards and passports", description: "Foreign residents bring the residence card or special permanent resident certificate of everyone moving in, and passports. A representative from outside your Kawaguchi household needs a letter of authorization." },
      ],
      sourceIds: ["kawaguchi-address-registration-from-abroad"],
      sourceFormatNote: `Kawaguchi's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "kawaguchi-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Kawaguchi",
      summary: "Registered foreign residents in Kawaguchi who are not in workplace insurance must join National Health Insurance within 14 days at the National Health Insurance Section, a branch office, or an administrative center, bringing a cash card to set up payment.",
      applicability: "For residents not covered by workplace insurance or public assistance.",
      responsibleBody: "Kawaguchi City", receivingOffice: "National Health Insurance Section, a branch office, or an administrative center",
      actions: [
        { title: "Join within 14 days", description: "Notify within 14 days, bringing your My Number Card or a document showing your My Number and photo identification. Moving in from another municipality, also bring the moving-out certificate and last year's income certificate; after leaving workplace insurance, the loss-of-coverage certificate. Foreign residents who register after a change of status bring a cash card, which is also used to set up premium payment." },
        { title: "Leaving by post or online", description: "When you join workplace insurance, you can notify the city that you are leaving National Health Insurance by post or online." },
      ],
      sourceIds: ["kawaguchi-national-health-insurance-joining"],
      sourceFormatNote: `Kawaguchi's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "kawaguchi-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Kawaguchi",
      summary: "Kawaguchi collects general waste twice a week in clear or white semitransparent bags, plastic packaging weekly, and recyclables twice a month, publishes its guide in eight other languages, and collects bulky waste by application online or by phone.",
      applicability: "Collection days differ by area; check the guide for your address.",
      responsibleBody: "Kawaguchi City",
      actions: [
        { title: "Sort by type and station", description: "General waste and hazardous waste go to the general waste station twice a week, in clear or white semitransparent bags. Plastic packaging goes there every Wednesday in a clear bag. Bottles, cans, metal, PET bottles, and textiles go to the recyclables station twice a month in clear bags. The guide is available in English, Chinese, Korean, Spanish, Portuguese, Tagalog, Vietnamese, and Turkish." },
        { title: "Book bulky waste", description: "Apply online, or for items not listed online, by phone to the bulky waste line on weekdays from 9 a.m. to 5 p.m. (except holidays and the New Year period); lines are busiest after holidays. Changes can be made up to three business days before collection." },
      ],
      sourceIds: ["kawaguchi-household-waste-rules", "kawaguchi-household-waste-foreign-languages", "kawaguchi-household-waste-bulky"],
      sourceFormatNote: `Kawaguchi's waste pages are in Japanese; the guide has versions in eight other languages. ${note}`,
    },
    {
      id: "kawaguchi-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Kawaguchi",
      summary: "Kawaguchi asks residents on January 1 to declare the previous year's income unless they filed an income-tax return or have only salary reported by one employer or small pension income; people with no income may also need to file for certificates or services.",
      applicability: "Use Kawaguchi's route when you lived in Kawaguchi on January 1 of the tax year.",
      responsibleBody: "Kawaguchi City",
      actions: [
        { title: "Check whether you must file", description: "File if your employer does not submit a salary report to the city, if you have income other than salary or pension, or if you want to add deductions for inhabitant tax only. People with no income should file if they need a non-taxation certificate showing income, are in National Health Insurance, receive child allowances, or were asked to by a public office or bank." },
        { title: "When you do not need to file", description: "You do not need to file if you filed an income-tax return, or if you had salary from one employer that reported it to the city with a year-end adjustment. People paid by two or more employers, or without a year-end adjustment, should check." },
      ],
      sourceIds: ["kawaguchi-resident-tax-filing"],
      sourceFormatNote: `Kawaguchi's tax page is in Japanese. ${note}`,
    },
    {
      id: "kawaguchi-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Kawaguchi",
      summary: "Kawaguchi does not assign shelters by district: you choose the nearest suitable evacuation place or shelter, and an online system shows which are open and how crowded they are. Flood hazard maps cover the Arakawa, Tone, and smaller rivers.",
      applicability: "Check evacuation places, shelters, and water supply points near your home and workplace ahead of time.",
      responsibleBody: "Kawaguchi City",
      actions: [
        { title: "Choose your own evacuation place", description: "Kawaguchi does not allocate shelters by area; decide where to go when evacuation is needed. You do not need to evacuate if your home is safe. If you shelter at home but cannot get food, you can collect it from the nearest shelter, depending on the situation." },
        { title: "Check the flood hazard maps", description: "The disaster handbook's flood hazard maps cover the Arakawa River (north, central, and south parts of the city), the Tone River, the Shiba and Shin-Shiba rivers, and other local rivers, as PDF or JPEG." },
      ],
      sourceIds: ["kawaguchi-disaster-preparation-evacuation-places", "kawaguchi-disaster-preparation-flood-maps"],
      sourceFormatNote: `Kawaguchi's disaster pages are in Japanese. ${note}`,
    },
    {
      id: "kawaguchi-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Kawaguchi",
      summary: "Kawaguchi's consultation counter for foreign residents at the Kawaguchi Citizens Partner Station gives city information, simple daily-life consultation, and guidance on Japanese classes, Tuesday to Saturday, with international staff on set days.",
      applicability: "For foreign residents of Kawaguchi.",
      responsibleBody: "Kawaguchi City", receivingOffice: "Kawaguchi Citizens Partner Station, Kyupo-la main building M4 floor, 1-1-1 Kawaguchi",
      actions: [
        { title: "Use the counter", description: "The counter is open Tuesday to Saturday, 9 a.m. to noon and 1 to 5:15 p.m. International staff are in from 10 a.m. to noon and 1 to 5 p.m.: Chinese and English every day, plus Tagalog on Tuesday, Korean on Wednesday, and Vietnamese on the second and fourth Saturdays. On Thursdays, Chinese, English, and Turkish consultation is also held in front of the Citizens Section at City Hall." },
        { title: "Join a Japanese class", description: "Several Japanese classes are held in community centers around the city, with different teaching styles, from set curricula to one-to-one help from volunteers." },
      ],
      sourceIds: ["kawaguchi-language-and-consultation-counter", "kawaguchi-language-and-consultation-japanese-classes"],
      sourceFormatNote: `Kawaguchi's consultation pages are in Japanese. ${note}`,
    },
    {
      id: "kawaguchi-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Kawaguchi",
      summary: "After leaving a job in Kawaguchi, join National Pension from the day after you left, at the National Pension Section, a branch office, or a station administrative center, or online through Mynaportal.",
      applicability: "For residents aged 20 to 59 who leave employee pension coverage; a dependent spouse must switch category too.",
      responsibleBody: "Kawaguchi City", receivingOffice: "National Pension Section (City Hall Second Building, 2nd floor), a branch office, or a station administrative center",
      actions: [
        { title: "Join after leaving a job", description: "Bring something showing your My Number or Basic Pension Number, identification such as a passport, driver's license, or My Number Card, and a document showing the date you left, such as a separation notice or loss-of-coverage notice. The National Pension Section counter is open weekdays 9 a.m. to 4:30 p.m. A dependent spouse also needs to switch from Category III to Category I." },
        { title: "Pay the premiums", description: "About a month after joining, the Japan Pension Service sends payment slips, which you can pay at a bank, post office, or convenience store; payments by smartphone apps such as PayPay do not produce a receipt." },
      ],
      sourceIds: ["kawaguchi-national-pension-after-leaving-a-job"],
      sourceFormatNote: `Kawaguchi's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "old-source", records: ["kawaguchi-disaster-preparation"], source: "Flood hazard map page (disaster handbook excerpt)", date: "August 16, 2021" },
    { kind: "gap", records: ["kawaguchi-household-waste"], gap: "Collection deadline time." },
    { kind: "gap", records: ["kawaguchi-resident-tax"], gap: "Filing deadline and the leaving-Japan (tax agent) step." },
  ],
});
