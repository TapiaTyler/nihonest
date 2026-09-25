import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Takasaki City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-10202", name: "Takasaki City", aliases: ["Takasaki", "Takasaki-shi"], planGroup: "major-city" },
  sources: [
    { id: "takasaki-address-overseas", title: "Moving to Takasaki from overseas", url: "https://www.city.takasaki.gunma.jp/page/2248.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takasaki-national-health-insurance", title: "National Health Insurance procedure list", url: "https://www.city.takasaki.gunma.jp/page/3604.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takasaki-household-waste", title: "Household waste sorting and disposal", url: "https://www.city.takasaki.gunma.jp/page/2171.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takasaki-disaster-hazard-maps", title: "Takasaki hazard maps", url: "https://www.city.takasaki.gunma.jp/page/3242.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takasaki-disaster-shelters", title: "Designated evacuation shelters", url: "https://www.city.takasaki.gunma.jp/page/3346.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takasaki-foreign-resident-support", title: "Takasaki Consultation Center for Foreign Residents", url: "https://www.city.takasaki.gunma.jp/page/60923.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takasaki-international-association", title: "Takasaki International Association", url: "https://www.city.takasaki.gunma.jp/page/3320.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takasaki-national-pension", title: "National Pension procedures", url: "https://www.city.takasaki.gunma.jp/page/3612.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takasaki-resident-tax-notice", title: "FY2026 resident-tax notices and payment", url: "https://www.city.takasaki.gunma.jp/page/72237.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takasaki-resident-tax-filing", title: "City and prefectural resident-tax declarations", url: "https://www.city.takasaki.gunma.jp/page/3809.html", language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "takasaki-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Registering an overseas move to Takasaki", summary: "Takasaki handles overseas move-in notifications at City Hall, branch offices, and citizen service centers; foreign residents must use an eligible counter rather than a service center.",
      applicability: "For people moving to Takasaki from abroad. Confirm the documents for your household and the receiving counter before visiting.", responsibleBody: "Takasaki City", receivingOffice: "Citizens Affairs Division at City Hall, branch Citizens and Welfare Divisions, or an eligible Citizen Service Center",
      actions: [
        { title: "File after arriving at your Takasaki address", description: "Submit the overseas move-in notification within 14 days after moving to Takasaki. The city lists City Hall's Citizens Affairs Division, branch Citizens and Welfare Divisions, and citizen service centers. Foreign residents' residence-card address changes cannot be handled at citizen service centers, so use City Hall or a branch office." },
        { title: "Bring entry and residence records", description: "The city asks for identification and each mover's passport showing the return date. Foreign residents should bring each person's residence card or Special Permanent Resident Certificate; a document proving the relationship to the household head and its Japanese translation may also be required. A representative needs the city's authorization form. Ask the Citizens Affairs Division if your household records differ." },
      ],
      sourceIds: ["takasaki-address-overseas"], sourceFormatNote: "Takasaki City's procedure is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "takasaki-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Health Insurance in Takasaki", summary: "Takasaki lists the counter and supporting documents for enrolling after a move or loss of workplace coverage; changes generally must be reported within 14 days.",
      applicability: "Use the city route only if municipal National Health Insurance is the appropriate coverage for you. The required proof depends on why coverage is changing.", responsibleBody: "Takasaki City", receivingOffice: "Citizens Affairs Division or a branch Citizens and Welfare Division for move-related changes; Insurance and Pension Division for workplace coverage changes",
      actions: [
        { title: "Report an enrollment event with its supporting records", description: "The city asks residents to report qualifying National Health Insurance changes within 14 days. After moving from another municipality, its list calls for the moving-out certificate and My Number information. When workplace coverage ends, bring proof that coverage ended and My Number information. The counter depends on the event; confirm it in the city's procedure list." },
        { title: "Check identity and proxy requirements", description: "Takasaki says National Health Insurance procedures require My Number information and identity verification. A representative other than the household head or a household member needs authorization and their own identity document. Ask the Insurance and Pension Division which qualification document will be issued and about household-specific premium questions." },
      ],
      sourceIds: ["takasaki-national-health-insurance"], sourceFormatNote: "Takasaki City's procedure is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "takasaki-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Household waste in Takasaki", summary: "Takasaki publishes waste sorting information and fiscal-year calendars by area; collection days can vary by neighborhood and even within the same neighborhood association.",
      applicability: "Use the current calendar for your address and ask your building manager about the collection station and building-specific rules.", responsibleBody: "Takasaki City", receivingOffice: "General Waste Management Division; consult the relevant branch for area-specific details",
      actions: [
        { title: "Find the sorting guide and calendar for your area", description: "Use the city's household-waste page for the current fiscal-year sorting guide and collection calendar. Takasaki divides its information by areas including Takasaki, Kurabuchi, Misato, Gunma, Shin, Haruna, and Yoshii. The city cautions that collection days can differ even within the same neighborhood association, so look up the exact address or ask your building manager." },
        { title: "Check a separate route for bulky or excluded items", description: "The city links separate guidance for oversized waste and other items that do not follow ordinary collection rules. Check the current city page or contact the General Waste Management Division before disposal; do not rely on another address's collection day." },
      ],
      sourceIds: ["takasaki-household-waste"], sourceFormatNote: "Takasaki City's waste information is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "takasaki-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Hazard maps and evacuation shelters in Takasaki", summary: "Takasaki publishes hazard maps for five areas and a designated-shelter list; the city says its 2023 map edition may be superseded by the online map system.",
      applicability: "Risks and suitable evacuation places depend on your address and the hazard. Check the online map and follow current city alerts during an emergency.", responsibleBody: "Takasaki City", receivingOffice: "Disaster Prevention and Safety Division; ask the relevant branch about address-specific details",
      actions: [
        { title: "Check the hazard map for your area", description: "Takasaki's map page divides the city into five areas and provides flood and other disaster information. The page states that the printed/PDF maps reflect March 2023 and directs residents to the city's map information system for the latest map. Check your home, work, and school locations against the relevant hazards." },
        { title: "Choose a suitable shelter and monitor live instructions", description: "The city lists designated evacuation shelters and links to a map service; it says residents may evacuate to any listed shelter during a disaster, considering distance and road conditions. Check which sites are suitable for the hazard and follow current city alerts and directions, since conditions and openings can change." },
      ],
      sourceIds: ["takasaki-disaster-hazard-maps", "takasaki-disaster-shelters"], sourceFormatNote: "Takasaki City's disaster information is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "takasaki-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Foreign-resident consultation and Japanese learning in Takasaki", summary: "Takasaki City Hall's Consultation Center for Foreign Residents offers multilingual life and procedure consultations; the city's International Association supports Japanese-language learning activities.",
      applicability: "Confirm the current language, appointment, class, and participation details with the relevant service before relying on it.", responsibleBody: "Takasaki City", receivingOffice: "Consultation Center for Foreign Residents, City Hall second floor; contact the International Association for Japanese-learning support",
      actions: [
        { title: "Contact the foreign-resident consultation center", description: "The city center can discuss municipal procedures, taxes, housing, childcare, and Japanese learning in multiple languages. The page lists staff-supported languages and video interpretation for additional languages during the center's stated weekday service period. Contact the center to confirm that your language and consultation method are available." },
        { title: "Ask about Japanese-learning opportunities", description: "Takasaki's International Association lists support for foreign residents' Japanese learning, including volunteer-led classes. Its city page does not provide a current class schedule or enrollment details, so contact the association or city International Affairs Division to confirm venues, dates, and participation requirements." },
      ],
      sourceIds: ["takasaki-foreign-resident-support", "takasaki-international-association"], sourceFormatNote: "Takasaki City's support pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "takasaki-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Pension procedures in Takasaki", summary: "Takasaki's Pension Section lists documents for pension-category changes, including loss of workplace or dependent coverage; its procedure page is dated 2023.",
      applicability: "Your enrollment route depends on your pension category and employment. Ask the city or Japan Pension Service which office handles your situation and what current records are needed.", responsibleBody: "Takasaki City", receivingOffice: "Insurance and Pension Division, Pension Section",
      actions: [
        { title: "Bring evidence when workplace or dependent coverage ends", description: "For loss of workplace pension coverage or a change out of a spouse's dependent status, the city's list asks for proof that social insurance ended and My Number or pension-number records with identity verification. A representative needs the city's pension authorization form and their identity document. Contact the Pension Section before relying on this older list." },
        { title: "Ask about exemptions and other cases", description: "Takasaki links to procedures for contribution exemptions, payment postponement, student payment exceptions, and other pension events. The cited city page does not establish which route applies to every newcomer; confirm current requirements with the Pension Section or Japan Pension Service." },
      ],
      sourceIds: ["takasaki-national-pension"], sourceFormatNote: "Takasaki City's pension information is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "takasaki-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Resident tax in Takasaki", summary: "Takasaki explains current-year resident-tax notices, payment channels, and city declaration routes; its notice page applies specifically to FY2026.",
      applicability: "Check the tax year and municipality named on your notice. Filing and payment obligations depend on your circumstances; confirm departures and other individual cases with the City Tax Division.", responsibleBody: "Takasaki City", receivingOffice: "City Tax Division for declarations; Tax Collection Division or branch tax offices for payments",
      actions: [
        { title: "Check whether a city declaration is needed", description: "Takasaki's declaration page describes who may need a city and prefectural resident-tax return and allows postal submission and electronic preparation for listed cases. Use the guide for the relevant fiscal year and contact the City Tax Division if your filing obligation is unclear." },
        { title: "Follow your notice and current payment instructions", description: "The city's FY2026 page describes notice timing, installment deadlines, and listed payment methods, including counters, financial institutions, convenience stores, Pay-easy, credit card, smartphone apps, and account transfer when available. These dates and channels are year-specific; follow your own notice and ask the city about payment arrangements or departure procedures." },
      ],
      sourceIds: ["takasaki-resident-tax-notice", "takasaki-resident-tax-filing"], sourceFormatNote: "Takasaki City's tax information is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "dated", records: ["takasaki-household-waste"], from: "2026-04-01", change: "The cited sorting page links to fiscal-year-specific collection calendars.", action: "Replace the calendar reference with the current fiscal-year edition and reconfirm area-specific schedules." },
    { kind: "old-source", records: ["takasaki-disaster-preparation"], source: "takasaki-disaster-hazard-maps", date: "2023-12-18" },
    { kind: "old-source", records: ["takasaki-language-and-consultation"], source: "takasaki-international-association", date: "2024-07-18" },
    { kind: "old-source", records: ["takasaki-national-pension"], source: "takasaki-national-pension", date: "2023-12-18" },
    { kind: "tax-year", records: ["takasaki-resident-tax"], statement: "Confirm current-year declaration requirements, notice dates, payment deadlines and channels, and procedures for a person moving abroad." },
    { kind: "gap", records: ["takasaki-resident-tax"], gap: "The cited pages do not explain the procedure for appointing a tax representative before leaving Japan; confirm current requirements with the City Tax Division." },
    { kind: "gap", records: ["takasaki-language-and-consultation"], gap: "The cited city page does not give a current Japanese-class schedule or enrollment requirements; check availability and details with the provider." },
  ],
});
