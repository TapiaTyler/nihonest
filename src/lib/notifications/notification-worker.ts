import "server-only";
import { z } from "zod";
import {
  dispatchNotificationEmail,
  MAX_EMAIL_DELIVERY_ATTEMPTS,
  nextEmailRetryAt,
  type NotificationEmailSender,
} from "@/domain/notifications/notification-dispatch";
import {
  notificationDeliverySchema,
  transitionNotificationDelivery,
  type NotificationDelivery,
} from "@/domain/notifications/notification-delivery";
import { notificationEventSchema, notificationPreferencesSchema } from "@/domain/notifications/notifications";
import { criticalUpdateAccountContextSchema, type CriticalUpdateAccountContext } from "@/domain/notifications/critical-updates";
import type { NotificationEmailContext } from "@/domain/notifications/notification-email";

export type ClaimedEmailContext = Readonly<{
  event: unknown;
  preferences: unknown;
  recipientAddress: string;
  criticalUpdateAccountContext?: CriticalUpdateAccountContext;
}>;

export type EmailDeliveryCompletion = Readonly<{
  deliveryId: string;
  claimToken: string;
  state: "sent" | "failed" | "suppressed";
  now: string;
  providerMessageId?: string;
  errorSummary?: string;
  retryAt?: string;
}>;

/** The adapter owns SQL row mapping, authenticated recipient lookup, and bounded I/O. */
export interface NotificationWorkerStore {
  generateDueReminderEvents(input: { now: string; limit: number }): Promise<number>;
  generateTargetedCriticalUpdateEvents(input: { now: string; limit: number }): Promise<number>;
  prepareEmailDeliveries(input: { now: string; limit: number }): Promise<number>;
  claimEmailDeliveries(input: { now: string; limit: 1; maxAttempts: number; leaseSeconds: number }): Promise<readonly unknown[]>;
  /** Read current consent/relevance and the email of the claimed user, never from event payloads. */
  loadEmailContext(delivery: NotificationDelivery): Promise<ClaimedEmailContext>;
  /** Reject stale/expired tokens through finalize_email_notification_delivery. */
  finalizeEmailDelivery(input: EmailDeliveryCompletion): Promise<void>;
}

const workerLimitsSchema = z.object({
  reminderLimit: z.number().int().min(1).max(1000).default(100),
  criticalReleaseLimit: z.number().int().min(1).max(100).default(25),
  preparationLimit: z.number().int().min(1).max(1000).default(100),
  deliveryLimit: z.number().int().min(1).max(100).default(25),
  leaseSeconds: z.number().int().min(30).max(3600).default(300),
});

export type NotificationWorkerInput = Readonly<{
  jobsEnabled: boolean;
  store: NotificationWorkerStore;
  now: () => string;
  delivery?: Readonly<{
    provider: NotificationEmailSender;
    context: Omit<NotificationEmailContext, "recipientAddress">;
  }>;
  limits?: Partial<z.infer<typeof workerLimitsSchema>>;
}>;

/** Only aggregate counters may leave the runner; no raw errors, account IDs, or message data. */
export type NotificationWorkerReport = {
  status: "jobs-disabled" | "delivery-disabled" | "completed" | "failed";
  exitCode: 0 | 1;
  remindersFulfilled: number;
  criticalEventsGenerated: number;
  deliveriesPrepared: number;
  claimed: number;
  sent: number;
  suppressed: number;
  failed: number;
  infrastructureErrors: number;
  expiredClaims: number;
};

function clock(now: () => string): string {
  return z.iso.datetime().parse(now());
}

function leaseIsCurrent(delivery: NotificationDelivery, now: string): boolean {
  return Date.parse(delivery.claimExpiresAt!) > Date.parse(now);
}

function count(value: number): number {
  return z.number().int().nonnegative().parse(value);
}

