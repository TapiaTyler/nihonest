import "server-only";
import { ConfigurationError, requireJobConfig, type ConfigEnvironment, type DeploymentTarget, type JobConfig } from "@/lib/config/deployment-config";
import { createConfiguredEmailDelivery, type ConfiguredEmailDelivery } from "./configured-email-provider";
import { runNotificationWorker, type NotificationWorkerReport, type NotificationWorkerStore } from "./notification-worker";
import { createSupabaseNotificationWorkerStore } from "./supabase-notification-worker-store";

const REQUEST_TIMEOUT_MS = 10_000;

export type NotificationWorkerCommandDependencies = Readonly<{
  createStore(config: JobConfig): NotificationWorkerStore;
  createDelivery(config: JobConfig): ConfiguredEmailDelivery | undefined;
}>;

const productionDependencies: NotificationWorkerCommandDependencies = {
  createStore: (config) => createSupabaseNotificationWorkerStore(config, { timeoutMs: REQUEST_TIMEOUT_MS }),
  createDelivery: (config) => createConfiguredEmailDelivery(config.email, { sendTimeoutMs: REQUEST_TIMEOUT_MS }),
};

/** One bounded pass. Validation precedes client construction; only aggregate counters are returned. */
export async function executeNotificationWorkerJob(
  env: ConfigEnvironment,
  target: DeploymentTarget = "production",
  dependencies: NotificationWorkerCommandDependencies = productionDependencies,
): Promise<NotificationWorkerReport> {
  const config = requireJobConfig(env, target);
  if (target === "local") {
    const issues = [];
    if (!["localhost", "127.0.0.1", "[::1]"].includes(new URL(config.supabaseUrl).hostname)) {
      issues.push({ setting: "NEXT_PUBLIC_SUPABASE_URL", message: "must use a loopback host for local worker acceptance" });
    }
    if (config.email.enabled) {
      issues.push({ setting: "EMAIL_DELIVERY_ENABLED", message: "must be disabled for local worker acceptance" });
    }
    if (issues.length) throw new ConfigurationError("Local worker acceptance configuration is invalid", issues);
  }
  const delivery = dependencies.createDelivery(config);
  try {
    const store = dependencies.createStore(config);
    return await runNotificationWorker({
      jobsEnabled: true, store, delivery,
      limits: { databaseTimeoutMs: REQUEST_TIMEOUT_MS, providerTimeoutMs: REQUEST_TIMEOUT_MS },
    });
  } finally {
    delivery?.dispose();
  }
}
