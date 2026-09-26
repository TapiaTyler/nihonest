import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as otsu } from "./otsu";

/** Shiga: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-25000", name: "Shiga", aliases: ["Shiga Prefecture","Shiga-ken"] },
  locations: [
    otsu,
  ],
});
