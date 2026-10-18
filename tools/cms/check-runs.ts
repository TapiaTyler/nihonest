/** Fixed, local validation commands exposed by the editorial CMS. */
import { spawn } from "node:child_process";
import { resolve, join } from "node:path";

const maxOutputCharacters = 80_000;
const maxHistory = 10;

export type CheckStatus = "running" | "passed" | "warning" | "failed" | "canceled";

export type CheckDefinition = Readonly<{
  id: string;
  label: string;
  command: string;
  scope: "focused" | "project";
  description: string;
  /** Related-check sets run by the CMS itself after a save and before an approval; not offered in the Checks list. */
  automatic?: boolean;
}>;

/** The record and exact revision a related-check run validated. */
export type CheckTarget = Readonly<{ kind: RelatedCheckKind; id: string; revision: string }>;
export const relatedCheckKinds = ["article", "faq", "glossary-term", "residence-status", "local-guidance-supplement"] as const;
export type RelatedCheckKind = typeof relatedCheckKinds[number];

/** `findings` marks a command whose successful exit can still report review findings (the glossary check). */
export type CheckCommand = Readonly<{ executable: string; args: readonly string[]; label: string; findings?: "glossary" }>;
type Command = CheckCommand;
type InternalDefinition = CheckDefinition & Readonly<{ commands: readonly Command[] }>;

export type CheckStep = Readonly<{
  label: string;
  status: "running" | "passed" | "warning" | "failed" | "canceled" | "skipped";
  exitCode?: number | null;
  durationMs: number;
  output: string;
  outputTruncated: boolean;
}>;

export type CheckRunSnapshot = Readonly<{
  id: string;
  status: CheckStatus;
  startedAt: string;
  endedAt?: string;
  durationMs: number;
  exitCode?: number | null;
  output: string;
  outputTruncated: boolean;
  cancelRequested: boolean;
  warning?: string;
  target?: CheckTarget;
  steps: readonly CheckStep[];
}>;

export type CheckReport = Readonly<{
  definitions: readonly CheckDefinition[];
  active?: CheckRunSnapshot;
  history: readonly CheckRunSnapshot[];
}>;

export class CheckRunError extends Error {
  constructor(message: string, readonly status: 400 | 409) {
    super(message);
    this.name = "CheckRunError";
  }
}

type CommandResult = Readonly<{ exitCode: number | null; signal?: string; error?: string }>;
export type RunningCommand = Readonly<{ result: Promise<CommandResult>; kill: () => void }>;
export type CheckCommandExecutor = (command: CheckCommand, cwd: string, onOutput: (chunk: string) => void) => RunningCommand;
export type CheckRunObserver = Readonly<{
  onStart?: (run: CheckRunSnapshot) => void | Promise<void>;
  onFinish?: (run: CheckRunSnapshot) => void | Promise<void>;
  onCancel?: (run: CheckRunSnapshot) => void | Promise<void>;
}>;

