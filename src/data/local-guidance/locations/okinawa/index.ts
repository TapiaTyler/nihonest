import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as naha } from "./naha";

/** Okinawa: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-47000", name: "Okinawa", aliases: ["Okinawa Prefecture","Okinawa-ken"] },
  locations: [
    naha,
  ],
});
