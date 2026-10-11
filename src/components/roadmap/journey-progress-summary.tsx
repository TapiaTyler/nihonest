"use client";

import { useInterfaceMessages } from "@/components/localization/interface-text";
import { useChecklistProgress } from "./checklist-progress-provider";

export function JourneyProgressSummary({ checklistIds }: Readonly<{ checklistIds: readonly string[] }>) {
  const { records } = useChecklistProgress();
  const { message, format } = useInterfaceMessages();
  const relevantProgress = new Map(records.filter(({ checklistId }) => checklistIds.includes(checklistId)).map((record) => [record.checklistId, record.state]));
  const completeCount = checklistIds.filter((id) => relevantProgress.get(id) === "complete").length;
  const inProgressCount = checklistIds.filter((id) => relevantProgress.get(id) === "in-progress").length;
  const percentage = checklistIds.length > 0 ? Math.round((completeCount / checklistIds.length) * 100) : 0;

  return (
    <div className="mt-6 rounded-2xl border border-brand-line bg-brand-soft/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="font-semibold text-slate-900">{message("progress.yourChecklist")}</p>
        <p className="text-slate-600">{format("roadmap.phaseProgress", { complete: completeCount, total: checklistIds.length })}{inProgressCount > 0 ? format("roadmap.inProgressSuffix", { count: inProgressCount }) : ""}</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-label={message("progress.journeyCompletion")} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
        <div className="h-full rounded-full bg-brand-hover transition-[width]" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
