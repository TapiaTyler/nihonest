// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { emptyAccountContentState, type AccountContentState } from "@/domain/sync/account-content-state";
import { createAccountContentCoordinator } from "./account-content-coordinator";
import type { AccountContentSnapshot, AccountContentSyncResult, AccountContentSyncStatus } from "./account-content-sync-contract";

function saved(id: string): AccountContentState {
  return { ...emptyAccountContentState, savedContent: [{ kind: "article", contentId: id, state: "saved", updatedAt: "2026-09-29T00:00:00.000Z" }] };
}

function deferred() {
  let resolve!: (result: AccountContentSyncResult) => void;
  const promise = new Promise<AccountContentSyncResult>((finish) => { resolve = finish; });
  return { promise, resolve };
}

function fixture() {
  let device = saved("device");
  let owner: string | undefined;
  const statuses: AccountContentSyncStatus[] = [];
  const snapshot = (): AccountContentSnapshot => ({ savedContent: JSON.stringify(device.savedContent),
    glossaryProgress: JSON.stringify(device.glossaryProgress), checklistProgress: JSON.stringify(device.checklistProgress) });
  const synchronize = vi.fn<(account: string, state: AccountContentState) => Promise<AccountContentSyncResult>>()
    .mockResolvedValue({ ok: true, state: saved("canonical") });
  let onWrite = () => undefined;
  const applyCanonical = vi.fn((canonical: AccountContentState, requested: AccountContentSnapshot) => {
    let newer = false;
    const current = snapshot();
    for (const key of ["savedContent", "glossaryProgress", "checklistProgress"] as const) {
      if (current[key] === requested[key]) device = { ...device, [key]: canonical[key] };
      else newer = true;
    }
    onWrite();
    return newer;
  });
  const coordinator = createAccountContentCoordinator({ readState: () => structuredClone(device), readSnapshot: snapshot,
    readOwner: () => owner, applyCanonical, writeOwner: (id) => { owner = id; }, synchronize,
    publish: (status) => statuses.push(status) });
  return { coordinator, synchronize, applyCanonical, statuses, device: () => device, owner: () => owner,
    setDevice(state: AccountContentState) { device = state; }, setOwner(id: string) { owner = id; },
    onWrite(callback: () => undefined) { onWrite = callback; } };
}

