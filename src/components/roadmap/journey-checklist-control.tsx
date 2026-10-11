"use client";

import { useInterfaceMessages } from "@/components/localization/interface-text";
import type { ChecklistProgress } from "@/domain/roadmap/personalized-roadmap";
import { useChecklistProgress } from "./checklist-progress-provider";

const progressStates: readonly ChecklistProgress["state"][] = ["not-started", "in-progress", "complete"];

export function JourneyChecklistControl({ checklistId }: Readonly<{ checklistId: string }>) {
  const { isReady, records, setProgress } = useChecklistProgress();
  const { message } = useInterfaceMessages();
  const state = records.find((record) => record.checklistId === checklistId)?.state ?? "not-started";

  return (
    <div>
      <label htmlFor={`progress-${checklistId}`} className="sr-only">{message("progress.stepLabel")}</label>
      <select
        id={`progress-${checklistId}`}
        value={state}
        disabled={!isReady}
        onChange={(event) => setProgress(checklistId, event.target.value as ChecklistProgress["state"])}
        className="app-select min-h-11 max-w-40 rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm font-semibold text-slate-800 shadow-sm focus:border-brand-accent focus:outline-2 focus:outline-offset-2 focus:outline-focus disabled:cursor-wait disabled:opacity-50"
      >
        {progressStates.map((value) => <option key={value} value={value}>{message(`progress.${value}`)}</option>)}
      </select>
    </div>
  );
}
