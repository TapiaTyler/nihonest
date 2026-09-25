import { defineLocationGuidance } from "@/data/local-guidance/define-location";

const note = "This English summary is Nihonest guidance, not an official translation.";
const base = "https://www.city.tokorozawa.saitama.jp";

/** Tokorozawa City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-11208", name: "Tokorozawa City", aliases: ["Tokorozawa", "Tokorozawa-shi"], planGroup: "major-city" },
  sources: [
    { id: "tokorozawa-address-registration-moving-in", title: "Moving-in notification", url: `${base}/kurashi/sinseitodokesyoumei/hikkoshi/tennyu/tennyutodoke.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "tokorozawa-national-health-insurance-procedures", title: "Where and how to join or leave National Health Insurance (FAQ)", url: `${base}/faq/kurashifaq/kurashifaq3/sikakuqa/kokuhokanyusositu.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "tokorozawa-household-waste-bulky", title: "Putting out bulky waste", url: `${base}/kurashi/gomi/gomidashikata/haitai_20081107164552691.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "tokorozawa-resident-tax-filing", title: "Filing the municipal and prefectural inhabitant tax return", url: `${base}/kurashi/zeikin/shinkoku/sinkokunituite_kigengo.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "tokorozawa-disaster-preparation-evacuation-places", title: "Evacuation places and shelters", url: `${base}/moshimo/bosai/saigaisonae1/hinanbasyohinanjo/hinanbashohinanjohukusihinanjo.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "tokorozawa-disaster-preparation-flood-map", title: "Tokorozawa flood hazard map", url: `${base}/kurashi/seikatukankyo/kankyohozen/kasen/kouzuihazardmap.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "tokorozawa-language-and-consultation-consultation", title: "Daily-life consultation for foreign residents", url: `${base}/kurashi/soudan/shiminsoudan/soudan20200311091647560.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "tokorozawa-language-and-consultation-japanese-classes", title: "Volunteer Japanese classes", url: `${base}/iitokoro/enjoy/bunkakyoyo/shakaikyoiku/nihongo01.html`, language: "ja", lastCheckedAt: "2026-09-25" },
    { id: "tokorozawa-national-pension-abroad", title: "National Pension when moving abroad or returning", url: `${base}/kurashi/kokuminnenkin/nenkintetuduki/kaigaitenshutunenkin.html`, language: "ja", lastCheckedAt: "2026-09-25" },
  ],
  supplements: [
    {
      id: "tokorozawa-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-25",
      title: "Registering an address in Tokorozawa",
      summary: "Tokorozawa takes moving-in notifications in person within 14 days at the Citizens Section of City Hall or a town development center, and also on the second and fourth Saturday mornings, though moves from abroad may not be possible on Saturdays.",
      applicability: "Residents moving into Tokorozawa from abroad or another municipality. Post and phone are not accepted, and station service corners cannot handle it.",
      responsibleBody: "Tokorozawa City", receivingOffice: "Citizens Section of City Hall, or a town development center (except Namiki)",
      actions: [
        { title: "Notify within 14 days", description: "File within 14 days of starting to live in Tokorozawa, weekdays 8:30 a.m. to 5:15 p.m. The Citizens Section and town development centers also open on the second and fourth Saturdays from 8:30 a.m. to 12:30 p.m., but procedures such as moving in from abroad that need the resident registry network may not be possible then. Not filing on time without good reason can lead to a non-penal fine." },
        { title: "Who can file", description: "You or someone in your household can file; the city is changing its counter hours from October 1, 2026, so check before you go." },
      ],
      sourceIds: ["tokorozawa-address-registration-moving-in"],
      sourceFormatNote: `Tokorozawa's moving-in page is in Japanese. ${note}`,
    },
    {
      id: "tokorozawa-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-25",
      title: "National Health Insurance in Tokorozawa",
      summary: "Tokorozawa handles joining and leaving National Health Insurance at the National Health Insurance Section (City Hall low-rise building, window 9) and at town development centers except Namiki; leaving after joining workplace insurance can also be done by post.",
      applicability: "For residents not covered by workplace insurance or public assistance. Station service corners cannot handle National Health Insurance.",
      responsibleBody: "Tokorozawa City", receivingOffice: "National Health Insurance Section (City Hall low-rise building 1st floor, window 9), or a town development center (except Namiki)",
      actions: [
        { title: "Join with the right documents", description: "Moving in, you can join at the section or a town development center; after leaving workplace insurance, bring the loss-of-coverage certificate. Registering a birth is handled only at the section. You or a household member filing bring photo identification such as a My Number Card, driver's license, or passport." },
        { title: "Leaving", description: "When you join workplace insurance, bring both insurance certificates or notices; you can also leave by post." },
      ],
      sourceIds: ["tokorozawa-national-health-insurance-procedures"],
      sourceFormatNote: `Tokorozawa's National Health Insurance page is in Japanese. ${note}`,
    },
    {
      id: "tokorozawa-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-25",
      title: "Sorting and disposing of waste in Tokorozawa",
      summary: "In Tokorozawa, items with a side of about 50 cm or more are bulky waste, which you can sell through a partner reuse service, take to a clean center, or have collected for a fee by applying online or by phone.",
      applicability: "Measure items first; some items 50 cm or larger are not bulky waste.",
      responsibleBody: "Tokorozawa City",
      actions: [
        { title: "Choose how to dispose of bulky items", description: "Items with a side of about 50 cm or more are bulky waste. You can use a reuse service partnered with the city, take them to the Eastern or Western Clean Center yourself, or have the city collect them for a fee, applying online or by phone." },
      ],
      sourceIds: ["tokorozawa-household-waste-bulky"],
      sourceFormatNote: `Tokorozawa's waste page is in Japanese. ${note}`,
    },
    {
      id: "tokorozawa-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "Resident tax in Tokorozawa",
      summary: "Tokorozawa's inhabitant tax return is due in principle by March 15 and can be filed online through eLTAX; late returns are still accepted but can reduce the number of installments and delay income certificates.",
      applicability: "Use Tokorozawa's route when you were registered in Tokorozawa on January 1 of the tax year.",
      responsibleBody: "Tokorozawa City",
      actions: [
        { title: "Check whether you must file", description: "File if you had income other than salary or pension but need no income-tax return, if you want to add deductions such as medical costs to lower inhabitant tax, if your employer did not send a salary report to the city, or if you had no taxable income and are not a dependent of a relative in the city." },
        { title: "File on time or online", description: "The deadline is in principle March 15, and returns are accepted after that. A late return delays the tax calculation, so you may pay in fewer than the usual four installments and income certificates may be delayed. Online filing through eLTAX started in January 2026." },
      ],
      sourceIds: ["tokorozawa-resident-tax-filing"],
      sourceFormatNote: `Tokorozawa's tax page is in Japanese. ${note}`,
    },
    {
      id: "tokorozawa-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-25",
      title: "Disaster information for Tokorozawa",
      summary: "Tokorozawa uses school grounds and other sites as emergency evacuation places, 57 designated shelters for people who lose their homes, and 13 schools as flood shelters opened only for areas that need them; its flood hazard map covers the Yanase, Higashi, and Furo rivers.",
      applicability: "Earthquake and flood shelters differ; check both, and your neighborhood's gathering place if it has one.",
      responsibleBody: "Tokorozawa City",
      actions: [
        { title: "Know the places", description: "Emergency evacuation places are for escaping earthquakes, floods, landslides, and large fires. Some neighborhoods set a temporary gathering place to go to together first; if yours has none, go straight to an emergency evacuation place. Designated shelters (school and city gymnasiums) are for people who cannot stay home, and 13 schools serve as flood shelters for riverside areas." },
        { title: "Check the flood hazard map", description: "The flood hazard map shows expected flooding and evacuation places if the Yanase, Higashi, or Furo rivers flood in a once-in-1,000-years rain. The city's GIS lets you check a lot number, and the national Shinsui Navi shows exact depths." },
      ],
      sourceIds: ["tokorozawa-disaster-preparation-evacuation-places", "tokorozawa-disaster-preparation-flood-map"],
      sourceFormatNote: `Tokorozawa's disaster pages are in Japanese. ${note}`,
    },
    {
      id: "tokorozawa-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-25",
      title: "Language and consultation support in Tokorozawa",
      summary: "Tokorozawa offers free daily-life consultation for foreign residents in English at the Citizen Consultation Section of City Hall, and volunteer Japanese classes run across the city almost every day of the week.",
      applicability: "For foreign residents of Tokorozawa. Chinese consultation is suspended for now.",
      responsibleBody: "Tokorozawa City", receivingOffice: "Citizen Consultation Section, Tokorozawa City Hall 1st floor",
      actions: [
        { title: "Use the English consultation", description: "English consultation is on the second and fourth Thursdays, 10 a.m. to noon (reception until 11:30 a.m.), at the Citizen Consultation Section on the first floor of City Hall. Chinese consultation, usually on the first and third Thursdays, is suspended for now." },
        { title: "Join a volunteer Japanese class", description: "Volunteer groups run Japanese classes at City Hall, town development centers, and other venues on most days of the week, mornings and some evenings; go directly to the venue. Some classes for children run after school and during long holidays." },
      ],
      sourceIds: ["tokorozawa-language-and-consultation-consultation", "tokorozawa-language-and-consultation-japanese-classes"],
      sourceFormatNote: `Tokorozawa's pages are in plain Japanese. ${note}`,
    },
    {
      id: "tokorozawa-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-25",
      title: "National Pension in Tokorozawa",
      summary: "Tokorozawa handles National Pension procedures when moving abroad or returning at the Citizens Section's National Pension counter (window 8) or a town development center, after the moving notification.",
      applicability: "For residents aged 20 to 59 who move abroad or return to Tokorozawa.",
      responsibleBody: "Tokorozawa City", receivingOffice: "National Pension unit, Citizens Section (window 8), or a town development center",
      actions: [
        { title: "Moving abroad", description: "After filing the moving-out notification, stop by the National Pension counter. You choose between leaving National Pension (from the day after you leave) or continuing voluntarily, which needs a helper such as a relative in Japan. Bring something showing your Basic Pension Number or My Number. Students keeping enrollment at a Japanese school while studying abroad can use the student payment special system." },
      ],
      sourceIds: ["tokorozawa-national-pension-abroad"],
      sourceFormatNote: `Tokorozawa's National Pension page is in Japanese. ${note}`,
    },
  ],
  recheck: [
    { kind: "dated", from: "2026-10-01", records: ["tokorozawa-address-registration"], change: "Counter reception hours change from October 1, 2026.", action: "Update the weekday and Saturday hours." },
    { kind: "dated", from: "2026-12-01", records: ["tokorozawa-language-and-consultation"], change: "Chinese consultation is suspended for now.", action: "Check whether it has resumed." },
    { kind: "gap", records: ["tokorozawa-household-waste"], gap: "Regular waste rules and deadline; bulky waste phone hours." },
  ],
});
