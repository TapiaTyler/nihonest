import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as gifu } from "./gifu";

/** Gifu: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-21000", name: "Gifu", aliases: ["Gifu Prefecture","Gifu-ken"] },
  locations: [
    gifu,
  ],
});
