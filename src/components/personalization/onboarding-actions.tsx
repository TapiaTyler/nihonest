import { useId } from "react";
import { useInterfaceMessages } from "@/components/localization/interface-text";

/**
 * Save and skip actions for onboarding. Once a stage is chosen both buttons ride in a bar fixed to the bottom
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
          ? "sticky bottom-0 z-30 -mx-4 border-t border-line bg-page px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:-mx-6 sm:px-6"
          : ""}`}
      >
        {/* Save leads and skip follows on the same line. Phones show shorter labels so both fit on one line; the
            other label is display:none there, so the accessible name is always the text that is shown. */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* aria-disabled keeps the button focusable so assistive technology can reach the reason it cannot save yet. */}
          <button type="button" aria-disabled={!canSave} aria-describedby={canSave ? undefined : saveHintId} onClick={() => { if (canSave) onSave(); }} className="min-h-12 flex-1 rounded-full bg-brand px-5 font-semibold text-on-brand hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus aria-disabled:cursor-not-allowed aria-disabled:bg-surface-disabled aria-disabled:text-ink-muted aria-disabled:hover:bg-surface-disabled sm:flex-none sm:px-6">
            <ResponsiveLabel short={message("onboarding.saveShort")} full={message("onboarding.save")} />
          </button>
          <button type="button" onClick={onClearOrSkip} className="min-h-12 rounded-full px-4 font-semibold text-brand-link hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:px-5">
            <ResponsiveLabel short={message(hasPersonalization ? "onboarding.removeShort" : "onboarding.skipShort")} full={message(hasPersonalization ? "onboarding.remove" : "onboarding.skip")} />
          </button>
        </div>
        {!canSave && <p id={saveHintId} className="mt-3 text-sm leading-6 text-ink-muted">{message("onboarding.saveNeedsStage")}</p>}
      </div>

      <div className="mt-10 rounded-2xl border border-line bg-surface-subtle p-5 text-sm leading-6 text-ink-muted">
        <p className="font-semibold text-ink-strong">{message("onboarding.privateTitle")}</p>
        <p className="mt-2">{message("onboarding.privateBody")}</p>
      </div>
    </div>
  );
}

function ResponsiveLabel({ short, full }: Readonly<{ short: string; full: string }>) {
  return (
    <>
      <span className="sm:hidden">{short}</span>
      <span className="hidden sm:inline">{full}</span>
    </>
  );
}
