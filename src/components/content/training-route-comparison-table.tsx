import { trainingRouteComparisonComponent } from "@/data/article-components";
import { selectArticleComponentTranslation } from "@/lib/content/article-component-translations";

type SupportedLocale = "en" | "ja";

export function TrainingRouteComparisonTable({ locale = "en" }: Readonly<{ locale?: SupportedLocale }>) {
  const translated = locale === "ja" ? selectArticleComponentTranslation(trainingRouteComparisonComponent) : undefined;
  const language = translated ? "ja" : "en";
  const text = (key: string, english: string) => translated?.[key] ?? english;

  return (
    <div lang={language} className="mt-6 overflow-x-auto rounded-2xl border border-line">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">
          {text("caption", trainingRouteComparisonComponent.caption)}
        </caption>
        <thead className="bg-surface-muted text-ink">
          <tr>
            <th scope="col" className="px-4 sm:min-w-64 py-3 font-semibold">{text("headers.0", trainingRouteComparisonComponent.headers[0])}</th>
            <th scope="col" className="px-4 sm:min-w-56 py-3 font-semibold">{text("headers.1", trainingRouteComparisonComponent.headers[1])}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-surface text-ink-body">
          {trainingRouteComparisonComponent.rows.map((row) => {
            const activity = text(`rows.${row.id}.0`, row.cells[0]);
            const route = text(`rows.${row.id}.1`, row.cells[1]);
            const suffix = text(`rows.${row.id}.2`, row.cells[2]);
            return (
              <tr key={row.id}>
                <th scope="row" className="px-4 py-3 font-medium text-ink">{activity}</th>
                <td className="px-4 py-3">
                  <a href={row.href} className="font-medium text-brand-link underline decoration-brand-300 underline-offset-4 hover:text-brand-link-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">{route}</a>{suffix}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
