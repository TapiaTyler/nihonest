import { ConfigurationError, type DeploymentTarget } from "@/lib/config/deployment-config";
import { executeNotificationWorkerJob } from "@/lib/notifications/notification-worker-command";

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--help") {
    process.stdout.write("Usage: npm run notification:once [-- --target production|local]\nRuns one bounded pass; production is the default. Local requires loopback Supabase and disabled email.\n");
    return;
  }
  let target: DeploymentTarget = "production";
  if (args.length === 2 && args[0] === "--target" && (args[1] === "production" || args[1] === "local")) {
    target = args[1];
  } else if (args.length) {
    process.stderr.write("notification-worker: unexpected arguments; use --help\n");
    process.exitCode = 1;
    return;
  }
  try {
    const report = await executeNotificationWorkerJob(process.env, target);
    process.stdout.write(`${JSON.stringify(report)}\n`);
    process.exitCode = report.exitCode;
  } catch (error) {
    // Never print environment values, SDK errors, recipient data, SQL or provider responses.
    const status = error instanceof ConfigurationError ? "configuration-error" : "startup-failed";
    const settings = error instanceof ConfigurationError ? [...new Set(error.issues.map((issue) => issue.setting))] : undefined;
    process.stdout.write(`${JSON.stringify({ status, exitCode: 1, ...(settings ? { settings } : {}) })}\n`);
    process.exitCode = 1;
  }
}

void main().catch(() => {
  process.stdout.write(`${JSON.stringify({ status: "startup-failed", exitCode: 1 })}\n`);
  process.exitCode = 1;
});
