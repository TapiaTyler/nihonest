import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Gifu City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-21201", name: "Gifu City", aliases: ["Gifu","Gifu-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "gifu-overseas-move", title: "Overseas move-in notification", url: "https://www.city.gifu.lg.jp/kurashi/koseki/1001749/1001755.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "gifu-nhi-retirement", title: "NHI enrollment after leaving workplace insurance", url: "https://www.city.gifu.lg.jp/kurashi/kokuminnenkin/1001829/1001844/1001854.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "gifu-nhi-online", title: "Online NHI applications", url: "https://www.city.gifu.lg.jp/kurashi/kokuminnenkin/1036070/1035964.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "gifu-waste-rules", title: "FY2026 waste sorting and collection guide", url: "https://www.city.gifu.lg.jp/kurashi/gomi/1012143/1038453/index.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "gifu-bulky-waste", title: "Bulky waste procedures", url: "https://www.city.gifu.lg.jp/kurashi/gomi/1012143/1031420/1031426/index.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "gifu-tax", title: "Municipal and prefectural resident-tax declaration", url: "https://www.city.gifu.lg.jp/kurashi/zeikin/1002170/1002186/1002187.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "gifu-flood-map", title: "Flood hazard maps", url: "https://www.city.gifu.lg.jp/kurashi/bousai/1001359/1001360.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "gifu-japanese-lessons", title: "Learning Japanese", url: "https://www.city.gifu.lg.jp/foreign/eng/2000160.html", language: "en", lastCheckedAt: "2026-09-25" },
    { id: "gifu-foreign-consultation", title: "Foreign resident consultation", url: "https://www.city.gifu.lg.jp/foreign/eng/2000163.html", language: "en", lastCheckedAt: "2026-09-25" },
    { id: "gifu-pension-retirement", title: "National Pension enrollment after retirement", url: "https://www.city.gifu.lg.jp/kurashi/kokuminnenkin/1001888/1001906/1001909.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "gifu-pension-relief", title: "National Pension exemption and postponement", url: "https://www.city.gifu.lg.jp/kurashi/kokuminnenkin/1001888/1001891/1001893.html", language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "gifu-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Registering an overseas move to Gifu City", summary: "Gifu City accepts overseas move-in notices at City Hall Citizens Division and seven district offices.",
      applicability: "For people moving to Gifu City from overseas; household details can change the records required.", responsibleBody: "Gifu City", receivingOffice: "Citizens Division, City Hall first floor, or a listed district office",
      actions: [
        { title: "File after establishing your city address", description: "The city asks for the overseas move-in notice within 14 days after starting residence in Gifu City. Its page lists the City Hall Citizens Division and seven district offices. A temporary visit where the main residence remains overseas does not qualify for this filing." },
        { title: "Bring travel and family records", description: "Foreign residents should bring passports showing the arrival date and residence cards or equivalent documents. The city also asks for an official document showing the relationship to the household head, with a Japanese translation bearing the translator's address, signature, and seal. An outside representative needs authorization." },
      ], sourceIds: ["gifu-overseas-move"], sourceFormatNote: "The city procedure is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "gifu-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Health Insurance changes in Gifu City", summary: "The city accepts specified NHI changes online, at city counters, and by post, with documents depending on the event.",
      applicability: "For people whose health-coverage event requires Gifu City NHI enrollment or withdrawal; eligibility depends on personal circumstances.", responsibleBody: "Gifu City", receivingOffice: "National Health Insurance and Pension Division, City Hall second floor, or a listed district office",
      actions: [
        { title: "Report a workplace-coverage change", description: "For enrollment after leaving workplace health insurance, the city asks for notice within 14 days after retirement and lists a coverage-loss certificate, identification, and authorization for an outside agent. NHI enrollment and pension category changes are separate procedures." },
        { title: "Choose an available filing route", description: "The city lists online, in-person, and postal routes for this enrollment event. Its online application index also lists NHI withdrawal. Check the event-specific instructions and current identity-document requirements before using a route." },
      ], sourceIds: ["gifu-nhi-retirement", "gifu-nhi-online"], sourceFormatNote: "The city procedure is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "gifu-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Household waste in Gifu City", summary: "Gifu City publishes a year-specific sorting guide and address-based collection list; bulky waste requires a separate advance reservation.",
      applicability: "For household waste in Gifu City; collection days and the correct station depend on the address.", responsibleBody: "Gifu City", receivingOffice: "City waste services or the Bulky Waste Reception Center",
      actions: [
        { title: "Use the current sorting guide for your address", description: "The FY2026 guide index links categories for ordinary waste, recyclable items, batteries, and an address-by-address collection-day list. Confirm your station and collection day with the current guide or building manager." },
        { title: "Book bulky-waste handling", description: "The city says to reserve bulky-waste home collection through its reception center. It also offers advance booking for self-delivery, including an online route. Follow the current city instructions for tickets or bags and check which items are accepted." },
      ], sourceIds: ["gifu-waste-rules", "gifu-bulky-waste"], sourceFormatNote: "The city waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "gifu-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Resident-tax declaration in Gifu City", summary: "The city accepts municipal and prefectural resident-tax declarations at its Municipal Tax Division or by post.",
      applicability: "For people whose municipal and prefectural resident-tax declaration is handled by Gifu City; filing duties depend on the tax year and income records.", responsibleBody: "Gifu City", receivingOffice: "Municipal Tax Division, City Hall third floor, or postal submission to its individual-tax section",
      actions: [
        { title: "Review the current year's filing requirement", description: "The city explains who may need to submit its declaration and lists examples where a separate city declaration is unnecessary, such as certain national income-tax filers. Its page provides current-year forms and document requirements. Check your own tax year and income situation." },
        { title: "Submit to the Municipal Tax Division", description: "The city accepts the declaration at its counter or by post and lists identity, My Number, income, and deduction records. An agent outside the household needs authorization. Check the current year's form and deadline before filing." },
      ], sourceIds: ["gifu-tax"], sourceFormatNote: "The city tax page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "gifu-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Flood preparation in Gifu City", summary: "The city provides river-specific flood maps with estimated inundation and evacuation information.",
      applicability: "For people living, working, or studying in Gifu City; the relevant river map and safe evacuation choice depend on the address and current event.", responsibleBody: "Gifu City", receivingOffice: "City disaster management office; check maps for the relevant river and district",
      actions: [
        { title: "Find the maps for your river and district", description: "The city links flood hazard maps for Nagara, Kiso, and other rivers and names the districts covered by each map. Review the predicted water depth and building-collapse risk for your home, work, and school." },
        { title: "Use current instructions in an event", description: "The city warns that shelter information shown on printed maps reflects the time the map was made. Check current city evacuation instructions and shelter opening before traveling, and plan a route suited to the actual hazard." },
      ], sourceIds: ["gifu-flood-map"], sourceFormatNote: "The city flood-map page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "gifu-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Japanese classes and consultation in Gifu City", summary: "The city lists International Exchange Association Japanese classes and multilingual consultation with interpretation at City Hall counters.",
      applicability: "For foreign residents in Gifu City; availability, term dates, fees, and staffed languages may change.", responsibleBody: "Gifu City", receivingOffice: "Gifu City International Exchange Association, Multicultural Plaza at Minna no Mori Gifu Media Cosmos",
      actions: [
        { title: "Ask the association about classes", description: "The city's English page lists basic Japanese classes from a professional teacher and other volunteer options. Ask the association for the current term, level, fee, place, and registration route before enrolling." },
        { title: "Use the consultation desk", description: "The city says the association provides multilingual consultations about daily life and municipal procedures and can interpret at City Hall service windows. Its page lists English, Chinese, Tagalog, Portuguese, Vietnamese, and Nepali availability; confirm the current schedule before visiting." },
      ], sourceIds: ["gifu-japanese-lessons", "gifu-foreign-consultation"],
    },
    {
      id: "gifu-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Pension changes in Gifu City", summary: "The city lists National Pension enrollment after retirement at City Hall, district offices, or the Gifu North Pension Office and describes contribution relief.",
      applicability: "For residents whose pension category changes after retirement or another event; employer and dependent routes can differ.", responsibleBody: "Gifu City", receivingOffice: "National Health Insurance and Pension Division pension counter, City Hall first floor, a listed district office, or Gifu North Pension Office",
      actions: [
        { title: "Report a pension category change", description: "The city asks people leaving workplace pension coverage to file within 14 days of retirement and lists pension number records, identity documents, and evidence of the retirement date. If joining a spouse's workplace-dependent coverage, ask the spouse's employer about that route." },
        { title: "Ask about contribution relief", description: "The city describes exemption and payment-postponement applications, with unemployment-related evidence where relevant. Ask the pension desk which application and documents fit your situation; the Japan Pension Service decides applications." },
      ], sourceIds: ["gifu-pension-retirement", "gifu-pension-relief"], sourceFormatNote: "The city pension pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "tax-year", records: ["gifu-resident-tax"], statement: "Confirm the applicable year's filing obligation, form, deadline, and submission methods." },
    { kind: "dated", records: ["gifu-household-waste"], from: "2026-04-01", change: "The city published its FY2026 waste guide and address-based collection list.", action: "Confirm the current guide, collection day, and bulky-waste reservations." },
    { kind: "old-source", records: ["gifu-household-waste"], source: "gifu-waste-rules", date: "undated" },
    { kind: "old-source", records: ["gifu-household-waste"], source: "gifu-bulky-waste", date: "undated" },
    { kind: "gap", records: ["gifu-disaster-preparation"], gap: "Printed flood maps cannot confirm current shelter opening or exact-site suitability; use live city alerts." },
    { kind: "dated", records: ["gifu-language-and-consultation"], from: "2026-04-01", change: "The city class page lists term-specific lessons and fees.", action: "Confirm the current classes, fees, available places, and consultation staffing with the association." },
    { kind: "dated", records: ["gifu-national-pension"], from: "2026-09-24", change: "The city updated its contribution-exemption and postponement page.", action: "Recheck the applicable fiscal-year relief rules and documents." },
  ],
});
