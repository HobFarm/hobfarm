# HobFarm security hardening

The current architecture, findings, exact Cloudflare rules, rollout, rollback,
and validation procedure are maintained in the repository-root
[`SECURITY-HARDENING.md`](../SECURITY-HARDENING.md). This file records the
earlier source pass and remains as historical context.

This pass closes the source-side problems that could be fixed without changing live Cloudflare, Stripe, DNS, or deployment settings.

## Implemented in source

- Auth and verification request bodies are streamed with hard size limits, so a missing or dishonest `Content-Length` header cannot bypass the limit.
- Six-digit login and email-change codes lock after five failed attempts. Login codes are hashed with the target email, which prevents a hash collision from replacing another address's code.
- New session tokens are hashed before D1 storage. Existing raw session rows migrate to the hashed form when used.
- The shared login cookie is limited to `/api/`, remains `Secure`, `HttpOnly`, and `SameSite=Lax`, and keeps the cross-subdomain behavior needed by `sf.hob.farm`.
- Account deletion requires the typed email on the server and a session created within the previous ten minutes.
- State-changing auth requests reject unapproved browser origins and cross-site fetches.
- Resend failures no longer copy provider response bodies into application logs. Email-change values are escaped before insertion into HTML email.
- Membership checkout uses a Stripe idempotency key. Membership webhooks grant supporter access only for the configured membership Price ID and quantity.
- Shop, Academy, membership, and Stripe webhook bodies are bounded while streaming.
- API responses receive `no-store`, anti-framing, MIME-sniffing, referrer, and permissions headers from Pages middleware.
- The public AI assistant fails closed unless `HOBBOT_ENABLED=true` is deliberately configured.
- `/.well-known/security.txt` supplies a durable security contact.
- Astro, Cloudflare's adapter, Wrangler, Hono, RSS, and vulnerable transitive packages were upgraded or overridden to patched versions. Production dependency audits now report zero known vulnerabilities.

## Live settings to verify before the next deployment

These items require account access or a deliberate production change and were not activated from this repository pass.

1. Apply `hobfarm-auth/migrations/0005_auth_attempt_limits.sql` before deploying the hardened auth worker.
2. Confirm `STRIPE_CREATIVE_MEMBERSHIP_PRICE_ID` is present in the Pages production environment before deploying the webhook change.
3. Put Cloudflare managed WAF rules in front of `/api/*`, with tighter rate limits for `/api/auth/request`, `/api/auth/verify`, checkout, contact, subscribe, and course-question endpoints.
4. Keep Bot Fight Mode or the equivalent bot controls enabled, and review rather than blindly blocking verified search and feed readers.
5. Enable DNSSEC and require phishing-resistant MFA for Cloudflare, GitHub, Stripe, Resend, and domain-registrar accounts. Remove unused account members and tokens.
6. Use restricted Stripe keys where the integration permits them, keep webhook secrets separate by endpoint and environment, and rotate any credential whose history is uncertain.
7. Completed August 27, 2026: Pages uses the private `AUTH_HTTP` service binding, the stale production `AUTH_WORKER_URL` secret is removed, and the auth Worker's production and preview `workers.dev` URLs are disabled.
8. Migrate the remaining necessary inline scripts to CSP hashes or nonces, then remove `'unsafe-inline'` from `script-src`.
9. Add alerts for sustained authentication failures, webhook verification failures, checkout spikes, and unusual 4xx/5xx changes. Logs must keep emails, cookies, request bodies, Stripe identifiers, and secrets masked.

The public assistant should remain disabled until the reviewed article/course corpus and real support-question set exist. Turning it on is a separate product and security review, not a deployment default.
