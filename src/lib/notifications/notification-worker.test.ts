// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { prepareEmailDelivery, transitionNotificationDelivery, type NotificationDelivery } from "@/domain/notifications/notification-delivery";
import { type NotificationEvent, type NotificationPreferences } from "@/domain/notifications/notifications";
import type { CriticalUpdateAccountContext } from "@/domain/notifications/critical-updates";
import { runNotificationWorker, type ClaimedEmailContext, type EmailDeliveryCompletion, type NotificationWorkerStore } from "./notification-worker";

const startedAt = "2026-10-01T00:00:00.000Z";
const event: NotificationEvent = {
  id: "10000000-0000-4000-8000-000000000001",
  userId: "20000000-0000-4000-8000-000000000002",
  type: "reminder-due", deduplicationKey: "reminder-due:fixture", createdAt: startedAt,
  payload: { reminderId: "30000000-0000-4000-8000-000000000003", title: "Private reminder title", scheduledFor: startedAt },
};
const preferences: NotificationPreferences = {
  emailEnabled: true, deadlineRemindersEnabled: true, criticalUpdatesEnabled: true, timeZone: "UTC", updatedAt: startedAt,
};
const emailContext = { fromName: "Nihonest", fromAddress: "sender@example.test", siteOrigin: "https://example.test" };

/** In-memory lease model for orchestration tests; this does not establish PostgreSQL concurrency. */
function fixture(events: NotificationEvent[] = [event]) {
  let instant = startedAt;
  let currentPreferences = { ...preferences };
  let criticalUpdateAccountContext: CriticalUpdateAccountContext | undefined;
  let token = 0;
  const rows: NotificationDelivery[] = [];
  const store = {
    readWorkerTime: vi.fn(async () => instant),
    inspectEmailDeliveryBacklog: vi.fn(async ({ maxAttempts }: { maxAttempts: number }) => ({
      exhaustedFailures: rows.filter((row) => row.state === "failed" && row.attemptCount >= maxAttempts).length,
      exhaustedExpiredClaims: rows.filter((row) => row.state === "processing" && row.attemptCount >= maxAttempts && row.claimExpiresAt! <= instant).length,
    })),
    generateDueReminderEvents: vi.fn(async () => 0),
    generateTargetedCriticalUpdateEvents: vi.fn(async () => 0),
    prepareEmailDeliveries: vi.fn(async ({ limit }: { now: string; limit: number }) => {
      let prepared = 0;
      for (const candidate of events) {
        if (rows.some((row) => row.eventId === candidate.id) || prepared === limit) continue;
        rows.push(prepareEmailDelivery(candidate, currentPreferences, `40000000-0000-4000-8000-${String(rows.length + 1).padStart(12, "0")}`, instant));
        prepared++;
      }
      return prepared;
    }),
    claimEmailDeliveries: vi.fn(async ({ now, maxAttempts, leaseSeconds }: { now: string; limit: 1; maxAttempts: number; leaseSeconds: number }) => {
      const index = rows.findIndex((row) => row.attemptCount < maxAttempts && (
        ((row.state === "pending" || row.state === "failed") && row.availableAt <= now)
        || (row.state === "processing" && row.claimExpiresAt! <= now)
      ));
      if (index < 0) return [];
      const row = rows[index];
      const claimToken = `50000000-0000-4000-8000-${String(++token).padStart(12, "0")}`;
      const claimExpiresAt = new Date(Date.parse(now) + leaseSeconds * 1000).toISOString();
      rows[index] = row.state === "processing" ? {
        ...row, attemptCount: row.attemptCount + 1, lastAttemptedAt: now, updatedAt: now, claimToken, claimExpiresAt,
      } : transitionNotificationDelivery(row, "processing", now, { claimToken, claimExpiresAt });
      return [rows[index]];
    }),
    loadEmailContext: vi.fn(async (row: NotificationDelivery): Promise<ClaimedEmailContext> => ({
      event: events.find((candidate) => candidate.id === row.eventId)!,
      preferences: { ...currentPreferences }, recipient: { status: "eligible", address: "private-reader@example.test" },
      criticalUpdateAccountContext,
    })),
    finalizeEmailDelivery: vi.fn(async (completion: EmailDeliveryCompletion) => {
      const index = rows.findIndex((row) => row.id === completion.deliveryId);
      const row = rows[index];
      if (!row || row.state !== "processing" || row.claimToken !== completion.claimToken || row.claimExpiresAt! <= completion.now) {
        throw new Error("Stale claim");
      }
      rows[index] = transitionNotificationDelivery(row, completion.state, completion.now, completion);
    }),
  } satisfies NotificationWorkerStore;
  const send = vi.fn(async () => ({ providerMessageId: "fixture-message" }));
  return {
    store, rows, send,
    setTime(value: string) { instant = value; },
    setConsent(value: boolean) { currentPreferences = { ...currentPreferences, emailEnabled: value }; },
    setReminderConsent(value: boolean) { currentPreferences = { ...currentPreferences, deadlineRemindersEnabled: value }; },
    setCriticalContext(value: CriticalUpdateAccountContext) { criticalUpdateAccountContext = value; },
    input: { jobsEnabled: true, store, delivery: { provider: { send }, context: emailContext } },
  };
}

