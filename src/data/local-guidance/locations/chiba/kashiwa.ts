import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.kashiwa.lg.jp";

/** Kashiwa City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-12217", name: "Kashiwa City", aliases: ["Kashiwa", "Kashiwa-shi"], planGroup: "major-city" },
  sources: [
    { id: "kashiwa-address-registration-from-abroad", title: "Moving-in notification for foreign residents arriving from abroad", url: `${base}/shimin/todokede/foreigner/nyuukoku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kashiwa-national-health-insurance-procedures", title: "National Health Insurance procedures", url: `${base}/hokennenkin/hokennenkin/kokuho/todokede/konnatoki.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kashiwa-household-waste-categories", title: "Waste categories (Kashiwa area)", url: `${base}/kankyoservice/garbage_environment/kashiwaarea/kubun.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kashiwa-household-waste-foreign-languages", title: "Waste guide in other languages (Kashiwa area)", url: `${base}/kankyoservice/garbage_environment/kashiwaarea/foreignlanguage.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kashiwa-resident-tax-foreign-residents", title: "Individual inhabitant tax for foreign residents", url: `${base}/shiminzei/shiseijoho/shisei/soshiki/gaikokujin2026.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kashiwa-disaster-preparation-flood-map", title: "Kashiwa flood hazard map", url: `${base}/bosaianzen/anshinanzen/disaster/disaster_ready/bosaimap/hazardmap.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kashiwa-language-and-consultation-consultation", title: "Consultation desk for foreign residents", url: `${base}/kyoseikoryu/region/shiminkatsudo/katsudojoho/2066.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kashiwa-language-and-consultation-japanese-classes", title: "Japanese classes (FAQ)", url: "https://faq2.city.kashiwa.lg.jp/faq/show/1267", language: "ja", lastCheckedAt: "2026-10-07" },
    { id: "kashiwa-national-pension-abroad", title: "National Pension when moving abroad or returning", url: `${base}/nenkin/hokennenkin/nenkin/kaigai.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "kashiwa-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Kashiwa",
      summary: "Kashiwa takes moving-in notifications from people arriving from abroad only at the Citizens Section on the 1st floor of the main City Hall building, within 14 days of starting to live at the new address.",
      applicability: "Foreign residents arriving from abroad. Short-term visitors and people staying three months or less cannot register.",
      responsibleBody: "Kashiwa City", receivingOffice: "Citizens Section, Kashiwa City Hall main building 1st floor",
      actions: [
        { title: "File within 14 days of moving in", description: "You cannot file before you start living at the address. If the 14th day falls on a day City Hall is closed, the deadline moves to the next open day. You, the head or a member of your household, or someone with a letter of authorization from you can file." },
        { title: "Bring residence cards and relationship documents", description: "Bring the residence cards of everyone who arrived, or passports marked that the card will be issued later. To register a relationship to an existing head of household, bring a document proving it with a translation; otherwise the relationship is recorded as a relative or cohabitant." },
      ],
      sourceIds: ["kashiwa-address-registration-from-abroad"],
      sourceFormatNote: `Kashiwa's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "kashiwa-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Kashiwa",
      summary: "In Kashiwa, the head of household notifies within 14 days of joining or leaving workplace insurance, with photo identification and My Number documents; joining after leaving workplace insurance can also be done online.",
      applicability: "For residents not covered by workplace insurance or public assistance. You still need to notify if you use a My Number Card as your health insurance card.",
      responsibleBody: "Kashiwa City",
      actions: [
        { title: "Join with the right documents", description: "Bring photo identification issued by a public body and the My Number of the head of household and the person joining. After leaving a job, bring a document showing the date coverage ended or you left, such as a loss-of-coverage certificate or separation notice. Without photo ID, the certificate is posted to your registered address." },
        { title: "Allow time in spring", description: "Counters are very busy from late March to April, so leave extra time." },
      ],
      sourceIds: ["kashiwa-national-health-insurance-procedures"],
      sourceFormatNote: `Kashiwa's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "kashiwa-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Kashiwa",
      summary: "In the Kashiwa area, put waste out by 8:30 a.m. on collection day, burnable waste twice a week in designated bags, and book bulky waste with the city's contractor by phone or online.",
      applicability: "These rules are for the Kashiwa area; the Shonan area has its own guide.",
      responsibleBody: "Kashiwa City",
      actions: [
        { title: "Follow the sorting guide", description: "Put waste out from dawn until 8:30 a.m. on collection day (recyclables from 7 to 8:30 a.m.). Burnable waste goes out twice a week in designated bags sold at supermarkets, tied shut. The guide is in English, Chinese, Korean, Spanish, and Vietnamese." },
        { title: "Book bulky waste", description: "Apply to Yamamoto Sangyo by phone at 04-7132-1878 (Monday to Saturday, 8:30 a.m. to 5 p.m.) or online, buy a bulky waste ticket for each item, write your name on it, and put the item out by 8:30 a.m. at your door or near the ground-floor entrance of your building." },
      ],
      sourceIds: ["kashiwa-household-waste-categories", "kashiwa-household-waste-foreign-languages"],
      sourceFormatNote: `Kashiwa's waste pages are in Japanese; the guide has versions in five other languages. ${note}`,
    },
    {
      id: "kashiwa-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Kashiwa",
      summary: "Kashiwa taxes anyone registered in the city on January 1 with enough income the previous year, even if they leave Japan after January 2, and asks people who cannot pay before leaving to name a tax agent living in Japan.",
      applicability: "For residents, including foreign residents, who were registered in Kashiwa on January 1.",
      responsibleBody: "Kashiwa City",
      actions: [
        { title: "Know how you pay", description: "Employees normally have tax deducted from salary. Others receive a tax notice in mid-June and pay by each deadline at a bank or convenience store. If you leave a job, you may have to pay the rest yourself." },
        { title: "Name a tax agent before leaving", description: "If you cannot pay before leaving Japan, name someone living in Japan as your tax agent and submit the tax agent form before you leave. Employers must deduct unpaid tax from the last salary for employees who leave between January and May." },
      ],
      sourceIds: ["kashiwa-resident-tax-foreign-residents"],
      sourceFormatNote: `Kashiwa's tax page is in Japanese; a multilingual pamphlet is linked. ${note}`,
    },
    {
      id: "kashiwa-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Kashiwa",
      summary: "Kashiwa's flood hazard map shows expected flooding depth and duration if the Tone River system overflows, along with evacuation sites; the city is outside tsunami and storm surge areas.",
      applicability: "Check your address on the flood map and the web hazard map.",
      responsibleBody: "Kashiwa City",
      actions: [
        { title: "Check the flood hazard map", description: "Download the maximum-depth and flooding-duration maps, or use the Kashiwa web disaster and hazard map. Printed maps are at the Disaster Prevention and Safety Section (City Hall main building 3rd floor), Shonan branch office, Kashiwa Station administrative service center, and neighborhood centers." },
      ],
      sourceIds: ["kashiwa-disaster-preparation-flood-map"],
      sourceFormatNote: `Kashiwa's hazard map page is in Japanese. ${note}`,
    },
    {
      id: "kashiwa-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Kashiwa",
      summary: "Kashiwa's free consultation desk for foreign residents, on the 3rd floor of City Hall, has advisers who help with city procedures and daily-life problems in English, Chinese, Korean, and Spanish on set afternoons, and the Kashiwa International Relations Center runs Japanese classes.",
      applicability: "Book ahead where possible. Personal interpreting or translation outside city procedures is not offered.",
      responsibleBody: "Kashiwa City", receivingOffice: "Consultation desk for foreign residents, Kashiwa City Hall main building 3rd floor",
      actions: [
        { title: "Use the consultation desk", description: "Advisers are available 1 to 5 p.m.: English on Thursdays, Chinese on Wednesdays and Fridays, Korean on the second and fourth Tuesdays, and Spanish on Mondays (phone 04-7168-1033). Vietnamese, Nepali, Indonesian, Filipino, Thai, Portuguese, and other languages are handled with a translation app, and staff use tablets at other times." },
        { title: "Join a Japanese class", description: "The Kashiwa International Relations Center runs Japanese classes; the class fee is 3,240 yen a year. Apply to the center at 04-7157-0281." },
      ],
      sourceIds: ["kashiwa-language-and-consultation-consultation", "kashiwa-language-and-consultation-japanese-classes"],
      sourceFormatNote: `Kashiwa's pages are in Japanese. ${note}`,
    },
    {
      id: "kashiwa-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Kashiwa",
      summary: "In Kashiwa, Category I insured people moving abroad choose between leaving National Pension and continuing through overseas voluntary membership, which needs a helper in Japan.",
      applicability: "Voluntary membership abroad is for Japanese nationals aged 20 to 64.",
      responsibleBody: "Kashiwa City", receivingOffice: "National Pension Office at City Hall, Shonan branch office, Kashiwa Station administrative service center, or a branch office",
      actions: [
        { title: "Moving abroad", description: "To leave, bring identification and something showing your Basic Pension Number or My Number. For voluntary membership, you also need a helper in Japan, such as a spouse, child, parent, or sibling, to receive payment slips; without one, consult the Matsudo Pension Office." },
      ],
      sourceIds: ["kashiwa-national-pension-abroad"],
      sourceFormatNote: `Kashiwa's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "old-source", records: ["kashiwa-household-waste"], source: "Waste categories (Kashiwa area) page", date: "January 20, 2022" },
    { kind: "gap", records: ["kashiwa-resident-tax"], gap: "Filing deadline and who must file an inhabitant tax return." },
    { kind: "gap", records: ["kashiwa-household-waste"], gap: "Current bulky waste fee (the city revised waste fees) and the Shonan area rules." },
  ],
});
