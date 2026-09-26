import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as toyama } from "./toyama";

/** Toyama: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-16000", name: "Toyama", aliases: ["Toyama Prefecture","Toyama-ken"] },
  locations: [
    toyama,
  ],
});
