import { z } from "zod";

/**
 * Feature-aware deployment settings. Every function reads an explicit environment record instead of `process.env`,
 * so the release preflight, the notification worker command, server modules, and tests share one set of rules.
 * This module has no `server-only` marker because commands run outside Next.js; client components must not import
 * it, because the secret readers below exist for server processes only. Issues name settings and never print values.
 */
export type ConfigEnvironment = Readonly<Record<string, string | undefined>>;

export type ConfigFeature = "publicSite" | "accounts" | "jobs" | "emailDelivery";
export type DeploymentTarget = "local" | "production";

/**
 * `public-build` values are inlined into browser JavaScript by `next build` and must be set when building;
 * `server-runtime` values are read by the running server or a command; `server-secret` values are runtime
 * credentials that never reach the browser and are never printed.
 */
export type SettingExposure = "public-build" | "server-runtime" | "server-secret";

export type SettingDefinition = Readonly<{
  name: string;
  feature: ConfigFeature;
  exposure: SettingExposure;
  description: string;
}>;

export const settingDefinitions: readonly SettingDefinition[] = [
  { name: "NEXT_PUBLIC_SITE_URL", feature: "publicSite", exposure: "public-build", description: "Public HTTPS origin for canonical URLs, the sitemap, robots, and email links. Required in production." },
  { name: "NEXT_PUBLIC_SUPABASE_URL", feature: "accounts", exposure: "public-build", description: "Supabase project URL. Setting it with the publishable key enables accounts." },
  { name: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", feature: "accounts", exposure: "public-build", description: "Supabase publishable (anonymous) key." },
  { name: "NEXT_PUBLIC_SUPABASE_GOOGLE_AUTH_ENABLED", feature: "accounts", exposure: "public-build", description: "\"true\" shows Google sign-in; requires accounts and a configured callback." },
  { name: "NEXT_PUBLIC_SUPABASE_APPLE_AUTH_ENABLED", feature: "accounts", exposure: "public-build", description: "\"true\" shows Apple sign-in; requires accounts and a configured callback." },
  { name: "SUPABASE_SECRET_KEY", feature: "accounts", exposure: "server-secret", description: "Server-only Supabase secret key for account deletion and administrative jobs. Required for production accounts and for jobs." },
  { name: "SUPABASE_SERVICE_ROLE_KEY", feature: "accounts", exposure: "server-secret", description: "Legacy alternative to SUPABASE_SECRET_KEY, used only when the secret key is unset." },
  { name: "EMAIL_DELIVERY_ENABLED", feature: "emailDelivery", exposure: "server-runtime", description: "\"true\" enables real transactional email from jobs. Anything else keeps delivery disabled." },
  { name: "EMAIL_PROVIDER", feature: "emailDelivery", exposure: "server-runtime", description: "Email provider; only \"amazon-ses\" is supported." },
  { name: "AWS_REGION", feature: "emailDelivery", exposure: "server-runtime", description: "Amazon SES region. AWS credentials come from the SDK's default provider chain." },
  { name: "EMAIL_FROM_NAME", feature: "emailDelivery", exposure: "server-runtime", description: "Sender display name, at most 80 characters." },
  { name: "EMAIL_FROM_ADDRESS", feature: "emailDelivery", exposure: "server-runtime", description: "Verified sender address." },
];

export type ConfigurationIssue = Readonly<{ setting: string; message: string }>;

export class ConfigurationError extends Error {
  readonly issues: readonly ConfigurationIssue[];

  constructor(context: string, issues: readonly ConfigurationIssue[]) {
    super(`${context}:\n${issues.map((issue) => `- ${issue.setting}: ${issue.message}`).join("\n")}`);
    this.name = "ConfigurationError";
    this.issues = issues;
  }
}

type Parsed<T> = Readonly<{ value?: T; issues: readonly ConfigurationIssue[] }>;

function present(env: ConfigEnvironment, name: string): string | undefined {
  const value = env[name]?.trim();
  return value ? value : undefined;
}

const loopbackHosts = new Set(["localhost", "127.0.0.1", "[::1]", "0.0.0.0"]);

/**
 * Origin settings must be a bare http(s) origin: no credentials, path, query, or fragment (a trailing slash is
 * allowed). Consumers use the normalized origin, so nothing else in the value can reach published URLs.
 */
function parseOrigin(env: ConfigEnvironment, name: string, target: DeploymentTarget): Parsed<string> {
  const raw = present(env, name);
  if (!raw) return { issues: [] };
  let url: URL;
  try {
    url = new URL(raw);
  }
  catch {
    return { issues: [{ setting: name, message: "must be an absolute URL" }] };
  }
  const issues: ConfigurationIssue[] = [];
  if (url.protocol !== "https:" && url.protocol !== "http:") issues.push({ setting: name, message: "must use http or https" });
  if (url.username || url.password) issues.push({ setting: name, message: "must not contain a username or password" });
  if (url.pathname !== "/" || url.search || url.hash || raw.includes("?") || raw.includes("#")) {
    issues.push({ setting: name, message: "must be an origin without a path, query, or fragment" });
  }
  if (target === "production") {
    if (url.protocol !== "https:") issues.push({ setting: name, message: "must use https in production" });
    if (loopbackHosts.has(url.hostname) || url.hostname.endsWith(".localhost")) issues.push({ setting: name, message: "must not be a local address in production" });
  }
  return issues.length ? { issues } : { value: url.origin, issues };
}

/** The normalized public origin, or undefined when unset. Throws a ConfigurationError for an invalid value. */
export function readPublicSiteOrigin(env: ConfigEnvironment, target: DeploymentTarget = "local"): string | undefined {
  const { value, issues } = parseOrigin(env, "NEXT_PUBLIC_SITE_URL", target);
  if (issues.length) throw new ConfigurationError("The public site origin is invalid", issues);
  return value;
}

/** Flags compare the raw value, matching the browser's literal `=== "true"` checks: " true " stays disabled. */
function parseBoolean(env: ConfigEnvironment, name: string): Parsed<boolean> {
  const raw = env[name];
  if (raw === undefined || raw === "") return { value: false, issues: [] };
  if (raw === "true") return { value: true, issues: [] };
  if (raw === "false") return { value: false, issues: [] };
  return { value: false, issues: [{ setting: name, message: "must be \"true\" or \"false\"; other values are treated as disabled" }] };
}

export type SupabasePublicSettings = Readonly<{ url: string; publishableKey: string }>;

/** Accounts are enabled only when both public values are present; one without the other is a configuration error. */
export function readSupabasePublicSettings(env: ConfigEnvironment, target: DeploymentTarget = "local"): Parsed<SupabasePublicSettings | undefined> {
  const url = present(env, "NEXT_PUBLIC_SUPABASE_URL");
  const publishableKey = present(env, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  if (!url && !publishableKey) return { value: undefined, issues: [] };
  const issues: ConfigurationIssue[] = [];
  if (!url) issues.push({ setting: "NEXT_PUBLIC_SUPABASE_URL", message: "is required when NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is set" });
  if (!publishableKey) issues.push({ setting: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", message: "is required when NEXT_PUBLIC_SUPABASE_URL is set" });
  const origin = parseOrigin(env, "NEXT_PUBLIC_SUPABASE_URL", target);
  issues.push(...origin.issues);
  if (issues.length || !origin.value || !publishableKey) return { issues };
  return { value: { url: origin.value, publishableKey }, issues };
}

/** Prefers the current secret key and falls back to the legacy service-role key, matching the local CLI output. */
export function readSupabaseSecretKey(env: ConfigEnvironment): string | undefined {
  return present(env, "SUPABASE_SECRET_KEY") ?? present(env, "SUPABASE_SERVICE_ROLE_KEY");
}

const emailDeliverySchema = z.object({
  provider: z.literal("amazon-ses"),
  awsRegion: z.string().trim().min(1),
  fromName: z.string().trim().min(1).max(80),
  fromAddress: z.email(),
});

const emailSettingNames: Record<keyof z.infer<typeof emailDeliverySchema>, string> = {
  provider: "EMAIL_PROVIDER",
  awsRegion: "AWS_REGION",
  fromName: "EMAIL_FROM_NAME",
  fromAddress: "EMAIL_FROM_ADDRESS",
};

const emailSettingMessages: Record<keyof typeof emailSettingNames, string> = {
  provider: "must be \"amazon-ses\" when email delivery is enabled",
  awsRegion: "is required when email delivery is enabled",
  fromName: "is required when email delivery is enabled and must be at most 80 characters",
  fromAddress: "must be a valid email address when email delivery is enabled",
};

export type EmailDeliveryConfig =
  | Readonly<{ enabled: false }>
  | Readonly<{ enabled: true; siteOrigin: string } & z.infer<typeof emailDeliverySchema>>;

/** Email is fail-closed: only an exact "true" enables it, and then every provider setting must be valid. */
export function readEmailDeliveryConfig(env: ConfigEnvironment): Parsed<EmailDeliveryConfig> {
  const flag = parseBoolean(env, "EMAIL_DELIVERY_ENABLED");
  if (!flag.value) return { value: { enabled: false }, issues: flag.issues };
  const result = emailDeliverySchema.safeParse({
    provider: env.EMAIL_PROVIDER,
    awsRegion: env.AWS_REGION,
    fromName: env.EMAIL_FROM_NAME,
    fromAddress: env.EMAIL_FROM_ADDRESS,
  });
  const issues: ConfigurationIssue[] = result.success ? [] : [...new Set(result.error.issues.map((issue) => issue.path[0] as keyof typeof emailSettingNames))]
    .map((field) => ({ setting: emailSettingNames[field], message: emailSettingMessages[field] }));
  // Email links use the normalized origin; it must be HTTPS even outside production.
  const site = parseOrigin(env, "NEXT_PUBLIC_SITE_URL", "local");
  issues.push(...site.issues);
  if (!site.issues.length && !site.value?.startsWith("https://")) {
    issues.push({ setting: "NEXT_PUBLIC_SITE_URL", message: "must be an https origin when email delivery is enabled" });
  }
  if (!result.success || issues.length || !site.value) return { issues };
  return { value: { enabled: true, ...result.data, siteOrigin: site.value }, issues: [] };
}

export type JobConfig = Readonly<{
  supabaseUrl: string;
  supabaseSecretKey: string;
  email: EmailDeliveryConfig;
}>;

/**
 * Settings for administrative commands such as the notification worker. Jobs always need the Supabase URL and a
 * server secret key; email settings are validated only when delivery is enabled. Public site builds never call this.
 */
export function readJobConfig(env: ConfigEnvironment, target: DeploymentTarget = "local"): Parsed<JobConfig> {
  const issues: ConfigurationIssue[] = [];
  const supabase = parseOrigin(env, "NEXT_PUBLIC_SUPABASE_URL", target);
  const url = supabase.value;
  if (!present(env, "NEXT_PUBLIC_SUPABASE_URL")) issues.push({ setting: "NEXT_PUBLIC_SUPABASE_URL", message: "is required for administrative jobs" });
  issues.push(...supabase.issues);
  const secretKey = readSupabaseSecretKey(env);
  if (!secretKey) issues.push({ setting: "SUPABASE_SECRET_KEY", message: "is required for administrative jobs (or the legacy SUPABASE_SERVICE_ROLE_KEY)" });
  const email = readEmailDeliveryConfig(env);
  issues.push(...email.issues);
  if (email.value?.enabled && target === "production") issues.push(...parseOrigin(env, "NEXT_PUBLIC_SITE_URL", target).issues);
  if (issues.length || !url || !secretKey || !email.value) return { issues: dedupe(issues) };
  return { value: { supabaseUrl: url, supabaseSecretKey: secretKey, email: email.value }, issues: [] };
}

/** Throws a ConfigurationError naming every missing or invalid job setting. */
export function requireJobConfig(env: ConfigEnvironment, target: DeploymentTarget = "local"): JobConfig {
  const { value, issues } = readJobConfig(env, target);
  if (!value) throw new ConfigurationError("Administrative job configuration is incomplete", issues);
  return value;
}

/**
 * `web` checks the Next.js site (and anything required alongside it on the same host). `job` checks only a
 * command environment against readJobConfig: it needs no publishable key, public site setting, or social flags.
 */
export type DeploymentKind = "web" | "job";

export type ConfigurationReport = Readonly<{
  target: DeploymentTarget;
  deployment: DeploymentKind;
  features: Readonly<Record<ConfigFeature, boolean>>;
  issues: readonly ConfigurationIssue[];
}>;

export type ConfigurationCheckOptions = Readonly<{
  target: DeploymentTarget;
  /** Defaults to `web`. */
  deployment?: DeploymentKind;
  /** Features this deployment must provide; `jobs` is only ever enabled by requiring it or by enabling email. */
  require?: readonly ConfigFeature[];
}>;

/**
 * Release preflight. The public site is always on; accounts follow the Supabase public values; email follows its
 * flag and implies jobs. A disabled feature never requires its settings or secrets.
 */
export function checkConfiguration(env: ConfigEnvironment, options: ConfigurationCheckOptions): ConfigurationReport {
  const { target } = options;
  const deployment = options.deployment ?? "web";
  const required = new Set(options.require ?? []);
  if (deployment === "job") {
    const job = readJobConfig(env, target);
    const issues = [...job.issues];
    const email = readEmailDeliveryConfig(env);
    if (required.has("emailDelivery") && !email.value?.enabled && !email.issues.length) {
      issues.push({ setting: "EMAIL_DELIVERY_ENABLED", message: "must be \"true\" because this deployment requires email delivery" });
    }
    for (const feature of ["publicSite", "accounts"] as const) {
      if (required.has(feature)) issues.push({ setting: "--require", message: `cannot require ${feature} of a job deployment; check the web deployment separately` });
    }
    return {
      target,
      deployment,
      features: { publicSite: false, accounts: false, jobs: true, emailDelivery: Boolean(email.value?.enabled) },
      issues: dedupe(issues),
    };
  }
  const issues: ConfigurationIssue[] = [];

  const siteUrl = parseOrigin(env, "NEXT_PUBLIC_SITE_URL", target);
  issues.push(...siteUrl.issues);
  if (target === "production" && !present(env, "NEXT_PUBLIC_SITE_URL")) {
    issues.push({ setting: "NEXT_PUBLIC_SITE_URL", message: "is required in production" });
  }

  const supabase = readSupabasePublicSettings(env, target);
  issues.push(...supabase.issues);
  const accountsConfigured = Boolean(present(env, "NEXT_PUBLIC_SUPABASE_URL") || present(env, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"));
  const accounts = accountsConfigured || required.has("accounts");
  if (required.has("accounts") && !accountsConfigured) {
    issues.push({ setting: "NEXT_PUBLIC_SUPABASE_URL", message: "is required because this deployment requires accounts" });
    issues.push({ setting: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", message: "is required because this deployment requires accounts" });
  }
  if (accounts && target === "production" && !readSupabaseSecretKey(env)) {
    issues.push({ setting: "SUPABASE_SECRET_KEY", message: "is required for production accounts so account deletion works (or the legacy SUPABASE_SERVICE_ROLE_KEY)" });
  }
  for (const name of ["NEXT_PUBLIC_SUPABASE_GOOGLE_AUTH_ENABLED", "NEXT_PUBLIC_SUPABASE_APPLE_AUTH_ENABLED"]) {
    const flag = parseBoolean(env, name);
    issues.push(...flag.issues);
    if (flag.value && !accounts) issues.push({ setting: name, message: "requires accounts to be configured" });
  }

  const email = readEmailDeliveryConfig(env);
  const emailDelivery = Boolean(email.value?.enabled) || required.has("emailDelivery");
  if (required.has("emailDelivery") && !email.value?.enabled && !email.issues.length) {
    issues.push({ setting: "EMAIL_DELIVERY_ENABLED", message: "must be \"true\" because this deployment requires email delivery" });
  }
  const jobs = required.has("jobs") || emailDelivery;
  if (jobs) issues.push(...readJobConfig(env, target).issues);
  else issues.push(...email.issues);

  return {
    target,
    deployment,
    features: { publicSite: true, accounts, jobs, emailDelivery },
    issues: dedupe(issues),
  };
}

function dedupe(issues: readonly ConfigurationIssue[]): ConfigurationIssue[] {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const key = `${issue.setting}\u0000${issue.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
