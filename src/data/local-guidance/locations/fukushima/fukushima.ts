import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Fukushima City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-07201", name: "Fukushima City", aliases: ["Fukushima", "Fukushima-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "fukushima-address-registration", title: "Moving into Fukushima City", url: "https://www.city.fukushima.fukushima.jp/soshiki/7/1028/3/509.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukushima-national-health-insurance", title: "National Health Insurance filings within 14 days", url: "https://www.city.fukushima.fukushima.jp/soshiki/7/1030/2/2/1439.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukushima-waste-schedule", title: "Waste collection dates and neighborhood calendars", url: "https://www.city.fukushima.fukushima.jp/kurashi/gomi-recycle/1/1/1/index.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukushima-waste-calendars", title: "FY2026 neighborhood waste calendars", url: "https://www.city.fukushima.fukushima.jp/kurashi/gomi-recycle/1/gomidashi/shushubi/7930.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukushima-bulky-waste", title: "Bulky waste collection and drop-off", url: "https://www.city.fukushima.fukushima.jp/kurashi/gomi-recycle/1/2/7857.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukushima-resident-tax", title: "Individual city and prefectural tax filing", url: "https://www.city.fukushima.fukushima.jp/soshiki/4/1013/3/4320.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukushima-resident-tax-overview", title: "Individual city and prefectural tax overview", url: "https://www.city.fukushima.fukushima.jp/kurashi/zeikin/4/8166.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukushima-flood-map", title: "Flood hazard map", url: "https://www.city.fukushima.fukushima.jp/bosai-anzen/bosai/1/12157.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukushima-landslide-map", title: "Landslide hazard maps", url: "https://www.city.fukushima.fukushima.jp/kasen-kanri/bosai/bosaikiki/hazard/kasen-kanri1.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukushima-multicultural-support", title: "Multicultural services and Japanese classes", url: "https://www.city.fukushima.fukushima.jp/soshiki/7/1031/2/6165.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukushima-national-pension-procedures", title: "National Pension procedures and filing locations", url: "https://www.city.fukushima.fukushima.jp/kurashi/kokuminnenkin/2/8062.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "fukushima-national-pension-changes", title: "National Pension address and other changes", url: "https://www.city.fukushima.fukushima.jp/kurashi/kokuminnenkin/2/8064.html", language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "fukushima-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Registering an address in Fukushima City", summary: "Fukushima City accepts moving-in notices at the city office and listed branch counters, with an online pre-filing route for eligible domestic moves; foreign residents must use the main city counter.",
      applicability: "For people moving into Fukushima City. Confirm which counter handles your case and prepare the records for every household member moving.", responsibleBody: "Fukushima City", receivingOffice: "Citizens Division general counter, branch offices, or the Motoniwa service office; foreign-resident filings are handled at the main city counter",
      actions: [
        { title: "Complete the in-person filing after an online pre-application", description: "Eligible domestic moves can start through the My Number Card moving one-stop service, but the city requires you to visit the counter selected in the application to finish the move-in filing. A separate pre-created form service can save writing at the counter; follow the city page for its instructions." },
        { title: "Bring the move records and use the correct counter", description: "File within 14 days after starting to live in Fukushima City. Bring the transfer certificate unless the My Number Card route means one is not issued, identification, each moving person's My Number Card if applicable, and residence cards or special permanent resident certificates for foreign residents. A representative outside the same Fukushima City household needs authorization. Foreign residents must file at the main Citizens Division counter; the west-exit service counter cannot handle every procedure." },
      ],
      sourceIds: ["fukushima-address-registration"], sourceFormatNote: "Fukushima City's procedure page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "fukushima-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Health Insurance in Fukushima City", summary: "Fukushima City accepts enrollment and withdrawal filings at the National Health Insurance and Pension Division and branch offices; moving into the city and losing another plan require different records.",
      applicability: "Use this city procedure only after confirming that municipal National Health Insurance is the right coverage for you. Ask the city which route applies to your coverage change.", responsibleBody: "Fukushima City", receivingOffice: "National Health Insurance and Pension Division or branch offices and service offices; not the west-exit administrative service counter",
      actions: [
        { title: "Report a move or coverage loss and bring proof", description: "The city lists a transfer certificate for a move into Fukushima City and a certificate showing loss of employer coverage when that is the reason for joining. File within the city-stated filing period and bring My Number information. The city accepts listed filings at its main division, branch offices, and service offices; a west-exit administrative service counter is excluded." },
        { title: "Check online eligibility and current filing details", description: "The city lists an online route for some people leaving employer health insurance, but its filing table covers other changes separately. Check the current procedure page or ask the National Health Insurance qualification team for the right channel and documents. Premiums and reductions depend on your household and should be confirmed with the city." },
      ],
      sourceIds: ["fukushima-national-health-insurance"], sourceFormatNote: "Fukushima City's procedure page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "fukushima-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Household waste in Fukushima City", summary: "Collection calendars and collection stations depend on the neighborhood; Fukushima City also has separate arrangements for bulky waste.",
      applicability: "Use the calendar for your exact neighborhood and confirm your building's assigned station with its manager or local association. Rules and calendars can change by fiscal year.", responsibleBody: "Fukushima City", receivingOffice: "Waste Policy Division; neighborhood association or building manager for the assigned collection station",
      actions: [
        { title: "Find your neighborhood's calendar and collection point", description: "Choose the current fiscal-year calendar for your neighborhood from the city's collection-date pages. The city also provides the San-ru waste app for sorting information and reminders. Collection stations and schedules are neighborhood-specific, so confirm the assigned location and local instructions with your building manager or neighborhood association." },
        { title: "Arrange bulky waste separately", description: "Do not leave bulky waste at a household collection station. Fukushima City offers a separate, free collection request or self-delivery route; its page asks residents to request collection in advance and says collection can take about three weeks. Items covered by appliance recycling rules, computers, motorcycles, and construction waste are excluded from this bulky-waste route. Check the current city instructions for item eligibility, route, and placement." },
      ],
      sourceIds: ["fukushima-waste-schedule", "fukushima-waste-calendars", "fukushima-bulky-waste"], sourceFormatNote: "Fukushima City's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "fukushima-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Resident tax in Fukushima City", summary: "Fukushima City's resident-tax overview ties liability to the address held on January 1, while its annual filing page explains current declaration routes and filing locations.",
      applicability: "First identify which municipality handled your address on January 1 for the relevant tax year. Confirm whether you need to file and which year's city instructions apply.", responsibleBody: "Fukushima City", receivingOffice: "Citizens Tax Division and the city's designated annual filing venues",
      actions: [
        { title: "Check the filing requirement and current-year routes", description: "Fukushima City's annual filing page describes electronic, postal, and in-person filing routes and lists the cases the city's venues cannot accept. The forms, venues, dates, and required records are year-specific; use the current page or contact the Citizens Tax Division before filing." },
        { title: "Confirm the municipality and any departure arrangements", description: "The city explains that individual city and prefectural tax is assessed based on the address on January 1. A later move does not by itself determine which municipality handles the assessed year. If you are leaving Japan or have an unpaid notice, contact the responsible municipality's tax office for arrangements and current instructions." },
      ],
      sourceIds: ["fukushima-resident-tax", "fukushima-resident-tax-overview"], sourceFormatNote: "Fukushima City's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "fukushima-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Hazard maps and disaster preparation in Fukushima City", summary: "The city publishes flood and landslide maps by area, but map contents and evacuation sites should be checked for the exact address and current conditions.",
      applicability: "Check maps for your home, work, and school. During an event, follow live alerts and confirm which evacuation sites are open.", responsibleBody: "Fukushima City", receivingOffice: "River Division for hazard-map information; use current city disaster notices for evacuation instructions",
      actions: [
        { title: "Review maps for your address and relevant hazards", description: "Fukushima City's flood maps cover river flooding and identify predicted inundation, depth, and evacuation-related information. Its landslide maps show designated warning and special-warning areas and local evacuation sites. Use the city maps or e-map to check the specific address and safe route; area sheets are divided by local service-office districts." },
        { title: "Check current warnings and evacuation sites", description: "The city cautions that a site shown on a hazard map may have changed. Use current city disaster information to confirm alerts and which shelters are open before traveling, and follow official directions during an emergency." },
      ],
      sourceIds: ["fukushima-flood-map", "fukushima-landslide-map"], sourceFormatNote: "Fukushima City's hazard-map pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "fukushima-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Foreign-resident support and Japanese learning in Fukushima City", summary: "Fukushima City lists a foreign-resident support desk, the Yuiverse multicultural center, Japanese-learning options, and multilingual life and disaster information.",
      applicability: "Check the center's current location, languages, appointment arrangements, and class schedules directly before visiting or enrolling.", responsibleBody: "Fukushima City", receivingOffice: "Multicultural Coexistence Promotion Office and Yuiverse multicultural center; local class providers set their own details",
      actions: [
        { title: "Ask the support desk about city procedures and daily life", description: "The city describes a foreign-resident consultation service that helps with life questions and procedures at city or government offices. The city says desk staff speak Japanese, English, and Vietnamese, and identifies Yuiverse as its multicultural center. Check the linked current service information for the operating location and availability." },
        { title: "Find Japanese classes and multilingual information", description: "The city lists Japanese test-preparation instruction and volunteer-run Japanese classes, and points to city and international-association information in Japanese, English, and Vietnamese. Class organizers set schedules and conditions, so contact them or the center to confirm current availability." },
      ],
      sourceIds: ["fukushima-multicultural-support"], sourceFormatNote: "Fukushima City's support page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "fukushima-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Pension procedures in Fukushima City", summary: "Fukushima City directs different pension questions to the municipal pension section, branch offices, or the Japan Pension Service depending on the procedure and pension category.",
      applicability: "Your route depends on whether you are a National Pension category 1 insured person, a pension recipient, or covered through employment or a dependent spouse.", responsibleBody: "Fukushima City", receivingOffice: "National Pension Section, city branch offices or service offices for listed procedures, or the Japan Pension Service pension office",
      actions: [
        { title: "Confirm whether a municipal enrollment filing is needed", description: "The city lists examples such as leaving an employer's pension plan or a spouse's dependent coverage, moving overseas, and optional enrollment as situations that may require a procedure. For category 1 insured people with a My Number registered with Japan Pension Service, an address change is generally processed without a separate filing; confirm your case and current record with the city or Japan Pension Service." },
        { title: "Use the procedure-specific office and records", description: "Fukushima City's procedure directory distinguishes enrollment, benefits, premium relief, and changes of address or name. It lists the city pension section and some branch counters for resident-side filings, while other benefit procedures belong at the pension office. Ask the responsible office which records apply to your specific category and application." },
      ],
      sourceIds: ["fukushima-national-pension-procedures", "fukushima-national-pension-changes"], sourceFormatNote: "Fukushima City's pension pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "dated", records: ["fukushima-household-waste"], from: "2026-04-01", change: "Collection calendars are published by fiscal year and vary by neighborhood.", action: "Replace with the next fiscal-year calendar and confirm neighborhood selection and bulky-waste arrangements." },
    { kind: "tax-year", records: ["fukushima-resident-tax"], statement: "Annual filing dates, venues, forms, and electronic or postal channels can change by tax year." },
    { kind: "dated", records: ["fukushima-disaster-preparation"], from: "2026-03-24", change: "The city updates hazard-map coverage when flood assumptions or designated areas change.", action: "Recheck maps and e-map layers for the address; confirm open evacuation locations from current notices." },
    { kind: "gap", records: ["fukushima-language-and-consultation"], gap: "The city overview links to live center and class-provider details; current schedules, eligibility, and service availability need confirmation with those providers." },
    { kind: "gap", records: ["fukushima-address-registration"], gap: "The cited city move-in procedure describes domestic and overseas filings together but does not explain every foreign household's family-register or status-specific document case; confirm the address-specific checklist with the main Citizens Division counter." },
  ],
});
