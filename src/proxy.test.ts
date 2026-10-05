// @vitest-environment node
// The installed Next.js exports the documented proxy matcher helper under its former middleware name.
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";
import { config } from "./proxy";

const matches = (url: string) => unstable_doesMiddlewareMatch({ config, url });

describe("session proxy scope", () => {
  it("runs on routes that need a verified server identity", () => {
    for (const url of ["/account", "/account?auth=success", "/api/account", "/api/account/export", "/auth/callback?code=x&next=/account"]) {
      expect(matches(url), url).toBe(true);
    }
  });

  it("skips prebuilt public pages, liveness, and static assets", () => {
    for (const url of ["/", "/articles/artist-status", "/articles/registering-your-address-after-arrival?local=jp-13104", "/explore",
      "/residence-statuses/student", "/explore/journeys/student-moving-to-japan", "/glossary/juminhyo", "/faq", "/saved", "/my-journey",
      "/reminders", "/onboarding", "/api/health", "/_next/static/chunks/app.js", "/accounting", "/api/accounts"]) {
      expect(matches(url), url).toBe(false);
    }
  });
});
