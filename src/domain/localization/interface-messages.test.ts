import { describe, expect, it } from "vitest";
import { englishInterfaceMessages } from "./interface-message-catalogs/english";
import { japaneseInterfaceMessages } from "./interface-message-catalogs/japanese";
import { fillInterfaceMessage, interfaceMessageGroup, interfaceMessageText, serviceMessageId } from "./interface-message-lookup";
import { getInterfaceMessage, getInterfaceMessageGroup, localizeServiceMessage } from "./interface-messages";

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

describe("interface message groups", () => {
  it("selects one prefix with English fallback for missing ids", () => {
    const map = getInterfaceMessageGroup("ja", "finder.map.");
    expect(Object.keys(map).every((id) => id.startsWith("finder.map."))).toBe(true);
    expect(map["finder.map.summary"]).toBe("日本の都道府県地図");
    const partial = { ...japaneseInterfaceMessages, "regionMap.map": undefined } as unknown as typeof japaneseInterfaceMessages;
    expect(interfaceMessageGroup(partial, "regionMap.")["regionMap.map"]).toBe("Map of Japan's regions");
    expect(Object.keys(getInterfaceMessageGroup("en", "finder."))).toContain("finder.map.zoomLevel");
  });

  it("uses only placeholders that the English message supplies", () => {
    const placeholders = (text: string) => new Set(text.match(/\{\w+\}/g) ?? []);
    for (const [id, english] of Object.entries(englishInterfaceMessages)) {
      const supplied = placeholders(english);
      for (const name of placeholders(japaneseInterfaceMessages[id as keyof typeof japaneseInterfaceMessages])) expect(supplied, id).toContain(name);
    }
  });

  it("fills finder templates in each language's word order", () => {
    const names = { en: "Tokyo", ja: "東京都" };
    expect(fillInterfaceMessage(getInterfaceMessage("en", "finder.map.selectPrefecture"), names)).toBe("Select Tokyo (東京都)");
    expect(fillInterfaceMessage(getInterfaceMessage("ja", "finder.map.selectPrefecture"), names)).toBe("東京都を選択");
    expect(fillInterfaceMessage(getInterfaceMessage("en", "finder.map.zoomLevel"), { level: "1.5" })).toBe("Map zoom: 1.5×.");
    expect(fillInterfaceMessage(getInterfaceMessage("ja", "finder.wardNote"), { city: "名古屋市" })).toMatch(/^名古屋市は区に分かれています。/);
  });
});
