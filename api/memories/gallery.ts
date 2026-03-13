import dotenv from "dotenv";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticatedRequest } from "../_lib/auth.js";
import { listMemoriesPage } from "../_lib/memory-repository.js";
import {
  ensurePostgresMemoriesReady,
  getSqlClient,
  isPostgresConfigured,
} from "../_lib/postgres.js";

dotenv.config();

const INITIAL_LIMIT = 40;
const MAX_LIMIT = 100;

function parseLimit(rawLimit: unknown) {
  const parsed = Number(rawLimit);
  if (!Number.isFinite(parsed) || parsed <= 0) return INITIAL_LIMIT;
  return Math.min(Math.floor(parsed), MAX_LIMIT);
}

function parseBeforeId(rawBeforeId: unknown) {
  if (rawBeforeId === undefined) return null;
  const parsed = Number(rawBeforeId);
  if (!Number.isFinite(parsed)) return null;
  return Math.floor(parsed);
}

type GalleryQuery = {
  limit?: string | string[];
  beforeId?: string | string[];
};

export default async function handler(
  req: VercelRequest & { query: GalleryQuery },
  res: VercelResponse,
) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("CDN-Cache-Control", "no-store");
  res.setHeader("Vercel-CDN-Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!isAuthenticatedRequest(req, res)) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  if (!isPostgresConfigured()) {
    return res.status(503).json({
      ok: false,
      error: "Postgres is not configured",
    });
  }

  try {
    const limit = parseLimit(req.query?.limit);
    const beforeId = parseBeforeId(req.query?.beforeId);

    await ensurePostgresMemoriesReady();
    const page = await listMemoriesPage(getSqlClient(), limit, beforeId);

    return res.status(200).json({
      ok: true,
      memories: page.memories,
      hasMore: page.hasMore,
      nextBeforeId: page.nextBeforeId,
    });
  } catch {
    return res.status(500).json({
      ok: false,
      error: "Failed to fetch gallery memories",
    });
  }
}
