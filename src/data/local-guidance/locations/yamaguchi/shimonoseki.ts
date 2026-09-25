import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Shimonoseki City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-35201", name: "Shimonoseki City", aliases: ["Shimonoseki","Shimonoseki-shi"], planGroup: "major-city" },
  sources: [
    { id: "shimonoseki-address-registration", title: "Moving to Shimonoseki", url: "https://www.city.shimonoseki.lg.jp/soshiki/20/3462.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shimonoseki-national-health-insurance", title: "National Health Insurance enrollment and withdrawal procedures", url: "https://www.city.shimonoseki.lg.jp/site/gyousei/4991.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shimonoseki-household-waste", title: "FY2026 household waste sorting and collection guide", url: "https://www.city.shimonoseki.lg.jp/site/gomi/143543.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shimonoseki-disaster-maps", title: "Shimonoseki disaster maps", url: "https://www.city.shimonoseki.lg.jp/site/bosai/list83.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shimonoseki-evacuation-sites", title: "Evacuation sites", url: "https://www.city.shimonoseki.lg.jp/site/bosai/list84.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shimonoseki-language-consultation", title: "Consultation for foreign residents in Shimonoseki", url: "https://www.city.shimonoseki.lg.jp/soshiki/4/161678.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shimonoseki-japanese-classes", title: "Japanese classes for foreign residents", url: "https://www.city.shimonoseki.lg.jp/soshiki/4/150474.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shimonoseki-national-pension", title: "National Pension enrollment and procedures", url: "https://www.city.shimonoseki.lg.jp/soshiki/42/4995.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shimonoseki-pension-contact", title: "FY2026 National Pension consultation contacts", url: "https://www.city.shimonoseki.lg.jp/soshiki/42/130620.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shimonoseki-resident-tax", title: "Individual city and prefectural resident tax", url: "https://www.city.shimonoseki.lg.jp/soshiki/16/5586.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "shimonoseki-resident-tax-e-filing", title: "Electronic resident-tax filing from FY2026", url: "https://www.city.shimonoseki.lg.jp/soshiki/16/143098.html", language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "shimonoseki-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Registering an address in Shimonoseki", summary: "Shimonoseki handles moving-in filings at the Citizens Services Division, general branch offices, and branch offices; overseas arrivals have additional document requirements.",
      applicability: "For people moving to Shimonoseki. Confirm your receiving counter and documents for your exact household and move.", responsibleBody: "Shimonoseki City", receivingOffice: "Citizens Services Division, general branch citizens' affairs and national health insurance sections, or branch offices",
      actions: [
        { title: "File at the city counter after moving", description: "Submit your moving-in notification within 14 days after starting to live at the new address. The city lists the Citizens Services Division, general branch citizens' affairs and national health insurance sections, and branch offices. Foreign residents cannot file at branch offices located within general branches, so confirm the correct counter before going." },
        { title: "Bring move and identity records", description: "For a domestic move, bring the previous municipality's moving-out certificate or use the My Number Card special transfer, identity documents, and residence cards for relevant foreign residents. For an overseas move, Japanese residents need passports and family-register records unless their registered domicile is Shimonoseki; foreign residents need each mover's residence card or other listed residence-status document. Ask about unusual family or residence records." },
      ],
      sourceIds: ["shimonoseki-address-registration"], sourceFormatNote: "Shimonoseki City's procedure page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "shimonoseki-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Health Insurance in Shimonoseki", summary: "Shimonoseki handles enrollment at the Insurance and Pension Division, branch offices, and general branches; the required records depend on why coverage is changing.",
      applicability: "Use the city procedure after confirming municipal National Health Insurance is the right coverage option for you.", responsibleBody: "Shimonoseki City", receivingOffice: "Insurance and Pension Division at City Hall, branch offices, or general branch offices",
      actions: [
        { title: "Report a coverage change and bring its proof", description: "For a move into Shimonoseki, the city lists the moving-out certificate, any relocation notice issued by the prior address, identity documents, and My Number information. When workplace or dependent coverage ends, bring a certificate showing loss of coverage, identity documents, and My Number information. The household head must report a qualifying change within 14 days." },
        { title: "Confirm your counter and coverage choice", description: "The city accepts procedures at the Insurance and Pension Division, branch offices, and general branch offices. Before leaving a job, Shimonoseki identifies municipal National Health Insurance, voluntary continuation, and joining a family member's dependent coverage as options. Ask the city or former employer about your case; the city says some withdrawal filings may be accepted by mail." },
      ],
      sourceIds: ["shimonoseki-national-health-insurance"], sourceFormatNote: "Shimonoseki City's procedure page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "shimonoseki-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Household waste in Shimonoseki", summary: "Shimonoseki publishes FY2026 waste calendars by district and area; oversized or large move-out loads need a separate route.",
      applicability: "Collection areas and dates depend on your address. Use the current calendar for your district and check your building's collection point.", responsibleBody: "Shimonoseki City", receivingOffice: "Clean Promotion Division; local Citizens Services Division or general branch office for printed guides",
      actions: [
        { title: "Choose the calendar for your district and area", description: "Use Shimonoseki's FY2026 guide to identify your collection area and the separate calendar for station collection or individual pickup. The city lists district-specific schedules, including separate Monday/Thursday and Tuesday/Friday areas in parts of the former city and Katsuyama. The free San-aru app can display dates after you set Yamaguchi Prefecture, Shimonoseki, and your district." },
        { title: "Use a separate route for excluded loads", description: "The city warns that large volumes from moving cannot be left at collection stations; take them to a municipal facility or hire a city-permitted collector. Business waste also cannot go to household stations, and mobile batteries count as hazardous waste. Ask the Clean Promotion Division or building manager if your address or item is unclear." },
      ],
      sourceIds: ["shimonoseki-household-waste"], sourceFormatNote: "Shimonoseki City's waste guide is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "shimonoseki-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Disaster maps and evacuation sites in Shimonoseki", summary: "Shimonoseki provides separate hazard maps for landslides, tsunami and flooding, storm surge, inland flooding, and earthquakes, with evacuation lists organized by city service area.",
      applicability: "Check maps and evacuation sites for the address and hazard that matter to you. Confirm which sites are open during an actual emergency.", responsibleBody: "Shimonoseki City", receivingOffice: "Disaster Prevention and Crisis Management Division; ask the relevant general branch office about your area",
      actions: [
        { title: "Review the maps for your area", description: "Open the city's disaster-map directory and select the maps for landslide, tsunami/flood, storm surge, inland flooding, and earthquake risk. Find your home, work, and school on the relevant map; map pages and detail vary by area." },
        { title: "Locate current evacuation information", description: "The city lists evacuation sites separately for the main city office area and general branch areas, and warns that designated sites can change. Check the current list before an event and follow live city alerts and directions during an emergency." },
      ],
      sourceIds: ["shimonoseki-disaster-maps", "shimonoseki-evacuation-sites"], sourceFormatNote: "Shimonoseki City's disaster pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "shimonoseki-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Language and consultation support in Shimonoseki", summary: "Shimonoseki directs foreign residents to the Yamaguchi Foreign Resident Support Center and accepts email inquiries through its International Affairs Division; the city also offers Japanese classes.",
      applicability: "Check the center's current languages, contact routes, and class schedules before relying on a service.", responsibleBody: "Shimonoseki City", receivingOffice: "International Affairs Division, Kaikyo Messe 6th floor; Yamaguchi Foreign Resident Support Center for consultations",
      actions: [
        { title: "Ask the foreign-resident consultation center", description: "The city's current guidance directs residents to the Yamaguchi Foreign Resident Support Center for daily-life questions. The city says consultation is available in English, Chinese, Filipino, Vietnamese, and easy Japanese, with telephone interpretation for other languages. Shimonoseki's International Affairs Division also accepts email written in the resident's own language." },
        { title: "Check the Japanese class listing", description: "Shimonoseki provides Japanese classes for foreign residents. Contact the city or class provider for current enrollment, schedule, venue, and participation details." },
      ],
      sourceIds: ["shimonoseki-language-consultation", "shimonoseki-japanese-classes"], sourceFormatNote: "Shimonoseki City's support pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "shimonoseki-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Pension in Shimonoseki", summary: "Shimonoseki's Insurance and Pension Division and general branch offices handle some resident-side National Pension filings; the city page is best used to find the counter and confirm current procedures.",
      applicability: "Your route depends on your pension coverage category. Confirm enrollment or relief procedures and the current required documents with the city or Japan Pension Service.", responsibleBody: "Shimonoseki City", receivingOffice: "Insurance and Pension Division, general branch offices, or branch offices; satellite offices do not accept the listed filings",
      actions: [
        { title: "Ask the pension counter about your change", description: "The city's category page lists enrollment filings when workplace pension coverage ends and when someone leaves a spouse's dependent coverage. It identifies the Insurance and Pension Division, general branch offices, and branch offices as counters; satellite offices do not accept these filings. Bring identity and pension-number records and evidence of the coverage change as relevant." },
        { title: "Use the current consultation contact", description: "The city lists its Pension Section for National Pension insured residents and the Shimonoseki Pension Office for pension matters. Ask which office handles your enrollment, exemption, student postponement, or other relief question and what to bring." },
      ],
      sourceIds: ["shimonoseki-national-pension", "shimonoseki-pension-contact"], sourceFormatNote: "Shimonoseki City's pension pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "shimonoseki-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Resident tax in Shimonoseki", summary: "Shimonoseki publishes individual city and prefectural tax guidance, including who must file, payment routes, and electronic filing available from FY2026 declarations.",
      applicability: "The municipality responsible for a resident-tax year is determined by your address on January 1. Check the current year's city instructions and your own notice.", responsibleBody: "Shimonoseki City", receivingOffice: "Resident Tax Division",
      actions: [
        { title: "Check whether you need to file", description: "Shimonoseki's individual city/prefectural tax page explains filing exemptions and cases where residents must submit a declaration. The city began electronic resident-tax filing with FY2026 declarations; review the current e-filing instructions and use them only if your situation qualifies." },
        { title: "Follow your assessment notice and confirm the tax year", description: "The city explains ordinary payment by notice, employer withholding, and pension withholding. Its examples state that a move after January 1 does not transfer that year's Shimonoseki assessment to the new city. Check the notice for the correct year, payment route, and any departure arrangements that apply to you." },
      ],
      sourceIds: ["shimonoseki-resident-tax", "shimonoseki-resident-tax-e-filing"], sourceFormatNote: "Shimonoseki City's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "dated", records: ["shimonoseki-household-waste"], from: "2026-04-01", change: "The FY2026 collection guide reflects changed collection weekdays and frequency for some recyclables.", action: "Replace with the next fiscal year's guide and verify current district calendars." },
    { kind: "old-source", records: ["shimonoseki-disaster-preparation"], source: "shimonoseki-disaster-maps", date: "undated" },
    { kind: "old-source", records: ["shimonoseki-national-pension"], source: "shimonoseki-national-pension", date: "2025-04-30" },
    { kind: "tax-year", records: ["shimonoseki-resident-tax"], statement: "Confirm current-year filing exceptions, electronic filing eligibility, assessment notices, and payment routes." },
    { kind: "gap", records: ["shimonoseki-resident-tax"], gap: "The cited pages do not explain appointing a tax representative for a resident leaving Japan; confirm current departure procedures with the Resident Tax Division." },
  ],
});
