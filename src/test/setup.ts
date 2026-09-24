import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { provideJapaneseInterfaceMessages } from "@/components/localization/japanese-interface-messages";
import { japaneseInterfaceMessages } from "@/domain/localization/interface-message-catalogs/japanese";

// Component tests render Japanese synchronously; the lazy chunk load is covered by its own test.
provideJapaneseInterfaceMessages(japaneseInterfaceMessages);

afterEach(() => {
  cleanup();
});
