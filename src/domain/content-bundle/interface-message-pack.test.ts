import { describe, expect, it } from "vitest";
import { englishInterfaceMessages } from "@/domain/localization/interface-message-catalogs/english";
import { japaneseInterfaceMessages } from "@/domain/localization/interface-message-catalogs/japanese";
import { englishInterfaceMessagePackSchema, interfaceMessagePackPairSchema, interfaceMessagePackSchema, japaneseInterfaceMessagePackSchema } from "./interface-message-pack";

const english = (messages: Record<string, string>) => ({ kind: "catalog", id: "interface-messages", locale: "en", messages });
const japanese = (messages: Record<string, string>) => ({ kind: "catalog", id: "interface-messages", locale: "ja", reviewState: "machine-translated", messages });
const pair = (en: Record<string, string>, ja: Record<string, string>) => ({ english: english(en), japanese: japanese(ja) });

describe("interface message catalog packs", () => {
  it("accepts both complete canonical catalogs without changing any key, value or order", () => {
    const input = pair(englishInterfaceMessages, japaneseInterfaceMessages);
    const parsed = interfaceMessagePackPairSchema.parse(input);
    expect(parsed).toEqual(input);
    expect(JSON.stringify(parsed.english.messages)).toBe(JSON.stringify(input.english.messages));
    expect(JSON.stringify(parsed.japanese.messages)).toBe(JSON.stringify(input.japanese.messages));
    expect(Object.keys(parsed.english.messages)).toEqual(Object.keys(englishInterfaceMessages));
    expect(parsed.japanese.messages["finder.nationalGuide.address"]).toBe(japaneseInterfaceMessages["finder.nationalGuide.address"]);
  });

  it("preserves camelCase IDs and untrimmed values", () => {
    const input = pair({ "finder.map.attributionSource": " Source \n" }, { "finder.map.attributionSource": " 出典 \n" });
    expect(interfaceMessagePackPairSchema.parse(input)).toEqual(input);
  });

  it("requires pack identity and supported locales", () => {
    for (const change of [{ kind: "catalog-translations" }, { id: "other" }, { locale: "fr" }]) {
      expect(interfaceMessagePackSchema.safeParse({ ...english({ label: "Text" }), ...change }).success).toBe(false);
    }
  });

  it("requires machine-translated Japanese without claiming currency or human review", () => {
    const pack = japanese({ label: "案内" });
    expect(japaneseInterfaceMessagePackSchema.safeParse({ ...pack, reviewState: undefined }).success).toBe(false);
    expect(japaneseInterfaceMessagePackSchema.safeParse({ ...pack, reviewState: "human-reviewed" }).success).toBe(false);
    for (const metadata of [{ sourceRevision: "a".repeat(64) }, { generator: "invented" }, { generatedAt: "2026-10-04T00:00:00.000Z" }]) {
      expect(japaneseInterfaceMessagePackSchema.safeParse({ ...pack, ...metadata }).success).toBe(false);
    }
    expect(englishInterfaceMessagePackSchema.safeParse({ ...english({ label: "Text" }), reviewState: "machine-translated" }).success).toBe(false);
  });

  it("rejects empty catalogs and blank IDs or values", () => {
    const cases: Record<string, string>[] = [{}, { "": "Text" }, { " ": "Text" }, { label: "" }, { label: "\n\t " }];
    for (const messages of cases) {
      expect(englishInterfaceMessagePackSchema.safeParse(english(messages)).success).toBe(false);
    }
  });

  it("rejects missing, extra and same-count substituted Japanese keys", () => {
    const cases: Record<string, string>[] = [{ first: "一" }, { first: "一", second: "二", third: "三" }, { first: "一", third: "三" }];
    for (const ja of cases) {
      expect(interfaceMessagePackPairSchema.safeParse(pair({ first: "One", second: "Two" }, ja)).success).toBe(false);
    }
  });

  it("allows reordered, repeated and omitted English placeholders", () => {
    for (const text of ["{ja} ({en})", "{ja} {ja}", "案内"]) {
      expect(interfaceMessagePackPairSchema.safeParse(pair({ label: "{en} ({ja})" }, { label: text })).success).toBe(true);
    }
  });

  it("rejects placeholders that English cannot supply, including on only one message", () => {
    expect(interfaceMessagePackPairSchema.safeParse(pair({ a: "{name}", b: "Fixed" }, { a: "{name}", b: "{name}" })).success).toBe(false);
    expect(interfaceMessagePackPairSchema.safeParse(pair({ label: "{name}" }, { label: "{other}" })).success).toBe(false);
    expect(interfaceMessagePackPairSchema.safeParse(pair({ label: "Text" }, { label: "{level_2}" })).success).toBe(false);
  });

  it("uses the web's case-sensitive word placeholder grammar", () => {
    expect(interfaceMessagePackPairSchema.safeParse(pair({ label: "{Name}" }, { label: "{name}" })).success).toBe(false);
    expect(interfaceMessagePackPairSchema.safeParse(pair({ label: "Text" }, { label: "{hyphen-name} {日本語}" })).success).toBe(true);
  });

  it("rejects unknown pair and pack metadata", () => {
    expect(interfaceMessagePackPairSchema.safeParse({ ...pair({ label: "Text" }, { label: "案内" }), currency: "current" }).success).toBe(false);
    expect(interfaceMessagePackSchema.safeParse({ ...english({ label: "Text" }), accountId: "private" }).success).toBe(false);
  });
});
