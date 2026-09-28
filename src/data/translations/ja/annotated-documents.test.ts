import { describe, expect, it } from "vitest";
import { annotatedDocumentFamilies } from "@/data/annotated-documents";
import { japaneseAnnotatedDocumentTranslations } from "@/data/translations/ja/annotated-documents";
import { checkLocalGuidanceTranslation } from "@/domain/translation/local-guidance-translation-checks";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";

describe("Japanese annotated documents", () => {
  it("has one current, complete, mechanically clean artifact per document family", () => {
    expect(japaneseAnnotatedDocumentTranslations.map(({ contentId }) => contentId).sort())
      .toEqual(annotatedDocumentFamilies.map(({ id }) => id).sort());
    for (const family of annotatedDocumentFamilies) {
      const artifact = japaneseAnnotatedDocumentTranslations.find(({ contentId }) => contentId === family.id)!;
      const english = translationSourceFields["annotated-document"](family);
      expect(artifact.contentKind).toBe("annotated-document");
      expect(artifact.reviewState).toBe("machine-translated");
      expect(artifact.sourceRevision, `${family.id} is stale; translate the changed English again`).toBe(createTranslationSourceRevision(english));
      expect(Object.keys(artifact.fields).sort(), family.id).toEqual(Object.keys(english).sort());
      // A fictional romanized name ("NIHONEST TARO") is kept as printed on the card, so an example value may equal the English.
      const errors = checkLocalGuidanceTranslation(english, artifact.fields)
        .filter(({ level, key }) => level === "error" && !(key.endsWith(".example-value") && artifact.fields[key] === english[key]));
      expect(errors, family.id).toEqual([]);
    }
  });
});
