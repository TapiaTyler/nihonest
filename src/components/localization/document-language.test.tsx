import { render } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "./content-locale-provider";
import { contentLocaleStorageKey, writeContentLocale } from "@/lib/storage/content-locale";

describe("document language", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "en";
  });

  it("follows the selected language so Japanese typography and screen readers apply", () => {
    localStorage.setItem(contentLocaleStorageKey, "ja");
    render(<ContentLocaleProvider><p>text</p></ContentLocaleProvider>);
    expect(document.documentElement.lang).toBe("ja");

    act(() => writeContentLocale("en"));
    expect(document.documentElement.lang).toBe("en");
  });

  it("stays English by default", () => {
    render(<ContentLocaleProvider><p>text</p></ContentLocaleProvider>);
    expect(document.documentElement.lang).toBe("en");
  });
});
