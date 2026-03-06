import dotenv from "dotenv";
import { isAuthenticatedRequest } from "../_lib/auth.js";
import { normalizeMemoryRecord } from "../_lib/memory.js";
import { getMemoryById, upsertMemory } from "../_lib/memory-repository.js";
import {
  ensurePostgresMemoriesReady,
  getSqlClient,
  isPostgresConfigured,
} from "../_lib/postgres.js";

dotenv.config();

type UpdateBody = {
  id?: unknown;
  date?: string | null;
  location?: string | null;
};

function parseBody(req: any): UpdateBody {
  const body = req?.body;
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

function parseMemoryId(rawId: unknown) {
  const parsed = Number(rawId);
  if (!Number.isFinite(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
    return null;
  }
  return parsed;
}

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("CDN-Cache-Control", "no-store");
  res.setHeader("Vercel-CDN-Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!isAuthenticatedRequest(req, res)) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return res.status(500).json({
      ok: false,
      error: "Blob token is not configured",
    });
  }

  if (!isPostgresConfigured()) {
    return res.status(503).json({
      ok: false,
      error: "Postgres is not configured",
    });
  }

  try {
    const body = parseBody(req);
    const memoryId = parseMemoryId(body.id);
    if (memoryId === null) {
      return res.status(400).json({
        ok: false,
        error: "Invalid memory id",
      });
    }

    await ensurePostgresMemoriesReady();

    const existingMemory = await getMemoryById(getSqlClient(), memoryId);
    if (!existingMemory) {
      return res.status(404).json({
        ok: false,
        error: "Memory not found",
      });
    }

    const updatedMemory = normalizeMemoryRecord({
      id: existingMemory.id,
      url: existingMemory.url,
      imageKey: existingMemory.imageKey,
      date: body.date ? String(body.date) : null,
      location: body.location ? String(body.location).trim() : null,
    });

    if (!updatedMemory) {
      return res.status(400).json({
        ok: false,
        error: "Invalid memory payload",
      });
    }

    await upsertMemory(getSqlClient(), updatedMemory);

    return res.status(200).json({
      ok: true,
      memory: updatedMemory,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Failed to update memory",
    });
  }
}
