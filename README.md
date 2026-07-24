# AIDAL Dashboard

Customer-facing dashboard for [AIDAL](https://tryaidal.com) — log AI decisions, review compliance status, run public audit verification, and generate regulator-ready PDF reports.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `pages/index.js` — main dashboard app (login gate + authenticated views: decisions, human review, fairness, incidents).
- `pages/verify.js` — public, unauthenticated audit-record verification page.
- Talks to the AIDAL API at `https://aidal-production.up.railway.app`.

## Deploy

Auto-deploys to Vercel on push to `main`.
