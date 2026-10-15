# Atlantis Private website

Next.js (App Router, TypeScript) site for Atlantis Private, hosted on Vercel in Sydney (`syd1`).
It follows the master plan v2. This is the first build pass: the design, every page, the wholesale
gate and the readiness check. Nothing is stored or emailed yet.

## Run it

```bash
pnpm install
pnpm dev                 # http://localhost:3000
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm check:placeholders  # lists the [bracketed placeholders] still in the content
pnpm check:responsive    # after a build: no sideways scroll, 44px touch targets, 16px fields at 320 to 1280px
```

## Where things live

| Path | What it holds |
|---|---|
| `app/` | Pages and the three API routes (`/api/leads`, `/api/gate`, `/api/readiness`) |
| `content/*.json` | All page copy and data. Edit these to change the site. No CMS. |
| `lib/gated/funds-gated.json` | Target returns and maximum LVRs. Server only, see below. |
| `lib/readiness/` | The readiness check: answer options, input cleaning and the scoring engine |
| `components/` | Header, ticker, footer, forms, gate, readiness check |
| `docs/concept/` | The concept mockup this was built from (images stripped) |
| `docs/old-mockup/` | The earlier teal and copper homepage mockup, kept for reference |

## Pass 1 behaviour

- **Pages** are pre-built. The database is never touched on a page load.
- **Wholesale gate:** returns and maximum LVRs are not in any page. The tick box calls `/api/gate`,
  which returns them with `no-store` and logs a hashed-IP line. A test checks that `content/`
  never contains rates.
- **Readiness check:** answers are posted to `/api/readiness`, scored on the server and returned as a
  report. Returns, charts and income figures are only included when the visitor may see them
  (wholesale, and not Singapore or overseas).
- **Forms** (contact, borrower scenario, newsletter) validate on the server, check the origin and a
  honeypot field, then show an on-screen thank you. **They do not save or send anything yet.**
  No confirmation email is promised to the visitor.
- **Ticker:** values are typed into `content/ticker.json` by hand, with a review date.
- **Staging and previews** send `noindex` and a disallow-all `robots.txt`.

## Phones and tablets

- Below 960px the header becomes a Menu button with a panel. The ticker shrinks to two short lines.
- Buttons, links and form fields are at least 44px tall on touch screens, and fields are 16px so
  iPhone Safari does not zoom in. The readiness report swaps wide charts for plain lists under 640px.
- `pnpm check:responsive` loads every page at 320, 375, 768 and 1280px and fails on overflow, small
  targets or small fields. CI runs it on every pull request. It uses Chromium, so also open the
  preview on a real iPhone and Android phone before launch.

## Release flow

1. Work on a branch, open a pull request into `main`. CI runs lint, types, tests, build and a
   production dependency audit. Each pull request gets a preview link.
2. Merging into `main` deploys to staging.
3. A separate pull request from `main` into `production` releases to the live site. That pull request
   also fails while any `[placeholder]` remains in the content.

## Still to build (master plan steps 5 to 11)

Neon database, encryption and key generation, the lead worker and email, the 7-year cleanup job and
the hold, converted-lead and privacy-request scripts, the private lead viewer, alerts and breach
plan, the agent files (`llms.txt` and friends), a stricter CSP (it allows inline scripts for now),
the independent security test, and the staging review.

## Known follow-ups

- `lib/readiness/engine.ts` is a close port of the concept's logic and is not strictly typed yet.
- Readiness dates use the server clock (UTC on Vercel), so around midnight in Melbourne a date can
  be a day behind. Pin the time zone before launch.
- The readiness check treats a single investment of $500,000 or more as meeting the wholesale test,
  as the concept did. **[Compliance]** should confirm this.
- Items marked **[Compliance]** in the master plan (gate wording, retention period, privacy policy,
  testimonials and awards, overseas disclosure) still need sign-off.
