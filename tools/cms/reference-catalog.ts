import { annotatedDocumentFamilies } from "@/data/annotated-documents";
import { articleGroups, guidedJourneys } from "@/data/discovery";
import { sources } from "@/data/sources";

export type ReferenceKind = "source" | "journey" | "article-group" | "annotated-document";
export type ReferenceValue = (typeof sources)[number]
  | (typeof guidedJourneys)[number]
  | (typeof articleGroups)[number]
  | (typeof annotatedDocumentFamilies)[number];

export type ReferenceSummary = Readonly<{
  id: string;
  title: string;
  kind: ReferenceKind;
  /** Primary registry module; the definition may live in an imported module. */
  registryPath: string;
  capability: "inspect-only";
}>;

export type ReferenceDetail = ReferenceSummary & Readonly<{ value: ReferenceValue }>;

export type ReferenceCatalog = Readonly<{
  summaries: readonly ReferenceSummary[];
  records: readonly ReferenceDetail[];
  getRecord: (kind: ReferenceKind, id: string) => ReferenceDetail | undefined;
}>;

const sourceRegistryPath = "src/data/sources.ts";
const discoveryRegistryPath = "src/data/discovery.ts";
const documentRegistryPath = "src/data/annotated-documents.ts";

/**
 * Read-only view of the canonical reference registries. Values are retained as-is,
 * including nested routes, conditions, monitoring dates, document variants and versions.
 */
export function readReferenceCatalog(): ReferenceCatalog {
  const records: ReferenceDetail[] = [
    ...sources.map((value) => ({
      id: value.id,
      title: value.title,
      kind: "source" as const,
      registryPath: sourceRegistryPath,
      capability: "inspect-only" as const,
      value,
    })),
    ...guidedJourneys.map((value) => ({
      id: value.id,
      title: value.title,
      kind: "journey" as const,
      registryPath: discoveryRegistryPath,
      capability: "inspect-only" as const,
      value,
    })),
    ...articleGroups.map((value) => ({
      id: value.id,
      title: value.title,
      kind: "article-group" as const,
      registryPath: discoveryRegistryPath,
      capability: "inspect-only" as const,
      value,
    })),
    ...annotatedDocumentFamilies.map((value) => ({
      id: value.id,
      title: value.title,
      kind: "annotated-document" as const,
      registryPath: documentRegistryPath,
      capability: "inspect-only" as const,
      value,
    })),
  ];

  const byKey = new Map(records.map((record) => [`${record.kind}:${record.id}`, record]));
  const summaries = records.map(({ id, title, kind, registryPath, capability }) => ({ id, title, kind, registryPath, capability }));

  return {
    summaries,
    records,
    getRecord: (kind, id) => byKey.get(`${kind}:${id}`),
  };
}
