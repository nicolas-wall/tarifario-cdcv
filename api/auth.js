import { createHash } from "crypto";

function tokenDePassword() {
  return createHash("sha256")
    .update((process.env.APP_PASSWORD || "") + "cdcv-2025")
    .digest("hex");
}

function isAuthenticated(req) {
  const cookies = req.headers.cookie || "";
  const match = cookies.match(/cdcv_auth=([^;]+)/);
  return !!match && match[1] === tokenDePassword();
}

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    return res.status(200).json({ authenticated: isAuthenticated(req) });
  }

  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!process.env.APP_PASSWORD) {
      return res.status(500).json({ error: "APP_PASSWORD no configurada en el servidor." });
    }
    if (body.password === process.env.APP_PASSWORD) {
      const token = tokenDePassword();
      res.setHeader(
        "Set-Cookie",
        `cdcv_auth=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000; Path=/`
      );
      return res.status(200).json({ ok: true });
    }
    return res.status(401).json({ error: "Contraseña incorrecta." });
  }

  return res.status(405).end();
}
