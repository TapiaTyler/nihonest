import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as nagasaki } from "./nagasaki";

/** Nagasaki: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-42000", name: "Nagasaki", aliases: ["Nagasaki Prefecture","Nagasaki-ken"] },
  locations: [
    nagasaki,
  ],
});
