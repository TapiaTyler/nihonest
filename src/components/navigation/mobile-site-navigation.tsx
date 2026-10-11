"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ContentLanguageOptions } from "@/components/localization/content-language-options";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { ReadingAidOptions } from "@/components/localization/reading-aid-options";
import { MobileAccountControl } from "@/components/navigation/site-account-controls";
import type { SiteAccountNavigationState } from "@/components/navigation/site-account-navigation";
import {
  isSiteDestinationActive,
  mobileNavigationGroups,
  siteDestinations,
  type SiteDestinationHref,
} from "@/components/navigation/site-navigation-config";

const mobileLinkClass = "inline-flex min-h-12 w-full items-center rounded-xl px-3 text-base font-medium text-brand-deep-soft hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-[current=page]:bg-brand-soft aria-[current=page]:font-semibold";

export function MobileSiteNavigation({ pathname, accountNavigation }: Readonly<{
  pathname: string;
  accountNavigation: SiteAccountNavigationState;
}>) {
  const { message } = useInterfaceMessages();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);

  function isActive(href: SiteDestinationHref) {
    return isSiteDestinationActive(pathname, href);
  }

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

  useEffect(() => {
    if (!menuOpen || !window.matchMedia) return;
    const desktopBreakpoint = window.matchMedia("(min-width: 64rem)");

    function dismissAtDesktopBreakpoint(event: Pick<MediaQueryListEvent, "matches">) {
      if (!event.matches) return;
      if (closeTimerRef.current !== undefined) window.clearTimeout(closeTimerRef.current);
      const dialog = dialogRef.current;
      if (dialog?.open && typeof dialog.close === "function") dialog.close();
      else dialog?.removeAttribute("open");
      setMenuOpen(false);
      setMenuClosing(false);
      setPanelVisible(false);
    }

    desktopBreakpoint.addEventListener("change", dismissAtDesktopBreakpoint);
    dismissAtDesktopBreakpoint(desktopBreakpoint);
    return () => desktopBreakpoint.removeEventListener("change", dismissAtDesktopBreakpoint);
  }, [menuOpen]);

  useEffect(() => () => {
    if (closeTimerRef.current !== undefined) window.clearTimeout(closeTimerRef.current);
  }, []);

  return (
    <>
      <button ref={menuButtonRef} type="button" aria-expanded={menuOpen} aria-controls="mobile-primary-navigation" aria-label={message(menuOpen ? "navigation.close" : "navigation.open")} onClick={() => setMenuOpen(true)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-line-strong text-brand-deep-soft hover:border-brand-500 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:hidden">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" /></svg>
      </button>

      <dialog ref={dialogRef} tabIndex={-1} aria-labelledby="mobile-navigation-heading" data-visible={panelVisible || undefined} onCancel={(event) => { event.preventDefault(); closeMenu(); }} onClick={(event) => { if (event.target === event.currentTarget) closeMenu(); }} className="mobile-nav-dialog lg:hidden">
        <div className={`mobile-nav-panel flex w-[min(85vw,22rem)] flex-col overflow-y-auto border-l border-line bg-surface shadow-2xl transition-transform ${menuClosing ? "duration-[180ms] ease-in" : "duration-200 ease-out"} ${panelVisible ? "translate-x-0" : "translate-x-full"}`}>
          <div className="sticky top-0 z-10 flex min-h-16 shrink-0 items-center justify-between border-b border-line bg-surface/95 px-5 backdrop-blur">
            <h2 id="mobile-navigation-heading" className="text-lg font-semibold tracking-tight text-ink">{message("navigation.heading")}</h2>
            <button type="button" onClick={closeMenu} aria-label={message("navigation.closeMobile")} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-brand-deep-soft hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /></svg>
            </button>
          </div>
          <nav id="mobile-primary-navigation" aria-label={message("navigation.mobile")} className="flex-1 px-4 py-5">
            <ul className="space-y-1">
              {siteDestinations.filter(({ href }) => href === "/" || href === "/explore").map((destination) => (
                <li key={destination.href}><Link href={destination.href} aria-current={isActive(destination.href) ? "page" : undefined} onClick={closeMenu} className={mobileLinkClass}>{message(destination.labelId)}</Link></li>
              ))}
            </ul>
            {mobileNavigationGroups.map((group) => {
              const headingId = `mobile-navigation-${group.id}`;
              return (
                <section key={group.id} aria-labelledby={headingId} className="mt-6">
                  <h3 id={headingId} className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">{message(group.labelId)}</h3>
                  <ul className="mt-2 space-y-1">
                    {group.links.map((destination) => (
                      <li key={destination.href}><Link href={destination.href} aria-current={isActive(destination.href) ? "page" : undefined} onClick={closeMenu} className={mobileLinkClass}>{message(destination.labelId)}</Link></li>
                    ))}
                  </ul>
                </section>
              );
            })}
            <MobileAccountControl accountNavigation={accountNavigation} isActive={(href) => isActive(href)} onNavigate={closeMenu} />
            <section aria-labelledby="mobile-navigation-language" className="mt-6 px-3">
              <h3 id="mobile-navigation-language" className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">{message("language.guideLanguage")}</h3>
              <div className="mt-2"><ContentLanguageOptions /></div>
              <p className="mt-2 px-3 text-xs leading-5 text-ink-subtle">{message("language.pilotAvailability")}</p>
              <div className="mt-4 border-t border-line pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">{message("language.japaneseReadings")}</p>
                <ReadingAidOptions />
              </div>
            </section>
          </nav>
          <p className="border-t border-line px-5 py-4 text-xs leading-5 text-ink-subtle">{message("navigation.publicWithoutAccount")}</p>
        </div>
      </dialog>
    </>
  );
}
