import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as akita } from "./akita";

/** Akita: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-05000", name: "Akita", aliases: ["Akita Prefecture","Akita-ken"] },
  locations: [
    akita,
  ],
});
