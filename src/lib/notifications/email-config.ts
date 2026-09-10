import "server-only";
import { z } from "zod";

const emailDeliveryConfigSchema = z.discriminatedUnion("enabled", [
  z.object({ enabled: z.literal(false) }),
  z.object({
    enabled: z.literal(true),
    provider: z.literal("amazon-ses"),
    awsRegion: z.string().trim().min(1),
    fromName: z.string().trim().min(1).max(80),
    fromAddress: z.email(),
    siteOrigin: z.url().refine((value) => value.startsWith("https://")),
  }),
]);

export type EmailDeliveryConfig = z.infer<typeof emailDeliveryConfigSchema>;

/** Email remains fail-closed until every production-only setting is explicitly present. */
export function getEmailDeliveryConfig(): EmailDeliveryConfig {
  if (process.env.EMAIL_DELIVERY_ENABLED !== "true") return { enabled: false };
  return emailDeliveryConfigSchema.parse({
    enabled: true,
    provider: process.env.EMAIL_PROVIDER,
    awsRegion: process.env.AWS_REGION,
    fromName: process.env.EMAIL_FROM_NAME,
    fromAddress: process.env.EMAIL_FROM_ADDRESS,
    siteOrigin: process.env.NEXT_PUBLIC_SITE_URL,
  });
}
