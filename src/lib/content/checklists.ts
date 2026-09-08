import { checklistDefinitionSchema, type ChecklistDefinition } from "@/domain/roadmap/personalized-roadmap";
import { getAllArticles } from "./articles";

// One canonical article-backed definition lets shared journey steps retain the same progress everywhere they appear.
const checklistDefinitions: readonly ChecklistDefinition[] = getAllArticles().map(({ metadata }) => checklistDefinitionSchema.parse({
  id: metadata.id,
  title: metadata.title,
  description: metadata.description,
  relatedArticleIds: [metadata.id],
}));

export function getChecklistDefinitionById(id: string): ChecklistDefinition | undefined {
  return checklistDefinitions.find((definition) => definition.id === id);
}

export function getAllChecklistDefinitions(): readonly ChecklistDefinition[] {
  return checklistDefinitions;
}
