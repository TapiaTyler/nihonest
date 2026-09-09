export const accountContentOwnerStorageKey = "nihonest:account-content-owner:v1";

type StorageAdapter = Pick<Storage, "getItem" | "setItem">;

function availableStorage(): StorageAdapter | undefined {
  return typeof window === "undefined" ? undefined : window.localStorage;
}

export function readAccountContentOwner(storage: StorageAdapter | undefined = availableStorage()): string | undefined {
  try {
    return storage?.getItem(accountContentOwnerStorageKey) || undefined;
  } catch {
    return undefined;
  }
}

export function writeAccountContentOwner(userId: string, storage: StorageAdapter | undefined = availableStorage()): void {
  try {
    storage?.setItem(accountContentOwnerStorageKey, userId);
  } catch {
    // Account synchronization remains optional when browser storage is unavailable.
  }
}
