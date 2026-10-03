import type { SupabaseClient } from "@supabase/supabase-js";
import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type AccountContentState, emptyAccountContentState } from "@/domain/sync/account-content-state";
import { accountContentOwnerStorageKey } from "@/lib/storage/account-content-owner";
import { glossaryStudyStorageKey } from "@/lib/storage/glossary-study";
import { savedContentStorageKey, writeSavedContent } from "@/lib/storage/saved-content";
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

function controlledClient(initialUser: Promise<unknown>) {
  let callback: (event: string, session: { user: { id: string } } | null) => void = () => undefined;
  const unsubscribe = vi.fn();
  const client = { auth: {
    getUser: vi.fn(() => initialUser),
    onAuthStateChange: vi.fn((listener: typeof callback) => {
      callback = listener;
      return { data: { subscription: { unsubscribe } } };
    }),
  } } as unknown as SupabaseClient<Database>;
  return { client, unsubscribe, emit(userId?: string) { callback(userId ? "TOKEN_REFRESHED" : "SIGNED_OUT", userId ? { user: { id: userId } } : null); } };
}

describe("AccountContentSyncProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mocks.getClient.mockReset().mockReturnValue(authenticatedClient());
    mocks.synchronize.mockReset();
  });

  it("does not let a stale initial identity overwrite a newer auth event", async () => {
    let finishIdentity!: (value: unknown) => void;
    const f = controlledClient(new Promise((resolve) => { finishIdentity = resolve; }));
    mocks.getClient.mockReturnValue(f.client);
    mocks.synchronize.mockResolvedValue({ ok: true, state: emptyAccountContentState });
    render(<AccountContentSyncProvider><SyncStatus /></AccountContentSyncProvider>);
    act(() => f.emit("new-account"));
    await screen.findByText("synchronized");
    await act(async () => { finishIdentity({ data: { user: { id: "old-account" } } }); });
    expect(window.localStorage.getItem(accountContentOwnerStorageKey)).toBe("new-account");
    expect(mocks.synchronize).toHaveBeenCalledTimes(1);
  });

  it("keeps sign-out inactive when an old request subsequently fails", async () => {
    let finishRequest!: (value: unknown) => void;
    const f = controlledClient(Promise.resolve({ data: { user: { id: "account-A" } } }));
    mocks.getClient.mockReturnValue(f.client);
    mocks.synchronize.mockImplementationOnce(() => new Promise((resolve) => { finishRequest = resolve; }));
    render(<AccountContentSyncProvider><SyncStatus /></AccountContentSyncProvider>);
    await waitFor(() => expect(mocks.synchronize).toHaveBeenCalledTimes(1));
    act(() => f.emit());
    await screen.findByText("inactive");
    await act(async () => { finishRequest({ ok: false, message: "Old-account failure" }); });
    expect(screen.getByText("inactive")).toBeInTheDocument();
    expect(window.localStorage.getItem(accountContentOwnerStorageKey)).toBeNull();
  });

  it("does not apply a request result after cleanup", async () => {
    let finishRequest!: (value: unknown) => void;
    const f = controlledClient(Promise.resolve({ data: { user: { id: "account-A" } } }));
    mocks.getClient.mockReturnValue(f.client);
    mocks.synchronize.mockImplementationOnce(() => new Promise((resolve) => { finishRequest = resolve; }));
    const view = render(<AccountContentSyncProvider><SyncStatus /></AccountContentSyncProvider>);
    await waitFor(() => expect(mocks.synchronize).toHaveBeenCalledTimes(1));
    view.unmount();
    await act(async () => { finishRequest({ ok: true, state: { ...emptyAccountContentState, savedContent: [
      { kind: "article", contentId: "old-account-only", state: "saved", updatedAt: "2026-09-29T00:00:00.000Z" },
    ] } }); });
    expect(window.localStorage.getItem(savedContentStorageKey)).toBeNull();
    expect(window.localStorage.getItem(accountContentOwnerStorageKey)).toBeNull();
    expect(f.unsubscribe).toHaveBeenCalledOnce();
  });

  it("does not resynchronize for a token refresh of the same account", async () => {
    const f = controlledClient(Promise.resolve({ data: { user: { id: "account-A" } } }));
    mocks.getClient.mockReturnValue(f.client);
    mocks.synchronize.mockResolvedValue({ ok: true, state: emptyAccountContentState });
    render(<AccountContentSyncProvider><SyncStatus /></AccountContentSyncProvider>);
    await screen.findByText("synchronized");
    await act(async () => { f.emit("account-A"); });
    expect(mocks.synchronize).toHaveBeenCalledTimes(1);
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

  it("keeps a changing foreign cache out of the new account's upload", async () => {
    const record = (contentId: string) => ({ kind: "article", contentId, state: "saved", updatedAt: "2026-09-30T00:00:00.000Z" } as const);
    window.localStorage.setItem(accountContentOwnerStorageKey, "account-B");
    writeSavedContent([record("B-original")]);
    let finishFirst!: (value: unknown) => void;
    let finishSecond!: (value: unknown) => void;
    mocks.synchronize
      .mockImplementationOnce(() => new Promise((resolve) => { finishFirst = resolve; }))
      .mockImplementationOnce(() => new Promise((resolve) => { finishSecond = resolve; }));
    render(<AccountContentSyncProvider><SyncStatus /></AccountContentSyncProvider>);
    await waitFor(() => expect(mocks.synchronize).toHaveBeenCalledTimes(1));
    act(() => writeSavedContent([record("B-new-edit")]));
    await act(async () => { finishFirst({ ok: true, state: { ...emptyAccountContentState, savedContent: [record("A-canonical")] } }); });
    await waitFor(() => expect(mocks.synchronize).toHaveBeenCalledTimes(2));
    expect(mocks.synchronize.mock.calls[1][1]).toEqual(emptyAccountContentState);
    expect(window.localStorage.getItem(accountContentOwnerStorageKey)).toBe("account-B");
    expect(JSON.parse(window.localStorage.getItem(savedContentStorageKey) ?? "null")).toEqual([record("B-new-edit")]);
    await act(async () => { finishSecond({ ok: true, state: { ...emptyAccountContentState, savedContent: [record("A-canonical")] } }); });
    await screen.findByText("synchronized");
    expect(window.localStorage.getItem(accountContentOwnerStorageKey)).toBe("30000000-0000-4000-8000-000000000003");
    expect(JSON.parse(window.localStorage.getItem(savedContentStorageKey) ?? "null")).toEqual([record("A-canonical")]);
  });
  it("discards a response for the previous account and synchronizes the account signed in during the request", async () => {
    const firstUser = "30000000-0000-4000-8000-000000000003";
    const secondUser = "50000000-0000-4000-8000-000000000005";
    let changeAccount: (userId: string) => void = () => undefined;
    const client = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: firstUser } } }),
        onAuthStateChange: vi.fn((callback: (event: string, session: { user: { id: string } } | null) => void) => {
          changeAccount = (userId) => callback("SIGNED_IN", { user: { id: userId } });
          return { data: { subscription: { unsubscribe: vi.fn() } } };
        }),
      },
    } as unknown as SupabaseClient<Database>;
    mocks.getClient.mockReturnValue(client);
    const firstAccountRecord = { kind: "article", contentId: "first-account-only", state: "saved", updatedAt: "2026-09-08T12:00:00.000Z" } as const;
    let finishFirstRequest: (value: unknown) => void = () => undefined;
    mocks.synchronize
      .mockImplementationOnce(() => new Promise((resolve) => { finishFirstRequest = resolve; }))
      .mockResolvedValueOnce({ ok: true, state: emptyAccountContentState });

    render(<AccountContentSyncProvider><SyncStatus /></AccountContentSyncProvider>);
    await waitFor(() => expect(mocks.synchronize).toHaveBeenCalledTimes(1));
    changeAccount(secondUser);
    finishFirstRequest({ ok: true, state: { ...emptyAccountContentState, savedContent: [firstAccountRecord] } });

    await waitFor(() => expect(mocks.synchronize).toHaveBeenCalledTimes(2));
    await screen.findByText("synchronized");
    expect(window.localStorage.getItem(accountContentOwnerStorageKey)).toBe(secondUser);
    expect(JSON.parse(window.localStorage.getItem(savedContentStorageKey) ?? "[]")).toEqual([]);
  });
});
