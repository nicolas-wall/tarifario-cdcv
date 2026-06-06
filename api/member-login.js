import { createClient } from '@supabase/supabase-js';
import { sign } from './_jwt.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { email, password } = body || {};
  if (!email || !password) return res.status(400).json({ error: 'Faltan campos.' });

  const { data, error } = await supabase.rpc('member_login', {
    p_email: email.toLowerCase().trim(),
    p_password: password,
  });

  if (error || !data || data.length === 0) {
    return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
  }

  const member = data[0];
  const token = sign({
    memberId: member.id,
    nombre: member.nombre,
    email: member.email,
    color: member.color,
    role: member.role,
  });

  res.setHeader('Set-Cookie',
    `pres-session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${30 * 24 * 3600}`
  );
  res.json({ ok: true, member: { id: member.id, nombre: member.nombre, email: member.email, color: member.color, role: member.role } });
}
