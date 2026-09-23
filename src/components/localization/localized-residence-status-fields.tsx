"use client";

import type { ResidenceStatus } from "@/domain/residence-status/residence-status";
import type { ResidenceStatusTranslation } from "@/lib/content/translations";
import { useContentLocale } from "./content-locale-provider";
import { useInterfaceMessages } from "./interface-text";

function activeTranslation(status: ResidenceStatus, translation?: ResidenceStatusTranslation, locale = "en") {
  return translation?.contentId === status.id && translation.targetLocale === locale ? translation : undefined;
}

export function LocalizedResidenceStatusSummary({ status, translation }: Readonly<{
  status: ResidenceStatus;
  translation?: ResidenceStatusTranslation;
}>) {
  const { locale } = useContentLocale();
  const active = activeTranslation(status, translation, locale);
  return <p lang={active ? "ja" : "en"} className="mt-5 text-lg leading-8 text-slate-600">{active?.summary ?? status.summary}</p>;
}

export function LocalizedResidenceStatusPurpose({ status, translation }: Readonly<{
  status: ResidenceStatus;
  translation?: ResidenceStatusTranslation;
}>) {
  const { locale } = useContentLocale();
  const { message } = useInterfaceMessages();
  const active = activeTranslation(status, translation, locale);
  return (
    <section lang={active ? "ja" : "en"} className="mt-10" aria-labelledby="purpose-heading">
      <h2 id="purpose-heading" className="text-2xl font-semibold tracking-tight text-slate-950">{message("status.generalPurpose")}</h2>
      <p className="mt-4 leading-8 text-slate-700">{active?.purpose ?? status.purpose}</p>
    </section>
  );
}

export function LocalizedResidenceStatusActivities({ status, translation }: Readonly<{
  status: ResidenceStatus;
  translation?: ResidenceStatusTranslation;
}>) {
  const { locale } = useContentLocale();
  const { message } = useInterfaceMessages();
  const active = activeTranslation(status, translation, locale);
  const activities = active?.typicalActivities ?? status.typicalActivities;
  const examples = active?.examples ?? status.examples;
  const considerations = active?.considerations ?? status.considerations;
  return (
    <div lang={active ? "ja" : "en"}>
      <section className="mt-10" aria-labelledby="activities-heading">
        <h2 id="activities-heading" className="text-2xl font-semibold tracking-tight text-slate-950">{message("status.typicalActivities")}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-slate-700">
          {activities.map((activity) => <li key={activity}>{activity}</li>)}
        </ul>
        {examples.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{message("status.officialExamples")}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {examples.map((example) => <li key={example} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{example}</li>)}
            </ul>
          </div>
        )}
      </section>
      <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6" aria-labelledby="verify-heading">
        <h2 id="verify-heading" className="text-xl font-semibold tracking-tight text-amber-950">{message("status.whatToVerify")}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-amber-950">
          {considerations.map((consideration) => <li key={consideration}>{consideration}</li>)}
        </ul>
      </section>
    </div>
  );
}
