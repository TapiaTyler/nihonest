import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as saga } from "./saga";

/** Saga: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-41000", name: "Saga", aliases: ["Saga Prefecture","Saga-ken"] },
  locations: [
    saga,
  ],
});
