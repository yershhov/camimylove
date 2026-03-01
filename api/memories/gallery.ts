import dotenv from "dotenv";
import { isAuthenticatedRequest } from "../_lib/auth.js";
import {
  listAllMetadataBlobs,
  normalizeMemoryRecord,
  parseMemoryIdFromMetadataPath,
} from "../_lib/memory.js";

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

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
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
    const limit = parseLimit(req.query?.limit);
    const beforeId = parseBeforeId(req.query?.beforeId);

    const metadataBlobs = await listAllMetadataBlobs(token);
    const sortedByIdDesc = metadataBlobs
      .map((blob) => ({
        ...blob,
        id: parseMemoryIdFromMetadataPath(blob.pathname),
      }))
      .filter((blob) => blob.id !== null)
      .sort((a, b) => Number(b.id) - Number(a.id));

    const filtered = beforeId
      ? sortedByIdDesc.filter((blob) => Number(blob.id) < beforeId)
      : sortedByIdDesc;

    const pageBlobs = filtered.slice(0, limit);
    const hasMore = filtered.length > pageBlobs.length;

    const rawRecords = await Promise.all(
      pageBlobs.map(async (blob) => {
        try {
          const response = await fetch(`${blob.url}?t=${Date.now()}`, {
            cache: "no-store",
          });
          if (!response.ok) return null;
          return await response.json();
        } catch {
          return null;
        }
      }),
    );

    const memories = rawRecords
      .map((record) => normalizeMemoryRecord(record))
      .filter((record) => Boolean(record))
      .sort((a, b) => Number(b?.id ?? 0) - Number(a?.id ?? 0));

    const nextBeforeId =
      memories.length > 0 ? memories[memories.length - 1]?.id ?? null : null;

    return res.status(200).json({
      ok: true,
      memories,
      hasMore,
      nextBeforeId,
    });
  } catch (error) {
    console.error("Failed to fetch gallery memories", error);
    return res.status(500).json({
      ok: false,
      error: "Failed to fetch gallery memories",
    });
  }
}
