"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import { JapaneseReading } from "@/components/localization/japanese-reading";

export function InlineGlossaryTerm({
  term,
  children,
  className = "",
}: Readonly<{
  term: JapaneseTerm;
  children?: ReactNode;
  className?: string;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipId = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const touchDisclosureShown = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    function closeWhenOutside(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        touchDisclosureShown.current = false;
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        touchDisclosureShown.current = false;
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeWhenOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeWhenOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const usesTouchInteraction = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    // A first touch discloses pronunciation context; the second activates the same semantic link without a separate mobile-only control.
    if (usesTouchInteraction && !touchDisclosureShown.current) {
      event.preventDefault();
      touchDisclosureShown.current = true;
      setIsOpen(true);
    }
  }

  return (
    <span
      ref={wrapperRef}
      className="relative inline-flex"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setIsOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setIsOpen(false);
      }}
      onFocusCapture={() => setIsOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <Link
        href={`/glossary/${term.slug}`}
        aria-describedby={tooltipId}
        aria-expanded={isOpen}
        onClick={handleClick}
        className={`cursor-pointer rounded-sm font-semibold text-teal-800 underline decoration-dotted decoration-teal-500 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${className}`}
      >
        {children ?? <span lang="ja">{term.japanese}</span>}
      </Link>
      <span
        id={tooltipId}
        role="tooltip"
        className={`${isOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"} pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl bg-slate-950 px-4 py-3 text-left text-sm font-normal leading-5 text-white shadow-xl transition max-sm:fixed max-sm:bottom-4 max-sm:left-4 max-sm:right-4 max-sm:mb-0 max-sm:w-auto max-sm:max-w-none max-sm:translate-x-0`}
      >
        <span className="block font-semibold">{term.englishName}</span>
        <span className="mt-1 block text-slate-200">
          <JapaneseReading kana={term.kana} romaji={term.romaji} />
        </span>
        <span className="mt-2 block text-xs text-slate-300">Select the term to open its full glossary entry.</span>
      </span>
    </span>
  );
}
