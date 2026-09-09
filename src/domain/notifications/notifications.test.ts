import { describe, expect, it } from "vitest";
import {
  cancelReminder,
  createReminderDueEvent,
  isReminderDue,
  notificationPreferencesSchema,
  preferencesAllowEmail,
  reminderSchema,
  resolveLocalReminderTime,
  type Reminder,
} from "./notifications";

const reminder: Reminder = reminderSchema.parse({
  id: "10000000-0000-4000-8000-000000000001",
  userId: "20000000-0000-4000-8000-000000000002",
  title: "Submit renewal documents",
  target: { kind: "article", id: "renewing-status-of-residence" },
  scheduledFor: "2026-10-01T00:00:00.000Z",
  timeZone: "Asia/Tokyo",
  state: "scheduled",
  createdAt: "2026-09-09T00:00:00.000Z",
  updatedAt: "2026-09-09T00:00:00.000Z",
});

describe("notification foundation", () => {
  it("defaults every optional communication preference to off", () => {
    expect(notificationPreferencesSchema.parse({ updatedAt: "2026-09-09T00:00:00.000Z" })).toEqual({
      emailEnabled: false,
      deadlineRemindersEnabled: false,
      criticalUpdatesEnabled: false,
      timeZone: "UTC",
      updatedAt: "2026-09-09T00:00:00.000Z",
    });
  });

  it("resolves a Japanese wall-clock time to its UTC instant", () => {
    expect(resolveLocalReminderTime("2026-10-01T09:00", "Asia/Tokyo")).toBe("2026-10-01T00:00:00.000Z");
  });

  it("rejects invalid dates, time zones, and nonexistent DST times", () => {
    expect(resolveLocalReminderTime("2026-02-30T09:00", "Asia/Tokyo")).toBeUndefined();
    expect(resolveLocalReminderTime("2026-10-01T09:00", "Mars/Olympus")).toBeUndefined();
    expect(resolveLocalReminderTime("2026-03-08T02:30", "America/New_York")).toBeUndefined();
  });

  it("uses the earlier occurrence of a repeated DST wall-clock time", () => {
    expect(resolveLocalReminderTime("2026-11-01T01:30", "America/New_York")).toBe("2026-11-01T05:30:00.000Z");
  });

  it("prevents cancelled reminders from becoming due", () => {
    const cancelled = cancelReminder(reminder, "2026-09-10T00:00:00.000Z");
    expect(cancelled.state).toBe("cancelled");
    expect(cancelled.cancelledAt).toBe("2026-09-10T00:00:00.000Z");
    expect(isReminderDue(cancelled, "2026-10-02T00:00:00.000Z")).toBe(false);
  });

  it("generates one stable reminder event independently of delivery consent", () => {
    const event = createReminderDueEvent(reminder, "30000000-0000-4000-8000-000000000003", "2026-10-01T00:00:00.000Z");
    expect(event?.deduplicationKey).toBe(`reminder-due:${reminder.id}`);
    expect(preferencesAllowEmail(event!, notificationPreferencesSchema.parse({
      emailEnabled: true,
      deadlineRemindersEnabled: false,
      updatedAt: "2026-09-09T00:00:00.000Z",
    }))).toBe(false);
    expect(preferencesAllowEmail(event!, notificationPreferencesSchema.parse({
      emailEnabled: true,
      deadlineRemindersEnabled: true,
      updatedAt: "2026-09-09T00:00:00.000Z",
    }))).toBe(true);
  });
});
