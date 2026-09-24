"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { emptyAccountContentState, type AccountContentState } from "@/domain/sync/account-content-state";
import { getChecklistProgressSnapshot, readChecklistProgress, subscribeToChecklistProgress, writeChecklistProgress } from "@/lib/storage/checklist-progress";
import { getGlossaryStudySnapshot, readGlossaryStudyProgress, subscribeToGlossaryStudy, writeGlossaryStudyProgress } from "@/lib/storage/glossary-study";
import { readAccountContentOwner, writeAccountContentOwner } from "@/lib/storage/account-content-owner";
import { getSavedContentSnapshot, readSavedContent, subscribeToSavedContent, writeSavedContent } from "@/lib/storage/saved-content";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { synchronizeAccountContent } from "@/lib/sync/account-content-sync";
import type { Database } from "@/types/database";

type AccountContentSyncStatus = "inactive" | "synchronizing" | "synchronized" | "error";

type AccountContentSyncContextValue = Readonly<{
  status: AccountContentSyncStatus;
  errorMessage?: string;
  retry: () => void;
}>;

type DeviceSnapshot = Readonly<{
  savedContent: string;
  glossaryProgress: string;
  checklistProgress: string;
}>;

const AccountContentSyncContext = createContext<AccountContentSyncContextValue | undefined>(undefined);

function readDeviceState(): AccountContentState {
  return {
    savedContent: [...readSavedContent()],
    glossaryProgress: [...readGlossaryStudyProgress()],
    checklistProgress: [...readChecklistProgress()],
  };
}

function getDeviceSnapshot(): DeviceSnapshot {
  return {
    savedContent: getSavedContentSnapshot(),
    glossaryProgress: getGlossaryStudySnapshot(),
    checklistProgress: getChecklistProgressSnapshot(),
  };
}

/** Applies only record families that did not change while their account request was running. */
function applyCanonicalState(state: AccountContentState, requestSnapshot: DeviceSnapshot): boolean {
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
  const [status, setStatus] = useState<AccountContentSyncStatus>("inactive");
  const [errorMessage, setErrorMessage] = useState<string>();
  const clientRef = useRef<SupabaseClient<Database> | undefined>(undefined);
  const userIdRef = useRef<string | undefined>(undefined);
  const inFlightRef = useRef(false);
  const queuedRef = useRef(false);
  const applyingAccountStateRef = useRef(false);
  const mountedRef = useRef(true);

  const runSynchronization = useCallback(async () => {
    const client = clientRef.current;
    if (!client || !userIdRef.current) return;
    if (inFlightRef.current) {
      queuedRef.current = true;
      return;
    }

    inFlightRef.current = true;
    // One pass per account. If a different account signs in during a pass, its response is discarded and the
    // next pass synchronizes the new account, all within this single in-flight run.
    let userId: string | undefined = userIdRef.current;
    while (userId) {
      let synchronizationFailed = false;
      do {
        queuedRef.current = false;
        if (mountedRef.current) {
          setStatus("synchronizing");
          setErrorMessage(undefined);
        }

        const requestSnapshot = getDeviceSnapshot();
        // A cache belonging to another account must never be imported into the current account.
        const contentOwner = readAccountContentOwner();
        const deviceState = contentOwner && contentOwner !== userId
          ? emptyAccountContentState
          : readDeviceState();
        const result = await synchronizeAccountContent(client, deviceState);

        if (!result.ok) {
          synchronizationFailed = true;
          if (mountedRef.current) {
            setStatus("error");
            setErrorMessage(result.message);
          }
          break;
        }
        // An account change during the request invalidates its response for this browser cache.
        if (userIdRef.current !== userId) break;

        applyingAccountStateRef.current = true;
        queuedRef.current = applyCanonicalState(result.state, requestSnapshot) || queuedRef.current;
        writeAccountContentOwner(userId);
        applyingAccountStateRef.current = false;
      } while (queuedRef.current && userIdRef.current === userId);

      if (mountedRef.current && userIdRef.current === userId && !synchronizationFailed) setStatus("synchronized");
      const nextUserId: string | undefined = userIdRef.current;
      userId = mountedRef.current && nextUserId && nextUserId !== userId ? nextUserId : undefined;
    }
    inFlightRef.current = false;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const client = getSupabaseBrowserClient();
    if (!client) return () => { mountedRef.current = false; };
    clientRef.current = client;

    function activateAccount(userId: string | undefined) {
      if (userIdRef.current === userId) return;
      userIdRef.current = userId;
      if (!userId) {
        setStatus("inactive");
        setErrorMessage(undefined);
        return;
      }
      queueMicrotask(() => { if (mountedRef.current) void runSynchronization(); });
    }

    const handleDeviceChange = () => {
      if (!applyingAccountStateRef.current && userIdRef.current) void runSynchronization();
    };
    const unsubscribeSaved = subscribeToSavedContent(handleDeviceChange);
    const unsubscribeGlossary = subscribeToGlossaryStudy(handleDeviceChange);
    const unsubscribeChecklist = subscribeToChecklistProgress(handleDeviceChange);
    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
      activateAccount(session?.user.id);
    });
    void client.auth.getUser().then(({ data }) => activateAccount(data.user?.id));

    return () => {
      mountedRef.current = false;
      unsubscribeSaved();
      unsubscribeGlossary();
      unsubscribeChecklist();
      authListener.subscription.unsubscribe();
    };
  }, [runSynchronization]);

  const value = useMemo<AccountContentSyncContextValue>(() => ({
    status,
    errorMessage,
    retry: () => { void runSynchronization(); },
  }), [errorMessage, runSynchronization, status]);

  return <AccountContentSyncContext.Provider value={value}>{children}</AccountContentSyncContext.Provider>;
}

export function useAccountContentSync(): AccountContentSyncContextValue {
  const context = useContext(AccountContentSyncContext);
  if (!context) throw new Error("useAccountContentSync must be used within AccountContentSyncProvider.");
  return context;
}
