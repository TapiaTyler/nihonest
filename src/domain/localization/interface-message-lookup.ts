import { englishInterfaceMessages, type InterfaceMessageId } from "./interface-message-catalogs/english";

/**
 * Lookup rules shared by the server (both catalogs loaded) and the client (Japanese loaded on demand). A missing
 * catalog means it has not loaded yet, and English is shown until it does.
 */

export type InterfaceMessageCatalog = Readonly<Record<InterfaceMessageId, string>>;

export function interfaceMessageText(catalog: InterfaceMessageCatalog | undefined, id: InterfaceMessageId): string {
  return catalog?.[id] ?? englishInterfaceMessages[id];
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
