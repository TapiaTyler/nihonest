import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as kyoto } from "./kyoto";

/** Kyoto: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-26000", name: "Kyoto", aliases: ["Kyoto Prefecture","Kyoto-fu"] },
  locations: [
    kyoto,
  ],
});
