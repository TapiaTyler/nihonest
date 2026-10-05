/**
 * Deployment configuration preflight. Validates the settings each enabled feature needs and names problems
 * without printing values. Reads the process environment; `--env-file` layers a file underneath it.
 *
 *   npm run config:check -- --target production --require accounts
 *   npm run config:check -- --deployment job --target production --env-file .env.worker
 *
 * Exit status is 1 when any issue is found.
 */
import { readFile } from "node:fs/promises";
import { parseEnv, parseArgs } from "node:util";
import {
  checkConfiguration,
  settingDefinitions,
  type ConfigEnvironment,
  type ConfigFeature,
  type DeploymentKind,
  type DeploymentTarget,
} from "@/lib/config/deployment-config";

const features: readonly ConfigFeature[] = ["publicSite", "accounts", "jobs", "emailDelivery"];

function parseTarget(value: string): DeploymentTarget {
  if (value === "local" || value === "production") return value;
  throw new Error(`--target must be "local" or "production".`);
}

function parseDeployment(value: string): DeploymentKind {
  if (value === "web" || value === "job") return value;
  throw new Error(`--deployment must be "web" or "job".`);
}

function parseRequired(values: readonly string[]): ConfigFeature[] {
  return values.flatMap((value) => value.split(",")).map((value) => value.trim()).filter(Boolean).map((value) => {
    if (!features.includes(value as ConfigFeature)) throw new Error(`--require accepts ${features.join(", ")}; received "${value}".`);
    return value as ConfigFeature;
  });
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      target: { type: "string", default: "local" },
      deployment: { type: "string", default: "web" },
      require: { type: "string", multiple: true, default: [] },
      "env-file": { type: "string" },
    },
  });
  const target = parseTarget(values.target);
  const envFile = values["env-file"];
  const fileEnvironment = envFile ? parseEnv(await readFile(envFile, "utf8")) : {};
  const env: ConfigEnvironment = { ...fileEnvironment, ...process.env };

  const report = checkConfiguration(env, { target, deployment: parseDeployment(values.deployment), require: parseRequired(values.require) });
  const enabled = features.filter((feature) => report.features[feature]);
  console.log(`Target: ${report.target}; deployment: ${report.deployment}`);
  console.log(`Enabled features: ${enabled.join(", ")}`);
  const publicBuild = settingDefinitions.filter((setting) => setting.exposure === "public-build" && enabled.includes(setting.feature));
  if (publicBuild.length) console.log(`Build-time settings (inlined by next build): ${publicBuild.map((setting) => setting.name).join(", ")}`);

  if (report.issues.length) {
    console.error(`\n${report.issues.length} configuration issue(s):`);
    for (const issue of report.issues) console.error(`- ${issue.setting}: ${issue.message}`);
    process.exitCode = 1;
    return;
  }
  console.log("Configuration is valid for the enabled features.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
