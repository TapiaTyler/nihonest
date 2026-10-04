import { describe, expect, it } from "vitest";
import { isSameSiteRelativePath, safeAuthReturnPath } from "./return-path";

describe("safeAuthReturnPath", () => {
  it("keeps internal paths with their query and fragment", () => {
    expect(safeAuthReturnPath("/account")).toBe("/account");
    expect(safeAuthReturnPath("/account?tab=privacy#delete")).toBe("/account?tab=privacy#delete");
    expect(safeAuthReturnPath("/articles/artist-status")).toBe("/articles/artist-status");
  });

  it("returns the normalized path for harmless dot segments", () => {
    expect(safeAuthReturnPath("/./account")).toBe("/account");
    expect(safeAuthReturnPath("/articles/../account")).toBe("/account");
    expect(safeAuthReturnPath("/a/../../saved")).toBe("/saved");
  });

  it.each([null, undefined, "", "https://example.com", "//example.com", "account", "http:/example.com"])(
    "rejects external or malformed return value %s",
    (value) => expect(safeAuthReturnPath(value)).toBe("/account"),
  );

  it.each([
    "/account/..//attacker.example",
    "/account/%2e%2e//attacker.example",
    "/account/%2E%2E//attacker.example/path?x=1",
    "/x/./..//attacker.example",
    "/\\attacker.example",
    "/account\\..\\..\\attacker.example",
    "/account\n//attacker.example",
    "/account\t",
  ])("rejects %j, which could normalize to another host", (value) => {
    expect(safeAuthReturnPath(value)).toBe("/account");
  });

  it("keeps percent-encoded slashes and backslashes as harmless path text", () => {
    expect(safeAuthReturnPath("/%2F%2Fattacker.example")).toBe("/%2F%2Fattacker.example");
    expect(safeAuthReturnPath("/%5Cattacker.example")).toBe("/%5Cattacker.example");
  });
});

describe("isSameSiteRelativePath", () => {
  it("allows only a single leading slash", () => {
    expect(isSameSiteRelativePath("/account")).toBe(true);
    expect(isSameSiteRelativePath("//attacker.example")).toBe(false);
    expect(isSameSiteRelativePath("/\\attacker.example")).toBe(false);
    expect(isSameSiteRelativePath("account")).toBe(false);
  });
});
