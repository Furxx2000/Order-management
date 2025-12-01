import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "react";
import { useMediaQuery } from "./useMediaQuery";

describe("useMediaQuery", () => {
  let matchMediaMock: {
    matches: boolean;
    media: string;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Create a mock matchMedia object
    matchMediaMock = {
      matches: false,
      media: "",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    // Mock window.matchMedia
    window.matchMedia = vi.fn().mockImplementation((query) => {
      matchMediaMock.media = query;
      return matchMediaMock;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false initially when media query does not match", () => {
    matchMediaMock.matches = false;

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toBe(false);
  });

  it("returns true when media query matches", () => {
    matchMediaMock.matches = true;

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toBe(true);
  });

  it("sets up event listener on mount", () => {
    renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(matchMediaMock.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("removes event listener on unmount", () => {
    const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    unmount();

    expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("updates when media query changes", () => {
    matchMediaMock.matches = false;

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toBe(false);

    // Simulate media query change
    act(() => {
      matchMediaMock.matches = true;
      const changeListener = matchMediaMock.addEventListener.mock
        .calls[0][1] as () => void;
      changeListener();
    });

    expect(result.current).toBe(true);
  });

  it("handles multiple media query changes", () => {
    matchMediaMock.matches = false;

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toBe(false);

    // First change: match
    act(() => {
      matchMediaMock.matches = true;
      const changeListener = matchMediaMock.addEventListener.mock
        .calls[0][1] as () => void;
      changeListener();
    });

    expect(result.current).toBe(true);

    // Second change: no match
    act(() => {
      matchMediaMock.matches = false;
      const changeListener = matchMediaMock.addEventListener.mock
        .calls[0][1] as () => void;
      changeListener();
    });

    expect(result.current).toBe(false);
  });

  it("handles different media queries", () => {
    const queries = [
      "(min-width: 768px)",
      "(max-width: 1024px)",
      "(orientation: portrait)",
      "(prefers-color-scheme: dark)",
    ];

    queries.forEach((query) => {
      matchMediaMock.matches = true;
      const { result } = renderHook(() => useMediaQuery(query));

      expect(window.matchMedia).toHaveBeenCalledWith(query);
      expect(result.current).toBe(true);
    });
  });

  it("updates event listener when query changes", () => {
    const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: "(min-width: 768px)" },
    });

    expect(matchMediaMock.addEventListener).toHaveBeenCalledTimes(1);

    // Change query
    rerender({ query: "(max-width: 1024px)" });

    // Should remove old listener and add new one
    expect(matchMediaMock.removeEventListener).toHaveBeenCalledTimes(1);
    expect(matchMediaMock.addEventListener).toHaveBeenCalledTimes(2);
  });

  it("handles SSR environment (no window.matchMedia)", () => {
    // Save original matchMedia
    const originalMatchMedia = window.matchMedia;

    // Remove matchMedia to simulate SSR
    // @ts-expect-error - intentionally setting to undefined for test
    delete window.matchMedia;

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    // Should return false and not crash
    expect(result.current).toBe(false);

    // Restore matchMedia
    window.matchMedia = originalMatchMedia;
  });

  it("handles matchMedia returning undefined (browser compatibility)", () => {
    // Mock matchMedia to not be a function
    // @ts-expect-error - intentionally setting to non-function for test
    window.matchMedia = "not a function";

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    // Should return false and not crash
    expect(result.current).toBe(false);
  });

  it("calls window.matchMedia with correct query", () => {
    const query = "(min-width: 768px)";

    renderHook(() => useMediaQuery(query));

    expect(window.matchMedia).toHaveBeenCalledWith(query);
  });

  it("maintains state across re-renders when query doesn't change", () => {
    matchMediaMock.matches = true;

    const { result, rerender } = renderHook(() =>
      useMediaQuery("(min-width: 768px)")
    );

    expect(result.current).toBe(true);

    // Re-render without changing query
    rerender();

    expect(result.current).toBe(true);
  });
});
