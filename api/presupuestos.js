import { put, list, del, get } from "@vercel/blob";
import { createHash } from "crypto";
import { verify, parseCookies } from "./_jwt.js";

function isAuthenticated(req) {
  const cookies = parseCookies(req.headers.cookie);
  // Accept member JWT session
  if (cookies["pres-session"]) {
    try { verify(cookies["pres-session"]); return true; } catch {}
  }
  // Backward compat: old shared password cookie
  const hash = createHash("sha256").update((process.env.APP_PASSWORD || "") + "cdcv-2025").digest("hex");
  return cookies["cdcv_auth"] === hash;
}

export default async function handler(req, res) {
  try {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const { id } = req.query;
    // GET by ID is public (used by share links)
    if (id) {
      const { blobs } = await list({ prefix: `presupuestos/${id}.json` });
      if (!blobs.length) return res.status(404).json({ error: "Not found" });
      try {
        const result = await get(blobs[0].url, { access: "private" });
        if (!result) return res.status(404).json({ error: "Not found" });
        const text = await new Response(result.stream).text();
        return res.status(200).json(JSON.parse(text));
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    }
    // List all — requires auth
    if (!isAuthenticated(req)) return res.status(401).json({ error: "Unauthorized" });
    const { blobs } = await list({ prefix: "presupuestos/" });
    const items = await Promise.all(
      blobs.map(async (b) => {
        try {
          const result = await get(b.url, { access: "private" });
          if (!result) return null;
          const text = await new Response(result.stream).text();
          const d = JSON.parse(text);
          return { ...d, blobUrl: b.url };
        } catch (e) {
          console.error("Error reading blob:", b.url, e.message);
          return null;
        }
      })
    );
    const sorted = items
      .filter(Boolean)
      .sort((a, b) => new Date(b.fechaISO) - new Date(a.fechaISO));
    return res.status(200).json(sorted);
  }

  // POST and DELETE require auth
  if (!isAuthenticated(req)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const filename = `presupuestos/${data.id}.json`;
    const blob = await put(filename, JSON.stringify(data, null, 2), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return res.status(200).json({ url: blob.url });
  }

  if (req.method === "DELETE") {
    const { url } = req.query;
    if (url) await del(url);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.error("presupuestos handler crash:", e);
    return res.status(500).json({ error: e.message, cause: e.cause?.message });
  }
}
