import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as hiroshima } from "./hiroshima";
import { guidance as fukuyama } from "./fukuyama";

/** Hiroshima: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-34000", name: "Hiroshima", aliases: ["Hiroshima Prefecture","Hiroshima-ken"] },
  locations: [
    hiroshima,
    fukuyama,
  ],
});
