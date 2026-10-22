# Eurotunnel Wiki: Vercel deployment

Static site plus two tiny functions. No build step, no dependencies.

1. Upload this folder to a Git repository and import it in Vercel.
2. Framework Preset: **Other**. Leave the build command empty. Output directory: `.`
3. Deploy.

Files
- `index.html`: the site.
- `og-banner.png`: the image shown when the link is pasted in Discord.
- `api/og.js`: gives Discord/Twitter/Slack the full-address preview tags. No domain to set; it reads it from the request.
- `api/discord.js`: live member count and avatars for the home card. Open `/api/discord` in a browser to see the raw numbers, or the reason it is failing. Set `DISCORD_INVITE` in Vercel to change the invite code.

Discord notes
- For avatars, turn on Server Settings > Widget > Enable Server Widget.
- Discord caches link previews. After deploying, paste the link with `?v=2` on the end to see the new one.
