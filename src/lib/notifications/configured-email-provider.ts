import "server-only";
import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import type { NotificationEmailContext } from "@/domain/notifications/notification-email";
import { createAmazonSesEmailProvider } from "./amazon-ses-email-provider";
import { getEmailDeliveryConfig } from "./email-config";
import type { EmailProvider } from "./email-provider";
import { runWithinWorkerDeadline } from "./worker-deadline";
import { z } from "zod";
import type { EmailDeliveryConfig } from "@/lib/config/deployment-config";

export type ConfiguredEmailDelivery = Readonly<{
  provider: EmailProvider;
  context: Omit<NotificationEmailContext, "recipientAddress">;
  dispose(): void;
}>;

/** Explicit config for the job command; construction performs no network call. */
export function createConfiguredEmailDelivery(
  config: EmailDeliveryConfig, options: Readonly<{ sendTimeoutMs?: number }> = {},
): ConfiguredEmailDelivery | undefined {
  if (!config.enabled) return undefined;
  const timeoutMs = z.number().int().min(1).max(30_000).parse(options.sendTimeoutMs ?? 10_000);

  const client = new SESv2Client({ region: config.awsRegion, maxAttempts: 1,
    requestHandler: { connectionTimeout: Math.min(timeoutMs, 3_000), requestTimeout: timeoutMs, throwOnRequestTimeout: true } });
  const provider = createAmazonSesEmailProvider(async (input, sendOptions) => {
    const output = await runWithinWorkerDeadline((signal) => client.send(new SendEmailCommand(input), { abortSignal: signal }),
      timeoutMs, sendOptions?.signal);
    return { MessageId: output.MessageId };
  });

  return {
    provider,
    context: {
      fromName: config.fromName,
      fromAddress: config.fromAddress,
      siteOrigin: config.siteOrigin,
    },
    dispose: () => client.destroy(),
  };
}

/** Instantiates the official SES client only when production delivery is explicitly enabled. */
export function getConfiguredEmailDelivery(): ConfiguredEmailDelivery | undefined {
  return createConfiguredEmailDelivery(getEmailDeliveryConfig());
}
