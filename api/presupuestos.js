import { put, list, del, head } from "@vercel/blob";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const filename = `presupuestos/${data.id}.json`;
    const blob = await put(filename, JSON.stringify(data, null, 2), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return res.status(200).json({ url: blob.url });
  }

  if (req.method === "GET") {
    const { blobs } = await list({ prefix: "presupuestos/" });
    const items = await Promise.all(
      blobs.map(async (b) => {
        try {
          const info = await head(b.url);
          const r = await fetch(info.downloadUrl);
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          const d = await r.json();
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

  if (req.method === "DELETE") {
    const { url } = req.query;
    if (url) await del(url);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
