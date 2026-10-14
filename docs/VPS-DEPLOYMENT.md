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
