import { describe, expect, it, vi } from "vitest";
import { officialSourceSchema } from "@/domain/source/source";
import { checkSource, createSourceSnapshot, normalizeSourceText } from "@/lib/source-monitoring/source-checker";

const source = officialSourceSchema.parse({
  id: "official-guide",
  organization: "Example Ministry",
  title: "Official guide",
  url: "https://example.go.jp/guide",
  authorityLevel: "national-government",
  language: "en",
});

describe("source normalization", () => {
  it("ignores scripts, navigation, comments, entities, and whitespace while retaining main wording", () => {
    const first = normalizeSourceText(`
      <nav>Site menu</nav><main><h1>Entry &amp; residence</h1><!-- build 10 -->
      <p>Official guidance</p><script>dynamic()</script></main>
    `, "html");
    const second = normalizeSourceText("<main><h1>Entry &amp; residence</h1><p>Official   guidance</p></main>", "html");

    expect(first).toBe("Entry & residence Official guidance");
    expect(first).toBe(second);
  });

  it("produces different fingerprints for meaningful text changes", async () => {
    const original = await createSourceSnapshot(
      new TextEncoder().encode("<main>Capital requirement: 5 million yen</main>"),
      "html",
      source.url,
      "2026-09-11T12:00:00.000Z",
    );
    const changed = await createSourceSnapshot(
      new TextEncoder().encode("<main>Capital requirement: 30 million yen</main>"),
      "html",
      source.url,
      "2026-09-11T12:00:00.000Z",
    );

    expect(changed.fingerprint).not.toBe(original.fingerprint);
  });
});

describe("source checker", () => {
  it("does not fetch sources configured for manual review", async () => {
    const fetcher = vi.fn();
    const result = await checkSource({ ...source, checkMethod: "manual" }, {
      checkedAt: "2026-09-11T12:00:00.000Z",
      fetcher,
    });

    expect(result.status).toBe("manual");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("records an HTTP failure as unavailable without a snapshot", async () => {
    const result = await checkSource(source, {
      checkedAt: "2026-09-11T12:00:00.000Z",
      fetcher: async () => new Response("Unavailable", { status: 503 }),
    });

    expect(result).toMatchObject({ status: "unavailable", httpStatus: 503 });
    expect(result.snapshot).toBeUndefined();
  });
});
