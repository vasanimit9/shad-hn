// import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Separator } from "./ui/separator";
import Link from 'next/link'

dayjs.extend(relativeTime);

interface IStoryProps {
  id: number;
}

export default async function Story(props: IStoryProps) {

  const storyData = await fetch(`https://hacker-news.firebaseio.com/v0/item/${props.id}.json`)
  .then((res) => res.json())

  if (!storyData) {
    return <></>;
  }

  return (
    <div className="flex flex-col items-center mx-auto max-w-screen-md w-full">
      <Link
        href={`/${storyData?.id}`}
        className="flex flex-col w-full"
      >
        <div className=" mb-1">{storyData?.title}</div>
        <div className=" text-stone-500 mb-1" >{storyData?.url?.replace('http://', '').replace('https://', '').split('/')[0]}</div>
        <div className="text-sm text-stone-400 mb-2 flex gap-3">
          <span>🕰️ {dayjs((storyData?.time || 0) * 1000).fromNow()}</span>
          <span>🔼 {storyData?.score}</span>
          <span>💬 {storyData?.descendants}</span>
        </div>
      </Link>
      <Separator className="p-0 m-0" />
    </div>
  );
}
