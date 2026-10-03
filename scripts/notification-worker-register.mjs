import { registerHooks } from "node:module";

// Next aliases server-only during application builds. This hook scopes the same marker to this
// standalone Node command; the marker remains active for client-boundary checks in Next.js.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") {
      return { url: new URL("./notification-worker-server-only.mjs", import.meta.url).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
