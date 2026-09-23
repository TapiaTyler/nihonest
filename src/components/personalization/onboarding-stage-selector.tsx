import type { JourneyStageId } from "@/domain/taxonomy/taxonomy";
import { journeyStages } from "@/domain/taxonomy/taxonomy";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { japaneseTaxonomyLabels } from "@/data/translations/ja/taxonomy-labels";

const stageDescriptions: Record<JourneyStageId, string> = {
  planning: "I am researching whether and how to move to Japan.",
  preparing: "I am actively arranging my move or upcoming stay.",
  "recently-arrived": "I have arrived and am working through initial procedures.",
  "living-in-japan": "I am established in Japan and managing ongoing responsibilities.",
};

const japaneseStageDescriptions: Record<JourneyStageId, string> = {
  planning: "日本へ移るかどうか、どのように移るかを調べています。",
  preparing: "移住または滞在に向けた具体的な準備を進めています。",
  "recently-arrived": "来日し、最初に必要な手続きを進めています。",
  "living-in-japan": "日本での生活が始まり、継続的な手続きを管理しています。",
};

export function OnboardingStageSelector({ selectedStage, onSelect }: Readonly<{
  selectedStage: JourneyStageId | undefined;
  onSelect: (stage: JourneyStageId) => void;
}>) {
  const { locale, message } = useInterfaceMessages();
  return (
    <fieldset>
      <legend className="text-xl font-semibold text-slate-950">{message("onboarding.stageLegend")}</legend>
      <p className="mt-2 leading-7 text-slate-600">{message("onboarding.stageHelp")}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {journeyStages.map((stage) => (
          <label key={stage.id} className="has-checked:border-teal-700 has-checked:bg-teal-50 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-teal-700 flex min-h-32 cursor-pointer items-start gap-4 rounded-2xl border border-slate-300 bg-white p-5 shadow-sm transition-colors hover:border-teal-500">
            <input type="radio" name="journey-stage" value={stage.id} checked={selectedStage === stage.id} onChange={() => onSelect(stage.id)} className="mt-1 size-5 shrink-0 accent-teal-800" />
            <span>
              <span className="block text-lg font-semibold text-slate-950">{locale === "ja" ? japaneseTaxonomyLabels.journeyStage[stage.id] : stage.label}</span>
              <span className="mt-2 block leading-7 text-slate-600">{locale === "ja" ? japaneseStageDescriptions[stage.id] : stageDescriptions[stage.id]}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
