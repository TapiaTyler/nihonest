import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.kawasaki.jp";

/** Kawasaki City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-14130", name: "Kawasaki City", aliases: ["Kawasaki", "Kawasaki-shi"] },
  sources: [
    { id: "kawasaki-address-registration-moving-in", title: "Moving-in notification (from outside the city)", url: `${base}/250/page/0000037068.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawasaki-address-registration-from-abroad", title: "Moving in from abroad (FAQ)", url: `${base}/templates/faq/250/0000012248.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawasaki-national-health-insurance-joining", title: "Joining National Health Insurance", url: `${base}/350/page/0000139064.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawasaki-national-health-insurance-counters", title: "National Health Insurance inquiries and ward office counters", url: `${base}/350/page/0000136314.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawasaki-household-waste-normal", title: "Normal garbage", url: `${base}/kurashi/category/261-1-10-9-0-0-0-0-0-0.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawasaki-household-waste-bulky", title: "Putting out bulky garbage", url: `${base}/300/page/0000012773.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawasaki-household-waste-foreign-languages", title: "Sorting and putting out recyclables and garbage (pamphlets in other languages)", url: `${base}/300/page/0000040087.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawasaki-resident-tax-filing", title: "Municipal and prefectural inhabitant tax return", url: `${base}/230/page/0000058803.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawasaki-resident-tax-online-filing", title: "Filing the inhabitant tax return online", url: `${base}/230/page/0000181190.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawasaki-resident-tax-agent", title: "Tax agent declaration", url: `${base}/230/page/0000057305.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawasaki-disaster-preparation-maps", title: "Kawasaki disaster maps (places to evacuate)", url: `${base}/601/page/0000036154.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawasaki-disaster-preparation-flood-maps", title: "Flood hazard maps", url: `${base}/530/page/0000018174.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawasaki-language-and-consultation-counters", title: "Consultation counters for foreign residents", url: `${base}/250/page/0000138296.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "kawasaki-national-pension-notifications", title: "National Pension notifications", url: `${base}/350/page/0000035215.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "kawasaki-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Kawasaki",
      summary: "Kawasaki takes moving-in notifications at the Resident Section (Kumin-ka) of the ward office for your new address within 14 days; moves from abroad are accepted only on weekdays from 8:30 a.m. to 5 p.m.",
      applicability: "Foreign residents moving into Kawasaki from abroad or from another municipality in Japan. City Hall, branch offices, and administrative service corners do not accept moving-in notifications.",
      responsibleBody: "Kawasaki City", receivingOffice: "Resident Section (Kumin-ka), ward office for your new address",
      actions: [
        { title: "Notify the ward office within 14 days", description: "Notify the Resident Section of the ward office for your new address within 14 days of moving in; you cannot file before that day. Moves from another municipality are also accepted on the second and fourth Saturdays from 8:30 a.m. to 12:30 p.m., but moves from abroad only on weekdays from 8:30 a.m. to 5 p.m. Early morning is usually less crowded. You can enter the form online in advance to shorten the time at the counter." },
        { title: "Bring passports and residence cards for everyone", description: "Moving in from abroad, bring the passport and residence card (or special permanent resident certificate) of everyone moving in. If you entered through an automated gate, your passport has no entry stamp, so ask an immigration officer for one at the airport or bring your boarding pass stub. Moving from another municipality, bring the moving-out certificate from your previous city. Missing the 14-day deadline can lead to a non-penal fine of up to 50,000 yen, and a foreign resident who does not report a residential address without good reason can have their residence status revoked." },
      ],
      sourceIds: ["kawasaki-address-registration-moving-in", "kawasaki-address-registration-from-abroad"],
      sourceFormatNote: `Kawasaki's moving-in pages are in Japanese. ${note}`,
    },
    {
      id: "kawasaki-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Kawasaki",
      summary: "Kawasaki asks you to join National Health Insurance within 14 days at your ward office: at the Resident Section if you are also registering a move, otherwise at the Insurance and Pension Section. Coverage starts from the qualifying date even if you file late.",
      applicability: "For registered foreign residents with a period of stay over three months, and certain others, who are not covered by workplace health insurance. People with a social security agreement certificate from the United States, Belgium, France, the Netherlands, the Czech Republic, Switzerland, Hungary, or Luxembourg do not need to join.",
      responsibleBody: "Kawasaki City", receivingOffice: "Ward office: Resident Section (with a move) or Insurance and Pension Section",
      actions: [
        { title: "Join within 14 days", description: "Notify your ward office within 14 days of the reason arising, such as moving in or leaving workplace insurance; sub-offices (shutchojo) and administrative service corners cannot take it. Bring documents showing the My Number of the household head and each person joining, the filer's photo identification, and your residence card; people with Designated Activities status also bring their passport. If you file late, premiums are charged back to the qualifying date, and medical costs before filing are generally not covered." },
        { title: "Know what comes next", description: "After the counter procedure, the Certificate of Eligibility, or a Notice of Eligibility Information if you have a My Number Card registered as a health insurance card, arrives by post, usually in about a week to 10 days. Premiums are in principle paid by account transfer. Leaving workplace insurance is the only case you can also file online through Mynaportal. General questions go to the Kawasaki insurance call center." },
      ],
      sourceIds: ["kawasaki-national-health-insurance-joining", "kawasaki-national-health-insurance-counters"],
      sourceFormatNote: `Kawasaki's National Health Insurance pages are in Japanese. ${note}`,
    },
    {
      id: "kawasaki-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Kawasaki",
      summary: "Kawasaki collects normal garbage twice a week by 8 a.m. in a lidded container or transparent bag, with no designated bags, and collects bulky garbage twice a month by application online or by phone.",
      applicability: "Collection days differ by area; check the city's collection-day table for your address.",
      responsibleBody: "Kawasaki City",
      actions: [
        { title: "Put out normal garbage by 8 a.m.", description: "Normal garbage is burnable waste other than cans, PET bottles, bottles, used batteries, mixed paper, plastic resources, small metal items, and bulky garbage. Put it out twice a week by 8 a.m. on collection day, never the night before, in a lidded plastic container or a transparent or semitransparent bag; there are no designated bags, but do not use black bags. Wrap breakables such as glass and ceramics in thick paper, mark them as dangerous, and put them out as normal garbage. Sorting pamphlets are available in English, Chinese, Korean, Portuguese, Spanish, Filipino, and Vietnamese." },
        { title: "Book bulky garbage", description: "Apply to the bulky garbage reception center online at any time or by phone; book early, as popular dates fill up, and pay the handling fee. Collection is twice a month. Items of 100 kg or more or 2 m or longer, business waste, computers, motorcycles, and air conditioners, TVs, refrigerators, and washing machines are not collected; rechargeable batteries of 30 cm or more must be booked by phone." },
      ],
      sourceIds: ["kawasaki-household-waste-normal", "kawasaki-household-waste-bulky", "kawasaki-household-waste-foreign-languages"],
      sourceFormatNote: `Kawasaki's waste pages are in Japanese; its sorting pamphlets have versions in seven other languages. ${note}`,
    },
    {
      id: "kawasaki-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Kawasaki",
      summary: "In Kawasaki, resident tax returns go to a city tax office (shizei jimusho), not the ward office, by March 15; they can also be filed online with a My Number Card. Before leaving Japan, name a tax agent.",
      applicability: "Use Kawasaki's route when you lived in Kawasaki on January 1 of the tax year.",
      responsibleBody: "Kawasaki City", receivingOffice: "Citizen Tax Section, city tax office (shizei jimusho) or tax branch office for your area",
      actions: [
        { title: "File by March 15 if needed", description: "Everyone living in Kawasaki on January 1 declares the previous year's income by March 15, except people who filed an income-tax return, people with only employment income whose employer submitted a year-end-adjusted salary report, and people with only public pension income who claim no extra deductions. Submit the form at any city tax office or tax branch office, or by post to the office for your area (not by email or fax), with My Number and identity documents. You can also file online through eLTAX or Mynaportal with a My Number Card." },
        { title: "Name a tax agent before leaving Japan", description: "If you will not be able to receive tax notices or pay after leaving Japan, declare a tax agent (nozei kanrinin) before you leave: use the declaration form if the agent lives in Kawasaki, or the approval application if they live elsewhere. Submit it at a city tax office with your identification, by post with a copy, or through eLTAX." },
      ],
      sourceIds: ["kawasaki-resident-tax-filing", "kawasaki-resident-tax-online-filing", "kawasaki-resident-tax-agent"],
      sourceFormatNote: `Kawasaki's tax pages are in Japanese. ${note}`,
    },
    {
      id: "kawasaki-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Kawasaki",
      summary: "Kawasaki publishes a disaster map for each ward showing evacuation shelters and emergency water supply points, with older versions in six other languages, and flood hazard maps for each ward showing expected depth and duration of flooding from the Tama and Tsurumi rivers.",
      applicability: "Check your ward's maps ahead of time; during an event, follow the city's evacuation information.",
      responsibleBody: "Kawasaki City",
      actions: [
        { title: "Check your ward's disaster map", description: "The Japanese disaster map for each of Kawasaki's seven wards shows evacuation shelters and emergency water supply points as of April 1, 2026; the maps can also be viewed on Guide Map Kawasaki and the city's disaster portal. Versions in English, Chinese, Korean, Spanish, Portuguese, and Tagalog exist, but they show information as of January 1, 2015, so confirm shelters on the current Japanese map." },
        { title: "Check the flood hazard map", description: "Flood hazard maps for each ward show the areas expected to flood, how deep, and for how long if the Tama or Tsurumi rivers overflow, with local evacuation places. The information side was updated from May 29, 2026 for the new weather warning system. Printed copies are available at ward offices, branch offices, and City Hall." },
      ],
      sourceIds: ["kawasaki-disaster-preparation-maps", "kawasaki-disaster-preparation-flood-maps"],
      sourceFormatNote: `Kawasaki's disaster pages are in Japanese. ${note}`,
    },
    {
      id: "kawasaki-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Kawasaki",
      summary: "Kawasaki has two free, confidential consultation counters for foreign residents: the Kawasaki International Center, in 11 languages including plain Japanese, and the Kawasaki Multicultural Plaza at City Hall, in six languages.",
      applicability: "For foreign residents of Kawasaki with any question or problem in daily life.",
      responsibleBody: "Kawasaki City",
      actions: [
        { title: "Use the International Center", description: "The Kawasaki International Center in Nakahara Ward takes consultations in plain Japanese, English, Chinese, Filipino, Portuguese, Nepali, Vietnamese, Spanish, Indonesian, Thai, and Korean, from 9 a.m. to 5 p.m., at the counter, by phone, or by email; online consultation needs a reservation on its website." },
        { title: "Use the Multicultural Plaza", description: "The Kawasaki Multicultural Plaza on the second floor of the City Hall South Building takes consultations in English, Chinese, Filipino, Nepali, Vietnamese, and Spanish, at the counter from 8:30 a.m. to 5 p.m. and by phone from 9 a.m. to 5 p.m., through an online form, or online by reservation." },
      ],
      sourceIds: ["kawasaki-language-and-consultation-counters"],
      sourceFormatNote: `Kawasaki's consultation page is in plain Japanese. ${note}`,
    },
    {
      id: "kawasaki-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Kawasaki",
      summary: "Kawasaki handles Category I National Pension enrollment at the ward office within 14 days: at the Resident Section when you are also registering a move, otherwise at the Insurance and Pension Section.",
      applicability: "For residents aged 20 to 59, regardless of nationality, who are not covered through an employer or as a dependent spouse.",
      responsibleBody: "Kawasaki City", receivingOffice: "Ward office: Resident Section (with a move) or Insurance and Pension Section",
      actions: [
        { title: "Join within 14 days", description: "Foreign residents join as Category I insured persons at the ward office, bringing a passport showing the date of entry. After leaving a job and employee pension coverage, bring your pension book or Basic Pension Number notice with identification, or your My Number Card, and a document showing the date coverage ended. If paying will be difficult, you can apply for exemption, postponement, or the student payment special system at the same time." },
        { title: "Leaving Japan", description: "When a foreign Category I insured person files a moving-out notification at the ward office's Resident Section before leaving Japan, National Pension coverage ends automatically. The page also points foreign residents who paid for a qualifying period to the lump-sum withdrawal payment." },
      ],
      sourceIds: ["kawasaki-national-pension-notifications"],
      sourceFormatNote: `Kawasaki's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "old-source", records: ["kawasaki-disaster-preparation"], source: "Foreign-language disaster maps", date: "Information as of January 1, 2015" },
    { kind: "tax-year", records: ["kawasaki-resident-tax"], statement: "Online filing through eLTAX \"from the 2026 tax year\" return." },
    { kind: "gap", records: ["kawasaki-household-waste"], gap: "Bulky garbage phone hours and fees." },
    { kind: "gap", records: ["kawasaki-language-and-consultation"], gap: "Consultation days; Japanese classes." },
  ],
});
