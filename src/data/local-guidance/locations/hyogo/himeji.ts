import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Himeji City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-28201", name: "Himeji City", aliases: ["Himeji", "Himeji-shi"], planGroup: "major-city" },
  sources: [
    { id: "himeji-address-registration", title: "Moving into Himeji from another municipality or abroad", url: "https://www.city.himeji.lg.jp/kurashi/0000006731.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "himeji-national-health-insurance", title: "Joining National Health Insurance after workplace coverage ends", url: "https://www.city.himeji.lg.jp/kurashi/0000004340.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "himeji-national-health-insurance-postal", title: "Postal National Health Insurance procedures", url: "https://www.city.himeji.lg.jp/kurashi/0000012259.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "himeji-national-health-insurance-foreign", title: "National Health Insurance for foreign residents", url: "https://www.city.himeji.lg.jp/kurashi/0000031592.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "himeji-household-waste", title: "Household clean calendars and address lookup", url: "https://www.city.himeji.lg.jp/kurashi/0000033506.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "himeji-household-waste-guide", title: "Household waste", url: "https://www.city.himeji.lg.jp/kurashi/category/2-10-3-0-0-0-0-0-0-0.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "himeji-disaster-hazard-maps", title: "Wide-area flood, landslide, and storm-surge hazard maps", url: "https://www.city.himeji.lg.jp/anzen/0000016745.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "himeji-language-consultation", title: "Consultation services for foreign residents", url: "https://www.city.himeji.lg.jp/kurashi/0000006260.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "himeji-japanese-classes", title: "Japanese classes in the Harima area", url: "https://www.city.himeji.lg.jp/kurashi/0000006610.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "himeji-national-pension", title: "National Pension enrollment categories and municipal counter", url: "https://www.city.himeji.lg.jp/kurashi/0000003852.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "himeji-resident-tax", title: "Resident-tax filing", url: "https://www.city.himeji.lg.jp/kurashi/0000000608.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "himeji-resident-tax-forms", title: "Resident-tax forms and annual instructions", url: "https://www.city.himeji.lg.jp/kurashi/0000000713.html", language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "himeji-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Registering an address in Himeji", summary: "Himeji accepts moving-in filings at the resident window center and local offices; overseas arrivals need each mover's passport and, for Japanese nationals, family-register records.",
      applicability: "For people moving to Himeji; use the office serving the address and confirm the records for your household and origin.", responsibleBody: "Himeji City", receivingOffice: "Resident Window Center or a branch, regional office, station-front office, satellite office, or service center",
      actions: [
        { title: "File in person within 14 days", description: "Himeji says to submit a moving-in notification within 14 days after moving in. Postal filing is not available. The listed counters are the Resident Window Center, branches, regional offices, station-front office, satellite offices, and service centers; check which office handles your case before visiting." },
        { title: "Bring documents for your move", description: "For a move from another Japanese municipality, bring the moving-out certificate unless you are using the My Number Card special transfer, plus identity documents and a residence card or Special Permanent Resident Certificate for foreign residents. From abroad, the city lists each mover's passport and, for Japanese nationals, a family-register certificate and family-register supplement. Confirm if your household has a different nationality or family-record situation." },
      ],
      sourceIds: ["himeji-address-registration"], sourceFormatNote: "Himeji City's procedure page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "himeji-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Health Insurance in Himeji", summary: "Himeji accepts National Health Insurance joining filings at the city counter and local offices, with online and postal routes described for specific coverage-loss cases.",
      applicability: "Use Himeji's process only after confirming that your coverage change belongs in municipal National Health Insurance; online and postal instructions are case-specific.", responsibleBody: "Himeji City", receivingOffice: "National Health Insurance Division at City Hall or a branch, regional office, station-front office, satellite office, or service center",
      actions: [
        { title: "Ask the correct counter about your coverage change", description: "Himeji lists the National Health Insurance Division and local offices for qualification filings. When workplace or dependent coverage ends, the city lists an online application with a My Number Card and an image of proof of lost coverage; postal filing is also available using the city's form and supporting records. Check the current instructions for your event before choosing a route." },
        { title: "Use the foreign-resident guidance where relevant", description: "Himeji provides a multilingual page for foreign residents explaining that joining is handled with resident registration and listing exclusions such as workplace coverage, public assistance, and specified residence situations. Ask the city if your residence status or coverage is unusual." },
      ],
      sourceIds: ["himeji-national-health-insurance", "himeji-national-health-insurance-postal", "himeji-national-health-insurance-foreign"], sourceFormatNote: "Himeji City's procedure pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "himeji-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Household waste collection in Himeji", summary: "Himeji sets collection calendars by school district and provides an address search, foreign-language calendars, and optional LINE collection reminders.",
      applicability: "Collection depends on the address and sometimes the building; confirm the applicable calendar and collection point with the city or building manager.", responsibleBody: "Himeji City", receivingOffice: "Recycling Division; ask the building manager about collection points for apartments and condominiums",
      actions: [
        { title: "Find the calendar for your address", description: "Use Himeji's clean-calendar search with the town name after 'Himeji City'; omit the city name and street number. The same town can return multiple calendars, so ask the Recycling Division if you cannot identify the right district. The city publishes calendars in English, Chinese, Korean, Vietnamese, and Portuguese, and LINE can send reminders after you set your area and waste types." },
        { title: "Confirm your building's collection arrangement", description: "The city notes that it may not collect directly from some apartments or condominiums. Ask your property manager where and when to put waste out, and use the current address-specific calendar for collection days." },
      ],
      sourceIds: ["himeji-household-waste", "himeji-household-waste-guide"], sourceFormatNote: "Himeji City's waste pages are in Japanese and link multilingual calendars. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "himeji-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Hazard maps for Himeji", summary: "Himeji publishes wide-area flood, landslide, and storm-surge maps in Japanese and four foreign-language editions.",
      applicability: "Map blocks and hazards differ by address. Check the maps covering your home, workplace, and school, then follow current evacuation information during an emergency.", responsibleBody: "Himeji City", receivingOffice: "Crisis Management Office",
      actions: [
        { title: "Check the maps for your area", description: "Himeji divides flood and landslide maps into 10 blocks and storm-surge maps into four blocks. English, Chinese, Korean, and Vietnamese map editions are linked on the city's page. Identify the map blocks covering places where you spend time and review the displayed risk areas." },
        { title: "Check current local information", description: "Use the maps to prepare in advance; they describe modeled hazard areas and do not establish which shelters are open during an event. Follow current alerts and Himeji's evacuation information when conditions change." },
      ],
      sourceIds: ["himeji-disaster-hazard-maps"], sourceFormatNote: "Himeji City's map page is in Japanese and links multilingual maps. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "himeji-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Language and consultation support in Himeji", summary: "Himeji's Foreign Resident Consultation Center offers multilingual information and referrals, and the city lists Japanese classes and community learning groups.",
      applicability: "Languages, service days, class eligibility, and participation costs vary by service; confirm current details with the listed provider.", responsibleBody: "Himeji City", receivingOffice: "Foreign Resident Consultation Center, City Hall main building first floor; Himeji Cultural and International Exchange Foundation for classes",
      actions: [
        { title: "Contact the Foreign Resident Consultation Center", description: "The center provides daily-life information and referrals at City Hall. The city lists Japanese and English on weekdays, Vietnamese on weekday afternoons, and Chinese, Spanish, and Portuguese on Tuesday afternoons; staff can use a translation device for other languages. Vietnamese consultations are also listed at community centers on different weekdays. Call ahead if you need a particular language or appointment." },
        { title: "Compare Japanese-learning options", description: "Himeji lists foundation classes and local volunteer groups, including structured beginner and intermediate courses, conversation groups, and children's learning support. Some programs charge a fee, limit participation, or ask visitors from outside Himeji to check first; contact the provider for current schedules and enrollment." },
      ],
      sourceIds: ["himeji-language-consultation", "himeji-japanese-classes"], sourceFormatNote: "Himeji City's support pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "himeji-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "National Pension in Himeji", summary: "Himeji's National Pension counter is in the main City Hall building, and local offices accept some resident filings; confirm the route for your coverage category.",
      applicability: "The city's category page is old; use it only to locate the municipal counter and confirm current enrollment or relief procedures with Himeji or the Japan Pension Service.", responsibleBody: "Himeji City", receivingOffice: "National Pension Window Center, National Health Insurance Division, City Hall main building first floor; local offices may accept some filings",
      actions: [
        { title: "Confirm enrollment and relief procedures", description: "Himeji's page identifies the National Pension Window Center and says resident-side questions can be directed there. Because its category guidance is dated, confirm current enrollment, exemption, or student payment-postponement routes and required documents with the city counter or Japan Pension Service." },
        { title: "Check payment routes with the pension office", description: "Himeji's current premium page describes account-transfer applications through a financial institution, post office, or pension office and lists the city counter's contact details. Check the Japan Pension Service for current payment amounts and contribution-relief eligibility." },
      ],
      sourceIds: ["himeji-national-pension"], sourceFormatNote: "Himeji City's National Pension page is in Japanese and dated 2013. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "himeji-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25", status: "needs-review",
      title: "Resident-tax filing in Himeji", summary: "Himeji provides municipal and prefectural resident-tax filing instructions, downloadable forms, and a form-creation service; filing duties depend on your January 1 address and income situation.",
      applicability: "The city revises forms and filing details by tax year. Check the current year's instructions or ask the Citizen Tax Division about your circumstances.", responsibleBody: "Himeji City", receivingOffice: "Citizen Tax Division, Himeji City Hall",
      actions: [
        { title: "Check whether a return is required", description: "Himeji's filing page describes who must submit a resident-tax return based on their January 1 address, while listing cases where an income-tax return or employer report may remove the need. The page says returns can be submitted by mail and links a form-creation service. Review the current year's instructions before filing." },
        { title: "Use current forms and ask about your case", description: "The city posts annual forms and guides and recommends postal submission; the current materials may change between tax years. Contact the Citizen Tax Division for individual questions and check separately if you are leaving Japan or need a tax certificate." },
      ],
      sourceIds: ["himeji-resident-tax", "himeji-resident-tax-forms"], sourceFormatNote: "Himeji City's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "tax-year", records: ["himeji-resident-tax"], statement: "Recheck annual resident-tax filing duties, forms, submission routes, and dates against Himeji's current tax-year pages." },
    { kind: "old-source", records: ["himeji-national-pension"], source: "Himeji National Pension enrollment categories page", date: "2013-05-08" },
    { kind: "gap", records: ["himeji-disaster-preparation"], gap: "The fetched wide-area map page lists hazard-map blocks but does not describe live evacuation channels or current shelter-opening information." },
  ],
});
