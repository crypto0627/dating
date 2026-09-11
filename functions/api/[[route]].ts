import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { cors } from "hono/cors";

type Bindings = {
  /** Resend API key（存成 Cloudflare Secret，別進 git） */
  RESEND_API_KEY: string;
  /** 寄件者，例如 "來鴻 <crypto0627@jakekuo.com>" */
  FROM_EMAIL?: string;
  /** 收通知的人 */
  NOTIFY_EMAIL?: string;
  /** 網站上的名字 */
  OWNER_NAME?: string;
};

const DEFAULT_FROM = "來鴻 <crypto0627@jakekuo.com>";
const DEFAULT_NOTIFY = "jake0627a1@gmail.com";
const DEFAULT_OWNER = "來鴻";

const BASE_ACTIVITIES: Record<string, string> = {
  gym: "健身",
  food: "吃好料",
  citywalk: "City walk",
  dog: "嚕狗狗",
};
const BASE_ORDER = ["gym", "food", "citywalk", "dog"];
const OTHER_ID = "other";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type DateBody = {
  date?: unknown;
  activities?: unknown;
  otherText?: unknown;
  email?: unknown;
};

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** ICS 內文跳脫：反斜線、逗號、分號、換行 */
function escapeIcs(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * RFC 5545 的行折疊：以 **octet**（不是字元）計算，中文一個字 3 bytes。
 * 用 for...of 逐 code point 走，避免把多位元組字元或代理對切成兩半。
 */
function foldIcsLine(line: string): string {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 73) return line;

  const out: string[] = [];
  let cur = "";
  let curBytes = 0;
  let first = true;

  for (const ch of line) {
    const b = enc.encode(ch).length;
    const limit = first ? 73 : 72; // 續行會補一個前導空白
    if (curBytes + b > limit) {
      out.push(first ? cur : " " + cur);
      first = false;
      cur = "";
      curBytes = 0;
    }
    cur += ch;
    curBytes += b;
  }
  if (cur) out.push(first ? cur : " " + cur);

  return out.join("\r\n");
}

const WEEKDAY_TC = ["日", "一", "二", "三", "四", "五", "六"];

function formatFull(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  // 用 UTC 建構避免時區位移，只拿來算星期
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${y} 年 ${m} 月 ${d} 日（週${WEEKDAY_TC[dow]}）`;
}

function summarize(activities: string[], otherText: string): string {
  const bases = BASE_ORDER.filter((id) => activities.includes(id));
  const parts: string[] =
    bases.length === BASE_ORDER.length
      ? ["以上都要（健身・吃好料・City walk・嚕狗狗）"]
      : bases.map((id) => BASE_ACTIVITIES[id]);

  if (activities.includes(OTHER_ID) && otherText) {
    parts.push(`其他：${otherText}`);
  }
  return parts.join("・");
}

/** 隔天的 YYYYMMDD（全天事件的 DTEND 是排他的） */
function nextDayCompact(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + 1);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

function buildIcs(opts: {
  date: string;
  summary: string;
  owner: string;
}): string {
  const compact = opts.date.replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid = `${compact}-${Math.random().toString(36).slice(2, 10)}@dating`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//dating//TW//ZH",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact}`,
    `DTEND;VALUE=DATE:${nextDayCompact(opts.date)}`,
    `SUMMARY:${escapeIcs(`跟${opts.owner}的約會 ♡`)}`,
    `DESCRIPTION:${escapeIcs(
      `約會項目：${opts.summary}\n不能放鳥，不能反悔 ♡`,
    )}`,
    "TRANSP:TRANSPARENT",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(`明天要跟${opts.owner}約會囉 ♡`)}`,
    "TRIGGER:-P1D",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(foldIcsLine).join("\r\n") + "\r\n";
}

function notifyHtml(o: {
  owner: string;
  dateText: string;
  summary: string;
  email: string;
}): string {
  return `<!doctype html>
