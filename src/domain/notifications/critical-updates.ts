import { z } from "zod";
import type { GuidedJourney } from "@/domain/discovery/discovery";
import { notificationEventSchema, type NotificationEvent } from "./notifications";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const criticalUpdateJourneyTargetSchema = z.object({
  journeyId: stableIdSchema,
  routeId: stableIdSchema.optional(),
});

export const criticalUpdateReleaseSchema = z.object({
  id: z.uuid(),
  target: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("article"), id: stableIdSchema }),
    z.object({ kind: z.literal("residence-status"), id: stableIdSchema }),
  ]),
  title: z.string().trim().min(1).max(160),
  summary: z.string().trim().min(1).max(500),
  revision: z.string().trim().min(1).max(100),
  verificationNote: z.string().trim().min(1).max(300).optional(),
  editorialState: z.enum(["draft", "approved", "published"]),
  journeyTargets: z.array(criticalUpdateJourneyTargetSchema),
  createdAt: z.iso.datetime(),
  approvedAt: z.iso.datetime().optional(),
  publishedAt: z.iso.datetime().optional(),
  eventsGeneratedAt: z.iso.datetime().optional(),
}).superRefine((release, context) => {
  const approved = Boolean(release.approvedAt);
  const published = Boolean(release.publishedAt);
  if ((release.editorialState !== "draft") !== approved
    || (release.editorialState === "published") !== published
    || (Boolean(release.eventsGeneratedAt) && release.editorialState !== "published")) {
    context.addIssue({ code: "custom", path: ["editorialState"], message: "Editorial timestamps must match the release state." });
  }
});

export const criticalUpdateAccountContextSchema = z.object({
  userId: z.uuid(),
  criticalUpdatesEnabled: z.boolean(),
  savedContent: z.array(z.object({
    kind: z.enum(["article", "glossary-term", "residence-status"]),
    contentId: stableIdSchema,
    state: z.enum(["saved", "removed"]),
  })),
  journeyId: stableIdSchema.optional(),
  routeId: stableIdSchema.optional(),
});

export type CriticalUpdateRelease = z.infer<typeof criticalUpdateReleaseSchema>;
export type CriticalUpdateAccountContext = z.infer<typeof criticalUpdateAccountContextSchema>;
export type CriticalUpdateJourneyTarget = z.infer<typeof criticalUpdateJourneyTargetSchema>;
export const CRITICAL_UPDATE_RELEVANCE_REASONS = ["saved-item", "selected-journey"] as const;
export type CriticalUpdateRelevanceReason = typeof CRITICAL_UPDATE_RELEVANCE_REASONS[number];

/** Snapshots which selected journey routes include an affected article at publication time. */
export function journeyTargetsForArticle(articleId: string, journeys: readonly GuidedJourney[]): readonly CriticalUpdateJourneyTarget[] {
  const targets = journeys.flatMap<CriticalUpdateJourneyTarget>((journey) => {
    const routeTargets: CriticalUpdateJourneyTarget[] = journey.routes
      .filter((route) => route.articleId === articleId)
      .map((route) => ({ journeyId: journey.id, routeId: route.id }));
    const stepTargets = journey.phases.flatMap<CriticalUpdateJourneyTarget>((phase) => phase.steps.flatMap<CriticalUpdateJourneyTarget>((step) => {
      if (step.type !== "article" || step.articleId !== articleId) return [];
      return step.routeIds?.map((routeId) => ({ journeyId: journey.id, routeId }))
        ?? [{ journeyId: journey.id }];
    }));
    return [...routeTargets, ...stepTargets];
  });
  return [...new Map(targets.map((target) => [`${target.journeyId}:${target.routeId ?? "*"}`, target])).values()];
}

export function isCriticalUpdateRelevant(releaseInput: unknown, accountInput: unknown): boolean {
  const release = criticalUpdateReleaseSchema.parse(releaseInput);
  const account = criticalUpdateAccountContextSchema.parse(accountInput);
  if (release.editorialState !== "published" || release.eventsGeneratedAt || !account.criticalUpdatesEnabled) return false;

  const savedTarget = account.savedContent.some((saved) => saved.state === "saved"
    && saved.kind === release.target.kind && saved.contentId === release.target.id);
  const selectedJourneyTarget = Boolean(account.journeyId) && release.journeyTargets.some((target) => (
    target.journeyId === account.journeyId && (!target.routeId || target.routeId === account.routeId)
  ));
  return savedTarget || selectedJourneyTarget;
}

/** Re-evaluates current saved and journey relevance immediately before delivery. */
export function criticalUpdateDeliveryReasons(
  eventInput: unknown,
  accountInput: unknown,
): readonly CriticalUpdateRelevanceReason[] {
  const event = notificationEventSchema.parse(eventInput);
  const account = criticalUpdateAccountContextSchema.parse(accountInput);
  if (event.type === "reminder-due" || event.userId !== account.userId || !account.criticalUpdatesEnabled) return [];

  const target = event.type === "article-critical-update"
    ? { kind: "article" as const, id: event.payload.articleId }
    : { kind: "residence-status" as const, id: event.payload.residenceStatusId };
  const reasons: CriticalUpdateRelevanceReason[] = [];
  if (account.savedContent.some((saved) => saved.state === "saved"
    && saved.kind === target.kind && saved.contentId === target.id)) {
    reasons.push("saved-item");
  }
  if (account.journeyId && event.payload.journeyTargets.some((journeyTarget) => (
    journeyTarget.journeyId === account.journeyId
    && (!journeyTarget.routeId || journeyTarget.routeId === account.routeId)
  ))) {
    reasons.push("selected-journey");
  }
  return reasons;
}

export function createCriticalUpdateEvent(
  releaseInput: unknown,
  accountInput: unknown,
  eventId: string,
  createdAt: string,
): NotificationEvent | undefined {
  const release = criticalUpdateReleaseSchema.parse(releaseInput);
  const account = criticalUpdateAccountContextSchema.parse(accountInput);
  if (!isCriticalUpdateRelevant(release, account)) return undefined;

  const shared = {
    id: eventId,
    userId: account.userId,
    deduplicationKey: `critical-update-release:${release.id}`,
    createdAt,
    payload: {
      releaseId: release.id,
      title: release.title,
      revision: release.revision,
      summary: release.summary,
      verificationNote: release.verificationNote,
      journeyTargets: release.journeyTargets,
    },
  };
  return notificationEventSchema.parse(release.target.kind === "article"
    ? { ...shared, type: "article-critical-update", payload: { ...shared.payload, articleId: release.target.id } }
    : { ...shared, type: "residence-status-guidance-updated", payload: { ...shared.payload, residenceStatusId: release.target.id } });
}
