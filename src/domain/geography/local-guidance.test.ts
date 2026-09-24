import { describe, expect, it } from "vitest";
import { getAdministrativeGeography } from "@/data/geography";
import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { sources } from "@/data/sources";
import { validateLocalGuidanceCollection } from "./local-guidance";

/**
 * Rules rather than inventories: adding a researched batch must not require editing this file. Coverage itself is
 * reported by `npm run local-guidance -- coverage`.
 */
const codeOf = (id: string) => getAdministrativeGeography(id)!.code;

describe("local guidance model", () => {
  it("lists prefecture parents first, then selectable locations in administrative code order", () => {
    const parents = supportedGeographies.filter(({ selectable }) => !selectable);
    const selectable = supportedGeographies.filter(({ selectable }) => selectable);
    expect(supportedGeographies.slice(0, parents.length)).toEqual(parents);
    for (const { id } of parents) expect(["prefecture", "metropolis"]).toContain(getAdministrativeGeography(id)?.type);
    const codes = selectable.map(({ id }) => codeOf(id));
    expect(codes).toEqual([...codes].sort());
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("keeps each guide's supplements together, in code order, one per location", () => {
    const articleOrder = [...new Set(localGuidanceSupplements.map(({ articleId }) => articleId))];
    // Each guide's records form one contiguous run, so subject order stays stable as batches are added.
    expect(localGuidanceSupplements.map(({ articleId }) => articleId))
      .toEqual(articleOrder.flatMap((articleId) => localGuidanceSupplements.filter((supplement) => supplement.articleId === articleId).map(() => articleId)));
    for (const articleId of articleOrder) {
      const codes = localGuidanceSupplements.filter((supplement) => supplement.articleId === articleId).map(({ geographyId }) => codeOf(geographyId));
      expect(codes, articleId).toEqual([...codes].sort());
      expect(new Set(codes).size, articleId).toBe(codes.length);
    }
    expect(new Set(localGuidanceSupplements.map(({ id }) => id)).size).toBe(localGuidanceSupplements.length);
  });

  it("links every supplement to known geography, article, and source records", () => {
    expect(() => validateLocalGuidanceCollection(
      supportedGeographies,
      localGuidanceSupplements,
      [...new Set(localGuidanceSupplements.map(({ articleId }) => articleId))],
      sources.map(({ id }) => id),
    )).not.toThrow();
  });
});
