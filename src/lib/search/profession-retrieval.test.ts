import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

async function articleSource(slug: string): Promise<string> {
  return readFile(resolve(process.cwd(), `content/articles/${slug}.mdx`), "utf8");
}

describe("ambiguous profession retrieval metadata", () => {
  it("routes veterinary and psychology queries to comparison guidance", async () => {
    const [workChooser, medicalChooser] = await Promise.all([
      articleSource("choosing-a-work-status-and-coe"),
      articleSource("choosing-a-status-for-medical-and-care-work-in-japan"),
    ]);

    for (const query of ["veterinarian visa Japan", "psychologist visa Japan"]) {
      expect(workChooser).toContain(`"${query}"`);
      expect(medicalChooser).toContain(`"${query}"`);
    }
  });

  it("keeps architecture and electrician queries inside duty-based comparisons", async () => {
    const [workChooser, professionalGuide] = await Promise.all([
      articleSource("choosing-a-work-status-and-coe"),
      articleSource("engineer-specialist-humanities-international-services-status"),
    ]);

    expect(workChooser).toContain('"architect visa Japan"');
    expect(workChooser).toContain('"electrician visa Japan"');
    expect(professionalGuide).toContain('"architectural designer"');
    expect(professionalGuide).toContain('"electrical engineer"');
    expect(professionalGuide).not.toContain('"electrician"');
  });
});
