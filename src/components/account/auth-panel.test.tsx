import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { AuthPanel } from "./auth-panel";

describe("AuthPanel", () => {
  afterEach(() => window.localStorage.removeItem(contentLocaleStorageKey));

  it("keeps English sign-in copy by default", () => {
    render(<AuthPanel googleEnabled={false} appleEnabled={false} initialMessageId="account.authError" initialIsError />);
    expect(screen.getByRole("heading", { name: "Sign in to your account" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send sign-in link" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("That sign-in link was invalid or expired.");
  });

  it("shows sign-in copy and the server notice in Japanese", () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    render(<ContentLocaleProvider><AuthPanel googleEnabled={false} appleEnabled={false} initialMessageId="account.deleted" /></ContentLocaleProvider>);
    expect(screen.getByRole("heading", { name: "アカウントにログイン" })).toBeInTheDocument();
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "アカウントの操作" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("アカウントと同期していたデータは完全に削除されました。");
  });
});
