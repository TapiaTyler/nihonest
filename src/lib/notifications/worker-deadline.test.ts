// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createClaimLeaseBudget, runWithinWorkerDeadline } from "./worker-deadline";

describe("worker I/O deadlines", () => {
  it("aborts and returns on time even if the operation ignores cancellation", async () => {
    let passedSignal: AbortSignal | undefined;
    const operation = runWithinWorkerDeadline((signal) => {
      passedSignal = signal;
      return new Promise<never>(() => undefined);
    }, 10);
    await expect(operation).rejects.toThrow("The worker operation exceeded its deadline.");
    expect(passedSignal?.aborted).toBe(true);
  });

  it("propagates a parent deadline into an in-flight operation", async () => {
    const parent = new AbortController();
    const operation = runWithinWorkerDeadline(() => new Promise<never>(() => undefined), 1_000, parent.signal);
    await Promise.resolve();
    parent.abort();
    await expect(operation).rejects.toThrow("deadline");
  });

  it("shortens a claim budget conservatively and clears its timer", () => {
    vi.useFakeTimers();
    try {
      const budget = createClaimLeaseBudget(30);
      expect(budget.remainingMs()).toBe(29_000);
      budget.shortenToRemaining(100);
      vi.advanceTimersByTime(100);
      expect(budget.signal.aborted).toBe(true);
      budget.dispose();
    } finally {
      vi.useRealTimers();
    }
  });
});
