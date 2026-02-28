import crypto from "crypto";

const AUTH_COOKIE_NAME = "camimylove_auth";
const SESSION_TTL_SECONDS = 60 * 15; // 15 minutes

function getAuthSecret() {
  const fromEnv = process.env.AUTH_SESSION_SECRET;
  if (fromEnv && fromEnv.trim()) return fromEnv.trim();

  const fallback = process.env.AUTH_PET_NAME_ANSWER;
  if (fallback && fallback.trim()) return fallback.trim();

  return "camimylove-default-secret";
}

function signPayload(payload: string) {
  return crypto
    .createHmac("sha256", getAuthSecret())
    .update(payload)
    .digest("base64url");
}

function getCookieValue(req: any, cookieName: string) {
  const rawCookie = String(req?.headers?.cookie ?? "");
  if (!rawCookie) return null;

  const parts = rawCookie.split(";").map((part) => part.trim());
  const target = parts.find((part) => part.startsWith(`${cookieName}=`));
  if (!target) return null;

  return target.slice(cookieName.length + 1);
}

export function createAuthCookie() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `ok.${expiresAt}`;
  const signature = signPayload(payload);
  const token = `${payload}.${signature}`;

  return `${AUTH_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}; Secure`;
}

export function clearAuthCookie() {
  return `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`;
}

function appendSetCookie(res: any, cookie: string) {
  const currentHeader = res.getHeader("Set-Cookie");
  if (!currentHeader) {
    res.setHeader("Set-Cookie", cookie);
    return;
  }

  if (Array.isArray(currentHeader)) {
    res.setHeader("Set-Cookie", [...currentHeader, cookie]);
    return;
  }

  res.setHeader("Set-Cookie", [String(currentHeader), cookie]);
}

export function isAuthenticatedRequest(req: any, res?: any) {
  const token = getCookieValue(req, AUTH_COOKIE_NAME);
  if (!token) return false;

  const [status, expiresAtRaw, signature] = token.split(".");
  if (!status || !expiresAtRaw || !signature) return false;
  if (status !== "ok") return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt)) return false;
  if (Math.floor(Date.now() / 1000) > expiresAt) return false;

  const payload = `${status}.${expiresAtRaw}`;
  const expectedSignature = signPayload(payload);

  // timingSafeEqual requires same length buffers.
  const expected = Buffer.from(expectedSignature);
  const given = Buffer.from(signature);
  if (expected.length !== given.length) return false;

  const isValid = crypto.timingSafeEqual(expected, given);
  if (isValid && res) {
    appendSetCookie(res, createAuthCookie());
  }

  return isValid;
}
