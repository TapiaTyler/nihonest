import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as morioka } from "./morioka";

/** Iwate: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-03000", name: "Iwate", aliases: ["Iwate Prefecture","Iwate-ken"] },
  locations: [
    morioka,
  ],
});
