import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as saitama } from "./saitama";
import { guidance as kawagoe } from "./kawagoe";
import { guidance as kawaguchi } from "./kawaguchi";
import { guidance as tokorozawa } from "./tokorozawa";
import { guidance as koshigaya } from "./koshigaya";

/** Saitama: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-11000", name: "Saitama", aliases: ["Saitama Prefecture","Saitama-ken"] },
  locations: [
    saitama,
    kawagoe,
    kawaguchi,
    tokorozawa,
    koshigaya,
  ],
});
