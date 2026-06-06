import { verify, parseCookies } from './_jwt.js';

export default function handler(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies['pres-session'];
  if (!token) return res.json({ member: null });
  try {
    const p = verify(token);
    res.json({ member: { id: p.memberId, nombre: p.nombre, email: p.email, color: p.color, role: p.role } });
  } catch {
    res.json({ member: null });
  }
}
