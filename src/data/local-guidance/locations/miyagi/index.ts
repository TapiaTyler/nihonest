import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as sendai } from "./sendai";

/** Miyagi: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-04000", name: "Miyagi", aliases: ["Miyagi Prefecture","Miyagi-ken"] },
  locations: [
    sendai,
  ],
});
