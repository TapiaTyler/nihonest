import { residenceApplicationFeesComponent } from "@/data/article-components";
import { residenceApplicationFees, residenceApplicationOnlineTotal } from "@/data/residence-application-fees";
import {
  fillResidenceApplicationFeeTemplate,
  formatResidenceApplicationFeeYen,
  residenceApplicationFeeTemplateValues,
  type ResidenceApplicationFeeCopyId,
} from "@/domain/article/residence-application-fee-copy";
import { selectArticleComponentTranslation } from "@/lib/content/article-component-translations";

type SupportedLocale = "en" | "ja";

/** English copy from canonical data, or the whole current Japanese artifact; amounts always come from the fee record. */
export function ResidenceApplicationFeeSection({ locale = "en" }: Readonly<{ locale?: SupportedLocale }>) {
  const { currentSchedule } = residenceApplicationFees;
  const translated = locale === "ja" ? selectArticleComponentTranslation(residenceApplicationFeesComponent) : undefined;
  const language = translated ? "ja" : "en";
  const values = residenceApplicationFeeTemplateValues(residenceApplicationFees, language);
  const text = (id: ResidenceApplicationFeeCopyId) => fillResidenceApplicationFeeTemplate(
    translated?.[`messages.${id}`] ?? residenceApplicationFeesComponent.messages.find((message) => message.id === id)!.text,
    values,
  );
  const yen = (amount: number) => formatResidenceApplicationFeeYen(amount, language);

  return (
    <section lang={language} aria-labelledby={`residence-application-fees-${locale}`}>
      <h2 id={`residence-application-fees-${locale}`} className="mt-10 text-2xl font-semibold tracking-tight text-slate-950">
        {text("heading")}
      </h2>

      <p className="mt-4 leading-8 text-slate-700">
        {text("previous-schedule")}
      </p>

      <p className="mt-4 leading-8 text-slate-700">
        {text("current-schedule")}
      </p>

      <div role="region" aria-label={text("caption")} tabIndex={0} className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
        <table className="min-w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            {text("caption")}
          </caption>
          <thead className="bg-slate-100 text-slate-950">
            <tr>
              <th scope="col" className="min-w-48 px-4 py-3 font-semibold">{text("header-period")}</th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-right font-semibold">{text("header-counter")}</th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-right font-semibold">{text("header-online-base")}</th>
              <th scope="col" className="min-w-40 px-4 py-3 text-right font-semibold">{text("header-online-total")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {currentSchedule.bands.map((band) => (
              <tr key={band.periodId}>
                <th scope="row" className="px-4 py-3 font-medium text-slate-950">{text(`period-${band.periodId}`)}</th>
                <td className="whitespace-nowrap px-4 py-3 text-right">{yen(band.counterYen)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right">{yen(band.onlineBaseYen)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-950">{yen(residenceApplicationOnlineTotal(band))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 leading-8 text-slate-700">
        {text("processing")}
      </p>

      <p className="mt-4 leading-8 text-slate-700">
        {text("schedule-rule")}
      </p>

      <blockquote className="mt-6 rounded-r-xl border-l-4 border-teal-600 bg-teal-50 px-5 py-1 text-slate-800">
        <p className="my-4 leading-8">
          <strong className="font-semibold text-slate-950">{text("fraud-label")}</strong>{" "}
          {text("fraud-body")}
        </p>
      </blockquote>
    </section>
  );
}
