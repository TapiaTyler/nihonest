import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as tokushima } from "./tokushima";

/** Tokushima: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-36000", name: "Tokushima", aliases: ["Tokushima Prefecture","Tokushima-ken"] },
  locations: [
    tokushima,
  ],
});
