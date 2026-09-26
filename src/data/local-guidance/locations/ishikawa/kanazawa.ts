import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Kanazawa City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-17201", name: "Kanazawa City", aliases: ["Kanazawa","Kanazawa-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "kanazawa-address-registration", title: "Address changes and moving into Kanazawa", url: "https://www4.city.kanazawa.lg.jp/kurashi_tetsuzuki/todokede_shomei/jushonohenko_tennyu_tenshutsu_tenkyonado/15339.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "kanazawa-moving-in-checklist", title: "What to do when moving into Kanazawa", url: "https://www4.city.kanazawa.lg.jp/kurashi_tetsuzuki/todokede_shomei/jushonohenko_tennyu_tenshutsu_tenkyonado/4/15334.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "kanazawa-national-health-insurance", title: "National Health Insurance enrollment and changes", url: "https://www4.city.kanazawa.lg.jp/kenko_fukushi/iryo_kenko/kokuminkenkohoken/12380.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "kanazawa-waste-calendars", title: "Neighborhood waste collection calendars", url: "https://www4.city.kanazawa.lg.jp/soshikikarasagasu/gomigenryosuishinka/gyomuannai/1/3/2/7597.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "kanazawa-waste-guide", title: "Household waste sorting guidebooks", url: "https://www4.city.kanazawa.lg.jp/soshikikarasagasu/gomigenryosuishinka/gyomuannai/1/3/3/7603.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "kanazawa-resident-tax", title: "City and prefectural resident-tax declaration", url: "https://www4.city.kanazawa.lg.jp/kurashi_tetsuzuki/zei/kojinshi_kemminzei/15383.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "kanazawa-hazard-maps", title: "2026 flood hazard maps by district", url: "https://www4.city.kanazawa.lg.jp/kurashi_tetsuzuki/anzen_anshin/bosai/2/6/15701.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "kanazawa-foreign-resident-consultation", title: "Consultation information for foreign residents", url: "https://www4.city.kanazawa.lg.jp/soshikikarasagasu/kokusaikoryuka/yokuarushitsumon/2429.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "kanazawa-national-pension", title: "National Pension enrollment procedures", url: "https://www4.city.kanazawa.lg.jp/kenko_fukushi/kokuminnenkin/12391.html", language: "ja", lastCheckedAt: "2026-09-26" },
  ],
  supplements: [
    {
      id: "kanazawa-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Registering an address in Kanazawa City", summary: "Kanazawa City accepts resident-address filings at the Citizens Division and city citizen centers; moving-in notices require an in-person step even when another move-related step is submitted online.",
      applicability: "For people moving into Kanazawa City. Check the linked move-in procedure for your previous address, household, and any foreign-resident documents.", responsibleBody: "Kanazawa City", receivingOffice: "Citizens Division or a city citizen center",
      actions: [
        { title: "Complete the move-in notice at a local counter", description: "Kanazawa City asks residents to file within 14 days of establishing the new address. Its moving-in page links to the detailed procedure and lists the Citizens Division and citizen centers as filing locations. A My Number Card online submission can support a move, but the city says a separate counter procedure is still required to complete a move-in notice." },
        { title: "Check foreign-resident and household documents", description: "The city provides separate guidance for overseas arrivals and for foreign-resident household records. It may require identity or residence documents for each household member and official documents with a Japanese translation to show family relationships. Check the current procedure page or ask the Citizens Division which records apply before visiting." },
      ],
      sourceIds: ["kanazawa-address-registration", "kanazawa-moving-in-checklist"], sourceFormatNote: "Kanazawa City's address-procedure pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "kanazawa-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Health Insurance in Kanazawa City", summary: "Kanazawa City directs move-related filings to the Citizens Division or a city citizen center and other coverage changes to the Insurance and Pension Division or a citizen center.",
      applicability: "Use Kanazawa's procedure only after confirming municipal National Health Insurance is the right coverage for you. The city lists different documents for moving, overseas arrival, and leaving employer coverage.", responsibleBody: "Kanazawa City", receivingOffice: "Citizens Division or a city citizen center for a move into the city; Insurance and Pension Division or city citizen center for other changes",
      actions: [
        { title: "Report a move or arrival with the listed records", description: "Kanazawa City says to report coverage changes within its stated filing period. For a move from another municipality, it lists the prior municipality's transfer certificate and the Citizens Division or citizen center. For foreign residents arriving from abroad, the city lists residence documents and may ask for a passport. Confirm the full checklist for your status before filing." },
        { title: "Check options for other coverage changes", description: "The city lists proof of the date employer coverage ended for enrollment after leaving a job and identifies the Insurance and Pension Division or city citizen centers for those filings. Some enrollment or withdrawal procedures can be submitted electronically through MyNa Portal; check the city's current instructions for eligibility and required records. Contact the city for household-specific premiums or reductions." },
      ],
      sourceIds: ["kanazawa-national-health-insurance"], sourceFormatNote: "Kanazawa City's National Health Insurance page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "kanazawa-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Household waste in Kanazawa City", summary: "Kanazawa City provides a current annual sorting guide and a district calendar lookup that maps individual addresses to the applicable collection area.",
      applicability: "Use the calendar for your exact address and confirm the collection station and local instructions with your building manager or neighborhood contact.", responsibleBody: "Kanazawa City", receivingOffice: "Waste Reduction Promotion Division; building manager or neighborhood contact for the collection point",
      actions: [
        { title: "Look up the current collection area and dates", description: "The city's calendar page provides a fiscal-year calendar and explains how to find the applicable area from a town name, block, and lot number. Kanazawa's school and neighborhood districts do not always use the same boundaries, so follow the waste lookup rather than assuming a school district is the collection area." },
        { title: "Use the current sorting guide for each item", description: "The city publishes a household-waste sorting guide in Japanese and other languages and links to an item-by-item sorting dictionary. It also describes separate arrangements for bulky waste and items the city does not collect. Check current rules before disposal and ask the building manager where the assigned station is." },
      ],
      sourceIds: ["kanazawa-waste-calendars", "kanazawa-waste-guide"], sourceFormatNote: "Kanazawa City's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "kanazawa-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Resident tax in Kanazawa City", summary: "Kanazawa City's page explains the city and prefectural resident-tax declaration, including an electronic filing route introduced for FY2026.",
      applicability: "First identify which municipality is responsible for the relevant tax year based on your address on January 1, then check Kanazawa's current declaration information if it applies.", responsibleBody: "Kanazawa City", receivingOffice: "Citizens Tax Division",
      actions: [
        { title: "Check whether the current year's declaration is required", description: "The city page describes income and deduction situations that may require a city and prefectural tax declaration, including some cases where an income-tax return is not required. It lists electronic filing as available from FY2026 and describes records to prepare. Use the current page or contact the Citizens Tax Division to confirm your own filing requirement and documents." },
        { title: "Use the current year's payment and filing instructions", description: "The relevant municipality and filing steps depend on the tax year and address history. Forms, filing channels, and deadlines may change; follow the current city notice and contact the responsible tax office if you are moving or leaving Japan." },
      ],
      sourceIds: ["kanazawa-resident-tax"], sourceFormatNote: "Kanazawa City's resident-tax page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "kanazawa-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Flood hazard maps in Kanazawa City", summary: "Kanazawa City offers an address-oriented flood-map app and 2026 district maps showing expected flooding, evacuation locations, and guidance for safe action.",
      applicability: "Check the risks and route for your exact home, workplace, school, and other regular destinations. Use current alerts to confirm which evacuation places are open during an event.", responsibleBody: "Kanazawa City", receivingOffice: "River and Flood Control Division; check current city emergency notices for live instructions",
      actions: [
        { title: "Review the 2026 map for your district", description: "Kanazawa's flood-map page links a location-aware app and district maps updated in March 2026. The maps show expected inundation and evacuation information. Use the district guide to identify the correct area and review hazards and routes for the exact address." },
        { title: "Follow current evacuation information", description: "A map is planning information and does not show current warnings or whether a specific site is open. Check current official city alerts and instructions before traveling during an emergency, and confirm the current location with the city if the address-to-district mapping is unclear." },
      ],
      sourceIds: ["kanazawa-hazard-maps"], sourceFormatNote: "Kanazawa City's hazard-map page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "kanazawa-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Consultation support for foreign residents in Kanazawa", summary: "Kanazawa City directs foreign residents with general daily-life questions to the Kanazawa International Exchange Foundation and refers legal consultations to the Ishikawa International Exchange Association.",
      applicability: "Contact the provider directly to confirm languages, eligibility, appointment requirements, fees, and Japanese-class availability before relying on a service.", responsibleBody: "Kanazawa City", receivingOffice: "Kanazawa International Exchange Foundation for general daily-life questions; Ishikawa International Exchange Association for legal consultation referrals",
      actions: [
        { title: "Use the city-listed consultation contacts", description: "Kanazawa City directs general questions about life in Kanazawa to the Kanazawa International Exchange Foundation. It also points residents to the Ishikawa International Exchange Association for legal consultations with a judicial scrivener or lawyer, by appointment. Contact the provider to confirm current availability and the best way to request support." },
        { title: "Check language and learning services with the provider", description: "The city page does not specify current service languages, schedules, eligibility, or Japanese-language class arrangements. Ask the Kanazawa International Exchange Foundation or the relevant class provider directly for current information." },
      ],
      sourceIds: ["kanazawa-foreign-resident-consultation"], sourceFormatNote: "Kanazawa City's consultation page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "kanazawa-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Pension procedures in Kanazawa City", summary: "Kanazawa City handles listed National Pension filings at the Insurance and Pension Division or city citizen centers and offers online applications for several category 1 procedures.",
      applicability: "Your filing route depends on your National Pension category and whether you are covered through employment or a dependent spouse. Confirm whether a local filing is needed for your circumstances.", responsibleBody: "Kanazawa City", receivingOffice: "Insurance and Pension Division, National Pension Section, or a city citizen center",
      actions: [
        { title: "Confirm the local procedure for an overseas arrival or coverage change", description: "Kanazawa's table includes an overseas move-in among the situations requiring a filing and lists a pension number record or My Number Card, identity documentation, and proof of the entry date. The city's general move-in page also prompts residents to handle National Pension registration. Ask the Insurance and Pension Division which procedure applies to your age and category." },
        { title: "Use the online route when it fits your application", description: "The city says MyNa Portal can be used for category 1 enrollment or category changes, selected premium add-on filings, and certain relief or student applications. The city page links Japan Pension Service guidance; check current eligibility and records with the city or the pension service." },
      ],
      sourceIds: ["kanazawa-national-pension", "kanazawa-moving-in-checklist"], sourceFormatNote: "Kanazawa City's pension and move-in pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "old-source", records: ["kanazawa-address-registration"], source: "kanazawa-address-registration", date: "undated" },
    { kind: "old-source", records: ["kanazawa-national-health-insurance"], source: "kanazawa-national-health-insurance", date: "undated" },
    { kind: "dated", records: ["kanazawa-household-waste"], from: "2026-04-01", change: "The waste calendar and sorting materials are published by fiscal year.", action: "Replace with the next fiscal year's calendar and sorting guide and reconfirm the address lookup." },
    { kind: "tax-year", records: ["kanazawa-resident-tax"], statement: "Declaration eligibility, forms, deadlines, and filing channels can change each tax year." },
    { kind: "dated", records: ["kanazawa-disaster-preparation"], from: "2026-03-01", change: "The cited flood maps are identified as the March 2026 edition.", action: "Check for newer district maps and current emergency notices before relying on the map links." },
    { kind: "old-source", records: ["kanazawa-language-and-consultation"], source: "kanazawa-foreign-resident-consultation", date: "undated" },
    { kind: "gap", records: ["kanazawa-language-and-consultation"], gap: "The city FAQ does not list current consultation languages, schedules, or Japanese class arrangements; confirm with the named foundations or class providers." },
    { kind: "old-source", records: ["kanazawa-national-pension"], source: "kanazawa-national-pension", date: "undated" },
  ],
});
