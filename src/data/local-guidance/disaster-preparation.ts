import { defineLocalGuidanceSupplements } from "@/data/local-guidance/shared";

export const disasterPreparationSupplements = defineLocalGuidanceSupplements([
  {
    id: "shinjuku-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "shinjuku",
    title: "Hazard information for Shinjuku", summary: "Shinjuku publishes a local flood hazard map to combine with live warnings and building-specific planning.",
    applicability: "A modeled hazard map does not predict a live event or establish the safest route from every building.", responsibleBody: "Shinjuku City",
    actions: [{ title: "Check your exact address before an emergency", description: "Review the current local hazard map, identify nearby designated locations and more than one route, and rely on live official instructions during an event." }],
    sourceIds: ["shinjuku-flood-hazard-map"],
  },
  {
    id: "nagoya-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "nagoya",
    title: "Disaster information for Nagoya", summary: "Nagoya's foreign-resident portal points to multilingual preparedness and emergency information.",
    applicability: "Use local maps for the exact address and live official information for the current event.", responsibleBody: "Nagoya City",
    actions: [{ title: "Build a local information plan", description: "Use Nagoya's current portal to find hazard information, preparedness resources, and multilingual support; verify your building, designated locations, and accessible routes separately." }],
    sourceIds: ["nagoya-disaster-information", "nagoya-international-center"], sourceFormatNote: "Some city resources are in Japanese or linked documents. Nihonest's summary is not an official translation.",
  },
]);
