"use client";

import { Children, type ReactNode, useState } from "react";

const batchSize = 4;

export function ContinueExploringList({ cards, guides }: Readonly<{
  cards: ReactNode;
  guides: ReactNode;
}>) {
  const cardItems = Children.toArray(cards);
  const guideItems = Children.toArray(guides);
  const totalCount = cardItems.length + guideItems.length;
  const [visibleCount, setVisibleCount] = useState(batchSize);
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
            className="inline-flex min-h-11 items-center rounded-full border border-teal-300 bg-white px-5 text-sm font-semibold text-teal-800 transition-colors hover:border-teal-500 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Show {nextBatchCount} more
          </button>
        </div>
      )}
      <p className="sr-only" aria-live="polite">Showing {Math.min(visibleCount, totalCount)} of {totalCount} recommendations.</p>
    </>
  );
}
