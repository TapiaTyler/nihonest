import { describe, expect, it } from "vitest";
import { safeAuthReturnPath } from "./return-path";

describe("safeAuthReturnPath", () => {
  it("keeps an internal path", () => {
    expect(safeAuthReturnPath("/account")).toBe("/account");
  });

  it.each([null, undefined, "https://example.com", "//example.com", "account"])(
    "rejects external or malformed return value %s",
    (value) => expect(safeAuthReturnPath(value)).toBe("/account"),
  );
});
