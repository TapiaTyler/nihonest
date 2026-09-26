import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as shimonoseki } from "./shimonoseki";
import { guidance as yamaguchi } from "./yamaguchi";

/** Yamaguchi: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-35000", name: "Yamaguchi", aliases: ["Yamaguchi Prefecture","Yamaguchi-ken"] },
  locations: [
    shimonoseki,
    yamaguchi,
  ],
});
