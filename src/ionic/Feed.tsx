"use client";

import { useCallback, useEffect, useState } from "react";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import { phonePortraitOutline } from "ionicons/icons";

import { Feed as FeedType, getFeed } from "@/lib/hn";
import { setUiMode } from "@/lib/ui-mode";
import StoryItem from "./StoryItem";
import StoryItemSkeleton from "./StoryItemSkeleton";

const PAGE_SIZE = 20;

interface FeedProps {
  feed: FeedType;
  title: string;
}

export default function Feed({ feed, title }: FeedProps) {
  const [ids, setIds] = useState<number[] | null>(null);
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const load = useCallback(async () => {
    try {
      setError(false);
      const result = await getFeed(feed);
      setIds(result);
    } catch {
      setError(true);
      setIds([]);
    }
  }, [feed]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRefresh = useCallback(
    async (event: CustomEvent<RefresherEventDetail>) => {
      setVisible(PAGE_SIZE);
      await load();
      event.detail.complete();
    },
    [load],
  );

  const loadMore = useCallback(
    (event: CustomEvent<void>) => {
      setVisible((v) => v + PAGE_SIZE);
      (event.target as HTMLIonInfiniteScrollElement).complete();
    },
    [],
  );

  const visibleIds = ids?.slice(0, visible) ?? [];
  const hasMore = !!ids && visible < ids.length;

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            <button
              type="button"
              className="theme-switch-btn"
              onClick={() => setUiMode("classic")}
              aria-label="Switch to classic theme"
              title="Switch to classic (shadcn) theme"
            >
              <IonIcon icon={phonePortraitOutline} />
            </button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {ids === null && (
          <IonList>
            {Array.from({ length: 10 }).map((_, i) => (
              <StoryItemSkeleton key={i} />
            ))}
          </IonList>
        )}

        {error && (
          <div className="feed-message">
            <IonText color="medium">Failed to load stories. Pull to refresh.</IonText>
          </div>
        )}

        {ids !== null && (
          <IonList>
            {visibleIds.map((id, index) => (
              <StoryItem key={id} id={id} rank={index + 1} />
            ))}
          </IonList>
        )}

        <IonInfiniteScroll disabled={!hasMore} onIonInfinite={loadMore}>
          <IonInfiniteScrollContent loadingText="Loading more stories…" />
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
}
