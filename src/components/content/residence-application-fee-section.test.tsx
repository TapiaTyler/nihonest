import { render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as translations from "@/lib/content/article-component-translations";
import { residenceApplicationFees } from "@/data/residence-application-fees";
import { ResidenceApplicationFeeSection } from "./residence-application-fee-section";

describe("ResidenceApplicationFeeSection", () => {
  it("renders the canonical schedule in English", () => {
    render(<ResidenceApplicationFeeSection locale="en" />);
    const table = screen.getByRole("table", { name: /change-of-status and extension fees/i });
    expect(within(table).getAllByRole("row")).toHaveLength(residenceApplicationFees.currentSchedule.bands.length + 1);
    expect(within(table).getByText("JPY 65,550")).toBeInTheDocument();
  });

  it("renders the same canonical schedule with Japanese labels", () => {
    render(<ResidenceApplicationFeeSection locale="ja" />);
    const table = screen.getByRole("table", { name: /在留資格変更および在留期間更新/ });
    expect(within(table).getAllByRole("row")).toHaveLength(residenceApplicationFees.currentSchedule.bands.length + 1);
    expect(within(table).getByText("65,550円")).toBeInTheDocument();
    expect(screen.getByText(/@service-dgft\.com/)).toBeInTheDocument();
  });

  afterEach(() => vi.restoreAllMocks());

  it("renders the whole section in English, marked as English, when the Japanese copy is unavailable", () => {
    vi.spyOn(translations, "selectArticleComponentTranslation").mockReturnValue(undefined);
    const fallback = renderToStaticMarkup(<ResidenceApplicationFeeSection locale="ja" />);
    // Only the heading ID keeps the requested locale; every word, amount, and date is the English rendering.
    expect(fallback.replaceAll("residence-application-fees-ja", "residence-application-fees-en")).toBe(renderToStaticMarkup(<ResidenceApplicationFeeSection locale="en" />));
    expect(fallback).toContain('lang="en"');
  });
});
