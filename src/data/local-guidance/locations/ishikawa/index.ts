import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as kanazawa } from "./kanazawa";

/** Ishikawa: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-17000", name: "Ishikawa", aliases: ["Ishikawa Prefecture","Ishikawa-ken"] },
  locations: [
    kanazawa,
  ],
});
