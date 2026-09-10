export type TranslationSegment = Readonly<{ id: string; text: string }>;

export type TranslationProvider = Readonly<{
  id: string;
  model: string;
  translate(request: Readonly<{
    sourceLocale: "en";
    targetLocale: string;
    segments: readonly TranslationSegment[];
  }>): Promise<readonly TranslationSegment[]>;
}>;
