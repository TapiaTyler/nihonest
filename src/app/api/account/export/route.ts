import { NextResponse } from "next/server";
import { getAuthenticatedRequest } from "@/lib/auth/server-identity";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Account services are unavailable." }, { status: 503 });
  const { client, identity } = await getAuthenticatedRequest();
  if (!identity) return NextResponse.json({ error: "Sign in to export account data." }, { status: 401 });

  const [profileResult, preferenceResult] = await Promise.all([
    client.from("profiles").select("*").maybeSingle(),
    client.from("user_preferences").select("*").maybeSingle(),
  ]);
  if (profileResult.error || preferenceResult.error) {
    return NextResponse.json({ error: "Account data could not be read." }, { status: 500 });
  }

  const body = JSON.stringify({
    format: "nihonest-account-export",
    version: 1,
    exportedAt: new Date().toISOString(),
    account: {
      id: identity.id,
      email: identity.email ?? null,
      authenticatedAt: identity.authenticatedAt ?? null,
    },
    userOwnedData: {
      profile: profileResult.data,
      preferences: preferenceResult.data,
    },
    notIncluded: ["Public browsing history", "Search queries", "Browser-local preferences on other devices"],
  }, null, 2);

  return new NextResponse(body, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": 'attachment; filename="nihonest-account-data.json"',
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
