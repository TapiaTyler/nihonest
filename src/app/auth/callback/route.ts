import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeAuthReturnPath } from "@/lib/auth/return-path";
import { getSupabasePublicConfig, isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

const emailOtpTypes: readonly EmailOtpType[] = ["email", "signup", "invite", "magiclink", "recovery", "email_change"];

export async function GET(request: NextRequest) {
  const next = safeAuthReturnPath(request.nextUrl.searchParams.get("next"));
  const destination = new URL(next, request.nextUrl.origin);
  if (!isSupabaseConfigured()) {
    destination.searchParams.set("auth", "unavailable");
    return NextResponse.redirect(destination);
  }

  const cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }> = [];
  const { url, publishableKey } = getSupabasePublicConfig();
  const client = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      // A Route Handler must attach the exchanged session to its explicit redirect response.
      setAll: (cookies) => {
        cookiesToSet.push(...cookies);
      },
    },
  });
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const rawType = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  let error: { message: string } | null = null;

  if (code) {
    ({ error } = await client.auth.exchangeCodeForSession(code));
  } else if (tokenHash && rawType && emailOtpTypes.includes(rawType)) {
    ({ error } = await client.auth.verifyOtp({ token_hash: tokenHash, type: rawType }));
  } else {
    error = { message: "Missing or invalid authentication callback values." };
  }

  destination.searchParams.set("auth", error ? "error" : "success");
  const response = NextResponse.redirect(destination);
  cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
  return response;
}
