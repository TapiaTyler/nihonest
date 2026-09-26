import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.naha.okinawa.jp";

/** Naha City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-47201", name: "Naha City", aliases: ["Naha","Naha-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "naha-address-registration-notifications", title: "Resident change notifications", url: `${base}/kurasitetuduki/todoke/1001730/1001737.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "naha-national-health-insurance-joining", title: "Joining and leaving National Health Insurance", url: `${base}/kurasitetuduki/nenkin/1001859/1001869/1001872.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "naha-household-waste-foreign-residents", title: "Garbage (plain Japanese and English)", url: `${base}/kurasitetuduki/soudan/1002347/1002360.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "naha-household-waste-bulky", title: "Bulky waste and products with springs", url: `${base}/kurasitetuduki/gomi-recycling/1001934/1007525/1001941.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "naha-resident-tax-filing", title: "Fiscal 2026 inhabitant tax return", url: `${base}/kurasitetuduki/zei/1001798/1001802.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "naha-resident-tax-forms", title: "Individual inhabitant tax forms", url: `${base}/kurasitetuduki/zei/1001798/1001801.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "naha-disaster-preparation-flood-maps", title: "Flood, inland flooding, and storm surge hazard maps", url: `${base}/safety/saigai/1001597/1001608.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "naha-language-and-consultation-center", title: "Consultation Center for Foreign Residents", url: `${base}/kurasitetuduki/soudan/1002347/1002348.html`, language: "en", lastCheckedAt: "2026-09-25" },
    { id: "naha-language-and-consultation-japanese", title: "Learning Japanese", url: `${base}/kurasitetuduki/soudan/1002347/1002359.html`, language: "en", lastCheckedAt: "2026-09-25" },
    { id: "naha-national-pension-notifications", title: "National Pension notifications", url: `${base}/kurasitetuduki/nenkin/1001905/1001907.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "naha-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Naha",
      summary: "Naha takes moving-in notifications within 14 days, and foreign residents can file only at the Haisai Citizens Section at City Hall, not at branch offices.",
      applicability: "Residents moving into Naha from abroad or from another municipality.",
      responsibleBody: "Naha City", receivingOffice: "Haisai Citizens Section, Naha City Hall 1st floor",
      actions: [
        { title: "File within 14 days at City Hall", description: "Foreign residents file at the Haisai Citizens Section in the main City Hall within 14 days of moving. Bring identification such as a My Number Card; an agent needs a letter of authorization and their own identification." },
        { title: "Bring everyone's passport", description: "When moving from abroad, bring the passports of everyone moving; if there is no entry stamp because you used an automated gate, also bring a boarding pass stub showing the entry date." },
      ],
      sourceIds: ["naha-address-registration-notifications"],
      sourceFormatNote: `Naha's notification page is in Japanese. ${note}`,
    },
    {
      id: "naha-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Naha",
      summary: "In Naha, National Health Insurance starts the day you move in or lose other coverage, not the day you file, and changes are not automatic, so notify within 14 days at window 14 of City Hall or a branch office.",
      applicability: "For residents not covered by workplace insurance or public assistance. Employers do not notify the city when your coverage changes.",
      responsibleBody: "Naha City", receivingOffice: "Window 14, Naha City Hall, or a branch office (notifications only)",
      actions: [
        { title: "Join with a loss-of-coverage certificate", description: "After leaving workplace insurance, bring the loss-of-coverage certificate, identification, and your My Number Card if you have one. Tax is charged from the start of coverage, so a late notification means paying back months." },
        { title: "Leave when you join workplace insurance", description: "Bring the new insurance certificate or proof of joining and your National Health Insurance certificate; leaving can also be done through the city's online form. Residents aged 20 to 59 also need a National Pension procedure." },
      ],
      sourceIds: ["naha-national-health-insurance-joining"],
      sourceFormatNote: `Naha's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "naha-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Naha",
      summary: "Naha sorts household waste into five types, with guides in English and Chinese and collection schedules in English and Vietnamese; bulky waste is booked online or by phone and put out by 8:30 a.m. with a ticket.",
      applicability: "Collection days differ by area.",
      responsibleBody: "Naha City",
      actions: [
        { title: "Get the guide and schedule", description: "Download the sorting guide in English or Chinese and your area's collection schedule in Japanese, English, or Vietnamese; a video explains sorting in Japanese and Vietnamese." },
        { title: "Book bulky waste", description: "Apply online or call the Clean Promotion Section at 098-889-3567, buy a bulky waste ticket at a supermarket or convenience store (mattresses and sofas with springs need a different ticket), attach it with your reception number, and put the item out by 8:30 a.m. on the set day." },
      ],
      sourceIds: ["naha-household-waste-foreign-residents", "naha-household-waste-bulky"],
      sourceFormatNote: `Naha's waste pages are in Japanese, plain Japanese, and English. ${note}`,
    },
    {
      id: "naha-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Naha",
      summary: "Naha took fiscal 2026 inhabitant tax returns at the Times Building from February 16 to March 16, 2026, accepts returns by post, and pauses filing from March 17 to May 31 while preparing the new tax year.",
      applicability: "Use Naha's route when you were registered in Naha on January 1 of the tax year.",
      responsibleBody: "Naha City",
      actions: [
        { title: "File by post or at the venue", description: "Anyone can file by post with the envelope enclosed with the return. The venue at the Times Building (2-2-2 Kumoji) is open weekdays 9 a.m. to 4 p.m. during the filing period; City Hall and branch offices do not take returns. People with no income need not file but may need to for income certificates or insurance premiums." },
        { title: "Name a tax agent before leaving", description: "If you leave Japan, submit the tax agent declaration and approval application form to the Citizen Tax Section (098-861-3328)." },
      ],
      sourceIds: ["naha-resident-tax-filing", "naha-resident-tax-forms"],
      sourceFormatNote: `Naha's tax pages are in Japanese. ${note}`,
    },
    {
      id: "naha-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Naha",
      summary: "Naha publishes flood hazard maps for the Aja, Asato, and Kokuba river systems plus storm surge and inland flooding maps, and storm surge risk can be searched by address on Naha MAP.",
      applicability: "Check the maps for your home and route before typhoon season.",
      responsibleBody: "Naha City",
      actions: [
        { title: "Check the maps", description: "Download the flood, storm surge, and inland flooding maps, or search your address on Naha MAP for storm surge. For questions about floods and storm surge, call the Disaster Prevention and Crisis Management Division at 098-861-1102." },
      ],
      sourceIds: ["naha-disaster-preparation-flood-maps"],
      sourceFormatNote: `Naha's hazard map page is in Japanese. ${note}`,
    },
    {
      id: "naha-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Naha",
      summary: "Naha's Consultation Center for Foreign Residents at counter 2 on the 1st floor of City Hall helps with city forms and letters, with English interpreting on weekdays, and points you to the right office; the city has no free Japanese classes but lists free online courses.",
      applicability: "For foreign residents of Naha. The center does not handle procedures or private contracts.",
      responsibleBody: "Naha City", receivingOffice: "Consultation Center for Foreign Residents, counter 2, Naha City Hall 1st floor",
      actions: [
        { title: "Use the consultation center", description: "Weekdays 9 a.m. to 5 p.m. (closed noon to 1 p.m., and on June 23), phone 098-862-9955. Staff help fill in city forms and explain letters from the city; an English interpreter is not always available, so call before visiting." },
        { title: "Study Japanese online", description: "There are currently no free Japanese classes in Naha, so the city lists free online courses such as Irodori and NHK World Easy Japanese." },
      ],
      sourceIds: ["naha-language-and-consultation-center", "naha-language-and-consultation-japanese"],
      sourceFormatNote: `Naha's pages are in English and plain Japanese. ${note}`,
    },
    {
      id: "naha-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Naha",
      summary: "In Naha, you or your head of household notify the National Pension group of the Haisai Citizens Section or a branch office when you leave employee pension or stop being a dependent spouse; counter reservations are available.",
      applicability: "For residents aged 20 to 59 who leave employee pension coverage or a spouse's coverage.",
      responsibleBody: "Naha City", receivingOffice: "National Pension group, Haisai Citizens Section (City Hall 1st floor), or a branch office",
      actions: [
        { title: "Notify after leaving a job", description: "Bring identification (one photo ID or two without a photo) and a loss-of-coverage certificate or proof of leaving. Anyone other than you or your head of household needs a letter of authorization." },
      ],
      sourceIds: ["naha-national-pension-notifications"],
      sourceFormatNote: `Naha's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "tax-year", records: ["naha-resident-tax"], statement: "Fiscal 2026 venue period \"February 16 to March 16, 2026\" and pause until May 31." },
    { kind: "gap", records: ["naha-address-registration"], gap: "Residence card requirement for foreign residents arriving from abroad." },
    { kind: "gap", records: ["naha-disaster-preparation"], gap: "Tsunami map and evacuation shelters." },
  ],
});
