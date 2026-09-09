"use client";

import type { User } from "@supabase/supabase-js";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  signOut,
  type AccountOperationResult,
} from "@/lib/accounts/client-account-service";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AccountSessionState =
  | Readonly<{ status: "loading" | "signed-out"; userId?: undefined; displayName?: undefined }>
  | Readonly<{ status: "signed-in"; userId: string; displayName?: string }>;

type AccountSessionContextValue = AccountSessionState & Readonly<{
  endSession: () => Promise<AccountOperationResult>;
  updateDisplayName: (displayName: string) => void;
}>;

const AccountSessionContext = createContext<AccountSessionContextValue | undefined>(undefined);

export function AccountSessionProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [session, setSession] = useState<AccountSessionState>({ status: "loading" });
  const requestIdRef = useRef(0);

  const loadAccountSummary = useCallback(async (user: User | null) => {
    const requestId = ++requestIdRef.current;
    if (!user) {
      setSession({ status: "signed-out" });
      return;
    }

    const client = getSupabaseBrowserClient();
    if (!client) {
      setSession({ status: "signed-out" });
      return;
    }

    const { data } = await client
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .maybeSingle();
    if (requestId !== requestIdRef.current) return;

    setSession({
      status: "signed-in",
      userId: user.id,
      displayName: data?.display_name ?? undefined,
    });
  }, []);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      let active = true;
      queueMicrotask(() => { if (active) setSession({ status: "signed-out" }); });
      return () => { active = false; };
    }

    let active = true;
    const activate = (user: User | null) => {
      if (active) void loadAccountSummary(user);
    };
    const { data: authListener } = client.auth.onAuthStateChange((_event, nextSession) => {
      // Defer database access until Supabase has finished notifying auth listeners.
      queueMicrotask(() => activate(nextSession?.user ?? null));
    });
    void client.auth.getUser().then(({ data }) => activate(data.user));

    return () => {
      active = false;
      requestIdRef.current += 1;
      authListener.subscription.unsubscribe();
    };
  }, [loadAccountSummary]);

  const endSession = useCallback(async () => {
    const result = await signOut();
    if (result.ok) {
      requestIdRef.current += 1;
      setSession({ status: "signed-out" });
    }
    return result;
  }, []);

  const updateDisplayName = useCallback((displayName: string) => {
    setSession((current) => current.status === "signed-in"
      ? { ...current, displayName: displayName.trim() || undefined }
      : current);
  }, []);

  const value = useMemo<AccountSessionContextValue>(() => ({
    ...session,
    endSession,
    updateDisplayName,
  }), [endSession, session, updateDisplayName]);

  return <AccountSessionContext.Provider value={value}>{children}</AccountSessionContext.Provider>;
}

export function useAccountSession(): AccountSessionContextValue {
  const context = useContext(AccountSessionContext);
  if (!context) throw new Error("useAccountSession must be used within AccountSessionProvider.");
  return context;
}
