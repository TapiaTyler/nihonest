import { ConfigurationError } from "@/lib/config/deployment-config";
import { executeNotificationWorkerJob } from "@/lib/notifications/notification-worker-command";

async function main() {
  if (process.argv.length !== 2) {
    if (process.argv.length === 3 && process.argv[2] === "--help") {
      process.stdout.write("Usage: npm run notification:once\nRuns one bounded notification pass using job-only environment settings.\n");
      return;
    }
    process.stderr.write("notification-worker: unexpected arguments; use --help\n");
    process.exitCode = 1;
    return;
  }
  try {
    const report = await executeNotificationWorkerJob(process.env);
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
