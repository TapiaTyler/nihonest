import type { SupabaseClient } from "@supabase/supabase-js";
import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "@/types/database";
import { AccountSessionProvider, useAccountSession } from "./account-session-provider";

const mocks = vi.hoisted(() => ({
  getClient: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@/lib/supabase/client", () => ({ getSupabaseBrowserClient: mocks.getClient }));
vi.mock("@/lib/accounts/client-account-service", () => ({ signOut: mocks.signOut }));

function SessionStatus() {
  const session = useAccountSession();
  return (
    <>
      <p>{session.status}</p>
      <p>{session.displayName}</p>
      <button type="button" onClick={() => void session.endSession()}>End session</button>
    </>
  );
}

function authenticatedClient() {
  const maybeSingle = vi.fn().mockResolvedValue({ data: { display_name: "Tyler" } });
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "30000000-0000-4000-8000-000000000003" } } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({ maybeSingle }),
      }),
    }),
  } as unknown as SupabaseClient<Database>;
}

describe("AccountSessionProvider", () => {
  beforeEach(() => {
    mocks.getClient.mockReset().mockReturnValue(authenticatedClient());
    mocks.signOut.mockReset().mockResolvedValue({ ok: true });
  });

  it("loads the signed-in user's display name", async () => {
    render(<AccountSessionProvider><SessionStatus /></AccountSessionProvider>);

    await screen.findByText("signed-in");
    expect(screen.getByText("Tyler")).toBeInTheDocument();
  });

  it("updates immediately after a successful sign out", async () => {
    render(<AccountSessionProvider><SessionStatus /></AccountSessionProvider>);
    await screen.findByText("signed-in");

    await act(async () => screen.getByRole("button", { name: "End session" }).click());

    await waitFor(() => expect(screen.getByText("signed-out")).toBeInTheDocument());
  });
});
