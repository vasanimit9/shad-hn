'use client';

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);

interface IStoryProps {
  id: number;
}

export default function Story(props: IStoryProps) {
  const [storyData, setStoryData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStory() {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${props.id}.json`
        );
        if (!response.ok) throw new Error("Failed to fetch story");
        const responseJson = await response.json();
        setStoryData(responseJson);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchStory();
  }, [props.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center mx-auto max-w-screen-md w-full">
        <div className="flex flex-col w-full gap-2 mb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <Separator className="p-0 m-0" />
      </div>
    );
  }

  if (error || !storyData) {
    return (
      <div className="flex flex-col items-center mx-auto max-w-screen-md w-full">
        <div className="flex flex-col w-full py-4 text-muted-foreground text-sm">
          Failed to load story
        </div>
        <Separator className="p-0 m-0" />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center mx-auto max-w-screen-md w-full"
      style={{ fontFamily: "Geist" }}
    >
      <div className="flex flex-col w-full">
        <div className="text-lg">{storyData?.title}</div>
        {/* <div className=" text-stone-500 mb-1 underline">
          {
            storyData?.url
              ?.replace("http://", "")
              .replace("https://", "")
              .split("/")[0]
          }
        </div> */}
        <div className="text-stone-400 mb-2 flex gap-1 md:max-w-[320px] h-5">
          <span className="flex-1 overflow-ellipsis overflow-hidden line-clamp-1">
            {storyData?.by}
          </span>
        </div>
        <div className="text-sm text-stone-400 mb-2 flex gap-3 md:max-w-[320px] h-5">
          <span className="flex-1" aria-label="Score">🔼 {storyData?.score}</span>
          <span className="flex-1" aria-label="Comments">💬 {storyData?.descendants || 0}</span>
          <span className="flex-4" aria-label="Time posted">
            🕰️ {dayjs((storyData?.time || 0) * 1000).fromNow()}
          </span>
        </div>
        <div className="flex mb-2 gap-2">
          {storyData?.url && (
            <Link className="max-md:flex-1 flex" href={storyData?.url}>
              <Button variant="default" className="flex-1" size="sm">
                Read
              </Button>
            </Link>
          )}
          <Link className="max-md:flex-1 flex" href={`/${storyData?.id}`}>
            <Button variant="outline" className="flex-1" size="sm">
              Discuss
            </Button>
          </Link>
        </div>
      </div>
      <Separator className="p-0 m-0" />
    </div>
  );
}
