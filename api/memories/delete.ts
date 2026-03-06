import dotenv from "dotenv";
import { del } from "@vercel/blob";
import { isAuthenticatedRequest } from "../_lib/auth.js";
import {
  findImageBlobByKey,
  findImageBlobByMemoryId,
} from "../_lib/memory.js";
import { deleteMemory, getMemoryById } from "../_lib/memory-repository.js";
import {
  ensurePostgresMemoriesReady,
  getSqlClient,
  isPostgresConfigured,
} from "../_lib/postgres.js";

dotenv.config();

function parseMemoryId(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const parsed = Number((body as { id?: unknown }).id);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.floor(parsed);
}

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("CDN-Cache-Control", "no-store");
  res.setHeader("Vercel-CDN-Cache-Control", "no-store");

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

  const id = parseMemoryId(req.body);
  if (id === null) {
    return res.status(400).json({
      ok: false,
      error: "Invalid memory id",
    });
  }

  try {
    await ensurePostgresMemoriesReady();

    const memory = await getMemoryById(getSqlClient(), id);
    if (!memory) {
      return res.status(404).json({
        ok: false,
        error: "Memory not found",
      });
    }

    await deleteMemory(getSqlClient(), id);

    const imageBlobFromKey = memory.imageKey
      ? await findImageBlobByKey(token, memory.imageKey)
      : null;
    const imageBlobById = imageBlobFromKey
      ? null
      : await findImageBlobByMemoryId(token, id);

    const urlsToDelete: string[] = [];
    if (imageBlobFromKey?.url) {
      urlsToDelete.push(imageBlobFromKey.url);
    } else if (imageBlobById?.url) {
      urlsToDelete.push(imageBlobById.url);
    } else if (memory.url) {
      urlsToDelete.push(memory.url);
    }

    if (urlsToDelete.length > 0) {
      await del(urlsToDelete, { token });
    }

    return res.status(200).json({
      ok: true,
      id,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Failed to delete memory",
    });
  }
}
