import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { articleMetadataSchema } from "@/domain/article/article";
import { articleGroupSchema } from "@/domain/discovery/discovery";
import { faqSchema } from "@/domain/faq/faq";
import { glossaryTerms } from "@/data/glossary";
import { residenceStatuses } from "@/data/residence-statuses";
import { ExploreDiscovery } from "./explore-discovery";
import { ActivitySearchSuggestion } from "@/components/activity-cross-reference/activity-search-suggestion";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { viewModeStorageKey } from "@/lib/storage/view-mode";
import type { ArticleGroupSearchTranslation, ArticleSearchTranslation } from "@/lib/search/knowledgebase-search";

const bankArticle = articleMetadataSchema.parse({
  id: "opening-bank-account",
  slug: "opening-bank-account",
  title: "Opening a bank account",
  description: "Prepare identity and address records for bank screening.",
  journeyStageIds: ["recently-arrived"],
  topicIds: ["banking"],
  audienceIds: ["newcomer"],
  geographicScopes: ["national"],
  importance: "important",
  contentType: "guide",
  status: "needs-review",
  createdAt: "2026-09-06",
  updatedAt: "2026-09-06",
});

const group = articleGroupSchema.parse({
  id: "arrival-essentials",
  title: "Arrival essentials",
  description: "Shared early-settlement guidance.",
  articleIds: [bankArticle.id],
});

const laterAlphabeticalGroup = articleGroupSchema.parse({
  id: "zoning-guidance",
  title: "Zoning guidance",
  description: "Example guidance that should sort after arrival guidance.",
  articleIds: [bankArticle.id],
});

const faqEntry = {
  faq: faqSchema.parse({
    id: "address-bank-loop",
    slug: "address-bank-loop",
    question: "How do I handle the address, apartment, and bank-account loop after arriving?",
    summary: "Follow the linked arrival guidance.",
    primaryBrowseGroupId: "arrival-and-daily-life",
    searchTerms: ["rent needs bank account"],
    relatedArticleIds: [bankArticle.id],
    status: "draft",
    createdAt: "2026-09-06",
    updatedAt: "2026-09-06",
  }),
  targets: [{ kind: "guide" as const, id: bankArticle.id, label: "Finding housing and moving in", href: "/articles/finding-housing-and-moving-in" }],
};

function renderDiscovery(
  articleTranslations: readonly ArticleSearchTranslation[] = [],
  groupTranslations: readonly ArticleGroupSearchTranslation[] = [],
) {
  render(
    <ContentLocaleProvider>
      <ExploreDiscovery
        groups={[group]}
        articles={[bankArticle]}
        terms={glossaryTerms}
        residenceStatuses={residenceStatuses}
        faqEntries={[faqEntry]}
        articleTranslations={articleTranslations}
        groupTranslations={groupTranslations}
      />
    </ContentLocaleProvider>,
  );
}

function enterSearch(value: string) {
  const input = screen.getByRole("searchbox");
  fireEvent.change(input, { target: { value } });
  fireEvent.blur(input);
}

