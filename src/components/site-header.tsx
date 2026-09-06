import Link from "next/link";

const upcomingDestinations = ["Explore", "Glossary"];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="page-shell flex min-h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="rounded-sm text-xl font-semibold tracking-tight text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
        >
          Nihonest
        </Link>

        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-1 sm:gap-3">
            <li>
              <Link
                href="/"
                aria-current="page"
                className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:px-4"
              >
                Home
              </Link>
            </li>
            {upcomingDestinations.map((destination) => (
              <li key={destination} className="hidden sm:block">
                <span
                  className="inline-flex min-h-11 cursor-default items-center gap-2 rounded-full px-3 text-sm text-slate-500"
                  title="Coming soon"
                >
                  {destination}
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400">
                    Soon
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
