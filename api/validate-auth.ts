import dotenv from "dotenv";
import { createAuthCookie, clearAuthCookie } from "./_lib/auth";

dotenv.config();

type ValidateAuthBody = {
  date?: string;
  secondInput?: string;
};

const normalize = (value: string) => value.toLowerCase();

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const expectedDate = process.env.AUTH_DATE_ANSWER;
  const expectedPetName = process.env.AUTH_PET_NAME_ANSWER;

  if (!expectedDate || !expectedPetName) {
    return res.status(500).json({
      ok: false,
      error: "Server auth answers are not configured",
    });
  }

  const body = (req.body ?? {}) as ValidateAuthBody;
  const date = String(body.date ?? "").trim();
  const petName = String(body.secondInput ?? "");

  const isDateValid = date === expectedDate.trim();
  const isSecondInputValid = normalize(petName) === normalize(expectedPetName);

  if (!isDateValid || !isSecondInputValid) {
    res.setHeader("Set-Cookie", clearAuthCookie());
    return res.status(401).json({ ok: false });
  }

  res.setHeader("Set-Cookie", createAuthCookie());
  return res.status(200).json({ ok: true });
}
