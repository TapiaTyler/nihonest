import { getAllArticles } from "@/lib/content/articles";
import { buildRepositorySourceRegistry } from "@/lib/source-monitoring/repository-source-registry";

const registry = buildRepositorySourceRegistry(getAllArticles().map(({ metadata }) => metadata));

export const sourceDependencyGraph = registry.graph;
export const sourceRegistryFindings = registry.findings;

export function getSourceDependencyEntry(sourceId: string) {
  return sourceDependencyGraph.find((entry) => entry.sourceId === sourceId);
}
