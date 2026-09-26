import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as wakayama } from "./wakayama";

/** Wakayama: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-30000", name: "Wakayama", aliases: ["Wakayama Prefecture","Wakayama-ken"] },
  locations: [
    wakayama,
  ],
});
