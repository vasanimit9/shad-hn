"use client";

import { useCallback, useEffect, useState } from "react";
import { IonButton, IonIcon, IonSkeletonText } from "@ionic/react";
import { chevronDownOutline, chevronForwardOutline } from "ionicons/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { getItem, HNItem } from "@/lib/hn";

dayjs.extend(relativeTime);

interface CommentProps {
  id: number;
  level: number;
}

const MAX_INDENT = 6;

export default function Comment({ id, level }: CommentProps) {
  const [data, setData] = useState<HNItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    let active = true;
    getItem(id)
      .then((d) => active && setData(d))
      .catch(() => active && setData(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const toggle = useCallback(() => setShowReplies((p) => !p), []);

  const indent = Math.min(level, MAX_INDENT) * 12;

  if (loading) {
    return (
      <div className="comment" style={{ marginLeft: indent }}>
        <IonSkeletonText animated style={{ width: "30%", height: 12 }} />
        <IonSkeletonText animated style={{ width: "95%" }} />
        <IonSkeletonText animated style={{ width: "80%" }} />
      </div>
    );
  }

  if (!data || data.deleted || data.dead) {
    return (
      <div className="comment comment-unavailable" style={{ marginLeft: indent }}>
        [comment unavailable]
      </div>
    );
  }

  const replyCount = data.kids?.length ?? 0;

  return (
    <div className={`comment level-${Math.min(level, MAX_INDENT)}`} style={{ marginLeft: indent }}>
      <div className="comment-meta">
        <span className="comment-author">{data.by}</span>
        <span title={new Date((data.time ?? 0) * 1000).toLocaleString()}>
          {dayjs((data.time ?? 0) * 1000).fromNow()}
        </span>
      </div>

      <div
        className="comment-text"
        dangerouslySetInnerHTML={{ __html: data.text ?? "" }}
      />

      {replyCount > 0 && (
        <IonButton
          fill="clear"
          size="small"
          className="comment-toggle"
          onClick={toggle}
        >
          <IonIcon
            slot="start"
            icon={showReplies ? chevronDownOutline : chevronForwardOutline}
          />
          {showReplies ? "Hide" : "Show"} {replyCount}{" "}
          {replyCount === 1 ? "reply" : "replies"}
        </IonButton>
      )}

      {showReplies &&
        data.kids?.map((kid) => <Comment key={kid} id={kid} level={level + 1} />)}
    </div>
  );
}
