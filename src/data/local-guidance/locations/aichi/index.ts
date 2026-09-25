import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as nagoya } from "./nagoya";

/** Aichi: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "aichi", name: "Aichi", aliases: ["Aichi Prefecture","Aichi-ken"] },
  locations: [
    nagoya,
  ],
});
