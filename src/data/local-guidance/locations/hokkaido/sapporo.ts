import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.sapporo.jp";

/** Sapporo City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-01100", name: "Sapporo City", aliases: ["Sapporo", "Sapporo-shi"] },
  sources: [
    { id: "sapporo-address-registration-moving-in", title: "Moving to Sapporo from another municipality", url: `${base}/shimin/koseki/jusho-ido/tennyu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sapporo-address-registration-from-abroad", title: "Moving to Chuo Ward from outside the city, including from abroad", url: `${base}/chuo/oriori/oriori_1-2.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sapporo-national-health-insurance-joining", title: "Notifying National Health Insurance joining", url: `${base}/hoken-iryo/kokuho/todokede-kanyu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sapporo-household-waste-station", title: "Waste put out at garbage stations", url: `${base}/seiso/gomi/wakekata.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sapporo-household-waste-foreign-languages", title: "Waste sorting guide in other languages", url: `${base}/seiso/gomi/gomiwake_guide/foreign.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sapporo-household-waste-bulky", title: "Large waste", url: `${base}/seiso/gomi/oogatagomi.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sapporo-resident-tax-filing", title: "Filing the individual inhabitant tax return", url: `${base}/citytax/shinkoku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sapporo-disaster-preparation-evacuation-places", title: "Evacuation places", url: `${base}/kikikanri/higoro/hinan/hinanbasho.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sapporo-disaster-preparation-hazard-maps", title: "Disaster hazard maps", url: `${base}/kikikanri/higoro/hazardmap/hazardmap_index.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sapporo-language-and-consultation-help-desk", title: "Sapporo Foreign Resident Help Desk", url: `${base}/kokusai/sapporo_help_desk.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sapporo-national-pension-notifications", title: "National Pension notifications", url: `${base}/hoken-iryo/nenkin/todokede.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "sapporo-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Sapporo",
      summary: "Sapporo takes moving-in notifications within 14 days at the Family Register and Resident Section of the ward office for your new address; a new resident record is usually available from the next opening day.",
      applicability: "Mid- to long-term residents and special permanent residents moving to Sapporo from abroad, and residents moving from another municipality.",
      responsibleBody: "Sapporo City", receivingOffice: "Family Register and Resident Section, ward office for your new address (also the Shinoro and Jozankei branch offices)",
      actions: [
        { title: "Notify within 14 days", description: "File within 14 days of starting to live at your new address, at the ward office's Family Register and Resident Section; in Kita Ward the Shinoro branch office and in Minami Ward the Jozankei branch office also accept it. You cannot file before moving. Check your full new address, down to the block and number, before filing." },
        { title: "Bring residence cards and passports", description: "Moving in from abroad, bring the residence card or special permanent resident certificate and the passport of everyone moving in, and the filer's identification; a representative needs a letter of authorization. Moving from another municipality, bring the moving-out certificate from your previous city. If you are joining National Health Insurance, do that after this notification." },
      ],
      sourceIds: ["sapporo-address-registration-moving-in", "sapporo-address-registration-from-abroad"],
      sourceFormatNote: `Sapporo's moving-in pages are in Japanese; the from-abroad details are on Chuo Ward's page and apply city-wide. ${note}`,
    },
    {
      id: "sapporo-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Sapporo",
      summary: "Sapporo asks you to join National Health Insurance at your ward office within 14 days of moving in or leaving workplace insurance; medical costs before a late filing are generally not covered, and premiums start from the month you became eligible.",
      applicability: "For residents not covered by workplace health insurance. Register your address at the ward office first if it changed.",
      responsibleBody: "Sapporo City", receivingOffice: "Insurance and Pension Section, ward office where you live",
      actions: [
        { title: "Join within 14 days", description: "Join within 14 days of the qualifying date, such as the day you moved to Sapporo or the day after leaving a job. If you file late, medical costs up to the day before filing are generally paid in full by you. Bring the filer's identification (such as a residence card or passport) and the My Number of the household head and each person joining; after leaving workplace insurance, also bring a loss-of-coverage certificate. A representative outside the household needs a letter of authorization." },
        { title: "Receive the certificate and pay", description: "The Certificate of Eligibility or Notice of Eligibility Information is usually issued at the counter, or posted in about a week. If you need to see a doctor before it arrives, ask for a benefit certificate usable at medical institutions in Sapporo. Premiums are in principle paid by account transfer, which you can set up at the ward office with a cash card." },
      ],
      sourceIds: ["sapporo-national-health-insurance-joining"],
      sourceFormatNote: `Sapporo's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "sapporo-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Sapporo",
      summary: "Sapporo charges for burnable and non-burnable waste through designated bags, collects waste at garbage stations by 8:30 a.m. on set days, and collects large waste by paid application, with guides in English, Korean, Chinese, and Vietnamese.",
      applicability: "Collection days differ by district; check the collection-day calendar for your address.",
      responsibleBody: "Sapporo City",
      actions: [
        { title: "Use designated bags and put out by 8:30 a.m.", description: "Burnable and non-burnable waste go in paid designated bags; items that do not fit are large waste. Put waste at your own garbage station by 8:30 a.m. on its collection day, never the night before or after collection. Waste that breaks the rules is left with a violation sticker; take it back, sort it correctly, and put it out on the right day. The sorting guide is available in English, Korean, Chinese, and Vietnamese, and Sapporo International Plaza has a basic rules sheet in more languages." },
        { title: "Book large waste", description: "Apply online or by phone to the large waste collection center, which answers from 9 a.m. to 4:30 p.m. including Saturdays and holidays (not Sundays or December 29 to January 3), from two weeks before your ward's collection day. Pay online or buy Sapporo fee stickers at shops with the sign, and put the items at the agreed place by 8:30 a.m. on collection day with your four-digit reception number." },
      ],
      sourceIds: ["sapporo-household-waste-station", "sapporo-household-waste-foreign-languages", "sapporo-household-waste-bulky"],
      sourceFormatNote: `Sapporo's waste pages are in Japanese; its sorting guide has versions in four other languages. ${note}`,
    },
    {
      id: "sapporo-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Sapporo",
      summary: "Sapporo asks residents on January 1 to file an inhabitant tax return unless an exception applies; forms are at the city tax offices' Citizen Tax Sections, and online filing with a My Number Card is available.",
      applicability: "Use Sapporo's route when you lived in Sapporo on January 1 of the tax year.",
      responsibleBody: "Sapporo City", receivingOffice: "Citizen Tax Section, city tax office (shizei jimusho)",
      actions: [
        { title: "Check whether you must file", description: "File if you lived in Sapporo on January 1, unless your previous year's total income was 430,000 yen or less, you filed an income-tax return, your employer reported your salary to the city, or your pension payer reported your pension. People with other income or changed deductions still need to file." },
        { title: "Get the form or file online", description: "Return forms are at each city tax office's Citizen Tax Section or can be downloaded, and the city's tax simulation can prepare the return. Online filing with a My Number Card on a smartphone or computer is available." },
      ],
      sourceIds: ["sapporo-resident-tax-filing"],
      sourceFormatNote: `Sapporo's tax page is in Japanese. ${note}`,
    },
    {
      id: "sapporo-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Sapporo",
      summary: "Sapporo designates emergency evacuation places by type of disaster, main and local evacuation shelters, and temporary gathering places (all city parks), and publishes hazard maps on its map information service and as PDFs.",
      applicability: "Check your ward's list of evacuation places and the hazard maps for your address ahead of time.",
      responsibleBody: "Sapporo City",
      actions: [
        { title: "Know the kinds of evacuation place", description: "Designated emergency evacuation places, such as city schools, ward gymnasiums, and large parks, are set separately for floods, landslides, earthquakes, and large fires. Main evacuation shelters (schools and ward gymnasiums) and local shelters (community halls and high schools) are for staying when you cannot return home. After an earthquake, every city park can serve as a temporary gathering place. Each ward has its own list." },
        { title: "Check the hazard maps", description: "Sapporo's hazard maps are on the Sapporo map information service and as PDFs for earthquakes and flooding; the national Overlapping Hazard Map also shows risks by address. From April 1, 2026, an app reads hazard information aloud for people with visual impairments." },
      ],
      sourceIds: ["sapporo-disaster-preparation-evacuation-places", "sapporo-disaster-preparation-hazard-maps"],
      sourceFormatNote: `Sapporo's disaster pages are in Japanese. ${note}`,
    },
    {
      id: "sapporo-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Sapporo",
      summary: "The Sapporo Foreign Resident Help Desk at Sapporo International Plaza gives information and consultation on daily life, including learning Japanese, with counselors in plain Japanese, English, Chinese, Sinhala, and Vietnamese and phone interpreting for other languages.",
      applicability: "For foreign residents of Sapporo, and also for organizations that employ or support them.",
      responsibleBody: "Sapporo City", receivingOffice: "Sapporo International Plaza, MN Building 3rd floor, Kita 1-jo Nishi 3-chome, Chuo Ward",
      actions: [
        { title: "Use the help desk", description: "The help desk is open Monday, Tuesday, Thursday, and Friday from 9:30 a.m. to 5 p.m. and Wednesday from 9:30 a.m. to 7 p.m., closed on holidays and December 29 to January 3. Vietnamese is available on Wednesday afternoons, and other languages through phone interpreting." },
        { title: "Ask about any daily-life question", description: "Examples include wanting to study Japanese, not understanding a letter from the ward office, childbirth support, nursery school, how to pay taxes, and family worries. Staff help with complex cases and suggest steps you can take yourself." },
      ],
      sourceIds: ["sapporo-language-and-consultation-help-desk"],
      sourceFormatNote: `Sapporo's help desk page is in Japanese. ${note}`,
    },
    {
      id: "sapporo-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Sapporo",
      summary: "Sapporo handles National Pension notifications, such as joining after leaving a job or a spouse's coverage, at the Pension Unit of your ward office; City Hall cannot take them.",
      applicability: "For residents aged 20 to 59 who are not covered through an employer or as a dependent spouse.",
      responsibleBody: "Sapporo City", receivingOffice: "Pension Unit, ward office where you live",
      actions: [
        { title: "Notify your ward office", description: "Notify your ward office's Pension Unit when you leave a job (a dependent spouse must also notify), leave a spouse's coverage, move abroad, or return from abroad, bringing your My Number Card and your pension book or Basic Pension Number notice. Forgetting to notify can mean not receiving a pension. City Hall does not handle these procedures." },
        { title: "Reissue your Basic Pension Number notice", description: "Category I insured persons can have the Basic Pension Number notice reissued at the ward office's Pension Unit, which takes about a month; if you are in a hurry, ask a pension office." },
      ],
      sourceIds: ["sapporo-national-pension-notifications"],
      sourceFormatNote: `Sapporo's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "gap", records: ["sapporo-resident-tax"], gap: "The filing deadline and the leaving-Japan (tax agent) step." },
    { kind: "gap", records: ["sapporo-language-and-consultation"], gap: "Japanese classes (the help desk's own site lists them)." },
  ],
});
