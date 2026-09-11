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
  /** 已選日期，YYYY-MM-DD */
  value?: string;
  onChange: (key: string) => void;
  /** 早於今天的日期不能選 */
  disablePast?: boolean;
  className?: string;
};

/**
 * 輕量日曆（不依賴第三方套件），樣式與 shadcn/ui 一致。
 * 週一起始，支援鍵盤操作與 aria。
 */
export function Calendar({
  value,
  onChange,
  disablePast = true,
  className,
}: CalendarProps) {
  const today = React.useMemo(() => startOfDay(new Date()), []);

  const [cursor, setCursor] = React.useState<Date>(() => {
    if (value) {
      const [y, m] = value.split("-").map(Number);
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
      <div className="text-muted-foreground mb-1 grid grid-cols-7 gap-0.5 text-center text-[0.7rem] font-medium">
        {weekHead.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      {/* 日期格 */}
      <div className="grid grid-cols-7 gap-0.5" role="grid">
        {days.map((d) => {
          const key = toKey(d);
          const outside = d.getMonth() !== cursor.getMonth();
          const past = disablePast && d < today;
          const selected = value === key;
          const isToday = isSameDay(d, today);

          return (
            <button
              key={key}
              type="button"
              role="gridcell"
              aria-selected={selected}
              aria-current={isToday ? "date" : undefined}
              disabled={past}
              onClick={() => onChange(key)}
              className={cn(
                "relative mx-auto grid aspect-square w-full max-w-11 place-items-center rounded-2xl text-sm font-medium transition-all",
                "hover:bg-white/85 active:scale-95",
                outside && "text-muted-foreground/40",
                past && "pointer-events-none opacity-25",
                isToday &&
                  !selected &&
                  "ring-primary/40 text-primary ring-1 ring-inset",
                selected &&
                  "scale-[1.04] bg-[linear-gradient(135deg,#ff8ab5_0%,#ee5d96_50%,#d6417c_100%)] text-white shadow-[0_10px_24px_-8px_rgba(216,68,128,0.8)]",
              )}
            >
              {d.getDate()}
              {selected && (
                <span className="absolute -bottom-0.5 text-[0.6rem] leading-none">
                  ♡
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
