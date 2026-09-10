import { describe, expect, it } from "vitest";
import {
  prepareEmailDelivery,
  transitionNotificationDelivery,
} from "./notification-delivery";

const event = {
  id: "10000000-0000-4000-8000-000000000001",
  userId: "20000000-0000-4000-8000-000000000002",
  type: "reminder-due",
  deduplicationKey: "reminder-due:30000000-0000-4000-8000-000000000003",
  createdAt: "2026-10-01T00:00:00.000Z",
  payload: {
    reminderId: "30000000-0000-4000-8000-000000000003",
    title: "Submit renewal documents",
    scheduledFor: "2026-10-01T00:00:00.000Z",
  },
} as const;

const optedIn = {
  emailEnabled: true,
  deadlineRemindersEnabled: true,
  criticalUpdatesEnabled: false,
  timeZone: "Asia/Tokyo",
  updatedAt: "2026-09-09T00:00:00.000Z",
};

describe("notification delivery lifecycle", () => {
  it("records explicit opt-out as suppressed without attempting delivery", () => {
    const delivery = prepareEmailDelivery(event, { ...optedIn, emailEnabled: false }, "40000000-0000-4000-8000-000000000004", event.createdAt);
    expect(delivery).toMatchObject({ state: "suppressed", attemptCount: 0 });
  });

  it("prepares an opted-in event without storing an email address", () => {
    const delivery = prepareEmailDelivery(event, optedIn, "40000000-0000-4000-8000-000000000004", event.createdAt);
    expect(delivery.state).toBe("pending");
    expect(delivery).not.toHaveProperty("email");
  });

  it("tracks retry attempts and eventual success", () => {
    const pending = prepareEmailDelivery(event, optedIn, "40000000-0000-4000-8000-000000000004", event.createdAt);
    const processing = transitionNotificationDelivery(pending, "processing", "2026-10-01T00:01:00.000Z", {
      claimToken: "50000000-0000-4000-8000-000000000005",
      claimExpiresAt: "2026-10-01T00:06:00.000Z",
    });
    const failed = transitionNotificationDelivery(processing, "failed", "2026-10-01T00:01:01.000Z", {
      errorSummary: "Provider temporarily unavailable",
      retryAt: "2026-10-01T00:02:01.000Z",
    });
    const retrying = transitionNotificationDelivery(failed, "processing", "2026-10-01T00:06:00.000Z", {
      claimToken: "60000000-0000-4000-8000-000000000006",
      claimExpiresAt: "2026-10-01T00:11:00.000Z",
    });
    const sent = transitionNotificationDelivery(retrying, "sent", "2026-10-01T00:06:01.000Z", { providerMessageId: "ses-message-1" });

    expect(failed).toMatchObject({ state: "failed", attemptCount: 1, lastError: "Provider temporarily unavailable" });
    expect(sent).toMatchObject({ state: "sent", attemptCount: 2, sentAt: "2026-10-01T00:06:01.000Z", providerMessageId: "ses-message-1" });
  });

  it("rejects transitions from terminal states", () => {
    const suppressed = prepareEmailDelivery(event, { ...optedIn, deadlineRemindersEnabled: false }, "40000000-0000-4000-8000-000000000004", event.createdAt);
    expect(() => transitionNotificationDelivery(suppressed, "processing", "2026-10-01T00:01:00.000Z")).toThrow("cannot transition");
  });
});
