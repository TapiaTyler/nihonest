import { z } from "zod";

/** Deadline for one asynchronous operation; abort is propagated and a non-cooperating promise cannot stall the pass. */
export async function runWithinWorkerDeadline<T>(
  operation: (signal: AbortSignal) => Promise<T>, timeoutMs: number, parent?: AbortSignal,
): Promise<T> {
  z.number().int().min(1).max(30_000).parse(timeoutMs);
  const controller = new AbortController();
  if (parent?.aborted) controller.abort();
  const onParentAbort = () => controller.abort();
  parent?.addEventListener("abort", onParentAbort, { once: true });
  let timer: ReturnType<typeof setTimeout> | undefined;
  const aborted = new Promise<never>((_resolve, reject) => {
    const fail = () => reject(new Error("The worker operation exceeded its deadline."));
    controller.signal.addEventListener("abort", fail, { once: true });
    if (controller.signal.aborted) fail();
  });
  try {
    timer = setTimeout(() => controller.abort(), timeoutMs);
    return await Promise.race([
      Promise.resolve().then(() => {
        if (controller.signal.aborted) throw new Error("The worker operation exceeded its deadline.");
        return operation(controller.signal);
      }),
      aborted,
    ]);
  } finally {
    clearTimeout(timer);
    parent?.removeEventListener("abort", onParentAbort);
  }
}

/** Starts before a claim RPC: its lease may begin before the response reaches the worker. */
export function createClaimLeaseBudget(leaseSeconds: number, reserveMs = 1_000) {
  const controller = new AbortController();
  const started = performance.now();
  let deadline = started + leaseSeconds * 1_000 - reserveMs;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const arm = () => {
    clearTimeout(timer);
    const remaining = deadline - performance.now();
    if (remaining <= 0) controller.abort();
    else timer = setTimeout(() => controller.abort(), remaining);
  };
  arm();
  return {
    signal: controller.signal,
    remainingMs: () => Math.max(0, deadline - performance.now()),
    shortenToRemaining(ms: number) {
      deadline = Math.min(deadline, performance.now() + ms);
      arm();
    },
    dispose() { clearTimeout(timer); },
  };
}
