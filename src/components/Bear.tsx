import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * 熊抱哥 🧸 — 原創草莓熊插畫（純 SVG，不吃任何圖片資源）
 *
 * 重點是「絨毛玩偶感」：
 *   1. 輪廓不是平滑橢圓，而是一圈毛絮（下面的 FUR_* 路徑是算出來的）
 *   2. 外圈鋪一層深色毛當邊緣，上面再疊亮面 → 有厚度
 *   3. 深玫瑰色描邊 + 幾筆毛流，不是平塗
 *
 * 顏色走 CSS 變數（定義在 index.css），深色模式會自己跟著換。
 */

/* 邊緣帶毛絮的輪廓（由 scripts 產生，26 / 13 / 24 個毛峰） */
const FUR_HEAD =
  "M50.0 26.5Q53.2 24.9 56.0 27.0Q61.2 22.1 63.0 28.7Q70.1 23.9 69.9 32.1Q74.1 30.8 73.8 34.9Q81.8 32.6 78.3 39.7Q84.0 40.1 81.5 44.9Q85.2 46.8 83.4 50.4Q84.8 52.2 83.9 54.2Q87.4 55.9 83.9 57.6Q86.4 60.4 83.2 62.4Q86.5 66.7 81.0 68.1Q80.8 70.5 78.6 71.9Q82.6 78.5 75.0 76.0Q77.1 81.9 71.2 79.1Q69.6 83.3 64.9 82.5Q61.6 84.8 57.5 84.8Q55.2 88.6 52.0 85.4Q47.8 88.2 43.9 85.0Q40.9 89.0 39.9 84.2Q33.6 89.7 33.2 81.7Q29.5 80.7 27.1 77.8Q20.3 81.5 24.0 75.0Q19.1 74.6 20.1 70.1Q17.2 68.4 17.7 65.2Q15.7 62.1 16.1 58.5Q11.5 56.5 16.1 54.3Q14.7 51.4 17.0 49.1Q16.4 45.3 19.5 42.9Q17.3 38.0 23.0 38.1Q22.6 34.5 26.5 34.7Q27.4 32.7 29.7 32.3Q31.6 28.1 36.5 28.9Q38.9 27.0 42.0 27.3Q45.1 19.5 50.0 26.5Z";

const FUR_EAR_L =
  "M22.0 14.8Q26.8 9.9 28.6 16.4Q33.6 16.0 33.6 20.9Q37.5 23.0 35.8 27.0Q42.5 29.1 35.5 30.5Q35.6 33.5 33.4 35.5Q32.9 38.5 29.9 38.9Q30.2 46.3 24.9 40.9Q23.0 42.1 21.0 41.2Q18.0 45.0 17.0 40.3Q13.3 41.4 12.7 37.7Q7.0 39.7 10.0 34.6Q7.4 32.9 8.4 30.0Q4.0 28.4 8.3 26.6Q7.0 24.4 9.2 23.1Q6.1 17.4 12.6 18.3Q13.2 14.7 16.8 15.8Q18.5 10.9 22.0 14.8Z";

const FUR_EAR_R =
  "M78.0 14.8Q81.2 11.9 83.1 15.8Q86.0 15.4 87.0 18.0Q90.5 19.3 90.7 22.9Q94.5 24.1 91.8 26.9Q98.5 30.0 91.2 31.8Q93.3 35.2 89.2 35.6Q91.5 41.3 85.8 38.9Q85.2 46.7 79.5 41.1Q77.6 46.7 75.9 41.0Q72.1 44.4 71.3 39.5Q67.0 41.7 68.0 37.1Q65.2 36.3 65.5 33.5Q60.3 31.1 64.2 27.1Q59.2 23.7 65.3 22.9Q63.9 18.8 68.3 18.6Q68.7 15.0 72.3 16.0Q74.5 12.6 78.0 14.8Z";

