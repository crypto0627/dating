import type { ReactNode } from "react";

import { BearFace, type BearMood } from "@/components/Bear";
import { BEAR_IMAGES, useBearAssets, type BearImageName } from "@/lib/bearAssets";
import { cn } from "@/lib/utils";

/**
 * 熊抱哥。
 *
 * `public/bear/` 裡有圖檔就用圖檔，沒有就退回內建的 SVG 插畫（`mood` 只有
 * 退回 SVG 時才會用到）。兩種情況版面都一樣，所以可以隨時放圖或拿掉。
 */
export function BearPhoto({
  name = "face",
  mood = "happy",
  className,
  alt = "",
  fallback,
}: {
  name?: BearImageName;
  mood?: BearMood;
  className?: string;
  alt?: string;
  /** 沒有圖檔時要顯示什麼，預設是內建的 BearFace */
  fallback?: ReactNode;
}) {
  const status = useBearAssets();

  if (status !== "ok") {
    return fallback ?? <BearFace mood={mood} className={className} />;
  }

  return (
    <img
      src={BEAR_IMAGES[name]}
      alt={alt}
      draggable={false}
      className={cn("object-contain select-none", className)}
      {...(alt ? {} : { "aria-hidden": true })}
    />
  );
}
