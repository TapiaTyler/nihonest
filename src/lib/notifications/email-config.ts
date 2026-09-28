import "server-only";
import { ConfigurationError, readEmailDeliveryConfig, type EmailDeliveryConfig } from "@/lib/config/deployment-config";

export type { EmailDeliveryConfig };

/** Email remains fail-closed until every production-only setting is explicitly present. */
export function getEmailDeliveryConfig(): EmailDeliveryConfig {
  const { value, issues } = readEmailDeliveryConfig(process.env);
  if (!value) throw new ConfigurationError("Email delivery is enabled but its configuration is incomplete", issues);
  return value;
}
