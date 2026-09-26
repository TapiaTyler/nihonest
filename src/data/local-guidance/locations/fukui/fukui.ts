import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Fukui City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-18201", name: "Fukui City", aliases: ["Fukui","Fukui-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "fukui-overseas-move", title: "Moving to Fukui City from overseas", url: "https://www.city.fukui.lg.jp/kurasi/todoke/idou/p021690.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukui-nhi", title: "National Health Insurance procedures", url: "https://www.city.fukui.lg.jp/fukusi/hoken/seido/kokuho_kanyusya.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukui-waste", title: "Household waste sorting and collection", url: "https://www.city.fukui.lg.jp/kurasi/kankyo/kgomi/katei.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukui-tax", title: "Municipal and prefectural resident tax declaration", url: "https://www.city.fukui.lg.jp/kurasi/tax/kojin/sinkokuosirase.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukui-tax-forms", title: "Resident-tax forms and submission", url: "https://www.city.fukui.lg.jp/kurasi/tax/kojin/p017934.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukui-hazard-map", title: "Flood and landslide hazard maps", url: "https://www.city.fukui.lg.jp/kurasi/koutu/kasen/p010331.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukui-shelters", title: "Designated evacuation shelters and places", url: "https://www.city.fukui.lg.jp/kurasi/bosai/shelter/hinanjyo-hinanbasyo.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukui-foreign-support", title: "Information for foreign residents", url: "https://www.city.fukui.lg.jp/kurasi/mati/international/p001417.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukui-japanese-lessons", title: "Japanese lessons", url: "https://www.city.fukui.lg.jp/foreign/english/japaneselesson.html", language: "en", lastCheckedAt: "2026-09-25" },
    { id: "fukui-pension", title: "National Pension system and notifications", url: "https://www.city.fukui.lg.jp/fukusi/hoken/nenkin/nenkin00.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukui-pension-move", title: "National Pension after moving in", url: "https://www.city.fukui.lg.jp/support/movein/p050153.html", language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "fukui-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Registering an overseas move to Fukui City", summary: "Fukui City takes overseas move-in notices at Citizens Division counter 5, with limited liaison-office options for foreign residents.",
      applicability: "For people moving to Fukui City from overseas; the city has different counter rules for foreign residents.", responsibleBody: "Fukui City", receivingOffice: "Citizens Division counter 5 at City Hall; for foreign residents, Miyama, Shimizu, or Koshino liaison office may also accept an overseas move-in",
      actions: [
        { title: "File after arrival at an eligible counter", description: "Notify the city within 14 days after moving in; advance filing is unavailable. Foreign residents arriving from overseas may use City Hall counter 5 or the Miyama, Shimizu, or Koshino liaison office. The city says service centers, online submission, and fax cannot accept this notice, and other liaison offices cannot accept a foreign resident's overseas move-in." },
        { title: "Bring identity and arrival documents", description: "Bring the residence card issued at the airport or passport if no card was issued. The city also lists identity documents for the person filing and My Number cards if held. An agent outside the household needs a signed authorization and their own identification; confirm additional records if joining a household." },
      ], sourceIds: ["fukui-overseas-move"], sourceFormatNote: "The city procedure is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "fukui-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Health Insurance changes in Fukui City", summary: "Fukui City provides event-specific NHI document lists and requires residents to report enrollment and withdrawal changes.",
      applicability: "For residents whose coverage change is handled through Fukui City National Health Insurance; eligibility depends on individual circumstances.", responsibleBody: "Fukui City", receivingOffice: "Insurance and Pension Division, City Hall main building second floor",
      actions: [
        { title: "Report the event", description: "The city asks for NHI notification within 14 days. It says joining workplace coverage does not automatically withdraw a person from city NHI, so report that change too." },
        { title: "Use the event's document list", description: "For enrollment after losing workplace coverage, the city lists identification and proof of the coverage-loss date. For a foreign resident, it lists a residence card or passport as identification. For withdrawal after joining workplace coverage, bring evidence of the new qualification date. Check the city's current checklist for your situation." },
      ], sourceIds: ["fukui-nhi"], sourceFormatNote: "The city procedure is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "fukui-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Household waste in Fukui City", summary: "Fukui City provides address-based collection searches and separate instructions for bulky waste and items it cannot collect.",
      applicability: "For household waste in Fukui City; sorting rules and collection days vary by area, including Shimizu and Koshino.", responsibleBody: "Fukui City", receivingOffice: "City waste office; ask the city or building manager which station serves your address",
      actions: [
        { title: "Look up the address-specific schedule", description: "The city's household-waste page links a collection-day search by address and sorting guides. It notes different handling in the Shimizu and Koshino areas, so use the rules for your exact district and station." },
        { title: "Separate bulky and restricted items", description: "The city treats items too large or heavy for its designated bags as bulky waste and links drop-off and collection guidance. It separately lists items it does not collect. Check the current instructions before arranging disposal, especially for batteries and appliances." },
      ], sourceIds: ["fukui-waste"], sourceFormatNote: "The city waste page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "fukui-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Resident-tax declaration in Fukui City", summary: "The city offers postal, counter, and newly available electronic declaration routes for the stated tax year.",
      applicability: "For people whose municipal and prefectural resident-tax declaration is handled by Fukui City; check the applicable tax year and personal circumstances.", responsibleBody: "Fukui City", receivingOffice: "Municipal Tax Division, City Hall main building second floor; listed liaison-office sessions when available",
      actions: [
        { title: "Check whether a city declaration is needed", description: "The FY2026 page lists filing cases, including some residents without income, and says a national income-tax return generally removes the separate city filing. Review the current year's requirements and documents with the Municipal Tax Division." },
        { title: "Choose a current filing route", description: "The city directs residents to postal or counter filing and says electronic filing began with FY2026 declarations. Its forms page provides the current form and says email and fax submissions are not accepted. Check the year's filing period and any liaison-office sessions before visiting." },
      ], sourceIds: ["fukui-tax", "fukui-tax-forms"], sourceFormatNote: "The city tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "fukui-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Flood and landslide preparation in Fukui City", summary: "The city publishes district flood and landslide maps, including easy-Japanese and English editions, and hazard-specific shelter lists.",
      applicability: "For people living, working, or studying in Fukui City; hazards and suitable evacuation sites depend on the exact address and event.", responsibleBody: "Fukui City", receivingOffice: "City disaster and river sections; consult the district map and current shelter listing",
      actions: [
        { title: "Check your district's maps", description: "The city provides flood and landslide maps by district, with easy-Japanese and English versions. Check the risk around your home, work, and school and plan routes that fit the relevant hazard." },
        { title: "Confirm a shelter is suitable and open", description: "The city's shelter page distinguishes earthquake, flood, landslide, and tsunami uses. It says openings are announced through city broadcasts, email, the website, social media, and other media. Consult live announcements during an event rather than assuming a listed shelter is open." },
      ], sourceIds: ["fukui-hazard-map", "fukui-shelters"], sourceFormatNote: "The city hazard and shelter pages are in Japanese, with some linked multilingual maps. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "fukui-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Language help and Japanese practice in Fukui City", summary: "The city offers interpretation at municipal counters and links a Japanese practice program run by its international exchange association.",
      applicability: "For foreign residents using Fukui City services; confirm interpreter availability and lesson arrangements before visiting.", responsibleBody: "Fukui City", receivingOffice: "City service counter for interpreter requests; International Office for information about local support",
      actions: [
        { title: "Ask a counter for an interpreter", description: "The city says administrative interpreters support Chinese, English, and Portuguese at city counters on listed days. Tell the counter staff that you need help, and check current availability before a time-sensitive visit." },
        { title: "Ask about Japanese practice", description: "The city's Japanese Lessons page describes Shaberiba, a volunteer-assisted place to practice reading, writing, listening, and speaking. The city also links the Fukui Citizens' International Association. Contact the association for the current venue, schedule, and participation details." },
      ], sourceIds: ["fukui-foreign-support", "fukui-japanese-lessons"], sourceFormatNote: "The city's interpreter page is in Japanese and its lesson overview is in English. This summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "fukui-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Pension procedures in Fukui City", summary: "The city lists municipal filing routes and documents for overseas arrivals and changes from workplace or dependent pension coverage.",
      applicability: "For residents whose pension event is handled by the municipality; employment and dependent status change the filing route.", responsibleBody: "Fukui City", receivingOffice: "Insurance and Pension Division pension counter, City Hall main building second floor, or Fukui Pension Office; some move-in cases can use a liaison office",
      actions: [
        { title: "Bring records for your event", description: "The city lists identification, pension number records if held, and evidence of landing for people arriving from overseas. Its move-in page also lists a residence card and passport for foreign residents. For retirement or loss of spouse-dependent status, bring documents proving the change." },
        { title: "Check which body handles the filing", description: "The city identifies its pension counter or pension office for Category 1 cases, while employers handle workplace coverage. It links electronic applications for some pension procedures. Ask the counter or pension office about the correct category and current relief options." },
      ], sourceIds: ["fukui-pension", "fukui-pension-move"], sourceFormatNote: "The city pension pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "tax-year", records: ["fukui-resident-tax"], statement: "Confirm the current tax-year filing obligations, forms, periods, electronic channel, and temporary liaison-office sessions." },
    { kind: "dated", records: ["fukui-household-waste"], from: "2026-04-01", change: "Waste and battery sorting changed, with area-specific plastic-resource arrangements.", action: "Confirm current district sorting rules and address-specific collection calendar." },
    { kind: "old-source", records: ["fukui-national-pension"], source: "fukui-pension-move", date: "2024-01-14" },
    { kind: "old-source", records: ["fukui-language-and-consultation"], source: "fukui-japanese-lessons", date: "undated" },
    { kind: "gap", records: ["fukui-language-and-consultation"], gap: "Current Shaberiba schedule, location, and enrollment details were not found on the cited page; confirm directly with the city or its linked international exchange association." },
    { kind: "gap", records: ["fukui-disaster-preparation"], gap: "Live shelter opening and exact-site suitability require current city alerts and the current hazard-specific shelter listing." },
  ],
});
