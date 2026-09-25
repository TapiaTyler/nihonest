import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as kitakyushu } from "./kitakyushu";
import { guidance as fukuoka } from "./fukuoka";
import { guidance as kurume } from "./kurume";

/** Fukuoka: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-40000", name: "Fukuoka", aliases: ["Fukuoka Prefecture","Fukuoka-ken"] },
  locations: [
    kitakyushu,
    fukuoka,
    kurume,
  ],
});
