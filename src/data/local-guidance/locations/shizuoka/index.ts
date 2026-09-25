import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as shizuoka } from "./shizuoka";
import { guidance as hamamatsu } from "./hamamatsu";

/** Shizuoka: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-22000", name: "Shizuoka", aliases: ["Shizuoka Prefecture","Shizuoka-ken"] },
  locations: [
    shizuoka,
    hamamatsu,
  ],
});
