import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as matsuyama } from "./matsuyama";

/** Ehime: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-38000", name: "Ehime", aliases: ["Ehime Prefecture","Ehime-ken"] },
  locations: [
    matsuyama,
  ],
});
