import { emptyAccountContentState, type AccountContentState } from "@/domain/sync/account-content-state";
import type { AccountContentSnapshot, AccountContentSyncResult, AccountContentSyncStatus } from "./account-content-sync-contract";

export type AccountContentCoordinatorDependencies = Readonly<{
  readState(): AccountContentState;
  readSnapshot(): AccountContentSnapshot;
  readOwner(): string | undefined;
  /** Apply unchanged families only; return true when newer device edits require another pass. */
  applyCanonical(state: AccountContentState, snapshot: AccountContentSnapshot): boolean;
  writeOwner(accountId: string): void;
  /** Transport adapters own authenticated account binding; the coordinator supplies the expected identity. */
  synchronize(accountId: string, state: AccountContentState): Promise<AccountContentSyncResult>;
  publish(status: AccountContentSyncStatus): void;
}>;

/** Serial account synchronization with injected storage/transport; no UI, browser or SDK dependency. */
export function createAccountContentCoordinator(dependencies: AccountContentCoordinatorDependencies) {
  let accountId: string | undefined;
  let revision = 0;
  let disposed = false;
  let queued = false;
  let applying = false;
  let running: Promise<void> | undefined;

  async function drain() {
    while (!disposed && accountId && queued) {
      queued = false;
      const requestedAccount = accountId;
      const requestedRevision = revision;
      dependencies.publish({ status: "synchronizing" });
      try {
        const snapshot = dependencies.readSnapshot();
        const owner = dependencies.readOwner();
        const state = owner && owner !== requestedAccount ? emptyAccountContentState : dependencies.readState();
        const result = await dependencies.synchronize(requestedAccount, state);
        if (disposed) return;
        // Revision also rejects A -> B -> A and sign-out -> sign-in while an old request runs.
        if (revision !== requestedRevision) continue;
        if (!result.ok) {
          queued = false;
          dependencies.publish({ status: "error", errorMessage: result.message });
          return;
        }
        // A foreign cache must transfer as a whole. Retaining a newer family while relabeling
        // its owner would upload the previous account's edits on the next queued pass.
        if (owner && owner !== requestedAccount) {
          const current = dependencies.readSnapshot();
          if (current.savedContent !== snapshot.savedContent ||
              current.glossaryProgress !== snapshot.glossaryProgress ||
              current.checklistProgress !== snapshot.checklistProgress) {
            queued = true;
            continue;
          }
        }
        applying = true;
        try {
          queued = dependencies.applyCanonical(result.state, snapshot) || queued;
          dependencies.writeOwner(requestedAccount);
        } finally {
          applying = false;
        }
        if (!queued) dependencies.publish({ status: "synchronized" });
      } catch {
        if (disposed) return;
        if (revision !== requestedRevision) continue;
        queued = false;
        dependencies.publish({ status: "error", errorMessage: "Saved data could not be synchronized with the account." });
        return;
      }
    }
  }

  function synchronize(): Promise<void> {
    if (disposed || !accountId) return Promise.resolve();
    queued = true;
    if (!running) {
      // Defer outside an auth callback; retain one promise for requests queued during a pass.
      running = Promise.resolve().then(async () => {
        try {
          do { await drain(); } while (!disposed && accountId && queued);
        } finally {
          running = undefined;
        }
      });
    }
    return running;
  }

  return {
    setAccount(nextAccountId: string | undefined) {
      if (disposed || accountId === nextAccountId) return false;
      accountId = nextAccountId;
      revision++;
      queued = Boolean(nextAccountId);
      if (!nextAccountId) dependencies.publish({ status: "inactive" });
      return true;
    },
    synchronize,
    deviceChanged() {
      if (!applying) void synchronize();
    },
    dispose() {
      disposed = true;
      revision++;
      accountId = undefined;
      queued = false;
    },
  };
}
