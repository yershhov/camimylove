import dotenv from "dotenv";
import { del } from "@vercel/blob";
import { isAuthenticatedRequest } from "../_lib/auth.js";
import {
  findImageBlobByKey,
  findImageBlobByMemoryId,
  findMetadataBlobsById,
  findMetadataBlobById,
  normalizeMemoryRecord,
} from "../_lib/memory.js";

dotenv.config();

const DELETE_VERIFY_ATTEMPTS = 5;
const DELETE_VERIFY_DELAY_MS = 200;

function parseMemoryId(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const parsed = Number((body as { id?: unknown }).id);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.floor(parsed);
}

async function sleep(ms: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
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

  const id = parseMemoryId(req.body);
  if (id === null) {
    return res.status(400).json({
      ok: false,
      error: "Invalid memory id",
    });
  }

  try {
    const metadataBlob = await findMetadataBlobById(token, id);
    if (!metadataBlob) {
      return res.status(404).json({
        ok: false,
        error: "Memory not found",
      });
    }

    const metadataBlobs = await findMetadataBlobsById(token, id);

    let memory = null;
    try {
      const metadataResponse = await fetch(`${metadataBlob.url}?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (metadataResponse.ok) {
        const metadataJson = await metadataResponse.json();
        memory = normalizeMemoryRecord(metadataJson);
      }
    } catch {
      // If metadata parse fails, deletion can still continue using id fallback.
    }

    const imageBlobFromKey = memory?.imageKey
      ? await findImageBlobByKey(token, memory.imageKey)
      : null;
    const imageBlobById = imageBlobFromKey
      ? null
      : await findImageBlobByMemoryId(token, id);

    const urlsToDelete = new Set<string>();
    for (const blob of metadataBlobs) {
      urlsToDelete.add(blob.url);
    }
    urlsToDelete.add(metadataBlob.url);

    if (imageBlobFromKey?.url) {
      urlsToDelete.add(imageBlobFromKey.url);
    } else if (imageBlobById?.url) {
      urlsToDelete.add(imageBlobById.url);
    } else if (memory?.url) {
      urlsToDelete.add(memory.url);
    }

    await del(Array.from(urlsToDelete), { token });

    // Best-effort consistency wait: avoid returning success before metadata delete
    // is visible to list readers in quick back/refresh UI flows.
    for (let attempt = 0; attempt < DELETE_VERIFY_ATTEMPTS; attempt += 1) {
      const remainingMetadata = await findMetadataBlobsById(token, id);
      if (remainingMetadata.length === 0) break;
      await sleep(DELETE_VERIFY_DELAY_MS * (attempt + 1));
    }

    return res.status(200).json({
      ok: true,
      id,
    });
  } catch (error) {
    console.error("Failed to delete memory", error);
    return res.status(500).json({
      ok: false,
      error: "Failed to delete memory",
    });
  }
}
