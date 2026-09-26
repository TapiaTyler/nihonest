import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as kofu } from "./kofu";

/** Yamanashi: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-19000", name: "Yamanashi", aliases: ["Yamanashi Prefecture","Yamanashi-ken"] },
  locations: [
    kofu,
  ],
});
