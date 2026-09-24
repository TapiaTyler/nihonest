import { storedValue } from "./key-value-store";

const journeyUpdateNotice = storedValue("nihonest:journey-update-notice", "session");

export const journeyUpdateNoticeMessage = "Your journey has been updated. Future critical updates will follow your new route. Existing reminders and saved guidance were kept.";

/** Queues a one-time, non-sensitive confirmation for the destination page. */
export function queueJourneyUpdateNotice(): void {
  journeyUpdateNotice.write(journeyUpdateNoticeMessage);
}

export function clearJourneyUpdateNotice(): void {
  journeyUpdateNotice.write(null);
}

export const getJourneyUpdateNoticeSnapshot = (): string | null => journeyUpdateNotice.read();
export const subscribeToJourneyUpdateNotice = journeyUpdateNotice.subscribe;
