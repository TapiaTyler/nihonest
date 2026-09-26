import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Nagano City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-20201", name: "Nagano City", aliases: ["Nagano","Nagano-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "nagano-address-registration", title: "Moving into Nagano City", url: "https://www.city.nagano.nagano.jp/n085500/contents/p000227.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "nagano-address-procedures", title: "Resident move notification procedures", url: "https://www.city.nagano.nagano.jp/n085500/contents/p000226.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "nagano-national-health-insurance", title: "Online National Health Insurance procedures", url: "https://www.city.nagano.nagano.jp/n104500/contents/p005830.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "nagano-household-waste", title: "FY2026 household waste collection calendars", url: "https://www.city.nagano.nagano.jp/n121500/contents/p006210.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "nagano-household-waste-search", title: "Waste and recycling by neighborhood", url: "https://www.city.nagano.nagano.jp/gomi/", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "nagano-resident-tax-filing", title: "Individual resident-tax filing guidance", url: "https://www.city.nagano.nagano.jp/n062000/contents/p000367.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "nagano-resident-tax-departure", title: "Resident tax procedures when moving overseas", url: "https://www.city.nagano.nagano.jp/n062000/contents/p000400.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "nagano-pension-enrollment", title: "National Pension enrollment procedures", url: "https://www.city.nagano.nagano.jp/n104500/n104540/contents/p000343.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "nagano-pension-exemption", title: "National Pension exemption and payment postponement", url: "https://www.city.nagano.nagano.jp/n104500/n104540/contents/p000345.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "nagano-landslide-maps", title: "Landslide hazard maps", url: "https://www.city.nagano.nagano.jp/n024000/contents/p000035.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "nagano-flood-maps", title: "Flood hazard maps", url: "https://www.city.nagano.nagano.jp/n024000/contents/p000037.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "nagano-shelters", title: "Designated emergency evacuation sites and shelters", url: "https://www.city.nagano.nagano.jp/n024000/contents/p000041.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "nagano-international-corner", title: "Nagano City International Exchange Corner", url: "https://www.city.nagano.nagano.jp/n150800/n150815/contents/p001278.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "nagano-multilingual-info", title: "Multilingual information for foreign residents", url: "https://www.city.nagano.nagano.jp/n150800/n150815/contents/p001276.html", language: "ja", lastCheckedAt: "2026-09-26" },
  ],
  supplements: [
    {
      id: "nagano-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Registering an address in Nagano City", summary: "Nagano City receives move-in filings at the main city hall general counter and most branch offices; foreign residents need additional residence and household-relationship records.",
      applicability: "For people moving to Nagano City. The city recently shortened its trial counter hours; check the current schedule and your address's branch counter.", responsibleBody: "Nagano City", receivingOffice: "General Counter, City Hall First Building 2F, or a branch office",
      actions: [
        { title: "File at the city after moving", description: "Complete the former municipality's moving-out filing, then submit Nagano City's move-in notice within 14 days after moving. The current page lists the General Counter at City Hall and branch offices, excluding Shinri and Kutsak. The published trial counter hours are weekdays 9:00 a.m. to 4:30 p.m.; check for changes before visiting." },
        { title: "Bring the records for your move", description: "For an overseas arrival, bring every mover's passport and evidence of the entry date, such as a boarding record; have each person's registered domicile and head-of-family details ready. Foreign residents should bring their residence card or Special Permanent Resident Certificate and original relationship evidence with a Japanese translation. A representative needs a letter of authorization." },
      ],
      sourceIds: ["nagano-address-registration", "nagano-address-procedures"], sourceFormatNote: "Nagano City's procedure pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "nagano-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Health Insurance in Nagano City", summary: "Nagano City accepts National Health Insurance enrollment and withdrawal online and at the National Health Insurance counter or branch offices; a move-in can be handled with the address filing.",
      applicability: "Use municipal National Health Insurance only after confirming it is the right coverage route for you. The necessary records depend on the change.", responsibleBody: "Nagano City", receivingOffice: "National Health Insurance and Elderly Medical Care Division, City Hall First Building 2F, or a branch office",
      actions: [
        { title: "Report enrollment or withdrawal using the available route", description: "Nagano City lists online applications for National Health Insurance enrollment and withdrawal through its electronic application service, as well as the city counter and branch offices. A person continuing municipal coverage after moving into Nagano can request the procedure with the move-in filing. Ask the city which records are required for your specific coverage change." },
        { title: "Check annual forms and your household's notice", description: "Bring the household and applicant identity records requested for your procedure, and use the city's current checklist rather than relying on a previous year's insurance card or notice. Ask the city about premiums, reductions, and how an overseas move or employment change affects your coverage." },
      ],
      sourceIds: ["nagano-national-health-insurance", "nagano-address-registration"], sourceFormatNote: "Nagano City's procedure pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "nagano-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Household waste in Nagano City", summary: "Nagano City publishes household collection calendars for many neighborhood areas; the correct calendar and collection point depend on the address.",
      applicability: "Select the calendar for your district and ask your neighborhood or building manager which station serves your home.", responsibleBody: "Nagano City", receivingOffice: "Living Environment Division, waste collection and public information section; local station manager for collection-point rules",
      actions: [
        { title: "Find the collection calendar for your address", description: "Use the city's regional collection-day search and the FY2026 calendar directory to match your address to its district calendar. Put household waste at the district's designated collection station on the scheduled day. Bad weather may disrupt service; check city notices for changes." },
        { title: "Use the foreign-language guide with the Japanese schedule", description: "Nagano City offers foreign-language calendars, but says those versions do not include collection dates; use them together with the Japanese calendar for your district. The city also links item-by-item sorting search, collection requests, and disposal information. Follow your station's local rules and check the current fiscal-year materials." },
      ],
      sourceIds: ["nagano-household-waste", "nagano-household-waste-search"], sourceFormatNote: "Nagano City's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "nagano-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Resident tax in Nagano City", summary: "Nagano City accepts resident-tax declarations by post and offers electronic filing for FY2026 onward; the city also requires eligible departing taxpayers to arrange a tax administrator or settle tax before departure.",
      applicability: "Confirm whether Nagano is your assessment municipality for the year and whether you must file; annual forms and filing effects can change.", responsibleBody: "Nagano City", receivingOffice: "Individual Resident Tax Section, City Tax Division, City Hall First Building 3F",
      actions: [
        { title: "Check whether a municipal declaration is required", description: "Nagano City identifies cases needing a resident-tax declaration, including some people with no income or only non-taxable income who need insurance or housing calculations or a certificate showing income. City tax declarations can be mailed, and electronic filing is available beginning with FY2026 returns. Check the current-year criteria and document checklist." },
        { title: "Arrange tax handling if leaving Japan", description: "Nagano says tax may remain due for the year when a person leaves Japan, based on the January 1 address and prior-year income. If a notice or unpaid balance remains, appoint a tax administrator in Japan or pay the tax before leaving; the city provides forms for selecting or releasing the representative. Confirm your own notice and timing with the city." },
      ],
      sourceIds: ["nagano-resident-tax-filing", "nagano-resident-tax-departure"], sourceFormatNote: "Nagano City's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "nagano-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Hazard maps and evacuation facilities in Nagano City", summary: "Nagano City provides address-searchable landslide and flood maps and lists evacuation facilities by hazard type; address and emergency conditions determine which routes and sites apply.",
      applicability: "Review maps for your exact location and hazard type. Maps are planning references; follow current warnings and go to an open facility appropriate to the hazard.", responsibleBody: "Nagano City", receivingOffice: "Crisis Management and Disaster Prevention Division, City Hall First Building 5F, or a branch office for map copies",
      actions: [
        { title: "Check the map and hazard for your address", description: "Use the city's GIS to search an address for landslide risk, flood inundation and nearby evacuation facilities. Nagano City's river-flood map does not account for inland flooding from drains and small waterways, so also check the separate inland-water and reservoir maps if relevant." },
        { title: "Distinguish evacuation sites from shelters", description: "The city distinguishes emergency evacuation locations, selected for specific hazards, from designated shelters for people unable to live at home. Check the current city list for the facility's hazard designations and live opening status before traveling when possible; conditions can change during an event." },
      ],
      sourceIds: ["nagano-landslide-maps", "nagano-flood-maps", "nagano-shelters"], sourceFormatNote: "Nagano City's disaster pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "nagano-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Japanese learning and multilingual support in Nagano City", summary: "Nagano City's International Exchange Corner offers Japanese classes and foreign-resident support, and city multilingual information links to current consultation guidance.",
      applicability: "Contact the corner directly to confirm the appropriate support, class level, calendar, and any materials or fees before attending.", responsibleBody: "Nagano City", receivingOffice: "International Exchange Corner, Monzen Plaza 3F, 1485-1 Shinden-cho",
      actions: [
        { title: "Ask about Japanese classes and materials", description: "The city says the International Exchange Corner runs beginner-to-intermediate Japanese classes from Monday through Saturday except Wednesday. Participation is free, though materials may cost extra. Contact the corner for the current program, placement, and schedule before attending." },
        { title: "Use the city's multilingual consultation information", description: "Nagano City maintains multilingual information for foreign residents and publishes consultation guidance in several languages. Its 2026 page links to current consultation information and the International Exchange Corner. Check the current notice for available languages, appointment arrangements, and the right service for your question." },
      ],
      sourceIds: ["nagano-international-corner", "nagano-multilingual-info"], sourceFormatNote: "Nagano City's foreign-resident pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "nagano-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Pension procedures in Nagano City", summary: "Nagano City accepts first-category National Pension enrollment, including online through MyNa Portal, and exemption or payment-postponement applications at the city pension counter, branches, and pension offices.",
      applicability: "Check whether you need a municipal category change or whether an employer handles your case; application and approval rules depend on your circumstances.", responsibleBody: "Nagano City", receivingOffice: "National Pension Office, City Hall First Building 2F, a branch office, or Nagano South/North Pension Office",
      actions: [
        { title: "Register a change from employee pension coverage", description: "Nagano City accepts first-category National Pension enrollment at the municipal pension office and through MyNa Portal. For a departure from employee coverage, the city lists identity evidence, a Basic Pension Number record, and proof of the retirement date; also report for a dependent spouse when relevant. A person becoming a dependent spouse should contact the spouse's employer." },
        { title: "Ask about exemption or payment postponement", description: "The city accepts exemption, payment-postponement, and student exception applications at its pension office, branch offices, or a pension office. The Japan Pension Service reviews applications and sends the decision. Check the city's current checklist for your reason and pension year before applying." },
      ],
      sourceIds: ["nagano-pension-enrollment", "nagano-pension-exemption"], sourceFormatNote: "Nagano City's pension pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "dated", records: ["nagano-address-registration"], from: "2026-09-01", change: "The city shortened and began trialing weekday counter hours in September 2026.", action: "Confirm trial dates and the current general-counter hours, branch offices, and exceptions before filing." },
    { kind: "dated", records: ["nagano-national-health-insurance"], from: "2026-04-01", change: "The city lists electronic enrollment and withdrawal application routes.", action: "Confirm current online eligibility, required records, and counter routes for the person's specific change." },
    { kind: "dated", records: ["nagano-household-waste"], from: "2026-09-24", change: "The FY2026 household waste calendar directory was updated.", action: "Confirm the next fiscal-year district calendar and any corrected collection days." },
    { kind: "tax-year", records: ["nagano-resident-tax"], statement: "Declaration criteria, filing channels, and departure-related payment and representative procedures depend on tax year and individual notices." },
    { kind: "dated", records: ["nagano-disaster-preparation"], from: "2026-07-14", change: "The city updated its designated emergency evacuation and shelter list.", action: "Recheck current hazard-specific sites and live opening status before relying on a facility." },
    { kind: "dated", records: ["nagano-language-and-consultation"], from: "2026-09-01", change: "The city's multilingual information page is updated and consultation information changes over time.", action: "Confirm the current consultation languages, appointment access, and local class program." },
    { kind: "dated", records: ["nagano-national-pension"], from: "2026-09-25", change: "The current pension exemption guidance is updated and application years recur.", action: "Recheck current application period, documents, and electronic filing route for the relevant pension year." },
  ],
});
