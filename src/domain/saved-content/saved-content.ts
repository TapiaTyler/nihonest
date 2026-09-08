import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const SAVED_CONTENT_KINDS = ["article", "glossary-term", "residence-status"] as const;
export const savedContentKindSchema = z.enum(SAVED_CONTENT_KINDS);
export const savedContentStateSchema = z.enum(["saved", "removed"]);

/** A removal remains a record so an older copy on another device cannot restore the item. */
export const savedContentRecordSchema = z.object({
  kind: savedContentKindSchema,
  contentId: stableIdSchema,
  state: savedContentStateSchema,
  updatedAt: z.iso.datetime(),
});

export type SavedContentRecord = z.infer<typeof savedContentRecordSchema>;
export type SavedContentReference = Readonly<Pick<SavedContentRecord, "kind" | "contentId">>;

export function savedContentKey(reference: SavedContentReference): string {
  return `${reference.kind}:${reference.contentId}`;
}

export function updateSavedContent(
  records: readonly SavedContentRecord[],
  reference: SavedContentReference,
  state: SavedContentRecord["state"],
  updatedAt: string,
): readonly SavedContentRecord[] {
  const nextRecord = savedContentRecordSchema.parse({ ...reference, state, updatedAt });
  return [...records.filter((record) => savedContentKey(record) !== savedContentKey(reference)), nextRecord];
}

export function visibleSavedContent(records: readonly SavedContentRecord[]): readonly SavedContentRecord[] {
  return records.filter(({ state }) => state === "saved");
}
