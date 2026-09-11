import * as React from "react";

import { BearFace, BearPaw, Heart, Strawberry, type BearMood } from "@/components/Bear";

type Kind = "bear" | "paw" | "berry" | "heart";

type Floater = {
  kind: Kind;
  mood: BearMood;
  left: number;
  size: number;
  duration: number;
  delay: number;
  peak: number;
};

const MOODS: BearMood[] = ["happy", "blush", "wink", "love", "smug", "sleepy"];

/** 熊多一點，其他的當配角 */
const KINDS: Kind[] = [
  "bear",
  "bear",
  "bear",
  "bear",
  "bear",
  "paw",
  "paw",
  "berry",
  "heart",
];

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function makeFloaters(count: number): Floater[] {
  const list: Floater[] = [];
  for (let i = 0; i < count; i++) {
    const kind = pick(KINDS);
    const size =
      kind === "bear" ? 34 + Math.random() * 74 : 18 + Math.random() * 34;

    list.push({
      kind,
      mood: pick(MOODS),
      left: Math.random() * 100,
      size,
      // 大的慢、小的快，看起來比較有景深
      duration: 18 + (120 - size) * 0.11 + Math.random() * 10,
      delay: -Math.random() * 28,
      peak:
        kind === "bear"
          ? 0.16 + Math.random() * 0.22
          : 0.12 + Math.random() * 0.2,
    });
  }
  return list;
}

function FloaterArt({ kind, mood }: { kind: Kind; mood: BearMood }) {
  if (kind === "bear") return <BearFace mood={mood} className="size-full" />;
  if (kind === "berry") return <Strawberry className="size-full" />;
  if (kind === "heart")
    return <Heart className="size-full text-[var(--bear-cheek)]" />;
  return <BearPaw className="size-full text-[var(--bear-inner)]" />;
}

/**
 * 背景：草莓奶油漸層 + 滿版熊掌壁紙 + 一路往上飄的熊抱哥。
 * 純裝飾，不吃點擊。
 */
export function BearBackdrop({ count = 22 }: { count?: number }) {
  const floaters = React.useMemo(() => makeFloaters(count), [count]);

  return (
    <>
      <div className="bear-bg" aria-hidden="true" />
      <div className="paw-wallpaper" aria-hidden="true" />
      <div className="bear-field" aria-hidden="true">
        {floaters.map((f, i) => (
          <span
            key={i}
            className="floater block"
            style={
              {
                left: `${f.left}%`,
                width: `${f.size}px`,
                height: `${f.size}px`,
                animationDuration: `${f.duration}s`,
                animationDelay: `${f.delay}s`,
                "--peak": f.peak,
              } as React.CSSProperties
            }
          >
            <FloaterArt kind={f.kind} mood={f.mood} />
          </span>
        ))}
      </div>
    </>
  );
}
