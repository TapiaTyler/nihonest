import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as aomori } from "./aomori";

/** Aomori: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-02000", name: "Aomori", aliases: ["Aomori Prefecture","Aomori-ken"] },
  locations: [
    aomori,
  ],
});