<html lang="zh-Hant"><body style="margin:0;padding:0;background:#fff5f9;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff5f9;padding:32px 12px;font-family:-apple-system,'Noto Sans TC','PingFang TC','Segoe UI',sans-serif;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 46px -20px rgba(216,68,128,0.42);">
  <tr><td style="background:linear-gradient(135deg,#ff8ab5 0%,#ee5d96 50%,#d6417c 100%);padding:30px 28px;text-align:center;">
    <div style="font-size:34px;line-height:1;">💌</div>
    <div style="color:#fff;font-size:20px;font-weight:700;margin-top:10px;">她答應了！</div>
    <div style="color:rgba(255,255,255,0.9);font-size:13px;margin-top:6px;">約定已成立 · 不能放鳥 · 不能反悔</div>
  </td></tr>
  <tr><td style="padding:28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;color:#4a2436;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #ffe4ef;"><strong style="color:#d6417c;">日期</strong><br/>${escapeHtml(
        o.dateText,
      )}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #ffe4ef;"><strong style="color:#d6417c;">約會項目</strong><br/>${escapeHtml(
        o.summary,
      )}</td></tr>
      <tr><td style="padding:10px 0;"><strong style="color:#d6417c;">她的 Email</strong><br/><a href="mailto:${escapeHtml(
        o.email,
      )}" style="color:#ee5d96;">${escapeHtml(o.email)}</a></td></tr>
    </table>
    <p style="margin:22px 0 0;font-size:12px;color:#a77e93;line-height:1.7;">直接回覆這封信就會回到她的信箱。<br/>行事曆檔案（.ics）已附在這封信裡。</p>
  </td></tr>
</table>
<div style="font-size:11px;color:#c49ab0;margin-top:16px;">${escapeHtml(
    o.owner,
  )} · dating</div>
</td></tr></table></body></html>`;
}

function confirmHtml(o: {
  owner: string;
  dateText: string;
  summary: string;
}): string {
  return `<!doctype html>
<html lang="zh-Hant"><body style="margin:0;padding:0;background:#fff5f9;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff5f9;padding:32px 12px;font-family:-apple-system,'Noto Sans TC','PingFang TC','Segoe UI',sans-serif;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 46px -20px rgba(216,68,128,0.42);">
  <tr><td style="background:linear-gradient(135deg,#ff8ab5 0%,#ee5d96 50%,#d6417c 100%);padding:32px 28px;text-align:center;">
    <div style="font-size:36px;line-height:1;">💗</div>
    <div style="color:#fff;font-size:21px;font-weight:700;margin-top:10px;">妳已經完成跟${escapeHtml(
      o.owner,
    )}的約定</div>
    <div style="color:rgba(255,255,255,0.92);font-size:13px;margin-top:8px;letter-spacing:1px;">不能放鳥・不能反悔</div>
  </td></tr>
  <tr><td style="padding:28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;color:#4a2436;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #ffe4ef;"><strong style="color:#d6417c;">日期</strong><br/>${escapeHtml(
        o.dateText,
      )}</td></tr>
      <tr><td style="padding:10px 0;"><strong style="color:#d6417c;">約會項目</strong><br/>${escapeHtml(
        o.summary,
      )}</td></tr>
    </table>
    <p style="margin:22px 0 0;font-size:13px;color:#a77e93;line-height:1.8;">附件的 <code>.ics</code> 可以直接加進 Apple 行事曆 ♡<br/>到時候見 :)</p>
  </td></tr>
</table>
<div style="font-size:11px;color:#c49ab0;margin-top:16px;">${escapeHtml(
    o.owner,
  )} · dating</div>
</td></tr></table></body></html>`;
}

/** Cloudflare Workers 沒有 Buffer，自己做 base64 */
function toBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  const chunk = 0x2000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

type ResendPayload = {
  from: string;
  to: string[];
  subject: string;
  html: string;
  reply_to?: string;
  attachments?: { filename: string; content: string }[];
};

async function sendEmail(apiKey: string, payload: ResendPayload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${text.slice(0, 300)}`);
  }
  return text;
}

/* ------------------------------------------------------------------ */
/* app                                                                 */
/* ------------------------------------------------------------------ */

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app.use("*", cors({ origin: "*", allowMethods: ["GET", "POST", "OPTIONS"] }));

