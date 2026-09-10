import { describe, expect, it } from "vitest";
import type { GuidedJourney } from "@/domain/discovery/discovery";
import { createCriticalUpdateEvent, criticalUpdateDeliveryReasons, isCriticalUpdateRelevant, journeyTargetsForArticle } from "./critical-updates";

const publishedRelease = {
  id: "10000000-0000-4000-8000-000000000001",
  target: { kind: "article", id: "renewing-status-of-residence" },
  title: "Renewal guidance changed",
  summary: "The reviewed renewal evidence list has changed.",
  revision: "2026-10-01",
  verificationNote: "Confirm the current list with Immigration Services before applying.",
  editorialState: "published",
  journeyTargets: [{ journeyId: "professional-worker", routeId: "engineer" }],
  createdAt: "2026-09-28T00:00:00.000Z",
  approvedAt: "2026-09-30T00:00:00.000Z",
  publishedAt: "2026-10-01T00:00:00.000Z",
} as const;

const account = {
  userId: "20000000-0000-4000-8000-000000000002",
  criticalUpdatesEnabled: true,
  savedContent: [],
  journeyId: "professional-worker",
  routeId: "engineer",
} as const;

describe("targeted critical updates", () => {
  it("matches a saved canonical target", () => {
    expect(isCriticalUpdateRelevant(publishedRelease, {
      ...account,
      journeyId: undefined,
      routeId: undefined,
      savedContent: [{ kind: "article", contentId: "renewing-status-of-residence", state: "saved" }],
    })).toBe(true);
  });

  it("matches only the selected route for route-specific guidance", () => {
    expect(isCriticalUpdateRelevant(publishedRelease, account)).toBe(true);
    expect(isCriticalUpdateRelevant(publishedRelease, { ...account, routeId: "legal-accounting" })).toBe(false);
  });

  it("excludes drafts, processed releases, removed saves, and disabled topics", () => {
    expect(isCriticalUpdateRelevant({ ...publishedRelease, editorialState: "draft", approvedAt: undefined, publishedAt: undefined }, account)).toBe(false);
    expect(isCriticalUpdateRelevant({ ...publishedRelease, eventsGeneratedAt: "2026-10-01T01:00:00.000Z" }, account)).toBe(false);
    expect(isCriticalUpdateRelevant(publishedRelease, { ...account, criticalUpdatesEnabled: false })).toBe(false);
    expect(isCriticalUpdateRelevant(publishedRelease, {
      ...account, journeyId: undefined, routeId: undefined,
      savedContent: [{ kind: "article", contentId: "renewing-status-of-residence", state: "removed" }],
    })).toBe(false);
  });

  it("creates a factual deduplicated event for a relevant account", () => {
    const event = createCriticalUpdateEvent(publishedRelease, account, "30000000-0000-4000-8000-000000000003", "2026-10-01T01:00:00.000Z");
    expect(event).toMatchObject({
      type: "article-critical-update",
      deduplicationKey: "critical-update-release:10000000-0000-4000-8000-000000000001",
      payload: {
        releaseId: publishedRelease.id,
        summary: "The reviewed renewal evidence list has changed.",
        journeyTargets: publishedRelease.journeyTargets,
      },
    });
  });

  it("re-evaluates saved and selected-journey reasons from current account state", () => {
    const event = createCriticalUpdateEvent(publishedRelease, account, "30000000-0000-4000-8000-000000000003", "2026-10-01T01:00:00.000Z")!;
    expect(criticalUpdateDeliveryReasons(event, {
      ...account,
      savedContent: [{ kind: "article", contentId: "renewing-status-of-residence", state: "saved" }],
    })).toEqual(["saved-item", "selected-journey"]);
    expect(criticalUpdateDeliveryReasons(event, { ...account, routeId: "legal-accounting" })).toEqual([]);
  });

  it("derives global and route-specific journey targets without duplicates", () => {
    const journey: GuidedJourney = {
      id: "worker", groupId: "work", title: "Worker", description: "Worker guidance", introduction: "Start here.",
      routes: [{ id: "engineer", title: "Engineer", description: "Engineer route", articleId: "engineer-guide" }],
      phases: [{ id: "arrival", title: "Arrival", steps: [
        { id: "shared", type: "article", articleId: "shared-guide", requiredness: "required" },
      ] }],
    };
    expect(journeyTargetsForArticle("shared-guide", [journey])).toEqual([{ journeyId: "worker" }]);
    expect(journeyTargetsForArticle("engineer-guide", [journey])).toEqual([{ journeyId: "worker", routeId: "engineer" }]);
  });
});
