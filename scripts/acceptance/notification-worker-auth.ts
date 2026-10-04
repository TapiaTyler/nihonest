/** Dedicated local fixture harness. Never accepts a deployment URL/key or constructs an email provider. */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { runAcceptancePreflight } from "@/lib/notifications/worker-acceptance-preflight";
import { createSupabaseNotificationWorkerStore } from "@/lib/notifications/supabase-notification-worker-store";
import { createWorkerDatabaseFetch } from "@/lib/notifications/worker-database-fetch";
import { runNotificationWorker, type NotificationWorkerStore } from "@/lib/notifications/notification-worker";
import type { NotificationEmailSender } from "@/domain/notifications/notification-dispatch";
import { notificationDeliverySchema } from "@/domain/notifications/notification-delivery";
import type { Database } from "@/types/database";

const command = (program: string, args: string[]) => execFileSync(program, args, {
  encoding: "utf8", timeout: 15_000, stdio: ["ignore", "pipe", "pipe"],
}).trim();
const git = (...args: string[]) => command("git", args);
let checkpoint = "configuration";

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--help") {
    process.stdout.write("Usage: node --import ./scripts/notification-worker-register.mjs --import tsx scripts/acceptance/notification-worker-auth.ts --source-ref <reviewed-40-character-commit> --stack-dir <owned-disposable-project>\nRequires a fresh nihonest-j1-auth-* CLI stack with exact-source migrations. Fake sender only.\n");
    return;
  }
  if (args.length !== 4 || args[0] !== "--source-ref" || !/^[a-f0-9]{40}$/.test(args[1]) || args[2] !== "--stack-dir") {
    throw new Error("Invalid arguments.");
  }
  const sourceRef = args[1];
  assert.equal(git("rev-parse", `${sourceRef}^{commit}`), sourceRef);
  checkpoint = "runtime-source";
  // The harness/preflight are under review; every production dependency and migration must still match
  // the separately approved source, including uncommitted tracked changes. Never test later branch heads implicitly.
  const paths = ["src", "supabase/migrations", "package.json", "package-lock.json", "tsconfig.json",
    "scripts/notification-worker-register.mjs", "scripts/notification-worker-server-only.mjs",
    ":(exclude)src/lib/notifications/worker-acceptance-preflight.ts", ":(exclude)src/lib/notifications/worker-acceptance-preflight.test.ts"];
  assert.equal(git("diff", "--name-only", sourceRef, "--", ...paths), "");
  assert.equal(git("ls-files", "--others", "--exclude-standard", "--", ...paths), "");
  const stackDir = realpathSync(resolve(args[3]));
  const config = readFileSync(resolve(stackDir, "supabase/config.toml"), "utf8");
  const project = /^project_id\s*=\s*"(nihonest-j1-auth-[a-z0-9-]+)"\s*$/m.exec(config)?.[1];
  assert.ok(project, "A dedicated acceptance project is required.");
  const container = `supabase_db_${project}`;
  checkpoint = "stack-identity";
  const labels = JSON.parse(command("docker", ["inspect", "--format", "{{json .Config.Labels}}", container]));
  assert.equal(labels["com.supabase.cli.project"], project);
  assert.equal(realpathSync(labels["com.supabase.cli.workdir"]), stackDir);
  checkpoint = "migration-source";
  const migrations = git("ls-tree", "-r", "--name-only", sourceRef, "supabase/migrations").split("\n");
  for (const file of migrations) {
    assert.equal(readFileSync(resolve(stackDir, file), "utf8").replace(/\r\n/g, "\n").trimEnd(), git("show", `${sourceRef}:${file}`));
  }
  const versions = command("docker", ["exec", container, "psql", "-X", "-U", "postgres", "-Atq", "-c",
    "select version from supabase_migrations.schema_migrations order by version"]);
  assert.equal(versions, migrations.map((file) => /\/([0-9]+)_/.exec(file)![1]).join("\n"));
  // Status credentials stay in memory and are read only after independent container/path/source checks.
  const status = JSON.parse(command(process.execPath, ["node_modules/supabase/dist/supabase.js", "status", "--workdir", stackDir, "--output", "json"]));
  checkpoint = "initial-preflight";
  const target = { supabaseUrl: status.API_URL as string, supabaseSecretKey: status.SERVICE_ROLE_KEY as string };
  const currentRef = git("rev-parse", "HEAD");
  const preflightInput = { sourceRef: currentRef, currentRef, supabaseUrl: target.supabaseUrl, secretKey: target.supabaseSecretKey };
  await runAcceptancePreflight(preflightInput);
  const client = createClient<Database>(target.supabaseUrl, target.supabaseSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }, db: { retry: false },
    global: { fetch: createWorkerDatabaseFetch(globalThis.fetch, 10_000) },
  });
  const store = createSupabaseNotificationWorkerStore(target, { timeoutMs: 10_000 });
  const results: string[] = [];
  const users = new Set<string>();
  const releases = new Set<string>();
  function requireSuccess(result: { error: unknown }) { assert.equal(result.error, null); }
  async function cleanupReleases() {
    for (const id of releases) {
      requireSuccess(await client.from("critical_update_releases").delete().eq("id", id));
      releases.delete(id);
    }
  }
  const context = { fromName: "Fixture", fromAddress: "sender@example.invalid", siteOrigin: "http://127.0.0.1:55439" };

  async function scenario(name: string, test: (userId: string, address: string) => Promise<void>, identity: "confirmed" | "unconfirmed" | "phone" = "confirmed") {
    checkpoint = name;
    const address = `j1-${randomUUID()}@example.invalid`;
    const created = await client.auth.admin.createUser(identity === "phone"
      ? { phone: "+15555550199", phone_confirm: true }
      : { email: address, email_confirm: identity === "confirmed" });
    requireSuccess(created);
    const id = created.data.user!.id;
    users.add(id);
    try {
      await test(id, address);
      results.push(name);
      process.stdout.write(`${JSON.stringify({ scenario: name, status: "passed" })}\n`);
    } finally {
      try { requireSuccess(await client.auth.admin.deleteUser(id)); users.delete(id); }
      finally { await cleanupReleases(); }
      // Prevent a later global generation/claim pass from ever seeing leftovers from earlier fixtures.
      await runAcceptancePreflight(preflightInput);
    }
  }
  async function preferences(userId: string) {
    requireSuccess(await client.from("notification_preferences").insert({ user_id: userId, email_enabled: true,
      deadline_reminders_enabled: true, critical_updates_enabled: true, time_zone: "UTC" }));
  }
  async function reminder(userId: string) {
    const id = randomUUID();
    const now = await store.readWorkerTime();
    requireSuccess(await client.from("reminders").insert({ id, user_id: userId, title: "Owned fixture reminder", target_kind: "custom",
      scheduled_for: new Date(Date.parse(now) - 60_000).toISOString(), time_zone: "UTC" }));
    return id;
  }
  async function row(userId: string) {
    const result = await client.from("notification_deliveries").select("*").eq("user_id", userId).single();
    requireSuccess(result);
    return result.data!;
  }
  async function criticalEvent(userId: string) {
    requireSuccess(await client.from("saved_content").insert({ user_id: userId, content_kind: "article", content_id: "artist-status", state: "saved", updated_at: await store.readWorkerTime() }));
    requireSuccess(await client.from("notification_events").insert({ user_id: userId, event_type: "article-critical-update", deduplication_key: randomUUID(),
      payload: { releaseId: randomUUID(), title: "Fixture critical update", revision: "fixture", summary: "Owned fixture summary", journeyTargets: [], articleId: "artist-status" } }));
  }
  async function publishedRelease(userId: string, kind: "article" | "residence-status",
    mode: "saved" | "journey-wide" | "route" | "both" | "route-mismatch" | "journey-mismatch") {
    const target = kind === "article" ? "artist-status" : "student";
    const now = await store.readWorkerTime();
    if (mode === "saved" || mode === "both") requireSuccess(await client.from("saved_content").insert({
      user_id: userId, content_kind: kind, content_id: target, state: "saved", updated_at: now,
    }));
    if (mode !== "saved") requireSuccess(await client.from("user_preferences").insert({ user_id: userId,
      journey_id: mode === "journey-mismatch" ? "other-journey" : "fixture-journey",
      route_id: mode === "route-mismatch" ? "other-route" : "fixture-route",
    }));
    const id = randomUUID(); releases.add(id);
    requireSuccess(await client.from("critical_update_releases").insert({ id, target_kind: kind, target_id: target,
      title: "Owned fixture release", summary: "Owned fixture summary", revision: id, editorial_state: "published",
      created_at: now, approved_at: now, published_at: now,
    }));
    if (mode !== "saved") requireSuccess(await client.from("critical_update_journey_targets").insert({
      release_id: id, journey_id: "fixture-journey", route_id: mode === "journey-wide" || mode === "both" ? null : "fixture-route",
    }));
    return id;
  }
  async function releaseGenerated(releaseId: string) {
    const result = await client.from("critical_update_releases").select("events_generated_at").eq("id", releaseId).single();
    requireSuccess(result); assert.ok(result.data!.events_generated_at);
  }
  function sender(expectedAddress: string, mode: "success" | "failure" | "timeout" = "success") {
    let calls = 0;
    const texts: string[] = [];
    const provider: NotificationEmailSender = { async send(message, options) {
      assert.equal(message.to, expectedAddress);
      calls++;
      texts.push(message.text);
      if (mode === "failure") throw new Error("Private fake provider failure.");
      if (mode === "timeout") await new Promise<void>((_, reject) => {
        const abort = () => reject(new Error("Fake send aborted."));
        if (options?.signal?.aborted) abort();
        else options?.signal?.addEventListener("abort", abort, { once: true });
      });
      return { providerMessageId: "fake-provider-message" };
    } };
    return { provider, calls: () => calls, texts: () => texts };
  }
  const pass = (provider: NotificationEmailSender, selectedStore = store) => runNotificationWorker({
    jobsEnabled: true, store: selectedStore, delivery: { provider, context },
    limits: { deliveryLimit: 1, providerTimeoutMs: 100, databaseTimeoutMs: 10_000 },
  });
  const afterClaim = (hook: (userId: string) => Promise<void>): NotificationWorkerStore => ({ ...store,
    async claimEmailDeliveries(input, options) {
      const claims = await store.claimEmailDeliveries(input, options);
      if (claims.length) await hook((claims[0] as { userId: string }).userId);
      return claims;
    },
  });
  try {
    await scenario("missing-preferences-suppressed-idempotently", async (id, address) => {
      await reminder(id); const fake = sender(address);
      const first = await pass(fake.provider);
      assert.equal(first.deliveriesPrepared, 1); assert.equal(first.claimed, 0); assert.equal(fake.calls(), 0);
      assert.equal((await row(id)).state, "suppressed");
      const second = await pass(fake.provider);
      assert.equal(second.deliveriesPrepared, 0); assert.equal(second.remindersFulfilled, 0); assert.equal(second.claimed, 0);
      assert.equal(second.exitCode, 0);
    });
    await scenario("confirmed-recipient-sent-once", async (id, address) => {
      await preferences(id); await reminder(id); const fake = sender(address);
      const report = await pass(fake.provider); assert.equal(report.sent, 1); assert.equal(report.exitCode, 0);
      const delivery = await row(id); assert.equal(delivery.state, "sent"); assert.equal(delivery.attempt_count, 1);
      assert.equal(delivery.provider_message_id, "fake-provider-message"); assert.equal(delivery.claim_token, null);
      await pass(fake.provider); assert.equal(fake.calls(), 1);
    });
    await scenario("delivery-disabled-still-prepares-without-claims", async (id) => {
      await preferences(id); await reminder(id);
      const report = await runNotificationWorker({ jobsEnabled: true, store });
      assert.equal(report.status, "delivery-disabled"); assert.equal(report.exitCode, 0);
      assert.equal(report.deliveriesPrepared, 1); assert.equal(report.claimed, 0);
      const delivery = await row(id); assert.equal(delivery.state, "pending"); assert.equal(delivery.attempt_count, 0);
    });
    for (const identity of ["unconfirmed", "phone"] as const) await scenario(`${identity}-recipient-terminal-suppression`, async (id, address) => {
      await preferences(id); await reminder(id); const fake = sender(address);
      const report = await pass(fake.provider); assert.equal(report.suppressed, 1); assert.equal(report.infrastructureErrors, 0);
      const delivery = await row(id); assert.equal(delivery.state, "suppressed"); assert.equal(delivery.attempt_count, 1);
      await pass(fake.provider); assert.equal(fake.calls(), 0);
    }, identity);
    for (const setting of ["email_enabled", "deadline_reminders_enabled"] as const) await scenario(`${setting}-withdrawn-after-claim`, async (id, address) => {
      await preferences(id); await reminder(id); const fake = sender(address);
      const report = await pass(fake.provider, afterClaim(async (owner) => {
        assert.equal(owner, id); requireSuccess(await client.from("notification_preferences").update(
          setting === "email_enabled" ? { email_enabled: false } : { deadline_reminders_enabled: false },
        ).eq("user_id", id));
      }));
      assert.equal(report.suppressed, 1); assert.equal((await row(id)).state, "suppressed"); assert.equal(fake.calls(), 0);
    });
    await scenario("relevant-critical-saved-target-sent", async (id, address) => {
      await preferences(id); await criticalEvent(id); const fake = sender(address);
      const report = await pass(fake.provider); assert.equal(report.sent, 1); assert.equal(report.exitCode, 0);
      assert.equal((await row(id)).state, "sent"); assert.equal(fake.calls(), 1);
    });
    await scenario("critical-saved-target-withdrawn-after-claim", async (id, address) => {
      await preferences(id); await criticalEvent(id);
      const fake = sender(address);
      const report = await pass(fake.provider, afterClaim(async (owner) => {
        assert.equal(owner, id); requireSuccess(await client.from("saved_content").update({ state: "removed" }).eq("user_id", id));
      }));
      assert.equal(report.suppressed, 1); assert.equal(fake.calls(), 0); assert.equal((await row(id)).state, "suppressed");
    });
    for (const [kind, mode] of [
      ["residence-status", "saved"], ["article", "journey-wide"], ["residence-status", "route"],
      ["article", "route-mismatch"], ["article", "journey-mismatch"], ["article", "both"],
    ] as const) await scenario(`published-${kind}-${mode}-targeting`, async (id, address) => {
      await preferences(id); const releaseId = await publishedRelease(id, kind, mode); const fake = sender(address);
      const report = await pass(fake.provider); assert.equal(report.exitCode, 0); await releaseGenerated(releaseId);
      const matching = mode !== "route-mismatch" && mode !== "journey-mismatch";
      assert.equal(report.criticalEventsGenerated, matching ? 1 : 0);
      assert.equal(report.sent, matching ? 1 : 0); assert.equal(fake.calls(), matching ? 1 : 0);
      const events = await client.from("notification_events").select("*").eq("user_id", id);
      requireSuccess(events); assert.equal(events.data!.length, matching ? 1 : 0);
      if (matching) {
        const event = events.data![0]!;
        assert.equal(event.event_type, kind === "article" ? "article-critical-update" : "residence-status-guidance-updated");
        assert.equal(event.deduplication_key, `critical-update-release:${releaseId}`);
        assert.equal((event.payload as { releaseId: string }).releaseId, releaseId);
        const delivery = await row(id); assert.equal(delivery.state, "sent"); assert.equal(delivery.attempt_count, 1);
        assert.equal(delivery.event_id, event.id);
        assert.ok(fake.texts()[0]!.includes(kind === "article" ? "/articles/artist-status" : "/residence-statuses/student"));
        if (mode === "both") assert.match(fake.texts()[0]!, /current Nihonest journey and is in your Saved items/);
      } else {
        const deliveries = await client.from("notification_deliveries").select("id").eq("user_id", id);
        requireSuccess(deliveries); assert.equal(deliveries.data!.length, 0);
      }
      const repeat = await pass(fake.provider); assert.equal(repeat.criticalEventsGenerated, 0);
      assert.equal(repeat.claimed, 0); assert.equal(fake.calls(), matching ? 1 : 0);
    });
    for (const change of ["route", "journey", "consent"] as const) await scenario(`published-critical-${change}-withdrawn-after-claim`, async (id, address) => {
      await preferences(id); const releaseId = await publishedRelease(id, "article", "route"); const fake = sender(address);
      const report = await pass(fake.provider, afterClaim(async (owner) => {
        assert.equal(owner, id);
        if (change === "consent") requireSuccess(await client.from("notification_preferences").update({ critical_updates_enabled: false }).eq("user_id", id));
        else requireSuccess(await client.from("user_preferences").update(change === "route"
          ? { route_id: "other-route" } : { journey_id: "other-journey" }).eq("user_id", id));
      }));
      assert.equal(report.criticalEventsGenerated, 1); assert.equal(report.claimed, 1); assert.equal(report.suppressed, 1);
      assert.equal(report.exitCode, 0); assert.equal(report.infrastructureErrors, 0); assert.equal(fake.calls(), 0);
      const delivery = await row(id); assert.equal(delivery.state, "suppressed"); assert.equal(delivery.attempt_count, 1);
      await releaseGenerated(releaseId); await pass(fake.provider); assert.equal(fake.calls(), 0);
    });
    await scenario("published-critical-topic-disabled-not-generated", async (id, address) => {
      await preferences(id); await publishedRelease(id, "article", "saved"); const fake = sender(address);
      requireSuccess(await client.from("notification_preferences").update({ critical_updates_enabled: false }).eq("user_id", id));
      const report = await pass(fake.provider); assert.equal(report.criticalEventsGenerated, 0);
      assert.equal(report.claimed, 0); assert.equal(report.exitCode, 0); assert.equal(fake.calls(), 0);
      const events = await client.from("notification_events").select("id").eq("user_id", id);
      const deliveries = await client.from("notification_deliveries").select("id").eq("user_id", id);
      requireSuccess(events); requireSuccess(deliveries); assert.equal(events.data!.length, 0); assert.equal(deliveries.data!.length, 0);
    });
    for (const mode of ["failure", "timeout"] as const) await scenario(`provider-${mode}-database-retry`, async (id, address) => {
      await preferences(id); await reminder(id); const fake = sender(address, mode);
      const report = await pass(fake.provider); assert.equal(report.failed, 1); assert.equal(report.exitCode, 1);
      const delivery = await row(id); assert.equal(delivery.state, "failed"); assert.equal(delivery.attempt_count, 1);
      assert.equal(delivery.claim_token, null); assert.equal(fake.calls(), 1);
      assert.ok(Date.parse(delivery.available_at) - Date.parse(delivery.updated_at) >= 59_000);
      await pass(fake.provider); assert.equal(fake.calls(), 1);
    });
    await scenario("lost-finalization-acknowledgement-remains-sent", async (id, address) => {
      await preferences(id); await reminder(id); const fake = sender(address);
      const uncertain: NotificationWorkerStore = { ...store, async finalizeEmailDelivery(input, options) {
        await store.finalizeEmailDelivery(input, options); throw new Error("Fixture loses response after real commit.");
      } };
      const report = await pass(fake.provider, uncertain); assert.equal(report.infrastructureErrors, 1); assert.equal(report.sent, 0);
      assert.equal(report.exitCode, 1); assert.equal((await row(id)).state, "sent");
      await pass(fake.provider); assert.equal(fake.calls(), 1);
    });
    await scenario("accepted-send-unfinalized-lease-recovery-can-duplicate", async (id, address) => {
      await preferences(id); await reminder(id); const fake = sender(address);
      let finalizationAttempts = 0;
      const unfinalized: NotificationWorkerStore = { ...store, async finalizeEmailDelivery(input) {
        assert.equal(input.state, "sent"); assert.equal(fake.calls(), 1);
        finalizationAttempts++;
        // The fake provider accepted, but no finalization RPC reaches the database in this fixture.
        throw new Error("Fixture loses finalization before commit.");
      } };
      const first = await pass(fake.provider, unfinalized);
      assert.equal(first.claimed, 1); assert.equal(first.sent, 0); assert.equal(first.failed, 0);
      assert.equal(first.infrastructureErrors, 1); assert.equal(first.exitCode, 1);
      assert.equal(finalizationAttempts, 1); assert.equal(fake.calls(), 1);
      const processing = await row(id);
      assert.equal(processing.state, "processing"); assert.equal(processing.attempt_count, 1);
      assert.equal(processing.sent_at, null); assert.equal(processing.provider_message_id, null);
      const oldToken = processing.claim_token; assert.ok(oldToken); assert.ok(processing.claim_expires_at);

      const immediate = await pass(fake.provider);
      assert.equal(immediate.claimed, 0); assert.equal(immediate.exitCode, 0); assert.equal(fake.calls(), 1);
      assert.deepEqual(await row(id), processing);
      // Shorten only this owned claim's expiry, rather than waiting for the normal 300-second lease.
      const expired = await client.from("notification_deliveries").update({
        claim_expires_at: new Date(Date.parse(await store.readWorkerTime()) - 1_000).toISOString(),
      }).eq("id", processing.id).eq("user_id", id).eq("state", "processing").eq("claim_token", oldToken).select("id").single();
      requireSuccess(expired); assert.equal(expired.data!.id, processing.id);
      const recovery: NotificationWorkerStore = { ...store, async claimEmailDeliveries(input, options) {
        const claims = await store.claimEmailDeliveries(input, options);
        assert.equal(claims.length, 1);
        const reclaimed = notificationDeliverySchema.parse(claims[0]);
        assert.equal(reclaimed.id, processing.id); assert.equal(reclaimed.attemptCount, 2);
        assert.notEqual(reclaimed.claimToken, oldToken);
        const before = await row(id);
        await assert.rejects(store.finalizeEmailDelivery({ deliveryId: processing.id, claimToken: oldToken,
          state: "suppressed", now: await store.readWorkerTime() }));
        assert.deepEqual(await row(id), before);
        return claims;
      } };
      const recovered = await pass(fake.provider, recovery);
      assert.equal(recovered.claimed, 1); assert.equal(recovered.sent, 1);
      assert.equal(recovered.infrastructureErrors, 0); assert.equal(recovered.exitCode, 0);
      // Two accepted fake sends for one event demonstrate the documented duplicate-on-recovery limit.
      assert.equal(fake.calls(), 2);
      const sent = await row(id);
      assert.equal(sent.id, processing.id); assert.equal(sent.event_id, processing.event_id);
      assert.equal(sent.state, "sent"); assert.equal(sent.attempt_count, 2);
      assert.equal(sent.provider_message_id, "fake-provider-message"); assert.ok(sent.sent_at);
      assert.equal(sent.claim_token, null); assert.equal(sent.claim_expires_at, null);
      await pass(fake.provider); assert.equal(fake.calls(), 2); assert.deepEqual(await row(id), sent);
    });
    for (const reclaim of [false, true]) await scenario(reclaim ? "reclaimed-old-token-rejected" : "expired-token-finalization-rejected", async (id) => {
      await preferences(id); await reminder(id); const now = await store.readWorkerTime();
      assert.equal(await store.generateDueReminderEvents({ now, limit: 1 }), 1);
      assert.equal(await store.prepareEmailDeliveries({ now, limit: 1 }), 1);
      const claim = notificationDeliverySchema.parse((await store.claimEmailDeliveries({ now, limit: 1, maxAttempts: 5, leaseSeconds: 300 }))[0]);
      // Fixture-only expiry lets the actual RPC reject stale tokens without a five-minute acceptance wait.
      requireSuccess(await client.from("notification_deliveries").update({
        claim_expires_at: new Date(Date.parse(await store.readWorkerTime()) - 1_000).toISOString(),
      }).eq("id", claim.id).eq("user_id", id));
      let active = claim;
      if (reclaim) {
        active = notificationDeliverySchema.parse((await store.claimEmailDeliveries({ now, limit: 1, maxAttempts: 5, leaseSeconds: 300 }))[0]);
        assert.notEqual(active.claimToken, claim.claimToken); assert.equal(active.attemptCount, 2);
      }
      const before = await row(id);
      await assert.rejects(store.finalizeEmailDelivery({ deliveryId: claim.id, claimToken: claim.claimToken!, state: "suppressed", now }));
      assert.deepEqual(await row(id), before);
      if (reclaim) {
        await store.finalizeEmailDelivery({ deliveryId: active.id, claimToken: active.claimToken!, state: "suppressed", now });
        assert.equal((await row(id)).state, "suppressed");
      }
    });
  } finally {
    // Only recorded fixture IDs may be deleted. Cleanup errors also fail the acceptance run.
    try { for (const id of users) requireSuccess(await client.auth.admin.deleteUser(id)); }
    finally { await cleanupReleases(); }
  }
  await runAcceptancePreflight(preflightInput);
  process.stdout.write(`${JSON.stringify({ status: "passed", sourceRef, harnessRef: currentRef, scenarios: results.length, emptyAfterCleanup: true })}\n`);
}

void main().catch(() => {
  // Assertions and SDK errors may carry addresses, SQL, URLs or keys. Keep private details out of reports.
  process.stdout.write(`${JSON.stringify({ status: "acceptance-failed", checkpoint, exitCode: 1 })}\n`);
  process.exitCode = 1;
});
