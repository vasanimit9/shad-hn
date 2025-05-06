"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import classNames from "classnames";
import { Separator } from "./ui/separator";

interface ICommentProps {
  id: number;
  level?: number;
}

const commentDataCache: Record<number, any> = {};

export default function Comment({ id, level = 0 }: ICommentProps) {
  const [commentData, setCommentData] = useState<any>(null);
  const [showReplies, setShowReplies] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCommentData() {
      if (commentDataCache[id]) {
        setCommentData(commentDataCache[id]);
        setLoading(false);
        return;
      }

      const res = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      const data = await res.json();

      commentDataCache[id] = data;
      setCommentData(data);
      setLoading(false);
    }

    fetchCommentData();
  }, [id]);

  const toggleReplies = useCallback(() => {
    setShowReplies((prev) => !prev);
  }, []);

  if (loading) {
    return (
      <div className={classNames(`pl-${Math.min(level, 6) * 4}`, "py-2")}>
        <Skeleton className="h-20 w-full rounded-md" />
      </div>
    );
  }

  if (!commentData || commentData.deleted || commentData.dead) {
    return (
      <div
        className={classNames(
          `pl-${Math.min(level, 6) * 4}`,
          "py-2 text-muted-foreground italic text-sm"
        )}
      >
        [comment unavailable]
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "py-3 w-full",
        "max-md:max-w-screen max-w-screen-md"
      )}
      style={{ fontFamily: "Geist" }}
    >
      <div
        style={{ paddingLeft: `${level * 16}px` }}
        className="text-xs text-muted-foreground mb-1 flex justify-between px-2"
      >
        <span>{commentData.by}</span>
        <span>{new Date(commentData.time * 1000).toLocaleTimeString()}</span>
      </div>

      <div
        style={{ paddingLeft: `${level * 16}px` }}
        className={[
          "prose",
          "prose-neutral",
          "dark:prose-invert",
          "max-w-none",
          "mb-2",
          "px-2",
        ].join(" ")}
        dangerouslySetInnerHTML={{ __html: commentData.text ?? "" }}
      />

      {commentData.kids?.length > 0 && (
        <Button
          variant="outline"
          className={"mb-4"}
          onClick={toggleReplies}
          style={{ fontFamily: "Geist", marginLeft: `${level * 16}px` }}
        >
          {showReplies
            ? `Hide replies (${commentData.kids.length})`
            : `Show replies (${commentData.kids.length})`}
        </Button>
      )}
      <Separator style={{ marginLeft: `${level * 16}px` }} />
      {showReplies && commentData.kids?.length > 0 && (
        <div className="mt-2">
          {commentData.kids.map((kidId: number) => (
            <Comment key={kidId} id={kidId} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
