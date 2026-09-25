import { supportedGeographySchema } from "@/domain/geography/local-guidance";
import { getAdministrativeGeography } from "@/data/geography";
import { prefectureGuidance } from "@/data/local-guidance/locations";

// Coverage is deliberately narrower than the national identity registry: a prefecture folder in
// src/data/local-guidance/locations and one file per researched location. Legacy public/storage IDs ("tokyo",
// "shinjuku", "nagoya") are preserved; newer locations use canonical IDs.
const codeOf = (id: string) => getAdministrativeGeography(id)?.code ?? "";
const prefectureLocations = [...prefectureGuidance].sort((left, right) => codeOf(left.geography.id).localeCompare(codeOf(right.geography.id)))
  .map(({ geography }) => ({ ...geography, selectable: false }));
const researchedLocations = prefectureGuidance.flatMap(({ locations }) => locations.map(({ geography }) => ({ ...geography, selectable: true })))
  .sort((left, right) => codeOf(left.id).localeCompare(codeOf(right.id)));
const supportedLocations = [...prefectureLocations, ...researchedLocations];

export const supportedGeographies = supportedLocations.map((location) => {
  const geography = getAdministrativeGeography(location.id);
  if (!geography) throw new Error(`Missing canonical geography for ${location.id}.`);
  // The parent's supported ID: a legacy ID ("tokyo") where one exists, otherwise the canonical ID ("jp-27000").
  const parentId = geography.parentId
    ? supportedLocations.find((candidate) => getAdministrativeGeography(candidate.id)?.id === geography.parentId)?.id
    : undefined;
  if (geography.parentId && !parentId) throw new Error(`Missing supported parent for ${location.id}.`);
  return supportedGeographySchema.parse({ ...location, type: geography.type, parentId });
});
