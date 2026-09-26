import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.matsuyama.ehime.jp/kurashi";

/** Matsuyama City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-38201", name: "Matsuyama City", aliases: ["Matsuyama","Matsuyama-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "matsuyama-address-registration-foreign-residents", title: "For people moving or coming to Japan for the first time", url: `${base}/tetsuzuki/gaikoku/gaikoku_idou.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsuyama-address-registration-from-abroad", title: "Moving to Matsuyama from abroad", url: `${base}/tetsuzuki/jyuuminnidou/kokugaihairu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsuyama-national-health-insurance-procedures", title: "Joining and leaving National Health Insurance", url: `${base}/tetsuzuki/kokuho/kokuhoshikaku/kokuhotodokede.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsuyama-household-waste-foreign-languages", title: "Waste sorting guide in English, Korean, Chinese, and Vietnamese", url: `${base}/gomi/dashikata/bunbetsu_foreigner.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsuyama-household-waste-bulky", title: "Applying for bulky waste collection", url: `${base}/gomi/dashikata/sodaigomi.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsuyama-resident-tax-filing", title: "Fiscal 2026 inhabitant tax return", url: `${base}/tetsuzuki/zeikin/kojin/sikenminzesinkoku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsuyama-resident-tax-agent", title: "Tax agent declaration", url: `${base}/download/shimin/rizaibu/shikenmin/noukannninn.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsuyama-disaster-preparation-flood-map", title: "Matsuyama flood hazard map", url: `${base}/bosai/bousai/keihatu/20-kozui_hazard_map.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsuyama-language-and-consultation-consultation", title: "Consultation for foreign residents", url: `${base}/soudan/jinken/jinkengaikokujin.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsuyama-language-and-consultation-japanese", title: "Where to learn Japanese in Matsuyama (FAQ)", url: "https://info-faq.city.matsuyama.ehime.jp/faq/show/358", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "matsuyama-national-pension-notifications", title: "Who joins National Pension and notifications", url: `${base}/tetsuzuki/kokunen/todokede.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "matsuyama-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Matsuyama",
      summary: "Matsuyama takes moving-in notifications from foreign residents arriving from abroad only at the General Service Center (Citizens Section, main building 1st floor), within 14 days, weekdays 9 a.m. to 4:30 p.m.",
      applicability: "Foreign residents arriving from abroad. Short-term visitors and people staying three months or less cannot register.",
      responsibleBody: "Matsuyama City", receivingOffice: "General Service Center, Citizens Section, Matsuyama City Hall main building 1st floor",
      actions: [
        { title: "File within 14 days", description: "File within 14 days of starting to live in Matsuyama. Moves from abroad are accepted weekdays 9 a.m. to 4:30 p.m., shorter than normal hours, because the resident registry network must be checked; branch offices cannot take foreign residents' moves. Priority counter reservations are available." },
        { title: "Bring passports and residence cards", description: "Bring the passports and residence cards of everyone moving, plus a letter of authorization and identification if an agent files." },
      ],
      sourceIds: ["matsuyama-address-registration-foreign-residents", "matsuyama-address-registration-from-abroad"],
      sourceFormatNote: `Matsuyama's moving-in pages are in Japanese. ${note}`,
    },
    {
      id: "matsuyama-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Matsuyama",
      summary: "In Matsuyama, National Health Insurance starts the day other coverage ends and premiums go back up to two years if you notify late, so notify within 14 days with a certificate that your previous insurance ended.",
      applicability: "For residents not covered by workplace insurance or public assistance. The head of household is responsible for notifications.",
      responsibleBody: "Matsuyama City",
      actions: [
        { title: "Join after leaving a job", description: "Bring a certificate that your workplace insurance ended (the city has a form your employer can fill in); if only you are joining after leaving a job, a separation notice may be accepted. Write the My Number of the head of household and each person joining, and bring identification. Bring your bank account details to set up automatic payment." },
        { title: "Joining on moving in", description: "If you move in from another municipality, join National Health Insurance at the same time as the moving-in notification." },
      ],
      sourceIds: ["matsuyama-national-health-insurance-procedures"],
      sourceFormatNote: `Matsuyama's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "matsuyama-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Matsuyama",
      summary: "Matsuyama's waste sorting guide is available in English, Korean, Chinese, and Vietnamese, and bulky waste is collected free of charge from your home after applying by postcard, online, or through the city's LINE account.",
      applicability: "Bulky waste application periods depend on your area group (A to D).",
      responsibleBody: "Matsuyama City",
      actions: [
        { title: "Get the sorting guide", description: "The foreign-language guide is handed out at the Cleaning Section office, the foreign residents' corner of the Citizens Section, Ehime University, and the Matsuyama International Center, or can be downloaded." },
        { title: "Apply for bulky waste", description: "Check your area group and its application period in the bulky waste guide, then apply with the special postcard, online (after registering with the Ehime e-application system), or through the city's LINE account." },
      ],
      sourceIds: ["matsuyama-household-waste-foreign-languages", "matsuyama-household-waste-bulky"],
      sourceFormatNote: `Matsuyama's waste pages are in Japanese; the guide has versions in four other languages. ${note}`,
    },
    {
      id: "matsuyama-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Matsuyama",
      summary: "Matsuyama's fiscal 2026 inhabitant tax return was due March 16, 2026, and people who no longer live in the city name a tax agent in Matsuyama with a declaration at the counter or by post.",
      applicability: "Use Matsuyama's route when you lived in Matsuyama on January 1 of the tax year.",
      responsibleBody: "Matsuyama City",
      actions: [
        { title: "Check whether you must file", description: "File if you left a job last year, if your employer did not send a salary report, if you had other income, or if you want deductions such as for social insurance or medical costs. You need not file if you file an income-tax return." },
        { title: "Name a tax agent", description: "If you will not have an address in Matsuyama, name someone who lives in the city as your tax agent and submit the declaration to the Citizen Tax Section (main building 2nd floor, window 10) or by post." },
      ],
      sourceIds: ["matsuyama-resident-tax-filing", "matsuyama-resident-tax-agent"],
      sourceFormatNote: `Matsuyama's tax pages are in Japanese. ${note}`,
    },
    {
      id: "matsuyama-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Matsuyama",
      summary: "Matsuyama's flood hazard maps show expected flooding and shelters for a once-in-1,000-years rain on the Shigenobu, Ishite, and other rivers, and are handed out at the Crisis Management Section and branch offices.",
      applicability: "Disasters can also happen outside the mapped areas; evacuate early.",
      responsibleBody: "Matsuyama City",
      actions: [
        { title: "Check the flood map", description: "Maps cover the Shigenobu and Ishite rivers (April 2020), the Ono and Tateiwa rivers (September 2020), and several smaller rivers (March 2025). Get them from the Crisis Management Section, branch offices, liaison offices, or the citizen service center." },
      ],
      sourceIds: ["matsuyama-disaster-preparation-flood-map"],
      sourceFormatNote: `Matsuyama's hazard map page is in Japanese. ${note}`,
    },
    {
      id: "matsuyama-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Matsuyama",
      summary: "The Matsuyama International Center (MIC) gives daily-life consultation to foreign residents and runs Japanese classes, and the Ehime International Center (EPIC) also offers consultation and Japanese courses.",
      applicability: "For foreign residents of Matsuyama.",
      responsibleBody: "Matsuyama City", receivingOffice: "Matsuyama International Center (MIC), 6-4-20 Sanbancho",
      actions: [
        { title: "Get daily-life consultation", description: "Call or visit MIC (089-943-2025), 9 a.m. to 5:30 p.m., closed Mondays. The Ehime International Center takes daily-life consultations on a dedicated line (080-4783-5253), Monday to Saturday 9 a.m. to 5 p.m." },
        { title: "Join a Japanese class", description: "MIC and the Ehime International Center both run Japanese courses for foreign residents; contact them for schedules." },
      ],
      sourceIds: ["matsuyama-language-and-consultation-consultation", "matsuyama-language-and-consultation-japanese"],
      sourceFormatNote: `Matsuyama's pages are in Japanese. ${note}`,
    },
    {
      id: "matsuyama-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Matsuyama",
      summary: "In Matsuyama, notify the city when you leave employee pension coverage, move abroad (leaving Category I or switching to voluntary membership), or arrive from abroad.",
      applicability: "For residents aged 20 to 59 not covered by employee pension or as a dependent spouse.",
      responsibleBody: "Matsuyama City", receivingOffice: "Matsuyama City Hall, or the Matsuyama East or West Pension Office",
      actions: [
        { title: "Notify when your situation changes", description: "After leaving a job, switch from Category II to Category I. Moving abroad, you leave Category I or switch to voluntary membership; arriving from abroad, you join Category I. Japanese nationals living abroad can join voluntarily." },
      ],
      sourceIds: ["matsuyama-national-pension-notifications"],
      sourceFormatNote: `Matsuyama's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "tax-year", records: ["matsuyama-resident-tax"], statement: "Fiscal 2026 deadline \"March 16, 2026\"." },
    { kind: "old-source", records: ["matsuyama-language-and-consultation"], source: "Where to learn Japanese FAQ", date: "March 31, 2023" },
    { kind: "gap", records: ["matsuyama-household-waste"], gap: "Regular collection rules and times." },
  ],
});
