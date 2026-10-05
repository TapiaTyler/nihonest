import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { faqSchema } from "@/domain/faq/faq";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { viewModeStorageKey } from "@/lib/storage/view-mode";
import { FaqExplorer } from "./faq-explorer";
import { FaqResult } from "./faq-result";

const faq = faqSchema.parse({
  id: "phone-or-bank-first",
  slug: "phone-or-bank-first",
  question: "Should I get a Japanese phone number or bank account first?",
  summary: "Provider requirements vary.",
  primaryBrowseGroupId: "arrival-and-daily-life",
  relatedArticleIds: ["guide"],
  status: "needs-review",
  createdAt: "2026-09-06",
  updatedAt: "2026-09-06",
});
const entry = {
  faq,
  targets: [{ kind: "guide" as const, id: "guide", label: "Canonical guide", href: "/articles/guide" }],
};
const translation = {
  contentId: faq.id,
  targetLocale: "ja",
  question: "日本の電話番号と銀行口座は、どちらを先に取得すべきですか？",
  summary: "事業者によって要件が異なります。",
};

describe("FAQ localization", () => {
  beforeEach(() => window.localStorage.clear());

  it("presents and searches current Japanese FAQ fields", () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    render(
      <ContentLocaleProvider>
        <FaqExplorer entries={[entry]} translations={[translation]} />
      </ContentLocaleProvider>,
    );

    expect(screen.getByRole("heading", { name: translation.question })).toBeInTheDocument();
    expect(screen.getByText(translation.summary)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ガイド: Canonical guide/ })).toBeInTheDocument();
    const search = screen.getByRole("searchbox", { name: "何について確認したいですか？" });
    fireEvent.change(search, { target: { value: "銀行口座" } });
    fireEvent.blur(search);
    expect(screen.getByRole("heading", { name: translation.question })).toBeInTheDocument();
  });

  it("uses a Japanese target label and marks an untranslated activity name as English", () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    const localizedTargetsEntry = {
      ...entry,
      targets: [
        { ...entry.targets[0], japaneseLabel: "永住許可の案内" },
        { kind: "activity" as const, id: "take-or-change-work", label: "Take or change work", href: "/can-i-do-this" },
      ],
    };

    render(
      <ContentLocaleProvider>
        <FaqResult entry={localizedTargetsEntry} />
      </ContentLocaleProvider>,
    );

    const guideLink = screen.getByRole("link", { name: "ガイド: 永住許可の案内" });
    expect(guideLink).toHaveAttribute("lang", "ja");
    const activityLink = screen.getByRole("link", { name: "活動を確認: Take or change work" });
    expect(activityLink).toHaveAttribute("lang", "ja");
    expect(screen.getByText("Take or change work").closest("span")).toHaveAttribute("lang", "en");
  });
});

describe("FAQ disclosure and list view", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/faq");
  });

  it("shows only the question until opened, then the answer and related guidance", () => {
    const { container } = render(<FaqResult entry={entry} />);
    const details = container.querySelector("details")!;
    expect(details.open).toBe(false);
    expect(screen.getByRole("heading", { name: faq.question })).toBeInTheDocument();
    fireEvent.click(container.querySelector("summary")!);
    details.open = true;
    fireEvent(details, new Event("toggle"));
    expect(details.open).toBe(true);
    expect(screen.getByText("Provider requirements vary.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Canonical guide/ })).toHaveAttribute("href", "/articles/guide");
  });

  it("opens the question a #faq- link points to", () => {
    window.history.replaceState(null, "", `/faq#faq-${faq.slug}`);
    const { container } = render(<FaqResult entry={entry} />);
    expect(container.querySelector("details")!.open).toBe(true);
  });

  it("offers a list view remembered for the FAQ page only", () => {
    const { container, unmount } = render(
      <ContentLocaleProvider>
        <FaqExplorer entries={[entry]} />
      </ContentLocaleProvider>,
    );
    expect(container.querySelector("li details")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "List" }));
    expect(container.querySelector("li details")).not.toBeNull();
    expect(window.localStorage.getItem(viewModeStorageKey("faq"))).toBe("list");
    expect(window.localStorage.getItem(viewModeStorageKey("explore"))).toBeNull();
    unmount();
    render(<ContentLocaleProvider><FaqExplorer entries={[entry]} /></ContentLocaleProvider>);
    expect(screen.getByRole("button", { name: "List" })).toHaveAttribute("aria-pressed", "true");
  });
});
