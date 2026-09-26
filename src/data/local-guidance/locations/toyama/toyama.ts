import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Toyama City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-16201", name: "Toyama City", aliases: ["Toyama","Toyama-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "toyama-address-registration", title: "Address changes and moving into Toyama City", url: "https://www.city.toyama.lg.jp/kurashi/koseki/1010189/1004711.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "toyama-national-health-insurance", title: "Joining or leaving National Health Insurance", url: "https://www.city.toyama.lg.jp/kurashi/kokuho/1010198/1003835.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "toyama-waste-calendars", title: "Waste and recycling collection calendars", url: "https://www.city.toyama.lg.jp/kurashi/gomi/1010228/1010232/index.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "toyama-waste-sorting", title: "Sorting and disposing of household waste", url: "https://www.city.toyama.lg.jp/kurashi/gomi/1010228/1010230/index.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "toyama-resident-tax", title: "Resident-tax declarations and payment", url: "https://www.city.toyama.lg.jp/kurashi/zei/1010208/1003332.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "toyama-tax-electronic-filing", title: "Electronic filing for FY2026 resident tax", url: "https://www.city.toyama.lg.jp/kurashi/zei/1010207/1018129.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "toyama-disaster-guide", title: "Toyama City disaster-preparedness guide", url: "https://www.city.toyama.lg.jp/bosai/bosai/1010655/1016061.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "toyama-foreign-residents", title: "Information for foreign residents", url: "https://www.city.toyama.lg.jp/kurashi/foreigners/1019222.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "toyama-foreign-consultation", title: "Foreign Resident Consultation Desk", url: "https://www.city.toyama.lg.jp/kurashi/foreigners/1003013.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "toyama-national-pension", title: "National Pension procedures", url: "https://www.city.toyama.lg.jp/kurashi/kokuho/1010203/1003887.html", language: "ja", lastCheckedAt: "2026-09-26" },
  ],
  supplements: [
    {
      id: "toyama-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Registering an address in Toyama City", summary: "Toyama City accepts move-in notices at its Citizens Division, administrative service centers, core district centers, and many district centers, with additional limits for foreign residents and special move-in cases.",
      applicability: "For people moving into Toyama City. The correct counter depends on whether you are arriving from another Japanese municipality or from abroad and whether you are a foreign resident.", responsibleBody: "Toyama City", receivingOffice: "Citizens Division, an administrative service center, or an eligible core district center; confirm the counter for the address and case",
      actions: [
        { title: "File the move-in notice and bring household records", description: "The city asks people to file within 14 days of moving in. For a domestic move, bring the transfer certificate unless the My Number Card route means one is not issued. Foreign residents should bring each mover's residence card or other accepted residence document; if a foreign resident joins a household headed by a foreign resident, the city asks for an official relationship document and a translation. A representative needs a power of attorney. The city limits foreign-resident and certain special filings to specified main or regional offices, so check its counter table before visiting." },
        { title: "Use the correct counter for an overseas arrival", description: "The city's page distinguishes moves from abroad and lists passports for everyone moving, residence-history/family records where applicable, and residence documents for foreign residents. Some counters do not handle overseas arrivals or foreign-resident moves. Check the current city list for the exact procedure and branch, and ask the Citizens Division about records for your household." },
      ],
      sourceIds: ["toyama-address-registration"], sourceFormatNote: "Toyama City's address-procedure page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "toyama-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Health Insurance in Toyama City", summary: "Toyama City asks residents to complete National Health Insurance changes after address registration and lists different records for a municipal move and loss of workplace coverage.",
      applicability: "Use this local procedure after checking whether municipal National Health Insurance is the right coverage route for you. Your records depend on why you are enrolling or leaving.", responsibleBody: "Toyama City", receivingOffice: "Insurance and Pension Division or the relevant regional administrative service center",
      actions: [
        { title: "Register the move before handling health-insurance enrollment", description: "Toyama's procedure table says to complete resident-address changes before the National Health Insurance filing when moving from another municipality. It lists photo identification and, for foreign residents, a passport for this move. A loss of employer coverage instead requires proof of the coverage end date. A representative needs authorization and identification; check the city page for your specific change and filing office." },
        { title: "Ask about other routes and household-specific amounts", description: "The city page lists events that require a filing and the records for each, including changes within the city, new employment coverage, and student moves. The city directs residents to its Insurance and Pension Division and regional centers; confirm current eligibility, any electronic route, premium amount, and relief with that office." },
      ],
      sourceIds: ["toyama-national-health-insurance"], sourceFormatNote: "Toyama City's National Health Insurance page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "toyama-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Household waste in Toyama City", summary: "Toyama City publishes sorting information and collection calendars by town and district; some neighborhoods have more than one calendar depending on the collection site.",
      applicability: "Use the instructions and calendar that apply to your exact address and collection station. Confirm building-specific instructions with the building manager or local association.", responsibleBody: "Toyama City", receivingOffice: "Waste Management Division; building manager or neighborhood association for the assigned collection station",
      actions: [
        { title: "Find your address's sorting rules and collection calendar", description: "The city links its household waste and recycling guide, an item-by-item sorting dictionary, and collection calendars searchable by town name or area. Calendars are distributed each year. In some towns, different calendars apply to different collection points, so ask the collection-site manager or neighborhood association which one serves your home." },
        { title: "Check the current rules for special items", description: "Use the city's guide for the item before placing it out. The city publishes separate instructions for items such as appliances, batteries, and materials that cannot go to an ordinary collection site. Its foreign-resident page also links multilingual waste guidance; confirm current disposal arrangements with the city or building manager." },
      ],
      sourceIds: ["toyama-waste-calendars", "toyama-waste-sorting", "toyama-foreign-residents"], sourceFormatNote: "Toyama City's waste and foreign-resident pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "toyama-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Resident tax in Toyama City", summary: "Toyama City's pages describe local resident-tax declarations and payment methods; responsibility generally follows the address held on January 1, and current-year instructions should be checked each year.",
      applicability: "First identify which municipality is responsible for the tax year using your address on January 1, then check the current Toyama City instructions if the city is responsible.", responsibleBody: "Toyama City", receivingOffice: "Citizens Tax Division",
      actions: [
        { title: "Check the declaration requirement for the current year", description: "Toyama's procedure page describes who may need to report prior-year income and lists exclusions and special cases. Some people may need a city declaration even if they do not file an income-tax return. For the current year, use the linked forms and electronic filing notice or ask the Citizens Tax Division about your filing requirement and accepted route." },
        { title: "Follow the current notice for payment", description: "The city describes ordinary payment by notice and withholding through salary or pension. Its procedure page gives example collection periods, but dates and channels are tied to the applicable year and may change. Check the current notice and contact the tax office if you are leaving Japan or need help with a bill." },
      ],
      sourceIds: ["toyama-resident-tax", "toyama-tax-electronic-filing"], sourceFormatNote: "Toyama City's resident-tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "toyama-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Disaster preparation in Toyama City", summary: "Toyama City provides a disaster guide and area-specific maps, and warns that some printed shelter information may be superseded by later change notices.",
      applicability: "Check hazards and routes for your exact home, workplace, and school. Use current city alerts to confirm which evacuation sites are open during an event.", responsibleBody: "Toyama City", receivingOffice: "Disaster Prevention Division; use current city emergency information for live instructions",
      actions: [
        { title: "Review the disaster guide and neighborhood map", description: "Toyama City's guide covers preparedness, evacuation behavior, and area-based maps for the city's districts. The linked pages include map-change notices, so check them alongside the district sheet and identify hazards and routes for your exact address." },
        { title: "Check current shelter information during an emergency", description: "The city notes that some shelter lists included with area maps may be older than the latest changes. Check the linked current corrections and official emergency notices before traveling; a planning map alone does not show which sites are open during a particular event." },
      ],
      sourceIds: ["toyama-disaster-guide", "toyama-foreign-residents"], sourceFormatNote: "Toyama City's disaster and foreign-resident pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "toyama-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Language and consultation support in Toyama City", summary: "Toyama City links multilingual daily-life and disaster materials and provides a foreign-resident consultation desk for questions about life and public procedures.",
      applicability: "Confirm current service languages, availability, schedule, and location with the provider before relying on a consultation or class.", responsibleBody: "Toyama City", receivingOffice: "Foreign Resident Consultation Desk at the Toyama City International Exchange Center; contact the Culture and International Affairs Division for current arrangements",
      actions: [
        { title: "Contact the foreign-resident consultation desk", description: "The city describes a multilingual consultation service for daily-life questions, including residence status, employment, healthcare, welfare, and family matters. The city page lists the center location and contact details; check its linked schedule for currently available languages and hours before visiting." },
        { title: "Use city-published multilingual information", description: "Toyama's foreign-resident page links living guides in English, Chinese, Korean, Portuguese, and Vietnamese, plus multilingual waste and disaster materials. It also links the Toyama Cosmopolitan Association for community information. Ask the relevant provider directly about current classes or other support services." },
      ],
      sourceIds: ["toyama-foreign-consultation", "toyama-foreign-residents"], sourceFormatNote: "Toyama City's foreign-resident pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "toyama-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Pension procedures in Toyama City", summary: "Toyama City accepts certain National Pension category 1 filings at its Insurance and Pension Division and administrative service centers, with other pension categories handled through an employer or pension office.",
      applicability: "Your procedure depends on whether you are in National Pension category 1, covered through employment, or a dependent spouse. Confirm your category and whether a local filing is needed.", responsibleBody: "Toyama City", receivingOffice: "Insurance and Pension Division or an administrative service center; Toyama Pension Office for premium collection questions",
      actions: [
        { title: "Ask the city where your category 1 filing belongs", description: "Toyama City lists municipal filing routes for examples such as leaving an employer's pension plan or a spouse's dependent coverage. It requests My Number or pension-number identification and proof of the relevant change. Employer and dependent-spouse changes may instead go through the employer, so confirm your route with the city or Japan Pension Service." },
        { title: "Check current online and premium information", description: "The city's page links to Japan Pension Service for current premium collection information and lists the city contacts handling local procedures. Eligibility, exemptions, current contributions, and any electronic application route depend on your status; use the current city and Japan Pension Service guidance." },
      ],
      sourceIds: ["toyama-national-pension"], sourceFormatNote: "Toyama City's National Pension page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "old-source", records: ["toyama-resident-tax"], source: "toyama-resident-tax", date: "2023-02-14" },
    { kind: "tax-year", records: ["toyama-resident-tax"], statement: "Annual tax declaration requirements, dates, forms, notices, and channels can change by tax year." },
    { kind: "old-source", records: ["toyama-language-and-consultation"], source: "toyama-foreign-consultation", date: "2023-01-13" },
    { kind: "dated", records: ["toyama-household-waste"], from: "2026-04-01", change: "The city distributes updated collection calendars annually and some addresses may have multiple possible calendars by collection station.", action: "Recheck the current fiscal-year calendar and confirm which station and schedule applies to the address." },
    { kind: "dated", records: ["toyama-disaster-preparation"], from: "2026-04-01", change: "The disaster guide contains district map and shelter details with separate notices for updates.", action: "Review current change notices and live city emergency information for the address." },
    { kind: "gap", records: ["toyama-language-and-consultation"], gap: "The city links providers and language schedules, but current consultation-language availability and community class schedules should be confirmed with the service provider." },
  ],
});
