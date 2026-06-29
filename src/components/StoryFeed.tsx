"use client";

import Story from "@/components/item";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const FEED_ENDPOINTS = {
  top: "topstories",
  best: "beststories",
  newest: "newstories",
} as const;

export type FeedKind = keyof typeof FEED_ENDPOINTS;

const PAGE_SIZE = 30;

/** Paginated story list for the classic (shadcn) theme, shared by every feed. */
export default function StoryFeed({ feed }: { feed: FeedKind }) {
  const [stories, setStories] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    async function fetchStories() {
      try {
        setLoading(true);
        setError(null);
        setPage(1);
        const res = await fetch(
          `https://hacker-news.firebaseio.com/v0/${FEED_ENDPOINTS[feed]}.json`
        );
        if (!res.ok) throw new Error("Failed to fetch stories");
        const data = await res.json();
        if (active) setStories(data);
      } catch (err) {
        if (active)
          setError(err instanceof Error ? err.message : "Failed to load stories");
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchStories();
    return () => {
      active = false;
    };
  }, [feed]);

  const totalPages = stories ? Math.ceil(stories.length / PAGE_SIZE) : 0;
  const currentStories =
    stories?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) || [];

  if (loading) {
    return (
      <div
        className="flex flex-col gap-2.5 p-3 overflow-y-auto"
        style={{ fontFamily: "Geist" }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center mx-auto max-w-screen-md w-full"
          >
            <div className="flex flex-col w-full gap-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full p-8"
        style={{ fontFamily: "Geist" }}
      >
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">Failed to Load Stories</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex flex-col gap-2.5 p-3 overflow-y-auto flex-1"
        style={{ fontFamily: "Geist" }}
      >
        {currentStories.map((id: number) => (
          <Story key={id} id={id} />
        ))}
      </div>

      {totalPages > 1 && (
        <div
          className="border-t p-4 flex justify-center items-center gap-4"
          style={{ fontFamily: "Geist" }}
        >
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
