import { describe, expect, it } from "vitest";
import { getInterfaceMessage } from "./interface-messages";

describe("interface messages", () => {
  it("provides stable English and Japanese labels through the same IDs", () => {
    expect(getInterfaceMessage("en", "navigation.explore")).toBe("Explore");
    expect(getInterfaceMessage("ja", "navigation.explore")).toBe("ガイドを探す");
    expect(getInterfaceMessage("ja", "translation.machineTitle")).toBe("機械翻訳された日本語");
  });
});

