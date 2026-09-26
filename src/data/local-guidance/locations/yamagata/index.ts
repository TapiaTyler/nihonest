import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as yamagata } from "./yamagata";

/** Yamagata: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-06000", name: "Yamagata", aliases: ["Yamagata Prefecture","Yamagata-ken"] },
  locations: [
    yamagata,
  ],
});
