# 要不要跟我約會？ 🧸

Cloudflare Pages + Hono + Resend 做的約會邀請網頁，**滿滿的熊抱哥**主題。

- **前端**：React 19 · Vite · TypeScript · Tailwind CSS v4 · shadcn/ui
- **後端**：Hono on Cloudflare Pages Functions (`functions/api/[[route]].ts`)
- **寄信**：Resend（通知信 + 確認信，都附 `.ics` 行事曆檔）

---

## 主題：熊抱哥 🧸

草莓熊風格，插畫全部是自己畫的 SVG（`src/components/Bear.tsx`），沒有引用任何圖片檔，
也沒有用到任何既有角色的美術素材。

重點是**絨毛玩偶感**，不是平塗卡通：輪廓不是平滑橢圓，而是一圈長短不一的毛束
（`FUR_*` 路徑是用腳本算出來的，毛峰的大小與角度間距都有抖動，才不會變成蕾絲花邊）；
外圈先鋪一層深色毛當邊緣、上面疊亮面做出厚度，再加上描邊與幾筆毛流。

| 檔案 | 內容 |
| --- | --- |
| `src/components/Bear.tsx` | `BearFace`（7 種表情）、`BearPaw`、`Strawberry`、`BearHug`、`Heart` |
| `src/components/BearBackdrop.tsx` | 背景：草莓奶油漸層 + 滿版熊掌壁紙 + 一路往上飄的熊抱哥 |
| `src/components/BearCard.tsx` | 上緣長出兩隻熊耳朵的玻璃卡片 |
| `src/components/Confetti.tsx` | 熊頭 / 熊掌 / 草莓 / 愛心紙花 |
| `src/index.css` | 配色（`--bear-*` 毛色盤）、熊掌壁紙、`bear-bob` / `ear-wiggle` 等動畫 |

### 換成自己的圖片

想用現成的圖（貼圖、自己拍的、自己畫的都可以），把檔案丟進 `public/bear/`，
命名照下表，網站就會自動改用圖片，**不用改任何程式碼**：

| 檔名 | 用在哪 |
| --- | --- |
| `public/bear/bear-hello.png` | 首頁一進來的主角、Step 2 標題、約定成立的對話框 |
| `public/bear/bear-face.png` | 按鈕裡的小熊、熊抱哥大軍、勾選項目的浮水印 |
| `public/bear/bear-excited.png` | 按太多次 No 之後的主角、行事曆對話框 |

- 檔案不存在時會自動退回內建的 SVG 插畫，**不會破版、不會出現破圖**
  （`src/lib/bearAssets.ts` 開場探測一次，全站共用結果，不會送一堆 404）
- 請用**去背**的 PNG / WebP，不然飄在背景的時候會是一個一個白色方塊
- 建議每張壓到 100 KB 以內，背景會同時飄十幾隻
- 想加更多張就改 `src/lib/bearAssets.ts` 的 `BEAR_IMAGES`

> `public/bear/` 裡的圖片沒有進 git（見 `.gitignore`），所以放你自己的圖不會被
> commit 上去。要讓它跟著部署的話，把 `.gitignore` 那一行拿掉即可 —— 但請先確認
> 你有那些圖的使用權，公開網站跟自己電腦上看是兩回事。

毛色統一走 CSS 變數（`--bear-fur` / `--bear-inner` / `--bear-muzzle` / `--bear-nose`…），
改一個地方整站就跟著換色，深色模式也有對應的一組。

首頁的熊抱哥會隨著你按 **No** 的次數換表情（傻笑 → 害羞 → 眨眼 → 驚訝 → 得意 → 愛心眼），
而且每按一次就多召喚一隻熊來勸你，最多 12 隻。

---

## 流程

1. **首頁** — 正中間「要不要跟我約會？ / Yes or No」。
   每按一次 **No**，**Yes** 按鈕就放大一級（而且 No 會越縮越小、越躲越遠），直到你按 Yes。
2. **安排頁** — 日曆**多選日期**（點一下加入、再點一次取消，可以只選一天，也可以選好幾天；
   連續的日子會在日曆上連成一條，並自動合併顯示成 `9/20 (日) – 9/22 (二)`）
   ＋ 約會項目（健身 / 吃好料 / City walk / 嚕狗狗 / 以上都要 / 其他）＋ 填自己的 Email。
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
| `GET` | `/api/health` | 健康檢查 + 設定診斷 |
| `POST` | `/api/date` | 送出約會，寄信。Body：`{ dates: string[], activities[], otherText, email }` |
| `GET` | `/api/ics?dates=a,b,c&summary=` | 下載 `.ics`（`text/calendar`，Apple 行事曆可直接開） |

日期一律用 `YYYY-MM-DD`，一次最多 31 天，後端會去重、排序，並擋掉 `2026-02-30`
這種格式正確但不存在的日期。連續的日子會合併成一個跨日 `VEVENT`，不連續的各自成為一個
事件放在同一個 `VCALENDAR` 裡。舊版的單數 `date` 欄位與 `?date=` 參數仍然相容。
