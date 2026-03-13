import dotenv from "dotenv";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clearAuthCookie } from "./_lib/auth.js";

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  res.setHeader("Set-Cookie", clearAuthCookie());
  return res.status(200).json({ ok: true });
}
