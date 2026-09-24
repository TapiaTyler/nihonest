import { defineLocalGuidanceSupplements } from "@/data/local-guidance/shared";

export const disasterPreparationSupplements = defineLocalGuidanceSupplements([
  {
    id: "shinjuku-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "shinjuku",
    title: "Hazard information for Shinjuku", summary: "Shinjuku publishes a local flood hazard map to combine with live warnings and building-specific planning.",
    applicability: "A modeled hazard map does not predict a live event or establish the safest route from every building.", responsibleBody: "Shinjuku City",
    actions: [{ title: "Check your exact address before an emergency", description: "Review the current local hazard map, identify nearby designated locations and more than one route, and rely on live official instructions during an event." }],
    sourceIds: ["shinjuku-flood-hazard-map", "shinjuku-flood-current"],
  },
  {
    id: "nagoya-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "nagoya",
    title: "Disaster information for Nagoya", summary: "Nagoya links foreign residents to multilingual disaster information and publishes preparedness guides and ward-specific risk information.",
    applicability: "Use local maps for the exact address and live official information for the current event.", responsibleBody: "Nagoya City",
    actions: [{ title: "Build a local information plan", description: "Use the city's foreign-resident portal for emergency-information tools and its disaster guidebook for preparation and ward-specific risks. Verify your building, designated locations, and accessible routes separately; follow live official instructions during an event." }],
    sourceIds: ["nagoya-disaster-information", "nagoya-disaster-guidebook", "nagoya-international-center"], sourceFormatNote: "Some city resources are in Japanese or linked documents. Nihonest's summary is not an official translation.",
  },
]);
