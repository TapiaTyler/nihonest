import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as kochi } from "./kochi";

/** Kochi: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-39000", name: "Kochi", aliases: ["Kochi Prefecture","Kochi-ken"] },
  locations: [
    kochi,
  ],
});
