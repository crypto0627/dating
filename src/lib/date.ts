/** 本地時區安全的日期工具（一律用 YYYY-MM-DD 字串在前後端之間傳遞） */

export function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const WEEKDAY_TC = ["日", "一", "二", "三", "四", "五", "六"];

/** 2026年9月20日（週日） */
export function formatFull(key: string): string {
  const d = fromKey(key);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日（週${
    WEEKDAY_TC[d.getDay()]
  }）`;
}

/** 9/20 (日) */
export function formatShort(key: string): string {
  const d = fromKey(key);
  return `${d.getMonth() + 1}/${d.getDate()} (${WEEKDAY_TC[d.getDay()]})`;
}

export { WEEKDAY_TC };
