"use client";

import { useEffect, useState } from "react";
import { IonIcon, IonItem, IonLabel, IonNote } from "@ionic/react";
import {
  arrowUpOutline,
  chatbubbleOutline,
  openOutline,
  timeOutline,
} from "ionicons/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { domainOf, getItem, HNItem } from "@/lib/hn";
import StoryItemSkeleton from "./StoryItemSkeleton";

dayjs.extend(relativeTime);

interface StoryItemProps {
  id: number;
  rank?: number;
}

export default function StoryItem({ id, rank }: StoryItemProps) {
  const [story, setStory] = useState<HNItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getItem(id)
      .then((data) => active && setStory(data))
      .catch(() => active && setStory(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <StoryItemSkeleton />;
  if (!story || story.deleted || story.dead) return null;

  const domain = domainOf(story.url);

  const openExternal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (story.url) window.open(story.url, "_blank", "noopener");
  };

  return (
    <IonItem button detail routerLink={`/${story.id}`} routerDirection="forward">
      <IonLabel className="ion-text-wrap story-label">
        <h2 className="story-title">{story.title}</h2>
        {domain && (
          <span className="story-domain">
            {domain}
            <button
              type="button"
              className="story-open"
              onClick={openExternal}
              aria-label={`Open ${domain} in a new tab`}
            >
              <IonIcon icon={openOutline} />
            </button>
          </span>
        )}
        <IonNote className="story-meta">
          {typeof rank === "number" && <span className="story-rank">{rank}</span>}
          <span>
            <IonIcon icon={arrowUpOutline} /> {story.score ?? 0}
          </span>
          <span>
            <IonIcon icon={chatbubbleOutline} /> {story.descendants ?? 0}
          </span>
          <span>
            <IonIcon icon={timeOutline} /> {dayjs((story.time ?? 0) * 1000).fromNow()}
          </span>
          {story.by && <span className="story-author">by {story.by}</span>}
        </IonNote>
      </IonLabel>
    </IonItem>
  );
}
