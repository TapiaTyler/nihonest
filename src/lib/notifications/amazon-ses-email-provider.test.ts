import { describe, expect, it, vi } from "vitest";
import { createAmazonSesEmailProvider } from "./amazon-ses-email-provider";

const message = {
  from: { name: "Nihonest", address: "notifications@nihonest.com" },
  to: "reader@example.com",
  subject: "Reminder",
  text: "Your reminder is due.",
  html: "<p>Your reminder is due.</p>",
};

describe("Amazon SES email provider", () => {
  it("maps a transactional email to an SES v2 request", async () => {
    const send = vi.fn().mockResolvedValue({ MessageId: "ses-message-1" });
    const result = await createAmazonSesEmailProvider(send).send(message);

    expect(result).toEqual({ providerMessageId: "ses-message-1" });
    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      FromEmailAddress: '"Nihonest" <notifications@nihonest.com>',
      Destination: { ToAddresses: ["reader@example.com"] },
    }));
  });

  it("rejects an untrackable SES response", async () => {
    const provider = createAmazonSesEmailProvider(vi.fn().mockResolvedValue({}));
    await expect(provider.send(message)).rejects.toThrow("did not return a message ID");
  });
});
