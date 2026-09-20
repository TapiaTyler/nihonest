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
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="button" disabled={!canSave} onClick={onSave} className="min-h-12 rounded-full bg-teal-800 px-6 font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600">Save my starting point</button>
        <button type="button" onClick={onClearOrSkip} className="min-h-12 rounded-full px-5 font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{hasPersonalization ? "Remove personalization" : "Skip and browse everything"}</button>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
        <p className="font-semibold text-slate-900">Private by default</p>
        <p className="mt-2">Nihonest stores these broad preferences only in this browser. They do not require an account and may disappear if you clear browser data.</p>
      </div>
    </div>
  );
}
