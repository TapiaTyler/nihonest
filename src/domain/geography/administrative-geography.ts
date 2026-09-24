import { z } from "zod";

const prefectureCodeSchema = z.string().regex(/^(?:0[1-9]|[1-3][0-9]|4[0-7])$/);
export const administrativeGeographyIdSchema = z.string().regex(/^jp-\d{5}$/);
export const administrativeGeographyTypeSchema = z.enum([
  "prefecture", "metropolis", "special-ward", "designated-city", "administrative-ward",
  "city", "town", "village",
]);

/** The sixth digit is a check digit, not part of the five-digit identity code. */
export function hasValidLocalGovernmentCheckDigit(value: string): boolean {
  if (!/^\d{6}$/.test(value)) return false;
  const sum = [...value.slice(0, 5)].reduce((total, digit, index) => total + Number(digit) * (6 - index), 0);
  const remainder = 11 - sum % 11;
  // Use the units digit: 10 becomes 0 and 11 becomes 1 (e.g. Shinjuku 131041).
  return Number(value[5]) === remainder % 10;
}

export const administrativeGeographySchema = z.object({
  id: administrativeGeographyIdSchema,
  code: z.string().regex(/^\d{5}$/),
  localGovernmentCode: z.string().regex(/^\d{6}$/),
  prefectureCode: prefectureCodeSchema,
  type: administrativeGeographyTypeSchema,
  parentId: administrativeGeographyIdSchema.optional(),
  names: z.object({
    ja: z.string().min(1),
    en: z.string().min(1).optional(),
    kana: z.string().regex(/^[\p{Script=Hiragana}ー\s]+$/u).optional(),
  }).strict(),
  sourceId: z.string().min(1),
}).strict().superRefine((record, context) => {
  const reject = (message: string) => context.addIssue({ code: "custom", message });
  if (record.id !== `jp-${record.code}`) reject("Geography ID must use its five-digit code.");
  if (record.localGovernmentCode.slice(0, 5) !== record.code || !hasValidLocalGovernmentCheckDigit(record.localGovernmentCode)) {
    reject("Invalid local-government code or check digit.");
  }
  if (!record.code.startsWith(record.prefectureCode)) reject("Geography code must belong to its prefecture.");
  const isPrefecture = record.type === "prefecture" || record.type === "metropolis";
  if (isPrefecture && (record.code !== `${record.prefectureCode}000` || record.parentId !== undefined)) {
    reject("Prefectures must use their prefectural code and have no parent.");
  }
  if (!isPrefecture && (!record.parentId || record.code.endsWith("000"))) {
    reject("Municipalities and administrative wards require a parent and a non-prefectural code.");
  }
  if ((record.type === "metropolis") !== (record.code === "13000")) reject("Tokyo alone is the metropolis record.");
  if (record.type === "special-ward" && (record.parentId !== "jp-13000" || !/^131(?:0[1-9]|1[0-9]|2[0-3])$/.test(record.code))) {
    reject("Tokyo special wards must use their own codes and belong directly to Tokyo.");
  }
  if (/^131(?:0[1-9]|1[0-9]|2[0-3])$/.test(record.code) && record.type !== "special-ward") {
    reject("A Tokyo special-ward code cannot identify an ordinary city or administrative ward.");
  }
});

export type AdministrativeGeography = z.infer<typeof administrativeGeographySchema>;
export type GeographySort = "code" | "en" | "ja";

/** Fixed-width codes give stable administrative order; labels never determine identity. */
export function sortAdministrativeGeographies<T extends AdministrativeGeography>(records: readonly T[], order: GeographySort = "code"): T[] {
  const collator = new Intl.Collator(order === "ja" ? "ja" : "en", { sensitivity: "base", numeric: true });
  return [...records].sort((left, right) => {
    if (order === "code") return left.code.localeCompare(right.code, "en");
    // Missing English names follow translated names. Japanese names remain an explicit fallback.
    const fallbackOrder = order === "en" ? Number(!left.names.en) - Number(!right.names.en) : 0;
    const label = (record: T) => order === "en" ? record.names.en ?? record.names.ja : record.names.kana ?? record.names.ja;
    return fallbackOrder || collator.compare(label(left), label(right)) || left.code.localeCompare(right.code, "en");
  });
}

/** Validates the entire hierarchy; a ward of a designated city is never a municipality. */
export function createAdministrativeGeographyRegistry(input: readonly unknown[]) {
  const parsed = input.map((record) => administrativeGeographySchema.parse(record));
  const byId = new Map(parsed.map((record) => [record.id, record]));
  if (byId.size !== parsed.length) throw new Error("Duplicate administrative geography ID/code.");
  for (const record of parsed) {
    if (!record.parentId) continue;
    const parent = byId.get(record.parentId);
    if (!parent) throw new Error(`Missing parent for ${record.id}.`);
    const expectedParent = record.type === "administrative-ward"
      ? parent.type === "designated-city"
      : parent.type === "prefecture" || parent.type === "metropolis";
    if (!expectedParent || parent.prefectureCode !== record.prefectureCode) {
      throw new Error(`Invalid parent type or prefecture for ${record.id}.`);
    }
    if (record.type === "administrative-ward" && !record.names.ja.startsWith(parent.names.ja)) {
      throw new Error(`Official full ward name does not match its parent city for ${record.id}.`);
    }
    // Parent types strictly decrease in depth, ruling out cycles without recursive traversal.
  }
  const records = Object.freeze(sortAdministrativeGeographies(parsed).map((record) => Object.freeze({
    ...record, names: Object.freeze(record.names),
  })));
  const immutableById = new Map(records.map((record) => [record.id, record]));
  const get = (id: string) => immutableById.get(id);
  return Object.freeze({
    records,
    get,
    children(parentId: string, order: GeographySort = "code") {
      return sortAdministrativeGeographies(records.filter((record) => record.parentId === parentId), order);
    },
    ancestors(id: string) {
      const result: AdministrativeGeography[] = [];
      let record = get(id);
      while (record?.parentId) {
        record = get(record.parentId);
        if (record) result.unshift(record);
      }
      return result;
    },
  });
}
