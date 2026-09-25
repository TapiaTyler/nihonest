import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Kasugai City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-23206", name: "Kasugai City", aliases: ["Kasugai","Kasugai-shi"], planGroup: "major-city" },
  sources: [
    { id: "kasugai-moving", title: "Moving-in and resident-registration procedures", url: "https://www.city.kasugai.lg.jp/kurashi/todoke/1001889/jumin/index.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kasugai-nhi", title: "National Health Insurance joining procedure", url: "https://www.city.kasugai.lg.jp/kurashi/zei/kokuho/1036321.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kasugai-waste-calendar", title: "Resource and waste collection calendars", url: "https://www.city.kasugai.lg.jp/kurashi/1032702/1032853/1033276/index.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kasugai-bulky-waste", title: "Bulky waste collection and rule changes", url: "https://www.city.kasugai.lg.jp/kurashi/1032702/1032853/1033052.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kasugai-tax", title: "Municipal and prefectural resident-tax declaration", url: "https://www.city.kasugai.lg.jp/kurashi/1027725/shinsei/shinsei/zeikin/1009649.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kasugai-hazard", title: "Flood hazard maps", url: "https://www.city.kasugai.lg.jp/shisei/machi/haisui/hazardmap/index.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kasugai-map-hub", title: "City map hub including earthquake and flood maps", url: "https://www.city.kasugai.lg.jp/shisei/chizujouhou/index.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kasugai-foreign-consultation", title: "Foreign resident consultation", url: "https://www.city.kasugai.lg.jp/kurashi/1033189/sodan/gaikokusodan.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kasugai-japanese-classes", title: "Kasugai Fureai Japanese classes", url: "https://www.city.kasugai.lg.jp/shisei/sankaku/kaigaiyuukoutoshi/1009611.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kasugai-pension", title: "National Pension enrollment after retirement", url: "https://www.city.kasugai.lg.jp/faq/1000411/1000419/1000951.html", language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "kasugai-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Registering an address in Kasugai", summary: "Kasugai accepts moving-in notices after arrival and gives separate document instructions for foreign residents arriving from abroad.",
      applicability: "For an address in Kasugai; foreign residents should use the City Hall Family Register and Residents Division because branch offices cannot handle every procedure.",
      responsibleBody: "Kasugai City", receivingOffice: "Family Register and Residents Division, City Hall first floor; some domestic moves can use listed branch offices",
      actions: [
        { title: "File after taking up residence", description: "File within 14 days after moving in. For a move from another Japanese municipality, bring its moving-out certificate or the My Number Card used for card-based moving, plus identity documents. A person outside the moving household needs an authorization form." },
        { title: "Bring the overseas-arrival records", description: "Foreign residents bring each moving person's residence card or special permanent resident certificate. If a card will be issued later, bring the passport marked for later issuance. The city also asks for proof of relationship to the household head for a move directly from abroad, unless the city already holds the specified Japanese household record. The city says overseas arrivals cannot use its Sunday counter." },
      ], sourceIds: ["kasugai-moving"], sourceFormatNote: "Kasugai's moving page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "kasugai-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Health Insurance in Kasugai", summary: "Kasugai lists joining documents by cause and accepts notices at its insurance division and designated local counters.",
      applicability: "For residents whose coverage route is Kasugai's municipal National Health Insurance; confirm current eligibility with the division, especially for residence-status cases.",
      responsibleBody: "Kasugai City", receivingOffice: "Insurance, Medical and Pension Division at City Hall or the listed Fureai centers, branch office, and East Civic Center",
      actions: [
        { title: "Prepare proof for your change", description: "The city asks for a joining notice within 14 days of the qualifying event. For a move from another municipality, bring a photo ID and moving-out certificate; after leaving workplace coverage, bring proof of the coverage-loss date and My Number evidence. A representative outside the household needs authorization and photo identification." },
        { title: "Confirm direct overseas enrollment", description: "The cited page focuses on domestic moves and coverage changes. Ask the division which documents and counter apply when joining after a move directly from abroad." },
      ], sourceIds: ["kasugai-nhi"], sourceFormatNote: "Kasugai's insurance page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "kasugai-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Household waste in Kasugai", summary: "Kasugai divides collection into 17 districts and requires a separate booking for bulky waste.",
      applicability: "Find the town's collection district and the authorized station for your address; check the October 2026 bulky-waste rule change before booking.",
      responsibleBody: "Kasugai City", receivingOffice: "Waste Reduction Promotion Division for calendars; Cleaning Operations Office for bulky-waste bookings",
      actions: [
        { title: "Find the right collection calendar", description: "Use the city's town list to identify your A-to-Q collection district, then open its calendar. The city also offers a sorting and calendar app. Ask your building manager or the city which collection point serves your home." },
        { title: "Book bulky items separately", description: "The city asks residents to measure items and telephone the Cleaning Operations Office before buying the required payment stickers. It announces changes to accepted items and fees for applications from October 2026; consult the current page before booking, especially for appliances and vehicle parts." },
      ], sourceIds: ["kasugai-waste-calendar", "kasugai-bulky-waste"], sourceFormatNote: "Kasugai's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "kasugai-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Resident-tax declaration in Kasugai", summary: "Kasugai publishes the current resident-tax declaration form and allows submission at City Hall, by post, or through its stated electronic route.",
      applicability: "Confirm that Kasugai is the municipality responsible for your assessment year; the cited form and electronic route are for the 2026 assessment year.",
      responsibleBody: "Kasugai City", receivingOffice: "City Tax Division, City Hall second floor",
      actions: [
        { title: "Check whether a city declaration applies", description: "The city's instructions mention filing for certain income outside salary or pension and for additional deductions. They also list exceptions, including an income-tax return or salary-only income with completed year-end adjustment and no added deductions. Ask the division about your own income and residence dates." },
        { title: "Use the assessment-year instructions", description: "The city provides a form and preparation tool, accepts postal submissions, and lists electronic filing for the 2026 assessment year. Use the form, evidence, and route for the year that applies to you." },
      ], sourceIds: ["kasugai-tax"], sourceFormatNote: "Kasugai's tax page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "kasugai-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Disaster planning in Kasugai", summary: "Kasugai publishes district flood maps and links a separate earthquake risk map.",
      applicability: "Check the flood and earthquake layers for your exact address and a usable evacuation destination; follow current city alerts during an event.",
      responsibleBody: "Kasugai City", receivingOffice: "River Drainage Division for flood maps; city disaster counter for other hazards",
      actions: [
        { title: "Open your district's hazard maps", description: "The flood-map page links eastern, central, and western district maps with inundation depths, plus an information sheet about evacuation and updates. The city map hub also points to earthquake shaking maps for two scenarios. Choose the maps relevant to your home and routes rather than using a citywide average." },
        { title: "Check live conditions separately", description: "A hazard map is a planning tool. Check current warnings and shelter status before traveling during a flood, earthquake, or other emergency." },
      ], sourceIds: ["kasugai-hazard", "kasugai-map-hub"], sourceFormatNote: "Kasugai's map pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "kasugai-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Language and consultation support in Kasugai", summary: "Kasugai has a foreign-language consultation desk at City Hall and a beginner Japanese class program.",
      applicability: "Check the current consultation language day and class intake before visiting; schedules and capacity can change.",
      responsibleBody: "Kasugai City", receivingOffice: "Citizen Consultation Corner, City Hall second floor; International Exchange Room for Japanese classes",
      actions: [
        { title: "Use the foreign resident desk", description: "The city lists a free, walk-in consultation desk for city services, with English and Filipino, Portuguese, and Spanish on different weekly days. Check the city's current language schedule before visiting or calling." },
        { title: "Ask about a beginner class", description: "Kasugai Fureai classes serve people starting Japanese study who live, work, or study in Kasugai. The city says an application is needed and lists classes at Ladyan Kasugai and Kozoji Fureai Center. Ask the International Exchange Room about the current cohort, textbook cost, and available places." },
      ], sourceIds: ["kasugai-foreign-consultation", "kasugai-japanese-classes"], sourceFormatNote: "Kasugai's consultation and class pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "kasugai-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Pension changes in Kasugai", summary: "Kasugai accepts Category I enrollment after leaving work at City Hall, listed local counters, or the pension office, with a Mynaportal route.",
      applicability: "For a resident whose pension category calls for a filing; confirm the route and documents for a direct overseas arrival with the city or pension office.",
      responsibleBody: "Kasugai City", receivingOffice: "Insurance, Medical and Pension Division, listed Fureai centers and branch counters, or Nagoya North Pension Office",
      actions: [
        { title: "File after leaving employees' pension coverage", description: "The city FAQ says a person entering Category I after retirement can file at the listed counters or through Mynaportal. It lists Basic Pension Number or My Number evidence, proof of retirement date, and identity documents. A representative usually needs authorization, with a same-household exception at City Hall." },
        { title: "Confirm other arrival or exemption cases", description: "The cited FAQ concerns retirement, so ask the counter which pension action applies after arriving from abroad or when seeking an exemption or student payment postponement." },
      ], sourceIds: ["kasugai-pension"], sourceFormatNote: "Kasugai's pension FAQ is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "gap", records: ["kasugai-national-health-insurance"], gap: "The joining page does not separately describe direct overseas move-in documents; confirm current foreign-resident eligibility with the division." },
    { kind: "dated", records: ["kasugai-household-waste"], from: "2026-10-01", change: "The city announces changed bulky-waste acceptance and fee rules for applications from October 2026.", action: "Recheck the accepted-item list and booking instructions once the change takes effect." },
    { kind: "old-source", records: ["kasugai-household-waste"], source: "Kasugai resource and waste collection calendar page", date: "not stated" },
    { kind: "tax-year", records: ["kasugai-resident-tax"], statement: "The cited form and electronic filing route are for the 2026 assessment year; verify later-year instructions and departure arrangements." },
    { kind: "old-source", records: ["kasugai-disaster-preparation"], source: "Kasugai city map hub", date: "not stated" },
    { kind: "dated", records: ["kasugai-language-and-consultation"], from: "2026-03-23", change: "The city published the current Kasugai Fureai Japanese-class listing.", action: "Confirm the next cohort, places, and registration route." },
    { kind: "gap", records: ["kasugai-national-pension"], gap: "The cited pension FAQ concerns retirement, not direct arrivals from overseas or exemption applications." },
  ],
});
