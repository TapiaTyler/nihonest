import { execFileSync } from "node:child_process";
import { runAcceptancePreflight } from "@/lib/notifications/worker-acceptance-preflight";

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--help") {
    process.stdout.write("Usage: node --import ./scripts/notification-worker-register.mjs --import tsx scripts/acceptance/notification-worker-auth-preflight.ts --source-ref <40-character HEAD> --supabase-url <loopback origin>\nRead-only dedicated-stack preflight. Set J1_ACCEPTANCE_SECRET_KEY explicitly; no normal deployment settings are inherited.\n");
    return;
  }
  if (args.length !== 4 || args[0] !== "--source-ref" || args[2] !== "--supabase-url") {
    throw new Error("Invalid arguments.");
  }
  const currentRef = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  const dirty = execFileSync("git", ["status", "--porcelain", "--untracked-files=normal"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (dirty.trim()) throw new Error("Acceptance requires a clean checkout.");
  const report = await runAcceptancePreflight({
    sourceRef: args[1], currentRef, supabaseUrl: args[3], secretKey: process.env.J1_ACCEPTANCE_SECRET_KEY,
  });
  process.stdout.write(`${JSON.stringify(report)}\n`);
}

void main().catch(() => {
  // SDK/URL/Git errors can contain private values. The report deliberately has no raw diagnostics.
  process.stdout.write(`${JSON.stringify({ status: "preflight-failed", exitCode: 1 })}\n`);
  process.exitCode = 1;
});
