import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.sagamihara.kanagawa.jp";

/** Sagamihara City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-14150", name: "Sagamihara City", aliases: ["Sagamihara", "Sagamihara-shi"] },
  sources: [
    { id: "sagamihara-address-registration-moving-in", title: "Moving-in notification", url: `${base}/kurashi/1026448/tetsuzuki/1026453/1005976.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sagamihara-national-health-insurance-foreign-residents", title: "National Health Insurance for foreign residents (FAQ)", url: `${base}/shisei/1026875/faq/kokuho/1000759.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sagamihara-national-health-insurance-moving-in", title: "National Health Insurance when moving in from another municipality", url: `${base}/kurashi/1026448/kokuho/1026464/shikaku/1007832.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sagamihara-household-waste-schedule", title: "Garbage and resources schedule and rules", url: `${base}/kurashi/1026489/recycle/1026493/katei/1008347.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sagamihara-household-waste-foreign-languages", title: "Garbage and resources schedule and rules in other languages", url: `${base}/kurashi/1026489/recycle/1026493/katei/1016362.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sagamihara-household-waste-bulky", title: "Applying for bulky garbage collection", url: `${base}/kurashi/1026489/recycle/1026493/katei/1008323.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sagamihara-resident-tax-counters", title: "Municipal and prefectural inhabitant tax filing counters", url: `${base}/kurashi/1026448/zeikin/1026477/jyuminzei_kojin/1013124/1015980.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sagamihara-resident-tax-agent", title: "Tax agent declaration", url: `${base}/shinseisho_menu/zei/1011358.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sagamihara-disaster-preparation-evacuation-places", title: "Nearby evacuation places", url: `${base}/kurashi/1026529/bousai/1008686/index.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sagamihara-disaster-preparation-flood-maps", title: "Flood hazard maps", url: `${base}/kurashi/1026529/bousai/1008688/1008692.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sagamihara-language-and-consultation-foreign-residents", title: "Consultation for foreign residents", url: `${base}/kurashi/sodan/1006021.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sagamihara-language-and-consultation-lounge", title: "Sagamihara International Lounge", url: `${base}/kurashi/shisetsu/fire_etc/etc/1003279.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sagamihara-national-pension-joining", title: "Joining National Pension (FAQ)", url: `${base}/shisei/1026875/faq/kokuho/1000843.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "sagamihara-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Sagamihara",
      summary: "Sagamihara takes moving-in notifications within 14 days at ward office Resident Sections and most town development centers and branch offices, on weekdays from 8:30 a.m. to 5 p.m.; ward Resident Sections also open on the second and fourth Saturday mornings.",
      applicability: "Foreign residents moving into Sagamihara from abroad or from another municipality in Japan.",
      responsibleBody: "Sagamihara City", receivingOffice: "Resident Section of a ward office, a town development center (except Hashimoto, Chuo 6 districts, and Ono-minami), or a branch office",
      actions: [
        { title: "Notify within 14 days", description: "File the moving-in notification within 14 days of moving, on weekdays from 8:30 a.m. to 5 p.m.; ward office Resident Sections also open on the second and fourth Saturdays from 8:30 a.m. to noon. If you file after 14 days, the counter will ask the reason for the delay. An online guide shows which procedures, items, and counters apply to you, and can prepare some forms in advance." },
        { title: "Bring your residence card", description: "Foreign residents must bring their residence card or special permanent resident certificate, on which the new address is written, plus identification, the moving-out certificate from your previous municipality if you moved within Japan, and your pension book or Basic Pension Number notice if you are in National Pension. A foreign resident joining a foreign head of household needs original documents proving the family relationship, such as a birth or marriage certificate." },
      ],
      sourceIds: ["sagamihara-address-registration-moving-in"],
      sourceFormatNote: `Sagamihara's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "sagamihara-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Sagamihara",
      summary: "Foreign residents registered in Sagamihara with a period of stay over three months must join National Health Insurance within 14 days of entering Japan or moving in, unless another scheme or an exemption applies; late filing means paying back to that date.",
      applicability: "Not for people whose period of stay has expired, Temporary Visitors, diplomats, certain Designated Activities holders (medical stay or tourism), people with a social security agreement certificate, or people covered by other health insurance or public assistance.",
      responsibleBody: "Sagamihara City", receivingOffice: "Resident Section of a ward office, most town development centers, or a branch office; National Health Insurance and Pension Division at City Hall",
      actions: [
        { title: "Join within 14 days", description: "Join within 14 days of registering after entering Japan, moving in from another municipality, having a child, leaving workplace insurance, or leaving public assistance; coverage is backdated if you file late. Bring your residence card, the household head's My Number document, and the filer's identification. After leaving workplace insurance, also bring a document showing the date coverage ended, such as a loss-of-eligibility certificate or separation notice." },
        { title: "Choose the right counter", description: "Ward office Resident Sections, most town development centers, and branch offices take these procedures, but Chuo Ward Office's Resident Section handles only entering Japan, moving in, and births. The National Health Insurance and Pension Division at City Hall handles only leaving workplace insurance or public assistance, and is the counter for people with a period of stay of three months or less. Sagamihara collects the premium as National Health Insurance tax." },
      ],
      sourceIds: ["sagamihara-national-health-insurance-foreign-residents", "sagamihara-national-health-insurance-moving-in"],
      sourceFormatNote: `Sagamihara's National Health Insurance pages are in Japanese. ${note}`,
    },
    {
      id: "sagamihara-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Sagamihara",
      summary: "Sagamihara publishes its garbage and resources collection schedule and rules as a booklet in Japanese and eight other languages, and collects bulky garbage from your home by paid application, put out by 8:30 a.m. on the day.",
      applicability: "Collection days and rules depend on your area; check the schedule booklet for your address.",
      responsibleBody: "Sagamihara City",
      actions: [
        { title: "Get the schedule booklet", description: "The garbage and resources schedule and rules booklet is available in Japanese and, as downloads, in English, Chinese, Korean, Spanish, Tagalog, Khmer, Thai, and Vietnamese. Printed booklets are at ward offices and town development centers; the English, Chinese, Korean, Spanish, and Tagalog versions are available from the Resource Circulation Promotion Division on the sixth floor of City Hall." },
        { title: "Book bulky garbage", description: "Bulky garbage is collected only by prior paid application online at any time, by phone, or by postcard. The Bulky Garbage Reception Office answers the phone Monday to Friday, 8 a.m. to 6 p.m. (except holidays and December 29 to January 3). Buy a collection sticker at a shop after applying, and put the item at the agreed place by 8:30 a.m. on collection day. In busy periods collection can be more than a month away, and you can choose a date up to two months ahead." },
      ],
      sourceIds: ["sagamihara-household-waste-schedule", "sagamihara-household-waste-foreign-languages", "sagamihara-household-waste-bulky"],
      sourceFormatNote: `Sagamihara's waste pages are in Japanese; the schedule booklet has versions in eight other languages. ${note}`,
    },
    {
      id: "sagamihara-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Sagamihara",
      summary: "Sagamihara asks for resident tax returns by post to City Hall's Citizen Tax Division, with counters at City Hall, the Midori and Minami tax offices, and some town development centers, and requires a tax agent within 10 days of deciding to go abroad.",
      applicability: "Use Sagamihara's route when you lived in Sagamihara on January 1 of the tax year.",
      responsibleBody: "Sagamihara City", receivingOffice: "Citizen Tax Division, Sagamihara City Hall (Second Annex, 1st floor)",
      actions: [
        { title: "File by post if you need to", description: "If you need to file a municipal and prefectural inhabitant tax return, the city asks you to send it by post to the Citizen Tax Division at City Hall; an online tool can calculate the tax and prepare the form. Counters at City Hall, the Midori and Minami city tax offices, and the Shiroyama and Tsukui town development centers accept returns on weekdays from 8:30 a.m. to 5 p.m." },
        { title: "Name a tax agent before going abroad", description: "If you will not be able to receive tax notices or pay while abroad, submit a tax agent (nozei kanrinin) declaration naming someone to do this for you, within 10 days of your departure being decided. The same form is used to change or end the arrangement, and My Number and identity are checked when it is received." },
      ],
      sourceIds: ["sagamihara-resident-tax-counters", "sagamihara-resident-tax-agent"],
      sourceFormatNote: `Sagamihara's tax pages are in Japanese. ${note}`,
    },
    {
      id: "sagamihara-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Sagamihara",
      summary: "Sagamihara distinguishes emergency evacuation places for immediate danger (temporary, wide-area, and storm and flood) from evacuation shelters for people who cannot return home, and publishes flood hazard maps for the Sagami, Sakai, and other rivers.",
      applicability: "Check the hazard maps and your nearest evacuation places ahead of time; during an event, follow the city's evacuation information.",
      responsibleBody: "Sagamihara City",
      actions: [
        { title: "Know where to go", description: "Temporary evacuation places, chosen by neighborhood associations and households, are for watching the situation after an earthquake; wide-area evacuation places protect you from spreading fires; storm and flood evacuation places are for heavy rain and typhoons. Evacuation shelters are for people whose homes are unlivable. Emergency places bring no supplies, so take food and daily items. The Sagamihara disaster map and the disaster guidebook list them." },
        { title: "Check the flood hazard map", description: "The flood hazard maps show how far and how deep flooding could reach if the Sagami, Sakai, Hato, Doho, Kushi, or Doshi rivers overflow, with emergency evacuation places. Kanagawa Prefecture found an error overstating the Sagami River house-collapse zone, and the city plans to correct that part of its map; other information is unaffected." },
      ],
      sourceIds: ["sagamihara-disaster-preparation-evacuation-places", "sagamihara-disaster-preparation-flood-maps"],
      sourceFormatNote: `Sagamihara's disaster pages are in Japanese. ${note}`,
    },
    {
      id: "sagamihara-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Sagamihara",
      summary: "Sagamihara offers free, confidential consultation for foreign residents at ward office Citizen Consultation Rooms: in-person or phone consultation in a set language each weekday at Chuo Ward Office, and phone interpreting or translation devices at all three ward offices.",
      applicability: "For foreign residents, including people who do not live in Sagamihara. No reservation is needed for general consultation.",
      responsibleBody: "Sagamihara City", receivingOffice: "Citizen Consultation Room, Chuo, Midori, or Minami Ward Office",
      actions: [
        { title: "Use the ward office consultation", description: "At Chuo Ward Office, consult in your language in person or by phone from 9 a.m. to noon and 1 to 4 p.m.: English on Monday, Filipino on Tuesday, Chinese on Wednesday, Vietnamese on Thursday, and Spanish and Portuguese on Friday. At all three ward offices, consultation with phone interpreting (English, Filipino, Chinese, Vietnamese, Spanish) or translation devices runs weekdays 9 a.m. to noon and 1 to 5 p.m. Free legal consultation with a lawyer needs a phone booking at least three days ahead." },
        { title: "Visit the International Lounge", description: "The Sagamihara International Lounge, three minutes' walk from JR Fuchinobe Station, supports foreign residents and provides information in several languages. It opens 9 a.m. to 8 p.m. (to 5 p.m. on Thursdays and Saturdays), closed Sundays, holidays, and December 29 to January 3." },
      ],
      sourceIds: ["sagamihara-language-and-consultation-foreign-residents", "sagamihara-language-and-consultation-lounge"],
      sourceFormatNote: `Sagamihara's consultation pages are in Japanese with language names shown in each language. ${note}`,
    },
    {
      id: "sagamihara-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Sagamihara",
      summary: "In Sagamihara, residents aged 20 to 59 who are not covered through an employer or as a dependent spouse join National Pension within 14 days at City Hall's National Health Insurance and Pension Division, the Midori or Minami ward Resident Section, or most town development centers and branch offices.",
      applicability: "For residents aged 20 to 59, including foreign residents, who are not in employee pension coverage or dependent-spouse coverage.",
      responsibleBody: "Sagamihara City", receivingOffice: "National Health Insurance and Pension Division (City Hall), Midori or Minami Ward Office Resident Section, or a town development center or branch office",
      actions: [
        { title: "Join within 14 days", description: "Submit the National Pension change notification (forms are at the counter) on weekdays from 8:30 a.m. to 5 p.m., with My Number and identification, something showing your Basic Pension Number, and your residence card. After leaving a job, also bring a document showing the date you left, such as a loss-of-coverage certificate or separation notice; if you cannot, bring the company's name and phone number so staff can confirm it." },
        { title: "File online or set up payment", description: "Joining after leaving employee pension coverage or a spouse's coverage can also be filed online through Mynaportal. To pay by account transfer, bring your bankbook and bank seal; to pay by credit card, bring the card." },
      ],
      sourceIds: ["sagamihara-national-pension-joining"],
      sourceFormatNote: `Sagamihara's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "dated", from: "2027-01-01", records: ["sagamihara-household-waste"], change: "Sagamihara revises its waste handling fees from January 2027; the record does not quote fees.", action: "Confirm the bulky garbage page and booklet reflect the new fees." },
    { kind: "dated", from: "2026-12-01", records: ["sagamihara-disaster-preparation"], change: "The city plans to correct the Sagami River house-collapse zone on its flood hazard map after the prefecture's fix.", action: "Remove the correction note once the map is updated." },
    { kind: "gap", records: ["sagamihara-household-waste"], gap: "The general garbage deadline and bags (in the booklet PDF, not on the web pages)." },
    { kind: "gap", records: ["sagamihara-resident-tax"], gap: "The filing deadline (on the filing-period page)." },
    { kind: "gap", records: ["sagamihara-language-and-consultation"], gap: "Japanese classes." },
  ],
});
