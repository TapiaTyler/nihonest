import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as yokkaichi } from "./yokkaichi";

/** Mie: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-24000", name: "Mie", aliases: ["Mie Prefecture","Mie-ken"] },
  locations: [
    yokkaichi,
  ],
});
