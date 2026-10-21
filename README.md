# Eurotunnel Wiki — Vercel deployment

This is a static HTML site and does not need a build step or Node.js dependencies.

## Deploy
1. Upload this folder to a Git repository.
2. Import the repository in Vercel.
3. Set Framework Preset to **Other**.
4. Leave Build Command empty and set Output Directory to `.`.
5. Deploy.

`index.html` is the site entry point. `vercel.json` sends site paths to the HTML app so hash-based navigation and direct requests work on Vercel.
