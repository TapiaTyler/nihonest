import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { glossaryTerms } from "@/data/glossary";
import { residenceStatuses } from "@/data/residence-statuses";
import { validateFaqCollection } from "@/domain/faq/faq";
import { faqs } from "./faqs";

describe("FAQ catalog", () => {
  it("references existing canonical content", async () => {
    const articleDirectory = resolve(process.cwd(), "content/articles");
    const articleFiles = (await readdir(articleDirectory)).filter((file) => file.endsWith(".mdx"));
    const articleIds = await Promise.all(articleFiles.map(async (file) => {
      const source = await readFile(resolve(articleDirectory, file), "utf8");
      return source.match(/\bid:\s*"([a-z0-9-]+)"/)?.[1];
    }));

    expect(() => validateFaqCollection(faqs, {
      articleIds: articleIds.filter((id): id is string => Boolean(id)),
      groupIds: articleGroups.map(({ id }) => id),
      journeyIds: guidedJourneys.map(({ id }) => id),
      glossaryTermIds: glossaryTerms.map(({ id }) => id),
      residenceStatusIds: residenceStatuses.map(({ id }) => id),
    })).not.toThrow();
  });
});
