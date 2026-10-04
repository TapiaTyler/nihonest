import { englishInterfaceMessages, type InterfaceMessageId } from "./interface-message-catalogs/english";

/**
 * Lookup rules shared by the server (both catalogs loaded) and the client (Japanese loaded on demand). A missing
 * catalog means it has not loaded yet, and English is shown until it does.
 */

export type InterfaceMessageCatalog = Readonly<Record<InterfaceMessageId, string>>;

export function interfaceMessageText(catalog: InterfaceMessageCatalog | undefined, id: InterfaceMessageId): string {
  return catalog?.[id] ?? englishInterfaceMessages[id];
}

/** The messages whose ids start with `Prefix`, e.g. every `finder.` message for one client component. */
export type InterfaceMessageGroup<Prefix extends string> = Readonly<Record<Extract<InterfaceMessageId, `${Prefix}${string}`>, string>>;

/**
 * Picks one group of messages from a catalog, with English for any id the catalog lacks. Server components pass the
 * group to a client component as a prop, so the page renders in its locale without the client loading a catalog.
 */
export function interfaceMessageGroup<Prefix extends string>(catalog: InterfaceMessageCatalog | undefined, prefix: Prefix): InterfaceMessageGroup<Prefix> {
  const ids = (Object.keys(englishInterfaceMessages) as InterfaceMessageId[]).filter((id) => id.startsWith(prefix));
  return Object.fromEntries(ids.map((id) => [id, interfaceMessageText(catalog, id)])) as InterfaceMessageGroup<Prefix>;
}

/** Fills `{name}` placeholders so word order can differ between languages; unknown names are left as written. */
export function fillInterfaceMessage(template: string, values: Readonly<Record<string, string | number | undefined>>): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) => String(values[name] ?? placeholder));
}

/**
 * Canonical English messages returned by client services and account APIs, mapped to their interface keys.
 * Services keep returning English, which stays the fallback for any message not listed here.
 */
const serviceMessageIds: Readonly<Record<string, InterfaceMessageId>> = {
  "Account services are not configured in this environment.": "service.accountUnavailable",
  "The sign-in email could not be sent. Please wait and try again.": "service.signInEmailFailed",
  "Sign in with Google could not start.": "service.googleFailed",
  "Sign in with Apple could not start.": "service.appleFailed",
  "Sign in before saving preferences across devices.": "service.signInToSave",
  "Your preferences could not be saved to the account.": "service.preferencesNotSaved",
  "Display names must be 80 characters or fewer.": "service.displayNameLength",
  "Your profile could not be updated.": "service.profileNotUpdated",
  "Sign out failed. Please try again.": "service.signOutFailed",
  "Reminder services are not configured in this environment.": "service.remindersUnavailable",
  "Notification preferences could not be loaded.": "service.preferencesNotLoaded",
  "Notification preferences were returned in an unexpected format.": "service.preferencesUnexpected",
  "Choose a valid time zone before saving notification preferences.": "service.invalidTimeZone",
  "Notification preferences could not be saved.": "service.notificationNotSaved",
  "Upcoming reminders could not be loaded.": "service.remindersNotLoaded",
  "Upcoming reminders were returned in an unexpected format.": "service.remindersUnexpected",
  "Enter a title, valid date and time, and valid time zone.": "service.reminderInvalid",
  "Choose a reminder time in the future.": "service.reminderPast",
  "The reminder could not be created.": "service.reminderNotCreated",
  "The saved reminder was returned in an unexpected format.": "service.reminderUnexpected",
  "The reminder could not be cancelled.": "service.reminderNotCancelled",
  "Local saved data is invalid and was not synchronized.": "service.syncInvalidLocal",
  "Saved data could not be synchronized with the account.": "service.syncFailed",
  "The account returned saved data in an unexpected format.": "service.syncUnexpected",
  "Account services are unavailable.": "service.deleteUnavailable",
  "The account deletion request was rejected.": "service.deleteRejected",
  "Type DELETE to confirm permanent account deletion.": "service.deleteConfirmRequired",
  "Sign in before deleting the account.": "service.deleteSignIn",
  "The account could not be deleted.": "service.deleteFailed",
  "Account deletion is not configured on this server.": "service.deleteNotConfigured",
};

/** The interface key for a known English service message, if any. */
export function serviceMessageId(text: string): InterfaceMessageId | undefined {
  return Object.hasOwn(serviceMessageIds, text) ? serviceMessageIds[text] : undefined;
}
