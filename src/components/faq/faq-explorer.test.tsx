import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { faqSchema } from "@/domain/faq/faq";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { FaqExplorer } from "./faq-explorer";

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
    const search = screen.getByRole("searchbox", { name: "何について確認したいですか？" });
    fireEvent.change(search, { target: { value: "銀行口座" } });
    fireEvent.blur(search);
    expect(screen.getByRole("heading", { name: translation.question })).toBeInTheDocument();
  });
});
