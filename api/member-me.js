import { createClient } from '@supabase/supabase-js';
import { verify, parseCookies } from './_jwt.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies['pres-session'];
  if (!token) return res.json({ member: null });
  try {
    const p = verify(token);
    const { data } = await supabase.from('members').select('*').eq('id', p.memberId).single();
    if (data) {
      return res.json({ member: { id: data.id, nombre: data.nombre, email: data.email, color: data.color, role: data.role, avatar_url: data.avatar_url || null } });
    }
    res.json({ member: { id: p.memberId, nombre: p.nombre, email: p.email, color: p.color, role: p.role, avatar_url: p.avatar_url || null } });
  } catch {
    res.json({ member: null });
  }
}
