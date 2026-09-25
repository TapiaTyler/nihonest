import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Koriyama City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-07203", name: "Koriyama City", aliases: ["Koriyama", "Koriyama-shi"], planGroup: "major-city" },
  sources: [
    { id: "koriyama-address-registration", title: "Moving into Koriyama from another municipality", url: "https://www.city.koriyama.lg.jp/soshiki/37/5107.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koriyama-address-registration-overseas", title: "Moving into Koriyama from overseas", url: "https://www.city.koriyama.lg.jp/soshiki/37/5054.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koriyama-national-health-insurance", title: "National Health Insurance enrollment, withdrawal, and changes", url: "https://www.city.koriyama.lg.jp/soshiki/35/4612.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koriyama-household-waste", title: "Household waste collection rules", url: "https://www.city.koriyama.lg.jp/soshiki/55/1042.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koriyama-waste-calendar", title: "FY2026 resource and waste collection calendars", url: "https://www.city.koriyama.lg.jp/soshiki/55/171818.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koriyama-waste-stations", title: "Finding and using a household waste collection station", url: "https://www.city.koriyama.lg.jp/soshiki/55/1044.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koriyama-bulky-waste", title: "Bulky waste collection and disposal", url: "https://www.city.koriyama.lg.jp/soshiki/55/1046.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koriyama-resident-tax", title: "Whether an individual city and prefectural tax declaration is required", url: "https://www.city.koriyama.lg.jp/soshiki/30/1526.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koriyama-resident-tax-moving", title: "Resident tax after moving during the year", url: "https://www.city.koriyama.lg.jp/soshiki/30/1515.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koriyama-tax-representative", title: "Appointing a municipal tax representative", url: "https://www.city.koriyama.lg.jp/soshiki/31/5234.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koriyama-disaster-maps", title: "Koriyama hazard map directory", url: "https://www.city.koriyama.lg.jp/soshiki/5/24999.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koriyama-language-support", title: "Foreign Resident Help Desk and Japanese classes", url: "https://www.city.koriyama.lg.jp/site/foreignlanguageportal/index.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "koriyama-national-pension", title: "National Pension procedures and filing locations", url: "https://www.city.koriyama.lg.jp/soshiki/35/4611.html", language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "koriyama-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Registering an address in Koriyama", summary: "Koriyama accepts address filings at the Citizens Division and listed local counters; overseas moves have additional passport and residence-record requirements.",
      applicability: "For people moving to Koriyama. Confirm the right counter and documents for your household and move before visiting.", responsibleBody: "Koriyama City", receivingOffice: "Citizens Division, administrative centers, liaison offices, or Citizens Service Center, depending on the procedure",
      actions: [
        { title: "File after moving to Koriyama", description: "For a move from another municipality, Koriyama lists its Citizens Division, administrative centers, liaison offices, and Citizens Service Center as moving-in counters. Submit the filing within 14 days after moving. A representative may file; a separate household needs a letter of authorization." },
        { title: "Prepare records for an overseas move", description: "For a move from abroad, the city asks for passports for everyone moving, identity documents for the person visiting, and residence cards or other listed status documents for foreign residents. If a representative from another household files, bring authorization. The city page also identifies Japanese family-register records for certain cases; confirm your documents with the Citizens Division because this page is older." },
      ],
      sourceIds: ["koriyama-address-registration", "koriyama-address-registration-overseas"], sourceFormatNote: "Koriyama City's procedure pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "koriyama-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Health Insurance in Koriyama", summary: "Koriyama handles National Health Insurance filings at city and local service counters and accepts some changes online; the online enrollment route is limited to people leaving another health plan.",
      applicability: "Use these municipal procedures after confirming that Koriyama's National Health Insurance is the right coverage route for you.", responsibleBody: "Koriyama City", receivingOffice: "National Health Insurance Division, administrative centers, liaison offices, or Citizens Service Centers for listed procedures",
      actions: [
        { title: "Report a coverage change and prepare its proof", description: "Koriyama says to report qualifying changes within 14 days. For a move into the city, ask to enroll when filing your address change. If another health plan ends, obtain its certificate showing loss of coverage; an online enrollment form is available for this case only. Births, moves, and other enrollment reasons use different procedures and should be handled at a counter." },
        { title: "Use the listed counters or online withdrawal form", description: "The city lists the National Health Insurance Division, administrative centers, liaison offices, and Citizens Service Centers for enrollment and withdrawal, though some other procedures are not available at service centers. Enrollment or withdrawal can also be filed online in the cases specified by the city. Check the procedure page for current required records and the correct counter." },
      ],
      sourceIds: ["koriyama-national-health-insurance"], sourceFormatNote: "Koriyama City's procedure page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "koriyama-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Household waste in Koriyama", summary: "Koriyama publishes collection calendars for 11 areas, and the correct calendar and collection station depend on the address.",
      applicability: "Waste schedules and collection stations vary by neighborhood and building. Confirm your local rules with the city, neighborhood representatives, neighbors, or building manager.", responsibleBody: "Koriyama City", receivingOffice: "Waste Reduction Promotion Division; neighborhood association or building manager for the assigned collection station",
      actions: [
        { title: "Find your area calendar and assigned station", description: "Choose the current fiscal-year calendar for your address; Koriyama publishes 11 area calendars and lists district lookup information. Ask the neighborhood association, nearby residents, or building manager which station serves your home. The city says to place household waste at the assigned station on collection day during the morning collection window; check the current local rule before putting it out." },
        { title: "Use a separate route for bulky items", description: "Koriyama has a separate bulky-waste process and excludes some items from municipal collection. Check the current city instructions before disposing of large furniture, appliances, or a large amount of waste from a move. Do not use a household station for business waste." },
      ],
      sourceIds: ["koriyama-household-waste", "koriyama-waste-calendar", "koriyama-waste-stations", "koriyama-bulky-waste"], sourceFormatNote: "Koriyama City's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "koriyama-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Resident tax in Koriyama", summary: "Koriyama publishes individual city and prefectural tax declaration guidance and explains tax responsibility after a move; use current-year instructions and your own notice.",
      applicability: "A move does not by itself settle which municipality handles a resident-tax year. Confirm the applicable year, filing requirement, and payment route with the tax office.", responsibleBody: "Koriyama City", receivingOffice: "Citizens Tax Division for declaration questions; Tax Collection Division for payment or a tax representative",
      actions: [
        { title: "Check whether a declaration is required", description: "Koriyama's declaration page lists exceptions, including filing a national income-tax return and certain cases where an employer or pension payer reports income. The cited page is older, so use the current year's city tax instructions or contact the Citizens Tax Division before relying on an exception." },
        { title: "Check the tax year and arrangements if leaving Japan", description: "The city explains that a move during the year does not necessarily change the municipality responsible for that year's assessment. If you will leave Japan and cannot handle municipal tax matters yourself, Koriyama provides a tax representative procedure. Confirm the current tax year, notices, and payment options with the city." },
      ],
      sourceIds: ["koriyama-resident-tax", "koriyama-resident-tax-moving", "koriyama-tax-representative"], sourceFormatNote: "Koriyama City's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "koriyama-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Hazard maps and disaster information in Koriyama", summary: "Koriyama provides a directory of hazard maps for multiple hazards and a separate disaster portal; check the maps for your address and follow current alerts.",
      applicability: "Use maps for your home, workplace, or school and for the relevant hazard. Map designations do not indicate which evacuation location is open during an event.", responsibleBody: "Koriyama City", receivingOffice: "Disaster Prevention and Crisis Management Division; use the city disaster portal for current notices",
      actions: [
        { title: "Check each relevant hazard map", description: "Koriyama's directory links to maps for river and inland flooding, landslides, liquefaction, reservoirs, and volcanic hazards. Find your exact address on the applicable maps and consult the city's geographic information system for location-specific information." },
        { title: "Follow current information during an emergency", description: "The city maintains a disaster portal and disaster email and social-media updates. The foreign-resident information page says email alerts can be configured in Japanese, English, simplified or traditional Chinese, and Korean. Check current notices and follow live city instructions during an event." },
      ],
      sourceIds: ["koriyama-disaster-maps", "koriyama-language-support"], sourceFormatNote: "Koriyama City's disaster pages are in Japanese and English. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "koriyama-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Foreign-resident support and Japanese classes in Koriyama", summary: "Koriyama's International Exchange Salon provides a Foreign Resident Help Desk and lists Japanese classes; confirm current availability and language support with the city or provider.",
      applicability: "Check current contact details, languages, enrollment, and class schedules before relying on a service.", responsibleBody: "Koriyama City", receivingOffice: "International Exchange Salon, West Building 1F, City Hall",
      actions: [
        { title: "Contact the Foreign Resident Help Desk", description: "The city says foreign residents can ask about city procedures, health insurance, pension, taxes, daily life, and other matters through its help desk at the International Exchange Salon. Its page lists weekday opening hours and contact details; check the current page before visiting or calling." },
        { title: "Ask about Japanese classes and language support", description: "Koriyama lists Japanese classes offered by local groups and directs readers to contact the organizers or International Exchange Salon for details. Schedules and eligibility can change, so confirm the current provider, venue, enrollment, and language support directly." },
      ],
      sourceIds: ["koriyama-language-support"], sourceFormatNote: "Koriyama City's support page is in Japanese and English. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "koriyama-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Pension procedures in Koriyama", summary: "Koriyama's National Pension procedure page lists municipal filing locations, required records for common changes, and online applications for some procedures.",
      applicability: "Your filing route depends on your pension category and change. Confirm current documents and the right municipal or Japan Pension Service counter.", responsibleBody: "Koriyama City", receivingOffice: "National Health Insurance Division, listed administrative centers and liaison offices, or Koriyama Pension Office, depending on the procedure",
      actions: [
        { title: "Ask the city about enrollment or relief procedures", description: "Koriyama's procedure table covers changes such as leaving an employer's pension plan or a spouse's dependent coverage, and identifies records such as pension-number information, identity or My Number information, and evidence of the coverage change. The page also lists online applications for certain filings. Confirm your case and documents with the city because this page is older." },
        { title: "Check which location handles your filing", description: "The page lists the city office, administrative centers, liaison offices, and Citizens Service Centers for some resident-side pension procedures, and lists the Koriyama Pension Office for others. Contact the National Health Insurance Division or Japan Pension Service to confirm the right counter for enrollment, exemption, student postponement, or another question." },
      ],
      sourceIds: ["koriyama-national-pension"], sourceFormatNote: "Koriyama City's procedure page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "old-source", records: ["koriyama-address-registration"], source: "koriyama-address-registration-overseas", date: "2021-12-02" },
    { kind: "dated", records: ["koriyama-household-waste"], from: "2026-04-01", change: "Koriyama publishes fiscal-year area collection calendars and rules that can change by year.", action: "Replace with the next fiscal-year calendars and reconfirm area selection and collection guidance." },
    { kind: "old-source", records: ["koriyama-resident-tax"], source: "koriyama-resident-tax", date: "2021-12-02" },
    { kind: "tax-year", records: ["koriyama-resident-tax"], statement: "Recheck current-year declaration exceptions, payment channels, and the city responsible for the applicable assessment year." },
    { kind: "dated", records: ["koriyama-disaster-preparation"], from: "2026-04-01", change: "The hazard-map directory was updated in 2026.", action: "Check for revised maps and linked location information." },
    { kind: "old-source", records: ["koriyama-national-pension"], source: "koriyama-national-pension", date: "2022-04-01" },
    { kind: "gap", records: ["koriyama-national-health-insurance"], gap: "The cited page distinguishes online enrollment after employer coverage ends from counter procedures for moving into Koriyama; confirm any updated online route for address-change enrollment." },
  ],
});
