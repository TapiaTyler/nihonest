import { guidedJourneySchema } from "@/domain/discovery/discovery";
import { articleStep, conditionalStep, routeChoice } from "@/data/discovery/journey-steps";

/** Guided journeys owned by the short-stay-and-official family. */
export const shortVisitToJapanJourney = guidedJourneySchema.parse({
    id: "short-visit-to-japan", groupId: "short-stay-and-medical", title: "Short visit journey",
    description: "Separate the visa or exemption channel from the Temporary Visitor status and period granted at landing.",
    introduction: "Passport, nationality, place of residence, purpose, and duration affect the entry channel. Temporary Visitor does not authorize ordinary paid work or resident settlement.",
    phases: [
      { id: "plan", title: "Plan the visit", steps: [articleStep("visa-and-status-of-residence-explained"), articleStep("temporary-visitor-and-short-stay"), conditionalStep("short-term-study-in-japan", "If the visit includes a short course")] },
      { id: "enter", title: "Understand entry records", steps: [articleStep("documents-received-when-entering-japan")] },
    ],
  });

export const medicalVisitToJapanJourney = guidedJourneySchema.parse({
    id: "medical-visit-to-japan", groupId: "short-stay-and-medical", title: "Medical stay journey",
    description: "Choose the planned Medical Stay or ordinary short-visit route, then distinguish treatment of up to ninety days from qualifying longer hospitalization.",
    introduction: "Treatment duration, hospitalization, repeat visits, coordinator, attendant, and funding affect the route and evidence. Medical arrangements do not themselves grant immigration permission.",
    routes: [
      { id: "medical-stay", title: "Medical Stay", description: "Planned treatment coordinated with a Japanese medical institution and registered guarantor, including the longer-hospitalization branch when applicable.", articleId: "medical-stay-visa" },
      { id: "temporary-visitor", title: "Ordinary short visit", description: "A qualifying short, non-remunerative visit where the ordinary Temporary Visitor framework is appropriate rather than the Medical Stay scheme.", articleId: "temporary-visitor-and-short-stay" },
    ],
    phases: [
      { id: "understand", title: "Understand visit permission", steps: [articleStep("visa-and-status-of-residence-explained")] },
      { id: "choose-route", title: "Choose the visit route", steps: [routeChoice] },
      { id: "enter", title: "Understand entry records", steps: [articleStep("documents-received-when-entering-japan")] },
    ],
  });

export const diplomaticOrOfficialAssignmentJourney = guidedJourneySchema.parse({
    id: "diplomatic-or-official-assignment", groupId: "diplomatic-and-official", title: "Diplomatic and official assignment journey",
    description: "Distinguish recognized Diplomatic and Official assignments from private travel using a diplomatic or official passport.",
    introduction: "Role, purpose, sending organization, and Japan's recognition control the route. Passport type alone does not, and these statuses sit outside the ordinary residence-card system.",
    routes: [
      { id: "diplomatic", title: "Diplomatic", description: "Recognized diplomatic, consular, or comparable protected activity and qualifying same-household family members.", articleId: "diplomatic-visa" },
      { id: "official", title: "Official", description: "Recognized foreign-government or international-organization business outside Diplomat status and qualifying same-household family members.", articleId: "official-visa" },
    ],
    phases: [
      { id: "understand", title: "Understand the residence framework", steps: [articleStep("visa-and-status-of-residence-explained")] },
      { id: "choose-route", title: "Choose the assignment route", steps: [routeChoice] },
      { id: "enter", title: "Understand entry records", steps: [conditionalStep("documents-received-when-entering-japan", "If the general entry-document guidance applies to the assignment")] },
    ],
  });
