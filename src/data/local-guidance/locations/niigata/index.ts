import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as niigata } from "./niigata";

/** Niigata: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-15000", name: "Niigata", aliases: ["Niigata Prefecture","Niigata-ken"] },
  locations: [
    niigata,
  ],
});
