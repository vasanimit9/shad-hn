// Shared Hacker News Firebase API client + in-memory item cache.
// Used by the Ionic iOS theme; safe to call from the classic theme too.

const API_BASE = "https://hacker-news.firebaseio.com/v0";

export type Feed = "top" | "best" | "newest";

const FEED_ENDPOINTS: Record<Feed, string> = {
  top: "topstories",
  best: "beststories",
  newest: "newstories",
};

export interface HNItem {
  id: number;
  type?: "story" | "comment" | "job" | "poll" | "pollopt";
  by?: string;
  time?: number;
  title?: string;
  url?: string;
  text?: string;
  score?: number;
  descendants?: number;
  kids?: number[];
  deleted?: boolean;
  dead?: boolean;
}

// Mirrors the in-memory cache that previously lived in Comment.tsx so repeated
// renders (and shared stories between feeds) don't re-fetch.
const itemCache = new Map<number, HNItem>();

export async function getFeed(feed: Feed): Promise<number[]> {
  const res = await fetch(`${API_BASE}/${FEED_ENDPOINTS[feed]}.json`);
  if (!res.ok) throw new Error("Failed to fetch stories");
  return res.json();
}

export async function getItem(id: number): Promise<HNItem | null> {
  const cached = itemCache.get(id);
  if (cached) return cached;

  const res = await fetch(`${API_BASE}/item/${id}.json`);
  if (!res.ok) throw new Error(`Failed to fetch item ${id}`);
  const data: HNItem | null = await res.json();
  if (data) itemCache.set(id, data);
  return data;
}

/** Extract a bare domain (e.g. "example.com") from a story URL. */
export function domainOf(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}
