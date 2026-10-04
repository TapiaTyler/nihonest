/**
 * Process liveness for the host's health check: the server is up and serving requests. It reads no settings,
 * touches no database or provider, and reveals nothing about configuration, so a Supabase or email outage never
 * marks the public knowledgebase unhealthy. Dependency readiness is a separate concern (docs/DEPLOYMENT-CONFIGURATION.md).
 */
export function GET() {
  return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}

export function HEAD() {
  return new Response(null, { headers: { "Cache-Control": "no-store" } });
}
