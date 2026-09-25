import { prefecture as aichi } from "./aichi";
import { prefecture as osaka } from "./osaka";
import { prefecture as tokyo } from "./tokyo";

/** One line per prefecture folder; each folder's index.ts lists its locations. */
export const prefectureGuidance = [
  aichi,
  osaka,
  tokyo,
] as const;
