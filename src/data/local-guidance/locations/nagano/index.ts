import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as nagano } from "./nagano";

/** Nagano: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-20000", name: "Nagano", aliases: ["Nagano Prefecture","Nagano-ken"] },
  locations: [
    nagano,
  ],
});
