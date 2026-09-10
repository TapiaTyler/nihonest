"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAccountSession } from "@/components/account/account-session-provider";
import { ContentLanguageOptions } from "@/components/localization/content-language-options";
import { useContentLocale } from "@/components/localization/content-locale-provider";
import { ReadingAidOptions } from "@/components/localization/reading-aid-options";

const destinations = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/my-journey", label: "My Journey" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/onboarding", label: "Adjust Starting Point" },
  { href: "/faq", label: "FAQ" },
  { href: "/glossary", label: "Glossary" },
  { href: "/residence-statuses", label: "Residence Statuses" },
  { href: "/saved", label: "Saved" },
  { href: "/reminders", label: "Reminders" },
  { href: "/account", label: "Account" },
] as const;

type DestinationHref = (typeof destinations)[number]["href"];
type DesktopDisclosure = "journey" | "resources" | "language" | "account";
type DesktopLinkDisclosure = Exclude<DesktopDisclosure, "account">;

const journeyLinks = [
  { href: "/my-journey", label: "My Journey", description: "Follow your selected route step by step." },
  { href: "/roadmap", label: "Roadmap", description: "See your progress and next recommended action." },
  { href: "/onboarding", label: "Adjust Starting Point", description: "Change your stage, journey, or route." },
] as const;

const resourceLinks = [
  { href: "/faq", label: "FAQ", description: "Find answers to common questions." },
  { href: "/glossary", label: "Glossary", description: "Understand Japanese terms in context." },
  { href: "/residence-statuses", label: "Residence Statuses", description: "Browse immigration status categories." },
] as const;

