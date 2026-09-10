import { z } from "zod";
import { notificationEventSchema, type NotificationEvent } from "./notifications";
import { CRITICAL_UPDATE_RELEVANCE_REASONS, type CriticalUpdateRelevanceReason } from "./critical-updates";

const emailAddressSchema = z.email();
const httpOriginSchema = z.url().refine((value) => value.startsWith("http://") || value.startsWith("https://"));

export type TransactionalEmail = Readonly<{
  from: Readonly<{ name: string; address: string }>;
  to: string;
  subject: string;
  text: string;
  html: string;
}>;

export type NotificationEmailContext = Readonly<{
  fromName: string;
  fromAddress: string;
  recipientAddress: string;
  siteOrigin: string;
  criticalUpdateReasons?: readonly CriticalUpdateRelevanceReason[];
}>;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function eventDestination(event: NotificationEvent, siteOrigin: string): URL {
  if (event.type === "reminder-due") return new URL("/reminders", siteOrigin);
  if (event.type === "article-critical-update") return new URL(`/articles/${event.payload.articleId}`, siteOrigin);
  return new URL(`/residence-statuses/${event.payload.residenceStatusId}`, siteOrigin);
}

/** Produces one accessible plain-text/HTML pair from a validated event without provider-specific markup. */
export function renderNotificationEmail(eventInput: unknown, contextInput: NotificationEmailContext): TransactionalEmail {
  const event = notificationEventSchema.parse(eventInput);
  const context = z.object({
    fromName: z.string().trim().min(1).max(80),
    fromAddress: emailAddressSchema,
    recipientAddress: emailAddressSchema,
    siteOrigin: httpOriginSchema,
    criticalUpdateReasons: z.array(z.enum(CRITICAL_UPDATE_RELEVANCE_REASONS)).optional(),
  }).parse(contextInput);
  const destination = eventDestination(event, context.siteOrigin).toString();

  const content = event.type === "reminder-due"
    ? {
        subject: `Reminder: ${event.payload.title}`,
        heading: event.payload.title,
        summary: "A reminder you scheduled in Nihonest is now due.",
        action: "Review your reminders",
      }
    : {
        subject: `Guidance updated: ${event.payload.title}`,
        heading: event.payload.title,
        summary: event.payload.summary,
        action: "Review the updated guidance",
      };

  const verificationNote = event.type === "reminder-due" || !event.payload.verificationNote ? "" : `\n\n${event.payload.verificationNote}`;
  const verificationHtml = event.type === "reminder-due" || !event.payload.verificationNote ? "" : `<p>${escapeHtml(event.payload.verificationNote)}</p>`;
  const reasons = context.criticalUpdateReasons ?? [];
  if (event.type !== "reminder-due" && reasons.length === 0) {
    throw new Error("Critical-update emails require a current relevance reason.");
  }
  const reasonCopy = event.type === "reminder-due"
    ? "You received this because you scheduled this reminder in Nihonest."
    : reasons.includes("saved-item") && reasons.includes("selected-journey")
      ? "You received this critical update because this guidance is part of your current Nihonest journey and is in your Saved items."
      : reasons.includes("saved-item")
        ? "You received this critical update because this guidance is in your Saved items."
        : "You received this critical update because this guidance is part of your current Nihonest journey.";
  const footer = `${reasonCopy} You can change notification preferences in your Nihonest account.`;
  const text = `${content.heading}\n\n${content.summary}${verificationNote}\n\n${content.action}: ${destination}\n\n${footer}`;
  const html = `<main><h1>${escapeHtml(content.heading)}</h1><p>${escapeHtml(content.summary)}</p>${verificationHtml}<p><a href="${escapeHtml(destination)}">${escapeHtml(content.action)}</a></p><p><small>${escapeHtml(footer)}</small></p></main>`;

  return { from: { name: context.fromName, address: context.fromAddress }, to: context.recipientAddress, subject: content.subject, text, html };
}
