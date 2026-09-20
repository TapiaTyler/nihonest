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

// Module and local array order make assembly deterministic; UI surfaces apply their own locale-aware sorting.
export const glossaryAdditions = [
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
