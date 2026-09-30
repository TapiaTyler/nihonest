import type { AccountContentState } from "@/domain/sync/account-content-state";

export type AccountContentSyncResult =
  | Readonly<{ ok: true; state: AccountContentState }>
  | Readonly<{ ok: false; message: string }>;

export type AccountContentSnapshot = Readonly<{
  savedContent: string;
  glossaryProgress: string;
  checklistProgress: string;
}>;

export type AccountContentSyncStatus = Readonly<{
  status: "inactive" | "synchronizing" | "synchronized" | "error";
  errorMessage?: string;
}>;
