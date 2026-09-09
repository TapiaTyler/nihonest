import type { SupabaseClient } from "@supabase/supabase-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/types/database";
import {
  createScheduledReminder,
  loadNotificationPreferences,
} from "./client-notification-service";

const mocks = vi.hoisted(() => ({ getClient: vi.fn() }));
vi.mock("@/lib/supabase/client", () => ({ getSupabaseBrowserClient: mocks.getClient }));

describe("client notification service", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T00:00:00.000Z"));
    mocks.getClient.mockReset();
  });

  afterEach(() => vi.useRealTimers());

  it("returns explicit opt-out defaults when the account has no preference row", async () => {
    mocks.getClient.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({ maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) }),
        }),
      }),
    } as unknown as SupabaseClient<Database>);

    const result = await loadNotificationPreferences("20000000-0000-4000-8000-000000000002");

    expect(result.ok && result.data.emailEnabled).toBe(false);
    expect(result.ok && result.data.deadlineRemindersEnabled).toBe(false);
    expect(result.ok && result.data.criticalUpdatesEnabled).toBe(false);
  });

  it("converts a journey reminder into a validated account row", async () => {
    const single = vi.fn().mockResolvedValue({
      data: {
        id: "10000000-0000-4000-8000-000000000001",
        user_id: "20000000-0000-4000-8000-000000000002",
        title: "Submit renewal documents",
        target_kind: "checklist",
        target_id: "renewing-status-of-residence",
        scheduled_for: "2026-10-01T00:00:00+00:00",
        time_zone: "Asia/Tokyo",
        state: "scheduled",
        cancelled_at: null,
        fulfilled_at: null,
        created_at: "2026-09-09T00:00:00+00:00",
        updated_at: "2026-09-09T00:00:00+00:00",
      },
      error: null,
    });
    const insert = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single }) });
    mocks.getClient.mockReturnValue({ from: vi.fn().mockReturnValue({ insert }) } as unknown as SupabaseClient<Database>);

    const result = await createScheduledReminder({
      userId: "20000000-0000-4000-8000-000000000002",
      title: "Submit renewal documents",
      target: { kind: "checklist", id: "renewing-status-of-residence" },
      localDateTime: "2026-10-01T09:00",
      timeZone: "Asia/Tokyo",
    });

    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      target_kind: "checklist",
      target_id: "renewing-status-of-residence",
      scheduled_for: "2026-10-01T00:00:00.000Z",
    }));
    expect(result.ok && result.data.scheduledFor).toBe("2026-10-01T00:00:00.000Z");
  });
});
