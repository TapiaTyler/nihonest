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
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* aria-disabled keeps the button focusable so assistive technology can reach the reason it cannot save yet. */}
        <button type="button" aria-disabled={!canSave} aria-describedby={canSave ? undefined : saveHintId} onClick={() => { if (canSave) onSave(); }} className="min-h-12 rounded-full bg-teal-800 px-6 font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700 aria-disabled:cursor-not-allowed aria-disabled:bg-slate-300 aria-disabled:text-slate-600 aria-disabled:hover:bg-slate-300">{message("onboarding.save")}</button>
        <button type="button" onClick={onClearOrSkip} className="min-h-12 rounded-full px-5 font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{message(hasPersonalization ? "onboarding.remove" : "onboarding.skip")}</button>
      </div>
      {!canSave && <p id={saveHintId} className="mt-3 text-sm leading-6 text-slate-600">{message("onboarding.saveNeedsStage")}</p>}

      <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
        <p className="font-semibold text-slate-900">{message("onboarding.privateTitle")}</p>
        <p className="mt-2">{message("onboarding.privateBody")}</p>
      </div>
    </div>
  );
}
import { useId } from "react";
import { useInterfaceMessages } from "@/components/localization/interface-text";
