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
import { workerRecipientSchema, type WorkerRecipient } from "./worker-recipient";
import { createClaimLeaseBudget, runWithinWorkerDeadline } from "./worker-deadline";

export type ClaimedEmailContext = Readonly<{
  event: unknown;
  preferences: unknown;
  recipient: WorkerRecipient;
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

export type WorkerOperationOptions = Readonly<{ signal?: AbortSignal }>;

/** The adapter owns SQL row mapping, authenticated recipient lookup, and bounded I/O. */
export interface NotificationWorkerStore {
  /** Database authority (with conservative transport-age allowance), never the worker's wall clock. */
  readWorkerTime(options?: WorkerOperationOptions): Promise<string>;
  inspectEmailDeliveryBacklog(input: { maxAttempts: number }, options?: WorkerOperationOptions): Promise<Readonly<{
    exhaustedFailures: number; exhaustedExpiredClaims: number;
  }>>;
  generateDueReminderEvents(input: { now: string; limit: number }, options?: WorkerOperationOptions): Promise<number>;
  generateTargetedCriticalUpdateEvents(input: { now: string; limit: number }, options?: WorkerOperationOptions): Promise<number>;
  prepareEmailDeliveries(input: { now: string; limit: number }, options?: WorkerOperationOptions): Promise<number>;
  claimEmailDeliveries(input: { now: string; limit: 1; maxAttempts: number; leaseSeconds: number }, options?: WorkerOperationOptions): Promise<readonly unknown[]>;
  /** Read current consent/relevance and the email of the claimed user, never from event payloads. */
  loadEmailContext(delivery: NotificationDelivery, options?: WorkerOperationOptions): Promise<ClaimedEmailContext>;
  /** Database time decides expiry, sent timestamp and retry availability; caller time is fixture metadata only. */
  finalizeEmailDelivery(input: EmailDeliveryCompletion, options?: WorkerOperationOptions): Promise<void>;
}

const workerLimitsSchema = z.object({
  reminderLimit: z.number().int().min(1).max(1000).default(100),
  criticalReleaseLimit: z.number().int().min(1).max(100).default(25),
  preparationLimit: z.number().int().min(1).max(1000).default(100),
  deliveryLimit: z.number().int().min(1).max(100).default(25),
  leaseSeconds: z.number().int().min(30).max(3600).default(300),
  databaseTimeoutMs: z.number().int().min(1).max(30_000).default(10_000),
  providerTimeoutMs: z.number().int().min(1).max(30_000).default(10_000),
});

export type NotificationWorkerInput = Readonly<{
  jobsEnabled: boolean;
  store: NotificationWorkerStore;
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
  exhaustedFailures: number;
  exhaustedExpiredClaims: number;
};

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
    exhaustedFailures: 0, exhaustedExpiredClaims: 0,
  };
  if (!input.jobsEnabled) return report;

  // Once time is unavailable, stop the pass: a later successful read cannot make an uncertain lease safe.
  let clockFailed = false;
  let leaseFailed = false;
  let activeBudget: ReturnType<typeof createClaimLeaseBudget> | undefined;
  let databaseTimeoutMs = 10_000;
  let providerTimeoutMs = 10_000;
  const reserveMs = 1_000;
  const databaseCall = <T>(operation: (options: WorkerOperationOptions) => Promise<T>) =>
    runWithinWorkerDeadline((signal) => operation({ signal }), databaseTimeoutMs, activeBudget?.signal)
      .catch((error: unknown) => {
        if (activeBudget?.signal.aborted) leaseFailed = true;
        throw error;
      });
  const readClock = async () => {
    try {
      return z.iso.datetime().parse(await databaseCall((options) => input.store.readWorkerTime(options)));
    } catch {
      if (!leaseFailed) clockFailed = true;
      throw new Error("The worker clock is unavailable or invalid.");
    }
  };
  const inspectBacklog = async () => {
    const backlog = await databaseCall((options) => input.store.inspectEmailDeliveryBacklog({ maxAttempts: MAX_EMAIL_DELIVERY_ATTEMPTS }, options));
    report.exhaustedFailures = count(backlog.exhaustedFailures);
    report.exhaustedExpiredClaims = count(backlog.exhaustedExpiredClaims);
  };

  try {
    const limits = workerLimitsSchema.parse(input.limits ?? {});
    databaseTimeoutMs = limits.databaseTimeoutMs;
    providerTimeoutMs = limits.providerTimeoutMs;
    // Claim, context, attempted/send/completion clocks and finalization plus provider must fit.
    if (input.delivery && limits.leaseSeconds * 1_000 <= 6 * databaseTimeoutMs + providerTimeoutMs + reserveMs) {
      throw new Error("The worker lease cannot accommodate its I/O deadlines.");
    }
    report.status = input.delivery ? "completed" : "delivery-disabled";
    const reminderTime = await readClock();
    report.remindersFulfilled = count(await databaseCall((options) => input.store.generateDueReminderEvents({ now: reminderTime, limit: limits.reminderLimit }, options)));
    const criticalTime = await readClock();
    report.criticalEventsGenerated = count(await databaseCall((options) => input.store.generateTargetedCriticalUpdateEvents({ now: criticalTime, limit: limits.criticalReleaseLimit }, options)));
    const preparationTime = await readClock();
    report.deliveriesPrepared = count(await databaseCall((options) => input.store.prepareEmailDeliveries({ now: preparationTime, limit: limits.preparationLimit }, options)));
    await inspectBacklog();
    const delivery = input.delivery;
    // Disabled delivery preserves pending work and consumes no attempts or leases.
    for (let attempt = 0; delivery && attempt < limits.deliveryLimit; attempt++) {
      // Just-in-time claims prevent later messages in a batch from aging behind slow sends.
      const claimAt = await readClock();
      activeBudget = createClaimLeaseBudget(limits.leaseSeconds, reserveMs);
      try {
        const rows = await databaseCall((options) => input.store.claimEmailDeliveries({
          now: claimAt, limit: 1, maxAttempts: MAX_EMAIL_DELIVERY_ATTEMPTS, leaseSeconds: limits.leaseSeconds,
        }, options));
        if (rows.length === 0) break;
        if (rows.length !== 1) throw new Error("The store exceeded the claim limit.");
        const claimed = notificationDeliverySchema.parse(rows[0]);
        if (claimed.state !== "processing") throw new Error("The store returned unclaimed work.");
        report.claimed++;

        try {
          let outcome: NotificationDelivery;
          try {
            const context = await databaseCall((options) => input.store.loadEmailContext(claimed, options));
            const attemptedAt = await readClock();
            if (!leaseIsCurrent(claimed, attemptedAt)) {
              report.expiredClaims++;
              continue;
            }
            activeBudget.shortenToRemaining(Date.parse(claimed.claimExpiresAt!) - Date.parse(attemptedAt) - reserveMs);
            if (activeBudget.signal.aborted) {
              report.expiredClaims++;
              continue;
            }
            let sendBudgetInsufficient = false;
            const event = notificationEventSchema.parse(context.event);
            const preferences = notificationPreferencesSchema.parse(context.preferences);
            const recipient = workerRecipientSchema.parse(context.recipient);
            if (event.id !== claimed.eventId || event.userId !== claimed.userId) {
              throw new Error("Delivery event ownership does not match.");
            }
            // Known ineligible Auth recipients are terminal, rather than five retryable context errors.
            // Ownership and the lease are checked even when no provider call will occur.
            if (recipient.status === "suppressed") {
              outcome = transitionNotificationDelivery(claimed, "suppressed", attemptedAt);
            } else {
              outcome = await dispatchNotificationEmail({
                delivery: claimed,
                event,
                preferences,
                criticalUpdateAccountContext: context.criticalUpdateAccountContext
                  ? criticalUpdateAccountContextSchema.parse(context.criticalUpdateAccountContext) : undefined,
                emailContext: { ...delivery.context, recipientAddress: recipient.address },
                provider: {
                  async send(message) {
                    const sendingAt = await readClock();
                    const requiredMs = providerTimeoutMs + 2 * databaseTimeoutMs + reserveMs;
                    if (Date.parse(claimed.claimExpiresAt!) - Date.parse(sendingAt) <= requiredMs ||
                        activeBudget!.remainingMs() <= requiredMs) {
                      sendBudgetInsufficient = true;
                      throw new Error("Insufficient lease time for sending and finalization.");
                    }
                    return runWithinWorkerDeadline((signal) => delivery.provider.send(message, { signal }),
                      providerTimeoutMs, activeBudget?.signal);
                  },
                },
                attemptedAt,
              });
            }
            // Dispatch sanitizes provider failures, including a clock exception raised by our send guard.
            if (clockFailed || leaseFailed) throw new Error("The worker clock or lease failed before sending.");
            if (sendBudgetInsufficient) {
              report.expiredClaims++;
              continue;
            }
          } catch (error) {
            if (clockFailed || leaseFailed) throw error;
            const failedAt = await readClock();
            report.infrastructureErrors++;
            outcome = transitionNotificationDelivery(claimed, "failed", failedAt, {
              errorSummary: "The worker could not load or validate delivery context.",
              retryAt: nextEmailRetryAt(claimed.attemptCount, failedAt),
            });
          }

          const finalizedAt = await readClock();
          if (!leaseIsCurrent(claimed, finalizedAt) ||
              Date.parse(claimed.claimExpiresAt!) - Date.parse(finalizedAt) <= databaseTimeoutMs + reserveMs ||
              activeBudget.remainingMs() <= databaseTimeoutMs + reserveMs) {
            report.expiredClaims++;
            continue;
          }
          const completionState = outcome.state;
          if (completionState !== "sent" && completionState !== "failed" && completionState !== "suppressed") {
            throw new Error("The dispatcher did not produce a completion.");
          }
          await databaseCall((options) => input.store.finalizeEmailDelivery({
            deliveryId: claimed.id, claimToken: claimed.claimToken!, state: completionState, now: finalizedAt,
            providerMessageId: outcome.providerMessageId, errorSummary: outcome.lastError,
            // Backoff starts at completion, even when the provider was slow.
            retryAt: completionState === "failed" ? nextEmailRetryAt(claimed.attemptCount, finalizedAt) : undefined,
          }, options));
          report[completionState]++;
        } catch (error) {
          // Propagate clock failures to the pass-level handler, which counts them once and stops claiming.
          if (clockFailed || leaseFailed) throw error;
          // A finalization failure leaves the lease for SQL recovery; never immediately send again.
          report.infrastructureErrors++;
        }
      } finally {
        activeBudget.dispose();
        activeBudget = undefined;
      }
    }
    // Includes failures that reach the limit in this pass; a lost clock must stop all further I/O.
    if (delivery) await inspectBacklog();
  } catch {
    report.infrastructureErrors++;
  }
  if (report.failed || report.infrastructureErrors || report.expiredClaims || report.exhaustedFailures || report.exhaustedExpiredClaims) {
    report.status = "failed";
    report.exitCode = 1;
  }
  return report;
}
