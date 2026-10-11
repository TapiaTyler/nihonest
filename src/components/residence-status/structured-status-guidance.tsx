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
        <h2 id="structured-guidance-heading" className="mt-2 text-2xl font-semibold tracking-tight text-ink">
          {message("guidance.heading")}
        </h2>
        <p className="mt-3 leading-7 text-ink-muted">
          {message("guidance.intro")}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <OverviewCard label={message("guidance.routeShape")} value={guidance.routeKindLabel} />
        <OverviewCard label={message("guidance.workAuthorization")} value={guidance.workAuthorization.summary} />
        <OverviewCard label={message("guidance.renewal")} value={guidance.renewal.summary} />
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <h3 className="font-semibold text-ink">{message("guidance.periods")}</h3>
        <ul className="mt-3 space-y-3 text-sm leading-6 text-ink-body">
          {guidance.periodsOfStay.map((period) => (
            <li key={`${period.label}-${period.duration}`}>
              <strong>{period.label}:</strong> {period.duration}
              {period.note && <span className="block text-ink-subtle">{period.note}</span>}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-6 text-ink-subtle">
          {message("guidance.periodsNote")}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <GuidanceList title={message("guidance.included")} items={guidance.activityScope.included} />
        <GuidanceList title={message("guidance.boundaries")} items={guidance.activityScope.boundaries} tone="caution" />
      </div>

      {guidance.qualificationPathways.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold tracking-tight text-ink">{message("guidance.pathways")}</h3>
          <p className="mt-2 text-sm leading-6 text-ink-muted">{message("guidance.pathwaysNote")}</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {guidance.qualificationPathways.map((pathway) => (
              <article key={pathway.id} className="rounded-2xl border border-line bg-surface p-5">
                <h4 className="font-semibold text-ink">{pathway.label}</h4>
                {pathway.allOf.length > 0 && <ConditionList label={message("guidance.allOf")} conditions={pathway.allOf} conditionLabel={conditionLabel} />}
                {pathway.anyOf.length > 0 && <ConditionList label={message("guidance.anyOf")} conditions={pathway.anyOf} conditionLabel={conditionLabel} />}
                {pathway.exceptions.length > 0 && (
                  <div className="mt-4 border-t border-line-faint pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-caution-text">{message("guidance.exceptions")}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-ink-muted">
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
            <div className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="font-semibold text-ink">{message("guidance.transitions")}</h3>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-ink-body">
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
        <p className="mt-6 rounded-xl bg-caution-softer px-4 py-3 text-sm leading-6 text-caution-ink">
          {message("guidance.timeSensitive")}
        </p>
      )}
    </section>
  );
}

function OverviewCard({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">{label}</p>
      <p className="mt-2 text-sm leading-6 text-ink-firm">{value}</p>
    </div>
  );
}

function GuidanceList({ title, items, tone = "default" }: Readonly<{ title: string; items: readonly string[]; tone?: "default" | "caution" }>) {
  return (
    <div className={`rounded-2xl border p-5 ${tone === "caution" ? "border-caution-line bg-caution-soft" : "border-line bg-surface"}`}>
      <h3 className={tone === "caution" ? "font-semibold text-caution-ink" : "font-semibold text-ink"}>{title}</h3>
      <ul className={`mt-3 list-disc space-y-2 pl-5 text-sm leading-6 ${tone === "caution" ? "text-caution-ink" : "text-ink-body"}`}>
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
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">{label}</p>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-ink-body">
        {conditions.map((condition) => (
          <li key={`${condition.type}-${condition.summary}`}>
            <span className="font-semibold text-ink-strong">{conditionLabel(condition.type)}:</span> {condition.summary}
          </li>
        ))}
      </ul>
    </div>
  );
}
