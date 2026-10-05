// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createConfiguredEmailDelivery } from "./configured-email-provider";

const sdk = vi.hoisted(() => ({ constructors: [] as unknown[], sends: [] as unknown[], destroyed: 0 }));

vi.mock("@aws-sdk/client-sesv2", () => ({
  SendEmailCommand: class { constructor(public input: unknown) {} },
  SESv2Client: class {
    constructor(options: unknown) { sdk.constructors.push(options); }
    async send(command: unknown, options: unknown) {
      sdk.sends.push({ command, options });
      return { MessageId: "fixture-message" };
    }
    destroy() { sdk.destroyed++; }
  },
}));

const config = { enabled: true, provider: "amazon-ses" as const, awsRegion: "ap-northeast-1",
  fromName: "Nihonest", fromAddress: "sender@example.test", siteOrigin: "https://example.test" };
const message = { from: { name: "Nihonest", address: "sender@example.test" }, to: "reader@example.test",
  subject: "Reminder", text: "Text", html: "<p>Text</p>" };

describe("configured SES transport", () => {
  it("constructs nothing when delivery is disabled", () => {
    sdk.constructors.length = 0;
    expect(createConfiguredEmailDelivery({ enabled: false })).toBeUndefined();
    expect(sdk.constructors).toHaveLength(0);
  });

  it("uses one SDK attempt, bounded transport and a caller cancellation signal", async () => {
    sdk.constructors.length = 0;
    sdk.sends.length = 0;
    const configured = createConfiguredEmailDelivery(config, { sendTimeoutMs: 4000 })!;
    expect(sdk.constructors).toEqual([{ region: "ap-northeast-1", maxAttempts: 1,
      requestHandler: { connectionTimeout: 3000, requestTimeout: 4000, throwOnRequestTimeout: true } }]);
    const caller = new AbortController();
    expect(await configured.provider.send(message, { signal: caller.signal })).toEqual({ providerMessageId: "fixture-message" });
    expect(sdk.sends).toHaveLength(1);
    const { options } = sdk.sends[0] as { options: { abortSignal: AbortSignal } };
    expect(options.abortSignal).toBeInstanceOf(AbortSignal);
    expect(options.abortSignal.aborted).toBe(false);
    configured.dispose();
    expect(sdk.destroyed).toBeGreaterThan(0);
  });

  it("rejects invalid budgets before constructing an SDK client", () => {
    sdk.constructors.length = 0;
    expect(() => createConfiguredEmailDelivery(config, { sendTimeoutMs: 0 })).toThrow();
    expect(sdk.constructors).toHaveLength(0);
  });
});
