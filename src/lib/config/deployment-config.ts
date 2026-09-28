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
  if (target === "production") {
    if (url.protocol !== "https:") issues.push({ setting: name, message: "must use https in production" });
    if (loopbackHosts.has(url.hostname) || url.hostname.endsWith(".localhost")) issues.push({ setting: name, message: "must not be a local address in production" });
  }
  return { value: url.origin, issues };
}

function parseBoolean(env: ConfigEnvironment, name: string): Parsed<boolean> {
  const raw = env[name]?.trim();
  if (!raw) return { value: false, issues: [] };
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
  if (issues.length || !url || !publishableKey) return { issues };
  return { value: { url, publishableKey }, issues };
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
  siteOrigin: z.url().refine((value) => value.startsWith("https://")),
});

const emailSettingNames: Record<keyof z.infer<typeof emailDeliverySchema>, string> = {
  provider: "EMAIL_PROVIDER",
  awsRegion: "AWS_REGION",
  fromName: "EMAIL_FROM_NAME",
  fromAddress: "EMAIL_FROM_ADDRESS",
  siteOrigin: "NEXT_PUBLIC_SITE_URL",
};

const emailSettingMessages: Record<keyof typeof emailSettingNames, string> = {
  provider: "must be \"amazon-ses\" when email delivery is enabled",
  awsRegion: "is required when email delivery is enabled",
  fromName: "is required when email delivery is enabled and must be at most 80 characters",
  fromAddress: "must be a valid email address when email delivery is enabled",
  siteOrigin: "must be an https URL when email delivery is enabled",
};

export type EmailDeliveryConfig =
  | Readonly<{ enabled: false }>
  | Readonly<{ enabled: true } & z.infer<typeof emailDeliverySchema>>;

/** Email is fail-closed: only an exact "true" enables it, and then every provider setting must be valid. */
export function readEmailDeliveryConfig(env: ConfigEnvironment): Parsed<EmailDeliveryConfig> {
  const flag = parseBoolean(env, "EMAIL_DELIVERY_ENABLED");
  if (!flag.value) return { value: { enabled: false }, issues: flag.issues };
  const result = emailDeliverySchema.safeParse({
    provider: env.EMAIL_PROVIDER,
    awsRegion: env.AWS_REGION,
    fromName: env.EMAIL_FROM_NAME,
    fromAddress: env.EMAIL_FROM_ADDRESS,
    siteOrigin: env.NEXT_PUBLIC_SITE_URL,
  });
  if (result.success) return { value: { enabled: true, ...result.data }, issues: [] };
  const fields = new Set(result.error.issues.map((issue) => issue.path[0] as keyof typeof emailSettingNames));
  return { issues: [...fields].map((field) => ({ setting: emailSettingNames[field], message: emailSettingMessages[field] })) };
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
  const url = present(env, "NEXT_PUBLIC_SUPABASE_URL");
  if (!url) issues.push({ setting: "NEXT_PUBLIC_SUPABASE_URL", message: "is required for administrative jobs" });
  else issues.push(...parseOrigin(env, "NEXT_PUBLIC_SUPABASE_URL", target).issues);
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

export type ConfigurationReport = Readonly<{
  target: DeploymentTarget;
  features: Readonly<Record<ConfigFeature, boolean>>;
  issues: readonly ConfigurationIssue[];
}>;

export type ConfigurationCheckOptions = Readonly<{
  target: DeploymentTarget;
  /** Features this deployment must provide; `jobs` is only ever enabled by requiring it or by enabling email. */
  require?: readonly ConfigFeature[];
}>;

/**
 * Release preflight. The public site is always on; accounts follow the Supabase public values; email follows its
 * flag and implies jobs. A disabled feature never requires its settings or secrets.
 */
export function checkConfiguration(env: ConfigEnvironment, options: ConfigurationCheckOptions): ConfigurationReport {
  const { target } = options;
  const required = new Set(options.require ?? []);
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
