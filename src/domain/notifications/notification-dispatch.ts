import { renderNotificationEmail, type NotificationEmailContext } from "./notification-email";
import { criticalUpdateDeliveryReasons, type CriticalUpdateAccountContext } from "./critical-updates";
import { preferencesAllowEmail, type NotificationEvent, type NotificationPreferences } from "./notifications";
import {
  transitionNotificationDelivery,
  type NotificationDelivery,
} from "./notification-delivery";

export const MAX_EMAIL_DELIVERY_ATTEMPTS = 5;

export type NotificationEmailSender = Readonly<{
  send(message: ReturnType<typeof renderNotificationEmail>): Promise<Readonly<{ providerMessageId: string }>>;
}>;

export type DispatchNotificationEmailInput = Readonly<{
  delivery: NotificationDelivery;
  event: NotificationEvent;
  preferences: NotificationPreferences;
  emailContext: NotificationEmailContext;
  provider: NotificationEmailSender;
  attemptedAt: string;
  criticalUpdateAccountContext?: CriticalUpdateAccountContext;
}>;

/** Exponential retries begin at one minute and remain bounded to six hours. */
export function nextEmailRetryAt(attemptCount: number, failedAt: string): string {
  if (!Number.isInteger(attemptCount) || attemptCount < 1) throw new Error("Retry calculation requires a completed attempt.");
  const delaySeconds = Math.min(21_600, 60 * (2 ** (attemptCount - 1)));
  return new Date(Date.parse(failedAt) + delaySeconds * 1_000).toISOString();
}

export function canRetryEmailDelivery(delivery: NotificationDelivery): boolean {
  return delivery.state === "failed" && delivery.attemptCount < MAX_EMAIL_DELIVERY_ATTEMPTS;
}

/** Dispatches one claimed delivery, re-checking consent immediately before the provider call. */
export async function dispatchNotificationEmail(input: DispatchNotificationEmailInput): Promise<NotificationDelivery> {
  const { delivery, event, preferences, emailContext, provider, attemptedAt } = input;
  if (delivery.state !== "processing" || delivery.eventId !== event.id || delivery.userId !== event.userId) {
    throw new Error("Only the matching claimed notification delivery can be dispatched.");
  }
  if (!preferencesAllowEmail(event, preferences)) {
    return transitionNotificationDelivery(delivery, "suppressed", attemptedAt);
  }

  const criticalUpdateReasons = event.type === "reminder-due"
    ? undefined
    : input.criticalUpdateAccountContext
      ? criticalUpdateDeliveryReasons(event, input.criticalUpdateAccountContext)
      : [];
  // Critical updates fail closed when current account relevance cannot be established.
  if (criticalUpdateReasons && criticalUpdateReasons.length === 0) {
    return transitionNotificationDelivery(delivery, "suppressed", attemptedAt);
  }

  try {
    const result = await provider.send(renderNotificationEmail(event, { ...emailContext, criticalUpdateReasons }));
    return transitionNotificationDelivery(delivery, "sent", attemptedAt, { providerMessageId: result.providerMessageId });
  } catch {
    return transitionNotificationDelivery(delivery, "failed", attemptedAt, {
      errorSummary: "The email provider rejected or could not complete the delivery.",
      retryAt: nextEmailRetryAt(delivery.attemptCount, attemptedAt),
    });
  }
}
