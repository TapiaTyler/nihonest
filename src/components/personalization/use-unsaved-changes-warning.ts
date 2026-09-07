"use client";

import { useEffect, useRef } from "react";

const warningMessage = "You have unsaved changes to your starting point. Leave without saving them?";

export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
  const allowNavigationRef = useRef(false);

  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  useEffect(() => {
    let restoringHistory = false;

    function shouldWarn() {
      return hasUnsavedChangesRef.current && !allowNavigationRef.current;
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!shouldWarn()) return;
      event.preventDefault();
      event.returnValue = true;
    }

    function handleDocumentClick(event: MouseEvent) {
      if (!shouldWarn() || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank" || link.hasAttribute("download")) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || link.href === window.location.href) return;

      if (!window.confirm(warningMessage)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    function handlePopState() {
      if (restoringHistory) {
        restoringHistory = false;
        return;
      }
      if (!shouldWarn() || window.confirm(warningMessage)) return;

      // popstate has already moved backward; moving forward restores the onboarding page when the user cancels.
      restoringHistory = true;
      window.history.go(1);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, []);

  return function allowNavigation() {
    allowNavigationRef.current = true;
  };
}
