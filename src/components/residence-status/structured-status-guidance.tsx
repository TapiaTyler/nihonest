"use client";

import Link from "next/link";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { applyGuidanceText } from "@/domain/residence-status/guidance-text";
import type { StructuredResidenceStatusGuidance } from "@/domain/residence-status/residence-status";

type ConditionType = StructuredResidenceStatusGuidance["qualificationPathways"][number]["allOf"][number]["type"];

/**
 * Structured guidance for one residence status. When Japanese is selected and a current overlay exists,
 * translated snippets replace their English originals one by one; untranslated snippets stay English.
 */
export function StructuredStatusGuidance({ guidance: canonicalGuidance, translation }: Readonly<{
  guidance: StructuredResidenceStatusGuidance;
  translation?: Readonly<Record<string, string>>;
}>) {
  const { locale, message } = useInterfaceMessages();
  const active = locale === "ja" && translation ? translation : undefined;
  const guidance = active ? applyGuidanceText(canonicalGuidance, active) : canonicalGuidance;
  const conditionLabel = (type: ConditionType) => message(`guidance.condition.${type}`);
  return (
    <section lang={active ? "ja" : "en"} className="mt-10" aria-labelledby="structured-guidance-heading">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">{message("guidance.pilot")}</p>
        <h2 id="structured-guidance-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          {message("guidance.heading")}
        </h2>
        <p className="mt-3 leading-7 text-slate-600">
          {message("guidance.intro")}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <OverviewCard label={message("guidance.routeShape")} value={guidance.routeKindLabel} />
        <OverviewCard label={message("guidance.workAuthorization")} value={guidance.workAuthorization.summary} />
        <OverviewCard label={message("guidance.renewal")} value={guidance.renewal.summary} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-950">{message("guidance.periods")}</h3>
        <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
          {guidance.periodsOfStay.map((period) => (
            <li key={`${period.label}-${period.duration}`}>
              <strong>{period.label}:</strong> {period.duration}
              {period.note && <span className="block text-slate-500">{period.note}</span>}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-6 text-slate-500">
          {message("guidance.periodsNote")}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <GuidanceList title={message("guidance.included")} items={guidance.activityScope.included} />
        <GuidanceList title={message("guidance.boundaries")} items={guidance.activityScope.boundaries} tone="caution" />
      </div>

      {guidance.qualificationPathways.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">{message("guidance.pathways")}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{message("guidance.pathwaysNote")}</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {guidance.qualificationPathways.map((pathway) => (
              <article key={pathway.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h4 className="font-semibold text-slate-950">{pathway.label}</h4>
                {pathway.allOf.length > 0 && <ConditionList label={message("guidance.allOf")} conditions={pathway.allOf} conditionLabel={conditionLabel} />}
                {pathway.anyOf.length > 0 && <ConditionList label={message("guidance.anyOf")} conditions={pathway.anyOf} conditionLabel={conditionLabel} />}
                {pathway.exceptions.length > 0 && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">{message("guidance.exceptions")}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                      {pathway.exceptions.map((exception) => <li key={exception}>{exception}</li>)}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}

      {guidance.organizationConditions.length > 0 && (
        <div className="mt-6"><GuidanceList title={message("guidance.organization")} items={guidance.organizationConditions} /></div>
      )}

      <div className="mt-6 rounded-2xl border border-brand-line bg-brand-soft p-5">
        <h3 className="font-semibold text-brand-deep">{message("guidance.outsideWork")}</h3>
        <p className="mt-2 text-sm leading-6 text-brand-deep">{guidance.workAuthorization.outsideActivityNote}</p>
      </div>

      {(guidance.transitions.length > 0 || guidance.evidenceCategories.length > 0) && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {guidance.transitions.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-950">{message("guidance.transitions")}</h3>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                {guidance.transitions.map((transition) => (
                  <li key={`${transition.label}-${transition.summary}`}>
                    <strong>{transition.label}:</strong> {transition.summary}{" "}
                    {transition.targetStatusId && (
                      <Link className="font-semibold text-brand-link underline decoration-brand-300 underline-offset-2 hover:text-brand-link-hover" href={`/residence-statuses/${transition.targetStatusId}`}>
                        {message("guidance.viewStatus")}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <GuidanceList title={message("guidance.evidence")} items={guidance.evidenceCategories} />
        </div>
      )}

      {guidance.sourceAssertions.some(({ effectiveFrom }) => effectiveFrom) && (
        <p className="mt-6 rounded-xl bg-amber-100 px-4 py-3 text-sm leading-6 text-amber-950">
          {message("guidance.timeSensitive")}
        </p>
      )}
    </section>
  );
}

function OverviewCard({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-800">{value}</p>
    </div>
  );
}

function GuidanceList({ title, items, tone = "default" }: Readonly<{ title: string; items: readonly string[]; tone?: "default" | "caution" }>) {
  return (
    <div className={`rounded-2xl border p-5 ${tone === "caution" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"}`}>
      <h3 className={tone === "caution" ? "font-semibold text-amber-950" : "font-semibold text-slate-950"}>{title}</h3>
      <ul className={`mt-3 list-disc space-y-2 pl-5 text-sm leading-6 ${tone === "caution" ? "text-amber-950" : "text-slate-700"}`}>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function ConditionList({ label, conditions, conditionLabel }: Readonly<{
  label: string;
  conditions: StructuredResidenceStatusGuidance["qualificationPathways"][number]["allOf"];
  conditionLabel: (type: ConditionType) => string;
}>) {
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
        {conditions.map((condition) => (
          <li key={`${condition.type}-${condition.summary}`}>
            <span className="font-semibold text-slate-900">{conditionLabel(condition.type)}:</span> {condition.summary}
          </li>
        ))}
      </ul>
    </div>
  );
}
