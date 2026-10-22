// Served only to link-preview bots (Discord, Twitter, Slack, WhatsApp...) so previews get full web addresses.
module.exports = function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  const base = 'https://' + host;
  const title = 'Eurotunnel Wiki';
  const desc = 'Community wiki for Eurotunnel border roleplay: gamepasses, badges, smuggling calculator, teams and an interactive map.';
  const img = base + '/og-banner.png';
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send('<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<title>' + title + '</title>' +
    '<meta name="description" content="' + desc + '">' +
    '<meta name="theme-color" content="#2563eb">' +
    '<meta property="og:type" content="website">' +
    '<meta property="og:site_name" content="' + title + '">' +
    '<meta property="og:title" content="' + title + '">' +
    '<meta property="og:description" content="' + desc + '">' +
    '<meta property="og:url" content="' + base + '/">' +
    '<meta property="og:image" content="' + img + '">' +
    '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">' +
    '<meta name="twitter:card" content="summary_large_image">' +
    '<meta name="twitter:title" content="' + title + '">' +
    '<meta name="twitter:description" content="' + desc + '">' +
    '<meta name="twitter:image" content="' + img + '">' +
    '</head><body><a href="' + base + '/">' + title + '</a></body></html>');
};
