# EngageFlow AI — Meta App Dashboard Production Configuration

Once the backend + frontend are live on the VPS (see [VPS-DEPLOYMENT.md](VPS-DEPLOYMENT.md)), every URL registered in the Meta App Dashboard must be updated from the old Railway/Netlify hosts to the real domain. This doc is the complete, step-by-step checklist.

**Domain used in this guide** (replace with your own if different):
- Frontend: `https://engageflow.khandelwaldeepak.com`
- Backend API: `https://api.engageflow.khandelwaldeepak.com`

> Field names in Meta's dashboard shift slightly between UI versions. If a screen doesn't match exactly, look for the closest-named field and screenshot it for a second opinion before saving.

---

## Step 1 — OAuth redirect URI, Deauthorize URL, Data Deletion URL

**Navigate:** [developers.facebook.com](https://developers.facebook.com) → **My Apps** → select your app → left sidebar **Instagram** → **API setup with Instagram login**

On this page, scroll past the "Generate access tokens" and "Configure webhooks" sections to find **"Business login settings"** (sometimes labeled "Set up Instagram business login").

| Field | Value |
|---|---|
| OAuth redirect URIs (click "Add URI") | `https://api.engageflow.khandelwaldeepak.com/instagram/callback` |
| Deauthorize callback URL | `https://api.engageflow.khandelwaldeepak.com/instagram/deauthorize` |
| Data deletion request callback URL | `https://api.engageflow.khandelwaldeepak.com/instagram/data-deletion` |

Click **Save** after each field. Remove/delete any old entry still pointing at `*.up.railway.app` once the new one is confirmed saved.

**Why this matters:** Instagram rejects the OAuth handshake if the `redirect_uri` your backend sends doesn't *exactly* match a URI registered here (including `https://` and no trailing slash). This is also reflected in the backend's own `INSTAGRAM_REDIRECT_URI` env var — the two must match.

---

## Step 2 — Webhook callback URL

**Navigate:** Same **Instagram → API setup with Instagram login** page → **"Configure webhooks"** section (where the field-subscription table lives — `comments`, `messages`, `live_comments`, etc.)

Look for a **"Callback URL"** / **"Verify token"** pair, usually above the fields table or behind an **Edit** (pencil) icon.

| Field | Value |
|---|---|
| Callback URL | `https://api.engageflow.khandelwaldeepak.com/webhooks/instagram` |
| Verify token | the exact value of `META_WEBHOOK_VERIFY_TOKEN` in the backend's `.env` on the VPS |

Click **Verify and Save**. Meta immediately sends a `GET` request with a challenge string to that URL — a green success confirmation means the backend answered correctly. If it fails:
```bash
# on the VPS, check the backend is actually reachable and logging the request
pm2 logs engageflow-api --lines 30 --nostream
curl "https://api.engageflow.khandelwaldeepak.com/webhooks/instagram?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=123"
# should echo back "123"
```

Re-confirm the **Subscribe** toggles are still ON for `comments` (live today) and `messages` (for when Phase 8 DM handling ships) — deleting/re-adding the callback URL sometimes resets these.

---

## Step 3 — Privacy Policy & Terms of Service URLs

**Navigate:** Left sidebar → **App settings** → **Basic** (a top-level app setting, not under the Instagram product)

| Field | Value |
|---|---|
| Privacy Policy URL | `https://engageflow.khandelwaldeepak.com/privacy-policy` |
| Terms of Service URL | `https://engageflow.khandelwaldeepak.com/terms-of-service` |

Scroll down and click **Save Changes**.

**Why this matters:** These links are shown to end users during the OAuth consent screen and are required for App Review — a broken or missing link here can block approval of new permissions.

---

## Step 4 — Confirm the backend's own env vars match

On the VPS, double check these already reflect the same domain (should already be correct from the VPS deployment):
```bash
grep -E "INSTAGRAM_REDIRECT_URI|META_WEBHOOK_VERIFY_TOKEN|FRONTEND_URL|CORS_ORIGIN" ~/engageflow-backend/.env
```
Every URL here must byte-for-byte match what's registered in Steps 1–2 above.

---

## Step 5 — End-to-end test

1. Open `https://engageflow.khandelwaldeepak.com` in a browser (real device, not the VPS) → sign in / register a fresh account.
2. Go to **Settings → Instagram → Connect**.
3. Complete the Meta OAuth consent screen — confirm it redirects back to your dashboard with `?instagram=connected` (not `?instagram=error`).
4. From a real Instagram account, comment on a connected post with a keyword tied to one of your automation rules (Flows) — confirm an automated reply appears within a few seconds.
5. Check `pm2 logs engageflow-api` on the VPS for `Replied to comment ...` log lines confirming the pipeline ran end to end.

---

## Step 6 — App Review (only needed for real, non-tester users)

While your Meta app is in **Development mode**, only accounts added as **Instagram testers** (App roles → Roles) can complete the OAuth flow. To let **any** real business connect:

1. Left sidebar → **App Review** → **Permissions and features**.
2. Confirm `instagram_business_basic` and `instagram_business_manage_comments` show **Advanced Access** (may already be approved).
3. If you want DM/story automation to go live, request **`instagram_business_manage_messages`** here too — see the submission text/screencast script prepared separately for this permission.
4. Once required permissions are Advanced Access, toggle the app from **Development** to **Live** (top of the app dashboard).

---

## Common errors & fixes

| Symptom | Cause | Fix |
|---|---|---|
| `redirect_uri_mismatch` on OAuth screen | URI registered in Step 1 doesn't exactly match `INSTAGRAM_REDIRECT_URI` in `.env` | Compare character-by-character, including trailing slash |
| Webhook verify fails (red X) | `META_WEBHOOK_VERIFY_TOKEN` mismatch, or backend not reachable over HTTPS | Re-check `.env` value; `curl` the callback URL directly from your own machine |
| OAuth works for you but not other testers | App still in Development mode and they're not added as a tester | App roles → Roles → add them as an Instagram tester, or complete Step 6 |
| Webhook events stop arriving after URL change | Subscribe toggles reset when callback URL changes | Re-check the `comments`/`messages` Subscribe switches are ON |
