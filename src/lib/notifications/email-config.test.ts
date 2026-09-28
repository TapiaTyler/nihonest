import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfigurationError } from "@/lib/config/deployment-config";
import { getEmailDeliveryConfig } from "./email-config";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getEmailDeliveryConfig", () => {
  it("stays disabled when the flag is absent or not exactly true", () => {
    vi.stubEnv("EMAIL_DELIVERY_ENABLED", "");
    expect(getEmailDeliveryConfig()).toEqual({ enabled: false });
    vi.stubEnv("EMAIL_DELIVERY_ENABLED", "TRUE");
    expect(getEmailDeliveryConfig()).toEqual({ enabled: false });
  });

  it("fails closed with the missing setting names when delivery is enabled without its settings", () => {
    vi.stubEnv("EMAIL_DELIVERY_ENABLED", "true");
    vi.stubEnv("EMAIL_PROVIDER", "amazon-ses");
    vi.stubEnv("AWS_REGION", "");
    vi.stubEnv("EMAIL_FROM_NAME", "Nihonest");
    vi.stubEnv("EMAIL_FROM_ADDRESS", "hello@nihonest.example");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://nihonest.example");
    expect(getEmailDeliveryConfig).toThrow(ConfigurationError);
    expect(getEmailDeliveryConfig).toThrow(/AWS_REGION/);
  });
});
