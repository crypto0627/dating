import * as React from "react";

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
  "再按看看會發生什麼事 👀",
  "Yes 好像變大了…",
  "它還在長。",
  "你螢幕快不夠用了。",
  "我可以等你按到天亮。",
  "放棄吧，這題沒有 No。",
  "Yes 已經大到蓋住 No 了。",
  "認命吧 ♡",
];

export function AskPage({ onYes }: { onYes: () => void }) {
  const [noCount, setNoCount] = React.useState(0);

  const scale = Math.min(1 + noCount * GROWTH, MAX_SCALE);
  const noScale = Math.max(1 - noCount * 0.055, 0.5);
  const noLabel = NO_LABELS[Math.min(noCount, NO_LABELS.length - 1)];
  const tease = TEASES[Math.min(noCount, TEASES.length - 1)];

  return (
    <main className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 py-12">
      <div className="animate-fade-up flex w-full max-w-md flex-col items-center text-center">
        <div
          className="animate-heart-beat mb-7 text-4xl sm:text-5xl"
          aria-hidden="true"
        >
          💗
        </div>

        <h1 className="text-romance font-serif text-[2.1rem] leading-[1.25] font-bold tracking-tight sm:text-5xl">
          要不要跟我約會？
        </h1>

        <p className="text-muted-foreground mt-4 text-sm tracking-[0.35em] uppercase sm:text-base">
          Yes or No
        </p>

        <p
          className={cn(
            "text-primary/80 mt-3 h-5 text-sm transition-opacity duration-300",
            tease ? "opacity-100" : "opacity-0",
          )}
          aria-live="polite"
        >
          {tease || " "}
        </p>

        {/* 按鈕區：Yes 會越長越大，所以要留成長空間 */}
        <div
          className="mt-10 flex w-full flex-col items-center gap-5 transition-all duration-500"
          style={{ minHeight: `${3.25 * scale + 4}rem` }}
        >
          <Button
            variant="romance"
            size="lg"
            onClick={onYes}
            aria-label="Yes，我要跟你約會"
            className={cn(
              "shine origin-center px-10 font-bold",
              "transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            )}
            style={{
              transform: `scale(${scale})`,
              fontSize: `${Math.min(1 + noCount * 0.04, 1.25)}rem`,
            }}
          >
            Yes ♡
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

        {noCount > 0 && (
          <p className="text-muted-foreground/70 mt-8 text-xs">
            你已經按了 {noCount} 次 No，Yes 也長大了 {noCount} 次
          </p>
        )}
      </div>
    </main>
  );
}
