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
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="button" disabled={!canSave} onClick={onSave} className="min-h-12 rounded-full bg-teal-800 px-6 font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600">{message("onboarding.save")}</button>
        <button type="button" onClick={onClearOrSkip} className="min-h-12 rounded-full px-5 font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{message(hasPersonalization ? "onboarding.remove" : "onboarding.skip")}</button>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
        <p className="font-semibold text-slate-900">{message("onboarding.privateTitle")}</p>
        <p className="mt-2">{message("onboarding.privateBody")}</p>
      </div>
    </div>
  );
}
import { useInterfaceMessages } from "@/components/localization/interface-text";
