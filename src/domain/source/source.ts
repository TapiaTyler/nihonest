import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const isoDateSchema = z.iso.date();

export const sourceCheckMethodSchema = z.enum(["automated", "manual"]);

export const authorityLevelSchema = z.enum([
  "national-government",
  "prefectural-government",
  "municipal-government",
  "public-institution",
]);

export const officialSourceSchema = z.object({
  id: stableIdSchema,
  organization: z.string().min(1),
  title: z.string().min(1),
  url: z.url({ protocol: /^https$/ }),
  authorityLevel: authorityLevelSchema,
  language: z.enum(["en", "ja"]),
  /** Records a successful reachability check, not substantive verification of the source's claims. */
  lastCheckedAt: isoDateSchema.optional(),
  /** Records when a human editor last reviewed the source's substance for dependent guidance. */
  lastReviewedAt: isoDateSchema.optional(),
  checkMethod: sourceCheckMethodSchema.default("automated"),
});

export type OfficialSource = z.infer<typeof officialSourceSchema>;
