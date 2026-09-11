import * as React from "react";

import { BearPaw, Heart, Strawberry, type BearMood } from "@/components/Bear";
import { BearPhoto } from "@/components/BearPhoto";
import { BEAR_IMAGES, type BearImageName } from "@/lib/bearAssets";

type Kind = "bear" | "paw" | "berry" | "heart" | "chip";

const KINDS: Kind[] = [
  "bear",
  "bear",
  "bear",
  "paw",
  "berry",
  "heart",
  "chip",
  "chip",
];

const MOODS: BearMood[] = ["happy", "love", "blush", "wink", "wow"];

const SHOTS = Object.keys(BEAR_IMAGES) as BearImageName[];

const CHIP_COLORS = [
  "#ff8ab5",
  "#ee5d96",
  "#ffd1e3",
  "#ffb9d2",
  "#ffd28a",
  "#e63b62",
  "#ffffff",
];

type Piece = {
  kind: Kind;
  mood: BearMood;
  shot: BearImageName;
  color: string;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  spin: number;
  size: number;
  chipH: number;
  round: boolean;
};

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

/** 一次性的熊抱哥紙花（約定成立時灑一次） */
export function Confetti({ count = 80 }: { count?: number }) {
  const pieces = React.useMemo<Piece[]>(() => {
    const list: Piece[] = [];
    for (let i = 0; i < count; i++) {
      const kind = pick(KINDS);
      list.push({
        kind,
        mood: pick(MOODS),
        shot: pick(SHOTS),
        color: pick(CHIP_COLORS),
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 2.8 + Math.random() * 2.4,
        drift: (Math.random() - 0.5) * 240,
        spin: (Math.random() > 0.5 ? 1 : -1) * (420 + Math.random() * 520),
        size:
          kind === "bear"
            ? 26 + Math.random() * 22
            : kind === "chip"
              ? 6 + Math.random() * 5
              : 16 + Math.random() * 14,
        chipH: 10 + Math.random() * 8,
        round: Math.random() > 0.72,
      });
    }
    return list;
  }, [count]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((p, i) => {
        const style = {
          left: `${p.left}%`,
          width: `${p.size}px`,
          height: `${p.kind === "chip" ? p.chipH : p.size}px`,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
          "--drift": `${p.drift}px`,
          "--spin": `${p.spin}deg`,
        } as React.CSSProperties;

        if (p.kind === "chip") {
          return (
            <span
              key={i}
              className="confetti-piece"
              style={{
                ...style,
                background: p.color,
                borderRadius: p.round ? "9999px" : "2px",
              }}
            />
          );
        }

        return (
          <span key={i} className="confetti-piece block" style={style}>
            {p.kind === "bear" && (
              <BearPhoto name={p.shot} mood={p.mood} className="size-full" />
            )}
            {p.kind === "berry" && <Strawberry className="size-full" />}
            {p.kind === "heart" && (
              <Heart className="size-full text-[var(--bear-cheek)]" />
            )}
            {p.kind === "paw" && (
              <BearPaw className="size-full text-[var(--bear-inner)]" />
            )}
          </span>
        );
      })}
    </div>
  );
}