const FUR_BODY =
  "M60.0 59.0Q62.3 56.3 64.2 59.2Q66.8 57.9 68.7 60.1Q72.1 59.3 74.1 61.9Q78.1 62.0 79.8 65.2Q86.9 61.7 83.0 68.0Q90.4 65.6 85.5 71.1Q89.8 71.5 87.5 74.8Q89.5 77.5 88.9 80.6Q90.0 82.6 88.8 84.4Q93.9 88.7 87.1 90.1Q89.7 94.8 83.9 95.1Q88.0 101.2 80.9 98.0Q80.7 102.4 75.9 101.3Q75.9 107.7 70.4 103.5Q69.5 111.2 64.7 104.7Q60.5 106.7 56.2 104.8Q53.6 106.2 51.8 104.1Q47.2 110.3 47.8 102.9Q42.3 104.2 40.9 99.3Q34.5 101.7 36.9 95.9Q33.1 95.7 34.2 92.5Q31.4 91.1 32.1 88.4Q28.8 86.7 31.1 83.9Q25.2 80.3 31.6 77.3Q25.3 73.3 33.1 73.5Q32.6 70.9 35.3 69.9Q34.6 65.6 39.5 65.7Q41.3 63.2 44.6 62.5Q47.2 58.4 52.2 59.8Q55.7 56.5 60.0 59.0Z";

const FUR_PAW_L =
  "M18.0 81.5Q20.5 80.2 22.4 82.3Q26.8 78.8 25.8 84.2Q28.9 83.9 28.2 87.0Q30.9 89.3 30.0 92.7Q32.1 95.6 29.0 97.5Q31.8 102.8 25.8 101.7Q26.1 107.6 21.4 104.0Q19.5 108.3 16.9 104.5Q12.9 107.6 11.6 102.7Q8.9 101.8 7.9 99.3Q5.8 97.0 6.0 94.0Q-0.1 90.5 6.8 88.9Q5.1 84.1 10.3 84.2Q11.8 82.1 14.3 82.0Q15.7 78.7 18.0 81.5Z";

const FUR_PAW_R =
  "M102.0 81.5Q103.9 80.1 105.4 82.0Q108.5 82.3 110.4 84.8Q116.7 82.4 112.6 87.7Q114.4 89.7 114.0 92.3Q120.0 96.1 113.0 97.6Q112.1 100.7 109.2 102.2Q108.4 106.1 104.8 104.2Q102.3 106.0 99.7 104.3Q97.8 104.7 96.5 103.2Q93.6 103.1 92.8 100.4Q88.1 100.4 90.6 96.5Q83.7 93.7 90.3 90.4Q88.5 86.8 92.5 85.9Q93.8 82.7 97.3 82.4Q98.3 75.6 102.0 81.5Z";

const FUR_BELLY =
  "M60.0 70.0Q63.4 67.0 65.6 70.8Q70.0 69.1 70.9 73.5Q74.7 74.1 75.0 77.7Q78.6 79.1 77.1 82.5Q78.8 85.3 77.3 88.3Q77.4 91.2 75.5 93.4Q77.1 97.0 73.1 96.7Q72.1 100.1 68.4 100.1Q68.0 104.9 64.4 101.5Q62.7 106.1 59.9 102.0Q56.9 103.8 54.6 101.2Q49.1 102.4 47.5 97.2Q43.9 96.1 44.0 92.5Q39.8 90.4 42.5 86.7Q39.6 82.3 44.1 79.4Q42.0 72.9 49.0 73.5Q51.2 70.7 54.9 70.7Q57.2 68.9 60.0 70.0Z";

const LINE = "var(--bear-line)";
const EYE = "var(--bear-eye)";
const PLUM = "var(--bear-plum)";

export type BearMood =
  | "happy" // 一般的傻笑
  | "blush" // 害羞
  | "wink" // 眨眼
  | "love" // 愛心眼
  | "wow" // 驚訝
  | "smug" // 得意（按太多次 No 的時候）
  | "sleepy"; // 想睡

function Eye({ cx, big }: { cx: number; big?: boolean }) {
  const r = big ? 7 : 6;
  return (
    <g>
      <circle cx={cx} cy="47" r={r} fill={EYE} />
      <circle cx={cx + 2.1} cy="44.6" r={r * 0.36} fill="#fff" />
      <circle
        cx={cx - 1.8}
        cy={49.8}
        r={r * 0.2}
        fill="#fff"
        opacity="0.55"
      />
    </g>
  );
}

