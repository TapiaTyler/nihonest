import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { administrativeGeographies, getAdministrativeGeography, getAdministrativeGeographyAncestors } from "@/data/geography";
import { sources } from "@/data/sources";
import { englishGeographyName } from "@/domain/geography/english-name";

export type ArticleLocalGuidance = ReturnType<typeof getLocalGuidanceForArticle>[number];
export type SelectableLocalGuidanceLocation = ReturnType<typeof getSelectableLocalGuidanceLocations>[number];

export function getSelectableLocalGuidanceLocations() {
  return administrativeGeographies.map((record) => {
    const supported = supportedGeographies.find(({ id }) => getAdministrativeGeography(id)?.id === record.id);
    const prefecture = getAdministrativeGeographyAncestors(record.id)[0] ?? record;
    const supportedPrefecture = supportedGeographies.find(({ id }) => getAdministrativeGeography(id)?.id === prefecture.id);
    const prefectureId = supportedPrefecture?.id ?? prefecture.id;
    return {
      geography: {
        id: supported?.id ?? record.id,
        /** Official code: ordering by it keeps each designated city next to its wards. */
        code: record.code,
        name: supported?.name ?? englishGeographyName(record, record.parentId ? getAdministrativeGeography(record.parentId) : undefined),
        type: record.type,
        parentId: record.parentId,
      },
      parentName: supportedPrefecture?.name ?? prefecture.names.en ?? prefecture.names.ja,
      prefectureId,
    };
  });
}

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
