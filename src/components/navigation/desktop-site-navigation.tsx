"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ContentLanguageOptions } from "@/components/localization/content-language-options";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { ReadingAidOptions } from "@/components/localization/reading-aid-options";
import { ThemeOptions, themeLabelIds } from "@/components/theme/theme-options";
import { useThemePreference } from "@/components/theme/use-theme-preference";
import { DesktopAccountControl } from "@/components/navigation/site-account-controls";
import type { SiteAccountNavigationState } from "@/components/navigation/site-account-navigation";
import {
  isSiteDestinationActive,
  journeyNavigationLinks,
  resourceNavigationLinks,
  type SiteDestinationHref,
} from "@/components/navigation/site-navigation-config";
import type { InterfaceMessageId } from "@/domain/localization/interface-messages";

type DesktopDisclosure = "journey" | "resources" | "language" | "theme" | "account";
type DesktopLinkDisclosure = Exclude<DesktopDisclosure, "language" | "theme" | "account">;
type DescribedNavigationLink = Readonly<{ href: SiteDestinationHref; labelId: InterfaceMessageId; descriptionId: InterfaceMessageId }>;

export function DesktopSiteNavigation({ pathname, accountNavigation }: Readonly<{
  pathname: string;
  accountNavigation: SiteAccountNavigationState;
}>) {
  const { locale, message } = useInterfaceMessages();
  const [disclosure, setDisclosure] = useState<DesktopDisclosure>();
  const navigationRef = useRef<HTMLElement>(null);
  const journeyButtonRef = useRef<HTMLButtonElement>(null);
  const resourcesButtonRef = useRef<HTMLButtonElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const { preference: themePreference } = useThemePreference();
  const accountButtonRef = useRef<HTMLButtonElement>(null);

  function isActive(href: SiteDestinationHref) {
    return isSiteDestinationActive(pathname, href);
  }

  function buttonRefFor(name: DesktopDisclosure) {
    if (name === "journey") return journeyButtonRef;
    if (name === "resources") return resourcesButtonRef;
    if (name === "language") return languageButtonRef;
    if (name === "theme") return themeButtonRef;
    return accountButtonRef;
  }

  function closeDisclosure() {
    setDisclosure(undefined);
  }

  function toggleDisclosure(name: DesktopDisclosure) {
    setDisclosure((current) => current === name ? undefined : name);
  }

  function openAndFocusFirstLink(name: DesktopDisclosure) {
    setDisclosure(name);
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`#desktop-${name}-navigation a`)?.focus());
  }

  useEffect(() => {
    const currentDisclosure = disclosure;
    if (!currentDisclosure) return;
    const activeDisclosure: DesktopDisclosure = currentDisclosure;

    function handlePointerDown(event: PointerEvent) {
      if (!navigationRef.current?.contains(event.target as Node)) setDisclosure(undefined);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const trigger = buttonRefFor(activeDisclosure);
      setDisclosure(undefined);
      requestAnimationFrame(() => trigger.current?.focus());
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [disclosure]);

  function directLink(href: SiteDestinationHref, labelId: InterfaceMessageId) {
    return (
      <Link href={href} aria-current={isActive(href) ? "page" : undefined} onClick={closeDisclosure} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-brand-link transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-[current=page]:bg-brand-soft aria-[current=page]:font-semibold">
        {message(labelId)}
      </Link>
    );
  }

  function linkDisclosure(name: DesktopLinkDisclosure, labelId: InterfaceMessageId, links: readonly DescribedNavigationLink[]) {
    const open = disclosure === name;
    const buttonRef = name === "journey" ? journeyButtonRef : resourcesButtonRef;
    const active = links.some(({ href }) => isActive(href));

    return (
      <li className="relative">
        <button ref={buttonRef} type="button" aria-expanded={open} aria-controls={`desktop-${name}-navigation`} onClick={() => toggleDisclosure(name)} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); openAndFocusFirstLink(name); } }} className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-brand-link transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${active ? "bg-brand-soft font-semibold" : ""}`}>
          {message(labelId)}
          <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {open && (
          <div id={`desktop-${name}-navigation`} className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-80 rounded-2xl border border-line bg-surface p-2 shadow-xl">
            <ul>
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} aria-current={isActive(link.href) ? "page" : undefined} onClick={closeDisclosure} className="block rounded-xl px-4 py-3 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus aria-[current=page]:bg-brand-soft">
                    <span className="block text-sm font-semibold text-ink">{message(link.labelId)}</span>
                    <span className="mt-1 block text-xs leading-5 text-ink-subtle">{message(link.descriptionId)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  }

  const languageOpen = disclosure === "language";
  const languageName = message(locale === "ja" ? "language.japanesePilot" : "language.english");
  const themeOpen = disclosure === "theme";
  const themeName = message(themeLabelIds[themePreference]);

  return (
    <nav ref={navigationRef} aria-label={message("navigation.primary")} className="hidden lg:block">
      <ul className="flex items-center gap-1">
        <li>{directLink("/", "navigation.home")}</li>
        <li>{directLink("/explore", "navigation.explore")}</li>
        {linkDisclosure("journey", "navigation.journey", journeyNavigationLinks)}
        {linkDisclosure("resources", "navigation.resources", resourceNavigationLinks)}
        <li>{directLink("/saved", "navigation.saved")}</li>
        <li className="relative">
          <button ref={languageButtonRef} type="button" aria-label={`${message("language.guideLanguage")}: ${languageName}`} aria-expanded={languageOpen} aria-controls="desktop-language-options" onClick={() => toggleDisclosure("language")} className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-brand-link transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${languageOpen || locale !== "en" ? "bg-brand-soft" : ""}`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" strokeLinecap="round" /></svg>
            <span>{locale.toUpperCase()}</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-3.5 w-3.5 transition-transform ${languageOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {languageOpen && (
            <div id="desktop-language-options" className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 rounded-2xl border border-line bg-surface p-3 shadow-xl">
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">{message("language.guideLanguage")}</p>
              <div className="mt-2"><ContentLanguageOptions onSelect={closeDisclosure} /></div>
              <p className="mt-2 border-t border-line-faint px-3 pt-3 text-xs leading-5 text-ink-subtle">{message("language.pilotAvailability")}</p>
              <div className="mt-3 border-t border-line-faint px-3 pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">{message("language.japaneseReadings")}</p>
                <ReadingAidOptions />
              </div>
            </div>
          )}
        </li>
        <li className="relative">
          <button ref={themeButtonRef} type="button" aria-label={`${message("theme.label")}: ${themeName}`} aria-expanded={themeOpen} aria-controls="desktop-theme-options" onClick={() => toggleDisclosure("theme")} className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-brand-link transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${themeOpen || themePreference !== "system" ? "bg-brand-soft" : ""}`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" /></svg>
          </button>
          {themeOpen && (
            <div id="desktop-theme-options" className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 rounded-2xl border border-line bg-surface p-3 shadow-xl">
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">{message("theme.label")}</p>
              <div className="mt-2"><ThemeOptions onSelect={closeDisclosure} /></div>
            </div>
          )}
        </li>
        <DesktopAccountControl accountNavigation={accountNavigation} isActive={(href) => isActive(href)} open={disclosure === "account"} buttonRef={accountButtonRef} onToggle={() => toggleDisclosure("account")} onOpenFromKeyboard={() => openAndFocusFirstLink("account")} onNavigate={closeDisclosure} />
      </ul>
    </nav>
  );
}
