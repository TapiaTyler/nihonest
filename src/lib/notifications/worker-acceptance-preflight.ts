import "server-only";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireJobConfig, type JobConfig } from "@/lib/config/deployment-config";
import type { Database } from "@/types/database";
import { createWorkerDatabaseFetch } from "./worker-database-fetch";
import { createSupabaseNotificationWorkerStore } from "./supabase-notification-worker-store";

/** Read-only preparation for a dedicated disposable Auth/PostgREST fixture stack, never a worker pass. */
export const ACCEPTANCE_EMPTY_TABLES = [
  "profiles", "user_preferences", "saved_content", "glossary_study_progress", "checklist_progress",
  "notification_preferences", "reminders", "notification_events", "notification_deliveries",
  "critical_update_releases", "critical_update_journey_targets",
] as const satisfies readonly (keyof Database["public"]["Tables"])[];

type AcceptanceTarget = Readonly<{ sourceRef: string; config: JobConfig }>;
export type AcceptanceInventory = Readonly<{ authUsers: number; tableRows: readonly number[]; workerTime: string }>;
export type AcceptancePreflightReport = Readonly<{
  status: "ready-for-fixtures"; sourceRef: string; tablesChecked: number; authUsers: 0; tableRows: 0;
}>;

/** Exact source selection and loopback validation happen before constructing any administrative client. */
export function validateAcceptanceTarget(input: {
  sourceRef: string; currentRef: string; supabaseUrl: string; secretKey: string | undefined;
}): AcceptanceTarget {
  if (!/^[a-f0-9]{40}$/.test(input.sourceRef) || input.sourceRef !== input.currentRef) {
    throw new Error("Acceptance requires the exact checked-out source commit.");
  }
  const config = requireJobConfig({
    NEXT_PUBLIC_SUPABASE_URL: input.supabaseUrl,
    SUPABASE_SECRET_KEY: input.secretKey,
    EMAIL_DELIVERY_ENABLED: "false",
  }, "local");
  const url = new URL(config.supabaseUrl);
  if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
    throw new Error("Acceptance requires a loopback Supabase origin.");
  }
  return { sourceRef: input.sourceRef, config };
}

/** Uses real SDK reads and the production worker clock adapter; no fixture, claim or provider is created. */
async function readInventory(target: AcceptanceTarget): Promise<AcceptanceInventory> {
  const client = createClient<Database>(target.config.supabaseUrl, target.config.supabaseSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    db: { retry: false },
    global: { fetch: createWorkerDatabaseFetch(globalThis.fetch, 10_000) },
  });
  const store = createSupabaseNotificationWorkerStore(target.config, { timeoutMs: 10_000 });
  // One user is sufficient to reject an occupied stack. Never print or retain returned user identities.
  const [auth, rows, workerTime] = await Promise.all([
    client.auth.admin.listUsers({ page: 1, perPage: 1 }),
    Promise.all(ACCEPTANCE_EMPTY_TABLES.map(async (table) => {
      const result = await client.from(table).select("*", { count: "exact", head: true });
      if (result.error || result.count === null) throw new Error("Acceptance inventory is unavailable.");
      return result.count;
    })),
    store.readWorkerTime(),
  ]);
  if (auth.error || !Array.isArray(auth.data.users)) throw new Error("Acceptance Auth inventory is unavailable.");
  return { authUsers: auth.data.users.length, tableRows: rows, workerTime };
}

/**
 * Empty inventories catch accidental reuse of another contributor's stack. They do not prove exclusive
 * ownership or applied migration identity. Verify those separately before the future mutating harness.
 * A successful result is a prerequisite only, not Auth/JWT/fake-sender acceptance evidence.
 */
export async function runAcceptancePreflight(
  input: Parameters<typeof validateAcceptanceTarget>[0],
  inventory: (target: AcceptanceTarget) => Promise<AcceptanceInventory> = readInventory,
): Promise<AcceptancePreflightReport> {
  const target = validateAcceptanceTarget(input);
  const result = await inventory(target);
  if (!Number.isInteger(result.authUsers) || result.authUsers !== 0
    || result.tableRows.length !== ACCEPTANCE_EMPTY_TABLES.length
    || result.tableRows.some((count) => !Number.isInteger(count) || count !== 0)
    || !z.iso.datetime().safeParse(result.workerTime).success) {
    throw new Error("Acceptance requires a complete empty disposable stack and a valid worker clock.");
  }
  return { status: "ready-for-fixtures", sourceRef: target.sourceRef, tablesChecked: ACCEPTANCE_EMPTY_TABLES.length, authUsers: 0, tableRows: 0 };
}
