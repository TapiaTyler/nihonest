"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const destinations = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/my-journey", label: "My Journey" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/faq", label: "FAQ" },
  { href: "/glossary", label: "Glossary" },
  { href: "/residence-statuses", label: "Statuses" },
  { href: "/saved", label: "Saved" },
  { href: "/account", label: "Account" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  function isDestinationActive(href: (typeof destinations)[number]["href"]) {
    if (href === "/") {
      return pathname === href;
    }

    if (href === "/explore") {
      return pathname === href || pathname.startsWith("/articles/");
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="page-shell flex min-h-20 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3 sm:flex-nowrap sm:py-0">
        <Link
          href="/"
          className="rounded-sm text-xl font-semibold tracking-tight text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
        >
          Nihonest
        </Link>

        <nav aria-label="Primary navigation" className="w-full overflow-x-auto sm:w-auto">
          <ul className="flex min-w-max items-center justify-between gap-1 sm:justify-start sm:gap-3">
            {destinations.map((destination) => (
              <li key={destination.href}>
                <Link
                  href={destination.href}
                  aria-current={isDestinationActive(destination.href) ? "page" : undefined}
                  className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:px-4"
                >
                  {destination.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
