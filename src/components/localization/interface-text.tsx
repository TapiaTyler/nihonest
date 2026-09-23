"use client";

import { getInterfaceMessage, type InterfaceMessageId } from "@/domain/localization/interface-messages";
import { defaultContentLocale } from "@/domain/localization/content-locale";
import { useOptionalContentLocale } from "./content-locale-provider";

export function useInterfaceMessages() {
  const locale = useOptionalContentLocale()?.locale ?? defaultContentLocale;
  return {
    locale,
    message: (id: InterfaceMessageId) => getInterfaceMessage(locale, id),
  };
}

/** Keeps otherwise-static server components outside the client bundle while localizing short UI text. */
export function InterfaceText({ id }: Readonly<{ id: InterfaceMessageId }>) {
  const { message } = useInterfaceMessages();
  return message(id);
}
