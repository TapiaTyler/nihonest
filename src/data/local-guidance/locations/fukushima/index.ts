import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as koriyama } from "./koriyama";
import { guidance as iwaki } from "./iwaki";
import { guidance as fukushima } from "./fukushima";

/** Fukushima: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-07000", name: "Fukushima", aliases: ["Fukushima Prefecture","Fukushima-ken"] },
  locations: [
    koriyama,
    iwaki,
    fukushima,
  ],
});