function definitionsFor(root: string): readonly InternalDefinition[] {
  const node = process.execPath;
  const bootstrap = ["--require", join(root, "tools", "cms", "tsx-bootstrap.cjs"), "--import", "tsx"] as const;
  const script = (name: string, args: readonly string[] = []): Command => ({
    executable: node,
    args: [...bootstrap, join(root, "scripts", name), ...args],
    label: name.replace(/\.ts$/, ""),
  });
  const vitest = (paths: readonly string[], label = `Vitest: ${paths.join(", ")}`): Command => ({
    executable: node,
    args: [join(root, "node_modules", "vitest", "vitest.mjs"), "run", ...paths],
    label,
  });
  const audit = { ...script("audit-editorial-state.ts"), label: "Editorial records" };
  const glossary = { ...script("check-glossary-consistency.ts"), label: "Glossary wording", findings: "glossary" as const };
  // Each content kind's related checks: the editorial ledger plus the tests that load and validate that kind.
  const related = (kind: RelatedCheckKind, label: string, description: string, commands: readonly Command[]): InternalDefinition => ({
    id: `related-${kind}`, label, scope: "focused", automatic: true, description,
    command: commands.map((item) => item.label).join(", "), commands,
  });
  const checks: InternalDefinition[] = [
    {
      id: "editorial-audit", label: "Editorial audit", command: "node --require ./tools/cms/tsx-bootstrap.cjs --import tsx scripts/audit-editorial-state.ts",
      scope: "project", description: "Checks editorial review records and current editorial statuses.",
      commands: [script("audit-editorial-state.ts")],
    },
    {
      id: "glossary-check", label: "Glossary consistency", command: "node --require ./tools/cms/tsx-bootstrap.cjs --import tsx scripts/check-glossary-consistency.ts",
      scope: "project", description: "Checks Japanese glossary links and settled translation wording.",
      commands: [{ ...script("check-glossary-consistency.ts"), findings: "glossary" }],
    },
    {
      id: "local-guidance-verify", label: "Local guidance verification", command: "node --require ./tools/cms/tsx-bootstrap.cjs --import tsx scripts/local-guidance.ts verify",
      scope: "project", description: "Verifies the local-guidance batch. This command may refresh generated coverage documents.",
      commands: [script("local-guidance.ts", ["verify"])],
    },
    {
      id: "cms-tests", label: "CMS tests", command: "node node_modules/vitest/vitest.mjs run tools/cms",
      scope: "focused", description: "Runs the focused CMS test suite.",
      commands: [vitest(["tools/cms"])],
    },
    {
      id: "article-tests", label: "Article tests", command: "node node_modules/vitest/vitest.mjs run src/lib/content/articles.test.ts",
      scope: "focused", description: "Runs article loading and content validation tests.",
      commands: [vitest(["src/lib/content/articles.test.ts"])],
    },
    {
      id: "local-guidance-tests", label: "Local guidance tests", command: "node node_modules/vitest/vitest.mjs run src/data/local-guidance/locations.test.ts src/domain/geography/local-guidance.test.ts",
      scope: "focused", description: "Runs focused geography and local-guidance data tests.",
      commands: [vitest(["src/data/local-guidance/locations.test.ts", "src/domain/geography/local-guidance.test.ts"])],
    },
    {
      id: "typecheck", label: "TypeScript check", command: "node node_modules/typescript/bin/tsc --noEmit",
      scope: "project", description: "Checks the repository TypeScript project.",
      commands: [{ executable: node, args: [join(root, "node_modules", "typescript", "bin", "tsc"), "--noEmit"], label: "TypeScript" }],
    },
    {
      id: "production-build", label: "Production build and boundary check", command: "node node_modules/next/dist/bin/next build && node --require ./tools/cms/tsx-bootstrap.cjs --import tsx scripts/check-cms-build-exclusion.ts",
      scope: "project", description: "Builds production output, then checks that CMS code is excluded. Stop the dev server first because it shares .next.",
      commands: [
        { executable: node, args: [join(root, "node_modules", "next", "dist", "bin", "next"), "build"], label: "Production build" },
        script("check-cms-build-exclusion.ts"),
      ],
    },
    related("article", "Article checks", "Checks the editorial records and loads and validates every article.",
      [audit, vitest(["src/lib/content/articles.test.ts", "src/lib/editorial/editorial-catalog.test.ts"], "Article content")]),
    related("faq", "FAQ checks", "Checks the editorial records and validates the FAQ catalog and its links.",
      [audit, vitest(["src/data/faqs.test.ts", "src/data/faqs-registry.test.ts", "src/domain/faq/faq.test.ts"], "FAQ content")]),
    related("glossary-term", "Glossary checks", "Checks the editorial records, validates the glossary, and reviews Japanese glossary wording.",
      [audit, vitest(["src/data/glossary-additions.test.ts", "src/domain/glossary/glossary.test.ts"], "Glossary content"), glossary]),
    related("residence-status", "Residence status checks", "Checks the editorial records and validates residence statuses and their guidance.",
      [audit, vitest(["src/domain/residence-status/residence-status.test.ts", "src/data/structured-residence-status-guidance.test.ts"], "Residence status content")]),
    related("local-guidance-supplement", "Municipality guidance checks", "Validates the municipality guidance data and its locations.",
      [vitest(["src/data/local-guidance/locations.test.ts", "src/domain/geography/local-guidance.test.ts"], "Municipality guidance content")]),
  ];
  return checks;
}

function appendBounded(current: string, added: string): { value: string; truncated: boolean } {
  const combined = current + added;
  return combined.length > maxOutputCharacters
    ? { value: combined.slice(-maxOutputCharacters), truncated: true }
    : { value: combined, truncated: false };
}