describe("ExploreDiscovery", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/explore");
    sessionStorage.clear();
    window.localStorage.clear();
  });

  it("shows groups at a glance before a search is active", () => {
    renderDiscovery();

    expect(screen.getByRole("link", { name: "Explore Arrival essentials" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Opening a bank account" })).not.toBeInTheDocument();
  });

  it("uses predictable filter ordering and groups residence statuses by category", () => {
    renderDiscovery();

    expect(Array.from(screen.getByRole("combobox", { name: "Topic" }).querySelectorAll("option"), (option) => option.textContent)).toEqual([
      "All", "Banking", "Daily life", "Employment", "Healthcare", "Housing", "Immigration", "Language", "Municipal procedures", "Taxes", "Transportation",
    ]);
    expect(Array.from(screen.getByRole("combobox", { name: "Audience" }).querySelectorAll("option"), (option) => option.textContent)).toEqual([
      "All", "Newcomer", "Student", "Education provider", "Employer", "Employee", "Freelancer", "Business owner", "Spouse", "Dependent", "Parent",
    ]);
    expect(Array.from(screen.getByRole("combobox", { name: "Content type" }).querySelectorAll("option"), (option) => option.textContent)).toEqual([
      "All", "Checklist", "Glossary", "Guide", "Official procedure", "Reference",
    ]);

    const residenceStatusSelect = screen.getByRole("combobox", { name: "Residence status" });
    const categoryGroups = Array.from(residenceStatusSelect.querySelectorAll("optgroup"));
    expect(categoryGroups.map((optionGroup) => optionGroup.label)).toEqual([
      "Work", "Business and high-skill", "Study, culture, and training", "Family", "Designated activities", "Visitor", "Diplomatic and official", "Status-based residence",
    ]);
    for (const optionGroup of categoryGroups) {
      const labels = Array.from(optionGroup.querySelectorAll("option"), (option) => option.textContent ?? "");
      expect(labels).toEqual([...labels].sort((left, right) => left.localeCompare(right, "en", { sensitivity: "base" })));
    }
  });

  it("alphabetizes the default content-group cards", () => {
    render(
      <ContentLocaleProvider>
        <ExploreDiscovery
          groups={[laterAlphabeticalGroup, group]}
          articles={[bankArticle]}
          terms={glossaryTerms}
          residenceStatuses={residenceStatuses}
          faqEntries={[faqEntry]}
        />
      </ContentLocaleProvider>,
    );

    expect(screen.getAllByRole("link", { name: /^Explore / }).map((link) => link.getAttribute("aria-label"))).toEqual([
      "Explore Arrival essentials",
      "Explore Zoning guidance",
    ]);
  });

  it("returns individual articles without opening a group", () => {
    renderDiscovery();
    enterSearch("bank account");

    expect(screen.getByRole("link", { name: "Opening a bank account" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore Arrival essentials" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Groups (1)" })).toHaveAttribute("href", "#result-groups");
    expect(screen.getByRole("link", { name: "Guides (1)" })).toHaveAttribute("href", "#result-guides");
    expect(screen.getByRole("link", { name: "Glossary terms (1)" })).toHaveAttribute("href", "#result-terms");
    expect(screen.getByRole("heading", { name: "Content groups" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Guides" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Glossary terms" })).toBeInTheDocument();
  });

  it("presents a Japanese pilot result from a Japanese query", () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    renderDiscovery([{
      contentId: bankArticle.id,
      targetLocale: "ja",
      title: "銀行口座を開設する",
      description: "銀行の審査に備えて住所と本人確認書類を準備します。",
    }]);
    enterSearch("銀行口座");

    expect(screen.getByRole("link", { name: "銀行口座を開設する" })).toBeInTheDocument();
    // Japanese mode shows the pilot notice in Japanese, like the rest of the localized interface.
    expect(screen.getByText("日本語試験版")).toBeInTheDocument();
    expect(window.location.search).toBe("?q=%E9%8A%80%E8%A1%8C%E5%8F%A3%E5%BA%A7&lang=ja");
  });

  it("localizes content groups and stable taxonomy labels in Japanese", () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    renderDiscovery([], [{
      contentId: group.id,
      targetLocale: "ja",
      title: "来日後の生活手続き",
      description: "来日直後の共通手続きです。",
    }]);

    expect(screen.getByRole("link", { name: "見る： 来日後の生活手続き" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "すべてのガイドと用語を検索" })).toBeInTheDocument();
    fireEvent.click(screen.getByText("その他の絞り込み"));
    expect(Array.from(screen.getByRole("combobox", { name: "トピック" }).querySelectorAll("option"), (option) => option.textContent)).toEqual([
      "すべて", "銀行", "日常生活", "仕事", "医療・健康", "住居", "出入国在留管理", "言語", "自治体の手続き", "税金", "交通",
    ]);

    enterSearch("query-with-no-matches");
    expect(screen.getByRole("heading", { name: "一致する情報が見つかりません" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "すべてのグループを見る" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "この質問をFAQで検索する" })).toBeInTheDocument();
  });

  it("localizes the activity-search wrapper while retaining canonical activity labels", () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    render(
      <ContentLocaleProvider>
        <ActivitySearchSuggestion query="developer" returnTo="/explore" />
      </ContentLocaleProvider>,
    );

    expect(screen.getByRole("heading", { name: "予定している活動から確認する" })).toBeInTheDocument();
    expect(screen.getByText("この情報確認では、在留資格、雇用、免許、税金などの論点を分けて整理します。要件を満たすかどうかの判断は行いません。")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /活動を確認： Take or change work/ })).toBeInTheDocument();
  });

  it("returns FAQ questions and their compact canonical links", () => {
    renderDiscovery();
    enterSearch("rent needs bank account");

    expect(screen.getByRole("heading", { name: "How do I handle the address, apartment, and bank-account loop after arriving?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "FAQs (1)" })).toHaveAttribute("href", "#result-faqs");
    expect(screen.getByRole("link", { name: /Guide: Finding housing and moving in/ })).toBeInTheDocument();
  });

  it("hands an unsuccessful Explore query to FAQ search without carrying filters", () => {
    renderDiscovery();
    enterSearch("software developer");
    fireEvent.change(screen.getByRole("combobox", { name: "Topic" }), { target: { value: "healthcare" } });

    expect(screen.getByRole("heading", { name: "No matching guidance found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Search FAQs for this question" })).toHaveAttribute(
      "href",
      "/faq?q=software+developer",
    );
  });

  it("can limit results to matching groups", () => {
    renderDiscovery();
    enterSearch("bank account");
    fireEvent.click(screen.getByRole("button", { name: "Groups" }));

    expect(screen.getByRole("link", { name: "Explore Arrival essentials" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Opening a bank account" })).not.toBeInTheDocument();
  });

  it("integrates glossary results and macron-free romanization", () => {
    renderDiscovery();
    enterSearch("juminhyo");

    expect(screen.getByRole("link", { name: "Certificate of Residence" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Glossary terms (1)" })).toHaveAttribute("href", "#result-terms");
    expect(screen.queryByRole("link", { name: /Groups \(/ })).not.toBeInTheDocument();
  });

  it("persists active discovery state in result links", () => {
    renderDiscovery();
    enterSearch("bank account");

    expect(window.location.search).toBe("?q=bank+account");
    expect(screen.getByRole("link", { name: "Opening a bank account" })).toHaveAttribute(
      "href",
      "/articles/opening-bank-account?returnTo=%2Fexplore%3Fq%3Dbank%2Baccount",
    );
  });

  it("combines structured filters and provides zero-result recovery", () => {
    renderDiscovery();
    fireEvent.click(screen.getByRole("button", { name: "Guides" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Topic" }), { target: { value: "healthcare" } });

    expect(window.location.search).toBe("?kind=article&topic=healthcare");
    expect(screen.getByRole("heading", { name: "No matching guidance found" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Browse all groups" }));
    expect(screen.getByRole("link", { name: "Explore Arrival essentials" })).toBeInTheDocument();
  });

  it("offers a list view for groups and search results, remembered for Explore only", () => {
    renderDiscovery();
    fireEvent.click(screen.getByRole("button", { name: "List" }));
    expect(screen.getByRole("link", { name: "Explore Arrival essentials" }).closest("li")).not.toBeNull();
    expect(window.localStorage.getItem(viewModeStorageKey("explore"))).toBe("list");
    expect(window.localStorage.getItem(viewModeStorageKey("residence-statuses"))).toBeNull();

    // The same choice carries into search results; FAQs keep their own list.
    enterSearch("bank account");
    expect(screen.getByRole("button", { name: "List" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: "Opening a bank account" }).closest("li")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Cards" }));
    expect(screen.getByRole("link", { name: "Opening a bank account" }).closest("li")).toBeNull();
    expect(window.localStorage.getItem(viewModeStorageKey("explore"))).toBeNull();
  });

  it("keeps the view toggle available when a search has no results", () => {
    renderDiscovery();
    enterSearch("zzzz-no-such-guidance");
    expect(screen.getByRole("heading", { name: "No matching guidance found" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Display as" })).toBeInTheDocument();
  });

  it("shows advanced filters that arrive from the URL as chips and removes them one at a time", () => {
    window.history.replaceState(null, "", "/explore?stage=recently-arrived&topic=banking");
    renderDiscovery();

    const activeFilters = screen.getByRole("list", { name: "Active filters" });
    expect(activeFilters).toHaveTextContent("Journey stage: Recently arrived");
    expect(activeFilters).toHaveTextContent("Topic: Banking");
    // The chips are the summary, so the filter panel stays closed until the visitor opens it.
    expect(screen.getByText("More filters").closest("details")).not.toHaveAttribute("open");
    expect(screen.getByRole("link", { name: "Opening a bank account" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Remove filter Topic: Banking" }));
    expect(screen.queryByRole("button", { name: "Remove filter Topic: Banking" })).not.toBeInTheDocument();
    expect(window.location.search).toBe("?stage=recently-arrived");

    fireEvent.click(screen.getByRole("button", { name: "Remove filter Journey stage: Recently arrived" }));
    expect(screen.queryByRole("list", { name: "Active filters" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore Arrival essentials" })).toBeInTheDocument();
  });

  it("exposes the search controls as a search landmark with a catalog placeholder", () => {
    renderDiscovery();
    const landmark = screen.getByRole("search", { name: "Search every guide and term" });
    expect(landmark).toContainElement(screen.getByRole("searchbox"));
    expect(screen.getByRole("searchbox")).toHaveAttribute("placeholder", "Try bank account, Student status, or juminhyo");
  });

  it("shows the secondary prompts only while browsing, so results follow the search directly", () => {
    render(
      <ContentLocaleProvider>
        <ExploreDiscovery groups={[group]} articles={[bankArticle]} terms={glossaryTerms} residenceStatuses={residenceStatuses} supplement={<p>Secondary prompt</p>} />
      </ContentLocaleProvider>,
    );
    expect(screen.getByText("Secondary prompt")).toBeInTheDocument();
    enterSearch("bank account");
    expect(screen.queryByText("Secondary prompt")).not.toBeInTheDocument();
  });
});
