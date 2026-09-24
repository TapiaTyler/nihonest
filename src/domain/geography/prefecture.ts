import { normalizeSearchText } from "@/domain/search/normalize";

export type FinderPrefecture = Readonly<{
  id: string;
  code: string;
  names: Readonly<{ en: string; ja: string }>;
}>;

export function searchPrefectures(prefectures: readonly FinderPrefecture[], query: string): FinderPrefecture[] {
  const normalized = normalizeSearchText(query);
  const terms = normalized.split(" ").filter(Boolean);
  return prefectures.filter((prefecture) => {
    const searchable = normalizeSearchText(`${prefecture.names.en} ${prefecture.names.ja} ${prefecture.code}`);
    return terms.every((term) => searchable.includes(term));
  });
}
