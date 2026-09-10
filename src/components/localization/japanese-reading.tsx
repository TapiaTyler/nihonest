export function JapaneseReading({ kana, romaji }: Readonly<{ kana?: string; romaji?: string }>) {
  if (!kana && !romaji) return null;
  return (
    <>
      {kana && <span lang="ja" data-reading-aid-kana={romaji ? true : undefined}>{kana}</span>}
      {kana && romaji && <span data-reading-aid-separator> · </span>}
      {romaji && <span data-reading-aid-romaji={kana ? true : undefined}>{romaji}</span>}
    </>
  );
}
