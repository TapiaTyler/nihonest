"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccountSession } from "@/components/account/account-session-provider";

/** Owns account-menu session actions shared by the desktop and mobile presentations. */
export function useSiteAccountNavigation() {
  const session = useAccountSession();
  const router = useRouter();
  const [signOutPending, setSignOutPending] = useState(false);
  const [signOutError, setSignOutError] = useState<string>();

  async function signOut(): Promise<boolean> {
    setSignOutPending(true);
    setSignOutError(undefined);
    const result = await session.endSession();
    setSignOutPending(false);
    if (!result.ok) {
      setSignOutError(result.message);
      return false;
    }
    router.refresh();
    return true;
  }

  return { session, signOut, signOutPending, signOutError };
}

export type SiteAccountNavigationState = ReturnType<typeof useSiteAccountNavigation>;
