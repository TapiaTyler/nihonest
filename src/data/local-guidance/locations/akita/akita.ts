import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Akita City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-05201", name: "Akita City", aliases: ["Akita", "Akita-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "akita-address-registration", title: "Moving to Akita City from outside the city or from overseas", url: "https://www.city.akita.lg.jp/kurashi/todokede-shomei/1005347/1027316.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "akita-national-health-insurance", title: "National Health Insurance notifications", url: "https://www.city.akita.lg.jp/kurashi/hoken-nenkin/1005311/1004000.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "akita-household-waste-collection", title: "Household waste collection and calendars", url: "https://www.city.akita.lg.jp/kurashi/recycle/1006079/1006195.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "akita-household-waste-guide", title: "Household waste sorting and disposal guide", url: "https://www.city.akita.lg.jp/kurashi/recycle/1006071/1010211/1006164.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "akita-resident-tax-declaration", title: "FY2026 resident-tax declaration", url: "https://www.city.akita.lg.jp/kurashi/zeikin/1003649/1002758.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "akita-resident-tax-overview", title: "Individual resident tax overview", url: "https://www.city.akita.lg.jp/kurashi/zeikin/1003649/1002757.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "akita-water-hazard-map", title: "Flood hazard map", url: "https://www.city.akita.lg.jp/bosai-kinkyu/1033802.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "akita-japanese-language-class", title: "Akita City Japanese Language Class", url: "https://www.city.akita.lg.jp/shisei/1033599/1033605/1033961/1033963.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "akita-foreign-resident-consultation", title: "Consultation information for foreign residents", url: "https://www.city.akita.lg.jp/shisei/1033599/1033607/1033667.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "akita-national-pension", title: "National Pension notifications", url: "https://www.city.akita.lg.jp/kurashi/hoken-nenkin/1005312/1004022.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "akita-pension-exemptions", title: "National Pension exemption and payment-postponement applications", url: "https://www.city.akita.lg.jp/kurashi/hoken-nenkin/1005312/1004013.html", language: "ja", lastCheckedAt: "2026-09-26" },
  ],
  supplements: [
    {
      id: "akita-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Registering an overseas move to Akita City", summary: "Akita City lists documents for overseas arrivals and accepts address notifications at City Hall, service centers, the station service counter, and local offices.",
      applicability: "For people moving to Akita City from overseas. Family relationships and individual records can affect the documents required.", responsibleBody: "Akita City", receivingOffice: "Resident Records Section, Citizens Affairs Division, City Hall, or an eligible city service counter",
      actions: [
        { title: "File within the city's notification period", description: "Akita City says to file within 14 days after moving. Its current page lists the City Hall Citizens Affairs Division, citizen service centers, Akita Station East Service Center, and local liaison offices. Check the counter's current hours before visiting." },
        { title: "Bring the documents for your arrival and household", description: "Foreign residents should bring a residence card or Special Permanent Resident Certificate and documents confirming family relationships, with a Japanese translation. A passport is listed if a residence card was not issued on arrival and the passport was stamped to show later issuance. A person outside the household needs a letter of authorization. Contact the Resident Records Section if your family records differ." },
      ],
      sourceIds: ["akita-address-registration"], sourceFormatNote: "Akita City's procedure is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "akita-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Health Insurance procedures in Akita City", summary: "Akita City requires residents to handle enrollment and withdrawal themselves and offers electronic procedures for listed events; required identification and counters depend on the event.",
      applicability: "Use the city procedure only if municipal National Health Insurance is the appropriate coverage route for you. Confirm the requirements for your coverage event.", responsibleBody: "Akita City", receivingOffice: "National Health Insurance and Pension Division, City Hall, or a listed citizen service center or liaison office",
      actions: [
        { title: "Report a coverage change and check documents", description: "The city says National Health Insurance changes must be reported within 14 days. It asks for identity and My Number records and links event-specific checklists, including proof of lost workplace coverage when applicable. Separate-household representatives need authorization. Check the city's current list for the exact event and receiving office." },
        { title: "Use an available electronic filing route", description: "Akita City accepts electronic filing for listed enrollment and withdrawal procedures through a computer or smartphone. The page also lists counters for in-person cases and some location-specific services. Confirm online eligibility and current document requirements before submitting; enrollment and withdrawal are not automatic when workplace coverage changes." },
      ],
      sourceIds: ["akita-national-health-insurance"], sourceFormatNote: "Akita City's procedure is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "akita-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Household waste in Akita City", summary: "Akita City publishes district-specific collection calendars, multilingual sorting guides, and current set-out instructions; bulky waste requires advance application.",
      applicability: "For household waste in Akita City. Collection days and service details depend on the neighborhood and current city calendar.", responsibleBody: "Akita City", receivingOffice: "Environmental City Promotion Division; ask the city or building manager about the collection point for your address",
      actions: [
        { title: "Look up your district's collection calendar", description: "Akita City provides calendars by area and multilingual sorting guides in English, Chinese, Korean, Tagalog, and Myanmar. It also offers a sorting search through the official city LINE account. Check the calendar for your exact neighborhood because collection days differ by area." },
        { title: "Follow current set-out instructions", description: "The city's current collection page asks households to put waste at the collection point between 6 and 8 a.m. on collection day, and to secure food-waste bags to limit odors that attract bears. Bulky waste requires an advance application; use the current city procedure for excluded items and fees." },
      ],
      sourceIds: ["akita-household-waste-collection", "akita-household-waste-guide"], sourceFormatNote: "Akita City's waste information is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "akita-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Resident-tax declarations in Akita City", summary: "Akita City publishes year-specific declaration requirements and accepts postal, electronic, and in-person submissions; check the current tax-year page and your own notice.",
      applicability: "For people whose resident-tax declaration or payment is handled by Akita City. Your filing obligation and responsible municipality depend on the relevant tax year and personal circumstances.", responsibleBody: "Akita City", receivingOffice: "Individual Resident Tax Section, Tax Division, City Hall, or a listed service center for forms and local filing sessions",
      actions: [
        { title: "Check the current declaration rules", description: "Akita City's FY2026 page describes who may need a city and prefectural resident-tax return, which documents to prepare, and postal, electronic, and in-person filing options. It says a national tax return generally removes the need for a separate city return. Use the page for the applicable year and ask the Individual Resident Tax Section whether you need to file." },
        { title: "Check your notice and departure procedure", description: "The city explains that resident tax is based on the prior year's income and the municipality where you live on January 1 of the tax year. Its personal-tax page describes ordinary payment and payroll or pension withholding. Deadlines, notices, and channels change by year; follow your own notice and contact the city about appointing a tax representative before leaving Japan." },
      ],
      sourceIds: ["akita-resident-tax-declaration", "akita-resident-tax-overview"], sourceFormatNote: "Akita City's tax information is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "akita-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Flood preparation and evacuation in Akita City", summary: "Akita City provides area-specific flood hazard maps and guidance for checking hazards, evacuation locations, and routes; use current municipal alerts during an event.",
      applicability: "For people living, working, or studying in Akita City. Choose a map for the exact area and check hazards relevant to each location.", responsibleBody: "Akita City", receivingOffice: "Disaster Safety Measures Division; consult the relevant service center for local details",
      actions: [
        { title: "Check the map for your neighborhood", description: "The city's flood hazard page divides its maps into local areas and provides a scrollable online version. It explains that map and information panels together help residents consider hazards, evacuation places, and routes. Check your home, work, and school addresses against the appropriate map." },
        { title: "Recheck updated areas and follow live instructions", description: "Akita City updated maps 1 and 10 in March 2025 after additional river flood zones were designated, and notes that other river data may not yet appear on the published map. Review the current map notes and municipal alerts; a planning map does not indicate whether a shelter is currently open." },
      ],
      sourceIds: ["akita-water-hazard-map"], sourceFormatNote: "Akita City's disaster information is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "akita-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Japanese classes and consultation for foreign residents in Akita City", summary: "Akita City runs a Japanese class for city residents and links to the prefectural foreign-resident consultation center for multilingual help.",
      applicability: "Class eligibility is limited to people living in Akita City. Confirm the current class calendar and consultation languages with the providers.", responsibleBody: "Akita City", receivingOffice: "International and Intercity Exchange Section, Policy Planning Division; classes meet at Nigiwai Koryukan AU",
      actions: [
        { title: "Apply for the city's Japanese class", description: "The city says its class is open to Akita residents, is taught in Japanese, and has no tuition charge, though students buy their textbook. Applicants use an online form, complete an online level check, and follow the current class calendar. Contact the Policy Planning Division if you need help with application steps or current class availability." },
        { title: "Use the multilingual consultation referral", description: "Akita City's foreign-resident information page links to the Akita Prefecture foreign-resident consultation center, which offers consultation by phone and email in multiple languages. Confirm the center's current language availability and hours on its own page before contacting it." },
      ],
      sourceIds: ["akita-japanese-language-class", "akita-foreign-resident-consultation"], sourceFormatNote: "Akita City's support information is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "akita-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Pension procedures in Akita City", summary: "Akita City lists city-counter and electronic routes for eligible National Pension changes and exemptions; workplace changes are handled by the employer.",
      applicability: "For residents whose National Pension event can be handled by the municipality. Confirm whether your employment or dependent category changes the filing route.", responsibleBody: "Akita City", receivingOffice: "National Health Insurance and Pension Division, City Hall, or a listed service center or liaison office",
      actions: [
        { title: "Report an employment or dependent-status change", description: "The city lists local notifications when a person under 60 leaves workplace pension coverage or stops being a spouse's dependent. Bring identity and My Number records plus evidence of the relevant loss of coverage. A new workplace handles enrollment in employees' pension, so a separate city filing is not required for that event." },
        { title: "Ask about contribution relief and electronic options", description: "Akita City's exemption guidance lists identity and My Number records and, for unemployment-related requests, documents such as an employment-insurance separation notice. The city also links electronic filing for listed enrollment and exemption procedures. Confirm which office and current documents apply to your situation." },
      ],
      sourceIds: ["akita-national-pension", "akita-pension-exemptions"], sourceFormatNote: "Akita City's pension information is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "dated", records: ["akita-household-waste"], from: "2026-06-02", change: "The city published seasonal bear-safety instructions for when and how to set household waste out." , action: "Confirm the current seasonal collection and wildlife-safety instructions and exact-area calendar." },
    { kind: "old-source", records: ["akita-household-waste"], source: "akita-household-waste-guide", date: "2019-03-01" },
    { kind: "tax-year", records: ["akita-resident-tax"], statement: "Confirm the current year's declaration requirements, filing period and channels, notices and payment instructions, and the procedure for appointing a tax representative before departure." },
    { kind: "dated", records: ["akita-disaster-preparation"], from: "2025-03-01", change: "Flood hazard maps 1 and 10 were revised after additional river flood zones were designated; later river data may not appear in the maps." , action: "Check current map coverage and updates from the city and prefecture for the relevant address." },
    { kind: "dated", records: ["akita-language-and-consultation"], from: "2026-04-07", change: "The city Japanese class uses a dated class calendar." , action: "Confirm the current calendar, application availability, teaching venue, and textbook requirements." },
  ],
});
