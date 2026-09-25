import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Asahikawa City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-01204", name: "Asahikawa City", aliases: ["Asahikawa","Asahikawa-shi"], planGroup: "major-city" },
  sources: [
    { id: "asahikawa-moving", title: "Moving-in notification", url: "https://www.city.asahikawa.hokkaido.jp/800/840/841/p006573.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "asahikawa-nhi", title: "National Health Insurance notifications", url: "https://www.city.asahikawa.hokkaido.jp/kurashi/112/128/003/p004511.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "asahikawa-pension", title: "National Pension enrollment and category changes", url: "https://www.city.asahikawa.hokkaido.jp/kurashi/112/127/129/p006588.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "asahikawa-waste-calendar", title: "Household waste collection calendar by district", url: "https://www.city.asahikawa.hokkaido.jp/kurashi/271/272/273/p005710.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "asahikawa-waste-moving", title: "Household waste guidance for new residents", url: "https://www.city.asahikawa.hokkaido.jp/800/840/841/d055526.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "asahikawa-hazard", title: "Asahikawa consolidated hazard map", url: "https://www.city.asahikawa.hokkaido.jp/kurashi/320/kouzui/d065806.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "asahikawa-foreign-consultation", title: "Foreign resident consultation", url: "https://www.city.asahikawa.hokkaido.jp/1000/1001/sonota/sonota/p003603.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "asahikawa-japanese-study", title: "Japanese language class inquiry", url: "https://www.city.asahikawa.hokkaido.jp/1000/1001/sonota/sonota/p003602.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "asahikawa-tax", title: "2026 municipal and prefectural resident-tax declaration", url: "https://www.city.asahikawa.hokkaido.jp/kurashi/112/113/1141/d070999.html", language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "asahikawa-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Registering an address in Asahikawa", summary: "Asahikawa accepts moving-in notices at the Citizens Division counter or a branch office after you start living at the new address.",
      applicability: "For a home address in Asahikawa; ask the Citizens Division about case-specific documents for a move directly from overseas.",
      responsibleBody: "Asahikawa City", receivingOffice: "Citizens Division counter 3 at City Hall or a city branch office",
      actions: [
        { title: "File the moving-in notice", description: "File within 14 days counted from the day after you begin living at the new address. For a move from another Japanese municipality, bring its moving-out certificate and identity documents. Foreign residents moving in must bring each person's residence card or special permanent resident certificate; people moving from abroad also bring every moving person's passport. Bring a My Number Card for its address update, if you have one." },
        { title: "Arrange a representative if needed", description: "A representative from another household needs the city's authorization form. Check the city page or ask the counter if your previous municipality used card-based moving, as that procedure differs from the ordinary certificate route." },
      ],
      sourceIds: ["asahikawa-moving"], sourceFormatNote: "Asahikawa's moving page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "asahikawa-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Health Insurance in Asahikawa", summary: "Asahikawa lists event-specific documents for joining or leaving its National Health Insurance and accepts a postal notification route.",
      applicability: "For residents whose coverage route is Asahikawa's municipal National Health Insurance; confirm eligibility and contributions with the city.",
      responsibleBody: "Asahikawa City", receivingOffice: "National Health Insurance Division, City Hall",
      actions: [
        { title: "Prepare the matching proof", description: "Report a qualifying coverage or address change within 14 days of the event. A move from another municipality uses the moving-out certificate; leaving another health plan uses its coverage-loss certificate or, in the stated circumstances, the coverage screen in Mynaportal. The city also asks for My Number evidence and identity documents." },
        { title: "Use the city's postal route when appropriate", description: "The city provides a downloadable change form and accepts it by post with copies of event-specific proof and identity documents. Missing information or attachments delay completion. Confirm with the division which documents apply to a move directly from abroad." },
      ],
      sourceIds: ["asahikawa-nhi"], sourceFormatNote: "Asahikawa's National Health Insurance page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "asahikawa-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Household waste in Asahikawa", summary: "Asahikawa publishes collection calendars by district and gives new residents instructions for collection stations and bulky items.",
      applicability: "Use the calendar for your exact district and ask the neighborhood association or building manager which station serves your home.",
      responsibleBody: "Asahikawa City", receivingOffice: "Clean Center for sorting and collection questions",
      actions: [
        { title: "Find your district's calendar", description: "Choose your district in the current fiscal-year calendar. The city says it gives a calendar during the moving-in procedure and can send one if you did not receive it. Collection days vary by area; ask the Clean Center if your street's calendar pattern is unclear." },
        { title: "Check the station and special disposal route", description: "Use only the collection station assigned to your neighborhood or building. The city uses designated paid bags for burnable and non-burnable waste, while bulky waste requires a separate collection request. Large quantities from a move and difficult-to-process items need another disposal route; check the city's list before putting them at the station." },
      ],
      sourceIds: ["asahikawa-waste-calendar", "asahikawa-waste-moving"], sourceFormatNote: "Asahikawa's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "asahikawa-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Resident-tax filing in Asahikawa", summary: "Asahikawa's City Tax Division publishes the assessment-year declaration, document list, and electronic and postal routes.",
      applicability: "Check whether Asahikawa was your January 1 municipality for the assessment year and whether you meet a filing exception; the cited instructions are for the 2026 assessment year.",
      responsibleBody: "Asahikawa City", receivingOffice: "City Tax Division, City Hall third floor tax counter 3",
      actions: [
        { title: "Check whether a city declaration is needed", description: "The city's 2026 instructions address residents living in Asahikawa on January 1 and list exceptions such as salary-only income with completed employer year-end adjustment or an income-tax return. They also describe some cases where a person with no income needs to declare to obtain tax certificates or establish National Health Insurance contributions. Ask the City Tax Division about your own income and filing status." },
        { title: "Use the current year's filing route", description: "The city lists income and deduction evidence, identity and My Number documents, and electronic or postal submission. Check the instructions for your assessment year before using a form, venue, or channel." },
      ],
      sourceIds: ["asahikawa-tax"], sourceFormatNote: "Asahikawa's resident-tax instructions are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "asahikawa-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Disaster planning in Asahikawa", summary: "Asahikawa's consolidated hazard map includes flood, inland flooding, snow, earthquake, outage, and shelter information.",
      applicability: "Check hazards and a suitable shelter for your exact address; follow current city warnings during an event.",
      responsibleBody: "Asahikawa City", receivingOffice: "Disaster Prevention Division for map questions",
      actions: [
        { title: "Inspect your address on the current map", description: "The city published a consolidated map in March 2026, including expanded river and inland-flood layers, shelter lists, and snow and earthquake guidance. It also links a digital map for searching a specific place and district enlargement PDFs. Compare your home, work, and usual routes with the relevant layers before an emergency." },
        { title: "Use live instructions during a hazard", description: "The map shows planning scenarios rather than an open-shelter or safe-route guarantee. Follow current city alerts and shelter-opening information when a hazard occurs." },
      ],
      sourceIds: ["asahikawa-hazard"], sourceFormatNote: "Asahikawa's hazard-map page is in Japanese and links an English map. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "asahikawa-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Language and consultation support in Asahikawa", summary: "The Asahikawa International Center takes daily-life and City Hall procedure questions and is the city's contact for Japanese-study support.",
      applicability: "Ask the center which languages and Japanese classes are currently available before visiting or applying; the cited city FAQs are older.",
      responsibleBody: "Asahikawa City", receivingOffice: "Asahikawa International Center, Feeeal Asahikawa seventh floor",
      actions: [
        { title: "Ask about daily-life procedures", description: "The city FAQ identifies the International Center as a consultation point for daily life and City Hall procedures and says English and Spanish are available. Check current language coverage with the center, as the page is older." },
        { title: "Ask about Japanese study", description: "The city says the International Exchange Committee offers introductory or beginner Japanese classes depending on the period and can advise residents who know no Japanese. Contact the center to confirm current dates, availability, and how to enroll." },
      ],
      sourceIds: ["asahikawa-foreign-consultation", "asahikawa-japanese-study"], sourceFormatNote: "Asahikawa's consultation FAQs are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "asahikawa-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Pension changes in Asahikawa", summary: "Asahikawa handles Category I pension enrollment and category changes at City Hall or its branches, with a Mynaportal route for some changes.",
      applicability: "For residents whose pension category requires a city filing; ask the city or the pension office which route applies after arriving from abroad.",
      responsibleBody: "Asahikawa City", receivingOffice: "Citizens Division National Pension desk at City Hall, a city branch, or Asahikawa Pension Office as directed",
      actions: [
        { title: "Report a category change after leaving work", description: "If you leave employees' pension coverage or a spouse's dependent category, the city lists a Category I filing. Bring your Basic Pension Number notice or My Number Card and proof of the retirement or coverage-loss date. The city describes a Mynaportal application for these changes when using a My Number Card." },
        { title: "Ask which arrival procedure applies", description: "The page says a Japanese national who voluntarily joined while abroad must file for compulsory coverage at the destination municipality after returning. It does not set out every overseas-arrival case; confirm the required filing and documents with the desk or pension office." },
      ],
      sourceIds: ["asahikawa-pension"], sourceFormatNote: "Asahikawa's pension page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "gap", records: ["asahikawa-address-registration"], gap: "The moving page mentions passports for arrivals from overseas but does not set out every nationality or family-record case; confirm case-specific documents." },
    { kind: "gap", records: ["asahikawa-national-health-insurance"], gap: "The National Health Insurance page does not separately specify documents for enrollment directly from overseas." },
    { kind: "dated", records: ["asahikawa-household-waste"], from: "2026-04-01", change: "The cited district calendar covers the 2026 fiscal year.", action: "Check the replacement district calendars for the next fiscal year." },
    { kind: "tax-year", records: ["asahikawa-resident-tax"], statement: "Review the assessment-year forms, filing exceptions, and submission routes before applying this guidance to a later tax year." },
    { kind: "dated", records: ["asahikawa-disaster-preparation"], from: "2026-03-04", change: "The city published its consolidated hazard map with new river and inland-flood layers.", action: "Check for revised layers and shelter information." },
    { kind: "old-source", records: ["asahikawa-language-and-consultation"], source: "Asahikawa City foreign consultation and Japanese-study FAQs", date: "2021-02-01" },
    { kind: "gap", records: ["asahikawa-national-pension"], gap: "The city page does not give the full filing route and document list for foreign residents moving directly from overseas." },
  ],
});
