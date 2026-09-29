import "server-only";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { notificationDeliverySchema, type NotificationDelivery } from "@/domain/notifications/notification-delivery";
import { createDefaultNotificationPreferences, notificationEventSchema, notificationPreferencesSchema } from "@/domain/notifications/notifications";
import { criticalUpdateAccountContextSchema } from "@/domain/notifications/critical-updates";
import type { JobConfig } from "@/lib/config/deployment-config";
import type { Database } from "@/types/database";
import type { NotificationWorkerStore, EmailDeliveryCompletion } from "./notification-worker";
import { createWorkerDatabaseFetch } from "./worker-database-fetch";

type DeliveryRow = Database["public"]["Tables"]["notification_deliveries"]["Row"];

function timestamp(value: string): string {
  // PostgREST returns PostgreSQL offsets and microseconds; domain schemas require ISO UTC.
  const parsed = z.iso.datetime({ offset: true }).parse(value);
  return new Date(parsed).toISOString();
}

function deliveryFromRow(row: DeliveryRow): NotificationDelivery {
  return notificationDeliverySchema.parse({
    id: row.id, eventId: row.event_id, userId: row.user_id, channel: row.channel, state: row.state,
    attemptCount: row.attempt_count, availableAt: timestamp(row.available_at),
    lastAttemptedAt: row.last_attempted_at === null ? undefined : timestamp(row.last_attempted_at),
    claimToken: row.claim_token ?? undefined,
    claimExpiresAt: row.claim_expires_at === null ? undefined : timestamp(row.claim_expires_at),
    sentAt: row.sent_at === null ? undefined : timestamp(row.sent_at),
    providerMessageId: row.provider_message_id ?? undefined, lastError: row.last_error ?? undefined,
    createdAt: timestamp(row.created_at), updatedAt: timestamp(row.updated_at),
  });
}

function requireResult<T>(result: { data: T | null; error: unknown }): T {
  if (result.error || result.data === null) throw new Error("The notification database operation failed.");
  return result.data;
}

const completionBase = { deliveryId: z.uuid(), claimToken: z.uuid(), now: z.iso.datetime() };
const completionSchema = z.discriminatedUnion("state", [
  z.object({ ...completionBase, state: z.literal("sent"), providerMessageId: z.string().trim().min(1).max(200), errorSummary: z.undefined().optional(), retryAt: z.undefined().optional() }).strict(),
  z.object({ ...completionBase, state: z.literal("failed"), providerMessageId: z.undefined().optional(), errorSummary: z.string().trim().min(1).max(500), retryAt: z.iso.datetime() }).strict(),
  z.object({ ...completionBase, state: z.literal("suppressed"), providerMessageId: z.undefined().optional(), errorSummary: z.undefined().optional(), retryAt: z.undefined().optional() }).strict(),
]);

/**
 * The mapping/transport layer for the existing RPCs. Accepts H3a's validated explicit JobConfig;
 * constructs no provider and reads no process environment. This is not yet a live command:
 * database-authoritative time/finalization and read-only exhausted-claim inspection are service-only RPCs.
 * Complete provider/lease I/O budgets and real SQL concurrency acceptance remain separate J1 work.
 */
