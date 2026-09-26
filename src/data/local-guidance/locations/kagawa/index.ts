import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as takamatsu } from "./takamatsu";

/** Kagawa: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-37000", name: "Kagawa", aliases: ["Kagawa Prefecture","Kagawa-ken"] },
  locations: [
    takamatsu,
  ],
});
