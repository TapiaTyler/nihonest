"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DesktopSiteNavigation } from "@/components/navigation/desktop-site-navigation";
import { MobileSiteNavigation } from "@/components/navigation/mobile-site-navigation";
import { useSiteAccountNavigation } from "@/components/navigation/site-account-navigation";

/** Composes the site identity with independently owned desktop and mobile navigation. */
export function SiteHeader() {
  const pathname = usePathname();
  const accountNavigation = useSiteAccountNavigation();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur lg:static">
      <div className="page-shell">
        <div className="flex min-h-16 items-center justify-between gap-6 lg:min-h-20">
          <Link href="/" className="rounded-sm text-xl font-semibold tracking-tight text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">Nihonest</Link>
          <MobileSiteNavigation key={`mobile-${pathname}`} pathname={pathname} accountNavigation={accountNavigation} />
          <DesktopSiteNavigation key={`desktop-${pathname}`} pathname={pathname} accountNavigation={accountNavigation} />
        </div>
      </div>
    </header>
  );
}
