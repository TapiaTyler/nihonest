"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ActivityCrossReference, ActivityCrossReferenceAnswers } from "@/domain/activity-cross-reference/activity-cross-reference";
import { assertionIsApproved, getApplicableActivityRules } from "@/domain/activity-cross-reference/activity-cross-reference";
import type { OfficialSource } from "@/domain/source/source";

const layerLabels: Record<ActivityCrossReference["rules"][number]["layer"], string> = {
  immigration: "Immigration",
  "employment-contract": "Employment or contract",
  "professional-licensing": "Professional licensing",
  tax: "Tax",
  "social-insurance": "Social insurance",
  "local-rules": "Local rules",
};

function stateFromLocation(activities: readonly ActivityCrossReference[]) {
  const params = new URLSearchParams(window.location.search);
  const activity = activities.find(({ id }) => id === params.get("activity"));
  const answers = Object.fromEntries(
    (activity?.questions ?? []).flatMap((question) => {
      const answer = params.get(question.id);
      return answer && question.choices.some(({ id }) => id === answer) ? [[question.id, answer]] : [];
    }),
  );
  return { activityId: activity?.id, answers };
}

function hrefForState(activityId: string | undefined, answers: ActivityCrossReferenceAnswers, returnTo: string) {
  const params = new URLSearchParams();
  if (activityId) params.set("activity", activityId);
  for (const [questionId, choiceId] of Object.entries(answers)) params.set(questionId, choiceId);
  params.set("returnTo", returnTo);
  const search = params.toString();
  return search ? `/can-i-do-this?${search}` : "/can-i-do-this";
}

