type SupportedLocale = "en" | "ja";

// One route list keeps the English guide and its Japanese translation aligned as routes evolve.
const rows = [
  {
    id: "cultural-activities",
    en: ["Unpaid Japanese cultural study or research", "Cultural Activities", ""],
    ja: ["無報酬の日本文化の学習または研究", "文化活動", ""],
    href: "/articles/cultural-activities-visa",
  },
  {
    id: "student",
    en: ["Education at a qualifying school", "Student", ""],
    ja: ["要件を満たす学校での教育", "留学", ""],
    href: "/articles/student-visa-and-certificate-of-eligibility",
  },
  {
    id: "training",
    en: ["Structured non-employment training through a host", "Training", ""],
    ja: ["受入先による体系的な非雇用研修", "研修", ""],
    href: "/articles/training-visa",
  },
  {
    id: "technical-intern-training",
    en: ["A current approved legacy technical-intern plan", "Technical Intern Training", ", including transition provisions"],
    ja: ["現在有効な認定済みの技能実習計画", "技能実習", "（移行措置を含む）"],
    href: "/articles/technical-intern-training-status",
  },
  {
    id: "employment-skill-development",
    en: ["Three-year employment development beginning from April 2027", "Employment for Skill Development", " in a covered field"],
    ja: ["2027年4月から始まる3年間の雇用による育成", "育成就労", "（対象分野）"],
    href: "/articles/employment-for-skill-development-system",
  },
  {
    id: "specified-skilled-worker",
    en: ["Direct work after meeting field skill and language requirements", "Specified Skilled Worker", ""],
    ja: ["分野別の技能・日本語要件を満たした後の直接雇用", "特定技能", ""],
    href: "/articles/specified-skilled-worker-status",
  },
  {
    id: "ordinary-work",
    en: ["Ordinary specialized or other work", "Compare the activity-based work statuses", ""],
    ja: ["通常の専門職その他の就労", "活動内容に基づく就労資格を比較", ""],
    href: "/articles/choosing-a-work-status-and-coe",
  },
] as const;

export function TrainingRouteComparisonTable({ locale = "en" }: Readonly<{ locale?: SupportedLocale }>) {
  const japanese = locale === "ja";

  return (
    <div lang={locale} className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">
          {japanese ? "活動内容から最初に確認する研修・就学・就労経路" : "Activities and the training, study, or work routes to examine first"}
        </caption>
        <thead className="bg-slate-100 text-slate-950">
          <tr>
            <th scope="col" className="min-w-64 px-4 py-3 font-semibold">{japanese ? "予定する活動" : "Proposed activity"}</th>
            <th scope="col" className="min-w-56 px-4 py-3 font-semibold">{japanese ? "最初に確認する経路" : "Route to examine first"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
          {rows.map((row) => {
            const [activity, route, suffix] = row[locale];
            return (
              <tr key={row.id}>
                <th scope="row" className="px-4 py-3 font-medium text-slate-950">{activity}</th>
                <td className="px-4 py-3">
                  <a href={row.href} className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{route}</a>{suffix}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
