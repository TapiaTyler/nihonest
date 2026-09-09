import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { emptyAccountContentState, type AccountContentState } from "@/domain/sync/account-content-state";
import type { Database } from "@/types/database";
import { synchronizeAccountContent } from "./account-content-sync";

const deviceState: AccountContentState = {
  ...emptyAccountContentState,
  savedContent: [{ kind: "glossary-term", contentId: "zairyu-card", state: "saved", updatedAt: "2026-09-08T12:00:00.000Z" }],
};

describe("account content synchronization", () => {
  it("sends all record families and validates the canonical response", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: deviceState, error: null });
    const client = { rpc } as unknown as SupabaseClient<Database>;

    await expect(synchronizeAccountContent(client, deviceState)).resolves.toEqual({ ok: true, state: deviceState });
    expect(rpc).toHaveBeenCalledWith("sync_account_content", {
      p_saved_content: deviceState.savedContent,
      p_glossary_progress: [],
      p_checklist_progress: [],
    });
  });

  it("does not accept malformed account data", async () => {
    const client = {
      rpc: vi.fn().mockResolvedValue({ data: { savedContent: "invalid" }, error: null }),
    } as unknown as SupabaseClient<Database>;

    await expect(synchronizeAccountContent(client, deviceState)).resolves.toEqual({
      ok: false,
      message: "The account returned saved data in an unexpected format.",
    });
  });
});
