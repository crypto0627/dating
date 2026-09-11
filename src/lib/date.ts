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

/** 兩個日期字串差幾天 */
export function daysBetween(a: string, b: string): number {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  const t1 = Date.UTC(y1, m1 - 1, d1);
  const t2 = Date.UTC(y2, m2 - 1, d2);
  return Math.round((t2 - t1) / 86400000);
}

export type DateRange = { start: string; end: string };

/** 把一堆日期排序後，合併成連續區間，例如 9/20,9/21,9/27 → [9/20–9/21, 9/27] */
export function groupRanges(keys: string[]): DateRange[] {
  const sorted = [...new Set(keys)].sort();
  const out: DateRange[] = [];

  for (const key of sorted) {
    const last = out[out.length - 1];
    if (last && daysBetween(last.end, key) === 1) {
      last.end = key;
    } else {
      out.push({ start: key, end: key });
    }
  }
  return out;
}

/** 「9/20 (日) – 9/22 (二)、9/27 (日)」 */
export function formatRanges(keys: string[]): string {
  return groupRanges(keys)
    .map((r) =>
      r.start === r.end
        ? formatShort(r.start)
        : `${formatShort(r.start)} – ${formatShort(r.end)}`,
    )
    .join("、");
}

/** 信件 / 彈窗用的完整版；超過兩段就退回簡短寫法 */
export function formatDatesFull(keys: string[]): string {
  const ranges = groupRanges(keys);
  if (ranges.length === 1 && ranges[0].start === ranges[0].end) {
    return formatFull(ranges[0].start);
  }
  const total = new Set(keys).size;
  return `${formatRanges(keys)}（共 ${total} 天）`;
}
