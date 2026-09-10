import { describe, expect, it, vi } from "vitest";
import { MemoryTranslationCache } from "./translation-cache";
import { translateContent, type TranslateContentRequest } from "./translation-service";
import type { TranslationProvider } from "./translation-provider";

const request: TranslateContentRequest = {
  contentKind: "article",
  contentId: "visa-and-status-of-residence-explained",
  sourceRevision: "a".repeat(64),
  terminologyRevision: "b".repeat(64),
  promptRevision: "d".repeat(64),
  targetLocale: "es",
  fields: {
    title: "Visa and status of residence",
    "body.introduction": "A status of residence (在留資格 / ざいりゅうしかく / zairyū shikaku) controls permitted activity.",
  },
  protectedTerms: [
    { id: "zairyu-shikaku-japanese", value: "在留資格", kind: "japanese" },
    { id: "zairyu-shikaku-kana", value: "ざいりゅうしかく", kind: "kana" },
    { id: "zairyu-shikaku-romaji", value: "zairyū shikaku", kind: "romaji" },
    { id: "status-of-residence", value: "status of residence", replacement: "在留資格", kind: "official-name" },
  ],
  generatedAt: "2026-09-09T00:00:00.000Z",
};

function fakeProvider(transform: (text: string) => string = (text) => `ES: ${text}`) {
  const translate = vi.fn<TranslationProvider["translate"]>(async ({ segments }) => (
    segments.map((segment) => ({ ...segment, text: transform(segment.text) }))
  ));
  return { provider: { id: "test-provider", model: "test-model", translate }, translate } as const;
}

describe("cached translation service", () => {
  it("protects Japanese terminology and reuses the generated artifact", async () => {
    const cache = new MemoryTranslationCache();
    const { provider, translate } = fakeProvider();

    const first = await translateContent(request, provider, cache);
    const second = await translateContent(request, provider, cache);

    expect(first.cacheStatus).toBe("miss");
    expect(second.cacheStatus).toBe("hit");
    expect(translate).toHaveBeenCalledOnce();
    expect(first.artifact.fields["body.introduction"]).toContain("在留資格 / ざいりゅうしかく / zairyū shikaku");
    expect(first.artifact.fields["body.introduction"]).toContain("A 在留資格");
  });

  it("invalidates the lookup when canonical content changes", async () => {
    const cache = new MemoryTranslationCache();
    const { provider, translate } = fakeProvider();
    await translateContent(request, provider, cache);
    await translateContent({ ...request, sourceRevision: "c".repeat(64) }, provider, cache);
    expect(translate).toHaveBeenCalledTimes(2);
  });

  it("fails closed when a provider alters a protected placeholder", async () => {
    const cache = new MemoryTranslationCache();
    const { provider } = fakeProvider((text) => text.replace("[[NH-PROTECTED-0]]", "translated-away"));
    await expect(translateContent(request, provider, cache)).rejects.toThrow("changed protected terminology placeholders");
  });

  it("rejects canonical English as a generated translation target", async () => {
    const { provider } = fakeProvider();
    await expect(translateContent({ ...request, targetLocale: "en-US" }, provider, new MemoryTranslationCache()))
      .rejects.toThrow("Canonical English content does not require translation");
  });
});
