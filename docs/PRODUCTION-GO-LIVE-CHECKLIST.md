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
