import { describe, expect, it } from "vitest";
import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { sources } from "@/data/sources";
import { validateLocalGuidanceCollection } from "./local-guidance";

describe("local guidance model", () => {
  it("links every pilot supplement to known geography, article, and source records", () => {
    expect(() => validateLocalGuidanceCollection(
      supportedGeographies,
      localGuidanceSupplements,
      [...new Set(localGuidanceSupplements.map(({ articleId }) => articleId))],
      sources.map(({ id }) => id),
    )).not.toThrow();
    expect(localGuidanceSupplements).toHaveLength(12);
  });
});