const mobileGroups = [
  { label: "Journey", links: journeyLinks },
  { label: "Resources", links: resourceLinks },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const accountSession = useAccountSession();
  const { locale } = useContentLocale();
  const [desktopDisclosure, setDesktopDisclosure] = useState<DesktopDisclosure>();
  const [signOutPending, setSignOutPending] = useState(false);
  const [signOutError, setSignOutError] = useState<string>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const journeyButtonRef = useRef<HTMLButtonElement>(null);
  const resourcesButtonRef = useRef<HTMLButtonElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);

  function isDestinationActive(href: DestinationHref) {
    if (href === "/") return pathname === href;
    if (href === "/explore") return pathname === href || pathname.startsWith("/articles/");
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function disclosureIsActive(disclosure: DesktopLinkDisclosure) {
    const links = disclosure === "journey" ? journeyLinks : resourceLinks;
    return links.some(({ href }) => isDestinationActive(href));
  }

  function closeDesktopDisclosure(restoreFocus = false) {
    const currentDisclosure = desktopDisclosure;
    setDesktopDisclosure(undefined);
    if (restoreFocus && currentDisclosure) {
      const buttonRef = currentDisclosure === "journey"
        ? journeyButtonRef
        : currentDisclosure === "resources"
          ? resourcesButtonRef
          : currentDisclosure === "language"
            ? languageButtonRef
            : accountButtonRef;
      requestAnimationFrame(() => buttonRef.current?.focus());
    }
  }

  function toggleDesktopDisclosure(disclosure: DesktopDisclosure) {
    setDesktopDisclosure((current) => current === disclosure ? undefined : disclosure);
  }

  function focusFirstDisclosureLink(disclosure: DesktopDisclosure) {
    setDesktopDisclosure(disclosure);
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`#desktop-${disclosure}-navigation a`)?.focus());
  }

  useEffect(() => {
    if (!desktopDisclosure) return;

    function handlePointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setDesktopDisclosure(undefined);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const buttonRef = desktopDisclosure === "journey"
        ? journeyButtonRef
        : desktopDisclosure === "resources"
          ? resourcesButtonRef
          : desktopDisclosure === "language"
            ? languageButtonRef
            : accountButtonRef;
      setDesktopDisclosure(undefined);
      requestAnimationFrame(() => buttonRef.current?.focus());
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [desktopDisclosure]);

  function finishClosingMenu() {
    const dialog = dialogRef.current;
    if (dialog?.open && typeof dialog.close === "function") dialog.close();
    else dialog?.removeAttribute("open");
    setMenuOpen(false);
    setMenuClosing(false);
    setPanelVisible(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  }

  function closeMenu() {
    if (!menuOpen || menuClosing) return;
    setMenuClosing(true);
    setPanelVisible(false);
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    closeTimerRef.current = window.setTimeout(finishClosingMenu, reduceMotion ? 0 : 180);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousScrollbarGutter = root.style.scrollbarGutter;
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";

    if (!dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }
    dialog.focus({ preventScroll: true });
    dialog.scrollLeft = 0;
    dialog.scrollTop = 0;

    // Paint the drawer off-screen before beginning its entrance transition.
    let entranceFrame = 0;
    const preparationFrame = requestAnimationFrame(() => {
      entranceFrame = requestAnimationFrame(() => setPanelVisible(true));
    });

    return () => {
      cancelAnimationFrame(preparationFrame);
      cancelAnimationFrame(entranceFrame);
      root.style.overflow = previousOverflow;
      root.style.scrollbarGutter = previousScrollbarGutter;
    };
  }, [menuOpen]);

  useEffect(() => () => {
    if (closeTimerRef.current !== undefined) window.clearTimeout(closeTimerRef.current);
  }, []);

  function directDesktopLink(href: DestinationHref, label: string) {
    return (
      <Link
        href={href}
        aria-current={isDestinationActive(href) ? "page" : undefined}
        onClick={() => closeDesktopDisclosure()}
        className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 aria-[current=page]:bg-teal-50 aria-[current=page]:font-semibold"
      >
        {label}
      </Link>
    );
  }

  function desktopDisclosureButton(disclosure: DesktopLinkDisclosure, label: string, links: typeof journeyLinks | typeof resourceLinks) {
    const open = desktopDisclosure === disclosure;
    const buttonRef = disclosure === "journey" ? journeyButtonRef : resourcesButtonRef;
    return (
      <li className="relative">
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={`desktop-${disclosure}-navigation`}
          onClick={() => toggleDesktopDisclosure(disclosure)}
          onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); focusFirstDisclosureLink(disclosure); } }}
          className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${disclosureIsActive(disclosure) ? "bg-teal-50 font-semibold" : ""}`}
        >
          {label}
          <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {open && (
          <div id={`desktop-${disclosure}-navigation`} className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
            <ul>
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} aria-current={isDestinationActive(link.href) ? "page" : undefined} onClick={() => closeDesktopDisclosure()} className="block rounded-xl px-4 py-3 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-700 aria-[current=page]:bg-teal-50">
                    <span className="block text-sm font-semibold text-slate-950">{link.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{link.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  }

  async function handleSignOut(fromMobileMenu = false) {
    setSignOutPending(true);
    setSignOutError(undefined);
    const result = await accountSession.endSession();
    setSignOutPending(false);
    if (!result.ok) {
      setSignOutError(result.message);
      return;
    }
    closeDesktopDisclosure();
    if (fromMobileMenu) closeMenu();
    router.refresh();
  }

  function desktopAccountControl() {
    if (accountSession.status !== "signed-in") {
      return <li>{directDesktopLink("/account", "Login")}</li>;
    }

    const open = desktopDisclosure === "account";
    const label = accountSession.displayName || "Account";
    return (
      <li className="relative">
        <button
          ref={accountButtonRef}
          type="button"
          aria-expanded={open}
          aria-controls="desktop-account-navigation"
          onClick={() => toggleDesktopDisclosure("account")}
          onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); focusFirstDisclosureLink("account"); } }}
          title={accountSession.displayName}
          className={`inline-flex min-h-11 max-w-44 items-center gap-2 rounded-full px-4 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${isDestinationActive("/account") || isDestinationActive("/reminders") ? "bg-teal-50 font-semibold" : ""}`}
        >
          <span className="truncate">{label}</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {open && (
          <div id="desktop-account-navigation" className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
            <Link href="/account" aria-current={isDestinationActive("/account") ? "page" : undefined} onClick={() => closeDesktopDisclosure()} className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-700 aria-[current=page]:bg-teal-50">Account settings</Link>
            <Link href="/reminders" aria-current={isDestinationActive("/reminders") ? "page" : undefined} onClick={() => closeDesktopDisclosure()} className="mt-1 block rounded-xl px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-700 aria-[current=page]:bg-teal-50">Reminders</Link>
            <button type="button" disabled={signOutPending} onClick={() => void handleSignOut()} className="mt-1 flex min-h-11 w-full cursor-pointer items-center rounded-xl px-4 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-700 disabled:cursor-wait disabled:opacity-60">{signOutPending ? "Signing out…" : "Sign out"}</button>
            {signOutError && <p role="status" className="px-4 py-2 text-xs leading-5 text-red-700">{signOutError}</p>}
          </div>
        )}
      </li>
    );
  }

  function desktopLanguageControl() {
    const open = desktopDisclosure === "language";
    const languageName = locale === "ja" ? "Japanese pilot" : "English";
    return (
      <li className="relative">
        <button
          ref={languageButtonRef}
          type="button"
          aria-label={`Guide language: ${languageName}`}
          aria-expanded={open}
          aria-controls="desktop-language-options"
          onClick={() => toggleDesktopDisclosure("language")}
          className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-teal-800 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${open || locale !== "en" ? "bg-teal-50" : ""}`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" strokeLinecap="round" /></svg>
          <span>{locale.toUpperCase()}</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {open && (
          <div id="desktop-language-options" className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Guide language</p>
            <div className="mt-2"><ContentLanguageOptions onSelect={() => closeDesktopDisclosure()} /></div>
            <p className="mt-2 border-t border-slate-100 px-3 pt-3 text-xs leading-5 text-slate-500">Japanese pilot translations are available for selected guides.</p>
            <div className="mt-3 border-t border-slate-100 px-3 pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Japanese readings</p>
              <ReadingAidOptions />
            </div>
          </div>
        )}
      </li>
    );
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur lg:static">
      <div className="page-shell">
        <div className="flex min-h-16 items-center justify-between gap-6 lg:min-h-20">
          <Link href="/" onClick={() => { closeDesktopDisclosure(); setMenuOpen(false); }} className="rounded-sm text-xl font-semibold tracking-tight text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">Nihonest</Link>

          <button ref={menuButtonRef} type="button" aria-expanded={menuOpen} aria-controls="mobile-primary-navigation" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} onClick={() => setMenuOpen(true)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-300 text-teal-900 hover:border-teal-500 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 lg:hidden">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" /></svg>
          </button>

          <nav aria-label="Primary navigation" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              <li>{directDesktopLink("/", "Home")}</li>
              <li>{directDesktopLink("/explore", "Explore")}</li>
              {desktopDisclosureButton("journey", "Journey", journeyLinks)}
              {desktopDisclosureButton("resources", "Resources", resourceLinks)}
              <li>{directDesktopLink("/saved", "Saved")}</li>
              {desktopLanguageControl()}
              {desktopAccountControl()}
            </ul>
          </nav>
        </div>
      </div>

      <dialog ref={dialogRef} tabIndex={-1} aria-labelledby="mobile-navigation-heading" data-visible={panelVisible || undefined} onCancel={(event) => { event.preventDefault(); closeMenu(); }} onClick={(event) => { if (event.target === event.currentTarget) closeMenu(); }} className="mobile-nav-dialog lg:hidden">
        <div className={`mobile-nav-panel flex w-[min(85vw,22rem)] flex-col overflow-y-auto border-l border-slate-200 bg-white shadow-2xl transition-transform ${menuClosing ? "duration-[180ms] ease-in" : "duration-200 ease-out"} ${panelVisible ? "translate-x-0" : "translate-x-full"}`}>
          <div className="sticky top-0 z-10 flex min-h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur">
            <h2 id="mobile-navigation-heading" className="text-lg font-semibold tracking-tight text-slate-950">Navigation</h2>
            <button type="button" onClick={closeMenu} aria-label="Close mobile navigation" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-teal-900 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /></svg>
            </button>
          </div>
          <nav id="mobile-primary-navigation" aria-label="Mobile navigation" className="flex-1 px-4 py-5">
            <ul className="space-y-1">
              {destinations.filter(({ href }) => href === "/" || href === "/explore").map((destination) => (
                <li key={destination.href}><Link href={destination.href} aria-current={isDestinationActive(destination.href) ? "page" : undefined} onClick={closeMenu} className="inline-flex min-h-12 w-full items-center rounded-xl px-3 text-base font-medium text-teal-900 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 aria-[current=page]:bg-teal-50 aria-[current=page]:font-semibold">{destination.label}</Link></li>
              ))}
            </ul>
            {mobileGroups.map((group) => (
              <section key={group.label} aria-labelledby={`mobile-navigation-${group.label.toLowerCase().replace(" ", "-")}`} className="mt-6">
                <h3 id={`mobile-navigation-${group.label.toLowerCase().replace(" ", "-")}`} className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{group.label}</h3>
                <ul className="mt-2 space-y-1">
                  {group.links.map((destination) => (
                    <li key={destination.href}><Link href={destination.href} aria-current={isDestinationActive(destination.href) ? "page" : undefined} onClick={closeMenu} className="inline-flex min-h-12 w-full items-center rounded-xl px-3 text-base font-medium text-teal-900 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 aria-[current=page]:bg-teal-50 aria-[current=page]:font-semibold">{destination.label}</Link></li>
                  ))}
                </ul>
              </section>
            ))}
            <section aria-labelledby="mobile-navigation-personal" className="mt-6">
              <h3 id="mobile-navigation-personal" className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Personal</h3>
              <ul className="mt-2 space-y-1">
                <li><Link href="/saved" aria-current={isDestinationActive("/saved") ? "page" : undefined} onClick={closeMenu} className="inline-flex min-h-12 w-full items-center rounded-xl px-3 text-base font-medium text-teal-900 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 aria-[current=page]:bg-teal-50 aria-[current=page]:font-semibold">Saved</Link></li>
                {accountSession.status === "signed-in" ? (
                  <>
                    <li><Link href="/account" aria-current={isDestinationActive("/account") ? "page" : undefined} onClick={closeMenu} className="inline-flex min-h-12 w-full items-center rounded-xl px-3 text-base font-medium text-teal-900 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 aria-[current=page]:bg-teal-50 aria-[current=page]:font-semibold">Account settings{accountSession.displayName ? <span className="ml-2 truncate text-sm font-normal text-slate-500">({accountSession.displayName})</span> : null}</Link></li>
                    <li><Link href="/reminders" aria-current={isDestinationActive("/reminders") ? "page" : undefined} onClick={closeMenu} className="inline-flex min-h-12 w-full items-center rounded-xl px-3 text-base font-medium text-teal-900 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 aria-[current=page]:bg-teal-50 aria-[current=page]:font-semibold">Reminders</Link></li>
                    <li><button type="button" disabled={signOutPending} onClick={() => void handleSignOut(true)} className="inline-flex min-h-12 w-full cursor-pointer items-center rounded-xl px-3 text-left text-base font-medium text-teal-900 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-wait disabled:opacity-60">{signOutPending ? "Signing out…" : "Sign out"}</button></li>
                  </>
                ) : (
                  <li><Link href="/account" aria-current={isDestinationActive("/account") ? "page" : undefined} onClick={closeMenu} className="inline-flex min-h-12 w-full items-center rounded-xl px-3 text-base font-medium text-teal-900 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 aria-[current=page]:bg-teal-50 aria-[current=page]:font-semibold">Login</Link></li>
                )}
              </ul>
              {signOutError && <p role="status" className="px-3 pt-2 text-sm text-red-700">{signOutError}</p>}
            </section>
            <section aria-labelledby="mobile-navigation-language" className="mt-6 px-3">
              <h3 id="mobile-navigation-language" className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Guide language</h3>
              <div className="mt-2"><ContentLanguageOptions /></div>
              <p className="mt-2 px-3 text-xs leading-5 text-slate-500">Japanese pilot translations are available for selected guides.</p>
              <div className="mt-4 border-t border-slate-200 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Japanese readings</p>
                <ReadingAidOptions />
              </div>
            </section>
          </nav>
          <p className="border-t border-slate-200 px-5 py-4 text-xs leading-5 text-slate-500">All public guidance remains available without an account.</p>
        </div>
      </dialog>
    </header>
  );
}
