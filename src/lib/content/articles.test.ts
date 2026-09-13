import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("article catalog", () => {
  it("registers the temporary-travel MDX module used by article and journey relationships", async () => {
    const catalog = await readFile(resolve(process.cwd(), "src/lib/content/articles.ts"), "utf8");

    expect(catalog).toContain('from "../../../content/articles/reentry-permission-and-temporary-travel.mdx"');
    expect(catalog).toContain("[reentryPermissionAndTemporaryTravelMetadata, ReentryPermissionAndTemporaryTravel]");
  });

  it("registers the creative and media comparison guide", async () => {
    const catalog = await readFile(resolve(process.cwd(), "src/lib/content/articles.ts"), "utf8");

    expect(catalog).toContain('from "../../../content/articles/choosing-a-residence-status-for-creative-and-media-work.mdx"');
    expect(catalog).toContain("[choosingAResidenceStatusForCreativeAndMediaWorkMetadata, ChoosingAResidenceStatusForCreativeAndMediaWork]");
  });

  it("registers the medical and care comparison guide", async () => {
    const catalog = await readFile(resolve(process.cwd(), "src/lib/content/articles.ts"), "utf8");

    expect(catalog).toContain('from "../../../content/articles/choosing-a-status-for-medical-and-care-work-in-japan.mdx"');
    expect(catalog).toContain("[choosingAStatusForMedicalAndCareWorkInJapanMetadata, ChoosingAStatusForMedicalAndCareWorkInJapan]");
  });

  it("registers the workforce-development comparison and successor guides", async () => {
    const catalog = await readFile(resolve(process.cwd(), "src/lib/content/articles.ts"), "utf8");

    expect(catalog).toContain('from "../../../content/articles/choosing-a-training-or-workforce-development-route-in-japan.mdx"');
    expect(catalog).toContain('from "../../../content/articles/employment-for-skill-development-system.mdx"');
  });

  it("registers the family and personal-status comparison guide", async () => {
    const catalog = await readFile(resolve(process.cwd(), "src/lib/content/articles.ts"), "utf8");

    expect(catalog).toContain('from "../../../content/articles/choosing-a-family-or-personal-status-in-japan.mdx"');
    expect(catalog).toContain("[choosingAFamilyOrPersonalStatusInJapanMetadata, ChoosingAFamilyOrPersonalStatusInJapan]");
  });
});
