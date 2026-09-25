import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as yokohama } from "./yokohama";
import { guidance as kawasaki } from "./kawasaki";
import { guidance as sagamihara } from "./sagamihara";
import { guidance as yokosuka } from "./yokosuka";
import { guidance as fujisawa } from "./fujisawa";

/** Kanagawa: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-14000", name: "Kanagawa", aliases: ["Kanagawa Prefecture","Kanagawa-ken"] },
  locations: [
    yokohama,
    kawasaki,
    sagamihara,
    yokosuka,
    fujisawa,
  ],
});
