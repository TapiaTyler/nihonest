import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.chiba.jp";

/** Chiba City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-12100", name: "Chiba City", aliases: ["Chiba", "Chiba-shi"] },
  sources: [
    { id: "chiba-address-registration-from-abroad", title: "Moving to Chiba City from abroad", url: `${base}/shimin/shimin/kusei/tennyu_kokugai.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "chiba-address-registration-foreign-residents", title: "Procedures for foreign residents", url: `${base}/shimin/shimin/kusei/gaikokujinjuumin_tetuduki.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "chiba-national-health-insurance-filing", title: "Filing National Health Insurance joining and leaving (FAQ)", url: `${base}/faq/hokenfukushi/iryoeisei/hoken/1826.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "chiba-household-waste-rules", title: "Sorting and putting out household waste", url: `${base}/kankyo/junkan/shushugyomu/gomitop.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "chiba-household-waste-designated-bags", title: "Designated bags for burnable and non-burnable waste", url: `${base}/kankyo/junkan/shushugyomu/shinnshiteibukuro.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "chiba-household-waste-foreign-languages", title: "Waste and resources chart and collection days in other languages", url: `${base}/kankyo/junkan/shushugyomu/gomidasiitiranhyo.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "chiba-household-waste-bulky", title: "Putting out bulky waste", url: `${base}/kankyo/junkan/shushugyomu/sodaigomi.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "chiba-resident-tax-filing", title: "Municipal, prefectural, and income tax returns", url: `${base}/zaiseikyoku/zeimu/kazeikanri/shiminzeikenminzeisinkoku.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "chiba-resident-tax-agent", title: "Tax agents (FAQ)", url: `${base}/faq/zaiseikyoku/zeimu/kazeikanri/2350.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "chiba-disaster-preparation-hazard-map", title: "Chiba City earthquake, storm, and flood hazard map", url: `${base}/sogoseisaku/kikikanri/bosai/2019jisinfusuigaihazardmap.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "chiba-disaster-preparation-foreign-residents", title: "Disaster prevention guide portal for foreign residents", url: `${base}/shimin/shimin/kokusai/bousaiguide_portal.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "chiba-language-and-consultation-counter", title: "Chiba City General Consultation Counter for Foreign Residents", url: `${base}/shimin/shimin/kokusai/2019-kokusai-soudan.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "chiba-language-and-consultation-japanese-classes", title: "Where to learn Japanese in Chiba City (FAQ)", url: `${base}/faq/shimin/shimin/kokusai/nihongo_class.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "chiba-national-pension-joining", title: "Joining National Pension and changing category (FAQ)", url: `${base}/faq/hokenfukushi/iryoeisei/hoken/817.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "chiba-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Chiba City",
      summary: "Chiba City takes moving-in notifications within 14 days at ward office Citizen General Service Sections, weekdays 9 a.m. to 5 p.m. and on the second Sunday of each month in the morning, and at citizen centers on weekdays.",
      applicability: "Foreign residents moving into Chiba City from abroad or from another municipality. You must already live at the new address.",
      responsibleBody: "Chiba City", receivingOffice: "Citizen General Service Section (shimin sogo madoguchi-ka) of a ward office, or a citizen center",
      actions: [
        { title: "Notify within 14 days", description: "File within 14 days of moving in, once you actually live at the new address. Ward office Citizen General Service Sections are open weekdays 9 a.m. to 5 p.m. and on the second Sunday of each month and some holidays in late March from 9 a.m. to 12:30 p.m.; citizen centers are open weekdays 9 a.m. to 5 p.m. only. You can enter the form online up to two business days before visiting so you only sign at the counter, book a counter time online, and check ward office crowding in real time." },
        { title: "Bring passports and residence cards", description: "Bring the passport of everyone moving in (if it has no entry stamp, also bring your boarding pass stub or other proof of the entry date), identification, and each person's residence card or special permanent resident certificate; the residence card update also covers the residence notification to immigration. A foreign resident joining a foreign head of household generally needs a document proving the family relationship, with a Japanese translation if it is in another language." },
      ],
      sourceIds: ["chiba-address-registration-from-abroad", "chiba-address-registration-foreign-residents"],
      sourceFormatNote: `Chiba City's moving-in pages are in Japanese. ${note}`,
    },
    {
      id: "chiba-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Chiba City",
      summary: "Chiba City handles joining and leaving National Health Insurance at ward office Citizen General Service Sections and citizen centers within 14 days of the reason arising, weekdays 9 a.m. to 5 p.m.",
      applicability: "For residents who are not covered by workplace health insurance; the household head or a household member files, and anyone else needs the household head's letter of authorization.",
      responsibleBody: "Chiba City", receivingOffice: "Citizen General Service Section of a ward office, or a citizen center",
      actions: [
        { title: "File within 14 days", description: "Join within 14 days of moving in, leaving workplace insurance, or another reason, at a ward office's Citizen General Service Section or a citizen center, weekdays 9 a.m. to 5 p.m.; ward offices also open on their holiday opening days from 9 a.m. to 12:30 p.m. The documents depend on the reason and are listed in the city's National Health Insurance guide." },
        { title: "Filing for someone else", description: "A household member files with the same documents as the household head; anyone outside the household also needs a letter of authorization from the household head, and the identification checked is the filer's own." },
      ],
      sourceIds: ["chiba-national-health-insurance-filing"],
      sourceFormatNote: `Chiba City's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "chiba-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Chiba City",
      summary: "Chiba City requires its paid designated bags for burnable and non-burnable waste, publishes its sorting chart and collection days in six other languages, and collects bulky waste by application, put out by 8 a.m. on the day.",
      applicability: "Collection days differ by area; check the collection-day list or the Sanaru app for your address.",
      responsibleBody: "Chiba City",
      actions: [
        { title: "Use designated bags and the sorting chart", description: "Burnable and non-burnable waste go out in Chiba City's designated bags, sold at supermarkets, convenience stores, and other shops. The waste and resources chart and the collection-day lists are available in English, Chinese, Korean, Vietnamese, Tagalog, and Spanish. The household waste helpline answers questions about sorting and your collection days Monday to Saturday, 9 a.m. to 5 p.m." },
        { title: "Book bulky waste", description: "Apply by phone to the bulky waste reception center, Monday to Friday 9 a.m. to 4 p.m. and Saturday 9 to 11:30 a.m., or online or through LINE. Pay the fee by buying fee tickets before the collection day, or by card or smartphone payment when you apply online or through LINE. Put the items out at the designated place between early morning and 8 a.m. on the collection day; you do not need to be present." },
      ],
      sourceIds: ["chiba-household-waste-rules", "chiba-household-waste-designated-bags", "chiba-household-waste-foreign-languages", "chiba-household-waste-bulky"],
      sourceFormatNote: `Chiba City's waste pages are in Japanese; its sorting chart has versions in six other languages. ${note}`,
    },
    {
      id: "chiba-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Chiba City",
      summary: "Chiba City takes municipal and prefectural inhabitant tax returns at filing counters in every ward office from early February to the mid-March deadline, or by post, and asks people moving out, including abroad, to name a tax agent.",
      applicability: "Use Chiba City's route when you lived in Chiba City on January 1 of the tax year.",
      responsibleBody: "Chiba City", receivingOffice: "Filing counters at each ward office; after the deadline, the Citizen Tax Section of your city tax office",
      actions: [
        { title: "File during the filing period", description: "In 2026, ward offices took inhabitant tax returns on weekdays from February 2 to the March 16 deadline, 9 a.m. to 5 p.m.; early February and Mondays are busiest. You can also post the completed return in the envelope provided. Bring documents showing your income, such as a withholding slip, and certificates for insurance premiums and other deductions. After the deadline, consult your city tax office's Citizen Tax Section." },
        { title: "Name a tax agent when moving out", description: "When moving out of Chiba City, including abroad, you generally name a tax agent (nozei kanrinin) who lives in the city: submit the declaration if the agent lives in Chiba City, or the approval application if they live elsewhere, to a city tax office's Property Tax Section, weekdays 9 a.m. to 5 p.m. or by post." },
      ],
      sourceIds: ["chiba-resident-tax-filing", "chiba-resident-tax-agent"],
      sourceFormatNote: `Chiba City's tax pages are in Japanese. ${note}`,
    },
    {
      id: "chiba-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Chiba City",
      summary: "Chiba City's online earthquake, storm, and flood hazard map shows hazards and designated evacuation places by address, with English and Chinese versions, and its disaster guidebook for foreign residents covers seven languages.",
      applicability: "Evacuation places differ by type of disaster; check which ones apply to your address before a disaster.",
      responsibleBody: "Chiba City",
      actions: [
        { title: "Check the web hazard map", description: "The web hazard map lets you overlay maps, search by address, and, on a smartphone, see the distance to evacuation places from your location. English and Chinese (traditional and simplified) versions are available. Designated evacuation places differ by disaster type, and prefecture updates may not yet be reflected." },
        { title: "Read the guidebook for foreign residents", description: "The disaster prevention guidebook for foreign residents is in Japanese with English, Chinese, and Korean, or with Spanish, Vietnamese, and Nepali, and is available at City Hall, ward offices, and the Chiba City International Association; a video version is in English, Chinese, and Korean." },
      ],
      sourceIds: ["chiba-disaster-preparation-hazard-map", "chiba-disaster-preparation-foreign-residents"],
      sourceFormatNote: `Chiba City's hazard map page is in Japanese; the foreign-resident guide portal has an English section. ${note}`,
    },
    {
      id: "chiba-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Chiba City",
      summary: "Chiba City's General Consultation Counter for Foreign Residents, at the International Exchange Plaza in Chuo Ward, takes consultations in person, by phone, email, or LINE, with counselors in six languages and translation tablets, and the Chiba City International Association runs Japanese classes.",
      applicability: "For foreign residents of Chiba City. Counselors' languages vary by day, so check ahead.",
      responsibleBody: "Chiba City", receivingOffice: "Chiba City International Exchange Plaza (Chiba City International Association)",
      actions: [
        { title: "Use the consultation counter", description: "The counter is open Monday to Friday 9 a.m. to 8 p.m. and Saturday 9 a.m. to 5 p.m. (closed Sundays, holidays, and the New Year period). Counselors speak English, Chinese, Korean, Spanish, Vietnamese, and Ukrainian on set days, and tablets with automatic translation cover other languages. Free legal consultation with a lawyer is available by reservation." },
        { title: "Learn Japanese", description: "The Chiba City International Association offers Japanese classes and one-to-one learning, and lists other Japanese classes in the city." },
      ],
      sourceIds: ["chiba-language-and-consultation-counter", "chiba-language-and-consultation-japanese-classes"],
      sourceFormatNote: `Chiba City's consultation pages are in Japanese, some with readings. ${note}`,
    },
    {
      id: "chiba-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Chiba City",
      summary: "Chiba City handles joining National Pension as a Category I insured person at ward office Citizen General Service Sections and citizen centers, weekdays 9 a.m. to 5 p.m., for residents aged 20 to 59 who leave a job or a spouse's coverage.",
      applicability: "For residents aged 20 to 59 who are not covered through an employer or as a dependent spouse.",
      responsibleBody: "Chiba City", receivingOffice: "Citizen General Service Section of a ward office, or a citizen center",
      actions: [
        { title: "Join after leaving a job", description: "After leaving a job, join as a Category I insured person, bringing your Basic Pension Number notice (or something showing the number), your seal, and a document showing the date you left, such as a health insurance loss-of-coverage certificate. A dependent spouse also switches, bringing the spouse's Basic Pension Number as well. A gap of even one day between jobs needs the same procedure." },
        { title: "Counter hours", description: "Ward office Citizen General Service Sections and citizen centers take these procedures from 9 a.m. to 5 p.m., closed weekends, holidays, and December 29 to January 3." },
      ],
      sourceIds: ["chiba-national-pension-joining"],
      sourceFormatNote: `Chiba City's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "tax-year", records: ["chiba-resident-tax"], statement: "2026 filing counters \"from February 2 to the March 16 deadline\"." },
    { kind: "gap", records: ["chiba-household-waste"], gap: "The regular waste deadline (in the sorting chart PDF)." },
    { kind: "gap", records: ["chiba-national-pension"], gap: "Joining when moving in from abroad." },
  ],
});
