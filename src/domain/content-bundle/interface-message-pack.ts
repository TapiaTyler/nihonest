import { z } from "zod";

/**
 * Portable interface catalogs retain public message IDs verbatim, including camelCase. These are catalog packs,
 * not translation artifacts: the current catalogs have no per-message currency or generation metadata.
 * Adoption into the bundle manifest/exporter is a separate format gate.
 */
const visibleText = z.string().refine((value) => value.trim().length > 0, "Expected non-blank text.");
const messages = z.record(visibleText, visibleText).refine((value) => Object.keys(value).length > 0, "Expected messages.");
const identity = { kind: z.literal("catalog"), id: z.literal("interface-messages"), messages };

export const englishInterfaceMessagePackSchema = z.object({ ...identity, locale: z.literal("en") }).strict();
export const japaneseInterfaceMessagePackSchema = z.object({
  ...identity, locale: z.literal("ja"), reviewState: z.literal("machine-translated"),
}).strict();
export const interfaceMessagePackSchema = z.discriminatedUnion("locale", [
  englishInterfaceMessagePackSchema, japaneseInterfaceMessagePackSchema,
]);

/** Matches the web template grammar; repeated placeholders represent the same supplied value. */
function placeholders(text: string): Set<string> {
  return new Set(Array.from(text.matchAll(/\{(\w+)\}/g), (match) => match[1]!));
}

/**
 * Both exported packs must cover exactly the English key set. Japanese may omit an English placeholder but
 * cannot introduce one, matching the web's substitution semantics. Values and insertion order are preserved;
 * runtime English fallback for an unavailable Japanese catalog remains the consumer's responsibility.
 */
export const interfaceMessagePackPairSchema = z.object({
  english: englishInterfaceMessagePackSchema,
  japanese: japaneseInterfaceMessagePackSchema,
}).strict().superRefine(({ english, japanese }, context) => {
  const englishIds = new Set(Object.keys(english.messages));
  for (const id of Object.keys(japanese.messages)) {
    if (!englishIds.has(id)) context.addIssue({ code: "custom", path: ["japanese", "messages", id], message: "Unexpected message ID." });
  }
  for (const id of englishIds) {
    if (!Object.hasOwn(japanese.messages, id)) {
      context.addIssue({ code: "custom", path: ["japanese", "messages", id], message: "Missing message ID." });
      continue;
    }
    const supplied = placeholders(english.messages[id]!);
    for (const name of placeholders(japanese.messages[id]!)) {
      if (!supplied.has(name)) context.addIssue({ code: "custom", path: ["japanese", "messages", id], message: "Unexpected placeholder." });
    }
  }
});

export type EnglishInterfaceMessagePack = z.infer<typeof englishInterfaceMessagePackSchema>;
export type JapaneseInterfaceMessagePack = z.infer<typeof japaneseInterfaceMessagePackSchema>;
export type InterfaceMessagePack = z.infer<typeof interfaceMessagePackSchema>;
