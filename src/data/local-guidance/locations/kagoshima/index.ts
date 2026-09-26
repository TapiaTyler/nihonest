import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as kagoshima } from "./kagoshima";

/** Kagoshima: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-46000", name: "Kagoshima", aliases: ["Kagoshima Prefecture","Kagoshima-ken"] },
  locations: [
    kagoshima,
  ],
});
