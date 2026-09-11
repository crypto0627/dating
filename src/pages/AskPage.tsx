import * as React from "react";

import { BearFace, BearPaw, type BearMood } from "@/components/Bear";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** 每按一次 No，Yes 就長大一級（會一直長，直到你按 Yes 為止） */
const GROWTH = 0.42;
const MAX_SCALE = 6.2;

const NO_LABELS = [
  "No",
  "不要",
  "再想想",
  "真的不要？",
  "確定嗎…",
  "你認真的？",
  "最後機會",
  "不行喔",
  "還是不要",
  "沒有這個選項",
];

const TEASES = [
  "",
  "欸，手滑了嗎？",
  "熊抱哥看到了 👀",
  "Yes 好像變大了…",
  "它還在長，跟熊抱哥的肚子一樣。",
  "你螢幕快不夠用了。",
  "熊抱哥可以等你按到天亮。",
  "放棄吧，這題沒有 No。",
  "Yes 已經大到蓋住 No 了。",
  "認命吧，來抱一個 🧸",
];

/** 熊抱哥的心情隨著 No 的次數變化 */
const MOODS: BearMood[] = [
  "happy",
  "blush",
  "wink",
  "wow",
  "smug",
  "smug",
  "sleepy",
  "love",
  "love",
  "love",
];

export function AskPage({ onYes }: { onYes: () => void }) {
  const [noCount, setNoCount] = React.useState(0);

  const scale = Math.min(1 + noCount * GROWTH, MAX_SCALE);
  const noScale = Math.max(1 - noCount * 0.055, 0.5);
  const noLabel = NO_LABELS[Math.min(noCount, NO_LABELS.length - 1)];
  const tease = TEASES[Math.min(noCount, TEASES.length - 1)];
  const mood = MOODS[Math.min(noCount, MOODS.length - 1)];

  // 每按一次 No，就多召喚一隻熊抱哥來幫腔（最多 12 隻）
  const squad = Math.min(noCount, 12);

  return (
    <main className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 py-12">
      <div className="animate-fade-up flex w-full max-w-md flex-col items-center text-center">
        {/* 主角 */}
        <div className="animate-bear-bob mb-5">
          <BearFace
            mood={mood}
            wiggle
            className="size-28 drop-shadow-[0_14px_26px_rgba(214,45,99,0.32)] sm:size-36"
          />
        </div>

        <h1 className="text-bear font-serif text-[2.1rem] leading-[1.25] font-bold tracking-tight sm:text-5xl">
          要不要跟我約會？
        </h1>

        <p className="text-muted-foreground mt-4 flex items-center gap-2 text-sm tracking-[0.35em] uppercase sm:text-base">
          <BearPaw className="text-primary/50 size-3.5" />
          Yes or No
          <BearPaw className="text-primary/50 size-3.5" />
        </p>

        <p
          className={cn(
            "text-primary/80 mt-3 h-5 text-sm transition-opacity duration-300",
            tease ? "opacity-100" : "opacity-0",
          )}
          aria-live="polite"
        >
          {tease || " "}
        </p>

        {/* 按鈕區：Yes 會越長越大，所以要留成長空間 */}
        <div
          className="mt-10 flex w-full flex-col items-center gap-5 transition-all duration-500"
          style={{ minHeight: `${3.25 * scale + 4}rem` }}
        >
          <Button
            variant="bear"
            size="lg"
            onClick={onYes}
            aria-label="Yes，我要跟你約會"
            className={cn(
              "shine origin-center gap-2.5 px-10 font-bold",
              "transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            )}
            style={{
              transform: `scale(${scale})`,
              fontSize: `${Math.min(1 + noCount * 0.04, 1.25)}rem`,
            }}
          >
            <BearPaw className="size-4 text-white/90" />
            Yes
            <BearFace mood="love" className="size-[1.15em]" />
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={() => setNoCount((c) => c + 1)}
            className="text-muted-foreground origin-center transition-transform duration-500"
            style={{
              transform: `scale(${noScale})`,
              marginTop: `${Math.min(noCount * 0.9, 7)}rem`,
            }}
          >
            {noLabel}
          </Button>
        </div>

        {/* 熊抱哥大軍：按越多次，來勸你的熊就越多 */}
        {squad > 0 && (
          <div
            className="mt-8 flex max-w-xs flex-wrap justify-center gap-1"
            aria-hidden="true"
          >
            {Array.from({ length: squad }).map((_, i) => (
              <BearFace
                key={i}
                mood={i % 3 === 0 ? "smug" : i % 3 === 1 ? "love" : "wink"}
                className="animate-pop-in size-9"
              />
            ))}
          </div>
        )}

        {noCount > 0 && (
          <p className="text-muted-foreground/70 mt-5 text-xs">
            你已經按了 {noCount} 次 No，熊抱哥也來了 {squad} 隻
          </p>
        )}
      </div>
    </main>
  );
}
