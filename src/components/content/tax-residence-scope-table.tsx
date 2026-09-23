type SupportedLocale = "en" | "ja";

const rows = [
  {
    id: "resident",
    en: ["Resident other than a non-permanent resident", "Generally subject to Japanese income tax on worldwide income."],
    ja: ["非永住者以外の居住者", "一般に、全世界所得について日本の所得税の対象となります。"],
  },
  {
    id: "non-permanent-resident",
    en: ["Non-permanent resident", "Generally taxed on income other than foreign-source income, plus foreign-source income paid in Japan or treated as remitted to Japan."],
    ja: ["非永住者", "一般に、国外源泉所得以外の所得に加え、日本で支払われた、または日本へ送金されたものとして扱われる国外源泉所得が課税対象となります。"],
  },
  {
    id: "non-resident",
    en: ["Non-resident", "Generally taxed on Japanese domestic-source income under the rules for that income."],
    ja: ["非居住者", "一般に、国内源泉所得について、その所得に適用される規則に基づいて課税されます。"],
  },
] as const;

/** Shared legal-scope comparison used by canonical MDX and localized article artifacts. */
export function TaxResidenceScopeTable({ locale = "en" }: Readonly<{ locale?: SupportedLocale }>) {
  const japanese = locale === "ja";

  return (
    <div lang={locale} className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">
          {japanese ? "税務上の居住者区分ごとの日本の所得税の一般的な課税範囲" : "Broad Japanese income-tax scope by tax-residence classification"}
        </caption>
        <thead className="bg-slate-100 text-slate-950">
          <tr>
            <th scope="col" className="min-w-56 px-4 py-3 font-semibold">{japanese ? "税務上の居住者区分" : "Tax-residence classification"}</th>
            <th scope="col" className="min-w-80 px-4 py-3 font-semibold">{japanese ? "一般的な課税範囲" : "Broad taxable scope"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
          {rows.map((row) => {
            const [classification, scope] = row[locale];
            return (
              <tr key={row.id}>
                <th scope="row" className="px-4 py-3 font-medium text-slate-950">{classification}</th>
                <td className="px-4 py-3">{scope}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
