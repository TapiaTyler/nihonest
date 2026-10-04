import type { ContentLocalePreference } from "@/domain/localization/content-locale";
import { englishInterfaceMessages, type InterfaceMessageId } from "./interface-message-catalogs/english";
import { japaneseInterfaceMessages } from "./interface-message-catalogs/japanese";
import { fillInterfaceMessage, interfaceMessageGroup, interfaceMessageText, serviceMessageId, type InterfaceMessageCatalog, type InterfaceMessageGroup } from "./interface-message-lookup";

/**
 * Interface messages with every catalog loaded, for server components, tests, and build scripts. Client components
 * use `useInterfaceMessages()` instead, which loads the Japanese catalog only when Japanese is selected.
 * The catalogs live in `interface-message-catalogs/`, one file per locale.
 */

export type { InterfaceMessageGroup, InterfaceMessageId };

const interfaceMessages = {
  en: englishInterfaceMessages,
  ja: japaneseInterfaceMessages,
} as const satisfies Record<ContentLocalePreference, InterfaceMessageCatalog>;

export function getInterfaceMessage(locale: ContentLocalePreference, id: InterfaceMessageId): string {
  return interfaceMessageText(interfaceMessages[locale], id);
}

/** The localized form of a service or API message, or the original text when it is not a known message. */
export function localizeServiceMessage(locale: ContentLocalePreference, text: string): string {
  const id = serviceMessageId(text);
  return id ? getInterfaceMessage(locale, id) : text;
}

/** A message with `{name}` placeholders filled, for server code that cannot use the client hook. */
export function formatInterfaceMessage(locale: ContentLocalePreference, id: InterfaceMessageId, values: Readonly<Record<string, string | number>>): string {
  return fillInterfaceMessage(getInterfaceMessage(locale, id), values);
}

/** One group of messages (ids starting with `prefix`) in a locale, for a server component to pass to a client one. */
export function getInterfaceMessageGroup<Prefix extends string>(locale: ContentLocalePreference, prefix: Prefix): InterfaceMessageGroup<Prefix> {
  return interfaceMessageGroup(interfaceMessages[locale], prefix);
}
