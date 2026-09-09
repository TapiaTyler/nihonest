"use client";

import {
  createDefaultNotificationPreferences,
  notificationPreferencesSchema,
  reminderSchema,
  reminderTargetSchema,
  resolveLocalReminderTime,
  type NotificationPreferences,
  type Reminder,
} from "@/domain/notifications/notifications";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type ReminderRow = Database["public"]["Tables"]["reminders"]["Row"];
export type NotificationDataResult<T> = Readonly<{ ok: true; data: T }> | Readonly<{ ok: false; message: string }>;

export type ReminderDraft = Readonly<{
  userId: string;
  title: string;
  target: Reminder["target"];
  localDateTime: string;
  timeZone: string;
}>;

function unavailable<T>(): NotificationDataResult<T> {
  return { ok: false, message: "Reminder services are not configured in this environment." };
}

function reminderFromRow(row: ReminderRow): Reminder | undefined {
  const target = row.target_kind === "custom"
    ? { kind: "custom" as const }
    : { kind: row.target_kind, id: row.target_id };
  const parsed = reminderSchema.safeParse({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    target,
    scheduledFor: new Date(row.scheduled_for).toISOString(),
    timeZone: row.time_zone,
    state: row.state,
    cancelledAt: row.cancelled_at ? new Date(row.cancelled_at).toISOString() : undefined,
    fulfilledAt: row.fulfilled_at ? new Date(row.fulfilled_at).toISOString() : undefined,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  });
  return parsed.success ? parsed.data : undefined;
}

export function browserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export async function loadNotificationPreferences(userId: string): Promise<NotificationDataResult<NotificationPreferences>> {
  const client = getSupabaseBrowserClient();
  if (!client) return unavailable();
  const { data, error } = await client.from("notification_preferences").select("*").eq("user_id", userId).maybeSingle();
  if (error) return { ok: false, message: "Notification preferences could not be loaded." };
  if (!data) return { ok: true, data: createDefaultNotificationPreferences(browserTimeZone(), new Date().toISOString()) };

  const parsed = notificationPreferencesSchema.safeParse({
    emailEnabled: data.email_enabled,
    deadlineRemindersEnabled: data.deadline_reminders_enabled,
    criticalUpdatesEnabled: data.critical_updates_enabled,
    timeZone: data.time_zone,
    updatedAt: new Date(data.updated_at).toISOString(),
  });
  return parsed.success
    ? { ok: true, data: parsed.data }
    : { ok: false, message: "Notification preferences were returned in an unexpected format." };
}

export async function saveNotificationPreferences(
  userId: string,
  preferences: Omit<NotificationPreferences, "updatedAt">,
): Promise<NotificationDataResult<NotificationPreferences>> {
  const client = getSupabaseBrowserClient();
  if (!client) return unavailable();
  const parsed = notificationPreferencesSchema.safeParse({ ...preferences, updatedAt: new Date().toISOString() });
  if (!parsed.success) return { ok: false, message: "Choose a valid time zone before saving notification preferences." };

  const { error } = await client.from("notification_preferences").upsert({
    user_id: userId,
    email_enabled: parsed.data.emailEnabled,
    deadline_reminders_enabled: parsed.data.deadlineRemindersEnabled,
    critical_updates_enabled: parsed.data.criticalUpdatesEnabled,
    time_zone: parsed.data.timeZone,
    updated_at: parsed.data.updatedAt,
  }, { onConflict: "user_id" });
  return error
    ? { ok: false, message: "Notification preferences could not be saved." }
    : { ok: true, data: parsed.data };
}

export async function loadScheduledReminders(userId: string): Promise<NotificationDataResult<readonly Reminder[]>> {
  const client = getSupabaseBrowserClient();
  if (!client) return unavailable();
  const { data, error } = await client.from("reminders").select("*").eq("user_id", userId).eq("state", "scheduled").order("scheduled_for");
  if (error) return { ok: false, message: "Upcoming reminders could not be loaded." };
  const reminders = data.map(reminderFromRow);
  return reminders.every(Boolean)
    ? { ok: true, data: reminders as Reminder[] }
    : { ok: false, message: "Upcoming reminders were returned in an unexpected format." };
}

export async function createScheduledReminder(draft: ReminderDraft): Promise<NotificationDataResult<Reminder>> {
  const client = getSupabaseBrowserClient();
  if (!client) return unavailable();
  const target = reminderTargetSchema.safeParse(draft.target);
  const scheduledFor = resolveLocalReminderTime(draft.localDateTime, draft.timeZone);
  if (!target.success || !draft.title.trim() || draft.title.trim().length > 120 || !scheduledFor) {
    return { ok: false, message: "Enter a title, valid date and time, and valid time zone." };
  }
  if (Date.parse(scheduledFor) <= Date.now()) return { ok: false, message: "Choose a reminder time in the future." };

  const { data, error } = await client.from("reminders").insert({
    user_id: draft.userId,
    title: draft.title.trim(),
    target_kind: target.data.kind,
    target_id: target.data.kind === "custom" ? null : target.data.id,
    scheduled_for: scheduledFor,
    time_zone: draft.timeZone,
  }).select("*").single();
  if (error || !data) return { ok: false, message: "The reminder could not be created." };
  const reminder = reminderFromRow(data);
  return reminder
    ? { ok: true, data: reminder }
    : { ok: false, message: "The saved reminder was returned in an unexpected format." };
}

export async function cancelScheduledReminder(userId: string, reminderId: string): Promise<NotificationDataResult<undefined>> {
  const client = getSupabaseBrowserClient();
  if (!client) return unavailable();
  const cancelledAt = new Date().toISOString();
  const { error } = await client.from("reminders").update({
    state: "cancelled",
    cancelled_at: cancelledAt,
    fulfilled_at: null,
    updated_at: cancelledAt,
  }).eq("user_id", userId).eq("id", reminderId).eq("state", "scheduled");
  return error
    ? { ok: false, message: "The reminder could not be cancelled." }
    : { ok: true, data: undefined };
}
