import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeAuthReturnPath } from "@/lib/auth/return-path";
import { getSupabasePublicConfig, isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

const emailOtpTypes: readonly EmailOtpType[] = ["email", "signup", "invite", "magiclink", "recovery", "email_change"];

/**
 * Redirects with a relative Location so the browser stays on the host it used for this request, where the session
 * cookies were just set. Deriving an absolute origin on the server can name a different host (Next reported
 * `localhost` for a `127.0.0.1` request; a hosting proxy can report an internal host), which signs the reader out.
 */
function redirectTo(path: string, auth: "unavailable" | "error" | "success") {
  const destination = new URL(path, "http://relative.invalid");
  destination.searchParams.set("auth", auth);
  return new NextResponse(null, { status: 307, headers: { Location: `${destination.pathname}${destination.search}${destination.hash}` } });
}

export async function GET(request: NextRequest) {
  const next = safeAuthReturnPath(request.nextUrl.searchParams.get("next"));
  if (!isSupabaseConfigured()) return redirectTo(next, "unavailable");

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

  const response = redirectTo(next, error ? "error" : "success");
  cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
  return response;
}
