import { taxResidenceScopeComponent } from "@/data/article-components";
import { selectArticleComponentTranslation } from "@/lib/content/article-component-translations";

type SupportedLocale = "en" | "ja";

/** Shared legal-scope comparison used by canonical MDX and localized article artifacts. */
export function TaxResidenceScopeTable({ locale = "en" }: Readonly<{ locale?: SupportedLocale }>) {
  const translated = locale === "ja" ? selectArticleComponentTranslation(taxResidenceScopeComponent) : undefined;
  const language = translated ? "ja" : "en";
  const text = (key: string, english: string) => translated?.[key] ?? english;

  return (
    <div lang={language} className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">
          {text("caption", taxResidenceScopeComponent.caption)}
        </caption>
        <thead className="bg-slate-100 text-slate-950">
          <tr>
            <th scope="col" className="min-w-56 px-4 py-3 font-semibold">{text("headers.0", taxResidenceScopeComponent.headers[0])}</th>
            <th scope="col" className="min-w-80 px-4 py-3 font-semibold">{text("headers.1", taxResidenceScopeComponent.headers[1])}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
          {taxResidenceScopeComponent.rows.map((row) => {
            const classification = text(`rows.${row.id}.0`, row.cells[0]);
            const scope = text(`rows.${row.id}.1`, row.cells[1]);
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
