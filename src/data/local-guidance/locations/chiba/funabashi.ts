import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.funabashi.lg.jp";

/** Funabashi City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-12204", name: "Funabashi City", aliases: ["Funabashi", "Funabashi-shi"], planGroup: "major-city" },
  sources: [
    { id: "funabashi-address-registration-from-abroad", title: "Moving into Funabashi from abroad (FAQ)", url: `${base}/faq/kurashi/koseki/002/p028566.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "funabashi-national-health-insurance-joining", title: "Joining National Health Insurance", url: `${base}/kenkou/kokuho/001/p001888.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "funabashi-household-waste-pamphlets", title: "Waste sorting pamphlets", url: `${base}/kurashi/gomi/005/p029559.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "funabashi-household-waste-bulky", title: "Bulky waste collection", url: `${base}/kurashi/gomi/002/p001549.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "funabashi-resident-tax-filing", title: "Filing the municipal and prefectural inhabitant tax return", url: `${base}/kurashi/zei/007/002/p097691.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "funabashi-resident-tax-agent", title: "Tax agent for inhabitant tax", url: `${base}/kurashi/zei/003/01/p000841.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "funabashi-disaster-preparation-hazard-maps", title: "Viewing the Funabashi hazard maps", url: `${base}/bousai/map/p009037.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "funabashi-language-and-consultation-center", title: "Multilingual Information Center", url: `${base}/kurashi/chiiki/006/p004819.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "funabashi-language-and-consultation-japanese-classes", title: "Japanese classes", url: `${base}/kurashi/chiiki/006/p009771.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "funabashi-national-pension-abroad", title: "National Pension when moving abroad", url: `${base}/kurashi/nenkin/002/p010287.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "funabashi-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Funabashi",
      summary: "Funabashi takes moving-in notifications from abroad at City Hall, the Station-Front General Service Center, or a branch office, but not after 5 p.m. or on holiday opening days, when the resident registry network cannot be checked.",
      applicability: "Residents moving into Funabashi from abroad. Liaison offices and the temporary My Number Card venue cannot handle it.",
      responsibleBody: "Funabashi City", receivingOffice: "Funabashi City Hall, the Station-Front General Service Center, or a branch office",
      actions: [
        { title: "Go on a weekday before 5 p.m.", description: "File at City Hall, the Station-Front General Service Center, or a branch office. Notifications from abroad are not accepted after 5 p.m. or on holiday opening days. If a returning child will attend a Funabashi city elementary or junior high school, only the main City Hall can take the notification." },
        { title: "Bring passports and residence cards", description: "Foreign residents bring the passports and residence cards (or special permanent resident certificates) of everyone moving in." },
      ],
      sourceIds: ["funabashi-address-registration-from-abroad"],
      sourceFormatNote: `Funabashi's FAQ page is in Japanese. ${note}`,
    },
    {
      id: "funabashi-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Funabashi",
      summary: "In Funabashi, National Health Insurance starts from the day you become eligible, not the day you file, and after leaving a job you join with photo identification, proof that your workplace insurance ended, and a bank cash card.",
      applicability: "For residents not covered by workplace insurance or public assistance.",
      responsibleBody: "Funabashi City",
      actions: [
        { title: "Join after leaving a job", description: "Bring photo identification, a certificate or notice that your workplace insurance ended (or a separation certificate), and a cash card for the bank account used to pay. Premiums are charged from the day you became eligible, even if you file later." },
        { title: "Receive your certificate by post", description: "The city posts the eligibility certificate or related document to you after you join." },
      ],
      sourceIds: ["funabashi-national-health-insurance-joining"],
      sourceFormatNote: `Funabashi's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "funabashi-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Funabashi",
      summary: "Funabashi's waste sorting pamphlets are available at branch offices and other city facilities, with simplified versions in six other languages, and bulky waste collection can be booked online with cashless payment.",
      applicability: "Collection days differ by area; check the pamphlet for your address.",
      responsibleBody: "Funabashi City",
      actions: [
        { title: "Get the sorting pamphlet", description: "Pamphlets are available at branch offices, the Station-Front General Service Center, community halls, and the Resource Circulation Section on the 4th floor of City Hall. Simplified versions are in English, Chinese, Korean, Spanish, Vietnamese, and Nepali." },
        { title: "Book bulky waste collection", description: "Apply online (since April 2025, with PayPay or credit card payment) or by phone. Each household can apply for up to five items at a time and must wait seven days before the next application." },
      ],
      sourceIds: ["funabashi-household-waste-pamphlets", "funabashi-household-waste-bulky"],
      sourceFormatNote: `Funabashi's waste pages are in Japanese; the pamphlet has simplified versions in six other languages. ${note}`,
    },
    {
      id: "funabashi-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Funabashi",
      summary: "Funabashi asks for inhabitant tax returns by post or online through eLTAX, and residents who leave Japan name a tax agent with the Property Tax Section.",
      applicability: "Use Funabashi's route when you lived in Funabashi on January 1 of the tax year.",
      responsibleBody: "Funabashi City",
      actions: [
        { title: "File by post or online", description: "File if you lived in Funabashi on January 1 with income and are not exempt, for example if your employer did not send a salary report or you had other income of 200,000 yen or less without filing an income-tax return. Returns go by post, or online through eLTAX with a My Number Card." },
        { title: "Name a tax agent before leaving", description: "If you leave Japan before paying, name a tax agent. File a declaration if the agent lives in Funabashi, or an application for approval if not, with the Property Tax Section on the 2nd floor of City Hall." },
      ],
      sourceIds: ["funabashi-resident-tax-filing", "funabashi-resident-tax-agent"],
      sourceFormatNote: `Funabashi's tax pages are in Japanese. ${note}`,
    },
    {
      id: "funabashi-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Funabashi",
      summary: "Funabashi publishes tsunami, earthquake and liquefaction, flood, inland flooding, landslide, and storm surge hazard maps online, along with a disaster prevention map.",
      applicability: "Check the hazard maps for your address ahead of time; coastal areas should also check the tsunami and storm surge maps.",
      responsibleBody: "Funabashi City",
      actions: [
        { title: "Check the hazard maps", description: "Open the Funabashi hazard map link to see the tsunami, earthquake and liquefaction, flood, inland flooding, landslide, and storm surge maps and the disaster prevention map. You can also register for the city's disaster information email." },
      ],
      sourceIds: ["funabashi-disaster-preparation-hazard-maps"],
      sourceFormatNote: `Funabashi's hazard map page is in Japanese. ${note}`,
    },
    {
      id: "funabashi-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Funabashi",
      summary: "Funabashi's Multilingual Information Center gives free consultation in 12 languages at City Hall window 11, by phone, or by email, and the Funabashi International Relations Association (FIRA) runs Japanese classes.",
      applicability: "For foreign residents, and for Japanese people and employers helping them.",
      responsibleBody: "Funabashi City", receivingOffice: "Multilingual Information Center, Funabashi City Hall 1st floor, window 11",
      actions: [
        { title: "Visit or call the center", description: "Come to window 11 without a reservation, or call 050-3101-3495, weekdays 9 a.m. to 5 p.m. Languages are Japanese, English, Chinese, Korean, Vietnamese, Nepali, Indonesian, Tagalog, Thai, Portuguese, Spanish, and Hindi. On the phone, say your language first to be connected to an interpreter, who can also join a call with city staff." },
        { title: "Find a Japanese class", description: "The city's Japanese class page lists classes run by FIRA; choose the class you want to join." },
      ],
      sourceIds: ["funabashi-language-and-consultation-center", "funabashi-language-and-consultation-japanese-classes"],
      sourceFormatNote: `Funabashi's pages are in Japanese. ${note}`,
    },
    {
      id: "funabashi-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Funabashi",
      summary: "In Funabashi, Category I National Pension coverage ends automatically when you move abroad, but if you leave a job before going you first join National Pension at City Hall or the pension office.",
      applicability: "For residents aged 20 to 59 who move abroad.",
      responsibleBody: "Funabashi City",
      actions: [
        { title: "Moving abroad", description: "Your Category I coverage ends automatically when you file the moving-out notification. If you leave a job before going abroad, first complete the joining procedure at City Hall or the pension office." },
      ],
      sourceIds: ["funabashi-national-pension-abroad"],
      sourceFormatNote: `Funabashi's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "old-source", records: ["funabashi-address-registration"], source: "Moving in from abroad FAQ", date: "November 18, 2023" },
    { kind: "old-source", records: ["funabashi-language-and-consultation"], source: "Japanese classes page", date: "July 9, 2021" },
    { kind: "gap", records: ["funabashi-resident-tax"], gap: "Filing deadline; the page gives FY2025 and FY2026 as the start of online filing." },
    { kind: "gap", records: ["funabashi-household-waste"], gap: "Burnable waste day, time, and bags; bulky waste fees." },
  ],
});