describe("portable account coordinator", () => {
  it("does no sync work without an account and imports unowned data on activation", async () => {
    const f = fixture();
    await f.coordinator.synchronize();
    expect(f.synchronize).not.toHaveBeenCalled();
    f.coordinator.setAccount("A");
    await f.coordinator.synchronize();
    expect(f.synchronize).toHaveBeenCalledWith("A", saved("device"));
    expect(f.owner()).toBe("A");
    expect(f.device()).toEqual(saved("canonical"));
    expect(f.statuses.at(-1)).toEqual({ status: "synchronized" });
  });

  it("does not upload another account's cache", async () => {
    const f = fixture();
    f.setOwner("B");
    f.coordinator.setAccount("A");
    await f.coordinator.synchronize();
    expect(f.synchronize).toHaveBeenCalledWith("A", emptyAccountContentState);
    expect(f.owner()).toBe("A");
  });

  it("queues device edits without overwriting newer families or overlapping requests", async () => {
    const f = fixture();
    const first = deferred();
    f.synchronize.mockImplementationOnce(() => first.promise).mockResolvedValueOnce({ ok: true, state: saved("new-edit") });
    f.coordinator.setAccount("A");
    const running = f.coordinator.synchronize();
    await Promise.resolve();
    f.setDevice(saved("new-edit"));
    f.coordinator.deviceChanged();
    expect(f.synchronize).toHaveBeenCalledTimes(1);
    first.resolve({ ok: true, state: saved("old-server") });
    await running;
    expect(f.synchronize).toHaveBeenCalledTimes(2);
    expect(f.synchronize.mock.calls[1]).toEqual(["A", saved("new-edit")]);
    expect(f.device()).toEqual(saved("new-edit"));
  });

  it.each(["savedContent", "glossaryProgress", "checklistProgress"] as const)("does not relabel or upload foreign %s edits during an account handoff", async (family) => {
    const f = fixture();
    const first = deferred();
    const second = deferred();
    f.setOwner("B");
    f.synchronize.mockImplementationOnce(() => first.promise).mockImplementationOnce(() => second.promise);
    f.coordinator.setAccount("A");
    const running = f.coordinator.synchronize();
    await Promise.resolve();
    const edited: AccountContentState = {
      savedContent: saved("B-edited-during-handoff").savedContent,
      glossaryProgress: [{ termId: "B-term", state: "learning", reviewCount: 1, updatedAt: "2026-09-30T00:00:00.000Z" }],
      checklistProgress: [{ checklistId: "B-task", state: "not-started", updatedAt: "2026-09-30T00:00:00.000Z" }],
    };
    f.setDevice({ ...f.device(), [family]: edited[family] });
    f.coordinator.deviceChanged();
    first.resolve({ ok: true, state: saved("A-canonical") });
    await vi.waitFor(() => expect(f.synchronize).toHaveBeenCalledTimes(2));
    expect(f.synchronize.mock.calls[1]).toEqual(["A", emptyAccountContentState]);
    expect(f.owner()).toBe("B");
    expect(f.applyCanonical).not.toHaveBeenCalled();
    second.resolve({ ok: true, state: saved("A-canonical") });
    await running;
    expect(f.owner()).toBe("A");
    expect(f.device()).toEqual(saved("A-canonical"));
  });

  it.each([true, false])("discards a previous account's result (success=%s) and drains the new account", async (ok) => {
    const f = fixture();
    const first = deferred();
    f.synchronize.mockImplementationOnce(() => first.promise).mockResolvedValueOnce({ ok: true, state: saved("B") });
    f.coordinator.setAccount("A");
    const running = f.coordinator.synchronize();
    await Promise.resolve();
    f.coordinator.setAccount("B");
    first.resolve(ok ? { ok: true, state: saved("A") } : { ok: false, message: "Old A failure" });
    await running;
    expect(f.applyCanonical).toHaveBeenCalledTimes(1);
    expect(f.owner()).toBe("B");
    expect(f.device()).toEqual(saved("B"));
    expect(f.statuses.some((state) => state.status === "error")).toBe(false);
  });

  it("rejects a stale result even when identity changes A -> B -> A", async () => {
    const f = fixture();
    const first = deferred();
    f.synchronize.mockImplementationOnce(() => first.promise).mockResolvedValueOnce({ ok: true, state: saved("new-A") });
    f.coordinator.setAccount("A");
    const running = f.coordinator.synchronize();
    await Promise.resolve();
    f.coordinator.setAccount("B");
    f.coordinator.setAccount("A");
    first.resolve({ ok: true, state: saved("stale-A") });
    await running;
    expect(f.applyCanonical).toHaveBeenCalledTimes(1);
    expect(f.device()).toEqual(saved("new-A"));
  });

  it.each([true, false])("does not update cache or inactive status after sign-out (success=%s)", async (ok) => {
    const f = fixture();
    const first = deferred();
    f.synchronize.mockImplementationOnce(() => first.promise);
    f.coordinator.setAccount("A");
    const running = f.coordinator.synchronize();
    await Promise.resolve();
    f.coordinator.setAccount(undefined);
    first.resolve(ok ? { ok: true, state: saved("old-account") } : { ok: false, message: "Old failure" });
    await running;
    expect(f.applyCanonical).not.toHaveBeenCalled();
    expect(f.owner()).toBeUndefined();
    expect(f.statuses.at(-1)).toEqual({ status: "inactive" });
  });

  it("pauses on failure and permits an explicit retry", async () => {
    const f = fixture();
    f.synchronize.mockResolvedValueOnce({ ok: false, message: "Retry needed" });
    f.coordinator.setAccount("A");
    await f.coordinator.synchronize();
    expect(f.statuses.at(-1)).toEqual({ status: "error", errorMessage: "Retry needed" });
    expect(f.synchronize).toHaveBeenCalledTimes(1);
    await f.coordinator.synchronize();
    expect(f.synchronize).toHaveBeenCalledTimes(2);
    expect(f.statuses.at(-1)).toEqual({ status: "synchronized" });
  });

  it("recovers from a rejected transport and suppresses canonical-write notifications", async () => {
    const f = fixture();
    f.synchronize.mockRejectedValueOnce(new Error("Private transport error"));
    f.onWrite(() => { f.coordinator.deviceChanged(); return undefined; });
    f.coordinator.setAccount("A");
    await f.coordinator.synchronize();
    expect(f.statuses.at(-1)?.errorMessage).not.toContain("Private");
    await f.coordinator.synchronize();
    expect(f.synchronize).toHaveBeenCalledTimes(2);
    expect(f.statuses.at(-1)).toEqual({ status: "synchronized" });
  });

  it("ignores all results and new requests after disposal", async () => {
    const f = fixture();
    const first = deferred();
    f.synchronize.mockImplementationOnce(() => first.promise);
    f.coordinator.setAccount("A");
    const running = f.coordinator.synchronize();
    await Promise.resolve();
    f.coordinator.dispose();
    const emitted = f.statuses.length;
    first.resolve({ ok: true, state: saved("disposed") });
    await running;
    f.coordinator.setAccount("B");
    await f.coordinator.synchronize();
    expect(f.statuses).toHaveLength(emitted);
    expect(f.applyCanonical).not.toHaveBeenCalled();
    expect(f.synchronize).toHaveBeenCalledTimes(1);
  });
});
