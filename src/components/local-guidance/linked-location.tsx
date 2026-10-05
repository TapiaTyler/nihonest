"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type ComponentProps } from "react";
import { AnnotatedDocumentViewer } from "@/components/documents/annotated-document-viewer";
import { singleQueryValue } from "@/lib/navigation/query-values";
import { LocalGuidancePanel } from "./local-guidance-panel";

/** Accepted `local` query values (location IDs and their legacy aliases) mapped to selectable location IDs. */
export type LocalLocationAliases = Readonly<Record<string, string>>;

function useLinkedLocationId(aliases: LocalLocationAliases): string | undefined {
  const requested = singleQueryValue(useSearchParams(), "local");
  return requested && Object.hasOwn(aliases, requested) ? aliases[requested] : undefined;
}

/** Reports the linked location; it reads the URL, so it renders only on the client, inside its own Suspense. */
function LinkedLocationReader({ aliases, onResolve }: Readonly<{ aliases: LocalLocationAliases; onResolve: (id: string | undefined) => void }>) {
  const linkedLocationId = useLinkedLocationId(aliases);
  useEffect(() => { onResolve(linkedLocationId); }, [linkedLocationId, onResolve]);
  return null;
}

/**
 * Prebuilt article pages hydrate the saved-location view in place, so a choice made while the page loads is kept.
 * The `?local=` value is read beside it and applied after hydration; a different value remounts the view, as the
 * request-time page did. Only the invisible reader suspends, never the server-rendered controls.
 */
function useLinkedLocation(aliases: LocalLocationAliases) {
  const [linkedLocationId, setLinkedLocationId] = useState<string | undefined>(undefined);
  const reader = <Suspense fallback={null}><LinkedLocationReader aliases={aliases} onResolve={setLinkedLocationId} /></Suspense>;
  return { linkedLocationId, reader };
}

export function LinkedLocalGuidancePanel({ locationAliases, ...props }: Omit<ComponentProps<typeof LocalGuidancePanel>, "linkedLocationId"> & Readonly<{ locationAliases: LocalLocationAliases }>) {
  const { linkedLocationId, reader } = useLinkedLocation(locationAliases);
  return <>{reader}<LocalGuidancePanel key={`local-guidance-${linkedLocationId ?? "saved"}`} {...props} linkedLocationId={linkedLocationId} /></>;
}

export function LinkedAnnotatedDocumentViewer({ locationAliases, families }: Readonly<{ locationAliases: LocalLocationAliases; families: ComponentProps<typeof AnnotatedDocumentViewer>["families"] }>) {
  const { linkedLocationId, reader } = useLinkedLocation(locationAliases);
  return <>{reader}<AnnotatedDocumentViewer key={`documents-${linkedLocationId ?? "saved"}`} families={families} linkedLocationId={linkedLocationId} /></>;
}
