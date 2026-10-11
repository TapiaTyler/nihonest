"use client";

import { Children, type ReactNode, useId, useState } from "react";
import { useInterfaceMessages } from "@/components/localization/interface-text";

const batchSize = 4;

export function OfficialSourceItems({ children }: Readonly<{ children: ReactNode }>) {
  const items = Children.toArray(children);
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const listId = useId();
  const { format } = useInterfaceMessages();
  const remainingCount = Math.max(0, items.length - visibleCount);
  const nextBatchCount = Math.min(batchSize, remainingCount);

  return (
    <>
      <ul id={listId} className="mt-5 space-y-3">{items.slice(0, visibleCount)}</ul>
      {remainingCount > 0 && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            aria-controls={listId}
            onClick={() => setVisibleCount((current) => Math.min(current + batchSize, items.length))}
            className="inline-flex min-h-11 items-center rounded-full border border-brand-300 bg-surface px-5 text-sm font-semibold text-brand-link transition-colors hover:border-brand-500 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {format("article.showMore", { count: nextBatchCount })}
          </button>
        </div>
      )}
      <p className="sr-only" aria-live="polite">{format("sources.showing", { visible: Math.min(visibleCount, items.length), total: items.length })}</p>
    </>
  );
}
