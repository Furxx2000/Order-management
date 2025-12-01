import { describe, it, expect } from "vitest";
import { fuzzyMatch } from "./utils";

describe("utils", () => {
  describe("fuzzyMatch", () => {
    it("returns true for empty query", () => {
      expect(fuzzyMatch("", "anything")).toBe(true);
    });

    it("returns false if query is longer than text", () => {
      expect(fuzzyMatch("longer", "short")).toBe(false);
    });

    it("matches exact string", () => {
      expect(fuzzyMatch("test", "test")).toBe(true);
    });

    it("matches case-insensitive", () => {
      expect(fuzzyMatch("TEST", "test")).toBe(true);
      expect(fuzzyMatch("test", "TEST")).toBe(true);
    });

    it("matches subsequence", () => {
      expect(fuzzyMatch("tst", "test")).toBe(true);
      expect(fuzzyMatch("abc", "axbycz")).toBe(true);
    });

    it("returns false for non-match", () => {
      expect(fuzzyMatch("abc", "ab")).toBe(false);
      expect(fuzzyMatch("xyz", "abc")).toBe(false);
    });
  });
});
