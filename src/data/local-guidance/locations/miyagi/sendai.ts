import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.sendai.jp";

/** Sendai City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-04100", name: "Sendai City", aliases: ["Sendai", "Sendai-shi"] },
  sources: [
    { id: "sendai-address-registration-special-counter", title: "Special counter for foreign nationals moving from overseas", url: `${base}/kosekijumin/kurashi/tetsuzuki/koseki/gaikokujin.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sendai-national-health-insurance-joining", title: "Joining National Health Insurance", url: `${base}/kenko-hoken/kurashi/tetsuzuki/kokumin/kenkohoken/hoken/index.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sendai-national-health-insurance-procedures", title: "National Health Insurance procedures by situation", url: `${base}/kenko-hoken/kurashi/tetsuzuki/kokumin/kenkohoken/konnatoki.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sendai-household-waste-household", title: "Putting out household waste", url: `${base}/haiki-shido/kurashi/machi/genryo/gomi/wakekata/kategomi.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sendai-household-waste-bulky", title: "Putting out and booking bulky waste", url: `${base}/haiki-kanri/kurashi/machi/genryo/gomi/wakekata/sodaigomi.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sendai-household-waste-pamphlets", title: "Waste pamphlets, including other languages", url: `${base}/haiki-shido/kurashi/machi/genryo/gomi/wakekata/pamph.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sendai-resident-tax-filing", title: "Filing the individual inhabitant tax return", url: `${base}/futsuchoshudaichi/kurashi/tetsuzuki/zekin/kojin/shinkoku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sendai-disaster-preparation-shelters", title: "Where are the evacuation shelters?", url: `${base}/anzensuishin/kurashi/anzen/saigaitaisaku/hinanjo/doko.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sendai-language-and-consultation-multicultural-center", title: "Sendai Multicultural Center relocation", url: `${base}/koryu/kisya/iten20241121.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "sendai-national-pension-procedures", title: "National Pension procedures by situation", url: `${base}/hokennenkin-kanri/kurashi/tetsuzuki/kokumin/nenkin/tetsuzuki.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "sendai-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Sendai",
      summary: "Sendai registers foreign residents moving in from abroad at the resident registration counters of ward offices and general branch offices, and in autumn 2026 ran a bookable special counter that also handled the residence card, National Health Insurance, and National Pension in one visit.",
      applicability: "Foreign residents moving to Sendai from abroad. Moves from within Japan, and all other procedures, go to the ward office or general branch office.",
      responsibleBody: "Sendai City", receivingOffice: "Resident registration counter, ward office or general branch office",
      actions: [
        { title: "Use the special counter when it runs", description: "In autumn 2026, the special counter at the AER Building (5th floor) in Aoba Ward took online reservations for weekdays from September 24 to October 2, 9 a.m. to 4 p.m., in 30-minute slots. After booking, you enter your details online in Japanese or English, then bring your residence card and passport (only your passport if you entered at a smaller airport), a document showing your new address if you have one, and a letter of authorization if someone files for you." },
        { title: "Otherwise go to your ward office", description: "Outside those dates, and for moves from within Japan, file at the resident registration counter of the ward office or general branch office. The special counter handles resident registration, updating your residence card, joining National Health Insurance, and joining National Pension together." },
      ],
      sourceIds: ["sendai-address-registration-special-counter"],
      sourceFormatNote: `Sendai's special counter page is in Japanese and English. ${note}`,
    },
    {
      id: "sendai-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Sendai",
      summary: "In Sendai, foreign residents registered with a period of stay over three months who are not in workplace insurance join National Health Insurance by household within 14 days, with the household head filing; certificates are valid until July 31 each year.",
      applicability: "Not for workplace insurance members, public assistance recipients, or Designated Activities holders staying for medical care or for tourism and recreation of up to a year.",
      responsibleBody: "Sendai City",
      actions: [
        { title: "Join within 14 days", description: "Joining and leaving must be notified within 14 days, by household, usually by the household head. Moving in, bring the moving-out certificate from your previous municipality (if in Japan) and something showing your My Number; after leaving workplace insurance, bring the loss-of-coverage certificate. The filer (household head or the person joining) also brings photo identification such as a passport." },
        { title: "Keep your certificate current", description: "Sendai's Certificate of Eligibility is valid until July 31 each year, and a new one is posted by registered mail from late June to July. People with a My Number Card registered for health insurance receive a Notice of Eligibility Information instead. If your status changes to medical or tourism activities, you must notify the city to leave National Health Insurance." },
      ],
      sourceIds: ["sendai-national-health-insurance-joining", "sendai-national-health-insurance-procedures"],
      sourceFormatNote: `Sendai's National Health Insurance pages are in Japanese. ${note}`,
    },
    {
      id: "sendai-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Sendai",
      summary: "Sendai collects household waste twice a week, holidays included, in designated bags put out between early morning and 8:30 a.m., and collects bulky items over about 30 cm by paid application; its sorting guide is in English, Chinese, Korean, Vietnamese, and Nepali.",
      applicability: "Collection days are set by address; check the city's collection day list.",
      responsibleBody: "Sendai City",
      actions: [
        { title: "Use designated bags by 8:30 a.m.", description: "Household waste (what remains after paper, cans, bottles, PET bottles, batteries, and plastic resources are separated) is collected twice a week on set days, including holidays. Put it at your collection point between early morning and 8:30 a.m. on the day, never the day before, in the designated household waste bags, even if you use a bin; up to 10 kg (45 liters) at a time. The sorting guide, with plain Japanese, is available in English, Chinese, Korean, Vietnamese, and Nepali at ward offices." },
        { title: "Book bulky waste", description: "Items longer than about 30 cm and up to 100 kg are bulky waste, collected on set days about every two weeks. Book online or by phone with the bulky waste reception center, Monday to Friday 9 a.m. to 5 p.m. (holidays included), which gives you a reception number, fee, collection day, and place; buy fee stickers for the amount. The city does not generally carry items out of your home." },
      ],
      sourceIds: ["sendai-household-waste-household", "sendai-household-waste-bulky", "sendai-household-waste-pamphlets"],
      sourceFormatNote: `Sendai's waste pages are in Japanese; its sorting guide has versions in five other languages. ${note}`,
    },
    {
      id: "sendai-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Sendai",
      summary: "Sendai asks residents on January 1 to file an inhabitant tax return unless they filed an income-tax return or had only salary or pension income, and encourages filing online with a My Number Card or by post.",
      applicability: "Use Sendai's route when you lived in Sendai on January 1 of the tax year. People with no income should also file, or the city may not issue a non-taxation certificate and fees such as National Health Insurance may be higher.",
      responsibleBody: "Sendai City",
      actions: [
        { title: "Check whether you must file", description: "You do not need to file if you file an income-tax return, if your only income was salary or public pension (unless you changed jobs mid-year without a year-end adjustment or claim extra deductions), or if you are a dependent of such a person living in Sendai. Otherwise file, even with no income. Salary earners with other income of 200,000 yen or less still file for inhabitant tax." },
        { title: "File online or by post", description: "Online filing with a My Number Card through eLTAX, Mynaportal, or the city website started with the 2026 tax year. To post a return, the city's calculation corner prepares the form. Include your My Number and show identity documents." },
      ],
      sourceIds: ["sendai-resident-tax-filing"],
      sourceFormatNote: `Sendai's tax page is in Japanese. ${note}`,
    },
    {
      id: "sendai-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Sendai",
      summary: "Sendai's designated shelters are city schools with open space and buildings, backed by local and wide-area evacuation places in parks and welfare shelters; the Sendai evacuation information website finds shelters by address.",
      applicability: "Check your nearest shelter and evacuation route ahead of time.",
      responsibleBody: "Sendai City",
      actions: [
        { title: "Know the kinds of place", description: "Designated shelters are city elementary, junior high, and high schools where people stay after evacuating. Local evacuation places are larger parks for areas where shelters are hard to reach, and wide-area evacuation places are large parks for when spreading fire makes shelters unsafe. Welfare shelters open for people who cannot manage in an ordinary shelter." },
        { title: "Find your shelter", description: "Search by address on the Sendai evacuation information website, or by map on Sendai Kurashi no Map." },
      ],
      sourceIds: ["sendai-disaster-preparation-shelters"],
      sourceFormatNote: `Sendai's shelter page is in Japanese. ${note}`,
    },
    {
      id: "sendai-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Sendai",
      summary: "The Sendai Multicultural Center, run by the Sendai Tourism, Convention and International Association (SenTIA), is the city's one-stop consultation counter for foreign residents, open 9 a.m. to 5 p.m. on the first floor of the Sendai Park Building in Aoba Ward.",
      applicability: "For foreign residents of Sendai. The center is expected to move back into the new City Hall when it is complete.",
      responsibleBody: "Sendai City", receivingOffice: "Sendai Multicultural Center, Sendai Park Building 1st floor, 3-6-1 Kokubuncho, Aoba Ward",
      actions: [
        { title: "Consult the Multicultural Center", description: "The center takes consultations in multiple languages, runs an interpreting support phone line and specialist consultation sessions for foreign residents, arranges community interpreters, and provides living guides and disaster information in several languages. It is open 9 a.m. to 5 p.m., closed over the New Year period." },
      ],
      sourceIds: ["sendai-language-and-consultation-multicultural-center"],
      sourceFormatNote: `Sendai's page on the center is in Japanese. ${note}`,
    },
    {
      id: "sendai-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Sendai",
      summary: "In Sendai, you switch to National Pension Category I at the ward office or general branch office when you leave employee pension coverage or a spouse's coverage; joining through work or as a dependent spouse goes through the employer.",
      applicability: "For residents aged 20 to 59 who are not covered through an employer or as a dependent spouse.",
      responsibleBody: "Sendai City", receivingOffice: "Insurance and Pension Section, ward office or general branch office",
      actions: [
        { title: "Switch at the ward office", description: "After leaving employee pension coverage (you and a dependent spouse) or a spouse's coverage, notify the ward office or general branch office with your pension book or Basic Pension Number notice and a document showing the date. Bring your My Number Card, or identification plus a document showing your My Number." },
        { title: "Joining at 20 happens automatically", description: "Since October 2019 people turning 20 do not need to apply; the Japan Pension Service sends a National Pension notice within about two weeks." },
      ],
      sourceIds: ["sendai-national-pension-procedures"],
      sourceFormatNote: `Sendai's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "dated", from: "2026-10-05", records: ["sendai-address-registration"], change: "The autumn 2026 special counter for foreign residents moving from overseas closes after October 2, 2026.", action: "Remove or update the special counter dates; check whether a spring counter is announced." },
    { kind: "old-source", records: ["sendai-language-and-consultation"], source: "Multicultural Center relocation notice (hours and services)", date: "November 21, 2024" },
    { kind: "gap", records: ["sendai-address-registration"], gap: "Regular ward office counter hours and documents for moving in from abroad." },
    { kind: "gap", records: ["sendai-resident-tax"], gap: "Filing deadline and the leaving-Japan (tax agent) step." },
    { kind: "gap", records: ["sendai-language-and-consultation"], gap: "Consultation languages by day; Japanese classes." },
  ],
});
