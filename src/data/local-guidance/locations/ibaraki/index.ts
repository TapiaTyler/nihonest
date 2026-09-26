import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as mito } from "./mito";

/** Ibaraki: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-08000", name: "Ibaraki", aliases: ["Ibaraki Prefecture","Ibaraki-ken"] },
  locations: [
    mito,
  ],
});
