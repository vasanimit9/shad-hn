"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Comment from "@/components/Comment";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Story(props: any) {
  const params = await props.params;
  const storyData = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${params.id}.json`,
    {
      next: {
        revalidate: 300,
      },
    }
  ).then((res) => res.json());

  return (
    <div
      className="px-3 py-2.5 flex flex-col items-center w-full overflow-y-auto overflow-x-hidden"
      style={{ fontFamily: "Geist" }}
    >
      <Card className="max-w-screen-md w-full mb-4">
        <CardHeader>
          <CardTitle>{storyData?.title}</CardTitle>
          <CardDescription className="flex gap-2">
            <div>👤 {storyData?.by}</div>
            <a
              href={storyData?.url}
              className="underline text-gray-500 text-sm"
              target="_blank"
            >
              {
                storyData?.url
                  ?.replace("http://", "")
                  .replace("https://", "")
                  .split("/")[0]
              }
            </a>
          </CardDescription>
        </CardHeader>
        {!!storyData?.text && (
          <CardContent className="markdown-content">
            <style
              dangerouslySetInnerHTML={{
                __html: `
            .markdown-content p {
              margin: 8px 0;  
            }
            `,
              }}
            />
            <span
              dangerouslySetInnerHTML={{
                __html: storyData?.text || "",
              }}
            />
          </CardContent>
        )}
      </Card>
      {storyData?.kids?.map((kid: number) => (
        <Comment id={kid} key={kid} />
      ))}
      {!storyData?.kids?.length && (
        <div className="h-64 w-full flex justify-center items-center">
          No comments yet
        </div>
      )}
    </div>
  );
}
