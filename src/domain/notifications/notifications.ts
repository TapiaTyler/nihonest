import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const localDateTimeSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
const criticalUpdateJourneyTargetSchema = z.object({
  journeyId: stableIdSchema,
  routeId: stableIdSchema.optional(),
});

const criticalUpdatePayloadSchema = z.object({
  releaseId: z.uuid(),
  title: z.string().min(1),
  revision: z.string().min(1),
  summary: z.string().min(1).max(500),
  verificationNote: z.string().min(1).max(300).optional(),
  journeyTargets: z.array(criticalUpdateJourneyTargetSchema),
});

export const notificationTimeZoneSchema = z.string().min(1).max(100).refine((timeZone) => {
  try {
    new Intl.DateTimeFormat("en", { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}, "Use a valid IANA time zone.");

export const notificationPreferencesSchema = z.object({
  emailEnabled: z.boolean().default(false),
  deadlineRemindersEnabled: z.boolean().default(false),
  criticalUpdatesEnabled: z.boolean().default(false),
  timeZone: notificationTimeZoneSchema.default("UTC"),
  updatedAt: z.iso.datetime(),
});

export const reminderTargetSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("article"), id: stableIdSchema }),
  z.object({ kind: z.literal("checklist"), id: stableIdSchema }),
  z.object({ kind: z.literal("custom") }),
]);

export const REMINDER_STATES = ["scheduled", "cancelled", "fulfilled"] as const;
export const reminderStateSchema = z.enum(REMINDER_STATES);

export const reminderSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  title: z.string().trim().min(1).max(120),
  target: reminderTargetSchema,
  scheduledFor: z.iso.datetime(),
  timeZone: notificationTimeZoneSchema,
  state: reminderStateSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  cancelledAt: z.iso.datetime().optional(),
  fulfilledAt: z.iso.datetime().optional(),
}).superRefine((reminder, context) => {
  if ((reminder.state === "cancelled") !== Boolean(reminder.cancelledAt)) {
    context.addIssue({ code: "custom", path: ["cancelledAt"], message: "Cancelled reminders require only a cancellation timestamp." });
  }
  if ((reminder.state === "fulfilled") !== Boolean(reminder.fulfilledAt)) {
    context.addIssue({ code: "custom", path: ["fulfilledAt"], message: "Fulfilled reminders require only a fulfillment timestamp." });
  }
});

const notificationEventBaseSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  deduplicationKey: z.string().min(1).max(200),
  createdAt: z.iso.datetime(),
});

export const notificationEventSchema = z.discriminatedUnion("type", [
  notificationEventBaseSchema.extend({
    type: z.literal("reminder-due"),
    payload: z.object({ reminderId: z.uuid(), title: z.string().min(1).max(120), scheduledFor: z.iso.datetime() }),
  }),
  notificationEventBaseSchema.extend({
    type: z.literal("article-critical-update"),
    payload: criticalUpdatePayloadSchema.extend({
      articleId: stableIdSchema,
    }),
  }),
  notificationEventBaseSchema.extend({
    type: z.literal("residence-status-guidance-updated"),
    payload: criticalUpdatePayloadSchema.extend({
      residenceStatusId: stableIdSchema,
    }),
  }),
]);

export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>;
export type Reminder = z.infer<typeof reminderSchema>;
export type NotificationEvent = z.infer<typeof notificationEventSchema>;

export function createDefaultNotificationPreferences(timeZone: string, updatedAt: string): NotificationPreferences {
  return notificationPreferencesSchema.parse({ timeZone, updatedAt });
}

type LocalDateTimeParts = Readonly<{
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}>;

function parseLocalDateTime(value: string): LocalDateTimeParts | undefined {
  if (!localDateTimeSchema.safeParse(value).success) return undefined;
  const [year, month, day, hour, minute] = value.split(/[-T:]/).map(Number);
  const normalized = new Date(Date.UTC(year, month - 1, day, hour, minute));
  if (normalized.getUTCFullYear() !== year
    || normalized.getUTCMonth() !== month - 1
    || normalized.getUTCDate() !== day
    || normalized.getUTCHours() !== hour
    || normalized.getUTCMinutes() !== minute) return undefined;
  return { year, month, day, hour, minute };
}

function partsInTimeZone(instant: number, timeZone: string): LocalDateTimeParts {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  return { year: value("year"), month: value("month"), day: value("day"), hour: value("hour"), minute: value("minute") };
}

function sameLocalTime(left: LocalDateTimeParts, right: LocalDateTimeParts): boolean {
  return left.year === right.year && left.month === right.month && left.day === right.day
    && left.hour === right.hour && left.minute === right.minute;
}

function offsetAt(instant: number, timeZone: string): number {
  const parts = partsInTimeZone(instant, timeZone);
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute) - instant;
}

/** Resolves a wall-clock choice to an instant; DST gaps are rejected and repeated times use their earlier occurrence. */
export function resolveLocalReminderTime(localDateTime: string, timeZone: string): string | undefined {
  const desired = parseLocalDateTime(localDateTime);
  if (!desired || !notificationTimeZoneSchema.safeParse(timeZone).success) return undefined;
  const wallClockAsUtc = Date.UTC(desired.year, desired.month - 1, desired.day, desired.hour, desired.minute);
  const offsets = new Set<number>();
  for (const hours of [-36, -24, -12, 0, 12, 24, 36]) offsets.add(offsetAt(wallClockAsUtc + hours * 3_600_000, timeZone));

  const candidates = [...offsets]
    .map((offset) => wallClockAsUtc - offset)
    .filter((instant) => sameLocalTime(partsInTimeZone(instant, timeZone), desired))
    .sort((left, right) => left - right);
  return candidates[0] === undefined ? undefined : new Date(candidates[0]).toISOString();
}

export function cancelReminder(reminder: Reminder, cancelledAt: string): Reminder {
  if (reminder.state !== "scheduled") return reminder;
  return reminderSchema.parse({ ...reminder, state: "cancelled", cancelledAt, updatedAt: cancelledAt });
}

export function fulfillReminder(reminder: Reminder, fulfilledAt: string): Reminder {
  if (reminder.state !== "scheduled") return reminder;
  return reminderSchema.parse({ ...reminder, state: "fulfilled", fulfilledAt, updatedAt: fulfilledAt });
}

export function isReminderDue(reminder: Reminder, now: string): boolean {
  return reminder.state === "scheduled" && Date.parse(reminder.scheduledFor) <= Date.parse(now);
}

/** Channel consent is evaluated after event generation so delivery remains separate from business events. */
export function preferencesAllowEmail(event: NotificationEvent, preferences: NotificationPreferences): boolean {
  if (!preferences.emailEnabled) return false;
  return event.type === "reminder-due"
    ? preferences.deadlineRemindersEnabled
    : preferences.criticalUpdatesEnabled;
}

export function createReminderDueEvent(
  reminder: Reminder,
  eventId: string,
  createdAt: string,
): NotificationEvent | undefined {
  if (!isReminderDue(reminder, createdAt)) return undefined;
  return notificationEventSchema.parse({
    id: eventId,
    userId: reminder.userId,
    type: "reminder-due",
    deduplicationKey: `reminder-due:${reminder.id}`,
    createdAt,
    payload: { reminderId: reminder.id, title: reminder.title, scheduledFor: reminder.scheduledFor },
  });
}
