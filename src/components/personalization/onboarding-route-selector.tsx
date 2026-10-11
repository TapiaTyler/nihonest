import type { GuidedJourney } from "@/domain/discovery/discovery";
import type { JourneyRouteOption } from "@/domain/personalization/journey-search";
import { useInterfaceMessages } from "@/components/localization/interface-text";

export function OnboardingRouteSelector({
  journey,
  options,
  selectedRouteId,
  onSelect,
  onClear,
}: Readonly<{
  journey: GuidedJourney;
  options: readonly JourneyRouteOption[];
  selectedRouteId: string | undefined;
  onSelect: (option: JourneyRouteOption) => void;
  onClear: () => void;
}>) {
  const { locale, message } = useInterfaceMessages();
  return (
    <fieldset className="rounded-3xl border border-brand-line bg-brand-soft/60 p-5 sm:p-7">
      <legend className="px-2 text-xl font-semibold text-slate-950">{message("onboarding.routeLegend")}</legend>
      <p className="mt-1 leading-7 text-slate-600">{locale === "ja" ? `${journey.title}の中で選べる経路です。まだ比較が必要な場合は、経路を選ばなくてもかまいません。` : `These are alternatives within ${journey.title}. Leave this open if you still need to compare them.`}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option.route.id} className="has-checked:border-brand-accent has-checked:bg-white flex cursor-pointer items-start gap-3 rounded-xl border border-brand-line p-4 hover:border-brand-500">
            <input type="radio" name="journey-route" checked={selectedRouteId === option.route.id} onChange={() => onSelect(option)} className="mt-1 size-5 shrink-0 accent-brand" />
            <span>
              <span className="block font-semibold text-slate-950">{option.route.title}</span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">{option.route.description}</span>
            </span>
          </label>
        ))}
      </div>
      <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold text-brand-deep-soft">
        <input type="radio" name="journey-route" checked={!selectedRouteId} onChange={onClear} className="size-5 accent-brand" />
        {message("onboarding.compareRoutes")}
      </label>
    </fieldset>
  );
}
