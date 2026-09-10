import { translationArtifactSchema, type TranslationArtifact } from "@/domain/translation/translation";

export type TranslationCache = Readonly<{
  get(key: string): Promise<TranslationArtifact | undefined>;
  set(key: string, artifact: TranslationArtifact): Promise<void>;
}>;

/** Test/development adapter; shared production persistence remains deferred. */
export class MemoryTranslationCache implements TranslationCache {
  private readonly artifacts = new Map<string, TranslationArtifact>();

  async get(key: string): Promise<TranslationArtifact | undefined> {
    return this.artifacts.get(key);
  }

  async set(key: string, artifact: TranslationArtifact): Promise<void> {
    this.artifacts.set(key, translationArtifactSchema.parse(artifact));
  }
}
