import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as nagoya } from "./nagoya";
import { guidance as toyota } from "./toyota";
import { guidance as okazaki } from "./okazaki";
import { guidance as ichinomiya } from "./ichinomiya";
import { guidance as toyohashi } from "./toyohashi";
import { guidance as kasugai } from "./kasugai";

/** Aichi: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "aichi", name: "Aichi", aliases: ["Aichi Prefecture","Aichi-ken"] },
  locations: [
    nagoya,
    toyota,
    okazaki,
    ichinomiya,
    toyohashi,
    kasugai,
  ],
});
