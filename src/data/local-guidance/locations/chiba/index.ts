import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as chiba } from "./chiba";
import { guidance as ichikawa } from "./ichikawa";
import { guidance as funabashi } from "./funabashi";
import { guidance as matsudo } from "./matsudo";
import { guidance as kashiwa } from "./kashiwa";

/** Chiba: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-12000", name: "Chiba", aliases: ["Chiba Prefecture","Chiba-ken"] },
  locations: [
    chiba,
    ichikawa,
    funabashi,
    matsudo,
    kashiwa,
  ],
});
