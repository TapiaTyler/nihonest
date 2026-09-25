import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as osaka } from "./osaka";
import { guidance as sakai } from "./sakai";

/** Osaka: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-27000", name: "Osaka", aliases: ["Osaka Prefecture","Osaka-fu"] },
  locations: [
    osaka,
    sakai,
  ],
});
