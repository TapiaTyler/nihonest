import { describe, expect, it } from "vitest";
import { glossaryTermGloss, glossaryTermName } from "@/domain/glossary/term-display";

const term = { japanese: "在留カード", englishName: "Residence Card", kana: "ざいりゅうカード", romaji: "zairyū kādo" };

describe("glossaryTermGloss", () => {
  it("uses the English name for English readers", () => {
    expect(glossaryTermGloss(term, "en")).toEqual({ text: "Residence Card", kind: "name" });
  });

  it("uses the reading for Japanese readers, and nothing when the reading repeats the term", () => {
    expect(glossaryTermGloss(term, "ja")).toEqual({ text: "ざいりゅうカード", lang: "ja", kind: "reading" });
    expect(glossaryTermGloss({ ...term, japanese: "マイナポータル", kana: "マイナポータル" }, "ja")).toBeUndefined();
  });

  it("uses a translated name for other languages, falling back to English marked as English", () => {
    expect(glossaryTermGloss(term, "vi", "Thẻ cư trú")).toEqual({ text: "Thẻ cư trú", lang: "vi", kind: "name" });
    expect(glossaryTermGloss(term, "vi")).toEqual({ text: "Residence Card", lang: "en", kind: "name" });
  });

  it("names the term for English and other readers, but not for Japanese readers, where the term is the name", () => {
    expect(glossaryTermName(term, "en")).toEqual({ text: "Residence Card", kind: "name" });
    expect(glossaryTermName(term, "ja")).toBeUndefined();
    expect(glossaryTermName(term, "vi")).toEqual({ text: "Residence Card", lang: "en", kind: "name" });
  });
});
