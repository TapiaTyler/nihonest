"use client";

import { config } from "zod";

// Zod probes `new Function("")` once to decide whether to JIT-compile parsers. The probe is caught, but the
// Content Security Policy (no 'unsafe-eval') still reports it as a violation on every page. Interpreted parsing
// avoids the probe in the browser; server-side parsing keeps its default.
if (typeof window !== "undefined") config({ jitless: true });

/** Rendered once from the root layout so the browser setting applies before client code parses any schema. */
export function BrowserSchemaConfig() {
  return null;
}
