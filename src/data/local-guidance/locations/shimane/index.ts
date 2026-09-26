import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as matsue } from "./matsue";

/** Shimane: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-32000", name: "Shimane", aliases: ["Shimane Prefecture","Shimane-ken"] },
  locations: [
    matsue,
  ],
});
