import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.koshigaya.saitama.jp";

/** Koshigaya City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-11222", name: "Koshigaya City", aliases: ["Koshigaya", "Koshigaya-shi"], planGroup: "major-city" },
  sources: [
    { id: "koshigaya-address-registration-moving-in", title: "Moving into Koshigaya", url: `${base}/kurashi_shisei/kurashi/todokede/jyumintoroku/tennyu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koshigaya-address-registration-from-abroad", title: "Moving in from abroad (FAQ)", url: `${base}/kurashi_shisei/kurashi/todokede/faq/kaigaitennyuu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koshigaya-national-health-insurance-joining", title: "Joining and leaving National Health Insurance", url: `${base}/kurashi_shisei/fukushi/kokuho/kokuhokanyudattai/kanyuudattai.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koshigaya-household-waste-rules", title: "Sorting and putting out household waste", url: `${base}/kurashi_shisei/kurashi/gomi_recycle/kateigomi/wakekatadashikata.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koshigaya-household-waste-bulky", title: "Disposing of bulky waste", url: `${base}/kurashi_shisei/kurashi/gomi_recycle/kateigomi/sodaigomino-shobunnhouhou.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koshigaya-resident-tax-return-tool", title: "Calculating inhabitant tax and preparing the return", url: `${base}/kurashi_shisei/kurashi/zeikin/shiminzeikenminzei/zeigakushisan.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koshigaya-disaster-preparation-guidebook", title: "Koshigaya comprehensive disaster prevention guidebook", url: `${base}/anzen_anshin/bosai/map/koshigayashibousaimap.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koshigaya-disaster-preparation-evacuation-places", title: "Designated emergency evacuation places and shelters", url: `${base}/anzen_anshin/bosai/hinanjyo/hinanbasyo-hinanzyo.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koshigaya-language-and-consultation-counter", title: "Koshigaya consultation counters for foreign residents", url: `${base}/kurashi_shisei/kurashi/kokusaika/soudan/gaikokujin_sodan_madoguchi.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koshigaya-language-and-consultation-japanese-classes", title: "Japanese classes in Koshigaya", url: `${base}/kurashi_shisei/kurashi/kokusaika/faq/nihongokyoshitsu_shokai.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koshigaya-national-pension-joining", title: "Joining National Pension", url: `${base}/kurashi_shisei/kurashi/nenkin/kanyutetuduki/kanyuutetuduki.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "koshigaya-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Koshigaya",
      summary: "Koshigaya takes moving-in notifications in person within 14 days at the Citizens Section of City Hall or the Northern or Southern branch office; missing the deadline can lead to a non-penal fine of up to 50,000 yen.",
      applicability: "Residents moving into Koshigaya from abroad or from another municipality. Post and phone are not accepted.",
      responsibleBody: "Koshigaya City", receivingOffice: "Citizens Section (City Hall main building 1st floor), or the Northern or Southern branch office",
      actions: [
        { title: "Notify within 14 days", description: "File the resident change form at the counter within 14 days of starting to live at your new address; you cannot file before moving in. You or someone in your Koshigaya household can file; a representative needs a letter of authorization." },
        { title: "Moving in from abroad", description: "No moving-out certificate is needed; bring your passport so the entry date can be checked, and the filer's identification." },
      ],
      sourceIds: ["koshigaya-address-registration-moving-in", "koshigaya-address-registration-from-abroad"],
      sourceFormatNote: `Koshigaya's moving-in pages are in Japanese. ${note}`,
    },
    {
      id: "koshigaya-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Koshigaya",
      summary: "Koshigaya asks residents to join or leave National Health Insurance within 14 days; foreign residents joining bring their residence card or special permanent resident certificate and passport.",
      applicability: "For residents not covered by workplace health insurance or public assistance.",
      responsibleBody: "Koshigaya City",
      actions: [
        { title: "Join within 14 days", description: "Join within 14 days of moving in (bring the moving-out certificate if you moved within Japan), leaving workplace insurance (bring a loss-of-coverage certificate, separation certificate, or separation notice), leaving a dependent's coverage, or having a child. Foreign residents bring their residence card, passport, or special permanent resident certificate." },
        { title: "Leave and report changes", description: "Also notify within 14 days when you move out, join workplace insurance, or your address, household head, or name changes, bringing your Certificate of Eligibility if you have one." },
      ],
      sourceIds: ["koshigaya-national-health-insurance-joining"],
      sourceFormatNote: `Koshigaya's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "koshigaya-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Koshigaya",
      summary: "Koshigaya publishes its sorting rules in English, Chinese, Korean, and Vietnamese and in its collection calendar, offers the Sanaru sorting app, and collects items of 50 cm or more or 10 kg or more as paid bulky waste by reservation.",
      applicability: "Collection days differ by area; check the Koshigaya waste collection calendar.",
      responsibleBody: "Koshigaya City",
      actions: [
        { title: "Use the calendar and multilingual guide", description: "The waste sorting rules are in the collection calendar and are also available in English, Chinese, Korean, and Vietnamese. The Sanaru app lets you search how to sort items." },
        { title: "Book bulky waste", description: "Items with a side of 50 cm or more or weighing 10 kg or more, such as furniture, beds, mattresses, and bicycles, are bulky waste. Reserve paid collection by phone, online, or in the Sanaru app, or reserve a time to take items to the Koshigaya Recycling Plaza yourself." },
      ],
      sourceIds: ["koshigaya-household-waste-rules", "koshigaya-household-waste-bulky"],
      sourceFormatNote: `Koshigaya's waste pages are in Japanese; the sorting guide has versions in four other languages. ${note}`,
    },
    {
      id: "koshigaya-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Koshigaya",
      summary: "Koshigaya's online tool calculates inhabitant tax and prepares the return from your withholding slips, which you print and bring or post to the Citizen Tax Section.",
      applicability: "Use Koshigaya's route when you lived in Koshigaya on January 1 of the tax year.",
      responsibleBody: "Koshigaya City", receivingOffice: "Citizen Tax Section (City Hall main building 2nd floor)",
      actions: [
        { title: "Prepare the return online", description: "Enter the details from your salary or pension withholding slips to calculate the tax and create the return, then print it, attach the required documents, and bring or post it to the Citizen Tax Section; returns are not accepted by email. The tool cannot prepare income-tax returns, business income statements, or separate-taxation returns." },
      ],
      sourceIds: ["koshigaya-resident-tax-return-tool"],
      sourceFormatNote: `Koshigaya's tax page is in Japanese. ${note}`,
    },
    {
      id: "koshigaya-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Koshigaya",
      summary: "Koshigaya does not assign evacuation places by address: check the places near you in advance and choose the nearest suitable one. All designated shelters accept pets, and new residents receive the comprehensive disaster guidebook when they register.",
      applicability: "Evacuation places are designated separately for earthquakes, floods, and large fires.",
      responsibleBody: "Koshigaya City",
      actions: [
        { title: "Know where you would go", description: "In a disaster, find the nearest evacuation place or shelter from where you are, considering the surroundings and roads. Not every shelter necessarily opens; openings are announced by disaster radio, the city website, LINE, email, and social media. All designated shelters accept evacuation with pets." },
        { title: "Read the guidebook", description: "The comprehensive disaster prevention guidebook covers Koshigaya's disaster risks, including flood hazard maps for the Tone River area, and how to prepare. New residents receive it with their moving-in documents; others can download it." },
      ],
      sourceIds: ["koshigaya-disaster-preparation-evacuation-places", "koshigaya-disaster-preparation-guidebook"],
      sourceFormatNote: `Koshigaya's disaster pages are in Japanese. ${note}`,
    },
    {
      id: "koshigaya-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Koshigaya",
      summary: "Koshigaya's consultation counter for foreign residents on the third floor of City Hall has staff speaking English, Chinese, Filipino, Vietnamese, and plain Japanese on weekdays, with tablet interpreting for more languages, and volunteers run seven Japanese classes in the city.",
      applicability: "For foreign residents of Koshigaya, including newcomers who want a life orientation.",
      responsibleBody: "Koshigaya City", receivingOffice: "Citizen Activity Support Section, Koshigaya City Hall main building 3rd floor",
      actions: [
        { title: "Use the consultation counter", description: "The counter is open Monday to Friday (except holidays), 9 a.m. to 4:30 p.m., seven minutes from the east exit of Koshigaya Station. Staff speak English, Chinese, Filipino, Vietnamese, and plain Japanese, and tablets cover Nepali, Hindi, Korean, Russian, Portuguese, Indonesian, Spanish, Thai, French, and more. It offers general consultation, information, and life orientation for new foreign residents." },
        { title: "Join a Japanese class", description: "Volunteers run seven Japanese classes in the city; the monthly schedule is in the Koshigaya Messenger. For example, Nihongo Circle meets on Wednesday mornings at the Central Civic Hall, with childcare by reservation." },
      ],
      sourceIds: ["koshigaya-language-and-consultation-counter", "koshigaya-language-and-consultation-japanese-classes"],
      sourceFormatNote: `Koshigaya's pages are in Japanese. ${note}`,
    },
    {
      id: "koshigaya-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Koshigaya",
      summary: "In Koshigaya, people aged 20 to 59 who leave employee pension coverage or a spouse's coverage join National Pension at the National Health Insurance and Pension Section or the Northern or Southern branch office.",
      applicability: "For residents aged 20 to 59 who are not covered through an employer or as a dependent spouse.",
      responsibleBody: "Koshigaya City", receivingOffice: "Pension unit, National Health Insurance and Pension Section, or the Northern or Southern branch office",
      actions: [
        { title: "Join after leaving a job", description: "Bring your pension book or Basic Pension Number notice and a document showing the date you left, such as a separation notice, separation certificate, or loss-of-coverage certificate. If you support a spouse, they must switch from Category III to Category I at the same time." },
        { title: "Leaving a spouse's coverage", description: "If you leave a spouse's coverage through divorce or higher income, switch to Category I with your pension book or Basic Pension Number notice." },
      ],
      sourceIds: ["koshigaya-national-pension-joining"],
      sourceFormatNote: `Koshigaya's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "old-source", records: ["koshigaya-address-registration"], source: "Moving in from abroad FAQ", date: "October 21, 2021" },
    { kind: "gap", records: ["koshigaya-household-waste"], gap: "Collection deadline and bag rules (in the calendar PDF)." },
    { kind: "gap", records: ["koshigaya-resident-tax"], gap: "Who must file, the deadline, and the leaving-Japan (tax agent) step; the city's filing page was unavailable." },
  ],
});
