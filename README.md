# Your Big Island Real Estate

Public site and private agent desk for **Yordana Bolanos Salas** (RS-88323), Coldwell Banker Island Properties, Hilo.

Live: [yourbigislandrealestate.com](https://www.yourbigislandrealestate.com/)

The public pages stay hers — coral, Playfair, nine districts, valuation, contact, blog. What this repo adds is a PIN-gated **`/desk`** so seller and buyer inquiries land in a scored pipeline with Hawaiʻi-specific document checklists. Official HAR contracts stay at the brokerage; the desk prepares the file, it does not replace the forms.

## Public capture

- `/valuation` — seller home-value form (timeline + occupancy + motivation). Saved to the desk, then emailed via Resend when `RESEND_API_KEY` is set.
- `/home-search` — buyer match form until MLS/IDX is wired.
- `/contact` — buy or sell, same ingest path.
- `/areas/[slug]` — the nine districts.

## Agent desk

`/desk/login` — default local PIN `yordana`. Set `DESK_PIN` before this is on the public internet.

Inside: Today (follow-ups, hot files, Cursor GCI vs burn), pipeline, leads, packets, playbook, settings.

On Vercel the JSON store lives at `/tmp/ybi-desk` (ephemeral). Locally it writes `data/store.json`. Sample Big Island files seed an empty store so the desk is usable on first open.

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:43145](http://localhost:43145). Desk: [http://localhost:43145/desk/login](http://localhost:43145/desk/login).

Email confirmations need `RESEND_API_KEY`. Leads still save if email fails.

## Deploy

This is a Next.js app. Redeploy the existing Vercel project for `yourbigislandrealestate.com`. Add:

- `DESK_PIN` — a PIN only Yordana knows
- `RESEND_API_KEY` — already used for `hello@mail.yourbigislandrealestate.com`
