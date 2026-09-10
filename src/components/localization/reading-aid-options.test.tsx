import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { readingAidStorageKey } from "@/lib/storage/reading-aid";
import { JapaneseReading } from "./japanese-reading";
import { ReadingAidOptions } from "./reading-aid-options";
import { ReadingAidProvider } from "./reading-aid-provider";

describe("reading aid preference", () => {
  beforeEach(() => window.localStorage.clear());

  it("defaults to both readings and persists a new presentation", async () => {
    render(
      <ReadingAidProvider>
        <ReadingAidOptions />
        <p><JapaneseReading kana="ざいりゅうしかく" romaji="zairyū shikaku" /></p>
      </ReadingAidProvider>,
    );

    expect(screen.getByRole("radio", { name: "Both" })).toHaveAttribute("aria-checked", "true");
    fireEvent.click(screen.getByRole("radio", { name: "Kana" }));
    expect(window.localStorage.getItem(readingAidStorageKey)).toBe("kana");
    await waitFor(() => expect(document.documentElement).toHaveAttribute("data-reading-aid", "kana"));
    expect(screen.getByText("ざいりゅうしかく")).toHaveAttribute("data-reading-aid-kana");
    expect(screen.getByText("zairyū shikaku")).toHaveAttribute("data-reading-aid-romaji");
  });
});
