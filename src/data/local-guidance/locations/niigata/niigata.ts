import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.niigata.lg.jp";

/** Niigata City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-15100", name: "Niigata City", aliases: ["Niigata", "Niigata-shi"] },
  sources: [
    { id: "niigata-address-registration-from-abroad", title: "Moving in from abroad", url: `${base}/kurashi/todokede/kosekinado/jyuminhyo/kokugaitennyuu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "niigata-address-registration-moving-in", title: "Moving into Niigata City", url: `${base}/kurashi/todokede/kosekinado/jyuminhyo/tennyu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "niigata-national-health-insurance-joining", title: "Joining and leaving National Health Insurance", url: `${base}/kurashi/hoken/kokuho/konnatoki/kadatsu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "niigata-household-waste-rules", title: "Sorting and putting out waste and resources (whole city)", url: `${base}/kurashi/gomi/gomishigen/gomidasi/niigata/index.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "niigata-household-waste-bulky", title: "Bulky waste", url: `${base}/kurashi/gomi/gomishigen/gomidasi/niigata/discard.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "niigata-resident-tax-procedures", title: "Individual municipal tax procedures", url: `${base}/kurashi/zei/shinkoku_todokede/kojinshiminzei.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "niigata-disaster-preparation-hazard-maps", title: "Hazard maps", url: `${base}/kurashi/bosai/hinanjo/kouzui_hinanchizu/index.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "niigata-disaster-preparation-foreign-residents", title: "For foreign residents of Niigata City", url: `${base}/shisei/kokusai/gaikokujin/index.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "niigata-language-and-consultation-association", title: "Niigata City International Association", url: `${base}/shisei/kokusai/machidukuri/08_kyoukai.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "niigata-national-pension-system", title: "The National Pension system", url: `${base}/kurashi/hoken/kokuminnenkin/kokumin.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "niigata-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Niigata City",
      summary: "Niigata City takes moving-in notifications within 14 days at the Resident Life Section of the ward office (the Window Service Section in Chuo Ward) or a branch office, on weekdays from 8:30 a.m. to 5:30 p.m.; notifications cannot be made by post or email.",
      applicability: "Residents moving into Niigata City from abroad or from another municipality. Administrative service corners cannot handle address changes.",
      responsibleBody: "Niigata City", receivingOffice: "Resident Life Section of the ward office (Window Service Section in Chuo Ward), or a branch office",
      actions: [
        { title: "Notify within 14 days", description: "File within 14 days of moving in, on weekdays from 8:30 a.m. to 5:30 p.m. (except December 29 to January 3), with the resident change form available at the counter. Check your full new address before filing. Related procedures such as National Health Insurance are handled by other sections and can take extra time." },
        { title: "Bring passports", description: "Moving in from abroad, bring the passport of everyone moving in and the filer's identification; the entry stamp in the passport is used to confirm your arrival date, so if you use an automated gate, ask an immigration officer for a stamp. A representative outside your household needs a letter of authorization." },
      ],
      sourceIds: ["niigata-address-registration-from-abroad", "niigata-address-registration-moving-in"],
      sourceFormatNote: `Niigata City's moving-in pages are in Japanese. ${note}`,
    },
    {
      id: "niigata-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Niigata City",
      summary: "Niigata City asks you to join or leave National Health Insurance within 14 days at the ward office's Resident Life Section (the Window Service Section in Chuo Ward) or a branch office, and to set up premium payment by account transfer at the same time.",
      applicability: "For residents who are not covered by workplace health insurance or public assistance.",
      responsibleBody: "Niigata City", receivingOffice: "Resident Life Section of the ward office (Window Service Section in Chuo Ward), or a branch office",
      actions: [
        { title: "Join within 14 days", description: "Notify within 14 days of moving in (bring the moving-out certificate from your previous municipality), leaving workplace insurance (bring the loss-of-coverage certificate and My Number identification), leaving public assistance, or having a child." },
        { title: "Set up payment", description: "Premiums are paid by account transfer; bring a cash card from a participating bank to register on the spot. If you are leaving workplace insurance, you can instead apply within 20 days of leaving to continue your previous insurance for up to two years." },
      ],
      sourceIds: ["niigata-national-health-insurance-joining"],
      sourceFormatNote: `Niigata City's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "niigata-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Niigata City",
      summary: "Niigata City charges for burnable waste (yellow semitransparent designated bags, three times a week) and non-burnable waste (clear designated bags, once a month), and collects bulky waste by application, put out by 8 a.m. with fee tickets.",
      applicability: "Collection days differ by area; follow your area's waste calendar.",
      responsibleBody: "Niigata City",
      actions: [
        { title: "Use the designated bags", description: "Burnable waste goes in the paid yellow semitransparent designated bags, three times a week (Monday, Wednesday, Friday or Tuesday, Thursday, Saturday). Non-burnable waste goes in the paid clear designated bags once a month. Plastic packaging is collected weekly in clear or semitransparent bags of 90 liters or less. Designated bags and bulky waste tickets are sold at supermarkets, convenience stores, and other shops, and at ward offices and branch offices." },
        { title: "Book bulky waste", description: "Items that do not fit in the designated bags, or items that are hard, flammable, or unfold to a large size, are bulky waste. Apply to the bulky waste reception center online or by chatbot at any time, or by phone Monday to Saturday, 9 a.m. to 5 p.m. (except holidays and December 29 to January 3). Buy fee tickets (100, 200, 300, or 500 yen) and put the items at the agreed place by 8 a.m. on collection day." },
      ],
      sourceIds: ["niigata-household-waste-rules", "niigata-household-waste-bulky"],
      sourceFormatNote: `Niigata City's waste pages are in Japanese. ${note}`,
    },
    {
      id: "niigata-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Niigata City",
      summary: "Niigata City handles the inhabitant tax return, a tax agent declaration, and the notice claiming a tax treaty exemption through its online application system e-NIIGATA and related procedures.",
      applicability: "Use Niigata City's route when you lived in Niigata City on January 1 of the tax year.",
      responsibleBody: "Niigata City",
      actions: [
        { title: "File the return", description: "The inhabitant tax return reports your previous year's income; the city's procedure page links to the filing procedure and to a tool that calculates the tax and prepares the return." },
        { title: "Tax agents and treaty exemptions", description: "Set or change a tax agent (nozei kanrinin) for inhabitant tax through the tax agent declaration or approval application. People who came to Japan from a country with a tax treaty with Japan and qualify for an exemption under it file a notice to be exempted from inhabitant tax." },
      ],
      sourceIds: ["niigata-resident-tax-procedures"],
      sourceFormatNote: `Niigata City's tax page is in Japanese. ${note}`,
    },
    {
      id: "niigata-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Niigata City",
      summary: "Niigata City's comprehensive hazard map combines flood, tsunami, landslide, inland flooding, and reservoir maps for each junior high school district, and a plain-Japanese disaster guidebook is available for foreign residents.",
      applicability: "Check the hazard map for your junior high school district and your nearest shelters ahead of time.",
      responsibleBody: "Niigata City",
      actions: [
        { title: "Check your district's hazard map", description: "The comprehensive hazard map (made in fiscal 2018) covers each junior high school district; you can look up your district from your town name. Separate maps cover the new tsunami inundation areas, river flooding with nearby shelters, inland flooding, and roads likely to flood in sudden heavy rain." },
        { title: "Read the guidebook for foreign residents", description: "The disaster prevention guidebook in plain Japanese explains how to prepare and what to do in an earthquake or other disaster. The city also has an interpretation system for people calling 119 who do not speak Japanese." },
      ],
      sourceIds: ["niigata-disaster-preparation-hazard-maps", "niigata-disaster-preparation-foreign-residents"],
      sourceFormatNote: `Niigata City's disaster pages are in Japanese. ${note}`,
    },
    {
      id: "niigata-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Niigata City",
      summary: "The Niigata City International Association runs a multilingual consultation counter, free legal consultations, and level-based Japanese courses, and the city publishes an orientation leaflet and a living guide for new foreign residents.",
      applicability: "For foreign residents of Niigata City.",
      responsibleBody: "Niigata City", receivingOffice: "Niigata City International Association",
      actions: [
        { title: "Consult the International Association", description: "The association's counter takes consultations about daily worries and problems in several languages and holds free legal consultation sessions. It also runs Japanese courses in classes by level, supports volunteer Japanese classes, and helps children with roots abroad with homework. Privately funded international students living in the city can receive a 5,000 yen subsidy toward National Health Insurance premiums." },
        { title: "Read the orientation materials", description: "The leaflet for starting life in Niigata is in Japanese, English, Chinese, and Vietnamese, and the living guide for foreign residents is in English and plain Japanese. The city website can be shown in several languages through its Language tab." },
      ],
      sourceIds: ["niigata-language-and-consultation-association", "niigata-disaster-preparation-foreign-residents"],
      sourceFormatNote: `Niigata City's pages are in Japanese. ${note}`,
    },
    {
      id: "niigata-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Niigata City",
      summary: "Niigata City states that everyone aged 20 to 59 living in Japan, including foreign residents, joins National Pension; self-employed people, students, and others not covered through work or as a dependent spouse are Category I.",
      applicability: "For residents aged 20 to 59. Designated Activities holders staying for medical care or long-stay tourism cannot join voluntarily after 60.",
      responsibleBody: "Niigata City",
      actions: [
        { title: "Know your category", description: "Category I covers self-employed people, students, and others who are not Category II (members of an employer's employee pension, generally under 65) or Category III (dependent spouses of Category II members). Category I members join through the city; employees join through their workplace." },
        { title: "Voluntary membership", description: "People aged 60 to 64 who have not paid 40 years can join voluntarily to increase their pension, from the month they apply; foreign residents with Designated Activities status for medical stay or long-stay tourism are not eligible." },
      ],
      sourceIds: ["niigata-national-pension-system"],
      sourceFormatNote: `Niigata City's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "old-source", records: ["niigata-language-and-consultation"], source: "International Association page", date: "March 28, 2023" },
    { kind: "old-source", records: ["niigata-disaster-preparation"], source: "Comprehensive hazard map", date: "Made in fiscal 2018" },
    { kind: "gap", records: ["niigata-resident-tax"], gap: "Who must file, the filing period, and counters." },
    { kind: "gap", records: ["niigata-national-pension"], gap: "The counter for joining and the documents." },
    { kind: "gap", records: ["niigata-language-and-consultation"], gap: "Consultation hours and languages (on the association's site)." },
  ],
});
