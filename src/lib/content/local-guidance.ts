import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { administrativeGeographies, getAdministrativeGeography, getAdministrativeGeographyAncestors } from "@/data/geography";
import { sources } from "@/data/sources";
import { englishGeographyName } from "@/domain/geography/english-name";

export type ArticleLocalGuidance = ReturnType<typeof getLocalGuidanceForArticle>[number];
export type SelectableLocalGuidanceLocation = ReturnType<typeof getSelectableLocalGuidanceLocations>[number];

/**
 * Registry IDs of municipalities with researched guidance. Location selectors list only these; the full registry
 * stays for future coverage.
 */
export function getResearchedMunicipalityIds(): ReadonlySet<string> {
  return new Set(localGuidanceSupplements.flatMap(({ geographyId }) => getAdministrativeGeography(geographyId)?.id ?? []));
}

export function getSelectableLocalGuidanceLocations() {
  const researched = getResearchedMunicipalityIds();
  return administrativeGeographies.map((record) => {
    const supported = supportedGeographies.find(({ id }) => getAdministrativeGeography(id)?.id === record.id);
    const prefecture = getAdministrativeGeographyAncestors(record.id)[0] ?? record;
    const supportedPrefecture = supportedGeographies.find(({ id }) => getAdministrativeGeography(id)?.id === prefecture.id);
    const prefectureId = supportedPrefecture?.id ?? prefecture.id;
    return {
      geography: {
        id: supported?.id ?? record.id,
        /** The registry ID, which parentId refers to; `id` keeps legacy saved-location values such as "nagoya". */
        canonicalId: record.id,
        /** Official code: ordering by it keeps each designated city next to its wards. */
        code: record.code,
        name: supported?.name ?? englishGeographyName(record, record.parentId ? getAdministrativeGeography(record.parentId) : undefined),
        type: record.type,
        parentId: record.parentId,
      },
      parentName: supportedPrefecture?.name ?? prefecture.names.en ?? prefecture.names.ja,
      prefectureId,
      /** Prefectures are always listed; municipalities only when they have researched guidance. */
      listed: record.type === "prefecture" || record.type === "metropolis" || researched.has(record.id),
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
