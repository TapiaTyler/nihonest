import { guidedJourneySchema } from "@/domain/discovery/discovery";
import { articleStep, routeChoice, settlementSteps } from "@/data/discovery/journey-steps";

/** Guided journeys owned by the culture-and-training family. */
export const culturalActivitiesOrTrainingInJapanJourney = guidedJourneySchema.parse({
    id: "cultural-activities-or-training-in-japan", groupId: "culture-and-training", title: "Culture and training journey",
    description: "Choose unpaid cultural study or a covered training arrangement, then follow the relevant long-term entry sequence.",
    introduction: "Cultural Activities and Trainee are alternatives with different authorized activities.",
    routes: [
      { id: "cultural-activities", title: "Cultural Activities", description: "Qualifying unpaid cultural or academic activity.", articleId: "cultural-activities-visa" },
      { id: "trainee", title: "Trainee", description: "A covered training arrangement distinct from ordinary employment.", articleId: "training-visa" },
    ],
    phases: [
      { id: "understand", title: "Understand the residence framework", steps: [articleStep("visa-and-status-of-residence-explained")] },
      { id: "choose-route", title: "Choose culture or training", steps: [routeChoice] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Arrive and settle", steps: settlementSteps() },
    ],
  });
