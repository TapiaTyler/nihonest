import { supportedGeographySchema } from "@/domain/geography/local-guidance";
import { getAdministrativeGeography } from "@/data/geography";

// Coverage is deliberately narrower than the national identity registry. Preserve
// legacy public/storage IDs while using canonical IDs for newly researched wards.
const supportedLocations = [
  { id: "tokyo", name: "Tokyo", aliases: ["Tokyo Metropolis", "Tokyo-to"], selectable: false },
  { id: "aichi", name: "Aichi", aliases: ["Aichi Prefecture", "Aichi-ken"], selectable: false },
  { id: "jp-27000", name: "Osaka", aliases: ["Osaka Prefecture", "Osaka-fu"], selectable: false },
  { id: "jp-13101", name: "Chiyoda City", aliases: ["Chiyoda", "Chiyoda Ward", "Chiyoda-ku"], selectable: true },
  { id: "jp-13102", name: "Chuo City", aliases: ["Chuo", "Chuo Ward", "Chuo-ku"], selectable: true },
  { id: "jp-13103", name: "Minato City", aliases: ["Minato", "Minato Ward", "Minato-ku"], selectable: true },
  { id: "shinjuku", name: "Shinjuku City", aliases: ["Shinjuku", "Shinjuku Ward", "Shinjuku-ku"], selectable: true },
  { id: "jp-13105", name: "Bunkyo City", aliases: ["Bunkyo", "Bunkyō", "Bunkyo Ward", "Bunkyo-ku"], selectable: true },
  { id: "jp-13106", name: "Taito City", aliases: ["Taito", "Taitō", "Taito Ward", "Taito-ku"], selectable: true },
  { id: "jp-13107", name: "Sumida City", aliases: ["Sumida", "Sumida Ward", "Sumida-ku"], selectable: true },
  { id: "jp-13108", name: "Koto City", aliases: ["Koto", "Kōtō", "Koto Ward", "Koto-ku", "Kōtō-ku"], selectable: true },
  { id: "jp-13109", name: "Shinagawa City", aliases: ["Shinagawa", "Shinagawa Ward", "Shinagawa-ku"], selectable: true },
  { id: "jp-13110", name: "Meguro City", aliases: ["Meguro", "Meguro Ward", "Meguro-ku"], selectable: true },
  { id: "jp-13111", name: "Ota City", aliases: ["Ota", "Ōta", "Ota Ward", "Ota-ku", "Ōta-ku"], selectable: true },
  { id: "jp-13112", name: "Setagaya City", aliases: ["Setagaya", "Setagaya Ward", "Setagaya-ku"], selectable: true },
  { id: "jp-13113", name: "Shibuya City", aliases: ["Shibuya", "Shibuya Ward", "Shibuya-ku"], selectable: true },
  { id: "jp-13114", name: "Nakano City", aliases: ["Nakano", "Nakano Ward", "Nakano-ku"], selectable: true },
  { id: "jp-13115", name: "Suginami City", aliases: ["Suginami", "Suginami Ward", "Suginami-ku"], selectable: true },
  { id: "jp-13116", name: "Toshima City", aliases: ["Toshima", "Toshima Ward", "Toshima-ku"], selectable: true },
  { id: "jp-13117", name: "Kita City", aliases: ["Kita", "Kita Ward", "Kita-ku"], selectable: true },
  { id: "jp-13118", name: "Arakawa City", aliases: ["Arakawa", "Arakawa Ward", "Arakawa-ku"], selectable: true },
  { id: "jp-13119", name: "Itabashi City", aliases: ["Itabashi", "Itabashi Ward", "Itabashi-ku"], selectable: true },
  { id: "jp-13120", name: "Nerima City", aliases: ["Nerima", "Nerima Ward", "Nerima-ku"], selectable: true },
  { id: "jp-13121", name: "Adachi City", aliases: ["Adachi", "Adachi Ward", "Adachi-ku"], selectable: true },
  { id: "jp-13122", name: "Katsushika City", aliases: ["Katsushika", "Katsushika Ward", "Katsushika-ku"], selectable: true },
  { id: "jp-13123", name: "Edogawa City", aliases: ["Edogawa", "Edogawa Ward", "Edogawa-ku"], selectable: true },
  { id: "jp-13201", name: "Hachioji City", aliases: ["Hachioji", "Hachiōji", "Hachioji-shi"], selectable: true },
  { id: "jp-13202", name: "Tachikawa City", aliases: ["Tachikawa", "Tachikawa-shi"], selectable: true },
  { id: "jp-13206", name: "Fuchu City", aliases: ["Fuchu", "Fuchū", "Fuchu-shi"], selectable: true },
  { id: "jp-13209", name: "Machida City", aliases: ["Machida", "Machida-shi"], selectable: true },
  { id: "nagoya", name: "Nagoya City", aliases: ["Nagoya", "Nagoya-shi"], selectable: true },
  { id: "jp-27100", name: "Osaka City", aliases: ["Osaka", "Osaka-shi"], selectable: true },
  { id: "jp-27140", name: "Sakai City", aliases: ["Sakai", "Sakai-shi"], selectable: true },
] as const;

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
