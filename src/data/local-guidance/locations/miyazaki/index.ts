import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as miyazaki } from "./miyazaki";

/** Miyazaki: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-45000", name: "Miyazaki", aliases: ["Miyazaki Prefecture","Miyazaki-ken"] },
  locations: [
    miyazaki,
  ],
});
