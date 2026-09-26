import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.takamatsu.kagawa.jp/kurashi";

/** Takamatsu City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-37201", name: "Takamatsu City", aliases: ["Takamatsu","Takamatsu-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "takamatsu-address-registration-moving-in", title: "Moving-in notification", url: `${base}/kurashi/shomei/tenkyo/tennyu_tashi.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takamatsu-national-health-insurance-procedures", title: "Joining, leaving, and other National Health Insurance procedures", url: `${base}/kurashi/nenkin/kokuho/tetuduki/shikaku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takamatsu-household-waste-guidebook", title: "Household waste sorting guidebook", url: `${base}/kurashi/gomi/guidebook.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takamatsu-household-waste-bulky", title: "Putting out temporary and bulky waste", url: `${base}/kurashi/gomi/rinjisodai/dashikata.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takamatsu-resident-tax-filing", title: "Fiscal 2026 inhabitant tax return", url: `${base}/kurashi/tax/siminzei/shinkoku/r8siminnzeisinnkoku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takamatsu-disaster-preparation-bosai-map", title: "Takamatsu disaster prevention map", url: `${base}/kurashi/shobo/bosai_map/takamatsu_map/index.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takamatsu-language-and-consultation-interpretation", title: "Interpretation at City Hall", url: `${base}/shinotorikumi/toshi/kokusai/tabunka/tuuyaku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takamatsu-language-and-consultation-japanese", title: "Learn Japanese", url: `${base}/shinotorikumi/toshi/kokusai/tabunka/nihongo.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "takamatsu-national-pension-notifications", title: "When to notify (National Pension)", url: `${base}/kurashi/nenkin/kokunen/todokede.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "takamatsu-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Takamatsu",
      summary: "Takamatsu takes moving-in notifications for households with foreign residents only at window 4 of the Citizens Section on the 1st floor of City Hall, weekdays 8:30 a.m. to 5 p.m., within 14 days of moving in.",
      applicability: "Households including foreign residents moving into Takamatsu. Groups of five or more should tell the city their visit date in advance.",
      responsibleBody: "Takamatsu City", receivingOffice: "Citizens Section window 4, Takamatsu City Hall 1st floor",
      actions: [
        { title: "File within 14 days at window 4", description: "File within 14 days of actually starting to live at the address, with the exact address including building and room number. You, a household member, or an agent with a handwritten letter of authorization can file." },
        { title: "Bring residence cards, passports, and relationship documents", description: "Arriving from abroad, bring your residence card (or a passport stamped that it will be issued later) and passport. Unless you live alone, bring an original document proving your relationship to the head of household, such as a marriage or birth certificate, with a translation naming the translator. A combined residence card and My Number Card can be requested only until 4 p.m. on weekdays." },
      ],
      sourceIds: ["takamatsu-address-registration-moving-in"],
      sourceFormatNote: `Takamatsu's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "takamatsu-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Takamatsu",
      summary: "In Takamatsu, you must join or leave National Health Insurance yourself within 14 days, at window 10 of the National Health Insurance and Elderly Medical Care Section, a general center, branch office, or the citizen service center; coverage starts from the qualifying date.",
      applicability: "For residents not covered by workplace insurance or public assistance. Community centers and liaison offices cannot handle it.",
      responsibleBody: "Takamatsu City", receivingOffice: "National Health Insurance and Elderly Medical Care Section window 10 (City Hall 1st floor), a general center, branch office, or the citizen service center",
      actions: [
        { title: "Join with the right documents", description: "Bring a document showing your My Number and identification (one photo ID, or two without a photo). Foreign residents also show their residence card. After leaving a job, bring the loss-of-coverage certificate." },
        { title: "Leave when you join workplace insurance", description: "Bring your National Health Insurance certificate and the workplace certificate or notice. If you leave late, you may pay premiums to both insurers." },
      ],
      sourceIds: ["takamatsu-national-health-insurance-procedures"],
      sourceFormatNote: `Takamatsu's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "takamatsu-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Takamatsu",
      summary: "Takamatsu's waste sorting guidebook (15th edition, March 2026) is handed out at City Hall and other city facilities, and bulky waste is collected for a fee after booking with the Bulky Waste Reception Center by phone or online.",
      applicability: "Bulky waste cannot go to regular collection stations.",
      responsibleBody: "Takamatsu City",
      actions: [
        { title: "Get the guidebook", description: "The guidebook covers the collection calendar, each waste type, and items that cannot go to stations; it is available at City Hall, the Environmental Services Center, general centers, branch offices, and community centers." },
        { title: "Book bulky waste", description: "Call the Bulky Waste Reception Center at 087-834-0366 (weekdays 9 a.m. to 4 p.m.) or apply online; collection takes about 7 to 10 days. Buy 510-yen stickers for the fee at a supermarket or convenience store, write the reception number on them, and put the items out on the collection day." },
      ],
      sourceIds: ["takamatsu-household-waste-guidebook", "takamatsu-household-waste-bulky"],
      sourceFormatNote: `Takamatsu's waste pages are in Japanese. ${note}`,
    },
    {
      id: "takamatsu-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Takamatsu",
      summary: "Takamatsu asks residents who lived in the city on January 1 to check whether they must file an inhabitant tax return, and accepts returns online from fiscal 2026 or by post.",
      applicability: "Use Takamatsu's route when you lived in Takamatsu on January 1 of the tax year.",
      responsibleBody: "Takamatsu City",
      actions: [
        { title: "Check whether you must file", description: "You need not file if you file an income-tax return, or if your only income is salary or a public pension already reported to the city and you want no extra deductions. People with no income need not file but may need to for income certificates or insurance premiums." },
        { title: "File online or by post", description: "File online from a smartphone or computer, or post the return with copies of the required documents and your phone number. For questions, call the Citizen Tax Section at 087-839-2233." },
      ],
      sourceIds: ["takamatsu-resident-tax-filing"],
      sourceFormatNote: `Takamatsu's tax page is in Japanese. ${note}`,
    },
    {
      id: "takamatsu-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Takamatsu",
      summary: "Takamatsu's disaster prevention map combines a 32-page guide and hazard maps for 11 community areas; its tsunami areas are based on Kagawa Prefecture's 2013 estimates, and the prefecture published new estimates in July 2025.",
      applicability: "Check your community's hazard map and your evacuation place and route.",
      responsibleBody: "Takamatsu City",
      actions: [
        { title: "Check the map for your area", description: "Download the guide and your community map, or pick them up at the Crisis Management Section, general centers, branch offices, or the citizen service center. Check the prefecture's website for the latest earthquake and tsunami estimates." },
      ],
      sourceIds: ["takamatsu-disaster-preparation-bosai-map"],
      sourceFormatNote: `Takamatsu's hazard map page is in Japanese. ${note}`,
    },
    {
      id: "takamatsu-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Takamatsu",
      summary: "Takamatsu City Hall has English and Chinese interpreters and translation tablets for city procedures, and the Takamatsu International Association runs free beginner and conversation classes in Japanese.",
      applicability: "For foreign residents of Takamatsu.",
      responsibleBody: "Takamatsu City",
      actions: [
        { title: "Get help at City Hall", description: "English and Chinese interpreters are available for procedures, service counters have translation tablets, and the Immigration Services Agency's phone interpreting can also be used. For questions, contact the City Exchange Office at 087-839-2197." },
        { title: "Join a Japanese class", description: "The Takamatsu International Association runs a free class for beginners and a free conversation club; I-PAL Kagawa runs courses at five levels." },
      ],
      sourceIds: ["takamatsu-language-and-consultation-interpretation", "takamatsu-language-and-consultation-japanese"],
      sourceFormatNote: `Takamatsu's pages are in Japanese, English, and Chinese. ${note}`,
    },
    {
      id: "takamatsu-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Takamatsu",
      summary: "In Takamatsu, residents who leave employee pension coverage before 60 join National Pension as Category I insured persons within 14 days of the day after leaving, along with any dependent spouse.",
      applicability: "For residents under 60 who leave a job, and dependent spouses who lose that status.",
      responsibleBody: "Takamatsu City",
      actions: [
        { title: "Join after leaving a job", description: "You or a household member bring your Basic Pension Number document, a document showing your leaving date (such as a separation notice or loss-of-coverage certificate), and identification; an agent needs a letter of authorization." },
      ],
      sourceIds: ["takamatsu-national-pension-notifications"],
      sourceFormatNote: `Takamatsu's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "gap", records: ["takamatsu-resident-tax"], gap: "Filing deadline and the leaving-Japan (tax agent) step." },
    { kind: "gap", records: ["takamatsu-household-waste"], gap: "Foreign-language guidebook." },
  ],
});
