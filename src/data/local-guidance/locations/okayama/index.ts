import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as okayama } from "./okayama";
import { guidance as kurashiki } from "./kurashiki";

/** Okayama: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-33000", name: "Okayama", aliases: ["Okayama Prefecture","Okayama-ken"] },
  locations: [
    okayama,
    kurashiki,
  ],
});
