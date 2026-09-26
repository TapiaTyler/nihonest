import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as utsunomiya } from "./utsunomiya";

/** Tochigi: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-09000", name: "Tochigi", aliases: ["Tochigi Prefecture","Tochigi-ken"] },
  locations: [
    utsunomiya,
  ],
});
