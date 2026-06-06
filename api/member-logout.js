export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  res.setHeader('Set-Cookie', [
    'pres-session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
    'cdcv_auth=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
  ]);
  res.json({ ok: true });
}
