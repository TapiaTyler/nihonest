import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { LocalizedDocumentTitle } from "./localized-document-title";

describe("LocalizedDocumentTitle", () => {
  afterEach(() => window.localStorage.removeItem(contentLocaleStorageKey));

  it("leaves the English metadata title alone by default", () => {
    document.title = "Residence Statuses | Nihonest";
    render(<ContentLocaleProvider><LocalizedDocumentTitle japanese="在留資格 | Nihonest" /></ContentLocaleProvider>);
    expect(document.title).toBe("Residence Statuses | Nihonest");
  });

  it("applies the Japanese title and reapplies it when streamed metadata writes English later", async () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    document.title = "Residence Statuses | Nihonest";
    render(<ContentLocaleProvider><LocalizedDocumentTitle japanese="在留資格 | Nihonest" /></ContentLocaleProvider>);
    await waitFor(() => expect(document.title).toBe("在留資格 | Nihonest"));

    document.title = "Residence Statuses | Nihonest";
    await waitFor(() => expect(document.title).toBe("在留資格 | Nihonest"));
  });
});
