import { z } from "zod";
import {
  notificationEventSchema,
  notificationPreferencesSchema,
  preferencesAllowEmail,
} from "./notifications";

export const NOTIFICATION_DELIVERY_STATES = ["pending", "processing", "sent", "failed", "suppressed"] as const;
export const notificationDeliveryStateSchema = z.enum(NOTIFICATION_DELIVERY_STATES);

export const notificationDeliverySchema = z.object({
  id: z.uuid(),
  eventId: z.uuid(),
  userId: z.uuid(),
  channel: z.literal("email"),
  state: notificationDeliveryStateSchema,
  attemptCount: z.number().int().min(0),
  availableAt: z.iso.datetime(),
  lastAttemptedAt: z.iso.datetime().optional(),
  claimToken: z.uuid().optional(),
  claimExpiresAt: z.iso.datetime().optional(),
  sentAt: z.iso.datetime().optional(),
  providerMessageId: z.string().trim().min(1).max(200).optional(),
  lastError: z.string().trim().min(1).max(500).optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
}).superRefine((delivery, context) => {
  const attempted = delivery.attemptCount > 0 && Boolean(delivery.lastAttemptedAt);
  const claimed = Boolean(delivery.claimToken) && Boolean(delivery.claimExpiresAt);
  if ((delivery.attemptCount > 0) !== Boolean(delivery.lastAttemptedAt)
    || (["processing", "sent", "failed"].includes(delivery.state) && !attempted)
    || (delivery.state === "pending" && attempted)) {
    context.addIssue({ code: "custom", path: ["attemptCount"], message: "Attempt state must match attempt metadata." });
  }
  if (Boolean(delivery.claimToken) !== Boolean(delivery.claimExpiresAt) || (delivery.state === "processing") !== claimed) {
    context.addIssue({ code: "custom", path: ["claimToken"], message: "Only processing deliveries require complete claim metadata." });
  }
  if ((delivery.state === "sent") !== Boolean(delivery.sentAt)) {
    context.addIssue({ code: "custom", path: ["sentAt"], message: "Only sent deliveries require sentAt." });
  }
  if ((delivery.state === "sent") !== Boolean(delivery.providerMessageId)) {
    context.addIssue({ code: "custom", path: ["providerMessageId"], message: "Only sent deliveries require a provider message ID." });
  }
  if ((delivery.state === "failed") !== Boolean(delivery.lastError)) {
    context.addIssue({ code: "custom", path: ["lastError"], message: "Only failed deliveries require an error summary." });
  }
});

export type NotificationDelivery = z.infer<typeof notificationDeliverySchema>;
export type NotificationDeliveryState = z.infer<typeof notificationDeliveryStateSchema>;

export type NotificationDeliveryTransition = Readonly<{
  errorSummary?: string;
  providerMessageId?: string;
  retryAt?: string;
  claimToken?: string;
  claimExpiresAt?: string;
}>;

/** Records the consent decision without invoking a provider or copying an email address. */
export function prepareEmailDelivery(
  eventInput: unknown,
  preferencesInput: unknown,
  deliveryId: string,
  createdAt: string,
): NotificationDelivery {
  const event = notificationEventSchema.parse(eventInput);
  const preferences = notificationPreferencesSchema.parse(preferencesInput);
  return notificationDeliverySchema.parse({
    id: deliveryId,
    eventId: event.id,
    userId: event.userId,
    channel: "email",
    state: preferencesAllowEmail(event, preferences) ? "pending" : "suppressed",
    attemptCount: 0,
    availableAt: createdAt,
    createdAt,
    updatedAt: createdAt,
  });
}

const allowedTransitions: Readonly<Record<NotificationDeliveryState, readonly NotificationDeliveryState[]>> = {
  pending: ["processing", "suppressed"],
  processing: ["sent", "failed", "suppressed"],
  failed: ["processing", "suppressed"],
  sent: [],
  suppressed: [],
};

/** Applies only valid delivery lifecycle transitions; provider errors are stored as bounded summaries. */
export function transitionNotificationDelivery(
  delivery: NotificationDelivery,
  nextState: NotificationDeliveryState,
  updatedAt: string,
  details: NotificationDeliveryTransition = {},
): NotificationDelivery {
  if (!allowedTransitions[delivery.state].includes(nextState)) {
    throw new Error(`Notification delivery cannot transition from ${delivery.state} to ${nextState}.`);
  }

  if (nextState === "processing") {
    return notificationDeliverySchema.parse({
      ...delivery,
      state: nextState,
      attemptCount: delivery.attemptCount + 1,
      lastAttemptedAt: updatedAt,
      claimToken: details.claimToken,
      claimExpiresAt: details.claimExpiresAt,
      lastError: undefined,
      providerMessageId: undefined,
      updatedAt,
    });
  }
  if (nextState === "sent") {
    return notificationDeliverySchema.parse({
      ...delivery,
      state: nextState,
      sentAt: updatedAt,
      claimToken: undefined,
      claimExpiresAt: undefined,
      providerMessageId: details.providerMessageId,
      updatedAt,
    });
  }
  if (nextState === "failed") {
    const lastError = details.errorSummary?.trim().slice(0, 500);
    if (!lastError || !details.retryAt) throw new Error("Failed notification deliveries require an error summary and retry time.");
    return notificationDeliverySchema.parse({
      ...delivery,
      state: nextState,
      availableAt: details.retryAt,
      claimToken: undefined,
      claimExpiresAt: undefined,
      lastError,
      updatedAt,
    });
  }
  return notificationDeliverySchema.parse({
    ...delivery,
    state: "suppressed",
    claimToken: undefined,
    claimExpiresAt: undefined,
    lastError: undefined,
    providerMessageId: undefined,
    updatedAt,
  });
}