/** Runs a bounded pass. No environment reads or provider construction occur in this module. */
export async function runNotificationWorker(input: NotificationWorkerInput): Promise<NotificationWorkerReport> {
  const report: NotificationWorkerReport = {
    status: "jobs-disabled", exitCode: 0,
    remindersFulfilled: 0, criticalEventsGenerated: 0, deliveriesPrepared: 0,
    claimed: 0, sent: 0, suppressed: 0, failed: 0, infrastructureErrors: 0, expiredClaims: 0,
  };
  if (!input.jobsEnabled) return report;

  // Once time is unavailable, stop the pass: a later successful read cannot make an uncertain lease safe.
  let clockFailed = false;
  const readClock = () => {
    try {
      return clock(input.now);
    } catch {
      clockFailed = true;
      throw new Error("The worker clock is unavailable or invalid.");
    }
  };

  try {
    const limits = workerLimitsSchema.parse(input.limits ?? {});
    report.status = input.delivery ? "completed" : "delivery-disabled";
    report.remindersFulfilled = count(await input.store.generateDueReminderEvents({ now: readClock(), limit: limits.reminderLimit }));
    report.criticalEventsGenerated = count(await input.store.generateTargetedCriticalUpdateEvents({ now: readClock(), limit: limits.criticalReleaseLimit }));
    report.deliveriesPrepared = count(await input.store.prepareEmailDeliveries({ now: readClock(), limit: limits.preparationLimit }));
    const delivery = input.delivery;
    // Disabled delivery preserves pending work and consumes no attempts or leases.
    if (!delivery) return report;

    for (let attempt = 0; attempt < limits.deliveryLimit; attempt++) {
      // Just-in-time claims prevent later messages in a batch from aging behind slow sends.
      const rows = await input.store.claimEmailDeliveries({
        now: readClock(), limit: 1, maxAttempts: MAX_EMAIL_DELIVERY_ATTEMPTS, leaseSeconds: limits.leaseSeconds,
      });
      if (rows.length === 0) break;
      if (rows.length !== 1) throw new Error("The store exceeded the claim limit.");
      const claimed = notificationDeliverySchema.parse(rows[0]);
      if (claimed.state !== "processing") throw new Error("The store returned unclaimed work.");
      report.claimed++;

      try {
        let outcome: NotificationDelivery;
        try {
          const context = await input.store.loadEmailContext(claimed);
          const attemptedAt = readClock();
          if (!leaseIsCurrent(claimed, attemptedAt)) {
            report.expiredClaims++;
            continue;
          }
          outcome = await dispatchNotificationEmail({
            delivery: claimed,
            event: notificationEventSchema.parse(context.event),
            preferences: notificationPreferencesSchema.parse(context.preferences),
            criticalUpdateAccountContext: context.criticalUpdateAccountContext
              ? criticalUpdateAccountContextSchema.parse(context.criticalUpdateAccountContext) : undefined,
            emailContext: { ...delivery.context, recipientAddress: z.email().parse(context.recipientAddress) },
            provider: {
              send(message) {
                if (!leaseIsCurrent(claimed, readClock())) throw new Error("The claim expired before sending.");
                return delivery.provider.send(message);
              },
            },
            attemptedAt,
          });
          // Dispatch sanitizes provider failures, including a clock exception raised by our send guard.
          if (clockFailed) throw new Error("The worker clock failed before sending.");
        } catch (error) {
          if (clockFailed) throw error;
          const failedAt = readClock();
          report.infrastructureErrors++;
          outcome = transitionNotificationDelivery(claimed, "failed", failedAt, {
            errorSummary: "The worker could not load or validate delivery context.",
            retryAt: nextEmailRetryAt(claimed.attemptCount, failedAt),
          });
        }

        const finalizedAt = readClock();
        if (!leaseIsCurrent(claimed, finalizedAt)) {
          report.expiredClaims++;
          continue;
        }
        if (outcome.state !== "sent" && outcome.state !== "failed" && outcome.state !== "suppressed") {
          throw new Error("The dispatcher did not produce a completion.");
        }
        await input.store.finalizeEmailDelivery({
          deliveryId: claimed.id, claimToken: claimed.claimToken!, state: outcome.state, now: finalizedAt,
          providerMessageId: outcome.providerMessageId, errorSummary: outcome.lastError,
          // Backoff starts at completion, even when the provider was slow.
          retryAt: outcome.state === "failed" ? nextEmailRetryAt(claimed.attemptCount, finalizedAt) : undefined,
        });
        report[outcome.state]++;
      } catch (error) {
        // Propagate clock failures to the pass-level handler, which counts them once and stops claiming.
        if (clockFailed) throw error;
        // A finalization failure leaves the lease for SQL recovery; never immediately send again.
        report.infrastructureErrors++;
      }
    }
  } catch {
    report.infrastructureErrors++;
  }
  if (report.failed || report.infrastructureErrors || report.expiredClaims) {
    report.status = "failed";
    report.exitCode = 1;
  }
  return report;
}
