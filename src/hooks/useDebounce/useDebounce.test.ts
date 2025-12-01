import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "react";
import useDebounce from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("updates value after delay", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    expect(result.current).toBe("initial");

    // Update value
    rerender({ value: "updated", delay: 500 });

    // Value should still be the old one
    expect(result.current).toBe("initial");

    // Fast-forward time
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Value should be updated now
    expect(result.current).toBe("updated");
  });

  it("cancels previous timer when value changes quickly", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: "first" },
      }
    );

    expect(result.current).toBe("first");

    // Change value multiple times quickly
    rerender({ value: "second" });
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: "third" });
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: "fourth" });

    // At this point, only 400ms have passed since the last change
    expect(result.current).toBe("first");

    // Advance the full delay
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Should only update to the latest value
    expect(result.current).toBe("fourth");
  });

  it("uses custom delay", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 1000 },
      }
    );

    rerender({ value: "updated", delay: 1000 });

    // After 500ms, should still be old value
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("initial");

    // After 1000ms, should be updated
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("updated");
  });

  it("handles number values", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: 0 },
      }
    );

    expect(result.current).toBe(0);

    rerender({ value: 42 });
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe(42);
  });

  it("handles boolean values", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: false },
      }
    );

    expect(result.current).toBe(false);

    rerender({ value: true });
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe(true);
  });

  it("handles object values", async () => {
    const initialObj = { name: "Alice" };
    const updatedObj = { name: "Bob" };

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: initialObj },
      }
    );

    expect(result.current).toEqual(initialObj);

    rerender({ value: updatedObj });
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toEqual(updatedObj);
  });

  it("clears timeout on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    const { unmount } = renderHook(() => useDebounce("value", 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("handles delay changes", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    // Change value with original delay
    rerender({ value: "updated", delay: 500 });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    // Change delay before it fires
    rerender({ value: "updated", delay: 1000 });

    // Old timer should be cleared, need to wait full new delay
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("initial");

    // After new delay
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("updated");
  });
});
