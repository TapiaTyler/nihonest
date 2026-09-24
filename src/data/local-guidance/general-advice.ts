/** General lookup prompts are not researched municipal supplements or official local instructions. */
export const generalLocalAdvice = {
  "registering-your-address-after-arrival": {
    title: "Check the moving-in procedure for your address",
    steps: [
      "Find the official moving-in or resident-registration page for the municipality where you will live. Check the counter, filing period, and documents for a move from abroad or from another Japanese municipality.",
      "Confirm the receiving office and current opening hours before visiting, especially for overseas arrivals, family records, or a representative filing for you.",
    ],
  },
  "joining-national-health-insurance": {
    title: "Find your local health-insurance procedure",
    steps: [
      "First use the national guide to check whether municipal National Health Insurance is the right coverage route for you. Employer coverage and other arrangements can change the answer.",
      "On the municipality's official site, look up enrollment, withdrawal, required documents, the insurance counter, and any online procedure for your particular change. Ask that office about premiums or reductions for your household.",
    ],
  },
  "sorting-household-waste-and-arranging-disposal": {
    title: "Find the waste rules for your exact address",
    steps: [
      "Use the municipality's official sorting guide and collection-day lookup for your street or building. Ask your building manager where and when to put items out.",
      "Check a separate official route before disposing of oversized items, appliances, batteries, or other items excluded from ordinary collection.",
    ],
  },
  "preparing-for-disasters-and-evacuation-in-japan": {
    title: "Find local hazard and emergency information",
    steps: [
      "Open the official hazard maps for your exact address and the hazards relevant to your home, work, or school. Identify official emergency-information channels and nearby designated places.",
      "A planning map is not a live instruction. During an event, follow current alerts and directions from the responsible authorities.",
    ],
  },
  "finding-japanese-language-and-local-support": {
    title: "Find local language and consultation support",
    steps: [
      "Look for the municipality's foreign-resident consultation desk, international association, interpretation support, and Japanese-language class directory.",
      "Check the actual provider's current languages, eligibility, fees, appointment rules, and schedule before relying on a service.",
    ],
  },
  "income-and-resident-tax-after-moving-to-japan": {
    title: "Find the responsible tax office and tax-year guidance",
    steps: [
      "Use the national guide to distinguish income tax from resident tax. Identify the municipality responsible for the resident-tax year before using a local filing or payment page.",
      "On that municipality's official site, check reporting, notices, payment, certificates, and departure procedures for the relevant year. Ask the tax office about your own notice rather than using another person's figures.",
    ],
  },
  "national-pension-after-moving-to-japan": {
    title: "Find the pension enrollment and relief route",
    steps: [
      "Use the national guide to check your coverage category and whether employer coverage or another arrangement changes your route.",
      "Ask the municipal pension counter or Japan Pension Service where to handle enrollment, exemption, or student payment-postponement applications and which records to bring.",
    ],
  },
} as const;

export type GeneralLocalAdviceArticleId = keyof typeof generalLocalAdvice;

export function getGeneralLocalAdvice(articleId: string) {
  return generalLocalAdvice[articleId as GeneralLocalAdviceArticleId];
}
