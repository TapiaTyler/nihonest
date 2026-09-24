/**
 * Tokyo's official area divisions, as the Tokyo Metropolitan Government groups its 62 municipalities: 区部 (the
 * 23 special wards), 多摩地域 (the Tama area: 26 cities, 3 towns, and 1 village), and 島しょ地域 (the Izu and
 * Ogasawara islands: 2 towns and 7 villages). The division follows from the official codes: special wards are
 * 131xx, the Tama area 132xx and 1330x (Nishitama District), and the islands 1336x onward.
 */
export const tokyoAreas = [
  { id: "special-wards", en: "Special wards", ja: "特別区" },
  { id: "tama", en: "Tama area", ja: "多摩地域" },
  { id: "islands", en: "Island area", ja: "島しょ地域" },
] as const;

export type TokyoArea = (typeof tokyoAreas)[number];

/** The area of a Tokyo municipality by its five-digit code; undefined outside Tokyo and for Tokyo itself. */
export function tokyoAreaForCode(code: string): TokyoArea | undefined {
  if (!/^13\d{3}$/.test(code) || code === "13000") return undefined;
  if (code.startsWith("131")) return tokyoAreas[0];
  return Number(code) >= 13360 ? tokyoAreas[2] : tokyoAreas[1];
}

/**
 * Splits code-ordered municipality options into labeled groups where an official division exists (Tokyo), and a
 * single unlabeled group otherwise, preserving order.
 */
export function groupMunicipalityOptions<T>(options: readonly T[], codeOf: (option: T) => string): { label?: string; options: T[] }[] {
  const groups: { label?: string; options: T[] }[] = [];
  for (const option of options) {
    const label = tokyoAreaForCode(codeOf(option))?.en;
    const current = groups.at(-1);
    if (current && current.label === label) current.options.push(option);
    else groups.push({ label, options: [option] });
  }
  return groups;
}
