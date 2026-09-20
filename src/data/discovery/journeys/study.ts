import { guidedJourneySchema } from "@/domain/discovery/discovery";
import { articleStep, conditionalStep, routeChoice, settlementSteps } from "@/data/discovery/journey-steps";

/** Guided journeys owned by the study family. */
export const studentMovingToJapanJourney = guidedJourneySchema.parse({
    id: "student-moving-to-japan", groupId: "study-in-japan", title: "Student journey",
    description: "Choose short-term study or Student status, then follow only the preparation and arrival steps relevant to that route.",
    introduction: "First identify whether you will enter as a Temporary Visitor or under Student status. Selecting a route produces a focused sequence.",
    routes: [
      { id: "temporary-visitor-study", title: "Short-term study as a Temporary Visitor", description: "A short course completed within the admitted visitor stay without paid work.", articleId: "short-term-study-in-japan" },
      { id: "student-status", title: "Long-term study under Student status", description: "The residence route for qualifying study that requires school and immigration preparation.", articleId: "student-visa-and-certificate-of-eligibility" },
    ],
    phases: [
      { id: "plan", title: "Plan your studies", steps: [articleStep("planning-your-studies-in-japan"), articleStep("choosing-a-school-and-understanding-admission-requirements")] },
      { id: "choose-route", title: "Choose your study route", steps: [routeChoice] },
      { id: "prepare", title: "Prepare to enter", steps: [articleStep("preparing-to-enter-japan", ["student-status"])] },
      { id: "settle", title: "Arrive and settle", steps: [...settlementSteps(["student-status"]), articleStep("completing-school-arrival-procedures")] },
      { id: "work-and-transition", title: "Work, travel, and later transitions", steps: [conditionalStep("working-part-time-on-student-status", "If you plan to undertake paid work", ["student-status"]), conditionalStep("reentry-permission-and-temporary-travel", "If you will leave Japan temporarily and return during your period of stay", ["student-status"]), conditionalStep("continued-job-hunting-after-study", "If you graduate and qualify to continue job hunting", ["student-status"])] },
    ],
  });

export const acceptingInternationalStudentsJourney = guidedJourneySchema.parse({
    id: "accepting-international-students", groupId: "study-in-japan", title: "International student acceptance journey",
    description: "Plan a defensible admission, COE-support, arrival, enrollment, and ongoing-support workflow for an education provider.",
    introduction: "The school supports admission and evidence, but ISA issues the COE. This journey keeps institutional actions separate from the student's own duties.",
    phases: [
      { id: "understand", title: "Understand the student's route", steps: [articleStep("choosing-a-school-and-understanding-admission-requirements"), articleStep("student-visa-and-certificate-of-eligibility")] },
      { id: "accept-and-support", title: "Accept the student and support the application", steps: [articleStep("accepting-international-students-and-supporting-coe-applications")] },
      { id: "receive-and-support", title: "Receive and support the student", steps: [articleStep("completing-school-arrival-procedures"), conditionalStep("working-part-time-on-student-status", "When explaining optional paid work and outside-activity permission")] },
    ],
  });
