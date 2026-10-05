"use client";

import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { AccountContentState } from "@/domain/sync/account-content-state";
import { getChecklistProgressSnapshot, readChecklistProgress, subscribeToChecklistProgress, writeChecklistProgress } from "@/lib/storage/checklist-progress";
import { getGlossaryStudySnapshot, readGlossaryStudyProgress, subscribeToGlossaryStudy, writeGlossaryStudyProgress } from "@/lib/storage/glossary-study";
import { readAccountContentOwner, writeAccountContentOwner } from "@/lib/storage/account-content-owner";
import { getSavedContentSnapshot, readSavedContent, subscribeToSavedContent, writeSavedContent } from "@/lib/storage/saved-content";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { synchronizeAccountContent } from "@/lib/sync/account-content-sync";
import { createAccountContentCoordinator } from "@/lib/sync/account-content-coordinator";
import type { AccountContentSnapshot, AccountContentSyncStatus } from "@/lib/sync/account-content-sync-contract";

type AccountContentSyncContextValue = Readonly<{
  status: AccountContentSyncStatus["status"];
  errorMessage?: string;
  retry: () => void;
}>;

const AccountContentSyncContext = createContext<AccountContentSyncContextValue | undefined>(undefined);

function readDeviceState(): AccountContentState {
  return {
    savedContent: [...readSavedContent()],
    glossaryProgress: [...readGlossaryStudyProgress()],
    checklistProgress: [...readChecklistProgress()],
  };
}

function getAccountContentSnapshot(): AccountContentSnapshot {
  return {
    savedContent: getSavedContentSnapshot(),
    glossaryProgress: getGlossaryStudySnapshot(),
    checklistProgress: getChecklistProgressSnapshot(),
  };
}

/** Applies only record families that did not change while their account request was running. */
function applyCanonicalState(state: AccountContentState, requestSnapshot: AccountContentSnapshot): boolean {
  let newerDeviceChangeExists = false;

  if (getSavedContentSnapshot() === requestSnapshot.savedContent) writeSavedContent(state.savedContent);
  else newerDeviceChangeExists = true;

  if (getGlossaryStudySnapshot() === requestSnapshot.glossaryProgress) writeGlossaryStudyProgress(state.glossaryProgress);
  else newerDeviceChangeExists = true;

  if (getChecklistProgressSnapshot() === requestSnapshot.checklistProgress) writeChecklistProgress(state.checklistProgress);
  else newerDeviceChangeExists = true;

  return newerDeviceChangeExists;
}

export function AccountContentSyncProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [state, setState] = useState<AccountContentSyncStatus>({ status: "inactive" });
  const coordinatorRef = useRef<ReturnType<typeof createAccountContentCoordinator> | undefined>(undefined);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const coordinator = createAccountContentCoordinator({
      readState: readDeviceState,
      readSnapshot: getAccountContentSnapshot,
      readOwner: readAccountContentOwner,
      applyCanonical: applyCanonicalState,
      writeOwner: writeAccountContentOwner,
      synchronize: (accountId, deviceState) => synchronizeAccountContent(client, accountId, deviceState),
      publish: setState,
    });
    coordinatorRef.current = coordinator;
    let disposed = false;
    let authRevision = 0;

    function activateAccount(userId: string | undefined) {
      if (disposed) return;
      if (!coordinator.setAccount(userId)) return;
      // Auth events only notify identity; leave SDK work outside the callback.
      queueMicrotask(() => { if (!disposed) void coordinator.synchronize(); });
    }

    const handleDeviceChange = () => coordinator.deviceChanged();
    const unsubscribeSaved = subscribeToSavedContent(handleDeviceChange);
    const unsubscribeGlossary = subscribeToGlossaryStudy(handleDeviceChange);
    const unsubscribeChecklist = subscribeToChecklistProgress(handleDeviceChange);
    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
      authRevision++;
      activateAccount(session?.user.id);
    });
    const initialRevision = authRevision;
    void client.auth.getUser().then(({ data }) => {
      if (!disposed && authRevision === initialRevision) activateAccount(data.user?.id);
    }).catch(() => undefined);

    return () => {
      disposed = true;
      coordinator.dispose();
      if (coordinatorRef.current === coordinator) coordinatorRef.current = undefined;
      unsubscribeSaved();
      unsubscribeGlossary();
      unsubscribeChecklist();
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AccountContentSyncContextValue>(() => ({
    ...state,
    retry: () => { void coordinatorRef.current?.synchronize(); },
  }), [state]);

  return <AccountContentSyncContext.Provider value={value}>{children}</AccountContentSyncContext.Provider>;
}

export function useAccountContentSync(): AccountContentSyncContextValue {
  const context = useContext(AccountContentSyncContext);
  if (!context) throw new Error("useAccountContentSync must be used within AccountContentSyncProvider.");
  return context;
}