describe("notification worker preparation", () => {
  it("terminally suppresses an ineligible recipient without sending or later retries", async () => {
    const f = fixture();
    f.store.loadEmailContext.mockResolvedValueOnce({ event, preferences, recipient: { status: "suppressed" } });
    expect(await runNotificationWorker(f.input)).toMatchObject({ suppressed: 1, sent: 0, failed: 0, infrastructureErrors: 0, exitCode: 0 });
    expect(f.send).not.toHaveBeenCalled();
    expect(f.rows[0]).toMatchObject({ state: "suppressed", attemptCount: 1 });
    expect(f.store.finalizeEmailDelivery).toHaveBeenCalledWith(expect.objectContaining({ state: "suppressed", claimToken: expect.any(String) }));
    f.setTime("2026-10-02T00:00:00.000Z");
    expect(await runNotificationWorker(f.input)).toMatchObject({ claimed: 0, sent: 0, failed: 0 });
    expect(f.rows[0].attemptCount).toBe(1);
  });

  it.each(["id", "userId"] as const)("rejects mismatched event %s even for an ineligible recipient", async (field) => {
    const f = fixture();
    f.store.loadEmailContext.mockResolvedValueOnce({ event: { ...event, [field]: "20000000-0000-4000-8000-000000000009" }, preferences, recipient: { status: "suppressed" } });
    expect(await runNotificationWorker(f.input)).toMatchObject({ suppressed: 0, failed: 1, infrastructureErrors: 1, exitCode: 1 });
    expect(f.send).not.toHaveBeenCalled();
  });

  it("does no I/O when jobs are disabled", async () => {
    const f = fixture();
    expect(await runNotificationWorker({ ...f.input, jobsEnabled: false })).toMatchObject({ status: "jobs-disabled", exitCode: 0 });
    expect(f.store.generateDueReminderEvents).not.toHaveBeenCalled();
    expect(f.store.readWorkerTime).not.toHaveBeenCalled();
    expect(f.store.inspectEmailDeliveryBacklog).not.toHaveBeenCalled();
    expect(f.store.claimEmailDeliveries).not.toHaveBeenCalled();
    expect(f.send).not.toHaveBeenCalled();
  });

  it("generates and prepares without claiming or consuming attempts when delivery is disabled", async () => {
    const f = fixture();
    expect(await runNotificationWorker({ ...f.input, delivery: undefined })).toMatchObject({ status: "delivery-disabled", deliveriesPrepared: 1 });
    expect(f.store.generateTargetedCriticalUpdateEvents).toHaveBeenCalled();
    expect(f.store.claimEmailDeliveries).not.toHaveBeenCalled();
    expect(f.rows[0]).toMatchObject({ state: "pending", attemptCount: 0 });
    expect(f.send).not.toHaveBeenCalled();
  });

  it("finalizes opt-in work once across duplicate passes and reports only aggregate data", async () => {
    const f = fixture();
    const result = await runNotificationWorker(f.input);
    expect(result).toMatchObject({ status: "completed", exitCode: 0, claimed: 1, sent: 1 });
    expect(await runNotificationWorker(f.input)).toMatchObject({ claimed: 0, deliveriesPrepared: 0 });
    expect(f.send).toHaveBeenCalledTimes(1);
    expect(f.store.finalizeEmailDelivery).toHaveBeenCalledWith(expect.objectContaining({
      claimToken: "50000000-0000-4000-8000-000000000001", state: "sent", providerMessageId: "fixture-message",
    }));
    expect(JSON.stringify(result)).not.toMatch(/private|example|10000000|20000000|50000000/);
  });

  it("preserves terminal suppression for initially opted-out accounts", async () => {
    const f = fixture();
    f.setConsent(false);
    expect(await runNotificationWorker(f.input)).toMatchObject({ claimed: 0, deliveriesPrepared: 1 });
    f.setConsent(true);
    expect(await runNotificationWorker(f.input)).toMatchObject({ claimed: 0 });
    expect(f.rows[0].state).toBe("suppressed");
    expect(f.send).not.toHaveBeenCalled();
  });

  it("rechecks consent after preparation and before sending", async () => {
    const f = fixture();
    await f.store.prepareEmailDeliveries({ now: startedAt, limit: 100 });
    f.setConsent(false);
    expect(await runNotificationWorker(f.input)).toMatchObject({ suppressed: 1, sent: 0 });
    expect(f.send).not.toHaveBeenCalled();
    expect(f.rows[0].state).toBe("suppressed");
  });

  it("fails closed for critical updates without current account relevance", async () => {
    const criticalEvent: NotificationEvent = {
      ...event, type: "article-critical-update",
      payload: { articleId: "sample-guide", releaseId: "60000000-0000-4000-8000-000000000006", title: "Update", revision: "1", summary: "Changed", journeyTargets: [] },
    };
    const f = fixture([criticalEvent]);
    expect(await runNotificationWorker(f.input)).toMatchObject({ suppressed: 1 });
    expect(f.send).not.toHaveBeenCalled();
  });

  it("sends a critical update for a currently saved target and finalizes it once", async () => {
    const criticalEvent: NotificationEvent = {
      ...event, type: "article-critical-update",
      payload: { articleId: "sample-guide", releaseId: "60000000-0000-4000-8000-000000000006", title: "Update", revision: "1", summary: "Changed", journeyTargets: [] },
    };
    const f = fixture([criticalEvent]);
    f.setCriticalContext({
      userId: event.userId, criticalUpdatesEnabled: true,
      savedContent: [{ kind: "article", contentId: "sample-guide", state: "saved" }],
    });
    expect(await runNotificationWorker(f.input)).toMatchObject({ sent: 1, suppressed: 0, exitCode: 0 });
    expect(f.send).toHaveBeenCalledTimes(1);
    expect(f.rows[0]).toMatchObject({ state: "sent", providerMessageId: "fixture-message" });
    expect(await runNotificationWorker(f.input)).toMatchObject({ claimed: 0, sent: 0 });
    expect(f.send).toHaveBeenCalledTimes(1);
  });

  it("suppresses prepared reminders when topic consent is withdrawn but email stays enabled", async () => {
    const f = fixture();
    await f.store.prepareEmailDeliveries({ now: startedAt, limit: 100 });
    f.setReminderConsent(false);
    expect(await runNotificationWorker(f.input)).toMatchObject({ suppressed: 1, sent: 0, exitCode: 0 });
    expect(f.rows[0].state).toBe("suppressed");
    expect(f.send).not.toHaveBeenCalled();
  });

  it.each(["context", "provider", "completion"] as const)("stops on a malformed %s clock with one infrastructure error and leaves the claim recoverable", async (stage) => {
    const f = fixture([event, { ...event, id: "10000000-0000-4000-8000-000000000009", deduplicationKey: "second" }]);
    // Generation, critical generation, preparation, claim, context, provider, completion.
    const invalidRead = { context: 5, provider: 6, completion: 7 }[stage];
    let reads = 0;
    f.store.readWorkerTime.mockImplementation(async () => ++reads === invalidRead ? "private invalid timestamp" : startedAt);
    const result = await runNotificationWorker(f.input);
    expect(result).toMatchObject({ claimed: 1, sent: 0, failed: 0, infrastructureErrors: 1, exitCode: 1 });
    expect(f.store.finalizeEmailDelivery).not.toHaveBeenCalled();
    expect(f.rows.map((row) => row.state)).toEqual(["processing", "pending"]);
    expect(f.send).toHaveBeenCalledTimes(stage === "completion" ? 1 : 0);
    expect(JSON.stringify(result)).not.toContain("private");
  });

  it("counts a persistently malformed clock once after context loading and claims no later work", async () => {
    const f = fixture([event, { ...event, id: "10000000-0000-4000-8000-000000000009", deduplicationKey: "second" }]);
    const load = f.store.loadEmailContext.getMockImplementation()!;
    f.store.loadEmailContext.mockImplementation(async (row) => {
      f.setTime("invalid private clock");
      return load(row);
    });
    expect(await runNotificationWorker(f.input)).toMatchObject({ claimed: 1, failed: 0, infrastructureErrors: 1, exitCode: 1 });
    expect(f.store.finalizeEmailDelivery).not.toHaveBeenCalled();
    expect(f.store.claimEmailDeliveries).toHaveBeenCalledTimes(1);
    expect(f.send).not.toHaveBeenCalled();
  });

  it.each(["invalid", "throws"])("rejects an initial database clock that %s before generation", async (mode) => {
    const f = fixture();
    f.store.readWorkerTime.mockImplementation(async () => {
      if (mode === "throws") throw new Error("Private clock failure");
      return "invalid private clock";
    });
    expect(await runNotificationWorker(f.input)).toMatchObject({ claimed: 0, infrastructureErrors: 1, exitCode: 1 });
    expect(f.store.generateDueReminderEvents).not.toHaveBeenCalled();
    expect(f.send).not.toHaveBeenCalled();
  });

  it("honors the per-pass limit and claims messages just before processing", async () => {
    const f = fixture([event, { ...event, id: "10000000-0000-4000-8000-000000000009", deduplicationKey: "second" }]);
    const result = await runNotificationWorker({ ...f.input, limits: { deliveryLimit: 1 } });
    expect(result).toMatchObject({ claimed: 1, sent: 1, deliveriesPrepared: 2 });
    expect(f.store.claimEmailDeliveries).toHaveBeenCalledWith({ now: startedAt, limit: 1, maxAttempts: 5, leaseSeconds: 300 });
    expect(f.rows[1].state).toBe("pending");
  });

  it("lets concurrent passes share the fixture's exclusive claim", async () => {
    const f = fixture();
    const reports = await Promise.all([runNotificationWorker(f.input), runNotificationWorker(f.input)]);
    expect(reports.reduce((sum, report) => sum + report.sent, 0)).toBe(1);
    expect(f.send).toHaveBeenCalledTimes(1);
  });

  it("reclaims abandoned expired work with a new token", async () => {
    const f = fixture();
    await f.store.prepareEmailDeliveries({ now: startedAt, limit: 100 });
    const [old] = await f.store.claimEmailDeliveries({ now: startedAt, limit: 1, maxAttempts: 5, leaseSeconds: 30 });
    f.setTime("2026-10-01T00:00:30.000Z");
    expect(await runNotificationWorker(f.input)).toMatchObject({ sent: 1 });
    expect(f.rows[0].attemptCount).toBe(2);
    expect(f.store.finalizeEmailDelivery.mock.calls[0][0].claimToken).not.toBe(old.claimToken);
  });

  it("does not send or finalize if loading context exhausts the lease", async () => {
    const f = fixture();
    const load = f.store.loadEmailContext.getMockImplementation()!;
    f.store.loadEmailContext.mockImplementation(async (row) => {
      f.setTime(row.claimExpiresAt!);
      return load(row);
    });
    expect(await runNotificationWorker({ ...f.input, limits: { deliveryLimit: 1 } })).toMatchObject({ expiredClaims: 1, exitCode: 1 });
    expect(f.send).not.toHaveBeenCalled();
    expect(f.store.finalizeEmailDelivery).not.toHaveBeenCalled();
  });

  it("leaves an expired in-flight send for lease recovery and reports uncertainty", async () => {
    const f = fixture();
    f.send.mockImplementation(async () => {
      f.setTime("2026-10-01T00:05:00.000Z");
      return { providerMessageId: "accepted-before-expiry" };
    });
    expect(await runNotificationWorker({ ...f.input, limits: { deliveryLimit: 1 } })).toMatchObject({ sent: 0, expiredClaims: 1, exitCode: 1 });
    expect(f.store.finalizeEmailDelivery).not.toHaveBeenCalled();
    expect(f.rows[0].state).toBe("processing");
  });

  it("backs off provider failures, retries when due, and does not expose provider errors", async () => {
    const f = fixture();
    f.send.mockRejectedValueOnce(new Error("secret credential and private email"));
    const result = await runNotificationWorker(f.input);
    expect(result).toMatchObject({ failed: 1, exitCode: 1, infrastructureErrors: 0 });
    expect(JSON.stringify(result)).not.toContain("secret");
    expect(f.rows[0]).toMatchObject({ state: "failed", availableAt: "2026-10-01T00:01:00.000Z" });
    expect(f.rows[0].lastError).not.toContain("secret");
    expect(await runNotificationWorker(f.input)).toMatchObject({ claimed: 0 });
    f.setTime("2026-10-01T00:01:00.000Z");
    expect(await runNotificationWorker(f.input)).toMatchObject({ sent: 1 });
  });

  it("measures retry delay from completion after a slow failed provider call", async () => {
    const f = fixture();
    f.send.mockImplementation(async () => {
      f.setTime("2026-10-01T00:00:45.000Z");
      throw new Error("Rejected");
    });
    await runNotificationWorker(f.input);
    expect(f.rows[0].availableAt).toBe("2026-10-01T00:01:45.000Z");
  });

  it("passes the five-attempt ceiling to the store and leaves exhausted failures visible", async () => {
    const f = fixture();
    f.send.mockRejectedValue(new Error("Provider unavailable"));
    for (let attempt = 1; attempt <= 5; attempt++) {
      expect(await runNotificationWorker(f.input)).toMatchObject({ failed: 1, claimed: 1 });
      expect(f.rows[0].attemptCount).toBe(attempt);
      f.setTime(f.rows[0].availableAt);
    }
    expect(await runNotificationWorker(f.input)).toMatchObject({ claimed: 0, exhaustedFailures: 1, exitCode: 1 });
    expect(f.rows[0].state).toBe("failed");
    expect(f.send).toHaveBeenCalledTimes(5);
  });

  it("continues independent work after a context error and persists a sanitized retry", async () => {
    const f = fixture([event, { ...event, id: "10000000-0000-4000-8000-000000000009", deduplicationKey: "second" }]);
    f.store.loadEmailContext.mockRejectedValueOnce(new Error("Private address lookup error"));
    expect(await runNotificationWorker(f.input)).toMatchObject({ failed: 1, sent: 1, infrastructureErrors: 1, exitCode: 1 });
    expect(f.rows[0].lastError).toBe("The worker could not load or validate delivery context.");
  });

  it("rejects mismatched events before any provider call", async () => {
    const f = fixture();
    f.store.loadEmailContext.mockResolvedValueOnce({ event: { ...event, userId: "20000000-0000-4000-8000-000000000009" }, preferences, recipient: { status: "eligible", address: "reader@example.test" } });
    expect(await runNotificationWorker(f.input)).toMatchObject({ failed: 1, infrastructureErrors: 1 });
    expect(f.send).not.toHaveBeenCalled();
  });

  it("rejects invalid transient recipient data without exposing it", async () => {
    const f = fixture();
    f.store.loadEmailContext.mockResolvedValueOnce({ event, preferences, recipient: { status: "eligible", address: "private invalid address" } });
    const result = await runNotificationWorker(f.input);
    expect(result).toMatchObject({ failed: 1, infrastructureErrors: 1, exitCode: 1 });
    expect(f.send).not.toHaveBeenCalled();
    expect(JSON.stringify(result)).not.toContain("private");
  });

  it("leaves finalization failures for recovery without an immediate second send", async () => {
    const f = fixture();
    f.store.finalizeEmailDelivery.mockRejectedValueOnce(new Error("Secret database error"));
    const result = await runNotificationWorker(f.input);
    expect(result).toMatchObject({ sent: 0, infrastructureErrors: 1, exitCode: 1 });
    expect(f.send).toHaveBeenCalledTimes(1);
    expect(f.rows[0].state).toBe("processing");
    expect(await runNotificationWorker(f.input)).toMatchObject({ claimed: 0 });
    expect(JSON.stringify(result)).not.toContain("Secret");
  });

  it("stops before claims when generation fails, retaining counts for completed stages", async () => {
    const f = fixture();
    f.store.generateDueReminderEvents.mockResolvedValueOnce(3);
    f.store.generateTargetedCriticalUpdateEvents.mockRejectedValueOnce(new Error("Private SQL error"));
    expect(await runNotificationWorker(f.input)).toMatchObject({ remindersFulfilled: 3, infrastructureErrors: 1, exitCode: 1 });
    expect(f.store.prepareEmailDeliveries).not.toHaveBeenCalled();
    expect(f.store.claimEmailDeliveries).not.toHaveBeenCalled();
  });

  it("rejects out-of-range limits before database operations", async () => {
    const f = fixture();
    expect(await runNotificationWorker({ ...f.input, limits: { criticalReleaseLimit: 101 } })).toMatchObject({ exitCode: 1 });
    expect(f.store.generateDueReminderEvents).not.toHaveBeenCalled();
  });

  it.each(["2000-01-01T00:00:00Z", "2099-01-01T00:00:00Z"])("ignores a valid but skewed worker wall clock (%s)", async (workerTime) => {
    const f = fixture();
    const wallClock = vi.spyOn(Date, "now").mockReturnValue(Date.parse(workerTime));
    try {
      expect(await runNotificationWorker(f.input)).toMatchObject({ sent: 1, expiredClaims: 0, exitCode: 0 });
      expect(f.rows[0].sentAt).toBe(startedAt);
    } finally { wallClock.mockRestore(); }
  });

  it("uses database expiry even when the worker wall clock runs behind", async () => {
    const f = fixture();
    const load = f.store.loadEmailContext.getMockImplementation()!;
    f.store.loadEmailContext.mockImplementation(async (row) => {
      f.setTime(row.claimExpiresAt!);
      return load(row);
    });
    const wallClock = vi.spyOn(Date, "now").mockReturnValue(Date.parse("2000-01-01T00:00:00Z"));
    try {
      expect(await runNotificationWorker({ ...f.input, limits: { deliveryLimit: 1 } })).toMatchObject({ sent: 0, expiredClaims: 1, exitCode: 1 });
      expect(f.send).not.toHaveBeenCalled();
      expect(f.store.finalizeEmailDelivery).not.toHaveBeenCalled();
    } finally { wallClock.mockRestore(); }
  });

  it.each(["context", "completion"] as const)("reports expired fifth claims after a %s clock failure without reclaiming or resetting them", async (stage) => {
    const f = fixture();
    await f.store.prepareEmailDeliveries({ now: startedAt, limit: 100 });
    await f.store.claimEmailDeliveries({ now: startedAt, limit: 1, maxAttempts: 5, leaseSeconds: 30 });
    f.rows[0] = { ...f.rows[0], attemptCount: 4, claimExpiresAt: startedAt };
    const read = f.store.readWorkerTime.getMockImplementation()!;
    const invalidRead = stage === "context" ? 5 : 7;
    let reads = 0;
    f.store.readWorkerTime.mockImplementation(async () => ++reads === invalidRead ? "invalid clock" : read());
    expect(await runNotificationWorker(f.input)).toMatchObject({ claimed: 1, infrastructureErrors: 1, exitCode: 1 });
    expect(f.rows[0]).toMatchObject({ state: "processing", attemptCount: 5 });
    f.store.readWorkerTime.mockImplementation(read);
    f.setTime(f.rows[0].claimExpiresAt!);
    const before = { ...f.rows[0] };
    expect(await runNotificationWorker({ ...f.input, delivery: undefined })).toMatchObject({
      claimed: 0, exhaustedFailures: 0, exhaustedExpiredClaims: 1, exitCode: 1,
    });
    expect(f.rows[0]).toEqual(before);
    expect(f.send).toHaveBeenCalledTimes(stage === "completion" ? 1 : 0);
    expect(f.store.finalizeEmailDelivery).not.toHaveBeenCalled();
  });

  it("does not alert on an unexpired fifth claim until database time reaches expiry", async () => {
    const f = fixture();
    await f.store.prepareEmailDeliveries({ now: startedAt, limit: 100 });
    await f.store.claimEmailDeliveries({ now: startedAt, limit: 1, maxAttempts: 5, leaseSeconds: 30 });
    f.rows[0] = { ...f.rows[0], attemptCount: 5 };
    expect(await runNotificationWorker({ ...f.input, delivery: undefined })).toMatchObject({ exhaustedExpiredClaims: 0, exitCode: 0 });
    f.setTime(f.rows[0].claimExpiresAt!);
    expect(await runNotificationWorker({ ...f.input, delivery: undefined })).toMatchObject({ exhaustedExpiredClaims: 1, exitCode: 1 });
    expect(f.rows[0].attemptCount).toBe(5);
  });

  it("stops before claims on an inspection failure and sanitizes diagnostics", async () => {
    const f = fixture();
    f.store.inspectEmailDeliveryBacklog.mockRejectedValueOnce(new Error("Private token and SQL"));
    const report = await runNotificationWorker(f.input);
    expect(report).toMatchObject({ deliveriesPrepared: 1, infrastructureErrors: 1, exitCode: 1 });
    expect(f.store.claimEmailDeliveries).not.toHaveBeenCalled();
    expect(f.send).not.toHaveBeenCalled();
    expect(JSON.stringify(report)).not.toContain("Private");
  });
});
