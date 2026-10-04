// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import type { ConfigEnvironment } from "@/lib/config/deployment-config";
import type { NotificationWorkerStore } from "./notification-worker";
import { executeNotificationWorkerJob, type NotificationWorkerCommandDependencies } from "./notification-worker-command";

const clock = "2026-10-01T00:00:00.000Z";
const jobEnv: ConfigEnvironment = {
  NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
  SUPABASE_SECRET_KEY: "private-fixture-secret",
  EMAIL_DELIVERY_ENABLED: "false",
};

function fixture(deliveryEnabled = false) {
  const store = {
    readWorkerTime: vi.fn(async () => clock),
    inspectEmailDeliveryBacklog: vi.fn(async () => ({ exhaustedFailures: 0, exhaustedExpiredClaims: 0 })),
    generateDueReminderEvents: vi.fn(async () => 2),
    generateTargetedCriticalUpdateEvents: vi.fn(async () => 3),
    prepareEmailDeliveries: vi.fn(async () => 4),
    claimEmailDeliveries: vi.fn(async () => []),
    loadEmailContext: vi.fn(async () => { throw new Error("No fixture claims"); }),
    finalizeEmailDelivery: vi.fn(async () => { throw new Error("No fixture claims"); }),
  } satisfies NotificationWorkerStore;
  const dispose = vi.fn();
  const provider = { providerName: "amazon-ses", send: vi.fn(async () => ({ providerMessageId: "fixture-message" })) };
  const dependencies: NotificationWorkerCommandDependencies = {
    createStore: vi.fn(() => store),
    createDelivery: vi.fn(() => deliveryEnabled ? {
      provider, context: { fromName: "Nihonest", fromAddress: "sender@example.test", siteOrigin: "https://example.test" }, dispose,
    } : undefined),
  };
  return { store, dependencies, provider, dispose };
}

describe("one-pass notification command", () => {
  it.each(["http://127.0.0.1:54321", "http://localhost:54321", "http://[::1]:54321"])("permits explicit local acceptance at %s with disabled email", async (url) => {
    const f = fixture();
    const report = await executeNotificationWorkerJob({ ...jobEnv, NEXT_PUBLIC_SUPABASE_URL: url }, "local", f.dependencies);
    expect(report).toMatchObject({ status: "delivery-disabled", exitCode: 0, deliveriesPrepared: 4, claimed: 0 });
    expect(f.provider.send).not.toHaveBeenCalled();
  });

  it("keeps the default production target strict for a loopback URL", async () => {
    const f = fixture();
    await expect(executeNotificationWorkerJob({ ...jobEnv, NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321" }, undefined, f.dependencies)).rejects.toThrow();
    expect(f.dependencies.createStore).not.toHaveBeenCalled();
    expect(f.dependencies.createDelivery).not.toHaveBeenCalled();
  });

  it.each(["https://project.supabase.co", "http://127.0.0.2:54321", "http://localhost.example.test:54321"])("rejects a non-acceptance host in local mode: %s", async (url) => {
    const f = fixture();
    await expect(executeNotificationWorkerJob({ ...jobEnv, NEXT_PUBLIC_SUPABASE_URL: url }, "local", f.dependencies)).rejects.toThrow();
    expect(f.dependencies.createStore).not.toHaveBeenCalled();
    expect(f.dependencies.createDelivery).not.toHaveBeenCalled();
  });

  it("rejects enabled email locally before constructing a provider or store", async () => {
    const f = fixture(true);
    const env = { ...jobEnv, NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321", EMAIL_DELIVERY_ENABLED: "true",
      EMAIL_PROVIDER: "amazon-ses", AWS_REGION: "ap-northeast-1", EMAIL_FROM_NAME: "Nihonest",
      EMAIL_FROM_ADDRESS: "sender@example.test", NEXT_PUBLIC_SITE_URL: "https://example.test" };
    await expect(executeNotificationWorkerJob(env, "local", f.dependencies)).rejects.toThrow();
    expect(f.dependencies.createStore).not.toHaveBeenCalled();
    expect(f.dependencies.createDelivery).not.toHaveBeenCalled();
  });

  it("validates job-only settings before constructing any client", async () => {
    const f = fixture();
    await expect(executeNotificationWorkerJob({ EMAIL_DELIVERY_ENABLED: "false" }, "production", f.dependencies)).rejects.toThrow();
    expect(f.dependencies.createStore).not.toHaveBeenCalled();
    expect(f.dependencies.createDelivery).not.toHaveBeenCalled();
  });

  it("runs generation/preparation with email disabled and no recipient/claim/provider access", async () => {
    const f = fixture();
    const report = await executeNotificationWorkerJob(jobEnv, "production", f.dependencies);
    expect(report).toMatchObject({ status: "delivery-disabled", exitCode: 0,
      remindersFulfilled: 2, criticalEventsGenerated: 3, deliveriesPrepared: 4, claimed: 0 });
    expect(f.store.claimEmailDeliveries).not.toHaveBeenCalled();
    expect(f.store.loadEmailContext).not.toHaveBeenCalled();
    expect(f.provider.send).not.toHaveBeenCalled();
    expect(JSON.stringify(report)).not.toContain("private-fixture-secret");
  });

  it("uses explicit H3a email config and disposes the provider after a bounded pass", async () => {
    const f = fixture(true);
    const env = { ...jobEnv, EMAIL_DELIVERY_ENABLED: "true", EMAIL_PROVIDER: "amazon-ses",
      AWS_REGION: "ap-northeast-1", EMAIL_FROM_NAME: "Nihonest", EMAIL_FROM_ADDRESS: "sender@example.test",
      NEXT_PUBLIC_SITE_URL: "https://example.test" };
    expect(await executeNotificationWorkerJob(env, "production", f.dependencies)).toMatchObject({ status: "completed", exitCode: 0, claimed: 0 });
    expect(f.dependencies.createDelivery).toHaveBeenCalledWith(expect.objectContaining({ email: expect.objectContaining({ enabled: true, provider: "amazon-ses" }) }));
    expect(f.store.claimEmailDeliveries).toHaveBeenCalledTimes(1);
    expect(f.provider.send).not.toHaveBeenCalled();
    expect(f.dispose).toHaveBeenCalledOnce();
  });

  it("disposes an enabled provider if store construction fails", async () => {
    const f = fixture(true);
    const env = { ...jobEnv, EMAIL_DELIVERY_ENABLED: "true", EMAIL_PROVIDER: "amazon-ses",
      AWS_REGION: "ap-northeast-1", EMAIL_FROM_NAME: "Nihonest", EMAIL_FROM_ADDRESS: "sender@example.test",
      NEXT_PUBLIC_SITE_URL: "https://example.test" };
    const dependencies = { ...f.dependencies, createStore: () => { throw new Error("private store diagnostics"); } };
    await expect(executeNotificationWorkerJob(env, "production", dependencies)).rejects.toThrow();
    expect(f.dispose).toHaveBeenCalledOnce();
  });
});
