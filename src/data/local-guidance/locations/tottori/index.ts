import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as tottori } from "./tottori";

/** Tottori: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-31000", name: "Tottori", aliases: ["Tottori Prefecture","Tottori-ken"] },
  locations: [
    tottori,
  ],
});
