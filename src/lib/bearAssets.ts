import { useSyncExternalStore } from "react";

/**
 * 熊抱哥的圖片資源。
 *
 * 把圖檔放到 `public/bear/` 底下，命名照下面的表，網站就會自動改用圖片；
 * 檔案不存在的話會自動退回內建的 SVG 插畫，不會破版。
 *
 *   public/bear/bear-hello.png    ← 打招呼 / 全身
 *   public/bear/bear-face.png     ← 大頭特寫
 *   public/bear/bear-excited.png  ← 舉手 / 激動
 *
 * 建議用「去背」的 PNG 或 WebP，不然飄在背景的時候會是一個一個白色方塊。
 */
export const BEAR_IMAGES = {
  hello: "/bear/bear-hello.png",
  face: "/bear/bear-face.png",
  excited: "/bear/bear-excited.png",
} as const;

export type BearImageName = keyof typeof BEAR_IMAGES;

type Status = "unknown" | "ok" | "missing";

let status: Status = "unknown";
const subscribers = new Set<() => void>();

/** 全站只探測一次，不要一百個 <img> 各自送一個 404 */
if (typeof window !== "undefined") {
  const probe = new Image();
  probe.onload = () => {
    status = "ok";
    subscribers.forEach((fn) => fn());
  };
  probe.onerror = () => {
    status = "missing";
    subscribers.forEach((fn) => fn());
  };
  probe.src = BEAR_IMAGES.face;
}

function subscribe(cb: () => void) {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

/** 圖檔到底有沒有放進去 */
export function useBearAssets(): Status {
  return useSyncExternalStore(
    subscribe,
    () => status,
    () => "unknown" as const,
  );
}
