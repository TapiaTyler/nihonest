import { defineLocalGuidanceSupplements } from "@/data/local-guidance/shared";

export const householdWasteSupplements = defineLocalGuidanceSupplements([
  {
    id: "shinjuku-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "shinjuku",
    title: "Sorting and disposing of waste in Shinjuku", summary: "Shinjuku defines local separation, collection, and oversized-waste routes.",
    applicability: "Rules and collection points apply to addresses in Shinjuku; an exact collection day can vary by area.", responsibleBody: "Shinjuku City",
    actions: [{ title: "Identify the item before choosing a collection route", description: "Use Shinjuku's multilingual material for ordinary resources and garbage. Follow its separate current procedure for oversized items, regulated appliances, batteries, or business waste." }],
    sourceIds: ["shinjuku-waste-disposal", "shinjuku-household-waste-current"],
  },
  {
    id: "nagoya-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "nagoya",
    title: "Sorting and disposing of waste in Nagoya", summary: "Nagoya provides multilingual sorting material and an address-specific collection-day lookup.",
    applicability: "Use the lookup for the exact Nagoya address rather than assuming one citywide schedule.", responsibleBody: "Nagoya City",
    actions: [{ title: "Check the category and your address", description: "Open the current multilingual guide, classify the item, and then confirm the collection day and point for your address. Use the city's separate route when the item is not ordinary household collection." }],
    sourceIds: ["nagoya-waste-guide"], sourceFormatNote: "The landing page is in Japanese and links multilingual resources. Nihonest does not reproduce an official translation.",
  },
]);
