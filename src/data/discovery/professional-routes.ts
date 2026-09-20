/** Shared alternatives used by professional-worker, employer, and side-work journeys. */
export const professionalRoutes = [
  { id: "professor", title: "Professor", description: "University and equivalent academic teaching or research route.", articleId: "professor-status" },
  { id: "artist", title: "Artist", description: "Qualifying income-producing artistic activity route.", articleId: "artist-status" },
  { id: "religious-activities", title: "Religious Activities", description: "Religious work dispatched by a foreign religious organization.", articleId: "religious-activities-status" },
  { id: "journalist", title: "Journalist", description: "Covered journalistic activity under contract with a foreign media organization.", articleId: "journalist-status" },
  { id: "legal-accounting-services", title: "Legal / Accounting Services", description: "Regulated legal or accounting work requiring the applicable Japanese qualification.", articleId: "legal-accounting-services-status" },
  { id: "medical-services", title: "Medical Services", description: "Regulated medical work under an accepted Japanese professional qualification.", articleId: "medical-services-status" },
  { id: "researcher", title: "Researcher", description: "Research activity under a qualifying contract with an organization in Japan.", articleId: "researcher-status" },
  { id: "instructor", title: "Instructor", description: "Language or other education at covered schools and institutions.", articleId: "instructor-status" },
  { id: "engineer-humanities-international-services", title: "Engineer / Humanities / International Services", description: "Qualifying technical, humanities, or international-services work.", articleId: "engineer-specialist-humanities-international-services-status" },
  { id: "intra-company-transferee", title: "Intra-company Transferee", description: "A qualifying transfer from an overseas office to a related office in Japan.", articleId: "intra-company-transferee-status" },
  { id: "nursing-care", title: "Nursing Care", description: "Covered care work using the required Japanese qualification.", articleId: "nursing-care-status" },
] as const;
