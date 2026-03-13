import dotenv from "dotenv";
import type { VercelRequest, VercelResponse } from "@vercel/node";

dotenv.config();

type Body = { password?: string };

export default async function handler(
  req: VercelRequest & { body: Body },
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const expected = process.env.MAINTENANCE_ADMIN_PASSWORD?.trim();
  if (!expected) {
    return res.status(500).json({
      ok: false,
      error: "Maintenance unlock is not configured",
    });
  }

  const body = (req.body ?? {}) as Body;
  const password = String(body.password ?? "").trim();

  if (password !== expected) {
    return res.status(401).json({ ok: false, error: "Password non valida." });
  }

  return res.status(200).json({ ok: true });
}
