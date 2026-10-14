# EngageFlow AI — Self‑Hosted VPS Deployment (Ubuntu 24.04)

Full stack on one Hostinger VPS: **Nginx + SSL → Angular (static)** and **NestJS (PM2) → PostgreSQL + Redis**.
Replaces Netlify (frontend), Railway (backend), Neon (DB), Upstash (Redis).

> Run every command in the **VPS SSH session** (the window showing `root@…#` or `deploy@…$`).
> Placeholders to replace: `YOUR_IP`, `yourdomain.com`, `DB_PASSWORD`, and the secret values in Phase 5.

---

## Prerequisites
- A **domain name** you own (required for HTTPS, Meta webhooks, Instagram OAuth). Point it at `YOUR_IP` in Phase 7.
- Both repos reachable by `git clone` (GitHub). If private, create a **Personal Access Token** or add a deploy key.
- Your secrets (same as Railway today): `ENCRYPTION_KEY` (reuse the exact existing value or IG tokens can't be decrypted), `JWT_SECRET`, `GEMINI_API_KEY`, `RAZORPAY_KEY_ID`/`SECRET`, `INSTAGRAM_APP_ID`/`SECRET`/`REDIRECT_URI`, `META_WEBHOOK_VERIFY_TOKEN`.

Suggested layout: frontend at `https://yourdomain.com`, backend at `https://api.yourdomain.com`.

---

## Phase 1 — Secure the server
```bash
# 1a. update
apt update && apt -y upgrade

# 1b. create a non-root sudo user (you'll use this from now on)
adduser deploy            # set a password when prompted
usermod -aG sudo deploy

# 1c. firewall — allow SSH + web only
apt -y install ufw
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status
```

**SSH keys (do this before disabling root/password login):**
On your **Windows PowerShell** (local), generate a key if you don't have one, then copy it up:
```powershell
ssh-keygen -t ed25519 -C "engageflow"      # press Enter through prompts
type $env:USERPROFILE\.ssh\id_ed25519.pub  # copy this output
```
On the **VPS**:
```bash
mkdir -p /home/deploy/.ssh
nano /home/deploy/.ssh/authorized_keys      # paste the pubkey, save (Ctrl+O, Enter, Ctrl+X)
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys
```
**Test in a NEW PowerShell window** (keep the current root session open as a safety net):
```powershell
ssh deploy@YOUR_IP     # must log in via key, no password
```
Only once key login works, harden SSH:
```bash
sudo nano /etc/ssh/sshd_config
#   PermitRootLogin no
#   PasswordAuthentication no
sudo systemctl restart ssh
```

---

## Phase 2 — Runtimes (as `deploy`)
```bash
# Node 22 (matches package.json engines)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt -y install nodejs git nginx
node -v && npm -v

# PM2 (keeps NestJS running + restarts on reboot)
sudo npm i -g pm2

# (optional but recommended on <=4GB RAM: 2GB swap so Angular build won't OOM)
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## Phase 3 — PostgreSQL 16
```bash
sudo apt -y install postgresql postgresql-contrib
sudo -u postgres psql <<'SQL'
CREATE DATABASE engageflow;
CREATE USER engageflow WITH ENCRYPTED PASSWORD 'DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE engageflow TO engageflow;
ALTER DATABASE engageflow OWNER TO engageflow;
SQL
```
Connection string (used in Phase 5): `postgresql://engageflow:DB_PASSWORD@localhost:5432/engageflow?schema=public`
(No Neon pooler needed — `DATABASE_URL` and `DIRECT_URL` are the **same** local URL.)

---

## Phase 4 — Redis
```bash
sudo apt -y install redis-server
sudo systemctl enable --now redis-server
redis-cli ping        # -> PONG
```
`REDIS_URL=redis://localhost:6379`

---

## Phase 5 — Backend (NestJS)
```bash
cd ~ && git clone <YOUR_BACKEND_REPO_URL> engageflow-backend
cd engageflow-backend
npm ci

# create the production env (fill in real values)
nano .env
```
`.env` contents:
```
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://engageflow:DB_PASSWORD@localhost:5432/engageflow?schema=public"
DIRECT_URL="postgresql://engageflow:DB_PASSWORD@localhost:5432/engageflow?schema=public"
REDIS_URL="redis://localhost:6379"
ENCRYPTION_KEY="<exact same value as Railway>"
JWT_SECRET="<secret>"
GEMINI_API_KEY="<key>"
RAZORPAY_KEY_ID="<key>"
RAZORPAY_KEY_SECRET="<secret>"
INSTAGRAM_APP_ID="<id>"
INSTAGRAM_APP_SECRET="<secret>"
INSTAGRAM_REDIRECT_URI="https://api.yourdomain.com/instagram/callback"
META_WEBHOOK_VERIFY_TOKEN="<token>"
CORS_ORIGIN="https://yourdomain.com"
FRONTEND_URL="https://yourdomain.com"
```
Build + apply schema + run:
```bash
npx prisma generate
npx prisma db push          # creates all tables incl. automation_rules, analytics_events
npm run build
pm2 start dist/main.js --name engageflow-api
pm2 save && pm2 startup     # run the command it prints (enables boot restart)
curl http://localhost:3000  # sanity check
```

---

## Phase 6 — Frontend (Angular)
Point the app at the API, then build:
```bash
cd ~ && git clone <YOUR_FRONTEND_REPO_URL> engageflow-frontend
cd engageflow-frontend
npm ci
nano src/environments/environment.ts   # set apiUrl: 'https://api.yourdomain.com'
npm run build                            # output: dist/ng-tailadmin/browser
```
Serve the built files from a web root:
```bash
sudo mkdir -p /var/www/engageflow
sudo cp -r dist/ng-tailadmin/browser/* /var/www/engageflow/
```

---

## Phase 7 — Nginx + SSL
Point DNS first: at your registrar add **A records** → `yourdomain.com`, `www`, and `api` all pointing to `YOUR_IP`. Wait for propagation (`ping yourdomain.com` shows `YOUR_IP`).

```bash
sudo nano /etc/nginx/sites-available/engageflow
```
```nginx
# Frontend (SPA)
server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;
  root /var/www/engageflow;
  index index.html;
  location / { try_files $uri $uri/ /index.html; }   # SPA fallback
}
# Backend API
server {
  listen 80;
  server_name api.yourdomain.com;
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/engageflow /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Free auto-renewing HTTPS
sudo apt -y install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

---

## Phase 8 — Re-point integrations
- **Meta App dashboard:** webhook callback URL → `https://api.yourdomain.com/webhooks/instagram` (verify token = `META_WEBHOOK_VERIFY_TOKEN`); Instagram OAuth **redirect URI** → `https://api.yourdomain.com/instagram/callback`.
- Confirm backend `CORS_ORIGIN` / `FRONTEND_URL` = `https://yourdomain.com` and frontend `apiUrl` = `https://api.yourdomain.com` (rebuild frontend if you change it).
- Razorpay: no URL change needed.

---

## Phase 9 — Safety nets
```bash
# nightly DB backup
echo '0 2 * * * pg_dump -U engageflow engageflow | gzip > /home/deploy/backup-$(date +\%F).sql.gz' | crontab -
# automatic security updates
sudo apt -y install unattended-upgrades && sudo dpkg-reconfigure -plow unattended-upgrades
```
Also enable Hostinger's snapshot/backup add-on in hPanel.

---

## Redeploying after code changes
```bash
# backend
cd ~/engageflow-backend && git pull && npm ci && npx prisma generate && npx prisma db push && npm run build && pm2 restart engageflow-api
# frontend
cd ~/engageflow-frontend && git pull && npm ci && npm run build && sudo cp -r dist/ng-tailadmin/browser/* /var/www/engageflow/
```

## Troubleshooting
- `pm2 logs engageflow-api` — backend errors (env validation fails fast if a var is missing).
- `sudo tail -f /var/log/nginx/error.log` — proxy/SSL issues.
- `redis-cli ping` / `sudo systemctl status postgresql` — service health.
- 502 from Nginx → NestJS not running (`pm2 status`) or wrong port.


---


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


---


# EngageFlow AI — Production Go-Live Checklist

Once the app is deployed on the VPS (see [VPS-DEPLOYMENT.md](VPS-DEPLOYMENT.md)) and Meta's URLs are updated (see [META-APP-PRODUCTION-CONFIG.md](META-APP-PRODUCTION-CONFIG.md)), this is everything else standing between "it's running" and "it's actually safe/ready for real paying customers."

Items are grouped by urgency. Each one explains **what it is**, **why it matters**, **exact steps**, and **how to verify it worked**.

**Domain used in this guide:** `engageflow.khandelwaldeepak.com` (frontend), `api.engageflow.khandelwaldeepak.com` (backend). Replace if different.

---

## 🔴 Blocking — do these before any real user signs up or pays

### 1. Meta App Dashboard URLs → real domain
**What it is:** Meta needs to know exactly which URLs your app uses for OAuth, webhooks, and legal pages — see the dedicated [META-APP-PRODUCTION-CONFIG.md](META-APP-PRODUCTION-CONFIG.md) doc for the full field-by-field walkthrough.
**Why it matters:** Instagram literally refuses to redirect users back to your app, or deliver webhook events, if these don't exactly match what's registered.
**Verify:** Complete Item 2 below (the full OAuth test) — if it works end to end, this is done correctly.

### 2. Test the full Instagram OAuth flow end-to-end
**What it is:** A real walkthrough of a user connecting their Instagram account through your live site.
**Why it matters:** This is the single most failure-prone integration in the whole app (redirect URI mismatches, webhook signature issues, expired tokens) — catching a problem now is far cheaper than a customer hitting it.
**Steps:**
1. Open `https://engageflow.khandelwaldeepak.com` on a real device (not the VPS terminal).
2. Register/sign in → **Settings → Instagram → Connect**.
3. Complete Meta's consent screen.
4. Confirm you land back on `.../dashboard/settings?tab=instagram&instagram=connected` (not `...&instagram=error`).
**Verify:** The Settings page shows "Connected" with your Instagram username. Then comment on a real post with a keyword tied to one of your Flows and confirm an automated reply appears within seconds — check `pm2 logs engageflow-api` on the VPS for `Replied to comment ...`.

### 3. Razorpay — switch from test mode to live mode
**What it is:** Razorpay gives you two separate key pairs — **test keys** (fake money, what you've been using) and **live keys** (real money). Right now your `.env` almost certainly has test keys.
**Why it matters:** Test-mode payments never actually charge anyone — if you launch with test keys, customers can "pay" but you'll never receive real money, and the checkout may behave oddly for real cards.
**Steps:**
1. Razorpay Dashboard → complete **KYC / business verification** (PAN, bank account, business docs) if you haven't — this is required before live mode activates, and can take 1-3 business days for Razorpay to approve.
2. Once approved, go to **Settings → API Keys → Generate Live Key** (separate from your existing test keys — don't delete the test ones, keep them for future testing).
3. On the VPS:
   ```bash
   nano ~/engageflow-backend/.env
   # replace RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET with the LIVE values
   ```
   Save (`Ctrl+O`, Enter, `Ctrl+X`), then:
   ```bash
   pm2 restart engageflow-api
   pm2 logs engageflow-api --lines 20 --nostream
   ```
4. **Test with a real small payment** (₹1–10) through your live site's Membership/Pricing page, using a real card/UPI — then immediately **refund it** from the Razorpay dashboard to confirm the whole loop (create order → pay → verify → upgrade tier) works before real customers pay for real.
**Verify:** Payment shows as "Captured" in Razorpay's live dashboard (not test dashboard), and your user's `subscriptionTier` updates in the app after payment.

---

## 🟡 Important — do these soon, not launch-blocking

### 4. Submit App Review for `instagram_business_manage_messages`
**What it is:** The Meta permission that unlocks DM and story-reply automation (your Flows builder already lets users create these rules — they're just inert until this is approved).
**Why it matters:** Approval takes **1-2 weeks**, so submitting late means DM automation sits unusable for weeks after you'd otherwise be ready to launch it.
**Steps:** Meta dashboard → **App Review → Permissions and features** → find `instagram_business_manage_messages` → Request Advanced Access → fill in the use-case text and attach the screencast (both were prepared in an earlier session — ask if you need them re-generated).
**Verify:** Permission shows **"Advanced Access"** (not "Standard Access") in the Permissions list once approved.

### 5. Switch the Meta App from Development to Live mode
**What it is:** While in Development mode, only Instagram accounts you've explicitly added as **testers** can complete OAuth — real customers get blocked.
**Why it matters:** Without this, **no real user can connect their Instagram account** — the app is effectively unusable for anyone outside your test list.
**Steps:**
1. Confirm your currently-used permissions (`instagram_business_basic`, `instagram_business_manage_comments`) show Advanced Access under **App Review → Permissions and features**.
2. Toggle the switch at the top of the app dashboard from **Development** to **Live**.
**Verify:** Have someone *not* on your tester list try connecting Instagram — it should now work.

### 6. Fix the support email in your legal pages
**What it is:** Your Refund Policy page currently references `support@engageflow.ai` — a domain you don't own, so nobody sending mail there reaches you.
**Why it matters:** A dead support email is both a bad customer experience and a compliance issue (payment/refund policies need a real contact route).
**Steps:** Update the email in `src/app/pages/legal/refund-policy/refund-policy.component.html` (and anywhere else it appears — footer, terms) to something you actually control, e.g. `support@khandelwaldeepak.com` (if you can create that inbox) or a dedicated Gmail address like `engageflow.support@gmail.com`.
**Verify:** Send a real test email to the address and confirm it arrives somewhere you check.

### 7. Update Google OAuth Client (if you use Google sign-in)
**What it is:** `GOOGLE_CLIENT_ID` in your `.env` is tied to a Google Cloud OAuth client that has an allowlist of domains it trusts.
**Why it matters:** If your real domain isn't on that allowlist, Google sign-in fails with a redirect/origin mismatch error, exactly like the Instagram OAuth issue.
**Steps:** Google Cloud Console → APIs & Services → Credentials → your OAuth 2.0 Client → add:
- **Authorized JavaScript origins:** `https://engageflow.khandelwaldeepak.com`
- **Authorized redirect URIs:** whatever your Google-login callback route is (only relevant if this feature is actually wired up — check before spending time here).
**Verify:** Try Google sign-in on the live site; no "redirect_uri_mismatch" error.

---

## 🟢 Good hygiene — security & operational safety net

### 8. Back up your secrets outside the VPS
**What it is:** Your `.env` file on the VPS is currently the **only copy** of `ENCRYPTION_KEY`, `JWT_SECRET`, API keys, and DB password.
**Why it matters:** `ENCRYPTION_KEY` specifically decrypts every stored Instagram access token. If the VPS disk is ever lost, corrupted, or you accidentally overwrite this value, **every connected Instagram account becomes permanently undecryptable** — users would have to reconnect from scratch, and any in-flight automations break silently until they do.
**Steps:** Copy the full contents of `~/engageflow-backend/.env` into a password manager (1Password, Bitwarden) or an encrypted note — anywhere off the VPS itself.
**Verify:** You can retrieve every value without SSHing into the server.

### 9. Confirm Certbot's SSL auto-renewal is active
**What it is:** Let's Encrypt certificates (what Certbot installed) expire every 90 days; Certbot sets up automatic renewal, but it's worth confirming it's actually scheduled.
**Why it matters:** An expired cert makes your entire site inaccessible over HTTPS (browsers block it outright) — this is one of the most common "site suddenly broke" causes for self-hosted deployments.
**Steps:**
```bash
systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```
**Verify:** The timer is listed as active, and the dry-run says "Congratulations, all simulated renewals succeeded."

### 10. Basic SSH brute-force protection (fail2ban)
**What it is:** A tool that watches for repeated failed SSH login attempts and temporarily bans the offending IP.
**Why it matters:** Any server with a public IP gets constant automated login attempts from bots within hours of going live — this is free, low-effort protection against that noise turning into an actual breach.
**Steps:**
```bash
sudo apt -y install fail2ban
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```
**Verify:** `fail2ban-client status sshd` shows the jail is active and monitoring.

### 11. Register with Google Search Console (optional)
**What it is:** A free Google tool that lets you tell Google your site exists and monitor how it's indexed.
**Why it matters:** Not required for the app to function — purely helps with discoverability/SEO once you're ready for organic traffic. Low priority.
**Steps:** search.google.com/search-console → Add property → `https://engageflow.khandelwaldeepak.com` → verify ownership (DNS TXT record or HTML file upload) → submit your sitemap once you have one.
**Verify:** Property shows as "Verified" in the console.

---

## Suggested order of execution
1. Items 1–3 (blocking) — do these together as one session, since they all feed into "can a real user actually use and pay for this app."
2. Item 8 (backup secrets) — takes 2 minutes, do it immediately after items 1-3 while the `.env` is fresh in your mind.
3. Items 4–7 — spread across the following 1-2 weeks (App Review approval is the natural pacing item here).
4. Items 9–11 — whenever convenient; none are urgent, all are cheap insurance.
