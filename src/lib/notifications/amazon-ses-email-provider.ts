import type { TransactionalEmail } from "@/domain/notifications/notification-email";
import type { EmailProvider, EmailSendResult } from "./email-provider";

export type SesV2SendEmailInput = Readonly<{
  FromEmailAddress: string;
  Destination: Readonly<{ ToAddresses: string[] }>;
  Content: Readonly<{
    Simple: Readonly<{
      Subject: Readonly<{ Data: string; Charset: "UTF-8" }>;
      Body: Readonly<{
        Text: Readonly<{ Data: string; Charset: "UTF-8" }>;
        Html: Readonly<{ Data: string; Charset: "UTF-8" }>;
      }>;
    }>;
  }>;
}>;

export type SesV2Send = (input: SesV2SendEmailInput) => Promise<Readonly<{ MessageId?: string }>>;

function senderHeader(message: TransactionalEmail): string {
  const safeName = message.from.name.replace(/[\r\n"]/g, "").trim();
  return safeName ? `"${safeName}" <${message.from.address}>` : message.from.address;
}

/** Maps Nihonest's provider-neutral message to the SES v2 SendEmail request. */
export function createAmazonSesEmailProvider(send: SesV2Send): EmailProvider {
  return {
    providerName: "amazon-ses",
    async send(message): Promise<EmailSendResult> {
      const result = await send({
        FromEmailAddress: senderHeader(message),
        Destination: { ToAddresses: [message.to] },
        Content: {
          Simple: {
            Subject: { Data: message.subject, Charset: "UTF-8" },
            Body: {
              Text: { Data: message.text, Charset: "UTF-8" },
              Html: { Data: message.html, Charset: "UTF-8" },
            },
          },
        },
      });
      if (!result.MessageId) throw new Error("Amazon SES did not return a message ID.");
      return { providerMessageId: result.MessageId };
    },
  };
}
