'use server';

import Story from "@/components/item";

export default async function Home() {
  const topStories = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    {
      next: {
        revalidate: 300,
      },
    }
  ).then((res) => res.json());
  const page = 1;
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
