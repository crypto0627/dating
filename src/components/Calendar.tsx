import * as React from "react";

import { cn } from "@/lib/utils";
import {
  WEEKDAY_TC,
  addMonths,
  isSameDay,
  startOfDay,
  toKey,
} from "@/lib/date";

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

type CalendarProps = {
  /** 已選日期（YYYY-MM-DD），可以是一天，也可以是很多天 */
  value: string[];
  /** 點某一天 → 加入或移除 */
  onToggle: (key: string) => void;
  /** 早於今天的日期不能選 */
  disablePast?: boolean;
  className?: string;
};

/**
 * 輕量日曆（不依賴第三方套件），樣式與 shadcn/ui 一致。
 * 週一起始，多選：點一下加入、再點一下移除；連續的日子會連成一條。
 */
export function Calendar({
  value,
  onToggle,
  disablePast = true,
  className,
}: CalendarProps) {
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const selected = React.useMemo(() => new Set(value), [value]);

  const [cursor, setCursor] = React.useState<Date>(() => {
    const first = [...value].sort()[0];
    if (first) {
      const [y, m] = first.split("-").map(Number);
      return new Date(y, (m ?? 1) - 1, 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // 週一為一週之始
  const days = React.useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7; // Mon=0
    const start = new Date(first);
    start.setDate(first.getDate() - offset);

    const cells: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      cells.push(d);
    }
    return cells;
  }, [cursor]);

  const atFirstMonth =
    disablePast &&
    cursor.getFullYear() === today.getFullYear() &&
    cursor.getMonth() === today.getMonth();

  const weekHead = [1, 2, 3, 4, 5, 6, 0].map((i) => WEEKDAY_TC[i]);

  function neighbourKey(d: Date, delta: number) {
    const n = new Date(d);
    n.setDate(d.getDate() + delta);
    return toKey(n);
  }

  return (
    <div className={cn("w-full select-none", className)}>
      {/* 月份切換 */}
      <div className="mb-3 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setCursor((c) => addMonths(c, -1))}
          disabled={atFirstMonth}
          aria-label="上個月"
          className="text-foreground/70 hover:text-foreground grid size-9 place-items-center rounded-full border border-white/70 bg-white/60 shadow-sm transition-all hover:bg-white active:scale-95 disabled:pointer-events-none disabled:opacity-30 dark:bg-white/10"
        >
          <ChevronLeft />
        </button>

        <div
          className="font-serif text-lg font-bold tracking-wide"
          aria-live="polite"
        >
          {cursor.getFullYear()} 年 {cursor.getMonth() + 1} 月
        </div>

        <button
          type="button"
          onClick={() => setCursor((c) => addMonths(c, 1))}
          aria-label="下個月"
          className="text-foreground/70 hover:text-foreground grid size-9 place-items-center rounded-full border border-white/70 bg-white/60 shadow-sm transition-all hover:bg-white active:scale-95 dark:bg-white/10"
        >
          <ChevronRight />
        </button>
      </div>

      {/* 星期列 */}
      <div className="text-muted-foreground mb-1 grid grid-cols-7 gap-y-1 text-center text-[0.7rem] font-medium">
        {weekHead.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      {/* 日期格 */}
      <div className="grid grid-cols-7 gap-y-1" role="grid">
        {days.map((d) => {
          const key = toKey(d);
          const outside = d.getMonth() !== cursor.getMonth();
          const past = disablePast && d < today;
          const isOn = selected.has(key);
          const isToday = isSameDay(d, today);

          // 連續選取時，左右接起來（週一/週日為斷點，避免跨行連線）
          const dow = d.getDay();
          const joinLeft = isOn && dow !== 1 && selected.has(neighbourKey(d, -1));
          const joinRight = isOn && dow !== 0 && selected.has(neighbourKey(d, 1));

          return (
            <div key={key} className="relative py-0.5">
              {/* 連續選取的日子之間畫一條連接帶 */}
              {(joinLeft || joinRight) && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute top-1/2 -z-0 h-9 -translate-y-1/2 bg-[linear-gradient(135deg,#ff8ab5_0%,#ee5d96_50%,#d6417c_100%)] opacity-90",
                    joinLeft && joinRight && "-left-1 -right-1",
                    joinLeft && !joinRight && "-left-1 right-1/2",
                    !joinLeft && joinRight && "left-1/2 -right-1",
                  )}
                />
              )}

              <button
                type="button"
                role="gridcell"
                aria-selected={isOn}
                aria-current={isToday ? "date" : undefined}
                aria-label={`${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`}
                disabled={past}
                onClick={() => onToggle(key)}
                className={cn(
                  "relative z-10 mx-auto grid aspect-square w-full max-w-10 place-items-center rounded-2xl text-sm font-medium transition-all",
                  "hover:bg-white/85 active:scale-95",
                  outside && "text-muted-foreground/40",
                  past && "pointer-events-none opacity-25",
                  isToday &&
                    !isOn &&
                    "ring-primary/40 text-primary ring-1 ring-inset",
                  isOn &&
                    "bg-[linear-gradient(135deg,#ff8ab5_0%,#ee5d96_50%,#d6417c_100%)] text-white shadow-[0_8px_20px_-8px_rgba(216,68,128,0.8)]",
                  isOn && !joinLeft && !joinRight && "scale-[1.04]",
                )}
              >
                {d.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-muted-foreground/70 mt-3 text-center text-[0.7rem]">
        可以只選一天，也可以點好幾天 · 再點一次取消
      </p>
    </div>
  );
}
