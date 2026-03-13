import dotenv from "dotenv";
import { randomInt } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put } from "@vercel/blob";
import { isAuthenticatedRequest } from "../_lib/auth.js";
import { normalizeMemoryRecord } from "../_lib/memory.js";
import { getMemoryById, upsertMemory } from "../_lib/memory-repository.js";
import {
  ensurePostgresMemoriesReady,
  getSqlClient,
  isPostgresConfigured,
} from "../_lib/postgres.js";

dotenv.config();

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heic",
  "image/heif",
]);

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/heic": "heic",
  "image/heif": "heif",
};

type UploadBody = {
  fileName?: string;
  mimeType?: string;
  dataBase64?: string;
  date?: string | null;
  location?: string | null;
};

function parseBody(req: VercelRequest & { body: UploadBody | string | undefined }) {
  const body = req.body;
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as Partial<UploadBody>;
    } catch {
      return {};
    }
  }
  return body;
}

async function generateMemoryId() {
  const sql = getSqlClient();
  for (let attempts = 0; attempts < 8; attempts += 1) {
    const candidateId = Date.now() * 1000 + randomInt(0, 1000);
    const existing = await getMemoryById(sql, candidateId);
    if (!existing) {
      return candidateId;
    }
  }
  throw new Error("Failed to allocate a unique memory id");
}

export default async function handler(
  req: VercelRequest & { body: UploadBody | string | undefined },
  res: VercelResponse,
) {
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

  try {
    const body = parseBody(req);
    const mimeType = String(body.mimeType ?? "").toLowerCase();
    const dataBase64 = String(body.dataBase64 ?? "");

    if (!mimeType || !ALLOWED_MIME_TYPES.has(mimeType)) {
      return res.status(400).json({
        ok: false,
        error: "Unsupported file type",
      });
    }

    if (!dataBase64) {
      return res.status(400).json({
        ok: false,
        error: "Missing image payload",
      });
    }

    const buffer = Buffer.from(dataBase64, "base64");
    if (!buffer.length || buffer.length > MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({
        ok: false,
        error: "Invalid image size",
      });
    }

    await ensurePostgresMemoriesReady();

    const memoryId = await generateMemoryId();
    const extension = MIME_TO_EXTENSION[mimeType] ?? "jpg";
    const imageKey = `images/${memoryId}.${extension}`;

    const imageUpload = await put(imageKey, buffer, {
      access: "public",
      token,
      addRandomSuffix: false,
      contentType: mimeType,
    });

    const memoryRecord = normalizeMemoryRecord({
      id: memoryId,
      date: body.date ? String(body.date) : null,
      location: body.location ? String(body.location).trim() : null,
      url: imageUpload.url,
    });

    if (!memoryRecord) {
      return res.status(500).json({
        ok: false,
        error: "Failed to build memory metadata",
      });
    }

    await upsertMemory(getSqlClient(), memoryRecord);

    return res.status(201).json({
      ok: true,
      memory: memoryRecord,
    });
  } catch {
    return res.status(500).json({
      ok: false,
      error: "Failed to upload memory",
    });
  }
}
