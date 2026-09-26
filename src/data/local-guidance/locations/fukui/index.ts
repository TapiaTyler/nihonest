import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as fukui } from "./fukui";

/** Fukui: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-18000", name: "Fukui", aliases: ["Fukui Prefecture","Fukui-ken"] },
  locations: [
    fukui,
  ],
});
