import dotenv from "dotenv";
import type { VercelRequest, VercelResponse } from "@vercel/node";

dotenv.config();

function parseBoolean(value: string | undefined) {
  if (!value) return false;
  return value.toLowerCase() === "true";
}

function parseBooleanOverride(value: string | undefined) {
  if (!value) return null;

  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return null;
}

function isFeatureEnabledUntil(isoDate: string | undefined) {
  if (!isoDate) return false;
  const timestamp = Date.parse(isoDate);
  if (!Number.isFinite(timestamp)) return false;
  return Date.now() < timestamp;
}

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse,
) {
  const womensDayOverride = parseBooleanOverride(process.env.FF_WOMENS_DAY_FORCE);
  const maintenanceOverride = parseBooleanOverride(
    process.env.FF_MAINTENANCE_FORCE,
  );

  const womensDayWelcomeEnabled =
    womensDayOverride ??
    isFeatureEnabledUntil(process.env.FF_WOMENS_DAY_UNTIL);
  const maintenanceModeEnabled =
    maintenanceOverride ??
    isFeatureEnabledUntil(process.env.FF_MAINTENANCE_UNTIL);

  return res.status(200).json({
    uploadEnabled: parseBoolean(process.env.UPLOAD_FEATURE_ENABLED),
    womensDayWelcomeEnabled,
    maintenanceModeEnabled,
  });
}
