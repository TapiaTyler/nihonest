import type { JourneyStageId } from "@/domain/taxonomy/taxonomy";
import { journeyStages } from "@/domain/taxonomy/taxonomy";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import type { InterfaceMessageId } from "@/domain/localization/interface-message-catalogs/english";
import { japaneseTaxonomyLabels } from "@/data/translations/ja/taxonomy-labels";

const stageDescriptions: Record<JourneyStageId, InterfaceMessageId> = {
  planning: "onboarding.stagePlanningDescription",
  preparing: "onboarding.stagePreparingDescription",
  "recently-arrived": "onboarding.stageRecentlyArrivedDescription",
  "living-in-japan": "onboarding.stageLivingInJapanDescription",
};

export function OnboardingStageSelector({ selectedStage, onSelect }: Readonly<{
  selectedStage: JourneyStageId | undefined;
  onSelect: (stage: JourneyStageId) => void;
}>) {
  const { locale, message } = useInterfaceMessages();
  return (
    <fieldset>
      <legend className="text-xl font-semibold text-ink">{message("onboarding.stageLegend")}</legend>
      <p className="mt-2 leading-7 text-ink-muted">{message("onboarding.stageHelp")}</p>
      <p className="mt-1 leading-7 text-ink-muted">{message("onboarding.stageSaveNote")}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {journeyStages.map((stage) => (
          <label key={stage.id} className="has-checked:border-brand-accent has-checked:bg-brand-soft has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus flex min-h-32 cursor-pointer items-start gap-4 rounded-2xl border border-line-strong bg-surface p-5 shadow-sm transition-colors hover:border-brand-500">
            <input type="radio" name="journey-stage" value={stage.id} checked={selectedStage === stage.id} onChange={() => onSelect(stage.id)} className="mt-1 size-5 shrink-0 accent-brand" />
            <span>
              <span className="block text-lg font-semibold text-ink">{locale === "ja" ? japaneseTaxonomyLabels.journeyStage[stage.id] : stage.label}</span>
              <span className="mt-2 block leading-7 text-ink-muted">{message(stageDescriptions[stage.id])}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