function startProcess(command: Command, cwd: string, onOutput: (chunk: string) => void): RunningCommand {
  const child = spawn(command.executable, [...command.args], {
    cwd,
    shell: false,
    windowsHide: true,
    detached: process.platform !== "win32",
    stdio: ["ignore", "pipe", "pipe"],
  });
  let settled = false;
  const result = new Promise<CommandResult>((resolveResult) => {
    child.stdout?.on("data", (chunk: Buffer | string) => onOutput(String(chunk)));
    child.stderr?.on("data", (chunk: Buffer | string) => onOutput(String(chunk)));
    child.once("error", (error) => {
      if (settled) return;
      settled = true;
      onOutput(`${error.message}\n`);
      resolveResult({ exitCode: 1, error: error.message });
    });
    child.once("close", (code, signal) => {
      if (settled) return;
      settled = true;
      resolveResult({ exitCode: code, signal: signal ?? undefined });
    });
  });
  return {
    result,
    kill: () => {
      if (!child.pid) return;
      if (process.platform === "win32") {
        // taskkill terminates the complete child tree, including commands spawned by local-guidance verify.
        const killer = spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], { shell: false, windowsHide: true, stdio: "ignore" });
        killer.once("error", () => child.kill());
        killer.unref();
      } else {
        try { process.kill(-child.pid, "SIGTERM"); }
        catch { child.kill("SIGTERM"); }
      }
    },
  };
}

type MutableStep = { label: string; status: CheckStep["status"]; exitCode?: number | null; durationMs: number; output: string; outputTruncated: boolean };
type MutableRun = { id: string; status: CheckStatus; startedAt: string; startTime: number; endedAt?: string; durationMs: number; exitCode?: number | null; output: string; outputTruncated: boolean; steps: MutableStep[]; cancelRequested: boolean; warning?: string; target?: CheckTarget; kill?: () => void; done?: Promise<void> };

function snapshot(run: MutableRun): CheckRunSnapshot {
  return {
    id: run.id,
    status: run.status,
    startedAt: run.startedAt,
    ...(run.endedAt ? { endedAt: run.endedAt } : {}),
    durationMs: run.status === "running" ? Math.max(0, Date.now() - run.startTime) : run.durationMs,
    ...(run.exitCode === undefined ? {} : { exitCode: run.exitCode }),
    output: run.output,
    outputTruncated: run.outputTruncated,
    cancelRequested: run.cancelRequested,
    ...(run.warning ? { warning: run.warning } : {}),
    ...(run.target ? { target: run.target } : {}),
    steps: run.steps.map((step) => ({ ...step })),
  };
}

