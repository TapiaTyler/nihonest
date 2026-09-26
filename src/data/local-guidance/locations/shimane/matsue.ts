import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Matsue City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-32201", name: "Matsue City", aliases: ["Matsue","Matsue-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "matsue-address-registration", title: "Moving into Matsue City", url: "https://www.city.matsue.lg.jp/kurashi_tetsuzuki/koseki_juminhyo_inkantoroku_mn/5/6888.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "matsue-overseas-address-registration", title: "Moving into Matsue City from overseas", url: "https://www.city.matsue.lg.jp/soshikikarasagasu/shimimbu_shiminka/koseki_juminhyo_inkantoroku/5/3032.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "matsue-national-health-insurance", title: "National Health Insurance filings", url: "https://www.city.matsue.lg.jp/soshikikarasagasu/kenkofukushibu_hokennenkinka/kokuho_kokuminnenkin/1/join_secede/2245.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "matsue-national-health-insurance-postal", title: "National Health Insurance filings by post", url: "https://www.city.matsue.lg.jp/kenko_fukushi/kokuho_kokuminnenkin/kokuminkenkohoken/join_secede/7742.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "matsue-household-waste", title: "Household waste sorting and disposal guide", url: "https://www.city.matsue.lg.jp/soshikikarasagasu/kankyoenergybu_recycletoshisuishinka/5/2/2890.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "matsue-waste-calendars", title: "FY2026 household waste calendars", url: "https://www.city.matsue.lg.jp/soshikikarasagasu/kankyoenergybu_recycletoshisuishinka/5/R8nitteihyou/index.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "matsue-resident-tax", title: "Resident tax filing and payment", url: "https://www.city.matsue.lg.jp/kurashi_tetsuzuki/zeikin/7/6931.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "matsue-hazard-maps", title: "Matsue City hazard maps", url: "https://www.city.matsue.lg.jp/kurashi_tetsuzuki/anzen_anshin/9/hazard_Map/index.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "matsue-multicultural-support", title: "Multicultural information and Japanese classes", url: "https://www.city.matsue.lg.jp/gyoseijoho/kokusaikoryu/5/9975.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "matsue-national-pension", title: "National Pension procedures", url: "https://www.city.matsue.lg.jp/dekigotokarasagasu/kekkon_rikon/11500.html", language: "ja", lastCheckedAt: "2026-09-26" },
  ],
  supplements: [
    {
      id: "matsue-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Registering an address in Matsue City", summary: "Matsue City accepts move-in notices at the main Citizens Division and branch citizen-life sections. Overseas moves have a separate document checklist, and some pre-filing steps are available online.",
      applicability: "For people moving into Matsue City. Confirm the correct counter and documents for your previous address and household before visiting.", responsibleBody: "Matsue City", receivingOffice: "Citizens Division filing counter at city hall or a branch Citizens' Life Section; ask the city which branch handles your address and case",
      actions: [
        { title: "File at the city counter for your move", description: "For a move from another Japanese municipality, Matsue City says to file within 14 days after moving. The main Citizens Division and branch citizen-life sections accept filings. A person in the same household may file; another representative needs a power of attorney. The city offers online pre-entry to check required procedures and belongings, with a QR code for the main city counter; it does not replace the in-person notice." },
        { title: "Use the overseas-move checklist when arriving from abroad", description: "For an overseas return with a planned stay of at least one year, the city asks for a notice within 14 days and lists passports for everyone moving, and family-register and residence-history records unless the registered domicile is Matsue. A foreign resident making a first move-in should bring a residence card or special permanent resident certificate; the city may accept a passport if the card will be issued later. Foreign household relationships may require a marriage or birth record with a Japanese translation. Confirm the details with the receiving counter." },
      ],
      sourceIds: ["matsue-address-registration", "matsue-overseas-address-registration"], sourceFormatNote: "Matsue City's procedure pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "matsue-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Health Insurance in Matsue City", summary: "Matsue City requires in-person procedures for moves from another municipality and overseas arrivals; some other coverage changes can be handled by post or online.",
      applicability: "Use this city procedure after confirming municipal National Health Insurance is the right coverage for you. The required records and filing channel depend on why your coverage is changing.", responsibleBody: "Matsue City", receivingOffice: "Insurance and Pension Division, National Health Insurance and Pension Section; confirm the local counter for your address",
      actions: [
        { title: "Bring the records for your enrollment reason", description: "The city lists identity documents and My Number information for the household. A move from another municipality requires in-person filing and proof of prior-year income. For a foreign resident arriving with an expected stay exceeding three months, the city lists a residence card and passport and requires in-person filing. Someone filing for a separate household needs authorization; confirm the checklist for your case with the city." },
        { title: "Check whether another filing route is available", description: "Matsue allows some enrollment or withdrawal filings by post or electronic application, including some cases of leaving employer coverage. Moves from another municipality and entry from overseas require a visit. The city page describes how late enrollment filings can affect premiums; ask the office about your household's amount or any relief rather than relying on general estimates." },
      ],
      sourceIds: ["matsue-national-health-insurance", "matsue-national-health-insurance-postal"], sourceFormatNote: "Matsue City's National Health Insurance pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "matsue-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Household waste in Matsue City", summary: "Matsue City publishes sorting instructions and collection calendars by neighborhood; use the current calendar and ask your building manager which collection point serves your home.",
      applicability: "Collection dates and local arrangements depend on your town or neighborhood. Check the current city pages for your address and confirm the building's collection point.", responsibleBody: "Matsue City", receivingOffice: "Recycling City Promotion Division; building manager or neighborhood contact for the collection point",
      actions: [
        { title: "Check sorting rules and your neighborhood calendar", description: "Use Matsue City's waste guidebook to identify how to sort ordinary household items and items handled through separate recycling routes. The city posts collection calendars by town name for each fiscal year, and also links to item search and a regional collection-day search. Verify your own address on the current calendar; schedules are not the same throughout the city." },
        { title: "Confirm local collection arrangements and excluded items", description: "Ask your building manager or neighborhood contact where to put waste and whether the building has additional sorting instructions. The city guidebook has separate sections for bulky waste, items it does not collect, and self-delivery or other disposal routes. Check those current instructions before disposing of large items or appliances." },
      ],
      sourceIds: ["matsue-household-waste", "matsue-waste-calendars"], sourceFormatNote: "Matsue City's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "matsue-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Resident tax in Matsue City", summary: "Matsue City's page explains resident-tax declarations and payment routes; which municipality is responsible and the applicable instructions depend on the tax year and address history.",
      applicability: "First identify the municipality responsible for the relevant tax year, then check Matsue City's current filing information if it applies to you.", responsibleBody: "Matsue City", receivingOffice: "Citizens Tax Division; confirm the current filing venue with the annual city notice",
      actions: [
        { title: "Check whether a declaration is needed and how to file", description: "The city page describes individual resident-tax filing and lists postal, in-person, and electronic declaration routes. The page explains documents such as income records and identity materials, but current forms, eligibility, venue, and schedule can change each year. Use the current annual instructions or contact the Citizens Tax Division before filing." },
        { title: "Confirm the responsible municipality and current payment details", description: "Resident-tax responsibility depends on the applicable year's rules and your address history; check the national guide and contact the responsible municipality if you moved or plan to leave Japan. Matsue's page distinguishes ordinary collection from withholding through salary or pension and provides annual payment details. Follow the current notice for your own due dates and payment options." },
      ],
      sourceIds: ["matsue-resident-tax"], sourceFormatNote: "Matsue City's resident-tax page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "matsue-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Hazard maps and disaster preparation in Matsue City", summary: "Matsue City links neighborhood hazard maps for flooding, landslides, and tsunami, along with map tools for checking a particular location.",
      applicability: "Check the risks for your home, work, school, and usual routes. Use current alerts and instructions during an emergency because maps do not show which evacuation locations are open at that time.", responsibleBody: "Matsue City", receivingOffice: "Disaster Risk Management Division; use current city emergency notices for event instructions",
      actions: [
        { title: "Review maps for your address and likely hazards", description: "The city provides hazard maps by public-hall district for flooding, landslides, and tsunami, as well as district and citywide tsunami maps. It links to a prefectural GIS for checking a selected point and to a flood simulation tool. Look up the exact location and confirm the route and relevant hazards for your household." },
        { title: "Follow current emergency information", description: "A planning map cannot confirm current danger or which evacuation location is accepting people. Check current city and official emergency alerts, and follow instructions from authorities during an event. Ask the city where to find current evacuation information for your neighborhood." },
      ],
      sourceIds: ["matsue-hazard-maps"], sourceFormatNote: "Matsue City's hazard-map page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "matsue-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Language and community support in Matsue City", summary: "Matsue City publishes a multilingual life guide and links to Japanese classes run by local organizations.",
      applicability: "Check the linked provider's current languages, eligibility, fees, and schedule before relying on a service or attending a class.", responsibleBody: "Matsue City", receivingOffice: "International Tourism Division; class providers set their own locations and schedules",
      actions: [
        { title: "Use the city's foreign-resident life guide", description: "Matsue City links a life guide for foreign residents in easy Japanese, English, Chinese, Korean, and Vietnamese. Use the current city page to open the available version and follow its links for local and prefectural support information." },
        { title: "Contact Japanese-class providers for current details", description: "The city says three organizations currently hold Japanese-language classes and links to a Japanese list and an English spreadsheet. Contact the organization directly to confirm current dates, locations, eligibility, costs, and enrollment arrangements." },
      ],
      sourceIds: ["matsue-multicultural-support"], sourceFormatNote: "Matsue City's multicultural information page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "matsue-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Pension procedures in Matsue City", summary: "Matsue City accepts National Pension category 1 filings at city hall and branch offices and offers online applications for some procedures.",
      applicability: "Your route depends on your pension category and whether you are covered through employment or a dependent spouse. Confirm whether a municipal filing applies to your circumstances.", responsibleBody: "Matsue City", receivingOffice: "Insurance and Pension Division, National Pension Section, at city hall or a branch office",
      actions: [
        { title: "Check whether to file with the city", description: "Matsue City accepts category 1 National Pension notices at city hall or a branch. It notes that many address changes do not require a separate notice when My Number and pension-number records are linked, while some people, including certain short-term foreign residents, may need to notify the new municipality. Ask the pension section or Japan Pension Service to confirm your record and category." },
        { title: "Bring the records for your specific pension procedure", description: "For listed category 1 filings, the city asks for a My Number Card or pension book/basic pension number notice, except for a first-time entrant to the pension system. The city also links to online applications through MyNa Portal. Records vary for changes such as leaving employee coverage, so check with the city or Japan Pension Service before applying." },
      ],
      sourceIds: ["matsue-national-pension"], sourceFormatNote: "Matsue City's National Pension page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "old-source", records: ["matsue-address-registration"], source: "matsue-overseas-address-registration", date: "2024-10-01" },
    { kind: "dated", records: ["matsue-household-waste"], from: "2026-04-01", change: "The collection calendar is issued for each fiscal year and identifies dates by neighborhood.", action: "Replace the FY2026 calendar reference with the next fiscal year's listing and confirm each address-specific selection route." },
    { kind: "tax-year", records: ["matsue-resident-tax"], statement: "Annual declaration methods, forms, venues, dates, payment instructions, and filing channels may change by tax year." },
    { kind: "old-source", records: ["matsue-disaster-preparation"], source: "matsue-hazard-maps", date: "undated" },
    { kind: "gap", records: ["matsue-disaster-preparation"], gap: "The city map page does not give live alert or currently open evacuation-site status; check current official notices for the address during an event." },
    { kind: "gap", records: ["matsue-language-and-consultation"], gap: "The city links class lists and life guides but does not state current class schedules, eligibility, fees, or each provider's service languages; confirm with providers." },
    { kind: "old-source", records: ["matsue-national-pension"], source: "matsue-national-pension", date: "2023-12-01" },
  ],
});
