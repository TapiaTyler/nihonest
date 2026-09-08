"use client";

import type { ChecklistProgress } from "@/domain/roadmap/personalized-roadmap";
import { useChecklistProgress } from "./checklist-progress-provider";

const progressLabels: Record<ChecklistProgress["state"], string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  complete: "Complete",
};

export function JourneyChecklistControl({ checklistId }: Readonly<{ checklistId: string }>) {
  const { isReady, records, setProgress } = useChecklistProgress();
  const state = records.find((record) => record.checklistId === checklistId)?.state ?? "not-started";

  return (
    <div>
      <label htmlFor={`progress-${checklistId}`} className="sr-only">Progress for this journey step</label>
      <select
        id={`progress-${checklistId}`}
        value={state}
        disabled={!isReady}
        onChange={(event) => setProgress(checklistId, event.target.value as ChecklistProgress["state"])}
        className="app-select min-h-11 max-w-40 rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm font-semibold text-slate-800 shadow-sm focus:border-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700 disabled:cursor-wait disabled:opacity-50"
      >
        {Object.entries(progressLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </div>
  );
}
