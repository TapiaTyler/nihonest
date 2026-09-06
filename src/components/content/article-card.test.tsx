import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { articleMetadataSchema } from "@/domain/article/article";
import { ArticleCard } from "./article-card";

describe("ArticleCard", () => {
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
    expect(screen.getByText("Read guide →")).toBeInTheDocument();
  });
});
