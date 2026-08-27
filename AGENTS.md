<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Your Big Island Real Estate

Public site for Yordana Bolanos Salas plus a PIN-gated agent desk at `/desk`.

- `npm ci` then `npm run dev` (port 43145).
- Local desk PIN is `yordana` unless `DESK_PIN` is set. Production (Vercel) refuses the fallback — set `DESK_PIN` there.
- Public capture: `/valuation` (sellers), `/home-search` (buyers), `/contact`. Leads write to `data/store.json` locally, `/tmp/ybi-desk` on Vercel (ephemeral).
- Email needs `RESEND_API_KEY`. Leads still save if email fails.
- Packets are worksheets, not official HAR contracts. Do not copy brokerage forms into the repo.
