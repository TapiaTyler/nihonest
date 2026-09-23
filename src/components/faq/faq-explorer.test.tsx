import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { faqSchema } from "@/domain/faq/faq";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
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

    const guideLink = screen.getByRole("link", { name: "ガイド: 永住許可の案内 →" });
    expect(guideLink).toHaveAttribute("lang", "ja");
    const activityLink = screen.getByRole("link", { name: "活動を確認: Take or change work →" });
    expect(activityLink).toHaveAttribute("lang", "ja");
    expect(screen.getByText("Take or change work").closest("span")).toHaveAttribute("lang", "en");
  });
});
