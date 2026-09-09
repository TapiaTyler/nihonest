import type { SupabaseClient } from "@supabase/supabase-js";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type AccountContentState, emptyAccountContentState } from "@/domain/sync/account-content-state";
import { accountContentOwnerStorageKey } from "@/lib/storage/account-content-owner";
import { glossaryStudyStorageKey } from "@/lib/storage/glossary-study";
import { savedContentStorageKey } from "@/lib/storage/saved-content";
import type { Database } from "@/types/database";
import { AccountContentSyncProvider, useAccountContentSync } from "./account-content-sync-provider";

const mocks = vi.hoisted(() => ({
  getClient: vi.fn(),
  synchronize: vi.fn(),
}));

vi.mock("@/lib/supabase/client", () => ({ getSupabaseBrowserClient: mocks.getClient }));
vi.mock("@/lib/sync/account-content-sync", () => ({ synchronizeAccountContent: mocks.synchronize }));

function SyncStatus() {
  const { status } = useAccountContentSync();
  return <p>{status}</p>;
}

function authenticatedClient(userId = "30000000-0000-4000-8000-000000000003") {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: userId } } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  } as unknown as SupabaseClient<Database>;
}

describe("AccountContentSyncProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mocks.getClient.mockReset().mockReturnValue(authenticatedClient());
    mocks.synchronize.mockReset();
  });

  it("merges the device snapshot and applies the canonical account response", async () => {
    const deviceRecord = { kind: "article", contentId: "banking", state: "saved", updatedAt: "2026-09-08T12:00:00.000Z" } as const;
    const canonicalState: AccountContentState = {
      ...emptyAccountContentState,
      savedContent: [deviceRecord],
      glossaryProgress: [{ termId: "zairyu-card", state: "learning", reviewCount: 1, updatedAt: "2026-09-08T13:00:00.000Z", lastReviewedAt: "2026-09-08T13:00:00.000Z" }],
    };
    window.localStorage.setItem(savedContentStorageKey, JSON.stringify([deviceRecord]));
    mocks.synchronize.mockResolvedValue({ ok: true, state: canonicalState });

    render(<AccountContentSyncProvider><SyncStatus /></AccountContentSyncProvider>);

    await screen.findByText("synchronized");
    expect(mocks.synchronize).toHaveBeenCalledWith(expect.anything(), {
      ...emptyAccountContentState,
      savedContent: [deviceRecord],
    });
    expect(JSON.parse(window.localStorage.getItem(glossaryStudyStorageKey) ?? "null")).toEqual(canonicalState.glossaryProgress);
    expect(window.localStorage.getItem(accountContentOwnerStorageKey)).toBe("30000000-0000-4000-8000-000000000003");
  });

  it("does not import a different account's device cache", async () => {
    const accountRecord = { kind: "residence-status", contentId: "student", state: "saved", updatedAt: "2026-09-08T14:00:00.000Z" } as const;
    window.localStorage.setItem(accountContentOwnerStorageKey, "40000000-0000-4000-8000-000000000004");
    window.localStorage.setItem(savedContentStorageKey, JSON.stringify([
      { kind: "article", contentId: "banking", state: "saved", updatedAt: "2026-09-08T12:00:00.000Z" },
    ]));
    mocks.synchronize.mockResolvedValue({ ok: true, state: { ...emptyAccountContentState, savedContent: [accountRecord] } });

    render(<AccountContentSyncProvider><SyncStatus /></AccountContentSyncProvider>);

    await waitFor(() => expect(mocks.synchronize).toHaveBeenCalledWith(expect.anything(), emptyAccountContentState));
    expect(JSON.parse(window.localStorage.getItem(savedContentStorageKey) ?? "null")).toEqual([accountRecord]);
  });
});
