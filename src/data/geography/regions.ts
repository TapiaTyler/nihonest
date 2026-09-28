import { getAdministrativeGeography } from "./index";

/** Common orientation groups, not administrative parents. Membership uses stable IDs. */
const regionDefinitions = [
  { name: { en: "Hokkaido", ja: "北海道" }, codes: ["01"] },
  { name: { en: "Tohoku", ja: "東北" }, codes: ["02", "03", "04", "05", "06", "07"] },
  { name: { en: "Kanto", ja: "関東" }, codes: ["08", "09", "10", "11", "12", "13", "14"] },
  { name: { en: "Chubu", ja: "中部" }, codes: ["15", "16", "17", "18", "19", "20", "21", "22", "23"] },
  { name: { en: "Kansai or Kinki", ja: "関西または近畿" }, codes: ["24", "25", "26", "27", "28", "29", "30"] },
  { name: { en: "Chugoku", ja: "中国地方" }, codes: ["31", "32", "33", "34", "35"] },
  { name: { en: "Shikoku", ja: "四国" }, codes: ["36", "37", "38", "39"] },
  { name: { en: "Kyushu and Okinawa", ja: "九州・沖縄" }, codes: ["40", "41", "42", "43", "44", "45", "46", "47"] },
] as const;

export const japanPrefectureRegions = regionDefinitions.map(({ name, codes }) => {
  const prefectureIds = codes.map((code) => `jp-${code}000`);
  const records = prefectureIds.map((id) => {
    const record = getAdministrativeGeography(id);
    if (!record?.names.en || !["prefecture", "metropolis"].includes(record.type)) {
      throw new Error(`Missing bilingual prefecture ${id}.`);
    }
    return record;
  });
  return {
    name,
    prefectureIds,
    prefectures: {
      en: records.map((record) => record.names.en).join(", "),
      ja: records.map((record) => record.names.ja).join("、"),
    },
  };
});

export type JapanPrefectureRegion = (typeof japanPrefectureRegions)[number];
