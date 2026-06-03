import crypto from "crypto";

export function tokenDePassword() {
  return crypto
    .createHash("sha256")
    .update((process.env.APP_PASSWORD || "") + "cdcv-2025")
    .digest("hex");
}

export function isAuthenticated(req) {
  const cookies = req.headers.cookie || "";
  const match = cookies.match(/cdcv_auth=([^;]+)/);
  return !!match && match[1] === tokenDePassword();
}