export function createSupabaseNotificationWorkerStore(
  config: Pick<JobConfig, "supabaseUrl" | "supabaseSecretKey">,
  options: Readonly<{ fetch?: typeof fetch; timeoutMs?: number; monotonicNow?: () => number }> = {},
): NotificationWorkerStore {
  const client = createClient<Database>(config.supabaseUrl, config.supabaseSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    db: { retry: false },
    global: { fetch: createWorkerDatabaseFetch(options.fetch ?? globalThis.fetch, options.timeoutMs) },
  });
  const monotonicNow = options.monotonicNow ?? (() => performance.now());

  return {
    async readWorkerTime() {
      const started = z.number().finite().parse(monotonicNow());
      const serverTime = timestamp(requireResult(await client.rpc("read_notification_worker_time", {})));
      const elapsed = z.number().finite().nonnegative().parse(monotonicNow() - started);
      // The server timestamp can age while its response arrives. Add the WHOLE round trip (a conservative
      // upper bound), plus 1 ms for discarded PostgreSQL microseconds. No Date.now/system-clock comparison.
      return new Date(Date.parse(serverTime) + Math.ceil(elapsed) + 1).toISOString();
    },
    async inspectEmailDeliveryBacklog({ maxAttempts }) {
      const result = requireResult(await client.rpc("inspect_email_notification_delivery_backlog", {
        p_max_attempts: z.number().int().min(1).max(20).parse(maxAttempts),
      }));
      const backlog = z.object({
        exhausted_failed: z.number().int().nonnegative(),
        exhausted_expired_processing: z.number().int().nonnegative(),
      }).strict().parse(result);
      return { exhaustedFailures: backlog.exhausted_failed, exhaustedExpiredClaims: backlog.exhausted_expired_processing };
    },
    async generateDueReminderEvents({ limit }) {
      return z.number().int().nonnegative().parse(requireResult(await client.rpc("generate_due_reminder_events", { p_limit: limit })));
    },
    async generateTargetedCriticalUpdateEvents({ limit }) {
      return z.number().int().nonnegative().parse(requireResult(await client.rpc("generate_targeted_critical_update_events", { p_limit: limit })));
    },
    async prepareEmailDeliveries({ limit }) {
      return z.number().int().nonnegative().parse(requireResult(await client.rpc("prepare_email_notification_deliveries", { p_limit: limit })));
    },
    async claimEmailDeliveries({ limit, maxAttempts, leaseSeconds }) {
      // Omit p_now: generation, preparation, and claims use the RPC's database-time default.
      const rows = requireResult(await client.rpc("claim_email_notification_deliveries", {
        p_limit: limit, p_max_attempts: maxAttempts, p_lease_seconds: leaseSeconds,
      }));
      if (!Array.isArray(rows) || rows.length > limit) throw new Error("The database exceeded the claim limit.");
      return rows.map((row) => {
        const delivery = deliveryFromRow(row);
        if (delivery.state !== "processing") throw new Error("The database returned an unclaimed delivery.");
        return delivery;
      });
    },
    async loadEmailContext(input) {
      const delivery = notificationDeliverySchema.parse(input);
      if (delivery.state !== "processing") throw new Error("Only a processing delivery can load context.");
      const [eventResult, preferencesResult, authResult] = await Promise.all([
        client.from("notification_events").select("*").eq("id", delivery.eventId).eq("user_id", delivery.userId).maybeSingle(),
        client.from("notification_preferences").select("*").eq("user_id", delivery.userId).maybeSingle(),
        client.auth.admin.getUserById(delivery.userId),
      ]);
      const eventRow = requireResult(eventResult);
      const event = notificationEventSchema.parse({
        id: eventRow.id, userId: eventRow.user_id, type: eventRow.event_type,
        deduplicationKey: eventRow.deduplication_key, payload: eventRow.payload, createdAt: timestamp(eventRow.created_at),
      });
      if (event.id !== delivery.eventId || event.userId !== delivery.userId) throw new Error("Delivery event ownership does not match.");
      if (preferencesResult.error) throw new Error("Notification preferences could not be loaded.");
      const row = preferencesResult.data;
      if (row && row.user_id !== delivery.userId) throw new Error("Preference ownership does not match.");
      const preferences = row ? notificationPreferencesSchema.parse({
        emailEnabled: row.email_enabled, deadlineRemindersEnabled: row.deadline_reminders_enabled,
        criticalUpdatesEnabled: row.critical_updates_enabled, timeZone: row.time_zone, updatedAt: timestamp(row.updated_at),
      }) : createDefaultNotificationPreferences("UTC", delivery.updatedAt);
      if (authResult.error || !authResult.data.user || authResult.data.user.id !== delivery.userId) {
        throw new Error("The notification recipient could not be loaded.");
      }
      const recipientAddress = z.email().parse(authResult.data.user.email);
      if (event.type === "reminder-due") return { event, preferences, recipientAddress };

      const kind = event.type === "article-critical-update" ? "article" : "residence-status";
      const target = event.type === "article-critical-update" ? event.payload.articleId : event.payload.residenceStatusId;
      const [savedResult, journeyResult] = await Promise.all([
        client.from("saved_content").select("user_id,content_kind,content_id,state").eq("user_id", delivery.userId)
          .eq("content_kind", kind).eq("content_id", target).limit(1),
        client.from("user_preferences").select("user_id,journey_id,route_id").eq("user_id", delivery.userId).maybeSingle(),
      ]);
      const saved = requireResult(savedResult);
      if (journeyResult.error || saved.some((item) => item.user_id !== delivery.userId || item.content_kind !== kind || item.content_id !== target)
        || (journeyResult.data && journeyResult.data.user_id !== delivery.userId)) throw new Error("Critical relevance could not be loaded.");
      return { event, preferences, recipientAddress, criticalUpdateAccountContext: criticalUpdateAccountContextSchema.parse({
        userId: delivery.userId, criticalUpdatesEnabled: preferences.criticalUpdatesEnabled,
        savedContent: saved.map((item) => ({ kind: item.content_kind, contentId: item.content_id, state: item.state })),
        journeyId: journeyResult.data?.journey_id ?? undefined, routeId: journeyResult.data?.route_id ?? undefined,
      }) };
    },
    async finalizeEmailDelivery(input: EmailDeliveryCompletion) {
      const completion = completionSchema.parse(input);
      // The wrapper locks/rechecks the token, reads database time after the lock and computes backoff.
      // completion.now/retryAt describe the domain outcome; neither can override database authority.
      const row = requireResult(await client.rpc("finalize_email_notification_delivery_now", {
        p_delivery_id: completion.deliveryId, p_claim_token: completion.claimToken,
        p_state: completion.state, p_provider_message_id: completion.providerMessageId ?? null,
        p_error: completion.errorSummary ?? null,
      }));
      const finalized = deliveryFromRow(row);
      if (finalized.id !== completion.deliveryId || finalized.state !== completion.state) {
        throw new Error("The finalization acknowledgement does not match.");
      }
    },
  };
}
