import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { loadArticleSourceMetadata } from "@/lib/source-monitoring/article-source-metadata";
import { validateActivityCrossReferences } from "@/domain/activity-cross-reference/activity-cross-reference";
import { guidedJourneys } from "@/data/discovery";
import { residenceStatuses } from "@/data/residence-statuses";
import { sources } from "@/data/sources";
import { activityCrossReferences } from "./activity-cross-references";

describe("activity cross-reference catalog", () => {
  it("references existing canonical content and sources", async () => {
    const articles = await loadArticleSourceMetadata(resolve(process.cwd(), "content/articles"));

    expect(() => validateActivityCrossReferences(
      activityCrossReferences,
      articles.map(({ id }) => id),
      residenceStatuses.map(({ id }) => id),
      guidedJourneys.map(({ id }) => id),
      sources.map(({ id }) => id),
    )).not.toThrow();
  });
});
