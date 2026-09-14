import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="page-shell grid gap-10 py-10 text-sm sm:grid-cols-[minmax(12rem,1fr)_auto_auto] sm:gap-8 lg:gap-16">
        <div className="max-w-sm">
          <Link href="/" className="text-base font-semibold text-white hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300">Nihonest</Link>
          <p className="mt-3 leading-6">Public-first guidance for finding your place in Japan.</p>
          <p className="mt-3 leading-6 text-slate-400">All public guidance is available without an account.</p>
          <p className="mt-3 leading-6 text-slate-400">General educational information, not legal advice. Confirm important decisions with the responsible authority or a qualified professional.</p>
        </div>
        <nav aria-label="Guidance links" className="hidden sm:block">
          <h2 className="font-semibold text-white">Find guidance</h2>
          <ul className="-mx-3 mt-1">
            <li><Link href="/explore" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300">Explore</Link></li>
            <li><Link href="/faq" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300">FAQ</Link></li>
            <li><Link href="/glossary" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300">Glossary</Link></li>
            <li><Link href="/residence-statuses" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300">Statuses</Link></li>
            <li><Link href="/can-i-do-this" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300">Can I do this?</Link></li>
            <li><Link href="/articles/understanding-japan-geography-government-and-language" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300">Japan basics</Link></li>
          </ul>
        </nav>
        <nav aria-label="Personal links" className="hidden sm:block">
          <h2 className="font-semibold text-white">Your journey</h2>
          <ul className="-mx-3 mt-1">
            <li><Link href="/onboarding" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300">Starting point</Link></li>
            <li><Link href="/my-journey" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300">My Journey</Link></li>
            <li><Link href="/roadmap" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300">Roadmap</Link></li>
            <li><Link href="/saved" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300">Saved</Link></li>
            <li><Link href="/reminders" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300">Reminders</Link></li>
            <li><Link href="/account" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300">Account</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
