import Link from "next/link";
import { InterfaceText } from "@/components/localization/interface-text";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="page-shell grid gap-10 py-10 text-sm sm:grid-cols-[minmax(12rem,1fr)_auto_auto] sm:gap-8 lg:gap-16">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex min-h-11 items-center text-base font-semibold text-white hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300">Nihonest</Link>
          <p className="mt-3 leading-6"><InterfaceText id="footer.productDescription" /></p>
          <p className="mt-3 leading-6 text-slate-400"><InterfaceText id="footer.publicAccess" /></p>
          <p className="mt-3 leading-6 text-slate-400"><InterfaceText id="footer.legalDisclaimer" /></p>
        </div>
        <nav aria-labelledby="footer-guidance-heading" className="hidden sm:block">
          <h2 id="footer-guidance-heading" className="font-semibold text-white"><InterfaceText id="footer.findGuidance" /></h2>
          <ul className="-mx-3 mt-1">
            <li><Link href="/explore" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300"><InterfaceText id="footer.explore" /></Link></li>
            <li><Link href="/faq" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300"><InterfaceText id="footer.faq" /></Link></li>
            <li><Link href="/glossary" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300"><InterfaceText id="footer.glossary" /></Link></li>
            <li><Link href="/residence-statuses" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300"><InterfaceText id="footer.statuses" /></Link></li>
            <li><Link href="/can-i-do-this" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300"><InterfaceText id="footer.activityCheck" /></Link></li>
            <li><Link href="/articles/understanding-japan-geography-government-and-language" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300"><InterfaceText id="footer.japanBasics" /></Link></li>
          </ul>
        </nav>
        <nav aria-labelledby="footer-journey-heading" className="hidden sm:block">
          <h2 id="footer-journey-heading" className="font-semibold text-white"><InterfaceText id="footer.yourJourney" /></h2>
          <ul className="-mx-3 mt-1">
            <li><Link href="/onboarding" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300"><InterfaceText id="footer.startingPoint" /></Link></li>
            <li><Link href="/my-journey" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300"><InterfaceText id="footer.myJourney" /></Link></li>
            <li><Link href="/roadmap" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300"><InterfaceText id="footer.roadmap" /></Link></li>
            <li><Link href="/saved" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300"><InterfaceText id="footer.saved" /></Link></li>
            <li><Link href="/reminders" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300"><InterfaceText id="footer.reminders" /></Link></li>
            <li><Link href="/account" className="inline-flex min-h-11 items-center px-3 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300"><InterfaceText id="footer.account" /></Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