export function ActivityCrossReferenceExplorer({
  activities,
  officialSources,
  initialActivityId,
  initialAnswers,
  returnTo,
}: Readonly<{
  activities: readonly ActivityCrossReference[];
  officialSources: readonly OfficialSource[];
  initialActivityId?: string;
  initialAnswers: ActivityCrossReferenceAnswers;
  returnTo: string;
}>) {
  const [activityId, setActivityId] = useState(initialActivityId);
  const [answers, setAnswers] = useState<ActivityCrossReferenceAnswers>(initialAnswers);
  const activity = activities.find(({ id }) => id === activityId);
  const allQuestionsAnswered = Boolean(activity && activity.questions.every(({ id }) => answers[id]));
  const applicableRules = useMemo(
    () => activity && (activity.mode === "handoff" || allQuestionsAnswered) ? getApplicableActivityRules(activity, answers) : [],
    [activity, allQuestionsAnswered, answers],
  );

  useEffect(() => {
    function restoreFromHistory() {
      const restored = stateFromLocation(activities);
      setActivityId(restored.activityId);
      setAnswers(restored.answers);
    }

    window.addEventListener("popstate", restoreFromHistory);
    return () => window.removeEventListener("popstate", restoreFromHistory);
  }, [activities]);

  function chooseActivity(nextActivityId: string) {
    const nextActivity = activities.find(({ id }) => id === nextActivityId);
    if (!nextActivity) return;
    setActivityId(nextActivityId);
    setAnswers({});
    window.history.pushState(null, "", hrefForState(nextActivityId, {}, returnTo));
    requestAnimationFrame(() => document.querySelector<HTMLElement>("#activity-questions")?.focus());
  }

  function answerQuestion(questionId: string, choiceId: string) {
    const nextAnswers = { ...answers, [questionId]: choiceId };
    setAnswers(nextAnswers);
    window.history.replaceState(null, "", hrefForState(activityId, nextAnswers, returnTo));
  }

  function reset() {
    setActivityId(undefined);
    setAnswers({});
    window.history.pushState(null, "", hrefForState(undefined, {}, returnTo));
    requestAnimationFrame(() => document.querySelector<HTMLElement>("#activity-picker")?.focus());
  }

  return (
    <div className="mt-10">
      <section aria-labelledby="activity-picker" className="rounded-3xl border border-slate-200 bg-slate-100 p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Step 1</p>
            <h2 id="activity-picker" tabIndex={-1} className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">What are you trying to do?</h2>
          </div>
          {activity && <button type="button" onClick={reset} className="min-h-11 rounded-full px-4 text-sm font-semibold text-teal-800 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Start over</button>}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {activities.map((option) => {
            const selected = option.id === activityId;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => chooseActivity(option.id)}
                className="min-h-36 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-teal-500 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 aria-pressed:border-teal-700 aria-pressed:ring-2 aria-pressed:ring-teal-700/20"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-950">{option.shortLabel}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${option.mode === "guided" ? "bg-teal-50 text-teal-800" : "bg-slate-100 text-slate-600"}`}>
                    {option.mode === "guided" ? "Guided check" : "Focused guide"}
                  </span>
                </span>
                <span className="mt-3 block text-sm leading-6 text-slate-600">{option.description}</span>
                <span className="mt-4 block text-sm font-semibold text-teal-800">{selected ? "Selected" : "Explore this activity →"}</span>
              </button>
            );
          })}
        </div>
      </section>

      {activity?.mode === "guided" && (
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="activity-questions">
          <p className="eyebrow">Step 2</p>
          <h2 id="activity-questions" tabIndex={-1} className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Add the facts that change where you should look</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">These answers stay in this page&apos;s URL for refresh and browser navigation. Nihonest does not save them to your device or account.</p>
          <div className="mt-7 space-y-8">
            {activity.questions.map((question, questionIndex) => (
              <fieldset key={question.id}>
                <legend className="font-semibold text-slate-950"><span className="text-teal-700">{questionIndex + 1}.</span> {question.prompt}</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {question.choices.map((choice) => (
                    <label key={choice.id} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-stone-50 px-4 py-3 hover:border-teal-500 has-[:checked]:border-teal-700 has-[:checked]:bg-teal-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-700">
                      <input type="radio" name={question.id} value={choice.id} checked={answers[question.id] === choice.id} onChange={() => answerQuestion(question.id, choice.id)} className="mt-1 accent-teal-800" />
                      <span className="text-sm font-medium leading-6 text-slate-800">{choice.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          {!allQuestionsAnswered && <p className="mt-7 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600" aria-live="polite">Answer each question to see the relevant rule layers and reading paths.</p>}
        </section>
      )}

      {activity && (activity.mode === "handoff" || allQuestionsAnswered) && (
        <section className="mt-8" aria-labelledby="activity-results">
          <p className="eyebrow">{activity.mode === "guided" ? "Step 3" : "Focused guidance"}</p>
          <h2 id="activity-results" className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">What you need to check</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">These are separate questions raised by your selection. They are not an eligibility decision or legal conclusion.</p>

          {activity.questions.length > 0 && (
            <dl className="mt-6 flex flex-wrap gap-2" aria-label="Your selected facts">
              {activity.questions.map((question) => {
                const selectedChoice = question.choices.find(({ id }) => id === answers[question.id]);
                return <div key={question.id} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm"><dt className="sr-only">{question.label}</dt><dd><span className="text-slate-500">{question.label}:</span> <span className="font-semibold text-slate-800">{selectedChoice?.label}</span></dd></div>;
              })}
            </dl>
          )}

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            {applicableRules.map((rule) => {
              const approved = assertionIsApproved(rule.assertion);
              const sourceRecords = (rule.assertion?.sourceIds ?? []).flatMap((sourceId) => {
                const source = officialSources.find(({ id }) => id === sourceId);
                return source ? [source] : [];
              });
              return (
                <article key={rule.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">{layerLabels[rule.layer]}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${approved ? "bg-teal-50 text-teal-800" : "bg-amber-50 text-amber-800"}`}>{approved ? "Coverage: Reviewed" : "Coverage: Authority check required"}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{rule.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{rule.orientation}</p>
                  {approved && rule.assertion && <p className="mt-3 rounded-xl bg-teal-50 p-4 text-sm leading-6 text-teal-950">{rule.assertion.statement}</p>}
                  {!approved && rule.assertion && <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950">The detailed rule statement is still awaiting editorial approval. Use the reading and official sources below to confirm this case.</p>}
                  <h4 className="mt-5 text-sm font-semibold text-slate-950">Facts to verify</h4>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">{rule.verify.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true" className="text-teal-700">•</span><span>{item}</span></li>)}</ul>
                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <p className="text-sm font-semibold text-slate-950">Read next</p>
                    <ul className="mt-2 space-y-1">{rule.links.map((link) => <li key={`${link.kind}-${link.id}`}><Link href={link.href} className="inline-flex min-h-11 items-center text-sm font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{link.label} →</Link></li>)}</ul>
                    {sourceRecords.length > 0 && <><p className="mt-3 text-sm font-semibold text-slate-950">Official sources</p><ul className="mt-2 space-y-1">{sourceRecords.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-sm text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{source.organization}: {source.title}<span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul></>}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
