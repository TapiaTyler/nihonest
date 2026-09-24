import { storedValue, type KeyValueStore } from "./key-value-store";

export const accountContentOwnerStorageKey = "nihonest:account-content-owner:v1";
const accountContentOwner = storedValue(accountContentOwnerStorageKey);

export function readAccountContentOwner(storage: KeyValueStore | undefined = accountContentOwner.store()): string | undefined {
  return accountContentOwner.read(storage) || undefined;
}

export function writeAccountContentOwner(userId: string, storage: KeyValueStore | undefined = accountContentOwner.store()): void {
  accountContentOwner.write(userId, storage);
}
