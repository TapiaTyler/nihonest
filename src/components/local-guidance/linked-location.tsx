"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentProps } from "react";
import { AnnotatedDocumentViewer } from "@/components/documents/annotated-document-viewer";
import { singleQueryValue } from "@/lib/navigation/query-values";
import { LocalGuidancePanel } from "./local-guidance-panel";

/** Accepted `local` query values (location IDs and their legacy aliases) mapped to selectable location IDs. */
export type LocalLocationAliases = Readonly<Record<string, string>>;

function useLinkedLocationId(aliases: LocalLocationAliases): string | undefined {
  const requested = singleQueryValue(useSearchParams(), "local");
  return requested && Object.hasOwn(aliases, requested) ? aliases[requested] : undefined;
}

/**
 * Prebuilt article pages render the saved-location panel; these boundaries apply `?local=` after hydration and
 * remount when it changes, as the request-time page did. Render each inside Suspense with the plain component
 * (no linked location) as the fallback.
 */
export function LinkedLocalGuidancePanel({ locationAliases, ...props }: Omit<ComponentProps<typeof LocalGuidancePanel>, "linkedLocationId"> & Readonly<{ locationAliases: LocalLocationAliases }>) {
  const linkedLocationId = useLinkedLocationId(locationAliases);
  return <LocalGuidancePanel key={`local-guidance-${linkedLocationId ?? "saved"}`} {...props} linkedLocationId={linkedLocationId} />;
}

export function LinkedAnnotatedDocumentViewer({ locationAliases, families }: Readonly<{ locationAliases: LocalLocationAliases; families: ComponentProps<typeof AnnotatedDocumentViewer>["families"] }>) {
  const linkedLocationId = useLinkedLocationId(locationAliases);
  return <AnnotatedDocumentViewer key={`documents-${linkedLocationId ?? "saved"}`} families={families} linkedLocationId={linkedLocationId} />;
}