function Eyes({ mood }: { mood: BearMood }) {
  if (mood === "love") {
    return (
      <g fill={PLUM}>
        <path d="M34 54C28.5 49.2 25.8 46.8 25.8 43.8 25.8 41.4 27.7 39.5 30.1 39.5 31.6 39.5 33.1 40.3 34 41.6 34.9 40.3 36.4 39.5 37.9 39.5 40.3 39.5 42.2 41.4 42.2 43.8 42.2 46.8 39.5 49.2 34 54Z" />
        <path d="M66 54C60.5 49.2 57.8 46.8 57.8 43.8 57.8 41.4 59.7 39.5 62.1 39.5 63.6 39.5 65.1 40.3 66 41.6 66.9 40.3 68.4 39.5 69.9 39.5 72.3 39.5 74.2 41.4 74.2 43.8 74.2 46.8 71.5 49.2 66 54Z" />
      </g>
    );
  }

  const curves: Partial<Record<BearMood, [string, string]>> = {
    sleepy: ["M28 45.5q6 6.5 12 0", "M60 45.5q6 6.5 12 0"],
    smug: ["M28 49q6-7.5 12 0", "M60 49q6-7.5 12 0"],
  };

  if (curves[mood]) {
    const [l, r] = curves[mood]!;
    return (
      <g fill="none" stroke={EYE} strokeWidth="3.4" strokeLinecap="round">
        <path d={l} />
        <path d={r} />
      </g>
    );
  }

  return (
    <g>
      {mood === "wink" ? (
        <path
          d="M28 48q6-7 12 0"
          fill="none"
          stroke={EYE}
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      ) : (
        <Eye cx={34} big={mood === "wow"} />
      )}
      <Eye cx={66} big={mood === "wow"} />
    </g>
  );
}

