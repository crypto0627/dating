import { BearFace, BearHug, BearPaw } from "@/components/Bear";
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
            <div className="flex justify-center">
              <BearHug className="animate-bear-hug h-24 w-28 drop-shadow-[0_12px_22px_rgba(214,45,99,0.32)]" />
            </div>
            <DialogTitle className="text-bear font-serif text-2xl">
              妳已經完成跟來鴻的約定
            </DialogTitle>
            <DialogDescription className="text-[0.95rem]">
              <span className="text-primary font-semibold">
                不能放鳥・不能反悔
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="relative overflow-hidden rounded-2xl bg-white/65 px-4 py-3.5 text-center text-sm dark:bg-white/10">
            <BearPaw className="text-primary/10 absolute -top-2 -left-3 size-14" />
            <BearPaw className="text-primary/10 absolute -right-3 -bottom-3 size-12" />
            <p className="relative font-semibold">
              {dates.length ? formatDatesFull(dates) : ""}
            </p>
            <p className="text-muted-foreground relative mt-1 text-xs leading-relaxed">
              {summary}
            </p>
          </div>

          {/* 一排熊抱哥幫你蓋章 */}
          <div className="flex justify-center gap-0.5" aria-hidden="true">
            {["love", "happy", "smug", "wink", "blush", "love", "happy"].map(
              (m, i) => (
                <BearFace key={i} mood={m as never} className="size-8" />
              ),
            )}
          </div>

          <DialogFooter>
            <Button
              variant="bear"
              size="lg"
              onClick={onNext}
              className="shine w-full gap-2.5 sm:w-auto sm:px-10"
            >
              <BearPaw className="size-4 text-white/90" />
              好，我不會放鳥
              <BearFace mood="love" className="size-5" />
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
          <div className="flex justify-center">
            <BearFace
              mood="wink"
              wiggle
              className="animate-bear-bob size-20 drop-shadow-[0_12px_22px_rgba(214,45,99,0.3)]"
            />
          </div>
          <DialogTitle className="font-serif text-2xl">
            要加入行事曆嗎？
          </DialogTitle>
          <DialogDescription>
            加進 Apple 行事曆，這樣就真的跑不掉了
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild variant="bear" size="lg" className="w-full gap-2.5">
            <a
              href={icsUrl}
              download="date-with-laihong.ics"
              onClick={() => window.setTimeout(onDone, 1600)}
            >
              <BearPaw className="size-4 text-white/90" />
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
