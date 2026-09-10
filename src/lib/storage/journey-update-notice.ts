const journeyUpdateNoticeStorageKey = "nihonest:journey-update-notice";
const journeyUpdateNoticeEvent = "nihonest:journey-update-notice-changed";

export const journeyUpdateNoticeMessage = "Your journey has been updated. Future critical updates will follow your new route. Existing reminders and saved guidance were kept.";

/** Queues a one-time, non-sensitive confirmation for the destination page. */
export function queueJourneyUpdateNotice(): void {
  window.sessionStorage.setItem(journeyUpdateNoticeStorageKey, journeyUpdateNoticeMessage);
  window.dispatchEvent(new Event(journeyUpdateNoticeEvent));
}

export function clearJourneyUpdateNotice(): void {
  window.sessionStorage.removeItem(journeyUpdateNoticeStorageKey);
  window.dispatchEvent(new Event(journeyUpdateNoticeEvent));
}

export function getJourneyUpdateNoticeSnapshot(): string | null {
  return window.sessionStorage.getItem(journeyUpdateNoticeStorageKey);
}

export function subscribeToJourneyUpdateNotice(onStoreChange: () => void): () => void {
  window.addEventListener(journeyUpdateNoticeEvent, onStoreChange);
  return () => window.removeEventListener(journeyUpdateNoticeEvent, onStoreChange);
}
