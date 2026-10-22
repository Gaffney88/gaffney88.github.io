// Returns live Discord numbers for the home page card.
// Change the invite code here, or set the DISCORD_INVITE environment variable in Vercel.
const CODE = process.env.DISCORD_INVITE || '6a2yVew8E7';
const GUILD = process.env.DISCORD_GUILD_ID || '1518305160605204600';

module.exports = async function handler(req, res) {
  const out = { members: 0, online: 0, faces: [], people: [], icon: '', widget: false };
  try {
    try {
      const r = await fetch('https://discord.com/api/v10/invites/' + CODE + '?with_counts=true');
      if (r.ok) {
        const inv = await r.json();
        out.members = inv.approximate_member_count || 0;
        out.online = inv.approximate_presence_count || 0;
        out.name = inv.guild && inv.guild.name;
        if (inv.guild && inv.guild.icon) out.icon = 'https://cdn.discordapp.com/icons/' + GUILD + '/' + inv.guild.icon + '.png?size=128';
      } else { out.note = 'Invite lookup returned ' + r.status + (r.status === 404 ? ' (invite expired or wrong code), so member totals are missing.' : '.'); }
    } catch (e) { out.note = 'Invite lookup failed: ' + e.message; }
    try {
      const w = await fetch('https://discord.com/api/guilds/' + GUILD + '/widget.json');
      if (w.ok) {
        const j = await w.json();
        out.widget = true;
        if (!out.online) out.online = j.presence_count || 0;
        const ppl = (j.members || []).filter(function (m) { return m.avatar_url; });
        out.people = ppl.slice(0, 12).map(function (m) { return { n: m.username, a: m.avatar_url, s: m.status }; });
        out.faces = out.people.map(function (m) { return m.a; });
      } else {
        out.note = (out.note ? out.note + ' ' : '') + 'Avatars are off: in Discord turn on Server Settings > Widget > Enable Server Widget (widget returned ' + w.status + ').';
      }
    } catch (e) { out.note = (out.note ? out.note + ' ' : '') + 'Widget lookup failed: ' + e.message; }
    if (!out.members && !out.online) throw new Error(out.note || 'no data from Discord');
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(out);
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: String(e.message || e) });
  }
};
