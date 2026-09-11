import * as React from "react";

import { Bubbles } from "@/components/Bubbles";
import { AskPage } from "@/pages/AskPage";
import { PlanPage, type PlanPayload } from "@/pages/PlanPage";
import { CalendarDialog, PromiseDialog } from "@/pages/DoneDialogs";
import { summarize } from "@/lib/activities";

type Step = "ask" | "plan";

export default function App() {
  const [step, setStep] = React.useState<Step>("ask");
  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const [promiseOpen, setPromiseOpen] = React.useState(false);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [result, setResult] = React.useState<{
    date: string;
    summary: string;
    icsUrl: string;
  } | null>(null);

  async function handleSubmit(payload: PlanPayload) {
    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        icsUrl?: string;
        summary?: string;
      };

      if (!res.ok || !data.ok) {
        setServerError(data.error ?? "寄送失敗了，再試一次好嗎？");
        return;
      }

      setResult({
        date: payload.date,
        summary: data.summary ?? summarize(payload.activities, payload.otherText),
        icsUrl: data.icsUrl ?? "",
      });
      setPromiseOpen(true);
    } catch {
      setServerError("網路好像有點問題，再試一次好嗎？");
    } finally {
      setSubmitting(false);
    }
  }

  function backToHome() {
    setCalendarOpen(false);
    setPromiseOpen(false);
    setResult(null);
    setServerError(null);
    setStep("ask");
    window.scrollTo({ top: 0 });
  }

  return (
    <>
      <Bubbles />

      {step === "ask" ? (
        <AskPage onYes={() => setStep("plan")} />
      ) : (
        <PlanPage
          onSubmit={handleSubmit}
          submitting={submitting}
          serverError={serverError}
        />
      )}

      <PromiseDialog
        open={promiseOpen}
        date={result?.date ?? ""}
        summary={result?.summary ?? ""}
        onNext={() => {
          setPromiseOpen(false);
          setCalendarOpen(true);
        }}
      />

      <CalendarDialog
        open={calendarOpen}
        icsUrl={result?.icsUrl ?? ""}
        onDone={backToHome}
      />
    </>
  );
}
