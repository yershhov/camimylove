import dotenv from "dotenv";
import { clearAuthCookie } from "./_lib/auth.js";

dotenv.config();

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  res.setHeader("Set-Cookie", clearAuthCookie());
  return res.status(200).json({ ok: true });
}
