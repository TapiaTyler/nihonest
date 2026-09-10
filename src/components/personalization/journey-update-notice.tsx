"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  clearJourneyUpdateNotice,
  getJourneyUpdateNoticeSnapshot,
  subscribeToJourneyUpdateNotice,
} from "@/lib/storage/journey-update-notice";

/** Displays the route-change result after onboarding navigation without persisting it in the URL. */
export function JourneyUpdateNotice() {
  const message = useSyncExternalStore(
    subscribeToJourneyUpdateNotice,
    getJourneyUpdateNoticeSnapshot,
    () => null,
  );

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(clearJourneyUpdateNotice, 6000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;
  return (
    <div role="status" aria-live="polite" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium leading-6 text-white shadow-xl">
      {message}
    </div>
  );
}
