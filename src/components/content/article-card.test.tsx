import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { articleMetadataSchema } from "@/domain/article/article";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { ArticleCard } from "./article-card";

describe("ArticleCard", () => {
  afterEach(() => window.localStorage.removeItem(contentLocaleStorageKey));

  it("uses one full-card link and shows a visible reading prompt", () => {
    const article = articleMetadataSchema.parse({
      id: "sample-guide",
      slug: "sample-guide",
      title: "Sample guide",
      description: "A useful guide for testing the article card.",
      journeyStageIds: ["planning"],
      topicIds: ["daily-life"],
      audienceIds: ["newcomer"],
      geographicScopes: ["national"],
      importance: "important",
      contentType: "guide",
      status: "needs-review",
      createdAt: "2026-09-06",
      updatedAt: "2026-09-06",
    });
    render(<ArticleCard article={article} />);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: article.title })).toHaveAttribute(
      "href",
      `/articles/${article.slug}`,
    );
    expect(screen.getByText("Read guide")).toBeInTheDocument();
    expect(screen.getByText("Editorial review")).toBeInTheDocument();
  });

  it("labels unresearched content as draft", () => {
    const article = articleMetadataSchema.parse({
      id: "draft-guide",
      slug: "draft-guide",
      title: "Draft guide",
      description: "A deliberately unreviewed draft guide.",
      journeyStageIds: ["planning"],
      topicIds: ["immigration"],
      geographicScopes: ["national"],
      importance: "important",
      contentType: "guide",
      status: "draft",
      createdAt: "2026-09-06",
      updatedAt: "2026-09-06",
    });

    render(<ArticleCard article={article} />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("localizes editorial badges, topics, and relevant journey stages in Japanese", () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    const article = articleMetadataSchema.parse({
      id: "japanese-guide",
      slug: "japanese-guide",
      title: "Sample guide",
      description: "A useful guide for testing the article card.",
      journeyStageIds: ["planning", "preparing"],
      topicIds: ["daily-life", "housing"],
      geographicScopes: ["national"],
      importance: "important",
      contentType: "guide",
      status: "needs-review",
      createdAt: "2026-09-06",
      updatedAt: "2026-09-06",
    });

    render(
      <ContentLocaleProvider>
        <ArticleCard article={article} />
      </ContentLocaleProvider>,
    );

    expect(screen.getByText("編集確認が必要")).toBeInTheDocument();
    expect(screen.getByText("日常生活・住居")).toBeInTheDocument();
    expect(screen.getByText("関連する段階： 計画中、準備中")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: article.title })).toHaveAttribute("href", `/articles/${article.slug}`);
  });
});
