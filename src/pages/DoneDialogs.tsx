import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Confetti } from "@/components/Confetti";
import { formatDatesFull } from "@/lib/date";

/** 步驟一：約定成立 */
export function PromiseDialog({
  open,
  dates,
  summary,
  onNext,
}: {
  open: boolean;
  dates: string[];
  summary: string;
  onNext: () => void;
}) {
  return (
    <>
      {open && <Confetti />}
      <Dialog open={open}>
        <DialogContent
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <div className="animate-heart-beat mb-1 text-center text-4xl">
              💌
            </div>
            <DialogTitle className="text-romance font-serif text-2xl">
              妳已經完成跟來鴻的約定
            </DialogTitle>
            <DialogDescription className="text-[0.95rem]">
              <span className="text-primary font-semibold">
                不能放鳥・不能反悔
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl bg-white/65 px-4 py-3.5 text-center text-sm dark:bg-white/10">
            <p className="font-semibold">
              {dates.length ? formatDatesFull(dates) : ""}
            </p>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {summary}
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="romance"
              size="lg"
              onClick={onNext}
              className="shine w-full sm:w-auto sm:px-10"
            >
              好，我不會放鳥 ♡
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** 步驟二：加入行事曆 */
export function CalendarDialog({
  open,
  icsUrl,
  onDone,
}: {
  open: boolean;
  icsUrl: string;
  onDone: () => void;
}) {
  return (
    <Dialog open={open}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="mb-1 text-center text-4xl">🗓️</div>
          <DialogTitle className="font-serif text-2xl">
            要加入行事曆嗎？
          </DialogTitle>
          <DialogDescription>
            加進 Apple 行事曆，這樣就真的跑不掉了
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild variant="romance" size="lg" className="w-full">
            <a
              href={icsUrl}
              download="date-with-laihong.ics"
              onClick={() => window.setTimeout(onDone, 1600)}
            >
              加入 Apple 行事曆
            </a>
          </Button>
          <Button variant="ghost" size="default" onClick={onDone} className="w-full">
            不用了，我記得住
          </Button>
        </DialogFooter>

        <p className="text-muted-foreground/70 text-center text-[0.7rem] leading-relaxed">
          iPhone / Mac 會直接用「行事曆」App 開啟；
          <br />
          Google 行事曆可以用「匯入 .ics」加入。
        </p>
      </DialogContent>
    </Dialog>
  );
}
