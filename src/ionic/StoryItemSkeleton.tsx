"use client";

import { IonItem, IonLabel, IonSkeletonText } from "@ionic/react";

export default function StoryItemSkeleton() {
  return (
    <IonItem>
      <IonLabel>
        <h2>
          <IonSkeletonText animated style={{ width: "85%" }} />
        </h2>
        <p>
          <IonSkeletonText animated style={{ width: "40%" }} />
        </p>
        <p>
          <IonSkeletonText animated style={{ width: "60%" }} />
        </p>
      </IonLabel>
    </IonItem>
  );
}
