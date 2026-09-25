import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as kumamoto } from "./kumamoto";

/** Kumamoto: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-43000", name: "Kumamoto", aliases: ["Kumamoto Prefecture","Kumamoto-ken"] },
  locations: [
    kumamoto,
  ],
});
