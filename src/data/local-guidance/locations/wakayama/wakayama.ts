import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Wakayama City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-30201", name: "Wakayama City", aliases: ["Wakayama","Wakayama-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "wakayama-move-in", title: "Moving in notification", url: "https://www.city.wakayama.wakayama.jp/1007484/1009289/1010258.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "wakayama-nhi", title: "National Health Insurance enrollment and changes", url: "https://www.city.wakayama.wakayama.jp/kurashi/kokuho_nenkin/1001090/1001516.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "wakayama-waste", title: "Household waste disposal", url: "https://www.city.wakayama.wakayama.jp/kurashi/gomi_kankyo/1001113/1001251/1018293/index.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "wakayama-tax", title: "FY2026 municipal and prefectural tax declaration", url: "https://www.city.wakayama.wakayama.jp/kurashi/zeikin/1001476/1029092.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "wakayama-hazards", title: "Disaster hazard maps", url: "https://www.city.wakayama.wakayama.jp/kurashi/bousai_bouhan_koutsu/1000032/1036426/index.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "wakayama-language", title: "Japanese classes for foreign residents", url: "https://www.city.wakayama.wakayama.jp/kurashi/bunka_sports/1045064/1045081.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "wakayama-foreign-support", title: "For residents: consultation and multilingual information", url: "https://www.city.wakayama.wakayama.jp/site/languages/1006056.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "wakayama-pension", title: "National Pension system and procedures", url: "https://www.city.wakayama.wakayama.jp/kurashi/kokuho_nenkin/1001091/1001538.html", language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "wakayama-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Registering a move to Wakayama City", summary: "Wakayama City accepts move-in notifications at its Citizens Division and seven service centers, but not at branch or liaison offices.",
      applicability: "For people moving to Wakayama City from another municipality or overseas.", responsibleBody: "Wakayama City", receivingOffice: "Citizens Division counter 4 at City Hall or a city service center",
      actions: [
        { title: "File after taking up residence", description: "The city asks for notification within 14 days after moving into the new address and will not accept it before residence begins. Visit City Hall counter 4 or one of the listed service centers; branches and liaison offices do not accept the notification." },
        { title: "Prepare arrival and household records", description: "For an overseas arrival, foreign residents should bring their residence card or Special Permanent Resident Certificate and passport. Bring documents establishing the relationship to the new household head, with Japanese translations for foreign-language records. A person outside the household filing for you needs a letter of authorization." },
      ], sourceIds: ["wakayama-move-in"], sourceFormatNote: "The city procedure is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "wakayama-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Health Insurance procedures in Wakayama City", summary: "The city lists event-specific documents and accepts NHI notifications at City Hall counter 8 or service centers.",
      applicability: "For residents whose health coverage event requires Wakayama City National Health Insurance enrollment or withdrawal.", responsibleBody: "Wakayama City", receivingOffice: "National Health Insurance and Pension Division, City Hall first-floor counter 8, or a city service center",
      actions: [
        { title: "Report the coverage change", description: "The city asks the household head to report NHI changes within 14 days. A household member may submit on the head's behalf; an outside representative needs the head's authorization and their own identification." },
        { title: "Bring the records for your event", description: "For enrollment after workplace coverage ends, bring a health insurance loss certificate, identification, and the My Number documents listed by the city. If moving from another Wakayama Prefecture municipality while already enrolled in NHI, the city also lists the previous municipality's qualification-date certificate. Check the applicable event checklist before visiting." },
      ], sourceIds: ["wakayama-nhi"], sourceFormatNote: "The city procedure is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "wakayama-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Household waste in Wakayama City", summary: "The city provides collection schedules, a sorting search, multilingual sorting guides, and a separate bulky-waste application route.",
      applicability: "For household waste in Wakayama City; collection days and collection points depend on the address.", responsibleBody: "Wakayama City", receivingOffice: "Waste Measures Division or the appropriate Collection Center office",
      actions: [
        { title: "Check the schedule for your address", description: "Use the city's collection schedule and sorting search for your area. The city also links English, Chinese, and Korean sorting guides. Ask your building manager or the Collection Center which collection point serves your home." },
        { title: "Arrange bulky waste separately", description: "The city's waste page links a bulky-waste application route and current instructions for disposal and self-delivery. Check it before discarding large items or batteries, because collection arrangements and accepted items differ." },
      ], sourceIds: ["wakayama-waste", "wakayama-foreign-support"], sourceFormatNote: "The city's waste page is in Japanese; its foreign-resident page links multilingual material. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "wakayama-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Resident-tax declarations in Wakayama City", summary: "The city publishes a tax-year declaration page with City Hall, branch-session, and postal submission details.",
      applicability: "For people whose municipal and prefectural resident-tax declaration is handled by Wakayama City; requirements vary by tax year and income situation.", responsibleBody: "Wakayama City", receivingOffice: "Municipal Tax Division at City Hall; temporary branch sessions where listed",
      actions: [
        { title: "Check whether a city return is needed", description: "The FY2026 page explains that some people need a city and prefectural tax declaration even when they do not need a national income-tax return. Check the current year's instructions and prepare income and deduction documents for the relevant year." },
        { title: "Use the applicable filing channel", description: "The city offers postal submission and describes City Hall and temporary branch-office sessions for FY2026. It says late filing can delay tax notices and income certificates. Confirm the current filing period, branch schedule, and form before submitting." },
      ], sourceIds: ["wakayama-tax"], sourceFormatNote: "The city tax page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "wakayama-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Wakayama City hazard maps", summary: "The city links separate maps for earthquakes, tsunami, floods, landslides, inland flooding, and reservoirs.",
      applicability: "For people living, working, or studying in Wakayama City; relevant hazards and evacuation routes depend on the exact address.", responsibleBody: "Wakayama City", receivingOffice: "Disaster management section; ask the city about map or shelter details for your area",
      actions: [
        { title: "Check each relevant hazard layer", description: "Start from the city hazard-map page and inspect the maps for your home, work, or school address. The city asks households to discuss evacuation sites, routes, contact methods, and actions in advance." },
        { title: "Follow current local alerts", description: "The city's foreign-resident page links multilingual disaster resources and says its official LINE sends disaster information in English, Chinese, Korean, and easy Japanese. Use current municipal alerts to confirm any shelter opening or evacuation instruction." },
      ], sourceIds: ["wakayama-hazards", "wakayama-foreign-support"], sourceFormatNote: "The city hazard-map page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "wakayama-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Japanese classes and foreign-resident support in Wakayama City", summary: "The city offers Japanese classes for foreign residents or workers and multilingual consultation through its International Affairs Division.",
      applicability: "For foreign residents or workers in Wakayama City; class availability and consultation language coverage should be confirmed before visiting.", responsibleBody: "Wakayama City", receivingOffice: "International Affairs Division, City Hall",
      actions: [
        { title: "Apply for a city Japanese class", description: "The city offers two course levels for foreign people living or working in Wakayama City. Apply through its online form or the International Affairs Division; the class page says to bring a residence card to the first lesson and buy the textbook. Check the current class calendar and availability." },
        { title: "Ask for language help", description: "The city's foreign-resident page lists International Affairs Division consultation in English, Chinese, and Korean and links the prefectural international exchange center for additional languages. Contact the provider to confirm current staff and hours." },
      ], sourceIds: ["wakayama-language", "wakayama-foreign-support"], sourceFormatNote: "The city publishes some multilingual information, alongside Japanese details. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "wakayama-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Pension procedures in Wakayama City", summary: "The city lists documents for foreign arrivals, changes after leaving employees' pension, and applications for contribution relief.",
      applicability: "For residents whose National Pension event is handled through the city; confirm whether workplace or dependent coverage changes the route.", responsibleBody: "Wakayama City", receivingOffice: "National Pension desk, National Health Insurance and Pension Division, City Hall",
      actions: [
        { title: "Check the documents for your pension event", description: "The city's pension page lists a passport and residence card when a foreign national moves to Japan. For someone leaving employees' pension or a spouse's dependent coverage, it lists identity and My Number documents, pension number records, and evidence of the coverage change. A representative needs authorization and identification." },
        { title: "Ask about contribution relief", description: "Wakayama City links exemption, payment postponement, and student special-payment procedures. If paying is difficult, contact its pension desk about the applicable application and current documents." },
      ], sourceIds: ["wakayama-pension"], sourceFormatNote: "The city pension page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "tax-year", records: ["wakayama-resident-tax"], statement: "Confirm the current tax year's declaration requirements, filing period, forms, and branch sessions." },
    { kind: "dated", records: ["wakayama-household-waste"], from: "2026-04-01", change: "The city expanded designated battery disposal points.", action: "Recheck current disposal locations, collection schedule, and bulky-waste routes." },
    { kind: "old-source", records: ["wakayama-household-waste"], source: "wakayama-waste", date: "undated" },
    { kind: "old-source", records: ["wakayama-disaster-preparation"], source: "wakayama-hazards", date: "undated" },
    { kind: "dated", records: ["wakayama-language-and-consultation"], from: "2026-05-11", change: "The city class page has a term-specific schedule.", action: "Confirm the current schedule, venue, registration, and available places." },
  ],
});
