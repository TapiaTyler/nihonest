import { taxResidenceScopeComponent } from "@/data/article-components";
import { selectArticleComponentTranslation } from "@/lib/content/article-component-translations";

type SupportedLocale = "en" | "ja";

/** Shared legal-scope comparison used by canonical MDX and localized article artifacts. */
export function TaxResidenceScopeTable({ locale = "en" }: Readonly<{ locale?: SupportedLocale }>) {
  const translated = locale === "ja" ? selectArticleComponentTranslation(taxResidenceScopeComponent) : undefined;
  const language = translated ? "ja" : "en";
  const text = (key: string, english: string) => translated?.[key] ?? english;

  return (
    <div lang={language} className="mt-6 overflow-x-auto rounded-2xl border border-line">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">
          {text("caption", taxResidenceScopeComponent.caption)}
        </caption>
        <thead className="bg-surface-muted text-ink">
          <tr>
            <th scope="col" className="px-4 sm:min-w-56 py-3 font-semibold">{text("headers.0", taxResidenceScopeComponent.headers[0])}</th>
            <th scope="col" className="px-4 sm:min-w-80 py-3 font-semibold">{text("headers.1", taxResidenceScopeComponent.headers[1])}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-surface text-ink-body">
          {taxResidenceScopeComponent.rows.map((row) => {
            const classification = text(`rows.${row.id}.0`, row.cells[0]);
            const scope = text(`rows.${row.id}.1`, row.cells[1]);
            return (
              <tr key={row.id}>
                <th scope="row" className="px-4 py-3 font-medium text-ink">{classification}</th>
                <td className="px-4 py-3">{scope}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
