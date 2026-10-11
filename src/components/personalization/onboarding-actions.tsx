import { useId } from "react";
import { useInterfaceMessages } from "@/components/localization/interface-text";

/**
 * Save and skip actions for onboarding. Once a stage is chosen the Save button rides in a bar fixed to the bottom
 * of the viewport, because the optional journey and route sections below the stage make this a long page and the
 * choice that enables Save is at the top. The wrapper uses `display: contents` so the bar is a direct child of the
 * form and can stay stuck for the whole length of the page; until a stage is chosen the same markup sits in flow.
 */
export function OnboardingActions({
  canSave,
  hasPersonalization,
  onSave,
  onClearOrSkip,
}: Readonly<{
  canSave: boolean;
  hasPersonalization: boolean;
  onSave: () => void;
  onClearOrSkip: () => void;
}>) {
  const { message } = useInterfaceMessages();
  const saveHintId = useId();
  return (
    <div className="contents">
      <div
        className={`mt-12 ${canSave
          ? "sticky bottom-0 z-30 -mx-4 border-t border-slate-200 bg-stone-50 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:-mx-6 sm:px-6"
          : ""}`}
      >
        {/* aria-disabled keeps the button focusable so assistive technology can reach the reason it cannot save yet. */}
        <button type="button" aria-disabled={!canSave} aria-describedby={canSave ? undefined : saveHintId} onClick={() => { if (canSave) onSave(); }} className="min-h-12 w-full rounded-full bg-teal-800 px-6 font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700 aria-disabled:cursor-not-allowed aria-disabled:bg-slate-300 aria-disabled:text-slate-600 aria-disabled:hover:bg-slate-300 sm:w-auto">{message("onboarding.save")}</button>
        {!canSave && <p id={saveHintId} className="mt-3 text-sm leading-6 text-slate-600">{message("onboarding.saveNeedsStage")}</p>}
      </div>

      <div className="mt-4">
        <button type="button" onClick={onClearOrSkip} className="min-h-12 rounded-full px-5 font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{message(hasPersonalization ? "onboarding.remove" : "onboarding.skip")}</button>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
        <p className="font-semibold text-slate-900">{message("onboarding.privateTitle")}</p>
        <p className="mt-2">{message("onboarding.privateBody")}</p>
      </div>
    </div>
  );
}
