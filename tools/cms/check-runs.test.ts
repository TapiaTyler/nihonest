// @vitest-environment node
import { basename, join, sep } from "node:path";
import { mkdtemp, realpath, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { CheckRunError, createCheckRunner, type CheckCommand, type CheckCommandExecutor } from "./check-runs";

async function withFixture(run: (root: string) => Promise<void>) {
  const root = await realpath(await mkdtemp(join(tmpdir(), "nihonest-cms-checks-")));
  try {
    await run(root);
  } finally {
    if (!root.startsWith(`${await realpath(tmpdir())}${sep}`) || !basename(root).startsWith("nihonest-cms-checks-")) {
      throw new Error("Refusing to remove a fixture outside the temporary directory.");
    }
    await rm(root, { recursive: true, force: true });
  }
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

async function settle() {
  await new Promise<void>((resolve) => setImmediate(resolve));
}

function executorFor(results: Array<{ exitCode: number | null; output?: string }> = []) {
  const commands: CheckCommand[] = [];
  const executor: CheckCommandExecutor = (command, _cwd, onOutput) => {
    commands.push(command);
    const outcome = results.shift() ?? { exitCode: 0 };
    if (outcome.output) onOutput(outcome.output);
    return { result: Promise.resolve({ exitCode: outcome.exitCode }), kill: () => undefined };
  };
  return { executor, commands };
}

describe("CMS validation check runner", () => {
  it("exposes only fixed named checks and rejects an unlisted ID", async () => {
    await withFixture(async (root) => {
      const runner = createCheckRunner(root, executorFor().executor);
      const report = runner.report();
      expect(report.definitions.map(({ id }) => id)).toEqual([
        "editorial-audit", "glossary-check", "local-guidance-verify", "cms-tests", "article-tests",
        "local-guidance-tests", "typecheck", "production-build",
        "related-article", "related-faq", "related-glossary-term", "related-residence-status", "related-local-guidance-supplement",
      ]);
      expect(report.definitions.filter(({ automatic }) => automatic).map(({ id }) => id)).toHaveLength(5);
      expect(report.definitions.find(({ id }) => id === "local-guidance-verify")).toMatchObject({
        scope: "project", description: expect.stringMatching(/generated coverage documents/i),
      });
      expect(report.definitions.find(({ id }) => id === "production-build")).toMatchObject({
        scope: "project", description: expect.stringMatching(/stop the dev server/i),
      });
      expect(() => runner.start("../../scripts/anything.ts")).toThrowError(CheckRunError);
      try { runner.start("not-allowed"); } catch (error) { expect(error).toMatchObject({ status: 400 }); }
    });
  });

  it("reports bounded command output, prevents concurrent runs, and retains completed history", async () => {
    await withFixture(async (root) => {
      const pending = deferred<{ exitCode: number | null }>();
      let killCount = 0;
      const commands: CheckCommand[] = [];
      let executions = 0;
      const runner = createCheckRunner(root, (command, _cwd, onOutput) => {
        commands.push(command);
        executions += 1;
        if (executions === 1) return { result: pending.promise, kill: () => { killCount += 1; } };
        onOutput("z".repeat(90_000));
        return { result: Promise.resolve({ exitCode: 0 }), kill: () => undefined };
      });
      const started = runner.start("typecheck");
      expect(started.active?.status).toBe("running");
      expect(started.active?.durationMs).toBeGreaterThanOrEqual(0);
      expect(() => runner.start("cms-tests")).toThrowError(CheckRunError);
      expect(() => runner.start("cms-tests")).toThrow(/already running/i);
      expect(killCount).toBe(0);
      // Resolve normally; the executor is isolated and never launches TypeScript.
      pending.resolve({ exitCode: 0 });
      await settle();
      expect(runner.report().active).toMatchObject({ status: "passed", exitCode: 0 });

      runner.start("article-tests");
      await settle();
      expect(commands[1]?.args.slice(-2)).toEqual(["run", "src/lib/content/articles.test.ts"]);
      expect(runner.report().active?.output).toHaveLength(80_000);
      expect(runner.report().active?.outputTruncated).toBe(true);
      expect(runner.report().active?.steps[0]?.outputTruncated).toBe(true);
      expect(runner.report().history).toHaveLength(1);
      expect(runner.report().history[0]?.status).toBe("passed");
    });
  });

  it("requires both production build stages to pass", async () => {
    await withFixture(async (root) => {
      const failedBuild = executorFor([{ exitCode: 1, output: "build failed" }]);
      const runner = createCheckRunner(root, failedBuild.executor);
      runner.start("production-build");
      await settle();
      expect(runner.report().active).toMatchObject({ status: "failed", exitCode: 1, steps: [{ status: "failed" }] });
      expect(failedBuild.commands).toHaveLength(1);

      const failedBoundary = executorFor([{ exitCode: 0 }, { exitCode: 2, output: "CMS marker found" }]);
      const boundaryRunner = createCheckRunner(root, failedBoundary.executor);
      boundaryRunner.start("production-build");
      await settle();
      await settle();
      expect(boundaryRunner.report().active).toMatchObject({ status: "failed", exitCode: 2, steps: [{ status: "passed" }, { status: "failed" }] });

      const passedBuild = executorFor([{ exitCode: 0 }, { exitCode: 0 }]);
      const secondRunner = createCheckRunner(root, passedBuild.executor);
      secondRunner.start("production-build");
      await settle();
      await settle();
      expect(passedBuild.commands.map(({ label }) => label)).toEqual(["Production build", "check-cms-build-exclusion"]);
      expect(secondRunner.report().active).toMatchObject({ status: "passed", exitCode: 0, steps: [{ status: "passed" }, { status: "passed" }] });
    });
  });

  it("marks output truncation without changing a passing check's scope", async () => {
    await withFixture(async (root) => {
      const runner = createCheckRunner(root, executorFor([{ exitCode: 0, output: "x".repeat(90_000) }]).executor);
      runner.start("cms-tests");
      await settle();
      const report = runner.report();
      expect(report.active).toMatchObject({ status: "passed", outputTruncated: true });
      expect(report.active?.output.length).toBeLessThanOrEqual(80_000);
      expect(report.definitions.find((definition) => definition.id === "cms-tests")?.scope).toBe("focused");
    });
  });

  it("reports glossary findings or an unreadable summary as a warning", async () => {
    await withFixture(async (root) => {
      const findings = executorFor([{ exitCode: 0, output: "Checked 300 articles and the Japanese catalogs; 2 locations have findings.\n" }]);
      const findingsRunner = createCheckRunner(root, findings.executor);
      findingsRunner.start("glossary-check");
      await settle();
      expect(findingsRunner.report().active).toMatchObject({
        status: "warning", exitCode: 0, warning: "The glossary check reported 2 locations with findings.",
        steps: [{ status: "warning" }],
      });

      const clean = createCheckRunner(root, executorFor([{ exitCode: 0, output: "Checked 300 articles and the Japanese catalogs; 0 locations have findings.\n" }]).executor);
      clean.start("glossary-check");
      await settle();
      expect(clean.report().active).toMatchObject({ status: "passed", exitCode: 0 });

      const unparseable = createCheckRunner(root, executorFor([{ exitCode: 0, output: "Check finished successfully.\n" }]).executor);
      unparseable.start("glossary-check");
      await settle();
      expect(unparseable.report().active).toMatchObject({
        status: "warning", exitCode: 0,
        warning: "The glossary check exited successfully, but its findings summary could not be parsed.",
      });
    });
  });

  it("marks cancellation distinctly and prevents later pipeline stages", async () => {
    await withFixture(async (root) => {
      const pending = deferred<{ exitCode: number | null }>();
      let killed = false;
      const commands: CheckCommand[] = [];
      const runner = createCheckRunner(root, (command) => {
        commands.push(command);
        return { result: pending.promise, kill: () => { killed = true; } };
      });
      runner.start("production-build");
      expect(runner.cancel().active).toMatchObject({ status: "running", cancelRequested: true });
      expect(killed).toBe(true);
      pending.resolve({ exitCode: null });
      await settle();
      expect(runner.report().active).toMatchObject({ status: "canceled", exitCode: null, steps: [{ status: "canceled" }] });
      expect(commands).toHaveLength(1);
      expect(() => runner.cancel()).toThrowError(CheckRunError);
    });
  });

  it("notifies observers for starts and every completed status without affecting checks", async () => {
    await withFixture(async (root) => {
      const events: Array<{ type: string; status: string; cancelRequested: boolean }> = [];
      const observe = (type: string) => (run: { status: string; cancelRequested: boolean }) => {
        events.push({ type, status: run.status, cancelRequested: run.cancelRequested });
      };
      const observer = {
        onStart: observe("start"),
        onCancel: observe("cancel"),
        onFinish: observe("finish"),
      };

      const passed = createCheckRunner(root, executorFor([{ exitCode: 0 }]).executor, observer);
      passed.start("cms-tests");
      await settle();
      expect(passed.report().active?.status).toBe("passed");

      const warning = createCheckRunner(root, executorFor([{ exitCode: 0, output: "Checked 10 articles; 1 location has findings.\n" }]).executor, observer);
      warning.start("glossary-check");
      await settle();
      expect(warning.report().active?.status).toBe("warning");

      const failed = createCheckRunner(root, executorFor([{ exitCode: 2 }]).executor, observer);
      failed.start("cms-tests");
      await settle();
      expect(failed.report().active?.status).toBe("failed");

      const pending = deferred<{ exitCode: number | null }>();
      const canceled = createCheckRunner(root, () => ({ result: pending.promise, kill: () => undefined }), observer);
      canceled.start("cms-tests");
      canceled.cancel();
      pending.resolve({ exitCode: null });
      await settle();
      expect(canceled.report().active?.status).toBe("canceled");

      expect(events).toEqual([
        { type: "start", status: "running", cancelRequested: false },
        { type: "finish", status: "passed", cancelRequested: false },
        { type: "start", status: "running", cancelRequested: false },
        { type: "finish", status: "warning", cancelRequested: false },
        { type: "start", status: "running", cancelRequested: false },
        { type: "finish", status: "failed", cancelRequested: false },
        { type: "start", status: "running", cancelRequested: false },
        { type: "cancel", status: "running", cancelRequested: true },
        { type: "finish", status: "canceled", cancelRequested: true },
      ]);
    });
  });

  it("ignores synchronous and asynchronous observer failures", async () => {
    await withFixture(async (root) => {
      const runner = createCheckRunner(root, executorFor([{ exitCode: 0 }]).executor, {
        onStart: () => { throw new Error("observer failed"); },
        onFinish: async () => { throw new Error("observer failed asynchronously"); },
      });
      runner.start("cms-tests");
      await settle();
      expect(runner.report().active?.status).toBe("passed");
    });
  });

  it("disposes an active check, waits for cancellation, and rejects later starts", async () => {
    await withFixture(async (root) => {
      const pending = deferred<{ exitCode: number | null }>();
      let killed = false;
      const runner = createCheckRunner(root, () => ({
        result: pending.promise,
        kill: () => { killed = true; },
      }));
      runner.start("article-tests");
      const disposal = runner.dispose();
      expect(killed).toBe(true);
      expect(runner.report().active).toMatchObject({ status: "running", cancelRequested: true });
      expect(() => runner.start("cms-tests")).toThrow(/shutting down/i);
      pending.resolve({ exitCode: null });
      await disposal;
      expect(runner.report().active).toMatchObject({ status: "canceled", exitCode: null });
      await expect(runner.dispose()).resolves.toBeUndefined();
    });
  });

  it("keeps commands rooted in the project and uses the CMS tsx bootstrap", async () => {
    await withFixture(async (root) => {
      const { executor, commands } = executorFor();
      const runner = createCheckRunner(root, executor);
      runner.start("local-guidance-verify");
      await settle();
      const command = commands[0]!;
      expect(command.executable).toBe(process.execPath);
      expect(command.args).toContain(join(root, "tools", "cms", "tsx-bootstrap.cjs"));
      expect(command.args).toContain(join(root, "scripts", "local-guidance.ts"));
      expect(command.args.slice(-1)).toEqual(["verify"]);
    });
  });
});
