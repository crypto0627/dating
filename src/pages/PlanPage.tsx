import * as React from "react";

import { BearFace, BearPaw } from "@/components/Bear";
import { BearCard } from "@/components/BearCard";
import { Calendar } from "@/components/Calendar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ALL_ID,
  BASE_ACTIVITIES,
  BASE_IDS,
  OTHER_ID,
  toggleActivity,
} from "@/lib/activities";
import { formatShort, groupRanges } from "@/lib/date";
import { cn } from "@/lib/utils";

export type PlanPayload = {
  dates: string[];
  activities: string[];
  otherText: string;
  email: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** 小標題前面蓋一個熊掌印 */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-bold">
      <BearPaw className="text-primary/60 size-4" />
      {children}
    </h2>
  );
}

export function PlanPage({
  onSubmit,
  submitting,
  serverError,
}: {
  onSubmit: (payload: PlanPayload) => void;
  submitting: boolean;
  serverError: string | null;
}) {
  const [dates, setDates] = React.useState<string[]>([]);
  const [picked, setPicked] = React.useState<string[]>([]);
  const [otherText, setOtherText] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  const otherRef = React.useRef<HTMLInputElement | null>(null);
  const allSelected = BASE_IDS.every((id) => picked.includes(id));
  const hasOther = picked.includes(OTHER_ID);

  function toggleDate(key: string) {
    setDates((prev) =>
      prev.includes(key)
        ? prev.filter((d) => d !== key)
        : [...prev, key].sort(),
    );
  }

  function toggle(id: string) {
    setPicked((prev) => toggleActivity(prev, id));

    if (id === OTHER_ID) {
      window.setTimeout(() => otherRef.current?.focus(), 60);
    }
  }

  const chosenCount = picked.filter((p) => p !== OTHER_ID).length + (hasOther ? 1 : 0);

  const dateError = dates.length === 0 ? "至少挑一個日子" : null;
  const activityError = chosenCount === 0 ? "至少選一個約會項目" : null;
  const otherError =
    hasOther && otherText.trim().length === 0 ? "「其他」要寫一下是什麼喔" : null;
  const emailError = !EMAIL_RE.test(email.trim())
    ? "請填一個看得懂的 Email"
    : null;

  const firstError = dateError ?? activityError ?? otherError ?? emailError;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (firstError) return;
    onSubmit({
      dates: [...dates].sort(),
      activities: picked,
      otherText: otherText.trim(),
      email: email.trim(),
    });
  }

  const rows = [
    ...BASE_ACTIVITIES.map((a) => ({
      id: a.id as string,
      label: a.label as string,
      emoji: a.emoji as string,
      checked: picked.includes(a.id),
    })),
    {
      id: ALL_ID,
      label: "以上都要",
      emoji: "",
      checked: allSelected,
    },
    {
      id: OTHER_ID,
      label: "其他",
      emoji: "💭",
      checked: hasOther,
    },
  ];

  return (
    <main className="relative z-10 flex min-h-[100svh] flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="animate-fade-up w-full max-w-lg">
        <header className="mb-9 flex flex-col items-center text-center">
          <BearFace
            mood="love"
            wiggle
            className="animate-bear-bob size-20 drop-shadow-[0_12px_22px_rgba(214,45,99,0.3)]"
          />
          <p className="text-primary/70 mt-3 text-xs tracking-[0.4em] uppercase">
            Step 2
          </p>
          <h1 className="text-bear mt-2 flex items-center justify-center gap-2 font-serif text-3xl font-bold sm:text-4xl">
            那就來安排一下
            <BearFace mood="love" className="size-8 sm:size-9" />
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            挑個日子，再選你想跟熊抱哥做的事
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate className="space-y-9">
          {/* 日曆 */}
          <BearCard>
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <SectionTitle>選日期</SectionTitle>
              <span
                className={cn(
                  "text-xs",
                  dates.length
                    ? "text-primary font-medium"
                    : "text-muted-foreground",
                )}
              >
                {dates.length ? `已選 ${dates.length} 天` : "還沒選"}
              </span>
            </div>

            <Calendar value={dates} onToggle={toggleDate} />

            {dates.length > 0 && (
              <div className="animate-fade-up mt-4 border-t border-white/60 pt-4">
                <div className="flex flex-wrap gap-1.5">
                  {groupRanges(dates).map((r) => (
                    <span
                      key={r.start}
                      className="text-primary inline-flex items-center gap-1.5 rounded-full bg-white/75 px-3 py-1.5 text-xs font-medium shadow-sm dark:bg-white/10"
                    >
                      <BearPaw className="text-primary/55 size-3" />
                      {r.start === r.end
                        ? formatShort(r.start)
                        : `${formatShort(r.start)} – ${formatShort(r.end)}`}
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setDates([])}
                    className="text-muted-foreground hover:text-destructive rounded-full px-2.5 py-1.5 text-xs transition-colors"
                  >
                    清除
                  </button>
                </div>
              </div>
            )}

            {touched && dateError && (
              <p className="text-destructive mt-3 text-xs">{dateError}</p>
            )}
          </BearCard>

          {/* 約會項目 */}
          <BearCard>
            <div className="mb-4">
              <SectionTitle>約會項目</SectionTitle>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {rows.map((row) => (
                <label
                  key={row.id}
                  htmlFor={`act-${row.id}`}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 transition-all active:scale-[0.985]",
                    row.checked
                      ? "border-primary/35 bg-white/85 shadow-[0_8px_22px_-12px_rgba(214,45,99,0.55)]"
                      : "border-white/70 bg-white/45 hover:bg-white/70",
                    row.id === ALL_ID && "sm:col-span-2",
                  )}
                >
                  {/* 選到的項目，右下角會探出一隻熊抱哥 */}
                  {row.checked && (
                    <BearFace
                      mood="love"
                      className="animate-pop-in pointer-events-none absolute -right-2 -bottom-3 size-11 opacity-25"
                    />
                  )}

                  <Checkbox
                    id={`act-${row.id}`}
                    checked={row.checked}
                    onCheckedChange={() => toggle(row.id)}
                  />
                  <span
                    className="flex w-6 justify-center text-lg leading-none"
                    aria-hidden="true"
                  >
                    {row.id === ALL_ID ? (
                      <BearFace mood="happy" className="size-6" />
                    ) : (
                      row.emoji
                    )}
                  </span>
                  <span className="text-[0.95rem] font-medium">
                    {row.label}
                  </span>
                </label>
              ))}
            </div>

            {hasOther && (
              <div className="animate-fade-up mt-3">
                <Input
                  ref={otherRef}
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="其他想做的事…（例如：看展、打羽球、一起耍廢）"
                  maxLength={120}
                  aria-label="其他約會項目"
                />
              </div>
            )}

            {touched && (activityError || otherError) && (
              <p className="text-destructive mt-3 text-xs">
                {activityError ?? otherError}
              </p>
            )}
          </BearCard>

          {/* Email */}
          <BearCard>
            <Label
              htmlFor="partner-email"
              className="flex items-center gap-2 text-base font-bold"
            >
              <BearPaw className="text-primary/60 size-4" />
              你的 Email
            </Label>
            <p className="text-muted-foreground mt-1 mb-3.5 text-xs leading-relaxed">
              填你自己的信箱，確認信會寄一份給你，來鴻也會收到通知
            </p>
            <Input
              id="partner-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="你的 Email"
            />
            {touched && emailError && (
              <p className="text-destructive mt-2.5 text-xs">{emailError}</p>
            )}
          </BearCard>

          {serverError && (
            <p className="text-destructive rounded-2xl bg-white/70 px-4 py-3 text-center text-sm">
              {serverError}
            </p>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              variant="bear"
              size="lg"
              disabled={submitting}
              className="shine h-14 w-full gap-2.5 text-base font-bold"
            >
              <BearPaw className="size-4 text-white/90" />
              {submitting ? "熊抱哥送信中…" : "送出"}
              {!submitting && <BearFace mood="love" className="size-5" />}
            </Button>

            <div className="flex justify-center gap-0.5" aria-hidden="true">
              {["happy", "love", "wink", "blush", "smug"].map((m, i) => (
                <BearFace
                  key={i}
                  mood={m as never}
                  className="size-7 opacity-70"
                />
              ))}
            </div>

            <p className="text-muted-foreground/70 pb-4 text-center text-[0.7rem]">
              送出之後就不能反悔了喔，熊抱哥都看著
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
