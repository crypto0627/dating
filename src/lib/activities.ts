export const BASE_ACTIVITIES = [
  { id: "gym", label: "健身", emoji: "💪" },
  { id: "food", label: "吃好料", emoji: "🍣" },
  { id: "citywalk", label: "City walk", emoji: "🚶" },
  { id: "dog", label: "嚕狗狗", emoji: "🐶" },
] as const;

export const ALL_ID = "all";
export const OTHER_ID = "other";

export type ActivityId =
  | (typeof BASE_ACTIVITIES)[number]["id"]
  | typeof ALL_ID
  | typeof OTHER_ID;

export const LABEL_BY_ID: Record<string, string> = {
  ...Object.fromEntries(BASE_ACTIVITIES.map((a) => [a.id, a.label])),
  [ALL_ID]: "以上都要",
  [OTHER_ID]: "其他",
};

export const BASE_IDS: string[] = BASE_ACTIVITIES.map((a) => a.id);

/**
 * 勾選 / 取消一個項目。
 * 「以上都要」不會被存進 picked，它只是把四個基本項目一次打勾或一次取消。
 */
export function toggleActivity(picked: string[], id: string): string[] {
  if (id === ALL_ID) {
    const everyBase = BASE_IDS.every((b) => picked.includes(b));
    const withoutBase = picked.filter((p) => !BASE_IDS.includes(p));
    return everyBase ? withoutBase : [...withoutBase, ...BASE_IDS];
  }
  return picked.includes(id)
    ? picked.filter((p) => p !== id)
    : [...picked, id];
}

/** 依原始清單順序組出「健身・吃好料」這種文字 */
export function summarize(picked: string[], otherText: string): string {
  const bases = BASE_IDS.filter((id) => picked.includes(id));
  const parts: string[] =
    bases.length === BASE_IDS.length
      ? [LABEL_BY_ID[ALL_ID]]
      : bases.map((id) => LABEL_BY_ID[id]);

  if (picked.includes(OTHER_ID) && otherText) {
    parts.push(`其他：${otherText}`);
  }
  return parts.join("・");
}
