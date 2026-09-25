import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as kobe } from "./kobe";
import { guidance as himeji } from "./himeji";
import { guidance as amagasaki } from "./amagasaki";
import { guidance as akashi } from "./akashi";
import { guidance as nishinomiya } from "./nishinomiya";

/** Hyogo: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-28000", name: "Hyogo", aliases: ["Hyogo Prefecture","Hyogo-ken"] },
  locations: [
    kobe,
    himeji,
    amagasaki,
    akashi,
    nishinomiya,
  ],
});
