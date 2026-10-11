import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import ErrorPage from "./error";

function renderError(retry = vi.fn()) {
  vi.spyOn(console, "error").mockImplementation(() => {});
  render(<ContentLocaleProvider><ErrorPage error={new Error("boom")} retry={retry} /></ContentLocaleProvider>);
  return retry;
}

describe("error page", () => {
  beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

  it("says the fault is not the visitor's and offers a retry and a way home", () => {
    const retry = renderError();
    expect(screen.getByRole("heading", { name: "That page didn't load." })).toBeInTheDocument();
    expect(screen.getByText(/not something you did/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: "Go to the home page" })).toHaveAttribute("href", "/");
  });

  it("is available in Japanese", async () => {
    localStorage.setItem(contentLocaleStorageKey, "ja");
    renderError();
    expect(await screen.findByRole("heading", { name: "ページを開けませんでした。" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "もう一度試す" })).toBeInTheDocument();
  });
});
