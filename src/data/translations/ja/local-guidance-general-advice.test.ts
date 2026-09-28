import { describe, expect, it } from "vitest";
import { generalLocalAdvice } from "@/data/local-guidance/general-advice";
import { japaneseGeneralLocalAdviceTranslations } from "@/data/translations/ja/local-guidance-general-advice";
import { checkLocalGuidanceTranslation } from "@/domain/translation/local-guidance-translation-checks";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";

describe("Japanese general local advice", () => {
  it("has one current, complete, mechanically clean artifact per article with general advice", () => {
    const articleIds = Object.keys(generalLocalAdvice).sort();
    expect(japaneseGeneralLocalAdviceTranslations.map(({ contentId }) => contentId).sort()).toEqual(articleIds);
    for (const [articleId, advice] of Object.entries(generalLocalAdvice)) {
      const artifact = japaneseGeneralLocalAdviceTranslations.find(({ contentId }) => contentId === articleId)!;
      const english = translationSourceFields["local-guidance-general-advice"](advice);
      expect(artifact.contentKind).toBe("local-guidance-general-advice");
      expect(artifact.reviewState).toBe("machine-translated");
      expect(artifact.sourceRevision, `${articleId} is stale; translate the changed English again`).toBe(createTranslationSourceRevision(english));
      expect(checkLocalGuidanceTranslation(english, artifact.fields).filter(({ level }) => level === "error"), articleId).toEqual([]);
    }
  });
});
