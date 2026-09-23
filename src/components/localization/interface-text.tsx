"use client";

import { getInterfaceMessage, localizeServiceMessage, type InterfaceMessageId } from "@/domain/localization/interface-messages";
import { defaultContentLocale } from "@/domain/localization/content-locale";
import { useOptionalContentLocale } from "./content-locale-provider";

export function useInterfaceMessages() {
  const locale = useOptionalContentLocale()?.locale ?? defaultContentLocale;
  return {
    locale,
    message: (id: InterfaceMessageId) => getInterfaceMessage(locale, id),
    /** Fills `{name}` placeholders so word order can differ between languages. */
    format: (id: InterfaceMessageId, values: Readonly<Record<string, string | number>>) =>
      getInterfaceMessage(locale, id).replace(/\{(\w+)\}/g, (placeholder, name: string) => String(values[name] ?? placeholder)),
    /** Localizes a known English service or API message; unknown text is shown unchanged. */
    serviceMessage: (text: string | undefined) => (text === undefined ? undefined : localizeServiceMessage(locale, text)),
  };
}

/**
 * A message with `{name}` placeholders for server components. `japaneseValues` supplies translated values
 * (e.g. a Japanese journey title); any value it lacks falls back to the English one.
 */
export function InterfaceFormat({ id, values, japaneseValues }: Readonly<{
  id: InterfaceMessageId;
  values: Readonly<Record<string, string | number>>;
  japaneseValues?: Readonly<Record<string, string | number | undefined>>;
}>) {
  const { locale, format } = useInterfaceMessages();
  const localizedValues = locale === "ja" && japaneseValues
    ? Object.fromEntries(Object.entries(values).map(([name, value]) => [name, japaneseValues[name] ?? value]))
    : values;
  return format(id, localizedValues);
}

/** Content text such as a title: the Japanese version when Japanese is selected and one exists, otherwise English. */
export function LocalizedText({ english, japanese }: Readonly<{ english: string; japanese?: string }>) {
  const { locale } = useInterfaceMessages();
  return locale === "ja" && japanese ? <span lang="ja">{japanese}</span> : english;
}

/** Keeps otherwise-static server components outside the client bundle while localizing short UI text. */
export function InterfaceText({ id }: Readonly<{ id: InterfaceMessageId }>) {
  const { message } = useInterfaceMessages();
  return message(id);
}
