import { z } from "zod";
import { importanceSchema, topicIdSchema } from "@/domain/taxonomy/taxonomy";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

/** Pure source-review projection of article metadata; filesystem extraction stays in lib. */
export const articleSourceMetadataSchema = z.object({
  id: stableIdSchema,
  title: z.string().min(1),
  sourceIds: z.array(stableIdSchema).min(1),
  importance: importanceSchema,
  topicIds: z.array(topicIdSchema).min(1),
});

export type ArticleSourceMetadata = z.infer<typeof articleSourceMetadataSchema>;

