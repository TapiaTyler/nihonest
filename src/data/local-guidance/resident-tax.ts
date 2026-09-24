import { defineLocalGuidanceSupplements } from "@/data/local-guidance/shared";

export const residentTaxSupplements = defineLocalGuidanceSupplements([
  {
    id: "shinjuku-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "shinjuku",
    title: "Resident tax in Shinjuku", summary: "Shinjuku explains local resident-tax reporting, payment, certificates, and departure procedures.",
    applicability: "The responsible municipality generally follows the registered address on January 1; moving later does not automatically move that year's bill.", responsibleBody: "Shinjuku City", receivingOffice: "Shinjuku City Tax Affairs Division for city resident-tax matters",
    actions: [{ title: "Confirm who has already reported your income", description: "Check whether an income-tax return or employer salary report means no separate resident-tax report is needed. Before leaving Japan, review payment or tax-agent steps for any remaining liability." }],
    sourceIds: ["shinjuku-resident-tax"],
  },
  {
    id: "nagoya-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "nagoya",
    title: "Resident tax in Nagoya", summary: "Nagoya's foreign-resident tax guide covers personal resident tax, payment, certificates, and departure-related questions.",
    applicability: "Use Nagoya's route when Nagoya is the municipality responsible for the relevant resident-tax year.", responsibleBody: "Nagoya City", receivingOffice: "The responsible municipal tax office identified by Nagoya City",
    actions: [{ title: "Use the current tax guide for the relevant year", description: "Confirm the applicable tax year, January 1 address, collection method, outstanding notices, and any steps required before leaving Japan." }],
    sourceIds: ["nagoya-personal-tax-guide", "nagoya-resident-tax-2026"], sourceFormatNote: "The city landing page is in Japanese and links a guide describing the tax system as of October 2025; check the current assessment-year page for later changes. This summary is not an official translation.",
  },
]);
