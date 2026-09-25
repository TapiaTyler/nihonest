import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as sapporo } from "./sapporo";
import { guidance as asahikawa } from "./asahikawa";

/** Hokkaido: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-01000", name: "Hokkaido", aliases: ["Hokkaido Prefecture","Hokkaido-do"] },
  locations: [
    sapporo,
    asahikawa,
  ],
});
