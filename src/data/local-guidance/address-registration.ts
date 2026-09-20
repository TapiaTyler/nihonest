import { defineLocalGuidanceSupplements } from "@/data/local-guidance/shared";

export const addressRegistrationSupplements = defineLocalGuidanceSupplements([
  {
    id: "shinjuku-address-registration", articleId: "registering-your-address-after-arrival", geographyId: "shinjuku",
    title: "Registering an address in Shinjuku", summary: "Shinjuku City handles moving notifications for residents of the special ward.",
    applicability: "Use this route only when your actual registered home is in Shinjuku City.", responsibleBody: "Shinjuku City", receivingOffice: "Shinjuku City Office or an eligible special branch office",
    actions: [{ title: "Confirm the correct notification and documents", description: "Choose the moving-in, moving-out, or within-city route on Shinjuku's current page. Family relationship records in another language may require a Japanese translation identifying the translator." }],
    sourceIds: ["shinjuku-address-changes"],
  },
  {
    id: "nagoya-address-registration", articleId: "registering-your-address-after-arrival", geographyId: "nagoya",
    title: "Registering an address in Nagoya", summary: "Nagoya routes resident moving procedures through the ward office for the new address.",
    applicability: "Use this route for an address within Nagoya City; the service ward is part of Nagoya, not a separate municipality.", responsibleBody: "Nagoya City", receivingOffice: "Resident registration counter at the relevant ward office or branch",
    actions: [{ title: "Use the route for your kind of move", description: "Nagoya distinguishes arrival from outside the city from a move within Nagoya. Confirm the office for your new address and the current document list before visiting." }],
    sourceIds: ["nagoya-moving-procedures"], sourceFormatNote: "The linked city page is written in Easy Japanese. This summary is Nihonest guidance, not an official translation.",
  },
]);
