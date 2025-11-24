import { useState, useEffect } from "react";

/**
 * Custom hook for tracking the state of a CSS media query.
 * @param query The media query string to watch (e.g., '(min-width: 768px)').
 * @returns `true` if the media query currently matches, otherwise `false`.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure window.matchMedia is available to prevent SSR errors
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const media = window.matchMedia(query);

    const listener = () => {
      setMatches(media.matches);
    };

    listener();

    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
};
