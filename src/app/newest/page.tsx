"use client";

import Story from "@/components/item";
import { useEffect, useState } from "react";

export default function Home() {
  const [topStories, setStories] = useState<any>(null);
  const page = 1;

  useEffect(() => {
    async function fetchStories() {
      const stories = await fetch(
        "https://hacker-news.firebaseio.com/v0/newstories.json"
      ).then((res) => res.json());
      setStories(stories);
    }
    fetchStories();
  }, []);

  if (!topStories) {
    return <></>;
  }

  return (
    <div
      className={["flex flex-col gap-2.5 p-3 overflow-y-auto"].join(" ")}
      style={{ fontFamily: "Geist" }}
    >
      {topStories.slice((page - 1) * 30, page * 30).map((id: number) => (
        <Story key={id} id={id} />
      ))}
    </div>
  );
}
