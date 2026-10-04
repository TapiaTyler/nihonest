import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { accountContentStateSchema, type AccountContentState } from "@/domain/sync/account-content-state";
import type { Database, Json } from "@/types/database";
import type { AccountContentSyncResult } from "./account-content-sync-contract";

export type { AccountContentSyncResult } from "./account-content-sync-contract";

/** Binds a device snapshot to the coordinator's account; the database verifies the JWT identity. */
export async function synchronizeAccountContent(
  client: SupabaseClient<Database>,
  expectedAccountId: string,
  deviceState: AccountContentState,
): Promise<AccountContentSyncResult> {
  if (!z.uuid().safeParse(expectedAccountId).success) {
    return { ok: false, message: "The expected account is invalid and saved data was not synchronized." };
  }
  const payload = accountContentStateSchema.safeParse(deviceState);
  if (!payload.success) return { ok: false, message: "Local saved data is invalid and was not synchronized." };

  const { data, error } = await client.rpc("sync_account_content", {
    p_expected_user_id: expectedAccountId,
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
