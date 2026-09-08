// Same-origin proxy for the Google Apps Script calendar endpoint.
//
// The browser used to call script.google.com directly; that works in Chrome
// but Safari choked on the cross-site redirect to googleusercontent.com and
// handed the page an empty/non-JSON body. Fetching server-side sidesteps
// CORS, redirects, ITP and content blockers entirely.
//
// NOTE: every "Deploy → New deployment" in Apps Script creates a NEW URL.
// Update it here (and only here) after a redeploy.
const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbySMdu5iNFgJya0ix46e71vU0ywyPG7SxR7ZvVbCtFoYlPyRpVAstKOKI-hAwLTTBr9/exec';

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const r = await fetch(APPS_SCRIPT_URL, { redirect: 'follow' });
    const text = await r.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (_) {
      throw new Error('Apps Script returned non-JSON (HTTP ' + r.status + '): ' + text.slice(0, 120));
    }
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ success: false, error: String((e && e.message) || e) });
  }
};
