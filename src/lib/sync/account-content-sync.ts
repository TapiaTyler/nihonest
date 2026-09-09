import type { SupabaseClient } from "@supabase/supabase-js";
import { accountContentStateSchema, type AccountContentState } from "@/domain/sync/account-content-state";
import type { Database, Json } from "@/types/database";

export type AccountContentSyncResult =
  | Readonly<{ ok: true; state: AccountContentState }>
  | Readonly<{ ok: false; message: string }>;

/** Sends a complete device snapshot and accepts only a validated canonical account response. */
export async function synchronizeAccountContent(
  client: SupabaseClient<Database>,
  deviceState: AccountContentState,
): Promise<AccountContentSyncResult> {
  const payload = accountContentStateSchema.safeParse(deviceState);
  if (!payload.success) return { ok: false, message: "Local saved data is invalid and was not synchronized." };

  const { data, error } = await client.rpc("sync_account_content", {
    p_saved_content: payload.data.savedContent as Json,
    p_glossary_progress: payload.data.glossaryProgress as Json,
    p_checklist_progress: payload.data.checklistProgress as Json,
  });

  if (error) return { ok: false, message: "Saved data could not be synchronized with the account." };

  const canonicalState = accountContentStateSchema.safeParse(data);
  return canonicalState.success
    ? { ok: true, state: canonicalState.data }
    : { ok: false, message: "The account returned saved data in an unexpected format." };
}
