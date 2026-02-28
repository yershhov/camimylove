import dotenv from "dotenv";
import { put } from "@vercel/blob";
import { isAuthenticatedRequest } from "../_lib/auth.js";
import { listAllMetadataBlobs, normalizeMemoryRecord } from "../_lib/memory.js";

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

function parseBody(req: any): UploadBody {
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

function getNextMemoryId(pathnames: string[]) {
  let maxId = -1;

  for (const pathname of pathnames) {
    const fileName = pathname.split("/").pop() ?? "";
    const idRaw = fileName.replace(".json", "");
    const id = Number(idRaw);
    if (Number.isFinite(id)) {
      maxId = Math.max(maxId, id);
    }
  }

  return maxId + 1;
}

export default async function handler(req: any, res: any) {
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

    const metadataBlobs = await listAllMetadataBlobs(token);
    const memoryId = getNextMemoryId(metadataBlobs.map((blob) => blob.pathname));
    const extension = MIME_TO_EXTENSION[mimeType] ?? "jpg";
    const imageKey = `images/${memoryId}.${extension}`;
    const metadataKey = `metadata/${memoryId}.json`;

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
      imageKey,
    });

    if (!memoryRecord) {
      return res.status(500).json({
        ok: false,
        error: "Failed to build memory metadata",
      });
    }

    await put(metadataKey, JSON.stringify(memoryRecord, null, 2), {
      access: "public",
      token,
      addRandomSuffix: false,
      contentType: "application/json",
    });

    return res.status(201).json({
      ok: true,
      memory: memoryRecord,
    });
  } catch (error) {
    console.error("Failed to upload memory", error);
    return res.status(500).json({
      ok: false,
      error: "Failed to upload memory",
    });
  }
}
