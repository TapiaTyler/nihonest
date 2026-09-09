import { NextResponse } from "next/server";
import { getAuthenticatedRequest } from "@/lib/auth/server-identity";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Account services are unavailable." }, { status: 503 });
  const { client, identity } = await getAuthenticatedRequest();
  if (!identity) return NextResponse.json({ error: "Sign in to export account data." }, { status: 401 });

  const [profileResult, preferenceResult, savedContentResult, glossaryProgressResult, checklistProgressResult, notificationPreferenceResult, reminderResult] = await Promise.all([
    client.from("profiles").select("*").maybeSingle(),
    client.from("user_preferences").select("*").maybeSingle(),
    client.from("saved_content").select("*").order("content_kind").order("content_id"),
    client.from("glossary_study_progress").select("*").order("term_id"),
    client.from("checklist_progress").select("*").order("checklist_id"),
    client.from("notification_preferences").select("*").maybeSingle(),
    client.from("reminders").select("*").order("scheduled_for"),
  ]);
  if (profileResult.error || preferenceResult.error || savedContentResult.error || glossaryProgressResult.error || checklistProgressResult.error || notificationPreferenceResult.error || reminderResult.error) {
    return NextResponse.json({ error: "Account data could not be read." }, { status: 500 });
  }

  const body = JSON.stringify({
    format: "nihonest-account-export",
    version: 3,
    exportedAt: new Date().toISOString(),
    account: {
      id: identity.id,
      email: identity.email ?? null,
      authenticatedAt: identity.authenticatedAt ?? null,
    },
    userOwnedData: {
      profile: profileResult.data,
      preferences: preferenceResult.data,
      savedContent: savedContentResult.data,
      glossaryProgress: glossaryProgressResult.data,
      checklistProgress: checklistProgressResult.data,
      notificationPreferences: notificationPreferenceResult.data,
      reminders: reminderResult.data,
    },
    notIncluded: ["Public browsing history", "Search queries", "Unsynchronized browser-local data on other devices"],
  }, null, 2);

  return new NextResponse(body, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": 'attachment; filename="nihonest-account-data.json"',
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
