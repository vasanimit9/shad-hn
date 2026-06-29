"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonNote,
  IonPage,
  IonSkeletonText,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrowUpOutline, chatbubbleOutline, openOutline } from "ionicons/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { domainOf, getItem, HNItem } from "@/lib/hn";
import Comment from "./Comment";

dayjs.extend(relativeTime);

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<HNItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getItem(Number(id))
      .then((data) => active && setStory(data))
      .catch(() => active && setStory(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const domain = domainOf(story?.url);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="Back" />
          </IonButtons>
          <IonTitle>Discussion</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              {loading ? <IonSkeletonText animated style={{ width: "90%" }} /> : story?.title}
            </IonCardTitle>
            <IonCardSubtitle className="detail-subtitle">
              {story?.by && <span>by {story.by}</span>}
              {story?.url && (
                <a href={story.url} target="_blank" rel="noopener noreferrer">
                  {domain} <IonIcon icon={openOutline} />
                </a>
              )}
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonNote className="detail-meta">
              <span>
                <IonIcon icon={arrowUpOutline} /> {story?.score ?? 0} points
              </span>
              <span>
                <IonIcon icon={chatbubbleOutline} /> {story?.descendants ?? 0} comments
              </span>
              {story?.time && <span>{dayjs(story.time * 1000).fromNow()}</span>}
            </IonNote>
            {story?.text && (
              <div
                className="detail-text"
                dangerouslySetInnerHTML={{ __html: story.text }}
              />
            )}
          </IonCardContent>
        </IonCard>

        {!loading && story?.kids?.length ? (
          <div className="comments">
            {story.kids.map((kid) => (
              <Comment key={kid} id={kid} level={0} />
            ))}
          </div>
        ) : null}

        {!loading && !story?.kids?.length && (
          <div className="feed-message">
            <IonText color="medium">No comments yet.</IonText>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}
