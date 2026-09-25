import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const en = "https://www.city.yokohama.lg.jp/lang/residents/en";
const moving = "https://www.city.yokohama.lg.jp/kurashi/koseki-zei-hoken/todokede/koseki-juminhyo/todokede-touroku/jyumin";

/** Yokohama City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-14100", name: "Yokohama City", aliases: ["Yokohama", "Yokohama-shi"] },
  sources: [
    { id: "yokohama-address-registration-from-abroad", title: "Moving-in notification from abroad", url: `${moving}/tennyuu_kokugai.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "yokohama-address-registration-counter", title: "Moving-in notification at the counter (from another municipality)", url: `${moving}/tennyuu_shigai/mado.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "yokohama-national-health-insurance-joining", title: "Joining and leaving the National Health Insurance scheme", url: `${en}/insurance/kokuhoenglish.html`, language: "en", lastCheckedAt: "2026-09-25" },
    { id: "yokohama-household-waste-rules", title: "Rules for disposing of garbage", url: `${en}/garbage/default.html`, language: "en", lastCheckedAt: "2026-09-25" },
    { id: "yokohama-household-waste-sorting", title: "Sorting and disposal procedures for garbage and recyclables", url: `${en}/garbage/sortinganddisposal.html`, language: "en", lastCheckedAt: "2026-09-25" },
    { id: "yokohama-household-waste-oversized", title: "Oversized garbage", url: `${en}/garbage/oversizedgarbage.html`, language: "en", lastCheckedAt: "2026-09-25" },
    { id: "yokohama-resident-tax-municipal", title: "Municipal tax", url: `${en}/taxes/shizeienglish.html`, language: "en", lastCheckedAt: "2026-09-25" },
    { id: "yokohama-disaster-preparation-preparing", title: "Preparing for disasters", url: `${en}/emergencies/saigaihesonaeru.html`, language: "en", lastCheckedAt: "2026-09-25" },
    { id: "yokohama-disaster-preparation-inundation-maps", title: "Inundation hazard maps (flood, inland flooding, and storm surge)", url: "https://www.city.yokohama.lg.jp/bousai-kyukyu-bohan/bousai-saigai/map/shinsui/sinsuiHM.html", language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "yokohama-language-and-consultation-information-center", title: "YOKOHAMA Foreign Residents Information Center", url: `${en}/support/yokoinfo_en.html`, language: "en", lastCheckedAt: "2026-09-25" },
    { id: "yokohama-language-and-consultation-lounges", title: "International lounges", url: `${en}/support/Internationallounge.html`, language: "en", lastCheckedAt: "2026-09-25" },
    { id: "yokohama-national-pension", title: "National Pension Plan", url: `${en}/insurance/default2020030316.html`, language: "en", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "yokohama-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Yokohama",
      summary: "Yokohama takes moving-in notifications only at the Family Register Section of the ward office for your new address, within 14 days of starting to live there, on weekdays from 8:45 a.m. to 5 p.m.; City Hall and administrative service corners cannot accept them.",
      applicability: "Foreign residents moving into Yokohama from abroad with a residence card (a period of stay over three months) or as special permanent residents, or from another municipality in Japan. Moves between Yokohama's wards use a separate notification.",
      responsibleBody: "Yokohama City", receivingOffice: "Family Register Section (registration), ward office for your new address",
      actions: [
        { title: "Notify the ward office within 14 days", description: "Go to the ward office for your new address within 14 days of starting to live there, on weekdays from 8:45 a.m. to 5 p.m. You cannot file before you arrive in Japan. If the 14th day falls on a day the ward office is closed, the deadline moves to the next opening day. For moves from another municipality, the ward office also accepts the notification on the second and fourth Saturdays from 9 a.m. to noon." },
        { title: "Bring the form and documents", description: "Bring the resident change notification form (downloadable online or available at the ward office), identification, and your residence card or special permanent resident certificate. If you did not receive a residence card at the airport, bring your passport with the stamp saying it will be issued later. Foreign heads of household with foreign family members need documents showing the family relationship, with a translation naming the translator if they are in another language. Moving from another municipality, also bring the original moving-out certificate. Short-term visitors and people with a period of stay of three months or less cannot be registered." },
      ],
      sourceIds: ["yokohama-address-registration-from-abroad", "yokohama-address-registration-counter"],
      sourceFormatNote: `Yokohama's moving-in pages are in Japanese. ${note}`,
    },
    {
      id: "yokohama-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Yokohama",
      summary: "In Yokohama, you notify the National Health Insurance counter of your ward office within 14 days of joining, leaving, or changing details, and receive a Certificate of Eligibility or, with a Myna Health Insurance Card, a Notice of Eligibility Information.",
      applicability: "For residents who are not in employee health insurance, the Advanced Elderly Medical Service System, or public assistance, including foreign residents staying more than three months.",
      responsibleBody: "Yokohama City", receivingOffice: "Health Insurance and Pension Division, ward office where you live",
      actions: [
        { title: "Join within 14 days at your ward office", description: "Notify your ward office's Health Insurance and Pension Division within 14 days of moving to Yokohama from outside the city, leaving employee health insurance, stopping public assistance, or having a child. Bring identification such as a residence card or passport; after leaving employee health insurance, also bring a document showing when that coverage ended." },
        { title: "Report changes and leaving", description: "Also notify within 14 days when you join employee health insurance, move out of Yokohama, move between wards (at the new ward's office), or your household or name changes, bringing your previous Certificate of Eligibility. Using the certificate after coverage ends may mean repaying the medical costs the city covered. Guidebooks are available in English, Chinese, Korean, Spanish, and Portuguese." },
      ],
      sourceIds: ["yokohama-national-health-insurance-joining"],
      sourceFormatNote: `Yokohama's English page for National Health Insurance is the source; inquiries to ward offices are in Japanese only. ${note}`,
    },
    {
      id: "yokohama-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Yokohama",
      summary: "Yokohama collects sorted garbage and recyclables at designated collection sites by 8 a.m. on days set for each area, mostly in transparent or semitransparent bags, and collects oversized garbage by paid application to its reception center.",
      applicability: "Collection days differ by area; check the sticker at your collection site or ask your neighbors.",
      responsibleBody: "Yokohama City",
      actions: [
        { title: "Sort and put out by 8 a.m.", description: "Put sorted garbage and recyclables at your collection site by 8 a.m. on the collection day, never the night before or after collection. Burnable garbage, spray cans, batteries, plastic resources, cans, bottles, PET bottles, and used cloth go in transparent or semitransparent bags; wrap non-burnable items and label them; tie used paper with string. Wrongly sorted garbage is left with a warning sticker, and repeat offenders can be fined 2,000 yen. Sorting pamphlets are in 6 languages and leaflets in 10." },
        { title: "Book oversized garbage", description: "Metal items with a longest side of 30 cm or more and other items of 50 cm or more are oversized garbage. Apply online at any time or call the Oversized Garbage Reception Center, which serves callers in English, Chinese, Korean, Spanish, and Portuguese, from 8:30 a.m. to 5 p.m., Monday to Saturday including holidays. Collection takes about two weeks. Pay the fee at a bank, post office, or convenience store for a collection sticker, and put the item out by 8 a.m. on the day at the place you were given." },
      ],
      sourceIds: ["yokohama-household-waste-rules", "yokohama-household-waste-sorting", "yokohama-household-waste-oversized"],
      sourceFormatNote: `Yokohama's waste pages are in English. ${note}`,
    },
    {
      id: "yokohama-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Yokohama",
      summary: "Yokohama sends resident tax notices at the beginning of June, asks everyone living in the city on January 1 to file by March 15 unless an exception applies, and requires paying in full or naming a tax agent before leaving Japan.",
      applicability: "Use Yokohama's route when you lived in Yokohama on January 1 of the tax year; moving out later in the year does not change where you pay.",
      responsibleBody: "Yokohama City", receivingOffice: "Municipal Tax Section, Tax Division, ward office for your address on January 1",
      actions: [
        { title: "File by March 15 if needed", description: "Everyone living in Yokohama on January 1 files a declaration of the previous year's income by March 15, whether or not they had income, unless they filed an income-tax return or had only employment income reported by their employer. Submit it to the Tax Division of the ward office where you lived on January 1. Not filing can mean your National Health Insurance premiums are not calculated correctly." },
        { title: "Pay, or arrange before leaving Japan", description: "Pay with the slips at a bank or convenience store, by direct debit, or online, or have the tax deducted from your salary. If you cannot pay by the deadline, consult your ward office's Tax Collection Section. Before moving abroad, pay the tax levied so far in full, or name a tax agent (nozei kanrinin) at your ward office's Tax Division." },
      ],
      sourceIds: ["yokohama-resident-tax-municipal"],
      sourceFormatNote: `Yokohama's municipal tax page is in English; tax inquiries are in Japanese only. ${note}`,
    },
    {
      id: "yokohama-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Yokohama",
      summary: "Yokohama distinguishes temporary evacuation sites, evacuation areas for spreading fires, and evacuation shelters for people who cannot stay home, and publishes one inundation hazard map per ward covering floods, inland flooding, and storm surge.",
      applicability: "Check your ward's hazard map and nearest evacuation sites ahead of time; during an event, follow the city's evacuation information.",
      responsibleBody: "Yokohama City",
      actions: [
        { title: "Know the three kinds of evacuation place", description: "First go to the temporary evacuation site set by your neighborhood association, unless circumstances require going elsewhere. Evacuation areas protect you from the heat and smoke of fires spreading after an earthquake. Evacuation shelters take anyone whose home has become uninhabitable after an earthquake and hold basic food and water. Pocket leaflets on earthquakes are available in English, Korean, Chinese, Spanish, Portuguese, Tagalog, Vietnamese, Thai, and Indonesian." },
        { title: "Check your ward's hazard map and get alerts", description: "Each ward's inundation hazard map shows expected flooding from rivers and sewers and, for ten wards, storm surge, with shelters; the Waiwai Bosai Map lets you search by address. Sign up for the city's disaster email list, which also has an English version with less information; emergency alerts reach mobile phones in the city without registration." },
      ],
      sourceIds: ["yokohama-disaster-preparation-preparing", "yokohama-disaster-preparation-inundation-maps"],
      sourceFormatNote: `Yokohama's disaster preparation page is in English; its hazard map page is in Japanese. ${note}`,
    },
    {
      id: "yokohama-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Yokohama",
      summary: "The YOKOHAMA Foreign Residents Information Center gives free, confidential consultation in 12 languages on weekdays, with phone interpreting for ward office calls, and ward international lounges offer consultation, information, and Japanese classes.",
      applicability: "For foreign residents of Yokohama. The center can connect you to ward offices; residence-status procedures go to the Immigration Services Agency.",
      responsibleBody: "Yokohama City", receivingOffice: "YOKOHAMA Foreign Residents Information Center",
      actions: [
        { title: "Use the Information Center", description: "Consultation is free and confidential in Japanese, English, Chinese, Korean, Vietnamese, Nepali, Indonesian, Tagalog, Thai, Portuguese, Spanish, and Ukrainian, Monday to Friday from 10 a.m. to 4 p.m., in person, by phone, or by tablet interpreting. The center also interprets by phone when you need to contact a ward office, arranges volunteer interpreters, and holds free legal consultations on the first Thursday of the month from 1 p.m. to 4 p.m." },
        { title: "Visit an international lounge", description: "International lounges in many wards, such as Tsurumi, Naka, Kohoku, and Aoba, give daily-life information and consultation in several languages, run Japanese classes, dispatch volunteer interpreters, and hold cross-cultural events." },
      ],
      sourceIds: ["yokohama-language-and-consultation-information-center", "yokohama-language-and-consultation-lounges"],
      sourceFormatNote: `Yokohama's pages on consultation and lounges are in English. ${note}`,
    },
    {
      id: "yokohama-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Yokohama",
      summary: "In Yokohama, Category I National Pension enrollment is handled at the National Pension counter of your ward office; employees join through their workplace, and dependent spouses through their spouse's workplace.",
      applicability: "For residents aged 20 to 59, including foreign residents, who are self-employed, students, or not employed and not a dependent spouse of an employee.",
      responsibleBody: "Yokohama City", receivingOffice: "National Pension Section, ward office where you live",
      actions: [
        { title: "Join at your ward office", description: "Apply to join as a Category I insured person at the National Pension Section of your ward office. Pay with the payment slips you receive by post at a bank, post office, or convenience store, or by direct debit, online banking, or credit card. National Pension pamphlets are available in 14 languages." },
        { title: "Ask about exemption and student postponement", description: "If paying is difficult, you can apply for a full or partial exemption, or postponement if you are under 50; students can apply for the student payment special system with proof of student status, such as a student ID card. Foreign residents who meet the conditions can claim a lump-sum withdrawal payment after leaving Japan; the Japan Pension Service handles that claim." },
      ],
      sourceIds: ["yokohama-national-pension"],
      sourceFormatNote: `Yokohama's National Pension page is in English; ward office inquiries are in Japanese only. ${note}`,
    },
  ],
  recheck: [
    { kind: "old-source", records: ["yokohama-disaster-preparation"], source: "English page on preparing for disasters", date: "March 1, 2024" },
    { kind: "gap", records: ["yokohama-language-and-consultation"], gap: "The Information Center's address and each lounge's Japanese class schedule." },
  ],
});
