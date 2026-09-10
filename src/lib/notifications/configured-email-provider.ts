import "server-only";
import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import type { NotificationEmailContext } from "@/domain/notifications/notification-email";
import { createAmazonSesEmailProvider } from "./amazon-ses-email-provider";
import { getEmailDeliveryConfig } from "./email-config";
import type { EmailProvider } from "./email-provider";

export type ConfiguredEmailDelivery = Readonly<{
  provider: EmailProvider;
  context: Omit<NotificationEmailContext, "recipientAddress">;
}>;

/** Instantiates the official SES client only when production delivery is explicitly enabled. */
export function getConfiguredEmailDelivery(): ConfiguredEmailDelivery | undefined {
  const config = getEmailDeliveryConfig();
  if (!config.enabled) return undefined;

  const client = new SESv2Client({ region: config.awsRegion });
  const provider = createAmazonSesEmailProvider(async (input) => {
    const output = await client.send(new SendEmailCommand(input));
    return { MessageId: output.MessageId };
  });

  return {
    provider,
    context: {
      fromName: config.fromName,
      fromAddress: config.fromAddress,
      siteOrigin: config.siteOrigin,
    },
  };
}
