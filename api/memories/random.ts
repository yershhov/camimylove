import dotenv from "dotenv";
import { isAuthenticatedRequest } from "../_lib/auth.js";
import {
  findMetadataBlobById,
  listAllMetadataBlobs,
  normalizeMemoryRecord,
} from "../_lib/memory.js";

dotenv.config();

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
    const requestedIdRaw = req.query?.id;
    const requestedId =
      requestedIdRaw === undefined ? null : Number(requestedIdRaw);

    if (
      requestedIdRaw !== undefined &&
      (!Number.isFinite(requestedId) || !Number.isInteger(requestedId) || requestedId < 0)
    ) {
      return res.status(400).json({
        ok: false,
        error: "Invalid memory id",
      });
    }

    let selectedBlob: { pathname: string; url: string } | null = null;

    if (requestedId !== null) {
      const blob = await findMetadataBlobById(token, requestedId);
      if (!blob) {
        return res.status(404).json({
          ok: false,
          error: "Memory not found",
        });
      }
      selectedBlob = { pathname: blob.pathname, url: blob.url };
    } else {
      const metadataBlobs = await listAllMetadataBlobs(token);

      if (metadataBlobs.length === 0) {
        return res.status(404).json({
          ok: false,
          error: "No memories available",
        });
      }

      // Pick from metadata records only to guarantee image+metadata pairing.
      selectedBlob =
        metadataBlobs[Math.floor(Math.random() * metadataBlobs.length)];
    }

    const metadataResponse = await fetch(`${selectedBlob.url}?t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!metadataResponse.ok) {
      return res.status(500).json({
        ok: false,
        error: "Failed to fetch selected memory metadata",
      });
    }

    const rawMemory = await metadataResponse.json();
    const memory = normalizeMemoryRecord(rawMemory);

    if (!memory) {
      return res.status(500).json({
        ok: false,
        error: "Invalid memory metadata format",
      });
    }

    return res.status(200).json({ ok: true, memory });
  } catch (error) {
    console.error("Failed to fetch random memory", error);
    return res.status(500).json({
      ok: false,
      error: "Failed to fetch random memory",
    });
  }
}
