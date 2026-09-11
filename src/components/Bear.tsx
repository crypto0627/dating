import { cn } from "@/lib/utils";

/**
 * 熊抱哥 🧸 — 原創草莓熊插畫（純 SVG，不吃任何圖片資源）
 * 顏色走 CSS 變數（定義在 index.css），所以深色模式會自己跟著換。
 */

export type BearMood =
  | "happy" // 一般的傻笑
  | "blush" // 害羞
  | "wink" // 眨眼
  | "love" // 愛心眼
  | "wow" // 驚訝
  | "smug" // 得意（按太多次 No 的時候）
  | "sleepy"; // 想睡

const EYE = "var(--bear-eye)";
const NOSE = "var(--bear-nose)";

function Eyes({ mood }: { mood: BearMood }) {
  if (mood === "love") {
    return (
      <g fill={NOSE}>
        <path d="M35 55c-5-4.4-7.5-6.6-7.5-9.3 0-2.2 1.7-3.9 3.9-3.9 1.4 0 2.8.7 3.6 1.9.8-1.2 2.2-1.9 3.6-1.9 2.2 0 3.9 1.7 3.9 3.9 0 2.7-2.5 4.9-7.5 9.3Z" />
        <path d="M65 55c-5-4.4-7.5-6.6-7.5-9.3 0-2.2 1.7-3.9 3.9-3.9 1.4 0 2.8.7 3.6 1.9.8-1.2 2.2-1.9 3.6-1.9 2.2 0 3.9 1.7 3.9 3.9 0 2.7-2.5 4.9-7.5 9.3Z" />
      </g>
    );
  }

  if (mood === "sleepy") {
    return (
      <g
        fill="none"
        stroke={EYE}
        strokeWidth="3.2"
        strokeLinecap="round"
      >
        <path d="M29 49q6 6 12 0" />
        <path d="M59 49q6 6 12 0" />
      </g>
    );
  }

  if (mood === "smug") {
    return (
      <g
        fill="none"
        stroke={EYE}
        strokeWidth="3.2"
        strokeLinecap="round"
      >
        <path d="M29 52q6-7 12 0" />
        <path d="M59 52q6-7 12 0" />
      </g>
    );
  }

  const left =
    mood === "wink" ? (
      <path
        d="M29 51q6-6.5 12 0"
        fill="none"
        stroke={EYE}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    ) : (
      <g>
        <ellipse cx="35" cy="49" rx={mood === "wow" ? 5.6 : 4.6} ry={mood === "wow" ? 6.6 : 5.6} fill={EYE} />
        <circle cx="36.8" cy="46.6" r="1.7" fill="#fff" />
      </g>
    );

  return (
    <g>
      {left}
      <g>
        <ellipse cx="65" cy="49" rx={mood === "wow" ? 5.6 : 4.6} ry={mood === "wow" ? 6.6 : 5.6} fill={EYE} />
        <circle cx="66.8" cy="46.6" r="1.7" fill="#fff" />
      </g>
    </g>
  );
}

function Mouth({ mood }: { mood: BearMood }) {
  if (mood === "wow") {
    return <ellipse cx="50" cy="72" rx="5" ry="6" fill={NOSE} opacity="0.85" />;
  }

  if (mood === "love") {
    return (
      <path
        d="M41 69q9 11 18 0a9 9 0 0 1-18 0Z"
        fill={NOSE}
        opacity="0.85"
      />
    );
  }

  if (mood === "sleepy") {
    return (
      <path
        d="M46 71q4 3 8 0"
        fill="none"
        stroke={NOSE}
        strokeWidth="2.8"
        strokeLinecap="round"
        opacity="0.8"
      />
    );
  }

  return (
    <path
      d="M42 69.5q4 5 8 .6q4 4.4 8-.6"
      fill="none"
      stroke={NOSE}
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.85"
    />
  );
}

