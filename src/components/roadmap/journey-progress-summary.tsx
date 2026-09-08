"use client";

import { useChecklistProgress } from "./checklist-progress-provider";

export function JourneyProgressSummary({ checklistIds }: Readonly<{ checklistIds: readonly string[] }>) {
  const { records } = useChecklistProgress();
  const relevantProgress = new Map(records.filter(({ checklistId }) => checklistIds.includes(checklistId)).map((record) => [record.checklistId, record.state]));
  const completeCount = checklistIds.filter((id) => relevantProgress.get(id) === "complete").length;
  const inProgressCount = checklistIds.filter((id) => relevantProgress.get(id) === "in-progress").length;
  const percentage = checklistIds.length > 0 ? Math.round((completeCount / checklistIds.length) * 100) : 0;

  return (
    <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="font-semibold text-slate-900">Your checklist progress</p>
        <p className="text-slate-600">{completeCount} of {checklistIds.length} complete{inProgressCount > 0 ? ` · ${inProgressCount} in progress` : ""}</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-label="Journey completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
        <div className="h-full rounded-full bg-teal-700 transition-[width]" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
