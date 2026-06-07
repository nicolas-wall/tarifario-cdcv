import { verify, parseCookies } from './_jwt.js';

export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).end();
  }
  if (req.method !== 'POST') return res.status(405).end();
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { token } = body || {};
  if (!token) return res.status(400).json({ error: 'Missing token' });
  try {
    const p = verify(token);
    res.setHeader('Set-Cookie',
      `pres-session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${30 * 24 * 3600}`
    );
    res.json({ member: { id: p.memberId, nombre: p.nombre, email: p.email, color: p.color, role: p.role, avatar_url: p.avatar_url || null } });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
