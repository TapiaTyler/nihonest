import { describe, expect, it } from "vitest";
import {
  checkConfiguration,
  ConfigurationError,
  readEmailDeliveryConfig,
  readJobConfig,
  readPublicSiteOrigin,
  readSupabasePublicSettings,
  readSupabaseSecretKey,
  requireJobConfig,
  settingDefinitions,
  type ConfigEnvironment,
} from "./deployment-config";

const secret = "sb_secret_do-not-print";
const publicOnlyProduction: ConfigEnvironment = { NEXT_PUBLIC_SITE_URL: "https://nihonest.example" };
const accountsProduction: ConfigEnvironment = {
  ...publicOnlyProduction,
  NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_key",
  SUPABASE_SECRET_KEY: secret,
};
const emailSettings: ConfigEnvironment = {
  EMAIL_DELIVERY_ENABLED: "true",
  EMAIL_PROVIDER: "amazon-ses",
  AWS_REGION: "ap-northeast-1",
  EMAIL_FROM_NAME: "Nihonest",
  EMAIL_FROM_ADDRESS: "hello@nihonest.example",
};

function settings(report: { issues: readonly { setting: string }[] }): string[] {
  return [...new Set(report.issues.map((issue) => issue.setting))].sort();
}

describe("checkConfiguration", () => {
  it("runs locally with every optional feature disabled", () => {
    const report = checkConfiguration({}, { target: "local" });
    expect(report.issues).toEqual([]);
    expect(report.features).toEqual({ publicSite: true, accounts: false, jobs: false, emailDelivery: false });
  });

  it("accepts a public-only production build without worker credentials or email delivery", () => {
    const report = checkConfiguration(publicOnlyProduction, { target: "production" });
    expect(report.issues).toEqual([]);
    expect(report.features).toEqual({ publicSite: true, accounts: false, jobs: false, emailDelivery: false });
  });

  it("does not require the secrets of disabled features, even when unrelated values are present", () => {
    const report = checkConfiguration({ ...publicOnlyProduction, EMAIL_DELIVERY_ENABLED: "false", EMAIL_PROVIDER: "amazon-ses" }, { target: "production" });
    expect(report.issues).toEqual([]);
    expect(report.features.emailDelivery).toBe(false);
  });

  it("requires a public HTTPS site origin in production", () => {
    expect(settings(checkConfiguration({}, { target: "production" }))).toEqual(["NEXT_PUBLIC_SITE_URL"]);
    expect(checkConfiguration({ NEXT_PUBLIC_SITE_URL: "http://nihonest.example" }, { target: "production" }).issues)
      .toContainEqual({ setting: "NEXT_PUBLIC_SITE_URL", message: "must use https in production" });
    expect(checkConfiguration({ NEXT_PUBLIC_SITE_URL: "https://localhost:3000" }, { target: "production" }).issues)
      .toContainEqual({ setting: "NEXT_PUBLIC_SITE_URL", message: "must not be a local address in production" });
    expect(checkConfiguration({ NEXT_PUBLIC_SITE_URL: "not a url" }, { target: "local" }).issues)
      .toEqual([{ setting: "NEXT_PUBLIC_SITE_URL", message: "must be an absolute URL" }]);
  });

  it("allows local loopback origins outside production", () => {
    const report = checkConfiguration({
      NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "local",
    }, { target: "local" });
    expect(report.issues).toEqual([]);
    expect(report.features.accounts).toBe(true);
  });

  it("enables accounts from the public Supabase values and rejects a partial pair", () => {
    expect(checkConfiguration(accountsProduction, { target: "production" })).toMatchObject({ issues: [], features: { accounts: true, jobs: false } });
    expect(settings(checkConfiguration({ ...publicOnlyProduction, NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co", SUPABASE_SECRET_KEY: secret }, { target: "production" })))
      .toEqual(["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]);
  });

  it("requires a server secret for production accounts and accepts the legacy key", () => {
    const withoutSecret = { ...accountsProduction, SUPABASE_SECRET_KEY: undefined };
    expect(settings(checkConfiguration(withoutSecret, { target: "production" }))).toEqual(["SUPABASE_SECRET_KEY"]);
    expect(checkConfiguration({ ...withoutSecret, SUPABASE_SERVICE_ROLE_KEY: secret }, { target: "production" }).issues).toEqual([]);
    expect(checkConfiguration({ ...withoutSecret, NEXT_PUBLIC_SITE_URL: undefined }, { target: "local" }).issues).toEqual([]);
  });

  it("fails when a required feature is not configured", () => {
    expect(settings(checkConfiguration(publicOnlyProduction, { target: "production", require: ["accounts"] })))
      .toEqual(["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SECRET_KEY"]);
    expect(settings(checkConfiguration(accountsProduction, { target: "production", require: ["emailDelivery"] })))
      .toEqual(["EMAIL_DELIVERY_ENABLED"]);
  });

  it("rejects social sign-in without accounts and non-boolean flags", () => {
    expect(checkConfiguration({ NEXT_PUBLIC_SUPABASE_GOOGLE_AUTH_ENABLED: "true" }, { target: "local" }).issues)
      .toEqual([{ setting: "NEXT_PUBLIC_SUPABASE_GOOGLE_AUTH_ENABLED", message: "requires accounts to be configured" }]);
    expect(settings(checkConfiguration({ NEXT_PUBLIC_SUPABASE_APPLE_AUTH_ENABLED: "yes" }, { target: "local" })))
      .toEqual(["NEXT_PUBLIC_SUPABASE_APPLE_AUTH_ENABLED"]);
  });

  it("only enables jobs when required or implied by email delivery", () => {
    expect(settings(checkConfiguration(publicOnlyProduction, { target: "production", require: ["jobs"] })))
      .toEqual(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SECRET_KEY"]);
    const email = checkConfiguration({ ...accountsProduction, ...emailSettings }, { target: "production" });
    expect(email).toMatchObject({ issues: [], features: { jobs: true, emailDelivery: true } });
  });

  it("names every missing email setting when delivery is enabled", () => {
    const report = checkConfiguration({ ...accountsProduction, EMAIL_DELIVERY_ENABLED: "true" }, { target: "production" });
    expect(settings(report)).toEqual(["AWS_REGION", "EMAIL_FROM_ADDRESS", "EMAIL_FROM_NAME", "EMAIL_PROVIDER"]);
  });

  it("never includes setting values in issues", () => {
    const report = checkConfiguration({
      NEXT_PUBLIC_SITE_URL: "http://secret-host.example",
      NEXT_PUBLIC_SUPABASE_URL: "ftp://secret-project",
      SUPABASE_SECRET_KEY: secret,
      EMAIL_DELIVERY_ENABLED: "true",
      EMAIL_FROM_ADDRESS: "not-an-address-secret",
    }, { target: "production", require: ["jobs"] });
    expect(report.issues.length).toBeGreaterThan(0);
    const text = JSON.stringify(report.issues);
    for (const value of ["secret-host", "secret-project", secret, "not-an-address-secret"]) expect(text).not.toContain(value);
  });
});

describe("feature readers", () => {
  it("treats blank Supabase values as unset", () => {
    expect(readSupabasePublicSettings({ NEXT_PUBLIC_SUPABASE_URL: " ", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "" })).toEqual({ value: undefined, issues: [] });
  });

  it("prefers the current secret key and falls back past a blank one", () => {
    expect(readSupabaseSecretKey({ SUPABASE_SECRET_KEY: "current", SUPABASE_SERVICE_ROLE_KEY: "legacy" })).toBe("current");
    expect(readSupabaseSecretKey({ SUPABASE_SECRET_KEY: "", SUPABASE_SERVICE_ROLE_KEY: "legacy" })).toBe("legacy");
    expect(readSupabaseSecretKey({})).toBeUndefined();
  });

  it("keeps email disabled unless the flag is exactly true", () => {
    expect(readEmailDeliveryConfig({}).value).toEqual({ enabled: false });
    expect(readEmailDeliveryConfig({ EMAIL_DELIVERY_ENABLED: "TRUE" })).toMatchObject({ value: { enabled: false }, issues: [{ setting: "EMAIL_DELIVERY_ENABLED" }] });
    expect(readEmailDeliveryConfig({ ...emailSettings, NEXT_PUBLIC_SITE_URL: "https://nihonest.example" }).value).toEqual({
      enabled: true,
      provider: "amazon-ses",
      awsRegion: "ap-northeast-1",
      fromName: "Nihonest",
      fromAddress: "hello@nihonest.example",
      siteOrigin: "https://nihonest.example",
    });
    expect(settings(readEmailDeliveryConfig({ ...emailSettings, NEXT_PUBLIC_SITE_URL: "http://nihonest.example" }))).toEqual(["NEXT_PUBLIC_SITE_URL"]);
  });

  it("returns job settings with delivery disabled by default", () => {
    expect(readJobConfig({ NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321", SUPABASE_SERVICE_ROLE_KEY: "legacy" }).value).toEqual({
      supabaseUrl: "http://127.0.0.1:54321",
      supabaseSecretKey: "legacy",
      email: { enabled: false },
    });
  });

  it("throws a ConfigurationError naming missing job settings without values", () => {
    let error: unknown;
    try {
      requireJobConfig({ NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321", EMAIL_DELIVERY_ENABLED: "true", EMAIL_FROM_NAME: secret });
    }
    catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(ConfigurationError);
    const { issues, message } = error as ConfigurationError;
    expect(settings({ issues })).toEqual(["AWS_REGION", "EMAIL_FROM_ADDRESS", "EMAIL_PROVIDER", "NEXT_PUBLIC_SITE_URL", "SUPABASE_SECRET_KEY"]);
    expect(message).not.toContain(secret);
  });

  it("documents every setting the readers consult", () => {
    const names = new Set(settingDefinitions.map((setting) => setting.name));
    for (const name of ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY", "EMAIL_DELIVERY_ENABLED", "EMAIL_PROVIDER", "AWS_REGION", "EMAIL_FROM_NAME", "EMAIL_FROM_ADDRESS"]) {
      expect(names.has(name)).toBe(true);
    }
    expect(settingDefinitions.filter((setting) => setting.name.startsWith("NEXT_PUBLIC_")).every((setting) => setting.exposure === "public-build")).toBe(true);
    expect(settingDefinitions.filter((setting) => setting.exposure === "public-build").every((setting) => setting.name.startsWith("NEXT_PUBLIC_"))).toBe(true);
  });
});

describe("H3a review fixes", () => {
  const jobEnvironment: ConfigEnvironment = { NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co", SUPABASE_SECRET_KEY: secret };
  const httpsSite: ConfigEnvironment = { NEXT_PUBLIC_SITE_URL: "https://nihonest.example" };

  it("keeps padded or differently cased flags disabled, like the browser's literal comparison", () => {
    for (const value of [" true ", "true ", " true", "TRUE", "True"]) {
      const result = readEmailDeliveryConfig({ ...emailSettings, ...httpsSite, EMAIL_DELIVERY_ENABLED: value });
      expect(result.value).toEqual({ enabled: false });
      expect(settings(result)).toEqual(["EMAIL_DELIVERY_ENABLED"]);
    }
    expect(settings(checkConfiguration({ ...accountsProduction, NEXT_PUBLIC_SUPABASE_GOOGLE_AUTH_ENABLED: " true " }, { target: "production" })))
      .toEqual(["NEXT_PUBLIC_SUPABASE_GOOGLE_AUTH_ENABLED"]);
    expect(readEmailDeliveryConfig({ EMAIL_DELIVERY_ENABLED: "" })).toEqual({ value: { enabled: false }, issues: [] });
  });

  it("checks a job-only deployment without web-account settings, with delivery disabled and enabled", () => {
    expect(checkConfiguration(jobEnvironment, { target: "production", deployment: "job" })).toEqual({
      target: "production",
      deployment: "job",
      features: { publicSite: false, accounts: false, jobs: true, emailDelivery: false },
      issues: [],
    });
    expect(checkConfiguration({ ...jobEnvironment, ...httpsSite, ...emailSettings }, { target: "production", deployment: "job" }))
      .toMatchObject({ issues: [], features: { jobs: true, emailDelivery: true } });
    expect(settings(checkConfiguration({ ...jobEnvironment, ...emailSettings }, { target: "production", deployment: "job" })))
      .toEqual(["NEXT_PUBLIC_SITE_URL"]);
    expect(settings(checkConfiguration({ NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co" }, { target: "production", deployment: "job" })))
      .toEqual(["SUPABASE_SECRET_KEY"]);
    expect(settings(checkConfiguration(jobEnvironment, { target: "production", deployment: "job", require: ["emailDelivery"] })))
      .toEqual(["EMAIL_DELIVERY_ENABLED"]);
    expect(settings(checkConfiguration(jobEnvironment, { target: "production", deployment: "job", require: ["accounts"] })))
      .toEqual(["--require"]);
  });

  it("agrees with the job reader for job deployments", () => {
    for (const env of [jobEnvironment, { ...jobEnvironment, ...emailSettings }, {}, { ...jobEnvironment, ...httpsSite, ...emailSettings }]) {
      expect(checkConfiguration(env, { target: "local", deployment: "job" }).issues).toEqual(readJobConfig(env, "local").issues);
    }
  });

  it("still reports incomplete web-account configuration for the web deployment", () => {
    expect(settings(checkConfiguration({ ...publicOnlyProduction, ...jobEnvironment }, { target: "production" })))
      .toEqual(["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]);
    expect(settings(checkConfiguration({ ...publicOnlyProduction, ...jobEnvironment }, { target: "production", require: ["jobs"] })))
      .toEqual(["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]);
  });

  it("rejects credentials, paths, queries, and fragments in origin settings without printing them", () => {
    const invalid = [
      "https://user:hunter2@nihonest.example",
      "https://user@nihonest.example",
      "https://nihonest.example/base",
      "https://nihonest.example/?token=hunter2",
      "https://nihonest.example/#hunter2",
      "https://nihonest.example?",
    ];
    for (const value of invalid) {
      for (const name of ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_SUPABASE_URL"]) {
        const report = checkConfiguration({ ...accountsProduction, [name]: value }, { target: "production" });
        expect(settings(report)).toEqual([name]);
        expect(JSON.stringify(report.issues)).not.toMatch(/hunter2|nihonest\.example|\/base/);
      }
      expect(() => readPublicSiteOrigin({ NEXT_PUBLIC_SITE_URL: value })).toThrow(ConfigurationError);
      expect(settings(readEmailDeliveryConfig({ ...emailSettings, NEXT_PUBLIC_SITE_URL: value }))).toEqual(["NEXT_PUBLIC_SITE_URL"]);
      expect(settings(readJobConfig({ ...jobEnvironment, NEXT_PUBLIC_SUPABASE_URL: value }))).toEqual(["NEXT_PUBLIC_SUPABASE_URL"]);
    }
  });

  it("normalizes accepted origins, including a trailing slash", () => {
    expect(readPublicSiteOrigin({ NEXT_PUBLIC_SITE_URL: "https://Nihonest.example/" })).toBe("https://nihonest.example");
    expect(readPublicSiteOrigin({})).toBeUndefined();
    expect(readEmailDeliveryConfig({ ...emailSettings, NEXT_PUBLIC_SITE_URL: "https://nihonest.example/" }).value)
      .toMatchObject({ enabled: true, siteOrigin: "https://nihonest.example" });
    expect(readJobConfig({ ...jobEnvironment, NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co/" }).value?.supabaseUrl)
      .toBe("https://project.supabase.co");
  });
});
