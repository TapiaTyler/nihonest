import { describe, expect, it } from "vitest";
import { renderNotificationEmail } from "./notification-email";

const context = {
  fromName: "Nihonest",
  fromAddress: "notifications@nihonest.com",
  recipientAddress: "reader@example.com",
  siteOrigin: "https://nihonest.com",
};

describe("notification email templates", () => {
  it("renders a reminder with text and HTML links", () => {
    const email = renderNotificationEmail({
      id: "10000000-0000-4000-8000-000000000001",
      userId: "20000000-0000-4000-8000-000000000002",
      type: "reminder-due",
      deduplicationKey: "reminder-due:30000000-0000-4000-8000-000000000003",
      createdAt: "2026-10-01T00:00:00.000Z",
      payload: { reminderId: "30000000-0000-4000-8000-000000000003", title: "Prepare renewal documents", scheduledFor: "2026-10-01T00:00:00.000Z" },
    }, context);

    expect(email.subject).toBe("Reminder: Prepare renewal documents");
    expect(email.text).toContain("https://nihonest.com/reminders");
    expect(email.html).toContain("you scheduled this reminder");
  });

  it("escapes event titles before including them in HTML", () => {
    const email = renderNotificationEmail({
      id: "10000000-0000-4000-8000-000000000001",
      userId: "20000000-0000-4000-8000-000000000002",
      type: "article-critical-update",
      deduplicationKey: "article-update:test",
      createdAt: "2026-10-01T00:00:00.000Z",
      payload: {
        articleId: "renewing-status-of-residence",
        releaseId: "30000000-0000-4000-8000-000000000003",
        title: "Renewal <requirements>",
        revision: "2026-10-01",
        summary: "The evidence list changed.",
        journeyTargets: [{ journeyId: "professional-worker", routeId: "engineer" }],
      },
    }, { ...context, criticalUpdateReasons: ["saved-item"] });

    expect(email.html).toContain("Renewal &lt;requirements&gt;");
    expect(email.html).not.toContain("<requirements>");
    expect(email.text).toContain("because this guidance is in your Saved items");
  });

  it("explains when both the current journey and Saved items caused an update", () => {
    const email = renderNotificationEmail({
      id: "10000000-0000-4000-8000-000000000001",
      userId: "20000000-0000-4000-8000-000000000002",
      type: "article-critical-update",
      deduplicationKey: "article-update:test",
      createdAt: "2026-10-01T00:00:00.000Z",
      payload: {
        articleId: "renewing-status-of-residence",
        releaseId: "30000000-0000-4000-8000-000000000003",
        title: "Renewal requirements",
        revision: "2026-10-01",
        summary: "The evidence list changed.",
        journeyTargets: [{ journeyId: "professional-worker", routeId: "engineer" }],
      },
    }, { ...context, criticalUpdateReasons: ["saved-item", "selected-journey"] });

    expect(email.text).toContain("part of your current Nihonest journey and is in your Saved items");
  });
});
