import * as React from "react";

const COLORS = [
  "#ff8ab5",
  "#ee5d96",
  "#ffd1e3",
  "#f7b6d8",
  "#ffe3a3",
  "#d6417c",
  "#ffffff",
];

type Piece = {
  left: number;
  delay: number;
  duration: number;
  color: string;
  drift: number;
  w: number;
  h: number;
  round: boolean;
};

/** 一次性紙花（約定成立時灑一次） */
export function Confetti({ count = 70 }: { count?: number }) {
  const pieces = React.useMemo<Piece[]>(() => {
    const list: Piece[] = [];
    for (let i = 0; i < count; i++) {
      const round = Math.random() > 0.72;
      list.push({
        left: Math.random() * 100,
        delay: Math.random() * 1.1,
        duration: 2.6 + Math.random() * 2.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        drift: (Math.random() - 0.5) * 220,
        w: round ? 8 : 6 + Math.random() * 5,
        h: round ? 8 : 10 + Math.random() * 8,
        round,
      });
    }
    return list;
  }, [count]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={
            {
              left: `${p.left}%`,
              width: `${p.w}px`,
              height: `${p.h}px`,
              background: p.color,
              borderRadius: p.round ? "9999px" : "2px",
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--drift": `${p.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
