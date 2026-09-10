import { describe, expect, it, vi } from "vitest";
import { dispatchNotificationEmail, nextEmailRetryAt } from "./notification-dispatch";
import { prepareEmailDelivery, transitionNotificationDelivery } from "./notification-delivery";

const event = {
  id: "10000000-0000-4000-8000-000000000001",
  userId: "20000000-0000-4000-8000-000000000002",
  type: "reminder-due",
  deduplicationKey: "reminder-due:30000000-0000-4000-8000-000000000003",
  createdAt: "2026-10-01T00:00:00.000Z",
  payload: { reminderId: "30000000-0000-4000-8000-000000000003", title: "Submit documents", scheduledFor: "2026-10-01T00:00:00.000Z" },
} as const;
const preferences = { emailEnabled: true, deadlineRemindersEnabled: true, criticalUpdatesEnabled: false, timeZone: "Asia/Tokyo", updatedAt: event.createdAt };
const emailContext = { fromName: "Nihonest", fromAddress: "notifications@nihonest.com", recipientAddress: "reader@example.com", siteOrigin: "https://nihonest.com" };
const criticalEvent = {
  ...event,
  type: "article-critical-update",
  deduplicationKey: "critical-update-release:60000000-0000-4000-8000-000000000006",
  payload: {
    articleId: "renewing-status-of-residence",
    releaseId: "60000000-0000-4000-8000-000000000006",
    title: "Renewal guidance changed",
    revision: "2026-10-01",
    summary: "The reviewed evidence list changed.",
    journeyTargets: [{ journeyId: "professional-worker", routeId: "engineer" }],
  },
} as const;

function claimedDelivery() {
  const pending = prepareEmailDelivery(event, preferences, "40000000-0000-4000-8000-000000000004", event.createdAt);
  return transitionNotificationDelivery(pending, "processing", "2026-10-01T00:01:00.000Z", {
    claimToken: "50000000-0000-4000-8000-000000000005",
    claimExpiresAt: "2026-10-01T00:06:00.000Z",
  });
}

function claimedCriticalDelivery() {
  const criticalPreferences = { ...preferences, deadlineRemindersEnabled: false, criticalUpdatesEnabled: true };
  const pending = prepareEmailDelivery(criticalEvent, criticalPreferences, "70000000-0000-4000-8000-000000000007", criticalEvent.createdAt);
  return transitionNotificationDelivery(pending, "processing", "2026-10-01T00:01:00.000Z", {
    claimToken: "80000000-0000-4000-8000-000000000008",
    claimExpiresAt: "2026-10-01T00:06:00.000Z",
  });
}

describe("notification email dispatch", () => {
  it("suppresses a claimed delivery when consent was withdrawn", async () => {
    const send = vi.fn();
    const delivery = await dispatchNotificationEmail({
      delivery: claimedDelivery(),
      event,
      preferences: { ...preferences, emailEnabled: false },
      emailContext,
      provider: { send },
      attemptedAt: "2026-10-01T00:01:01.000Z",
    });
    expect(delivery.state).toBe("suppressed");
    expect(send).not.toHaveBeenCalled();
  });

  it("records the provider message ID after successful delivery", async () => {
    const delivery = await dispatchNotificationEmail({
      delivery: claimedDelivery(), event, preferences, emailContext,
      provider: { send: vi.fn().mockResolvedValue({ providerMessageId: "ses-message-1" }) },
      attemptedAt: "2026-10-01T00:01:01.000Z",
    });
    expect(delivery).toMatchObject({ state: "sent", providerMessageId: "ses-message-1" });
  });

  it("records a bounded retry after a provider failure", async () => {
    const delivery = await dispatchNotificationEmail({
      delivery: claimedDelivery(), event, preferences, emailContext,
      provider: { send: vi.fn().mockRejectedValue(new Error("secret provider details")) },
      attemptedAt: "2026-10-01T00:01:01.000Z",
    });
    expect(delivery).toMatchObject({ state: "failed", availableAt: "2026-10-01T00:02:01.000Z" });
    expect(delivery.lastError).not.toContain("secret provider details");
  });

  it("suppresses a critical update after the account changes to an unrelated route", async () => {
    const send = vi.fn();
    const delivery = await dispatchNotificationEmail({
      delivery: claimedCriticalDelivery(),
      event: criticalEvent,
      preferences: { ...preferences, deadlineRemindersEnabled: false, criticalUpdatesEnabled: true },
      criticalUpdateAccountContext: {
        userId: criticalEvent.userId,
        criticalUpdatesEnabled: true,
        savedContent: [],
        journeyId: "professional-worker",
        routeId: "legal-accounting",
      },
      emailContext,
      provider: { send },
      attemptedAt: "2026-10-01T00:01:01.000Z",
    });
    expect(delivery.state).toBe("suppressed");
    expect(send).not.toHaveBeenCalled();
  });

  it("keeps a critical update relevant when the affected guidance remains saved", async () => {
    const send = vi.fn().mockResolvedValue({ providerMessageId: "ses-message-2" });
    const delivery = await dispatchNotificationEmail({
      delivery: claimedCriticalDelivery(),
      event: criticalEvent,
      preferences: { ...preferences, deadlineRemindersEnabled: false, criticalUpdatesEnabled: true },
      criticalUpdateAccountContext: {
        userId: criticalEvent.userId,
        criticalUpdatesEnabled: true,
        savedContent: [{ kind: "article", contentId: criticalEvent.payload.articleId, state: "saved" }],
        journeyId: "professional-worker",
        routeId: "legal-accounting",
      },
      emailContext,
      provider: { send },
      attemptedAt: "2026-10-01T00:01:01.000Z",
    });
    expect(delivery.state).toBe("sent");
    expect(send.mock.calls[0]?.[0].text).toContain("because this guidance is in your Saved items");
  });

  it("caps exponential retry delay at six hours", () => {
    expect(nextEmailRetryAt(20, "2026-10-01T00:00:00.000Z")).toBe("2026-10-01T06:00:00.000Z");
  });
});
