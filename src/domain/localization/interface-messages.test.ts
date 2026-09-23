import { describe, expect, it } from "vitest";
import { getInterfaceMessage, localizeServiceMessage } from "./interface-messages";

describe("interface messages", () => {
  it("provides stable English and Japanese labels through the same IDs", () => {
    expect(getInterfaceMessage("en", "navigation.explore")).toBe("Explore");
    expect(getInterfaceMessage("ja", "navigation.explore")).toBe("ガイドを探す");
    expect(getInterfaceMessage("ja", "translation.machineTitle")).toBe("機械翻訳された日本語");
  });

  it("localizes known English service messages and passes unknown text through", () => {
    expect(localizeServiceMessage("ja", "Choose a reminder time in the future.")).toBe("リマインダーの日時は、これから先の日時を選んでください。");
    expect(localizeServiceMessage("en", "Choose a reminder time in the future.")).toBe("Choose a reminder time in the future.");
    expect(localizeServiceMessage("ja", "An unexpected provider error")).toBe("An unexpected provider error");
  });
});
