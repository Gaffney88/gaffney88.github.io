# Eurotunnel Management Dashboard

A Vercel-ready Next.js dashboard for Eurotunnel Roblox operations.

## What changed from the original HTML

- Converted the single static HTML page into a Next.js App Router project.
- Roblox calls now run through Vercel server API routes instead of exposing third-party API requests directly in the browser.
- Live player counts for both supplied place IDs.
- Live Roblox presence for the owner and management team.
- Working Rank/Status filters.
- Responsive desktop/tablet/mobile layout.
- Refresh button plus automatic 30-second refresh.
- Loading skeletons and graceful API-error messaging.
- No Tailwind CDN dependency, so the deployment is self-contained.

The original source supplied the owner, management usernames, and the two place IDs used here. 

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Create a GitHub repository.
2. Upload this project.
3. Import the repository into Vercel.
4. Vercel will detect Next.js automatically.
5. No environment variables are required.

## Team/game configuration

Edit these constants in `app/dashboard.tsx`:

- `OWNER_USERNAME`
- `MANAGEMENT_USERNAMES`
- `MAIN_PLACE_ID`
- `E2_PLACE_ID`

The same usernames are also used by `app/api/roblox/users/route.ts`.

## Notes

The dashboard uses Roblox's public web APIs from server-side Next.js routes. If Roblox changes or rate-limits those endpoints, the dashboard displays the last successfully loaded values and an error notice rather than crashing the page.
