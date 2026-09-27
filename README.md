# Eurotunnel Management Dashboard

A Vercel-ready Next.js dashboard for the Eurotunnel Roblox management team.

## GitHub structure

Keep the folders exactly like this:

app/
  api/
    roblox/
      game/
        route.ts
      users/
        route.ts
  dashboard.tsx
  globals.css
  layout.tsx
  page.tsx
.gitignore
next-env.d.ts
next.config.ts
package.json
tsconfig.json
vercel.json

## Deploy

1. Replace the contents of the GitHub repository with this project.
2. Commit everything to the `main` branch.
3. In Vercel, connect the repository and deploy the `main` branch.
4. Framework should be detected as Next.js.
5. Build command: `npm run build`.
6. No environment variables are required.

The dashboard fetches Roblox data through the included Next.js API routes.
