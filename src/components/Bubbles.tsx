import * as React from "react";

type Bubble = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

function makeBubbles(count: number): Bubble[] {
  const list: Bubble[] = [];
  for (let i = 0; i < count; i++) {
    const size = 18 + Math.random() * 96;
    list.push({
      left: Math.random() * 100,
      size,
      // 大泡泡慢、小泡泡快，看起來比較有景深
      duration: 16 + (120 - size) * 0.12 + Math.random() * 10,
      delay: -Math.random() * 26,
      opacity: 0.3 + Math.random() * 0.45,
    });
  }
  return list;
}

/** 背景：粉紅漸層 + 漂浮泡泡（純裝飾，不吃點擊） */
export function Bubbles({ count = 18 }: { count?: number }) {
  const bubbles = React.useMemo(() => makeBubbles(count), [count]);

  return (
    <>
      <div className="romance-bg" aria-hidden="true" />
      <div className="bubble-field" aria-hidden="true">
        {bubbles.map((b, i) => (
          <span
            key={i}
            className="bubble"
            style={{
              left: `${b.left}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              opacity: b.opacity,
            }}
          />
        ))}
      </div>
    </>
  );
}