/** 熊抱哥的臉 */
export function BearFace({
  mood = "happy",
  className,
  wiggle = false,
}: {
  mood?: BearMood;
  className?: string;
  /** 耳朵會動 */
  wiggle?: boolean;
}) {
  const blushing = mood === "blush" || mood === "love";

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("bear-art", className)}
      role="img"
      aria-label="熊抱哥"
    >
      {/* 耳朵 */}
      <g className={wiggle ? "bear-ears" : undefined}>
        <circle cx="23" cy="27" r="15.5" fill="var(--bear-fur)" />
        <circle cx="23" cy="27" r="8.5" fill="var(--bear-inner)" />
        <circle cx="77" cy="27" r="15.5" fill="var(--bear-fur)" />
        <circle cx="77" cy="27" r="8.5" fill="var(--bear-inner)" />
      </g>

      {/* 頭 */}
      <ellipse cx="50" cy="55" rx="36" ry="32.5" fill="var(--bear-fur)" />
      <ellipse
        cx="50"
        cy="58"
        rx="36"
        ry="29.5"
        fill="var(--bear-fur-dark)"
        opacity="0.28"
      />
      <ellipse cx="50" cy="53" rx="34" ry="30" fill="var(--bear-fur)" />

      {/* 口鼻 */}
      <ellipse cx="50" cy="66" rx="21" ry="15.5" fill="var(--bear-muzzle)" />

      {/* 腮紅 */}
      <g fill="var(--bear-cheek)" opacity={blushing ? 0.65 : 0.42}>
        <ellipse cx="19.5" cy="62" rx={blushing ? 8.4 : 7} ry={blushing ? 5.6 : 4.6} />
        <ellipse cx="80.5" cy="62" rx={blushing ? 8.4 : 7} ry={blushing ? 5.6 : 4.6} />
      </g>

      <Eyes mood={mood} />

      {/* 愛心鼻子 */}
      <path
        d="M50 64c-6-5.2-9-7.8-9-11 0-2.6 2.1-4.6 4.6-4.6 1.8 0 3.4.9 4.4 2.3 1-1.4 2.6-2.3 4.4-2.3 2.5 0 4.6 2 4.6 4.6 0 3.2-3 5.8-9 11Z"
        fill={NOSE}
      />

      <Mouth mood={mood} />
    </svg>
  );
}

/** 熊掌印 */
export function BearPaw({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("bear-art", className)}
      aria-hidden="true"
    >
      <ellipse cx="50" cy="67" rx="25" ry="21" fill="currentColor" />
      <ellipse cx="20" cy="41" rx="9" ry="11" fill="currentColor" transform="rotate(-22 20 41)" />
      <ellipse cx="38" cy="26" rx="9" ry="11.5" fill="currentColor" transform="rotate(-8 38 26)" />
      <ellipse cx="62" cy="26" rx="9" ry="11.5" fill="currentColor" transform="rotate(8 62 26)" />
      <ellipse cx="80" cy="41" rx="9" ry="11" fill="currentColor" transform="rotate(22 80 41)" />
    </svg>
  );
}

/** 草莓（熊抱哥身上的草莓味） */
export function Strawberry({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("bear-art", className)}
      aria-hidden="true"
    >
      <path
        d="M50 94C28 79 16 62 16 46.5 16 32 30 24 50 24s34 8 34 22.5C84 62 72 79 50 94Z"
        fill="var(--berry)"
      />
      <path
        d="M50 94C36 79 28 62 28 46.5 28 33 36 24.6 50 24s34 8 34 22.5C84 62 72 79 50 94Z"
        fill="#fff"
        opacity="0.13"
      />
      <path
        d="M50 6c2.4 5.4 2.4 9.4 1.6 13.6 4-3.2 8.4-4.6 13.8-4.6-2.6 5.4-6.2 8.4-10.6 10.6 5-.4 9 .8 13 3.6-5 3.2-9.4 4-14.4 3.4 1.2 1.8 1.8 3.6 2 6h-11c.2-2.4.8-4.2 2-6-5 .6-9.4-.2-14.4-3.4 4-2.8 8-4 13-3.6-4.4-2.2-8-5.2-10.6-10.6 5.4 0 9.8 1.4 13.8 4.6C47.6 15.4 47.6 11.4 50 6Z"
        fill="var(--leaf)"
      />
      <g fill="#fff" opacity="0.9">
        <ellipse cx="38" cy="46" rx="2.4" ry="3.4" transform="rotate(-18 38 46)" />
        <ellipse cx="62" cy="46" rx="2.4" ry="3.4" transform="rotate(18 62 46)" />
        <ellipse cx="50" cy="58" rx="2.4" ry="3.4" />
        <ellipse cx="34" cy="64" rx="2.4" ry="3.4" transform="rotate(-18 34 64)" />
        <ellipse cx="66" cy="64" rx="2.4" ry="3.4" transform="rotate(18 66 64)" />
        <ellipse cx="50" cy="78" rx="2.2" ry="3.2" />
      </g>
    </svg>
  );
}

