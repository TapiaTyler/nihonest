import type { TransactionalEmail } from "@/domain/notifications/notification-email";

export type EmailSendResult = Readonly<{ providerMessageId: string }>;

/** Provider implementations receive transient recipient data; callers must not persist it in delivery rows. */
export interface EmailProvider {
  readonly providerName: string;
  send(message: TransactionalEmail): Promise<EmailSendResult>;
}
