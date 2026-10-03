import { z } from "zod";

export const workerRecipientSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("eligible"), address: z.email() }).strict(),
  z.object({ status: z.literal("suppressed") }).strict(),
]);

export type WorkerRecipient = z.infer<typeof workerRecipientSchema>;

/** Only the current Auth email and its email-specific confirmation authorize delivery. */
export function resolveWorkerRecipient(user: Readonly<{ email?: unknown; email_confirmed_at?: unknown }>): WorkerRecipient {
  const address = z.email().safeParse(user.email);
  const confirmed = z.iso.datetime({ offset: true }).safeParse(user.email_confirmed_at);
  if (!address.success || !confirmed.success) return { status: "suppressed" };
  return { status: "eligible", address: address.data };
}
