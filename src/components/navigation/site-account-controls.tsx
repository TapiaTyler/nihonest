"use client";

import Link from "next/link";
import type { RefObject } from "react";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import type { SiteAccountNavigationState } from "@/components/navigation/site-account-navigation";

type DesktopAccountControlProps = Readonly<{
  accountNavigation: SiteAccountNavigationState;
  isActive: (href: "/account" | "/reminders") => boolean;
  open: boolean;
  buttonRef: RefObject<HTMLButtonElement | null>;
  onToggle: () => void;
  onOpenFromKeyboard: () => void;
  onNavigate: () => void;
}>;

export function DesktopAccountControl({
  accountNavigation,
  isActive,
  open,
  buttonRef,
  onToggle,
  onOpenFromKeyboard,
  onNavigate,
}: DesktopAccountControlProps) {
  const { message } = useInterfaceMessages();
  const { session, signOut, signOutPending, signOutError } = accountNavigation;

  if (session.status !== "signed-in") {
    return (
      <li>
        <Link href="/account" aria-current={isActive("/account") ? "page" : undefined} onClick={onNavigate} className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-brand-link transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-[current=page]:bg-brand-soft aria-[current=page]:font-semibold">
          {message("navigation.login")}
        </Link>
      </li>
    );
  }

  const label = session.displayName || message("navigation.account");
  return (
    <li className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="desktop-account-navigation"
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            onOpenFromKeyboard();
          }
        }}
        title={session.displayName}
        className={`inline-flex min-h-11 max-w-44 items-center gap-2 rounded-full px-4 text-sm font-medium text-brand-link transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${isActive("/account") || isActive("/reminders") ? "bg-brand-soft font-semibold" : ""}`}
      >
        <span className="truncate">{label}</span>
        <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <div id="desktop-account-navigation" className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          <Link href="/account" aria-current={isActive("/account") ? "page" : undefined} onClick={onNavigate} className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus aria-[current=page]:bg-brand-soft">{message("navigation.accountSettings")}</Link>
          <Link href="/reminders" aria-current={isActive("/reminders") ? "page" : undefined} onClick={onNavigate} className="mt-1 block rounded-xl px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus aria-[current=page]:bg-brand-soft">{message("navigation.reminders")}</Link>
          <button type="button" disabled={signOutPending} onClick={() => void signOut().then((successful) => { if (successful) onNavigate(); })} className="mt-1 flex min-h-11 w-full cursor-pointer items-center rounded-xl px-4 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus disabled:cursor-wait disabled:opacity-60">{message(signOutPending ? "navigation.signingOut" : "navigation.signOut")}</button>
          {signOutError && <p role="status" className="px-4 py-2 text-xs leading-5 text-red-700">{signOutError}</p>}
        </div>
      )}
    </li>
  );
}

type MobileAccountControlProps = Readonly<{
  accountNavigation: SiteAccountNavigationState;
  isActive: (href: "/account" | "/reminders" | "/saved") => boolean;
  onNavigate: () => void;
}>;

const mobileLinkClass = "inline-flex min-h-12 w-full items-center rounded-xl px-3 text-base font-medium text-brand-deep-soft hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-[current=page]:bg-brand-soft aria-[current=page]:font-semibold";

export function MobileAccountControl({ accountNavigation, isActive, onNavigate }: MobileAccountControlProps) {
  const { message } = useInterfaceMessages();
  const { session, signOut, signOutPending, signOutError } = accountNavigation;

  return (
    <section aria-labelledby="mobile-navigation-personal" className="mt-6">
      <h3 id="mobile-navigation-personal" className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{message("navigation.personal")}</h3>
      <ul className="mt-2 space-y-1">
        <li><Link href="/saved" aria-current={isActive("/saved") ? "page" : undefined} onClick={onNavigate} className={mobileLinkClass}>{message("navigation.saved")}</Link></li>
        {session.status === "signed-in" ? (
          <>
            <li><Link href="/account" aria-current={isActive("/account") ? "page" : undefined} onClick={onNavigate} className={mobileLinkClass}>{message("navigation.accountSettings")}{session.displayName ? <span className="ml-2 truncate text-sm font-normal text-slate-500">({session.displayName})</span> : null}</Link></li>
            <li><Link href="/reminders" aria-current={isActive("/reminders") ? "page" : undefined} onClick={onNavigate} className={mobileLinkClass}>{message("navigation.reminders")}</Link></li>
            <li><button type="button" disabled={signOutPending} onClick={() => void signOut().then((successful) => { if (successful) onNavigate(); })} className="inline-flex min-h-12 w-full cursor-pointer items-center rounded-xl px-3 text-left text-base font-medium text-brand-deep-soft hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-wait disabled:opacity-60">{message(signOutPending ? "navigation.signingOut" : "navigation.signOut")}</button></li>
          </>
        ) : (
          <li><Link href="/account" aria-current={isActive("/account") ? "page" : undefined} onClick={onNavigate} className={mobileLinkClass}>{message("navigation.login")}</Link></li>
        )}
      </ul>
      {signOutError && <p role="status" className="px-3 pt-2 text-sm text-red-700">{signOutError}</p>}
    </section>
  );
}
