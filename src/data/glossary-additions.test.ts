import { describe, expect, it } from "vitest";
import { glossaryAdditions } from "@/data/glossary-additions";
import { bankingGlossaryEntries } from "@/data/glossary/banking";
import { dailyLifeGlossaryEntries } from "@/data/glossary/daily-life";
import { employmentGlossaryEntries } from "@/data/glossary/employment";
import { healthcareGlossaryEntries } from "@/data/glossary/healthcare";
import { housingGlossaryEntries } from "@/data/glossary/housing";
import { immigrationGlossaryEntries } from "@/data/glossary/immigration";
import { languageGlossaryEntries } from "@/data/glossary/language";
import { municipalProceduresGlossaryEntries } from "@/data/glossary/municipal-procedures";
import { taxesGlossaryEntries } from "@/data/glossary/taxes";
import { transportationGlossaryEntries } from "@/data/glossary/transportation";

const glossaryEntries = [
  ...bankingGlossaryEntries,
  ...dailyLifeGlossaryEntries,
  ...employmentGlossaryEntries,
  ...healthcareGlossaryEntries,
  ...housingGlossaryEntries,
  ...immigrationGlossaryEntries,
  ...languageGlossaryEntries,
  ...municipalProceduresGlossaryEntries,
  ...taxesGlossaryEntries,
  ...transportationGlossaryEntries,
];

describe("glossary addition assembly", () => {
  it("assembles every topic-owned term exactly once in deterministic module order", () => {
    expect(glossaryEntries).toHaveLength(213);
    expect(glossaryAdditions.map(({ id }) => id)).toEqual(glossaryEntries.map(({ id }) => id));
    expect(new Set(glossaryAdditions.map(({ id }) => id)).size).toBe(glossaryAdditions.length);
  });
});
