import { describe, it, expect } from "vitest";
import { getThreshold, isOverThreshold, SKU_LIMITS } from "./geo-quota";

describe("getThreshold", () => {
  it("returns 80% of limit rounded down", () => {
    expect(getThreshold(10000)).toBe(8000);
    expect(getThreshold(5000)).toBe(4000);
    expect(getThreshold(1)).toBe(0);
    expect(getThreshold(0)).toBe(0);
  });
});

describe("isOverThreshold", () => {
  it("returns false below threshold", () => {
    expect(isOverThreshold(0, 10000)).toBe(false);
    expect(isOverThreshold(7999, 10000)).toBe(false);
  });

  it("returns true at or above threshold", () => {
    expect(isOverThreshold(8000, 10000)).toBe(true);
    expect(isOverThreshold(9999, 10000)).toBe(true);
    expect(isOverThreshold(10000, 10000)).toBe(true);
  });

  it("returns true for any usage when threshold is 0", () => {
    expect(isOverThreshold(1, 1)).toBe(true);
  });
});

describe("SKU_LIMITS", () => {
  it("all skus have limits set", () => {
    expect(SKU_LIMITS.geocoding).toBe(10000);
    expect(SKU_LIMITS.autocomplete).toBe(10000);
    expect(SKU_LIMITS.maps).toBe(10000);
  });
});
