import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Otsu City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-25201", name: "Otsu City", aliases: ["Otsu", "Otsu-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "otsu-address-registration", title: "Address notifications, including overseas move-in", url: "https://www.city.otsu.lg.jp/apply/a/t/t/4923.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "otsu-national-health-insurance", title: "Joining National Health Insurance", url: "https://www.city.otsu.lg.jp/soshiki/020/1403/g/kokuho/ks/37904.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "otsu-household-waste", title: "Household waste sorting and set-out instructions", url: "https://www.city.otsu.lg.jp/kurashi/g/b/s/g/9193.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "otsu-household-waste-calendar", title: "Household waste collection calendars by area", url: "https://www.city.otsu.lg.jp/soshiki/030/1703/g/c/index.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "otsu-bulky-waste", title: "Bulky household waste collection and self-delivery", url: "https://www.city.otsu.lg.jp/soshiki/030/1703/g/bumbetsu/28743.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "otsu-resident-tax-declaration", title: "Who must file an individual resident-tax return", url: "https://www.city.otsu.lg.jp/apply/zei/shimin/kojin/shin/30339.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "otsu-resident-tax-notice", title: "FY2026 resident-tax notices", url: "https://www.city.otsu.lg.jp/soshiki/005/1215/o/40977.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "otsu-resident-tax-overseas", title: "Resident tax for people moving overseas or deceased", url: "https://www.city.otsu.lg.jp/apply/zei/shimin/kojin/sk/30338.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "otsu-resident-tax-deadlines", title: "FY2026 tax payment deadlines", url: "https://www.city.otsu.lg.jp/apply/zei/nz/01/65106.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "otsu-hazard-maps", title: "Otsu hazard maps and disaster profiles", url: "https://www.city.otsu.lg.jp/bosai/b/h/map/index.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "otsu-shelters", title: "Designated evacuation shelters by school district", url: "https://www.city.otsu.lg.jp/bosai/b/p/4687.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "otsu-foreign-resident-guide", title: "Guide to Living in Otsu for foreign residents", url: "https://www.city.otsu.lg.jp/kurashi/s/m/i/22632.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "otsu-national-pension", title: "National Pension notifications and enrollment", url: "https://www.city.otsu.lg.jp/apply/hn/n/4430.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "otsu-pension-exemption", title: "National Pension exemption and payment-postponement applications", url: "https://www.city.otsu.lg.jp/apply/hn/n/23314.html", language: "ja", lastCheckedAt: "2026-09-26" },
  ],
  supplements: [
    {
      id: "otsu-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Registering an address in Otsu", summary: "Otsu accepts resident notifications at the City Hall Household Registration and Resident Affairs Division and branch offices; overseas arrivals must complete the move-in procedure in person.",
      applicability: "For people moving to Otsu. Ask the receiving counter whether your household or representative filing needs extra records.", responsibleBody: "Otsu City", receivingOffice: "Household Registration and Resident Affairs Division, City Hall main building 1F, or a branch office",
      actions: [
        { title: "File your move-in notification", description: "For a move from abroad, submit the overseas move-in notification at the city counter; Otsu says address notifications other than domestic move-out filings require an in-person visit. For a move from another Japanese municipality, bring the moving-out certificate or complete the My Number Card transfer route. File within 14 days after moving to the new address." },
        { title: "Bring identity and household documents", description: "Foreign residents should bring a residence card or Special Permanent Resident Certificate. The city requires identity confirmation and says it may request a relationship document and translation for a foreign resident's relationship to the household head. A non-relative joining an existing household needs the household head's consent; ask whether your situation requires other records." },
      ],
      sourceIds: ["otsu-address-registration"], sourceFormatNote: "Otsu City's procedure page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "otsu-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Health Insurance in Otsu", summary: "Otsu handles National Health Insurance enrollment at the Insurance and Pension Division or branch offices; the household head files and documents depend on the coverage change.",
      applicability: "Use this city procedure after confirming municipal National Health Insurance is the correct coverage route for you.", responsibleBody: "Otsu City", receivingOffice: "Insurance and Pension Division at City Hall main building 1F or a branch office",
      actions: [
        { title: "Report the change and bring its supporting records", description: "Otsu asks the household head to report a qualifying enrollment change, generally within 14 days. For a move into Otsu, bring the moving-out certificate, identity document, and residence card or Special Permanent Resident Certificate if applicable. If workplace or dependent coverage ends, bring proof of the health-insurance loss and identity document. Other changes have different checklists." },
        { title: "Use the right counter for your household", description: "The city accepts these filings at the Insurance and Pension Division or a branch office. If someone outside your registered household visits, Otsu requires the household head's authorization and the visitor's identity document. Confirm the current checklist and ask about premiums or reductions directly with the city." },
      ],
      sourceIds: ["otsu-national-health-insurance"], sourceFormatNote: "Otsu City's procedure page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "otsu-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Household waste in Otsu", summary: "Otsu publishes neighborhood-specific collection calendars and multilingual sorting leaflets; bulky items and self-delivery require advance arrangements.",
      applicability: "Collection routes and days depend on the address. Choose the area calendar for your neighborhood and check your building's designated collection place.", responsibleBody: "Otsu City", receivingOffice: "Waste Reduction Promotion Division for waste guidance; use the address-specific collection calendar for routine service",
      actions: [
        { title: "Check your neighborhood's collection days", description: "Use the city calendar search by neighborhood or school district; Otsu notes that Ono residents should use the Wani 2/Wani 3 calendar and that some local collection patterns may differ. Put household waste out on the collection day between 5:00 and 8:30 a.m. The city provides sorting leaflets in English, Chinese, Spanish, Portuguese, Vietnamese, and Indonesian." },
        { title: "Arrange bulky items before disposal", description: "Otsu requires advance arrangements for bulky household waste, through a scheduled paid collection or a waste facility delivery. Collection dates depend on school district; online applications are available, and telephone arrangements may be needed depending on the route. Check the current city instructions for accepted items, schedule, and charges before booking." },
      ],
      sourceIds: ["otsu-household-waste", "otsu-household-waste-calendar", "otsu-bulky-waste"], sourceFormatNote: "Otsu City's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "otsu-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Resident tax in Otsu", summary: "Otsu publishes individual resident-tax filing guidance, notices, annual payment dates, and procedures for people leaving Japan; the applicable information depends on the tax year and your circumstances.",
      applicability: "Use the national guide to identify the relevant resident-tax year, then confirm filing, payment, and departure steps with Otsu for your own notice.", responsibleBody: "Otsu City", receivingOffice: "Taxation Division for resident-tax filings and notices; Tax Payment Division for payment questions",
      actions: [
        { title: "Check whether you need a city tax return", description: "Otsu lists circumstances requiring an individual city and prefectural resident-tax return, including some people with no income and those whose income is not otherwise reported. The city says the needed declaration depends on income and other reporting; check its current guidance rather than assuming an income-tax filing covers every city requirement." },
        { title: "Check annual notices and departure arrangements", description: "For FY2026, Otsu says salary-withheld notices are sent to employers from May 15, while ordinary-payment and pension-withheld notices are sent from June 1. Its annual page lists payment due dates, and its overseas-departure guidance explains appointing a tax representative when needed. Check your notice and the current tax-year pages for applicable filing and payment routes." },
      ],
      sourceIds: ["otsu-resident-tax-declaration", "otsu-resident-tax-notice", "otsu-resident-tax-overseas", "otsu-resident-tax-deadlines"], sourceFormatNote: "Otsu City's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "otsu-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Hazard maps and evacuation shelters in Otsu", summary: "Otsu publishes hazard maps for different flood and landslide risks and lists designated shelters by school district; map coverage and shelter choice depend on the address and current conditions.",
      applicability: "Check the relevant maps for your exact address and know the local school district; designated sites may change and are not confirmation of current opening during an emergency.", responsibleBody: "Otsu City", receivingOffice: "Disaster Prevention Division for maps and shelter information",
      actions: [
        { title: "Check the different maps for your address", description: "Otsu publishes sediment and large-river flood maps, maps for smaller rivers and nearby waterways, and agricultural-reservoir hazard maps. The mapped areas show approximate places where damage may be possible. Review the maps for your home, workplace, and school, and confirm the school district associated with each address." },
        { title: "Identify a shelter and follow live instructions", description: "Use the city's school-district list to identify designated evacuation shelters near your address, then check current city alerts and instructions during an event. Otsu reviews shelter facilities periodically, so confirm the current site and whether it is open before traveling when conditions allow." },
      ],
      sourceIds: ["otsu-hazard-maps", "otsu-shelters"], sourceFormatNote: "Otsu City's disaster pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "otsu-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Foreign-resident information in Otsu", summary: "Otsu publishes its Guide to Living in Otsu in five languages and distributes it through city offices and the Otsu International Goodwill Association; confirm directly which consultation and Japanese-learning services are currently available.",
      applicability: "The city guide is an orientation resource. Contact the city multicultural office or the named association for current language support, consultations, and class schedules.", responsibleBody: "Otsu City", receivingOffice: "Multicultural Coexistence and International Affairs Office, City Hall main building 2F; guide copies are also listed at Household Registration and Resident Affairs Division, branch offices, and OIGA",
      actions: [
        { title: "Use the city's multilingual living guide", description: "Otsu's Guide to Living in Otsu is available in English, Chinese, Spanish, Portuguese, and Vietnamese, as downloads and at the listed city and association counters. The city page directs readers to the Otsu International Goodwill Association, but does not set out current consultation language availability, appointment rules, or Japanese-class schedules; contact the city multicultural office or provider to confirm those details." },
        { title: "Confirm current local services before relying on them", description: "Ask the city multicultural office which foreign-resident consultation or Japanese-learning services are active and where they are offered. The city's online guide page does not provide current class dates, eligibility, or service capacity, so confirm directly with the service provider before visiting or enrolling." },
      ],
      sourceIds: ["otsu-foreign-resident-guide"], sourceFormatNote: "Otsu City's foreign-resident information page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "otsu-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Pension procedures in Otsu", summary: "Otsu handles common National Pension enrollment, exemption, and student payment-postponement applications through the Insurance and Pension Division's senior medical care and pension section or branch offices.",
      applicability: "First confirm your pension category and whether your employer or a spouse's workplace handles the procedure; municipal filings depend on your circumstances.", responsibleBody: "Otsu City", receivingOffice: "Insurance and Pension Division, Senior Medical Care and Pension Section, City Hall main building 1F, or a branch office",
      actions: [
        { title: "Ask which enrollment notification applies", description: "Otsu directs common enrollment procedures to its pension section or a branch office. For a job change, the city lists identity verification, evidence of the retirement date, and a Basic Pension Number record; a dependent spouse joining an employee's coverage applies through the spouse's employer. Ask the city which route applies to a foreign resident's specific status and change." },
        { title: "Ask about exemption or student postponement", description: "Otsu accepts applications for premium exemption, payment postponement, and the student payment exception through its municipal pension counter; approval is decided after review. The city lists identity records and, for unemployment-related applications, copies of specified employment-insurance records. Confirm your current document checklist and whether another filing route is available." },
      ],
      sourceIds: ["otsu-national-pension", "otsu-pension-exemption"], sourceFormatNote: "Otsu City's pension pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "old-source", records: ["otsu-national-health-insurance"], source: "otsu-national-health-insurance", date: "2024-11-28" },
    { kind: "dated", records: ["otsu-household-waste"], from: "2026-01-21", change: "The city posted current household waste instructions and multilingual leaflets in January 2026.", action: "Confirm set-out rules, holiday collection, languages, and area calendars against the current guide." },
    { kind: "dated", records: ["otsu-household-waste"], from: "2026-04-14", change: "The city published FY2026 bulky-waste collection information.", action: "Check the current fiscal-year schedule, application routes, and fees before booking." },
    { kind: "tax-year", records: ["otsu-resident-tax"], statement: "Filing rules, notice channels, tax-payment deadlines, and departure procedures are tied to the resident-tax year." },
    { kind: "dated", records: ["otsu-disaster-preparation"], from: "2026-06-02", change: "The designated shelter list is dated and may be revised.", action: "Recheck the current school-district shelter list and whether a site is open during an emergency." },
    { kind: "old-source", records: ["otsu-disaster-preparation"], source: "otsu-hazard-maps", date: "not stated" },
    { kind: "dated", records: ["otsu-language-and-consultation"], from: "2026-04-03", change: "The current living guide page was updated in April 2026.", action: "Confirm the current guide editions and which consultation and Japanese-learning services are active." },
    { kind: "gap", records: ["otsu-language-and-consultation"], gap: "The city guide page does not give current consultation languages, appointment rules, Japanese-class schedules, eligibility, or capacity; confirm these directly with the city or provider." },
    { kind: "dated", records: ["otsu-national-pension"], from: "2026-03-24", change: "The city updated National Pension notification information in March 2026.", action: "Confirm current application checklists and routes for the relevant pension procedure." },
    { kind: "old-source", records: ["otsu-national-pension"], source: "otsu-pension-exemption", date: "2025-11-14" },
  ],
});
