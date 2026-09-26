import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Maebashi City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-10201", name: "Maebashi City", aliases: ["Maebashi", "Maebashi-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "maebashi-address-registration", title: "Moving into Maebashi from another municipality or overseas", url: "https://www.city.maebashi.gunma.jp/soshiki/shimin/shimin/gyomu/2/8/37868.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "maebashi-national-health-insurance", title: "National Health Insurance notifications and procedures", url: "https://www.city.maebashi.gunma.jp/soshiki/kenko/kokuminkenkohoken/gyomu/3/6/4802.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "maebashi-household-waste", title: "Household waste sorting and collection", url: "https://www.city.maebashi.gunma.jp/soshiki/kankyo/gomiseisaku/gyomu/2_2/index.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "maebashi-resident-tax-notices", title: "FY2026 resident-tax notices and payment", url: "https://www.city.maebashi.gunma.jp/kurashi_tetsuzuki/6/1/40950.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "maebashi-resident-tax-declaration", title: "Resident-tax declarations", url: "https://www.city.maebashi.gunma.jp/soshiki/zaimu/shiminzei/gyomu/3/1/6754.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "maebashi-disaster-hazard-map", title: "Flood and landslide hazard map", url: "https://www.city.maebashi.gunma.jp/soshiki/somu/bousaikikikanrika/gyomu/2/hazardmap/34075.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "maebashi-foreign-resident-consultation", title: "Foreign-resident consultation service", url: "https://www.city.maebashi.gunma.jp/soshiki/bunkasupotsukanko/bunkakokusai/gyomu/2/4796.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "maebashi-national-pension", title: "National Pension information for foreign residents", url: "https://www.city.maebashi.gunma.jp/soshiki/bunkasupotsukanko/bunkakokusai/1/1/3/50997.html", language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "maebashi-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Registering an overseas move to Maebashi", summary: "Maebashi's resident-registration page explains overseas move-in documents and receiving counters; foreign residents should bring their passport and residence card or Special Permanent Resident Certificate.",
      applicability: "For people moving to Maebashi from overseas. Confirm household-specific records and the receiving counter with the city before visiting.", responsibleBody: "Maebashi City", receivingOffice: "Resident Section, Citizens Affairs Division, City Hall, or an eligible branch or citizen service center",
      actions: [
        { title: "Bring overseas-arrival records", description: "For an overseas move-in, Maebashi asks Japanese nationals for each mover's passport and family-register certificate (not needed when the registered domicile is Maebashi). Foreign nationals should bring each mover's passport showing the arrival date and residence card or Special Permanent Resident Certificate. If the residence card has not yet been issued, bring the passport notation confirming this." },
        { title: "File at an eligible city counter", description: "The city says a move-in notification is due within 14 days after moving. It lists City Hall, five branch offices, and five citizen service centers; confirm the exact counter in advance, especially for a new address in a land-readjustment area. A proxy needs a letter of authorization and identification. The city's page is dated 2023, so recheck current counters and document instructions." },
      ],
      sourceIds: ["maebashi-address-registration"], sourceFormatNote: "Maebashi City's procedure is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "maebashi-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Health Insurance procedures in Maebashi", summary: "Maebashi lists in-person, electronic, and postal routes for National Health Insurance changes and gives event-specific documents; the procedure page is older, so confirm current requirements.",
      applicability: "Use the municipal route only if National Health Insurance is the appropriate coverage for you. Requirements depend on why coverage is changing.", responsibleBody: "Maebashi City", receivingOffice: "National Health Insurance Division at City Hall or a listed branch office; some move-related notifications are accepted at citizen service centers",
      actions: [
        { title: "Check documents for your coverage change", description: "For a workplace-insurance change, the city lists a certificate showing loss of workplace coverage for joining, or proof of the new insurance for leaving. It also requires identity documents; other events have their own document list. The city notes that some records can be checked through an insurance-data inquiry or employer contact, but this may not work in every case." },
        { title: "Use the correct filing route", description: "The city's procedure page lists the National Health Insurance Division and designated branches for enrollment or withdrawal and says electronic and postal filing are also available. Move notifications use separate counters. Confirm current forms and the route for your event with the city; do not assume that joining or leaving workplace insurance updates municipal enrollment automatically." },
      ],
      sourceIds: ["maebashi-national-health-insurance"], sourceFormatNote: "Maebashi City's procedure is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "maebashi-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Household waste in Maebashi", summary: "Maebashi publishes fiscal-year collection calendars and sorting guidance; collection days depend on the local calendar for the address.",
      applicability: "For household waste in Maebashi. Check the current calendar for your neighborhood and confirm your building's collection point with its manager.", responsibleBody: "Maebashi City", receivingOffice: "Waste Policy Division for sorting guidance; Waste Collection Division for collection-point and collection-day issues",
      actions: [
        { title: "Find the calendar for your area", description: "The city's household-waste page links to separate first-half and second-half FY2026 collection calendars, text versions, sorting rules, and a foreign-language sorting guidebook. Use the exact-area calendar because schedules vary by neighborhood, and check the current edition before putting items out." },
        { title: "Follow local set-out rules and check special items", description: "The city requires household waste to be sorted and placed in the designated bag at the designated collection place on the scheduled day. Check the current area's calendar for set-out instructions and separate city rules for oversized waste, appliances, batteries, or other excluded items. Ask the building manager or city about the correct collection point for your address." },
      ],
      sourceIds: ["maebashi-household-waste"], sourceFormatNote: "Maebashi City's waste information is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "maebashi-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Resident-tax declarations and payments in Maebashi", summary: "Maebashi explains resident-tax declarations and current FY2026 notice and payment channels; use your own notice and verify year-specific deadlines.",
      applicability: "For people whose resident tax is handled by Maebashi. The responsible municipality and filing obligations depend on the relevant tax year and your circumstances.", responsibleBody: "Maebashi City", receivingOffice: "Individual Resident Tax Section for declarations; Tax Collection Division for payments",
      actions: [
        { title: "Check whether a city declaration is needed", description: "Maebashi's declaration page explains the yearly filing process, encourages postal submission, and links electronic submission guidance for a limited case. It says a national income-tax return generally removes the need for a separate city declaration. Ask the Individual Resident Tax Section whether your income and documentation require a local filing." },
        { title: "Follow the notice for the relevant year", description: "The city's FY2026 notice page says the tax applies based on the address on January 1, 2026, and lists four ordinary-collection deadlines: June 30, August 31, November 2, and February 1 of the following year. It lists city counters, branches, service centers, financial institutions, convenience stores, and eL-QR payment. These dates and channels are year-specific; follow your notice and ask the city about departure procedures." },
      ],
      sourceIds: ["maebashi-resident-tax-notices", "maebashi-resident-tax-declaration"], sourceFormatNote: "Maebashi City's tax information is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "maebashi-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Flood and landslide preparation in Maebashi", summary: "Maebashi's June 2026 disaster map covers flood and landslide hazards, planned evacuation shelters, and earthquake guidance; use the address-level map and current alerts.",
      applicability: "For people living, working, or studying in Maebashi. Choose locations and routes based on the exact address and the hazard in question.", responsibleBody: "Maebashi City", receivingOffice: "Disaster Management Division; ask the relevant branch or citizen service center for map distribution",
      actions: [
        { title: "Check the updated hazard map", description: "The city says its flood and landslide map covers northern and southern areas and shows planned designated evacuation shelters. It was revised in June 2026, including updates to earthquake information and disaster-weather terminology. Check your exact home, work, and school locations in the map or the city's Sachizu Maebashi viewer." },
        { title: "Use current instructions during an emergency", description: "The map is planning information, not a live shelter-opening notice. Check current municipal alerts and directions during an event, and confirm a shelter is suitable for the hazard affecting your location. City Hall, branches, and citizen service centers distribute the printed map." },
      ],
      sourceIds: ["maebashi-disaster-hazard-map"], sourceFormatNote: "Maebashi City's disaster information is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "maebashi-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Foreign-resident consultation in Maebashi", summary: "Maebashi offers foreign-resident consultation in five listed languages, remote interpretation, and email support; the city page also points to the International Association for Japanese-learning information.",
      applicability: "Confirm language availability, appointment arrangements, and current service details with the provider before relying on them.", responsibleBody: "Maebashi City", receivingOffice: "Foreign-resident consultation counter, City Hall second floor; Culture and International Affairs Division on other weekdays",
      actions: [
        { title: "Contact the multilingual consultation service", description: "The city lists English, Portuguese, Spanish, Chinese, and Vietnamese support at its foreign-resident counter, as well as remote interpretation on weekdays and email consultation in the listed languages. The cited page was last updated in 2023; contact the city or Maebashi International Association to confirm current language and service availability." },
        { title: "Ask about Japanese-learning options", description: "The city page links to the Maebashi International Association, but the cited page does not provide a current Japanese-class schedule or enrollment details. Contact the association or Culture and International Affairs Division to ask about classes, venues, dates, participation conditions, and any costs." },
      ],
      sourceIds: ["maebashi-foreign-resident-consultation"], sourceFormatNote: "Maebashi City's support information is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "maebashi-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Pension procedures in Maebashi", summary: "Maebashi's foreign-resident guide identifies city counters and records for enrollment and contribution-exemption applications; employment and dependent status determine the route.",
      applicability: "For residents whose pension event can be handled by the city. Workplace and dependent-category changes may need to be handled through an employer.", responsibleBody: "Maebashi City", receivingOffice: "Pension Section, Citizens Affairs Division, City Hall, or the listed branch citizen-service desks",
      actions: [
        { title: "Ask which category and counter apply", description: "The city's foreign-resident page says enrollment notifications for eligible residents and contribution-exemption or postponement applications are handled by the Pension Section or listed branches. It asks filers to bring a My Number Card or notification card and identification; a proxy needs authorization documents. Company employees and dependents follow workplace routes for applicable changes." },
        { title: "Prepare records for your event", description: "For a workplace-to-National-Pension category change, the city lists proof that social insurance ended; for exemption or postponement it lists relevant records such as employment-insurance separation documents or a student card. Contact the Pension Section to confirm current documents and whether a branch can handle your particular case." },
      ],
      sourceIds: ["maebashi-national-pension"], sourceFormatNote: "Maebashi City's pension information is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "old-source", records: ["maebashi-address-registration"], source: "maebashi-address-registration", date: "2023-07-15" },
    { kind: "old-source", records: ["maebashi-national-health-insurance"], source: "maebashi-national-health-insurance", date: "2022-03-14" },
    { kind: "old-source", records: ["maebashi-household-waste"], source: "maebashi-household-waste", date: "2019-02-01" },
    { kind: "dated", records: ["maebashi-household-waste"], from: "2026-04-01", change: "The city publishes fiscal-year and half-year collection calendars." , action: "Replace the cited fiscal-year calendar details with the current edition and reconfirm address-specific collection days." },
    { kind: "tax-year", records: ["maebashi-resident-tax"], statement: "Confirm the responsible municipality, declaration rules, notice timing, payment deadlines and channels, and the procedure for a person moving abroad for the applicable tax year." },
    { kind: "gap", records: ["maebashi-resident-tax"], gap: "The cited pages do not explain how to appoint a tax representative before leaving Japan; confirm current requirements with the Individual Resident Tax Section." },
    { kind: "dated", records: ["maebashi-disaster-preparation"], from: "2026-06-01", change: "The city revised its comprehensive disaster map in June 2026." , action: "Check the current map revision, hazard layers, terminology, and shelter information." },
    { kind: "old-source", records: ["maebashi-language-and-consultation"], source: "maebashi-foreign-resident-consultation", date: "2023-02-06" },
    { kind: "gap", records: ["maebashi-language-and-consultation"], gap: "The cited page does not give a current Japanese-language class schedule, enrollment rules, or costs; confirm these details with the association or city." },
  ],
});
