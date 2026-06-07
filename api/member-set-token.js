import { createClient } from '@supabase/supabase-js';
import { verify, parseCookies } from './_jwt.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
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
    const { data } = await supabase.from('members').select('*').eq('id', p.memberId).single();
    const member = data
      ? { id: data.id, nombre: data.nombre, email: data.email, color: data.color, role: data.role, avatar_url: data.avatar_url || null }
      : { id: p.memberId, nombre: p.nombre, email: p.email, color: p.color, role: p.role, avatar_url: p.avatar_url || null };
    res.json({ member });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
