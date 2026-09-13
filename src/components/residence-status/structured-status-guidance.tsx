import Link from "next/link";
import type { StructuredResidenceStatusGuidance } from "@/domain/residence-status/residence-status";

const conditionLabels: Record<StructuredResidenceStatusGuidance["qualificationPathways"][number]["allOf"][number]["type"], string> = {
  activity: "Activity",
  education: "Education",
  experience: "Experience",
  examination: "Examination",
  license: "Professional qualification",
  language: "Language",
  remuneration: "Remuneration",
  organization: "Organization",
  relationship: "Relationship",
  program: "Program",
};

export function StructuredStatusGuidance({ guidance }: Readonly<{ guidance: StructuredResidenceStatusGuidance }>) {
  return (
    <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-7" aria-labelledby="structured-guidance-heading">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Structured research pilot</p>
        <h2 id="structured-guidance-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          How this route is assessed
        </h2>
        <p className="mt-3 leading-7 text-slate-600">
          This draft organizes official rules for comparison. It cannot determine an individual&apos;s eligibility or replace the current official checklist.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <OverviewCard label="Route shape" value={guidance.routeKindLabel} />
        <OverviewCard label="Work authorization" value={guidance.workAuthorization.summary} />
        <OverviewCard label="Renewal" value={guidance.renewal.summary} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-950">Available periods of stay</h3>
        <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
          {guidance.periodsOfStay.map((period) => (
            <li key={`${period.label}-${period.duration}`}>
              <strong>{period.label}:</strong> {period.duration}
              {period.note && <span className="block text-slate-500">{period.note}</span>}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-6 text-slate-500">
          These are available categories, not a promised grant. The period requested and the period actually granted may differ.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <GuidanceList title="Activities this route can cover" items={guidance.activityScope.included} />
        <GuidanceList title="Important boundaries" items={guidance.activityScope.boundaries} tone="caution" />
      </div>

      {guidance.qualificationPathways.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">Qualification pathways to examine</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Each card is a separate possible route through the criteria; the cards are not cumulative.</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {guidance.qualificationPathways.map((pathway) => (
              <article key={pathway.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h4 className="font-semibold text-slate-950">{pathway.label}</h4>
                {pathway.allOf.length > 0 && <ConditionList label="All of these" conditions={pathway.allOf} />}
                {pathway.anyOf.length > 0 && <ConditionList label="At least one of these" conditions={pathway.anyOf} />}
                {pathway.exceptions.length > 0 && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Exceptions and cautions</p>
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
        <div className="mt-6"><GuidanceList title="Organization or host conditions" items={guidance.organizationConditions} /></div>
      )}

      <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-5">
        <h3 className="font-semibold text-teal-950">Work outside this route</h3>
        <p className="mt-2 text-sm leading-6 text-teal-950">{guidance.workAuthorization.outsideActivityNote}</p>
      </div>

      {(guidance.transitions.length > 0 || guidance.evidenceCategories.length > 0) && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {guidance.transitions.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-950">Transitions to examine</h3>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                {guidance.transitions.map((transition) => (
                  <li key={`${transition.label}-${transition.summary}`}>
                    <strong>{transition.label}:</strong> {transition.summary}{" "}
                    {transition.targetStatusId && (
                      <Link className="font-semibold text-teal-800 underline decoration-teal-300 underline-offset-2 hover:text-teal-600" href={`/residence-statuses/${transition.targetStatusId}`}>
                        View status
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <GuidanceList title="Evidence categories to plan for" items={guidance.evidenceCategories} />
        </div>
      )}

      {guidance.sourceAssertions.some(({ effectiveFrom }) => effectiveFrom) && (
        <p className="mt-6 rounded-xl bg-amber-100 px-4 py-3 text-sm leading-6 text-amber-950">
          This route contains time-sensitive rules. Effective dates are attached to the affected source assertions so later reforms can be reviewed without silently preserving an outdated requirement.
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

function ConditionList({ label, conditions }: Readonly<{
  label: string;
  conditions: StructuredResidenceStatusGuidance["qualificationPathways"][number]["allOf"];
}>) {
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
        {conditions.map((condition) => (
          <li key={`${condition.type}-${condition.summary}`}>
            <span className="font-semibold text-slate-900">{conditionLabels[condition.type]}:</span> {condition.summary}
          </li>
        ))}
      </ul>
    </div>
  );
}
