import * as React from "react";

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
import { formatFull } from "@/lib/date";
import { cn } from "@/lib/utils";

export type PlanPayload = {
  date: string;
  activities: string[];
  otherText: string;
  email: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function PlanPage({
  onSubmit,
  submitting,
  serverError,
}: {
  onSubmit: (payload: PlanPayload) => void;
  submitting: boolean;
  serverError: string | null;
}) {
  const [date, setDate] = React.useState<string>("");
  const [picked, setPicked] = React.useState<string[]>([]);
  const [otherText, setOtherText] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  const otherRef = React.useRef<HTMLInputElement | null>(null);
  const allSelected = BASE_IDS.every((id) => picked.includes(id));
  const hasOther = picked.includes(OTHER_ID);

  function toggle(id: string) {
    setPicked((prev) => toggleActivity(prev, id));

    if (id === OTHER_ID) {
      window.setTimeout(() => otherRef.current?.focus(), 60);
    }
  }

  const chosenCount = picked.filter((p) => p !== OTHER_ID).length + (hasOther ? 1 : 0);

  const dateError = !date ? "請挑一個日子" : null;
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
      date,
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
      emoji: "✨",
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
        <header className="mb-7 text-center">
          <p className="text-primary/70 text-xs tracking-[0.4em] uppercase">
            Step 2
          </p>
          <h1 className="text-romance mt-2 font-serif text-3xl font-bold sm:text-4xl">
            那就來安排一下 ♡
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            挑個日子，再選你想做的事
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* 日曆 */}
          <section className="glass-card rounded-[1.75rem] p-5 sm:p-6">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="text-base font-bold">選日期</h2>
              <span
                className={cn(
                  "text-xs",
                  date ? "text-primary font-medium" : "text-muted-foreground",
                )}
              >
                {date ? formatFull(date) : "還沒選"}
              </span>
            </div>
            <Calendar value={date} onChange={setDate} />
            {touched && dateError && (
              <p className="text-destructive mt-3 text-xs">{dateError}</p>
            )}
          </section>

          {/* 約會項目 */}
          <section className="glass-card rounded-[1.75rem] p-5 sm:p-6">
            <h2 className="mb-4 text-base font-bold">約會項目</h2>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {rows.map((row) => (
                <label
                  key={row.id}
                  htmlFor={`act-${row.id}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 transition-all active:scale-[0.985]",
                    row.checked
                      ? "border-primary/35 bg-white/85 shadow-[0_8px_22px_-12px_rgba(216,68,128,0.55)]"
                      : "border-white/70 bg-white/45 hover:bg-white/70",
                    row.id === ALL_ID && "sm:col-span-2",
                  )}
                >
                  <Checkbox
                    id={`act-${row.id}`}
                    checked={row.checked}
                    onCheckedChange={() => toggle(row.id)}
                  />
                  <span className="text-lg leading-none" aria-hidden="true">
                    {row.emoji}
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
          </section>

          {/* Email */}
          <section className="glass-card rounded-[1.75rem] p-5 sm:p-6">
            <Label htmlFor="partner-email" className="text-base font-bold">
              你的 Email
            </Label>
            <p className="text-muted-foreground mt-1 mb-3.5 text-xs leading-relaxed">
              填你自己的信箱，確認信會寄一份給你，來鴻也會收到通知 ♡
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
          </section>

          {serverError && (
            <p className="text-destructive rounded-2xl bg-white/70 px-4 py-3 text-center text-sm">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            variant="romance"
            size="lg"
            disabled={submitting}
            className="shine h-14 w-full text-base font-bold"
          >
            {submitting ? "寄送中…" : "送出 ♡"}
          </Button>

          <p className="text-muted-foreground/70 pb-4 text-center text-[0.7rem]">
            送出之後就不能反悔了喔
          </p>
        </form>
      </div>
    </main>
  );
}
