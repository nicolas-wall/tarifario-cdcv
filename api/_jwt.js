import { createHmac } from 'crypto';

const EXPIRES = 30 * 24 * 3600;

function secret() {
  return process.env.JWT_SECRET || 'de-jobs-dev-secret-change-in-prod';
}

export function sign(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + EXPIRES,
  })).toString('base64url');
  const sig = createHmac('sha256', secret()).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

export function verify(token) {
  const parts = (token || '').split('.');
  if (parts.length !== 3) throw new Error('invalid');
  const [header, body, sig] = parts;
  const expected = createHmac('sha256', secret()).update(`${header}.${body}`).digest('base64url');
  if (sig !== expected) throw new Error('invalid signature');
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error('expired');
  return payload;
}

export function parseCookies(header) {
  const list = {};
  if (!header) return list;
  header.split(';').forEach(c => {
    const parts = c.trim().split('=');
    list[parts[0].trim()] = parts.slice(1).join('=');
  });
  return list;
}