function Mouth({ mood }: { mood: BearMood }) {
  if (mood === "wow") {
    return <ellipse cx="50" cy="71" rx="3.6" ry="4.4" fill={PLUM} />;
  }

  if (mood === "love") {
    return (
      <path d="M43.5 68.5q6.5 8.5 13 0a6.5 6.5 0 0 1-13 0Z" fill={PLUM} />
    );
  }

  if (mood === "sleepy") {
    return (
      <path
        d="M46.5 70q3.5 2.5 7 0"
        fill="none"
        stroke={PLUM}
        strokeWidth="3"
        strokeLinecap="round"
      />
    );
  }

  return (
    <path
      d="M44 68.5q3 4.2 6 .7q3 3.5 6-.7"
      fill="none"
      stroke={PLUM}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** 頭（耳朵 + 毛絮輪廓 + 五官），BearFace 跟 BearHug 共用 */
function Head({ mood, wiggle }: { mood: BearMood; wiggle?: boolean }) {
  const id = useId();
  const furG = `${id}-fur`;
  const muzzleG = `${id}-muzzle`;
  const blushing = mood === "blush" || mood === "love";

  return (
    <>
      <defs>
        <radialGradient id={furG} cx="34%" cy="26%" r="82%">
          <stop offset="0%" stopColor="var(--bear-fur-light)" />
          <stop offset="58%" stopColor="var(--bear-fur)" />
          <stop offset="100%" stopColor="var(--bear-fur-dark)" />
        </radialGradient>
        <radialGradient id={muzzleG} cx="40%" cy="28%" r="86%">
          <stop offset="0%" stopColor="#fffaf4" />
          <stop offset="100%" stopColor="var(--bear-muzzle)" />
        </radialGradient>
      </defs>

      {/* 耳朵 */}
      <g className={wiggle ? "bear-ears" : undefined}>
        <path d={FUR_EAR_L} fill="var(--bear-fur-dark)" />
        <path d={FUR_EAR_R} fill="var(--bear-fur-dark)" />
        <path
          d={FUR_EAR_L}
          fill={`url(#${furG})`}
          stroke="var(--bear-fur-deep)"
          strokeWidth="1"
          transform="translate(0 -1.2)"
        />
        <path
          d={FUR_EAR_R}
          fill={`url(#${furG})`}
          stroke="var(--bear-fur-deep)"
          strokeWidth="1"
          transform="translate(0 -1.2)"
        />
        <ellipse cx="22" cy="27" rx="6.2" ry="6" fill={PLUM} opacity="0.38" />
        <ellipse cx="78" cy="27" rx="6.2" ry="6" fill={PLUM} opacity="0.38" />
      </g>

      {/* 頭：底層深色毛 → 亮面 → 描邊 */}
      <path d={FUR_HEAD} fill="var(--bear-fur-dark)" transform="translate(0 2)" />
      <path
        d={FUR_HEAD}
        fill={`url(#${furG})`}
        stroke="var(--bear-fur-deep)"
        strokeWidth="1.1"
      />

      {/* 額頭亮面 */}
      <ellipse
        cx="37"
        cy="40"
        rx="14"
        ry="9"
        fill="#fff"
        opacity="0.2"
        transform="rotate(-18 37 40)"
      />

      {/* 毛流 */}
      <g
        fill="none"
        stroke={LINE}
        strokeOpacity="0.28"
        strokeWidth="1.3"
        strokeLinecap="round"
      >
        <path d="M31.5 34.5q3.5-4 7.5-1.5" />
        <path d="M58.5 32.5q4.5-3.5 8.5.5" />
        <path d="M21.5 50q3.5-3.5 7.5-1" />
        <path d="M75 47.5q4-3 7.5 0" />
        <path d="M44 28.5q3-2.5 6-1" />
      </g>

      {/* 口鼻 */}
      <ellipse
        cx="50"
        cy="67.5"
        rx="20.5"
        ry="14.5"
        fill="var(--bear-fur-dark)"
        opacity="0.35"
      />
      <ellipse
        cx="50"
        cy="66.5"
        rx="20"
        ry="14"
        fill={`url(#${muzzleG})`}
        stroke="var(--bear-fur-deep)"
        strokeWidth="1"
        strokeOpacity="0.45"
      />

      {/* 腮紅 */}
      <g fill="var(--bear-cheek)" opacity={blushing ? 0.6 : 0.38}>
        <ellipse
          cx="24"
          cy="61"
          rx={blushing ? 7 : 6.2}
          ry={blushing ? 5.4 : 4.5}
        />
        <ellipse
          cx="76"
          cy="61"
          rx={blushing ? 7 : 6.2}
          ry={blushing ? 5.4 : 4.5}
        />
      </g>

      <Eyes mood={mood} />

      {/* 愛心鼻子 */}
      <path
        d="M50 66C45.5 62.4 43.5 60.6 43.5 58.5 43.5 56.6 45 55.3 46.8 55.3 48.1 55.3 49.3 56.1 50 57.1 50.7 56.1 51.9 55.3 53.2 55.3 55 55.3 56.5 56.6 56.5 58.5 56.5 60.6 54.5 62.4 50 66Z"
        fill={PLUM}
      />
      <ellipse
        cx="47"
        cy="58"
        rx="1.8"
        ry="1.3"
        fill="#fff"
        opacity="0.32"
        transform="rotate(-24 47 58)"
      />

      <Mouth mood={mood} />
    </>
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
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("bear-art", className)}
      role="img"
      aria-label="熊抱哥"
    >
      <Head mood={mood} wiggle={wiggle} />
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
      viewBox="0 0 120 118"
      className={cn("bear-art", className)}
      role="img"
      aria-label="熊抱哥張開手要抱抱"
    >
      {/* 手臂 */}
      <g fill="var(--bear-fur)" stroke="var(--bear-fur-deep)" strokeWidth="1.1">
        <path d="M30 76c-11 1-19 8-19 17 0 8 6 14 14 14 7 0 12-5 13-12Z" />
        <path d="M90 76c11 1 19 8 19 17 0 8-6 14-14 14-7 0-12-5-13-12Z" />
        <path d={FUR_PAW_L} />
        <path d={FUR_PAW_R} />
      </g>
      <g fill="var(--bear-muzzle)" opacity="0.8">
        <ellipse cx="18" cy="94" rx="6.8" ry="7.4" />
        <ellipse cx="102" cy="94" rx="6.8" ry="7.4" />
      </g>

      {/* 身體 */}
      <path d={FUR_BODY} fill="var(--bear-fur-dark)" transform="translate(0 2)" />
      <path
        d={FUR_BODY}
        fill="var(--bear-fur)"
        stroke="var(--bear-fur-deep)"
        strokeWidth="1.1"
      />
      <path
        d={FUR_BELLY}
        fill="var(--bear-muzzle)"
        stroke="var(--bear-fur-deep)"
        strokeWidth="1"
        strokeOpacity="0.45"
      />

      {/* 頭 */}
      <g transform="translate(18 -6) scale(0.84)">
        <Head mood="love" />
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
