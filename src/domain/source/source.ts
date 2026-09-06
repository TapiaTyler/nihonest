import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const isoDateSchema = z.iso.date();

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
  lastCheckedAt: isoDateSchema.optional(),
});

export type OfficialSource = z.infer<typeof officialSourceSchema>;
