export type UiMode = "ios" | "classic";

export const UI_MODE_COOKIE = "ui-mode";
export const DEFAULT_UI_MODE: UiMode = "ios";

export function normalizeUiMode(value: string | undefined | null): UiMode {
  return value === "classic" ? "classic" : value === "ios" ? "ios" : DEFAULT_UI_MODE;
}

/** Read the current UI mode on the client (falls back to the default during SSR). */
export function getUiMode(): UiMode {
  if (typeof document === "undefined") return DEFAULT_UI_MODE;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${UI_MODE_COOKIE}=`));
  return normalizeUiMode(match?.split("=")[1]);
}

/** Persist the UI mode in a cookie and reload so the server re-renders the right tree. */
export function setUiMode(mode: UiMode): void {
  if (typeof document === "undefined") return;
  // 1 year, site-wide.
  document.cookie = `${UI_MODE_COOKIE}=${mode}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  window.location.reload();
}
