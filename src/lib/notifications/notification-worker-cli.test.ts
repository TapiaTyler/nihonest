// @vitest-environment node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { describe, expect, it, vi } from "vitest";
import { ConfigurationError } from "@/lib/config/deployment-config";
import type { NotificationWorkerReport } from "./notification-worker";

// Execute the committed entry script with explicit imports/process bindings. No global process
// mutation, SDK construction, environment inheritance or live service is needed for output tests.
const entry = ts.transpileModule(readFileSync(resolve("scripts/notification-worker.ts"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function fixture(args: string[] = []) {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const env = { PRIVATE_CANARY: "private-fixture-value" };
  const readEnvironment = vi.fn(() => env);
  const execute = vi.fn<() => Promise<NotificationWorkerReport>>();
  const processBinding = {
    argv: ["fixture-node", "notification-worker.ts", ...args],
    get env() { return readEnvironment(); },
    exitCode: 0,
    stdout: { write(value: string) { stdout.push(value); return true; } },
    stderr: { write(value: string) { stderr.push(value); return true; } },
  };
  const run = () => runInNewContext(entry, {
    exports: {}, process: processBinding,
    require(specifier: string) {
      if (specifier === "@/lib/config/deployment-config") return { ConfigurationError };
      if (specifier === "@/lib/notifications/notification-worker-command") return { executeNotificationWorkerJob: execute };
      throw new Error(`Unexpected entry import: ${specifier}`);
    },
  });
  return { stdout, stderr, env, readEnvironment, execute, processBinding, run };
}

function report(status: NotificationWorkerReport["status"], exitCode: 0 | 1): NotificationWorkerReport {
  return {
    status, exitCode, remindersFulfilled: 2, criticalEventsGenerated: 3, deliveriesPrepared: 4,
    claimed: 0, sent: 0, suppressed: 0, failed: 0, infrastructureErrors: exitCode,
    expiredClaims: 0, exhaustedFailures: 0, exhaustedExpiredClaims: 0,
  };
}

describe("notification worker entry output", () => {
  it("prints help without reading environment or invoking a job", () => {
    const f = fixture(["--help"]);
    f.run();
    expect(f.stdout.join("")).toContain("Usage: npm run notification:once\n");
    expect(f.stderr).toEqual([]);
    expect(f.processBinding.exitCode).toBe(0);
    expect(f.readEnvironment).not.toHaveBeenCalled();
    expect(f.execute).not.toHaveBeenCalled();
  });

  it.each([
    { args: ["private-argument-canary"] }, { args: ["--help", "private-argument-canary"] },
  ])("rejects arguments without echoing them or reading settings: $args", ({ args }) => {
    const f = fixture(args);
    f.run();
    expect(f.stdout).toEqual([]);
    expect(f.stderr).toEqual(["notification-worker: unexpected arguments; use --help\n"]);
    expect(f.processBinding.exitCode).toBe(1);
    expect(f.readEnvironment).not.toHaveBeenCalled();
    expect(f.execute).not.toHaveBeenCalled();
  });

  it.each([
    ["completed", 0], ["delivery-disabled", 0], ["failed", 1],
  ] as const)("writes exactly one aggregate report and exit status for %s", async (status, exitCode) => {
    const f = fixture();
    const expected = report(status, exitCode);
    f.execute.mockResolvedValue(expected);
    f.run();
    await vi.waitFor(() => expect(f.stdout).toHaveLength(1));
    expect(f.stdout).toEqual([`${JSON.stringify(expected)}\n`]);
    expect(f.stderr).toEqual([]);
    expect(f.processBinding.exitCode).toBe(exitCode);
    expect(f.execute).toHaveBeenCalledExactlyOnceWith(f.env);
    expect(f.stdout.join("")).not.toContain(f.env.PRIVATE_CANARY);
  });

  it("reports deduplicated configuration setting names without messages or values", async () => {
    const f = fixture();
    f.execute.mockRejectedValue(new ConfigurationError("private-context-canary", [
      { setting: "SUPABASE_SECRET_KEY", message: "private-secret-canary" },
      { setting: "SUPABASE_SECRET_KEY", message: "private-diagnostic-canary" },
      { setting: "NEXT_PUBLIC_SUPABASE_URL", message: "private-url-canary" },
    ]));
    f.run();
    await vi.waitFor(() => expect(f.stdout).toHaveLength(1));
    expect(f.stdout).toEqual([`${JSON.stringify({ status: "configuration-error", exitCode: 1,
      settings: ["SUPABASE_SECRET_KEY", "NEXT_PUBLIC_SUPABASE_URL"] })}\n`]);
    expect(f.stderr).toEqual([]);
    expect(f.processBinding.exitCode).toBe(1);
  });

  it("hides unexpected startup errors and their causes", async () => {
    const f = fixture();
    f.execute.mockRejectedValue(new Error("private-sdk-canary", { cause: new Error("private-sql-canary") }));
    f.run();
    await vi.waitFor(() => expect(f.stdout).toHaveLength(1));
    expect(f.stdout).toEqual(['{"status":"startup-failed","exitCode":1}\n']);
    expect(f.stderr).toEqual([]);
    expect(f.processBinding.exitCode).toBe(1);
  });
});
