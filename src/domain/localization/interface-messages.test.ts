import { describe, expect, it } from "vitest";
import { englishInterfaceMessages } from "./interface-message-catalogs/english";
import { japaneseInterfaceMessages } from "./interface-message-catalogs/japanese";
import { fillInterfaceMessage, interfaceMessageText, serviceMessageId } from "./interface-message-lookup";
import { getInterfaceMessage, localizeServiceMessage } from "./interface-messages";

describe("interface messages", () => {
  it("provides stable English and Japanese labels through the same IDs", () => {
    expect(getInterfaceMessage("en", "navigation.explore")).toBe("Explore");
    expect(getInterfaceMessage("ja", "navigation.explore")).toBe("ガイドを探す");
    expect(getInterfaceMessage("ja", "translation.machineTitle")).toBe("機械翻訳された日本語");
  });

  it("localizes known English service messages and passes unknown text through", () => {
    expect(localizeServiceMessage("ja", "Choose a reminder time in the future.")).toBe("リマインダーの日時は、これから先の日時を選んでください。");
    expect(localizeServiceMessage("en", "Choose a reminder time in the future.")).toBe("Choose a reminder time in the future.");
    expect(localizeServiceMessage("ja", "An unexpected provider error")).toBe("An unexpected provider error");
  });
});

describe("interface message catalogs", () => {
  it("falls back to English while a catalog is still loading", () => {
    expect(interfaceMessageText(undefined, "navigation.explore")).toBe("Explore");
    expect(interfaceMessageText(japaneseInterfaceMessages, "navigation.explore")).toBe("ガイドを探す");
  });

  it("keeps the Japanese catalog complete and non-empty for every English key", () => {
    const englishKeys = Object.keys(englishInterfaceMessages).sort();
    expect(Object.keys(japaneseInterfaceMessages).sort()).toEqual(englishKeys);
    for (const key of englishKeys) expect(japaneseInterfaceMessages[key as keyof typeof japaneseInterfaceMessages].trim()).not.toBe("");
  });

  it("maps only known service messages and fills placeholders", () => {
    expect(serviceMessageId("Choose a reminder time in the future.")).toBe("service.reminderPast");
    expect(serviceMessageId("toString")).toBeUndefined();
    expect(fillInterfaceMessage("{count} of {total}", { count: 3 })).toBe("3 of {total}");
  });
});
