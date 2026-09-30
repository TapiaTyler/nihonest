import { z } from "zod";
import { parseArticleMarkdown } from "@/domain/article/article-blocks";
import { translationArtifactSchema } from "@/domain/translation/translation";
import type { BundledArticle, BundledArticleTranslation } from "./content-bundle";

export const bundledArticleProvenanceSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  sourceRevision: z.string().regex(/^[a-f0-9]{64}$/),
}).strict();

export const bundledArticleArtifactSchema = translationArtifactSchema.superRefine((artifact, context) => {
  if (artifact.contentKind !== "article" || artifact.targetLocale !== "ja" || artifact.availability !== "active") {
    context.addIssue({ code: "custom", message: "Expected an active Japanese article artifact." });
  }
  const keys = ["title", "description", "body"];
  if (keys.some((key) => !artifact.fields[key]?.trim()) || Object.keys(artifact.fields).some((key) => !keys.includes(key))) {
    context.addIssue({ code: "custom", message: "Article artifacts require only nonempty title, description and body fields." });
  }
});

/** MDX source revisions are producer declarations; portable blocks cannot reconstruct the original MDX. */
export function validateBundledArticleProvenance(articles: readonly BundledArticle[],
  provenance: readonly z.infer<typeof bundledArticleProvenanceSchema>[],
  artifacts: readonly z.infer<typeof bundledArticleArtifactSchema>[], compact: readonly BundledArticleTranslation[]) {
  const revisions = new Map(provenance.map(({ id, sourceRevision }) => [id, sourceRevision]));
  if (revisions.size !== articles.length || provenance.length !== articles.length
    || articles.some(({ metadata }) => !revisions.has(metadata.id))) {
    throw new Error("Article provenance must cover exactly the canonical article IDs.");
  }
  const compactById = new Map(compact.map((record) => [record.articleId, record]));
  if (compact.length !== artifacts.length || compactById.size !== compact.length) {
    throw new Error("Article artifacts and portable translations must correspond exactly.");
  }
  for (const artifact of artifacts) {
    const portable = compactById.get(artifact.contentId);
    if (revisions.get(artifact.contentId) !== artifact.sourceRevision || !portable
      || portable.sourceRevision !== artifact.sourceRevision || portable.reviewState !== artifact.reviewState
      || portable.title !== artifact.fields.title || portable.description !== artifact.fields.description
      || JSON.stringify(portable.blocks) !== JSON.stringify(parseArticleMarkdown(artifact.fields.body!))) {
      throw new Error("Article translation target, revision or portable representation mismatch.");
    }
  }
}
