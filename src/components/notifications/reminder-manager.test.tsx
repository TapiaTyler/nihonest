import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { reminderReturnStorageKey } from "./reminder-link";
import { ReminderManager } from "./reminder-manager";

const mocks = vi.hoisted(() => ({
  back: vi.fn(),
  push: vi.fn(),
  create: vi.fn(),
  loadPreferences: vi.fn(),
  loadReminders: vi.fn(),
}));

const returnTo = "/my-journey#journey-step-renewing-status-of-residence";
const query = new Map([
  ["target", "checklist"],
  ["targetId", "renewing-status-of-residence"],
  ["title", "Submit renewal documents"],
  ["returnTo", returnTo],
]);

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: mocks.back, push: mocks.push }),
  useSearchParams: () => ({ get: (key: string) => query.get(key) ?? null }),
}));
vi.mock("@/components/account/account-session-provider", () => ({
  useAccountSession: () => ({ status: "signed-in", userId: "20000000-0000-4000-8000-000000000002" }),
}));
vi.mock("@/lib/notifications/client-notification-service", () => ({
  browserTimeZone: () => "Asia/Tokyo",
  cancelScheduledReminder: vi.fn(),
  createScheduledReminder: mocks.create,
  loadNotificationPreferences: mocks.loadPreferences,
  loadScheduledReminders: mocks.loadReminders,
}));

describe("ReminderManager return routing", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mocks.back.mockReset();
    mocks.push.mockReset();
    mocks.loadPreferences.mockReset().mockResolvedValue({
      ok: true,
      data: {
        emailEnabled: true,
        deadlineRemindersEnabled: true,
        criticalUpdatesEnabled: false,
        timeZone: "Asia/Tokyo",
        updatedAt: "2026-09-09T00:00:00.000Z",
      },
    });
    mocks.loadReminders.mockReset().mockResolvedValue({ ok: true, data: [] });
    mocks.create.mockReset().mockResolvedValue({
      ok: true,
      data: {
        id: "10000000-0000-4000-8000-000000000001",
        userId: "20000000-0000-4000-8000-000000000002",
        title: "Submit renewal documents",
        target: { kind: "checklist", id: "renewing-status-of-residence" },
        scheduledFor: "2026-10-01T00:00:00.000Z",
        timeZone: "Asia/Tokyo",
        state: "scheduled",
        createdAt: "2026-09-09T00:00:00.000Z",
        updatedAt: "2026-09-09T00:00:00.000Z",
      },
    });
  });

  it("uses browser history for both manual return and successful scheduling", async () => {
    sessionStorage.setItem(reminderReturnStorageKey, returnTo);
    render(<ReminderManager />);
    await screen.findByRole("heading", { name: "Upcoming reminders" });

    fireEvent.click(screen.getByRole("button", { name: "Return to journey" }));
    expect(mocks.back).toHaveBeenCalledOnce();

    sessionStorage.setItem(reminderReturnStorageKey, returnTo);
    fireEvent.change(screen.getByLabelText("Date and time"), { target: { value: "2026-10-01T09:00" } });
    fireEvent.click(screen.getByRole("button", { name: "Schedule reminder" }));

    await waitFor(() => expect(mocks.create).toHaveBeenCalledOnce());
    await waitFor(() => expect(mocks.back).toHaveBeenCalledTimes(2));
    expect(mocks.push).not.toHaveBeenCalled();
  });
});