export function createCheckRunner(projectRoot: string, executor: CheckCommandExecutor = startProcess, observer: CheckRunObserver = {}) {
  const root = resolve(projectRoot);
  const definitions = definitionsFor(root);
  const byId = new Map(definitions.map((definition) => [definition.id, definition]));
  let active: MutableRun | undefined;
  const history: CheckRunSnapshot[] = [];
  let disposed = false;

  const notify = (callback: ((run: CheckRunSnapshot) => void | Promise<void>) | undefined, run: MutableRun) => {
    if (!callback) return;
    try {
      void Promise.resolve(callback(snapshot(run))).catch(() => undefined);
    } catch {
      // Observer integrations must never interfere with validation checks.
    }
  };

  const report = (): CheckReport => ({
    definitions: definitions.map(({ id, label, command, scope, description, automatic }) => ({ id, label, command, scope, description, ...(automatic ? { automatic } : {}) })),
    ...(active ? { active: snapshot(active) } : {}),
    history: history.map((run) => ({ ...run, steps: run.steps.map((step) => ({ ...step })) })),
  });

  const finish = (run: MutableRun, status: CheckStatus) => {
    run.status = status;
    run.endedAt = new Date().toISOString();
    run.durationMs = Math.max(0, Date.now() - run.startTime);
    run.kill = undefined;
  };

  const execute = async (run: MutableRun, definition: InternalDefinition) => {
    let finalStatus: CheckStatus = "passed";
    for (const command of definition.commands) {
      if (run.cancelRequested) { finalStatus = "canceled"; break; }
      const step: MutableStep = { label: command.label, status: "running", durationMs: 0, output: "", outputTruncated: false };
      run.steps.push(step);
      const stepStart = Date.now();
      let running: RunningCommand;
      try {
        running = executor(command, root, (chunk) => {
          const appended = appendBounded(run.output, chunk);
          run.output = appended.value;
          run.outputTruncated ||= appended.truncated;
          const stepAppended = appendBounded(step.output, chunk);
          step.output = stepAppended.value;
          step.outputTruncated ||= stepAppended.truncated;
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not start the validation command.";
        const stepAppended = appendBounded(step.output, `${message}\n`);
        const runAppended = appendBounded(run.output, `${message}\n`);
        step.output = stepAppended.value;
        run.output = runAppended.value;
        run.outputTruncated ||= runAppended.truncated;
        step.outputTruncated ||= stepAppended.truncated;
        step.status = "failed";
        step.exitCode = 1;
        step.durationMs = Date.now() - stepStart;
        finalStatus = "failed";
        run.exitCode = 1;
        break;
      }
      run.kill = running.kill;
      let result: CommandResult;
      try {
        result = await running.result;
      } catch (error) {
        result = { exitCode: 1, error: error instanceof Error ? error.message : "The validation process failed unexpectedly." };
      }
      step.durationMs = Date.now() - stepStart;
      step.exitCode = result.exitCode;
      if (run.cancelRequested) {
        step.status = "canceled";
        finalStatus = "canceled";
        run.exitCode = null;
        break;
      }
      if (result.error) {
        const message = `${result.error}\n`;
        const stepAppended = appendBounded(step.output, message);
        const runAppended = appendBounded(run.output, message);
        step.output = stepAppended.value;
        run.output = runAppended.value;
        step.outputTruncated ||= stepAppended.truncated;
        run.outputTruncated ||= runAppended.truncated;
      }
      if (result.exitCode !== 0) {
        step.status = "failed";
        finalStatus = "failed";
        run.exitCode = result.exitCode;
        break;
      }
      step.status = "passed";
      run.exitCode = 0;
      // The glossary check exits successfully even with findings; its summary line decides between passed and warning.
      if (command.findings === "glossary") {
        const findingsCount = /\b(\d+)\s+locations?\s+have findings\./i.exec(step.output)?.[1];
        const locations = findingsCount === undefined ? undefined : Number(findingsCount);
        if (!Number.isSafeInteger(locations) || locations === undefined) {
          step.status = "warning";
          run.warning = "The glossary check exited successfully, but its findings summary could not be parsed.";
        } else if (locations > 0) {
          step.status = "warning";
          run.warning = `The glossary check reported ${locations} location${locations === 1 ? "" : "s"} with findings.`;
        }
        if (step.status === "warning") finalStatus = "warning";
      }
    }
    if (run.cancelRequested) finalStatus = "canceled";
    if (finalStatus !== "passed") {
      for (const step of run.steps) {
        if (step.status === "running") step.status = finalStatus;
      }
    }
    finish(run, finalStatus);
    notify(observer.onFinish, run);
  };

  return {
    definitions: report().definitions,
    report,
    start(id: string, target?: CheckTarget): CheckReport {
      if (disposed) throw new CheckRunError("The CMS is shutting down and cannot start another validation check.", 409);
      if (active?.status === "running") throw new CheckRunError("A validation check is already running.", 409);
      const definition = byId.get(id);
      if (!definition) throw new CheckRunError("Choose a validation check from the list.", 400);
      if (target && definition.id !== `related-${target.kind}`) throw new CheckRunError("Related checks must match the record's kind.", 400);
      if (active) {
        history.unshift(snapshot(active));
        history.splice(maxHistory);
      }
      const now = Date.now();
      active = { id, status: "running", startedAt: new Date(now).toISOString(), startTime: now, durationMs: 0, output: "", outputTruncated: false, steps: [], cancelRequested: false, ...(target ? { target } : {}) };
      notify(observer.onStart, active);
      active.done = execute(active, definition);
      return report();
    },
    /** Whether this session's related checks passed (findings allowed) for the exact record revision. */
    relatedPassed(target: CheckTarget): boolean {
      const runs = [...(active ? [snapshot(active)] : []), ...history];
      return runs.some((run) => run.target?.kind === target.kind && run.target.id === target.id && run.target.revision === target.revision
        && (run.status === "passed" || run.status === "warning"));
    },
    cancel(): CheckReport {
      if (active?.status !== "running") throw new CheckRunError("There is no validation check running.", 409);
      if (active.cancelRequested) return report();
      active.cancelRequested = true;
      active.kill?.();
      notify(observer.onCancel, active);
      return report();
    },
    async dispose(): Promise<void> {
      disposed = true;
      const run = active;
      if (!run || run.status !== "running") return;
      if (!run.cancelRequested) {
        run.cancelRequested = true;
        run.kill?.();
        notify(observer.onCancel, run);
      }
      await run.done;
    },
  };
}
