import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { sources } from "@/data/sources";

export type ArticleLocalGuidance = ReturnType<typeof getLocalGuidanceForArticle>[number];

export function getLocalGuidanceForArticle(articleId: string) {
  return localGuidanceSupplements
    .filter((supplement) => supplement.articleId === articleId)
    .map((supplement) => {
      const geography = supportedGeographies.find(({ id }) => id === supplement.geographyId);
      if (!geography) throw new Error(`Missing geography "${supplement.geographyId}".`);
      const parent = geography.parentId
        ? supportedGeographies.find(({ id }) => id === geography.parentId)
        : undefined;
      return {
        supplement,
        geography,
        parentName: parent?.name,
        sources: supplement.sourceIds.flatMap((sourceId) => {
          const source = sources.find(({ id }) => id === sourceId);
          return source ? [source] : [];
        }),
      };
    });
}
