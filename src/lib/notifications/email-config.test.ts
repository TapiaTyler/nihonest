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

  it("keeps a padded flag disabled even when every other setting is valid", () => {
    vi.stubEnv("EMAIL_PROVIDER", "amazon-ses");
    vi.stubEnv("AWS_REGION", "ap-northeast-1");
    vi.stubEnv("EMAIL_FROM_NAME", "Nihonest");
    vi.stubEnv("EMAIL_FROM_ADDRESS", "hello@nihonest.example");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://nihonest.example");
    vi.stubEnv("EMAIL_DELIVERY_ENABLED", " true ");
    expect(getEmailDeliveryConfig()).toEqual({ enabled: false });
    vi.stubEnv("EMAIL_DELIVERY_ENABLED", "true");
    expect(getEmailDeliveryConfig()).toMatchObject({ enabled: true, siteOrigin: "https://nihonest.example" });
  });

  it("rejects a site origin carrying credentials without echoing them", () => {
    vi.stubEnv("EMAIL_DELIVERY_ENABLED", "true");
    vi.stubEnv("EMAIL_PROVIDER", "amazon-ses");
    vi.stubEnv("AWS_REGION", "ap-northeast-1");
    vi.stubEnv("EMAIL_FROM_NAME", "Nihonest");
    vi.stubEnv("EMAIL_FROM_ADDRESS", "hello@nihonest.example");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://editor:hunter2@nihonest.example");
    expect(getEmailDeliveryConfig).toThrow(/NEXT_PUBLIC_SITE_URL/);
    expect(getEmailDeliveryConfig).not.toThrow(/hunter2/);
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
