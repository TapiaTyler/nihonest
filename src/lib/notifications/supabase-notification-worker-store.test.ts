// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { requireJobConfig } from "@/lib/config/deployment-config";
import type { NotificationDelivery } from "@/domain/notifications/notification-delivery";
import type { NotificationEmailSender } from "@/domain/notifications/notification-dispatch";
import { runNotificationWorker } from "./notification-worker";
import { createSupabaseNotificationWorkerStore } from "./supabase-notification-worker-store";

const now = "2026-10-01T00:00:00.000Z";
const pgTime = "2026-10-01T09:00:00.123456+09:00";
const userId = "20000000-0000-4000-8000-000000000002";
const eventId = "10000000-0000-4000-8000-000000000001";
const deliveryId = "40000000-0000-4000-8000-000000000004";
const claimToken = "50000000-0000-4000-8000-000000000005";

function fixture() {
  const delivery = {
    id: deliveryId, event_id: eventId, user_id: userId, channel: "email", state: "processing", attempt_count: 1,
    available_at: pgTime, last_attempted_at: pgTime, claim_token: claimToken,
    claim_expires_at: "2026-10-01T09:05:00.123456+09:00", sent_at: null, provider_message_id: null,
    last_error: null, created_at: pgTime, updated_at: pgTime,
  };
  const event = { id: eventId, user_id: userId, event_type: "reminder-due", deduplication_key: "fixture",
    created_at: pgTime, payload: { reminderId: "30000000-0000-4000-8000-000000000003", title: "Private title", scheduledFor: now } };
  const preferences = { user_id: userId, email_enabled: true, deadline_reminders_enabled: true,
    critical_updates_enabled: true, time_zone: "UTC", created_at: pgTime, updated_at: pgTime };
  const responses: Record<string, unknown> = {
    "/rest/v1/rpc/read_notification_worker_time": pgTime,
    "/rest/v1/rpc/inspect_email_notification_delivery_backlog": { exhausted_failed: 0, exhausted_expired_processing: 0 },
    "/rest/v1/rpc/generate_due_reminder_events": 2,
    "/rest/v1/rpc/generate_targeted_critical_update_events": 3,
    "/rest/v1/rpc/prepare_email_notification_deliveries": 4,
    "/rest/v1/rpc/claim_email_notification_deliveries": [delivery],
    "/rest/v1/rpc/finalize_email_notification_delivery_now": { ...delivery, state: "sent", claim_token: null,
      claim_expires_at: null, sent_at: pgTime, provider_message_id: "fixture-message" },
    "/rest/v1/notification_events": [event], "/rest/v1/notification_preferences": [preferences],
    [`/auth/v1/admin/users/${userId}`]: { user: { id: userId, email: "auth-reader@example.test", email_confirmed_at: pgTime } },
    "/rest/v1/saved_content": [{ user_id: userId, content_kind: "article", content_id: "sample-guide", state: "saved" }],
    "/rest/v1/user_preferences": [{ user_id: userId, journey_id: "planning", route_id: null }],
  };
  const fetcher = vi.fn<typeof fetch>(async (input) => {
    const url = new URL(String(input));
    if (!(url.pathname in responses)) throw new Error("Unexpected fixture request");
    return new Response(JSON.stringify(responses[url.pathname]), { headers: { "Content-Type": "application/json" } });
  });
  const config = requireJobConfig({ NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co", SUPABASE_SECRET_KEY: "fixture-secret" }, "production");
  const store = createSupabaseNotificationWorkerStore(config, { fetch: fetcher, monotonicNow: () => 0 });
  const claim = async () => (await store.claimEmailDeliveries({ now, limit: 1, maxAttempts: 5, leaseSeconds: 300 }))[0] as NotificationDelivery;
  return { store, fetcher, responses, delivery, event, preferences, config, claim };
}

describe("notification worker Supabase mapping", () => {
  it("sends only to the confirmed current Auth email and keeps it out of the report", async () => {
    const f = fixture();
    Object.assign(f.event.payload, { recipientAddress: "payload-attacker@example.test" });
    f.responses[`/auth/v1/admin/users/${userId}`] = { user: { id: userId, email: "auth-reader@example.test",
      email_confirmed_at: pgTime, new_email: "pending@example.test" } };
    const send = vi.fn<NotificationEmailSender["send"]>(async () => ({ providerMessageId: "fixture-message" }));
    const report = await runNotificationWorker({ jobsEnabled: true, store: f.store, limits: { deliveryLimit: 1 },
      delivery: { provider: { send }, context: { fromName: "Nihonest", fromAddress: "sender@example.test", siteOrigin: "https://example.test" } },
    });
    expect(report).toMatchObject({ sent: 1, suppressed: 0, failed: 0, exitCode: 0 });
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][0]).toMatchObject({ to: "auth-reader@example.test" });
    expect(JSON.stringify(report)).not.toMatch(/@|Private title|fixture-message|20000000/);
  });

  it.each([
    { email: null, email_confirmed_at: pgTime },
    { email: "invalid private address", email_confirmed_at: pgTime },
    { email: "reader@example.test" },
    { email: "reader@example.test", confirmed_at: pgTime, phone_confirmed_at: pgTime },
    { email: "reader@example.test", email_confirmed_at: "invalid private confirmation" },
  ])("suppresses ineligible Auth recipients without provider calls or retry failures: %j", async (user) => {
    const f = fixture();
    f.responses[`/auth/v1/admin/users/${userId}`] = { user: { id: userId, ...user } };
    f.responses["/rest/v1/rpc/finalize_email_notification_delivery_now"] = { ...f.delivery,
      state: "suppressed", claim_token: null, claim_expires_at: null };
    const send = vi.fn(async () => ({ providerMessageId: "must-not-send" }));
    expect(await runNotificationWorker({ jobsEnabled: true, store: f.store, limits: { deliveryLimit: 1 },
      delivery: { provider: { send }, context: { fromName: "Nihonest", fromAddress: "sender@example.test", siteOrigin: "https://example.test" } },
    })).toMatchObject({ claimed: 1, suppressed: 1, failed: 0, infrastructureErrors: 0, exitCode: 0 });
    expect(send).not.toHaveBeenCalled();
    const [, init] = f.fetcher.mock.calls.find(([request]) => String(request).includes("finalize_email"))!;
    expect(JSON.parse(String(init?.body))).toEqual({ p_delivery_id: deliveryId, p_claim_token: claimToken,
      p_state: "suppressed", p_provider_message_id: null, p_error: null });
  });

  it("keeps Auth transport failures retryable rather than treating them as ineligible", async () => {
    const f = fixture();
    const original = f.fetcher.getMockImplementation()!;
    f.fetcher.mockImplementation(async (input, init) => String(input).includes("/auth/")
      ? new Response(JSON.stringify({ message: "private Auth failure" }), { status: 503 }) : original(input, init));
    await expect(f.store.loadEmailContext(await f.claim())).rejects.toThrow("The notification recipient could not be loaded.");
  });

  it("skips critical relevance lookups for an ineligible recipient", async () => {
    const f = fixture();
    f.responses[`/auth/v1/admin/users/${userId}`] = { user: { id: userId } };
    f.responses["/rest/v1/notification_events"] = [{ ...f.event, event_type: "article-critical-update",
      payload: { articleId: "sample-guide", releaseId: "60000000-0000-4000-8000-000000000006", title: "Update", revision: "1", summary: "Changed", journeyTargets: [] } }];
    expect((await f.store.loadEmailContext(await f.claim())).recipient).toEqual({ status: "suppressed" });
    expect(f.fetcher.mock.calls.some(([request]) => /saved_content|user_preferences/.test(String(request)))).toBe(false);
  });

  it("maps residence-status targets explicitly and rejects unknown event variants", async () => {
    const f = fixture();
    f.responses["/rest/v1/notification_events"] = [{ ...f.event, event_type: "residence-status-guidance-updated",
      payload: { residenceStatusId: "student", releaseId: "60000000-0000-4000-8000-000000000006", title: "Update", revision: "1", summary: "Changed", journeyTargets: [] } }];
    f.responses["/rest/v1/saved_content"] = [{ user_id: userId, content_kind: "residence-status", content_id: "student", state: "saved" }];
    const context = await f.store.loadEmailContext(await f.claim());
    expect(context.criticalUpdateAccountContext?.savedContent).toEqual([{ kind: "residence-status", contentId: "student", state: "saved" }]);
    const [request] = f.fetcher.mock.calls.find(([input]) => String(input).includes("/saved_content?"))!;
    expect(Object.fromEntries(new URL(String(request)).searchParams)).toMatchObject({ content_kind: "eq.residence-status", content_id: "eq.student", limit: "1" });
    f.responses["/rest/v1/notification_events"] = [{ ...f.event, event_type: "future-event" }];
    f.fetcher.mockClear();
    await expect(f.store.loadEmailContext(await f.claim())).rejects.toThrow();
    expect(f.fetcher.mock.calls.some(([input]) => String(input).includes("/saved_content?"))).toBe(false);
  });

  it("uses H3a job-only credentials and maps generation/preparation/claim RPCs without overriding database time", async () => {
    const f = fixture();
    expect(f.config.email.enabled).toBe(false);
    expect(f.fetcher).not.toHaveBeenCalled();
    expect(await f.store.generateDueReminderEvents({ now, limit: 7 })).toBe(2);
    expect(await f.store.generateTargetedCriticalUpdateEvents({ now, limit: 8 })).toBe(3);
    expect(await f.store.prepareEmailDeliveries({ now, limit: 9 })).toBe(4);
    expect(await f.claim()).toMatchObject({ id: deliveryId, state: "processing", attemptCount: 1,
      availableAt: "2026-10-01T00:00:00.123Z", claimExpiresAt: "2026-10-01T00:05:00.123Z" });
    const bodies = f.fetcher.mock.calls.map(([, init]) => JSON.parse(String(init?.body)));
    expect(bodies).toEqual([{ p_limit: 7 }, { p_limit: 8 }, { p_limit: 9 }, { p_limit: 1, p_max_attempts: 5, p_lease_seconds: 300 }]);
    for (const [, init] of f.fetcher.mock.calls) expect(new Headers(init?.headers).get("apikey")).toBe("fixture-secret");
  });

  it("loads the owner-filtered event/preferences and recipient from Auth, ignoring payload recipient fields", async () => {
    const f = fixture();
    Object.assign(f.event.payload, { recipientAddress: "payload-attacker@example.test" });
    const context = await f.store.loadEmailContext(await f.claim());
    expect(context.recipient).toEqual({ status: "eligible", address: "auth-reader@example.test" });
    expect(context.event).toMatchObject({ createdAt: "2026-10-01T00:00:00.123Z", userId });
    expect(context.preferences).toMatchObject({ emailEnabled: true });
    for (const [request] of f.fetcher.mock.calls) {
      const url = new URL(String(request));
      if (url.pathname.endsWith("notification_events")) {
        expect(url.searchParams.get("id")).toBe(`eq.${eventId}`);
        expect(url.searchParams.get("user_id")).toBe(`eq.${userId}`);
      }
    }
  });

  it("defaults missing preferences to disabled consent and sends nothing", async () => {
    const f = fixture();
    f.responses["/rest/v1/notification_preferences"] = [];
    const context = await f.store.loadEmailContext(await f.claim());
    expect(context.preferences).toMatchObject({ emailEnabled: false, deadlineRemindersEnabled: false, criticalUpdatesEnabled: false });
  });

  it.each(["event-owner", "preferences-owner", "auth-owner", "auth-deleted", "malformed-event"])("fails closed for %s", async (failure) => {
    const f = fixture();
    if (failure === "event-owner") f.event.user_id = "20000000-0000-4000-8000-000000000009";
    if (failure === "preferences-owner") f.preferences.user_id = "20000000-0000-4000-8000-000000000009";
    if (failure === "auth-owner") f.responses[`/auth/v1/admin/users/${userId}`] = { user: { id: eventId, email: "wrong-owner@example.test" } };
    if (failure === "auth-deleted") f.responses[`/auth/v1/admin/users/${userId}`] = { user: null };
    if (failure === "malformed-event") f.responses["/rest/v1/notification_events"] = [{ ...f.event, payload: {} }];
    await expect(f.store.loadEmailContext(await f.claim())).rejects.toThrow();
  });

  it("loads bounded current saved/journey relevance for a critical update", async () => {
    const f = fixture();
    f.responses["/rest/v1/notification_events"] = [{ ...f.event, event_type: "article-critical-update",
      payload: { articleId: "sample-guide", releaseId: "60000000-0000-4000-8000-000000000006", title: "Update", revision: "1", summary: "Changed", journeyTargets: [] } }];
    const context = await f.store.loadEmailContext(await f.claim());
    expect(context.criticalUpdateAccountContext).toMatchObject({ userId, journeyId: "planning",
      savedContent: [{ kind: "article", contentId: "sample-guide", state: "saved" }] });
    const [request] = f.fetcher.mock.calls.find(([input]) => String(input).includes("/saved_content?"))!;
    const params = new URL(String(request)).searchParams;
    expect(Object.fromEntries(params)).toMatchObject({ user_id: `eq.${userId}`, content_kind: "eq.article", content_id: "eq.sample-guide", limit: "1" });
  });

  it.each(["sent", "failed", "suppressed"] as const)("passes the original token and only applicable metadata for %s", async (state) => {
    const f = fixture();
    f.responses["/rest/v1/rpc/finalize_email_notification_delivery_now"] = { ...f.delivery, state,
      claim_token: null, claim_expires_at: null, sent_at: state === "sent" ? pgTime : null,
      provider_message_id: state === "sent" ? "fixture-message" : null, last_error: state === "failed" ? "Generic failure" : null };
    await f.store.finalizeEmailDelivery({ deliveryId, claimToken, state, now,
      providerMessageId: state === "sent" ? "fixture-message" : undefined,
      errorSummary: state === "failed" ? "Generic failure" : undefined,
      retryAt: state === "failed" ? "2026-10-01T00:01:00.000Z" : undefined });
    expect(JSON.parse(String(f.fetcher.mock.calls[0][1]?.body))).toEqual({
      p_delivery_id: deliveryId, p_claim_token: claimToken, p_state: state,
      p_provider_message_id: state === "sent" ? "fixture-message" : null,
      p_error: state === "failed" ? "Generic failure" : null,
    });
  });

  it("rejects incompatible completion metadata before sending a request", async () => {
    const f = fixture();
    await expect(f.store.finalizeEmailDelivery({ deliveryId, claimToken, state: "suppressed", now, providerMessageId: "wrong" })).rejects.toThrow();
    expect(f.fetcher).not.toHaveBeenCalled();
  });

  it("rejects claim overrun and malformed database timestamps", async () => {
    const f = fixture();
    f.responses["/rest/v1/rpc/claim_email_notification_deliveries"] = [f.delivery, f.delivery];
    await expect(f.claim()).rejects.toThrow(/limit/);
    f.responses["/rest/v1/rpc/claim_email_notification_deliveries"] = [{ ...f.delivery, claim_expires_at: "not a timestamp" }];
    await expect(f.claim()).rejects.toThrow();
  });

  it("does not retry failed reads or expose response diagnostics", async () => {
    const f = fixture();
    const claimed = await f.claim();
    f.fetcher.mockImplementation(async () => new Response(JSON.stringify({ message: "private SQL, address, token" }), { status: 503 }));
    await expect(f.store.loadEmailContext(claimed)).rejects.toThrow("The notification database operation failed.");
    expect(f.fetcher).toHaveBeenCalledTimes(4); // claim plus three single-attempt context reads
  });

  it("generates/prepares with delivery disabled without claiming or accessing recipients", async () => {
    const f = fixture();
    expect(await runNotificationWorker({ jobsEnabled: true, store: f.store })).toMatchObject({
      status: "delivery-disabled", remindersFulfilled: 2, criticalEventsGenerated: 3, deliveriesPrepared: 4, claimed: 0,
    });
    expect(f.fetcher.mock.calls.map(([input]) => new URL(String(input)).pathname)).toEqual([
      "/rest/v1/rpc/read_notification_worker_time", "/rest/v1/rpc/generate_due_reminder_events",
      "/rest/v1/rpc/read_notification_worker_time", "/rest/v1/rpc/generate_targeted_critical_update_events",
      "/rest/v1/rpc/read_notification_worker_time", "/rest/v1/rpc/prepare_email_notification_deliveries",
      "/rest/v1/rpc/inspect_email_notification_delivery_backlog",
    ]);
  });

  it("reads database time with a conservative allowance for the entire response round trip", async () => {
    const f = fixture();
    const ticks = [100, 2100.25];
    const store = createSupabaseNotificationWorkerStore(f.config, { fetch: f.fetcher, monotonicNow: () => ticks.shift()! });
    expect(await store.readWorkerTime()).toBe("2026-10-01T00:00:02.125Z");
    expect(JSON.parse(String(f.fetcher.mock.calls[0][1]?.body))).toEqual({});
  });

  it.each(["invalid-db", "backwards-monotonic"])("rejects %s clock data", async (mode) => {
    const f = fixture();
    if (mode === "invalid-db") f.responses["/rest/v1/rpc/read_notification_worker_time"] = "private invalid time";
    const ticks = mode === "backwards-monotonic" ? [2, 1] : [0, 0];
    const store = createSupabaseNotificationWorkerStore(f.config, { fetch: f.fetcher, monotonicNow: () => ticks.shift()! });
    await expect(store.readWorkerTime()).rejects.toThrow();
  });

  it("does not send when an aged database-clock response consumes the claimed lease", async () => {
    const f = fixture();
    let tick = 0;
    const store = createSupabaseNotificationWorkerStore(f.config, {
      fetch: f.fetcher, monotonicNow: () => (++tick % 2 === 1 ? 0 : 301_000),
    });
    const send = vi.fn(async () => ({ providerMessageId: "must-not-send" }));
    expect(await runNotificationWorker({ jobsEnabled: true, store, limits: { deliveryLimit: 1 },
      delivery: { provider: { send }, context: { fromName: "Nihonest", fromAddress: "sender@example.test", siteOrigin: "https://example.test" } },
    })).toMatchObject({ claimed: 1, sent: 0, expiredClaims: 1, exitCode: 1 });
    expect(send).not.toHaveBeenCalled();
    expect(f.fetcher.mock.calls.some(([request]) => String(request).includes("finalize_email"))).toBe(false);
  });

  it("does not transmit worker time or caller retry availability to the database finalizer", async () => {
    const f = fixture();
    await f.store.finalizeEmailDelivery({ deliveryId, claimToken, state: "sent", now: "2000-01-01T00:00:00Z", providerMessageId: "fixture-message" });
    expect(new URL(String(f.fetcher.mock.calls[0][0])).pathname).toBe("/rest/v1/rpc/finalize_email_notification_delivery_now");
    expect(JSON.parse(String(f.fetcher.mock.calls[0][1]?.body))).not.toHaveProperty("p_now");
    expect(JSON.parse(String(f.fetcher.mock.calls[0][1]?.body))).not.toHaveProperty("p_retry_at");
  });

  it("maps only aggregate exhausted-failure and expired-processing counts", async () => {
    const f = fixture();
    f.responses["/rest/v1/rpc/inspect_email_notification_delivery_backlog"] = { exhausted_failed: 2, exhausted_expired_processing: 3 };
    expect(await f.store.inspectEmailDeliveryBacklog({ maxAttempts: 5 })).toEqual({ exhaustedFailures: 2, exhaustedExpiredClaims: 3 });
    expect(JSON.parse(String(f.fetcher.mock.calls[0][1]?.body))).toEqual({ p_max_attempts: 5 });
    f.responses["/rest/v1/rpc/inspect_email_notification_delivery_backlog"] = { exhausted_failed: -1, exhausted_expired_processing: 0 };
    await expect(f.store.inspectEmailDeliveryBacklog({ maxAttempts: 5 })).rejects.toThrow();
  });
});
