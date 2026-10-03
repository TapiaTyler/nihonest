// @vitest-environment node
import { describe, expect, it } from "vitest";
import { resolveWorkerRecipient } from "./worker-recipient";

const confirmedAt = "2026-10-01T09:00:00.123456+09:00";

describe("worker Auth recipient policy", () => {
  it("uses only the current email with email-specific confirmation", () => {
    const user = { email: "current@example.test", email_confirmed_at: confirmedAt, new_email: "pending@example.test" };
    expect(resolveWorkerRecipient(user)).toEqual({ status: "eligible", address: "current@example.test" });
  });

  it.each([undefined, null, "", "invalid", " reader@example.test "])("suppresses unusable email %s", (email) => {
    expect(resolveWorkerRecipient({ email, email_confirmed_at: confirmedAt })).toEqual({ status: "suppressed" });
  });

  it.each([undefined, null, "", "invalid", "2026-02-30T00:00:00Z"])("suppresses missing or malformed email confirmation %s", (email_confirmed_at) => {
    expect(resolveWorkerRecipient({ email: "reader@example.test", email_confirmed_at })).toEqual({ status: "suppressed" });
  });

  it("does not substitute general or phone confirmation, or a pending email", () => {
    const user = { email: "reader@example.test", confirmed_at: confirmedAt, phone_confirmed_at: confirmedAt, new_email: "pending@example.test" };
    expect(resolveWorkerRecipient(user)).toEqual({ status: "suppressed" });
  });
});
