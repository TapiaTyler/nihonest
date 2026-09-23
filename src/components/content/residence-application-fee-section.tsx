import {
  residenceApplicationFees,
  residenceApplicationOnlineTotal,
  type ResidenceApplicationFeePeriodId,
} from "@/data/residence-application-fees";

type SupportedLocale = "en" | "ja";

const periodLabels: Readonly<Record<SupportedLocale, Readonly<Record<ResidenceApplicationFeePeriodId, string>>>> = {
  en: {
    "up-to-three-months": "3 months or less",
    "over-three-through-six-months": "Over 3 through 6 months",
    "over-six-months-under-one-year": "Over 6 months but under 1 year",
    "one-year": "1 year",
    "over-one-under-three-years": "Over 1 but under 3 years",
    "three-under-five-years": "3 to under 5 years",
    "five-years-or-more": "5 years or more",
  },
  ja: {
    "up-to-three-months": "3か月以下",
    "over-three-through-six-months": "3か月を超え6か月以下",
    "over-six-months-under-one-year": "6か月を超え1年未満",
    "one-year": "1年",
    "over-one-under-three-years": "1年を超え3年未満",
    "three-under-five-years": "3年以上5年未満",
    "five-years-or-more": "5年以上",
  },
};

function formatYen(amount: number, locale: SupportedLocale) {
  const formatted = new Intl.NumberFormat("en-US").format(amount);
  return locale === "ja" ? `${formatted}円` : `JPY ${formatted}`;
}

function formatDate(date: string, locale: SupportedLocale) {
  const [year, month, day] = date.split("-").map(Number);
  return locale === "ja"
    ? `${year}年${month}月${day}日`
    : new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function ResidenceApplicationFeeSection({ locale = "en" }: Readonly<{ locale?: SupportedLocale }>) {
  const { previousSchedule, currentSchedule } = residenceApplicationFees;
  const japanese = locale === "ja";

  return (
    <section lang={locale} aria-labelledby={`residence-application-fees-${locale}`}>
      <h2 id={`residence-application-fees-${locale}`} className="mt-10 text-2xl font-semibold tracking-tight text-slate-950">
        {japanese ? "手数料は受付日、申請方法、許可された期間によって異なる" : "Fees depend on acceptance date, channel, and the period granted"}
      </h2>

      <p className="mt-4 leading-8 text-slate-700">
        {japanese
          ? `${formatDate(previousSchedule.acceptedFrom, locale)}から${formatDate(previousSchedule.acceptedThrough, locale)}までに受け付けられた申請では、許可された在留資格変更または在留期間更新の手数料は、窓口で${formatYen(previousSchedule.counterYen, locale)}、オンラインで${formatYen(previousSchedule.onlineYen, locale)}です。`
          : `For applications accepted from ${formatDate(previousSchedule.acceptedFrom, locale)} through ${formatDate(previousSchedule.acceptedThrough, locale)}, an approved change or extension costs ${formatYen(previousSchedule.counterYen, locale)} at a counter or ${formatYen(previousSchedule.onlineYen, locale)} online.`}
      </p>

      <p className="mt-4 leading-8 text-slate-700">
        {japanese
          ? `${formatDate(currentSchedule.acceptedFrom, locale)}以降に受け付けられた申請では、出入国在留管理庁が実際に許可した期間によって手数料が決まります。`
          : `For applications accepted on or after ${formatDate(currentSchedule.acceptedFrom, locale)}, the fee is determined by the period ISA actually grants:`}
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            {japanese
              ? `${formatDate(currentSchedule.acceptedFrom, locale)}以降に受け付けられた在留資格変更および在留期間更新の手数料`
              : `Change-of-status and extension fees for applications accepted on or after ${formatDate(currentSchedule.acceptedFrom, locale)}`}
          </caption>
          <thead className="bg-slate-100 text-slate-950">
            <tr>
              <th scope="col" className="min-w-48 px-4 py-3 font-semibold">{japanese ? "許可された期間" : "Period granted"}</th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-right font-semibold">{japanese ? "窓口" : "Counter"}</th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-right font-semibold">{japanese ? "オンライン基本手数料" : "Online base fee"}</th>
              <th scope="col" className="min-w-40 px-4 py-3 text-right font-semibold">{japanese ? "処理手数料を含むオンライン合計" : "Online total with processing"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {currentSchedule.bands.map((band) => (
              <tr key={band.periodId}>
                <th scope="row" className="px-4 py-3 font-medium text-slate-950">{periodLabels[locale][band.periodId]}</th>
                <td className="whitespace-nowrap px-4 py-3 text-right">{formatYen(band.counterYen, locale)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right">{formatYen(band.onlineBaseYen, locale)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-950">{formatYen(residenceApplicationOnlineTotal(band), locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 leading-8 text-slate-700">
        {japanese
          ? `オンラインの処理手数料は、許可された期間が3年未満の場合${formatYen(currentSchedule.processingYen.underThreeYears, locale)}、3年以上の場合${formatYen(currentSchedule.processingYen.threeYearsOrMore, locale)}です。出入国在留管理庁は審査後に支払方法を案内します。対象となるオンライン申請は、コンビニエンスストアまたは銀行で支払います。公表された手続きでは、クレジットカードとQRコード決済は利用できません。窓口申請では引き続き収入印紙を使用します。`
          : `The online processing charge is ${formatYen(currentSchedule.processingYen.underThreeYears, locale)} for a grant under three years and ${formatYen(currentSchedule.processingYen.threeYearsOrMore, locale)} for three years or more. ISA sends payment instructions after examination. Covered online applications use convenience-store or bank payment; credit cards and QR-code payment are not supported in the published process. Counter applications continue to use revenue stamps.`}
      </p>

      <p className="mt-4 leading-8 text-slate-700">
        {japanese
          ? `適用される料金表は、申請の受付日によって決まります。${formatDate(previousSchedule.acceptedThrough, locale)}までに受け付けられた申請は、後から決定されても以前の手数料と収入印紙の手続きを使います。公表された軽減措置によって、要件を満たす変更または更新の手数料が${formatYen(residenceApplicationFees.qualifyingReducedFeeYen, locale)}となる場合がありますが、オンラインシステムは軽減または免除の申出に対応していないため、窓口で申請する必要があります。`
          : `The application acceptance date controls the schedule. An application accepted by ${formatDate(previousSchedule.acceptedThrough, locale)} retains the earlier fee and revenue-stamp process even if decided later. Published relief can reduce a qualifying change or extension fee to ${formatYen(residenceApplicationFees.qualifyingReducedFeeYen, locale)}, but reduction or exemption requests must be filed at a counter because the online system does not support them.`}
      </p>

      <blockquote className="mt-6 rounded-r-xl border-l-4 border-teal-600 bg-teal-50 px-5 py-1 text-slate-800">
        <p className="my-4 leading-8">
          <strong className="font-semibold text-slate-950">{japanese ? "詐欺への注意：" : "Fraud warning:"}</strong>{" "}
          {japanese
            ? `出入国在留管理庁は、新しいオンライン支払手続きの正規のメールは、末尾が ${residenceApplicationFees.onlinePaymentEmailDomain} のアドレスからのみ送信されると案内しています。送信元、方法、指示が異なる場合は、支払う前に公式ページを再確認してください。`
            : `ISA states that legitimate online-payment messages for the new process come only from an address ending in ${residenceApplicationFees.onlinePaymentEmailDomain}. Recheck the official page before paying if the sender, channel, or instructions differ.`}
        </p>
      </blockquote>
    </section>
  );
}
