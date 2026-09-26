import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as oita } from "./oita";

/** Oita: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-44000", name: "Oita", aliases: ["Oita Prefecture","Oita-ken"] },
  locations: [
    oita,
  ],
});
