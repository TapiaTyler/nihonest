import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as osaka } from "./osaka";
import { guidance as sakai } from "./sakai";
import { guidance as higashiosaka } from "./higashiosaka";
import { guidance as hirakata } from "./hirakata";
import { guidance as suita } from "./suita";
import { guidance as takatsuki } from "./takatsuki";
import { guidance as ibaraki } from "./ibaraki";
import { guidance as toyonaka } from "./toyonaka";

/** Osaka: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "jp-27000", name: "Osaka", aliases: ["Osaka Prefecture","Osaka-fu"] },
  locations: [
    osaka,
    sakai,
    higashiosaka,
    hirakata,
    suita,
    takatsuki,
    ibaraki,
    toyonaka,
  ],
});