/**
 * 健康檢查 / 設定診斷。
 * 只回傳「有沒有設定」的布林值與寄件者，不會洩漏 key 本身。
 */
app.get("/health", (c) =>
  c.json({
    ok: true,
    ts: Date.now(),
    config: {
      resendKey: Boolean(c.env.RESEND_API_KEY),
      resendKeyPrefix: c.env.RESEND_API_KEY
        ? c.env.RESEND_API_KEY.slice(0, 3)
        : null,
      from: c.env.FROM_EMAIL || `${DEFAULT_FROM}（預設值）`,
      notify: c.env.NOTIFY_EMAIL || `${DEFAULT_NOTIFY}（預設值）`,
      owner: c.env.OWNER_NAME || `${DEFAULT_OWNER}（預設值）`,
    },
  }),
);

app.post("/date", async (c) => {
  let body: DateBody;
  try {
    body = await c.req.json<DateBody>();
  } catch {
    return c.json({ ok: false, error: "格式怪怪的" }, 400);
  }

  const date = typeof body.date === "string" ? body.date.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const otherText =
    typeof body.otherText === "string" ? body.otherText.trim().slice(0, 120) : "";
  const activities = Array.isArray(body.activities)
    ? body.activities.filter((a): a is string => typeof a === "string")
    : [];

  if (!DATE_RE.test(date)) {
    return c.json({ ok: false, error: "日期格式不對" }, 400);
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return c.json({ ok: false, error: "Email 格式不對" }, 400);
  }

  const valid = activities.filter(
    (a) => a === OTHER_ID || BASE_ORDER.includes(a),
  );
  if (valid.length === 0) {
    return c.json({ ok: false, error: "至少選一個約會項目" }, 400);
  }
  if (valid.includes(OTHER_ID) && !otherText) {
    return c.json({ ok: false, error: "「其他」要寫一下是什麼喔" }, 400);
  }

  const apiKey = c.env.RESEND_API_KEY;
  if (!apiKey) {
    return c.json(
      { ok: false, error: "伺服器還沒設定好寄信服務（RESEND_API_KEY）" },
      500,
    );
  }

  const owner = c.env.OWNER_NAME || DEFAULT_OWNER;
  const from = c.env.FROM_EMAIL || DEFAULT_FROM;
  const notify = c.env.NOTIFY_EMAIL || DEFAULT_NOTIFY;

  const summary = summarize(valid, otherText);
  const dateText = formatFull(date);
  const ics = buildIcs({ date, summary, owner });
  const attachments = [
    { filename: "date-with-laihong.ics", content: toBase64(ics) },
  ];

  // 通知信一定要成功；確認信失敗不擋流程
  try {
    await sendEmail(apiKey, {
      from,
      to: [notify],
      reply_to: email,
      subject: `💗 約會成立：${dateText}`,
      html: notifyHtml({ owner, dateText, summary, email }),
      attachments,
    });
  } catch (err) {
    console.error("notify mail failed", err);
    return c.json({ ok: false, error: "寄信失敗了，再試一次好嗎？" }, 502);
  }

  try {
    await sendEmail(apiKey, {
      from,
      to: [email],
      reply_to: notify,
      subject: `💗 妳已經完成跟${owner}的約定`,
      html: confirmHtml({ owner, dateText, summary }),
      attachments,
    });
  } catch (err) {
    console.error("confirm mail failed", err);
  }

  const icsUrl = `/api/ics?date=${encodeURIComponent(
    date,
  )}&summary=${encodeURIComponent(summary)}`;

  return c.json({ ok: true, summary, dateText, icsUrl });
});

app.get("/ics", (c) => {
  const date = (c.req.query("date") ?? "").trim();
  if (!DATE_RE.test(date)) {
    return c.text("bad date", 400);
  }
  const summary = (c.req.query("summary") ?? "").slice(0, 200);
  const owner = c.env.OWNER_NAME || DEFAULT_OWNER;

  const ics = buildIcs({ date, summary, owner });

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="date-with-laihong.ics"',
      "Cache-Control": "no-store",
    },
  });
});

app.notFound((c) => c.json({ ok: false, error: "not found" }, 404));

export const onRequest = handle(app);
