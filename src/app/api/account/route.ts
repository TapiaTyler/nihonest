import { NextResponse, type NextRequest } from "next/server";
import { getAuthenticatedRequest } from "@/lib/auth/server-identity";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function DELETE(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Account services are unavailable." }, { status: 503 });
  const origin = request.headers.get("origin");
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const requestHost = forwardedHost || request.headers.get("host");
  let originHost: string | undefined;
  try {
    originHost = origin ? new URL(origin).host : undefined;
  } catch {
    originHost = undefined;
  }
  if (!originHost || !requestHost || originHost !== requestHost) {
    return NextResponse.json({ error: "The account deletion request was rejected." }, { status: 403 });
  }

  const body = await request.json().catch(() => null) as { confirmation?: unknown } | null;
  if (body?.confirmation !== "DELETE") {
    return NextResponse.json({ error: "Type DELETE to confirm permanent account deletion." }, { status: 400 });
  }

  const { identity } = await getAuthenticatedRequest();
  if (!identity) return NextResponse.json({ error: "Sign in before deleting the account." }, { status: 401 });

  try {
    const admin = createSupabaseAdminClient();
    const { error } = await admin.auth.admin.deleteUser(identity.id);
    if (error) return NextResponse.json({ error: "The account could not be deleted." }, { status: 500 });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Account deletion is not configured on this server." }, { status: 503 });
  }
}
