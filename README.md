# 要不要跟我約會？ 💗

Cloudflare Pages + Hono + Resend 做的約會邀請網頁。

- **前端**：React 19 · Vite · TypeScript · Tailwind CSS v4 · shadcn/ui
- **後端**：Hono on Cloudflare Pages Functions (`functions/api/[[route]].ts`)
- **寄信**：Resend（通知信 + 確認信，都附 `.ics` 行事曆檔）

---

## 流程

1. **首頁** — 正中間「要不要跟我約會？ / Yes or No」。
   每按一次 **No**，**Yes** 按鈕就放大一級（而且 No 會越縮越小、越躲越遠），直到你按 Yes。
2. **安排頁** — 日曆選日期 ＋ 約會項目（健身 / 吃好料 / City walk / 嚕狗狗 / 以上都要 / 其他）＋ 填自己的 Email。
3. **送出** — 後端寄出兩封信：
   - 給 `NOTIFY_EMAIL`（預設 `jake0627a1@gmail.com`），`reply-to` 設成對方的信箱
   - 給對方的確認信
4. 跳出「**妳已經完成跟來鴻的約定，不能放鳥、不能反悔**」→ 問要不要**加入 Apple 行事曆**（下載 `.ics`）→ 回首頁。

---

## 本機開發

```bash
npm install

# 只跑前端（API 會 404）
npm run dev

# 前端 + Pages Functions 一起跑（會先 build）
cp .dev.vars.example .dev.vars   # 填入 RESEND_API_KEY
npm run pages:dev
```

`.dev.vars` 已被 `.gitignore` 忽略，不會進 git。

---

## 環境變數

| 名稱 | 類型 | 說明 |
| --- | --- | --- |
| `RESEND_API_KEY` | **Secret** | Resend API key（`re_...`）。**唯一必填** |
| `FROM_EMAIL` | 變數（選填） | 寄件者，需為 Resend 已驗證網域。預設 `來鴻 <crypto0627@jakekuo.com>` |
| `NOTIFY_EMAIL` | 變數（選填） | 收通知的信箱。預設 `jake0627a1@gmail.com` |
| `OWNER_NAME` | 變數（選填） | 網站/信件裡顯示的名字。預設 `來鴻` |

三個選填變數的預設值直接寫在 `functions/api/[[route]].ts` 上方的 `DEFAULT_*` 常數，
不設也能正常運作，要改可以改常數或在 Dashboard 覆蓋。

> **刻意不放 `wrangler.toml`**：Cloudflare Pages 一旦在 repo 讀到 Wrangler 設定檔，
> **Dashboard 上設定的環境變數與 secret 會被忽略**。為了避免 `RESEND_API_KEY`
> 綁不上去，這個專案不放設定檔，一律用 Dashboard / `wrangler pages secret put`。

### 確認設定有沒有生效

```bash
curl https://<你的網域>/api/health
```

```jsonc
{
  "ok": true,
  "config": {
    "resendKey": true,        // ← false 就是 secret 沒綁上，或綁完沒重新部署
    "resendKeyPrefix": "re_",
    "from": "來鴻 <crypto0627@jakekuo.com>（預設值）"
  }
}
```

**改完環境變數一定要重新部署**（Deployments → Retry deployment，或 push 一個 commit），
Pages 的變數是在部署時注入的，存檔不會套用到已經上線的版本。

---

## 部署 A：Cloudflare Pages 連 GitHub（推薦，push 就自動部署）

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 選 `crypto0627/dating`，branch `main`
3. Build 設定：

   | 欄位 | 值 |
   | --- | --- |
   | Framework preset | `Vite`（或 None） |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | （留空） |

4. **Settings → Variables and Secrets**，Production 加：
   - `RESEND_API_KEY` → 型別選 **Secret**（必填）
   - 其餘三個變數不設就吃程式碼裡的預設值
   - 另外在 **Build** 設定加 `NODE_VERSION` = `22`
5. **Save and Deploy**。之後每次 push 到 `main` 就會自動重新部署。

> 加完 secret **一定要重新部署**才會生效，然後用 `/api/health` 確認 `resendKey: true`。

> `functions/` 會被 Cloudflare Pages 自動辨識成 Functions，不用額外設定。

## 部署 B：本機用 wrangler 直接推

```bash
npx wrangler login

npm run build
npx wrangler pages project create dating --production-branch main   # 第一次才需要
npx wrangler pages deploy dist --project-name dating

# 設定 secret（設完要再 deploy 一次才會生效）
npx wrangler pages secret put RESEND_API_KEY --project-name dating
npx wrangler pages deploy dist --project-name dating
```

---

## Resend 注意事項

- `FROM_EMAIL` 的網域（`jakekuo.com`）必須在 Resend 完成驗證（SPF / DKIM），
  否則寄信會回 `403 domain is not verified`。
- 若改用 `onboarding@resend.dev`，就**只能**寄給 Resend 帳號本人的信箱。
- API key 一旦外流請到 Resend Dashboard **Rotate**。

---

## API

| Method | Path | 說明 |
| --- | --- | --- |
| `GET` | `/api/health` | 健康檢查 |
| `POST` | `/api/date` | 送出約會，寄信。Body：`{ date, activities[], otherText, email }` |
| `GET` | `/api/ics?date=&summary=` | 下載 `.ics`（`text/calendar`，Apple 行事曆可直接開） |
