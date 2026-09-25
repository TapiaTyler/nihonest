export { supportedGeographies } from "@/data/local-guidance/geographies";
import { getAdministrativeGeography } from "@/data/geography";
import { prefectureGuidance } from "@/data/local-guidance/locations";

/** Guide order for supplements; within each guide, locations follow administrative code order. */
export const localGuidanceArticleOrder = [
  "registering-your-address-after-arrival",
  "joining-national-health-insurance",
  "sorting-household-waste-and-arranging-disposal",
  "income-and-resident-tax-after-moving-to-japan",
  "preparing-for-disasters-and-evacuation-in-japan",
  "finding-japanese-language-and-local-support",
  "national-pension-after-moving-to-japan",
] as const;

const locations = prefectureGuidance.flatMap((prefecture) => prefecture.locations);

/** Every researched location with its sources, supplements, and recheck items, as declared in its file. */
export const localGuidanceLocations = locations;
const rank = (articleId: string) => {
  const index = (localGuidanceArticleOrder as readonly string[]).indexOf(articleId);
  return index < 0 ? localGuidanceArticleOrder.length : index;
};
const codeOf = (id: string) => getAdministrativeGeography(id)?.code ?? "";

export const localGuidanceSupplements = locations.flatMap(({ supplements }) => supplements)
  .sort((left, right) => rank(left.articleId) - rank(right.articleId) || left.articleId.localeCompare(right.articleId) || codeOf(left.geographyId).localeCompare(codeOf(right.geographyId)));

/** Official sources cited only by one location, declared in that location's file. */
export const localGuidanceSourceEntries = locations.flatMap(({ sources }) => sources);

/** Items to recheck later, with the location each belongs to; docs/LOCAL-GUIDANCE-RECHECK.md is generated from these. */
export const localGuidanceRecheckItems = locations.flatMap(({ geography, recheck }) => recheck.map((item) => ({ location: geography, item })));
