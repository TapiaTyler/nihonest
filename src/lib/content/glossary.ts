import { glossaryTerms } from "@/data/glossary";

export function getAllGlossaryTerms() {
  return glossaryTerms;
}

export function getGlossaryTermById(id: string) {
  return glossaryTerms.find((term) => term.id === id);
}

export function getGlossaryTermBySlug(slug: string) {
  return glossaryTerms.find((term) => term.slug === slug);
}
