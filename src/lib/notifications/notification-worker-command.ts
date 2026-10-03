import "server-only";
import { requireJobConfig, type ConfigEnvironment, type DeploymentTarget, type JobConfig } from "@/lib/config/deployment-config";
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
