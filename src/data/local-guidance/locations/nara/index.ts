import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as nara } from "./nara";

/** Nara: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-29000", name: "Nara", aliases: ["Nara Prefecture","Nara-ken"] },
  locations: [
    nara,
  ],
});
