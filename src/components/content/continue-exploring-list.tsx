"use client";

import { Children, type ReactNode, useState } from "react";
import { useInterfaceMessages } from "@/components/localization/interface-text";

const batchSize = 4;

export function ContinueExploringList({ cards, guides }: Readonly<{
  cards: ReactNode;
  guides: ReactNode;
}>) {
  const cardItems = Children.toArray(cards);
  const guideItems = Children.toArray(guides);
  const totalCount = cardItems.length + guideItems.length;
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const { format } = useInterfaceMessages();
  const visibleCards = cardItems.slice(0, visibleCount);
  const visibleGuides = guideItems.slice(0, Math.max(0, visibleCount - cardItems.length));
  const remainingCount = Math.max(0, totalCount - visibleCount);
  const nextBatchCount = Math.min(batchSize, remainingCount);

  return (
    <>
      {visibleCards.length > 0 && <div className="mt-5 grid gap-3 sm:grid-cols-2">{visibleCards}</div>}
      {visibleGuides.length > 0 && <ul className="mt-6 space-y-3">{visibleGuides}</ul>}
      {remainingCount > 0 && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((current) => Math.min(current + batchSize, totalCount))}
            className="inline-flex min-h-11 items-center rounded-full border border-brand-300 bg-surface px-5 text-sm font-semibold text-brand-link transition-colors hover:border-brand-500 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {format("article.showMore", { count: nextBatchCount })}
          </button>
        </div>
      )}
      <p className="sr-only" aria-live="polite">{format("article.showingRecommendations", { visible: Math.min(visibleCount, totalCount), total: totalCount })}</p>
    </>
  );
}
