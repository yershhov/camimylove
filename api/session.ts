import dotenv from "dotenv";
import { clearAuthCookie, isAuthenticatedRequest } from "./_lib/auth.js";

dotenv.config();

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!isAuthenticatedRequest(req, res)) {
    res.setHeader("Set-Cookie", clearAuthCookie());
    return res.status(401).json({ ok: false });
  }

  return res.status(200).json({ ok: true });
}
