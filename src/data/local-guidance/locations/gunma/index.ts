import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as takasaki } from "./takasaki";

/** Gunma: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-10000", name: "Gunma", aliases: ["Gunma Prefecture","Gunma-ken"] },
  locations: [
    takasaki,
  ],
});
