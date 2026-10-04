import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { emptyAccountContentState, type AccountContentState } from "@/domain/sync/account-content-state";
import type { Database } from "@/types/database";
import { synchronizeAccountContent } from "./account-content-sync";

const accountId = "30000000-0000-4000-8000-000000000003";

const deviceState: AccountContentState = {
  ...emptyAccountContentState,
  savedContent: [{ kind: "glossary-term", contentId: "zairyu-card", state: "saved", updatedAt: "2026-09-08T12:00:00.000Z" }],
};

describe("account content synchronization", () => {
  it.each(["", "not-an-account", undefined, null])("does not send a snapshot without a valid expected account (%s)", async (id) => {
    const rpc = vi.fn();
    const client = { rpc } as unknown as SupabaseClient<Database>;
    await expect(synchronizeAccountContent(client, id as string, deviceState)).resolves.toMatchObject({ ok: false });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("sanitizes a database identity mismatch and never accepts its response", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: deviceState, error: { code: "42501", message: "private identity detail" } });
    const client = { rpc } as unknown as SupabaseClient<Database>;
    await expect(synchronizeAccountContent(client, accountId, deviceState)).resolves.toEqual({
      ok: false, message: "Saved data could not be synchronized with the account.",
    });
    expect(rpc).toHaveBeenCalledOnce();
  });

  it("sends all record families and validates the canonical response", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: deviceState, error: null });
    const client = { rpc } as unknown as SupabaseClient<Database>;

    await expect(synchronizeAccountContent(client, accountId, deviceState)).resolves.toEqual({ ok: true, state: deviceState });
    expect(rpc).toHaveBeenCalledWith("sync_account_content", {
      p_expected_user_id: accountId,
      p_saved_content: deviceState.savedContent,
      p_glossary_progress: [],
      p_checklist_progress: [],
    });
  });

  it("does not accept malformed account data", async () => {
    const client = {
      rpc: vi.fn().mockResolvedValue({ data: { savedContent: "invalid" }, error: null }),
    } as unknown as SupabaseClient<Database>;

    await expect(synchronizeAccountContent(client, accountId, deviceState)).resolves.toEqual({
      ok: false,
      message: "The account returned saved data in an unexpected format.",
    });
  });
});