/** 張開手要抱抱的熊抱哥 */
export function BearHug({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 100"
      className={cn("bear-art", className)}
      role="img"
      aria-label="熊抱哥張開手要抱抱"
    >
      {/* 手臂 */}
      <g fill="var(--bear-fur)">
        <path d="M26 62c-10 1-17 7-17 15 0 7 5 12 12 12 6 0 11-4 12-10Z" />
        <path d="M94 62c10 1 17 7 17 15 0 7-5 12-12 12-6 0-11-4-12-10Z" />
        <circle cx="16" cy="79" r="11" />
        <circle cx="104" cy="79" r="11" />
      </g>
      <g fill="var(--bear-muzzle)" opacity="0.75">
        <ellipse cx="16" cy="80" rx="6" ry="6.6" />
        <ellipse cx="104" cy="80" rx="6" ry="6.6" />
      </g>

      {/* 身體 */}
      <ellipse cx="60" cy="82" rx="30" ry="24" fill="var(--bear-fur)" />
      <ellipse cx="60" cy="86" rx="18" ry="16" fill="var(--bear-muzzle)" opacity="0.85" />

      {/* 頭 */}
      <g transform="translate(20 -4) scale(0.8)">
        <g>
          <circle cx="23" cy="27" r="15.5" fill="var(--bear-fur)" />
          <circle cx="23" cy="27" r="8.5" fill="var(--bear-inner)" />
          <circle cx="77" cy="27" r="15.5" fill="var(--bear-fur)" />
          <circle cx="77" cy="27" r="8.5" fill="var(--bear-inner)" />
        </g>
        <ellipse cx="50" cy="53" rx="34" ry="30" fill="var(--bear-fur)" />
        <ellipse cx="50" cy="66" rx="21" ry="15.5" fill="var(--bear-muzzle)" />
        <g fill="var(--bear-cheek)" opacity="0.6">
          <ellipse cx="19.5" cy="62" rx="8.4" ry="5.6" />
          <ellipse cx="80.5" cy="62" rx="8.4" ry="5.6" />
        </g>
        <g
          fill="none"
          stroke={EYE}
          strokeWidth="3.4"
          strokeLinecap="round"
        >
          <path d="M29 52q6-7 12 0" />
          <path d="M59 52q6-7 12 0" />
        </g>
        <path
          d="M50 64c-6-5.2-9-7.8-9-11 0-2.6 2.1-4.6 4.6-4.6 1.8 0 3.4.9 4.4 2.3 1-1.4 2.6-2.3 4.4-2.3 2.5 0 4.6 2 4.6 4.6 0 3.2-3 5.8-9 11Z"
          fill={NOSE}
        />
        <path
          d="M41 69q9 11 18 0a9 9 0 0 1-18 0Z"
          fill={NOSE}
          opacity="0.85"
        />
      </g>
    </svg>
  );
}

/** 小愛心（點綴用） */
export function Heart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 88C22 70 8 56 8 38.5 8 26 18 16 30.5 16 38 16 45 19.6 50 25.4 55 19.6 62 16 69.5 16 82 16 92 26 92 38.5 92 56 78 70 50 88Z"
        fill="currentColor"
      />
    </svg>
  );
}
