import dotenv from "dotenv";
import { isAuthenticatedRequest } from "../_lib/auth.js";
import { getMemoryById, getRandomMemory } from "../_lib/memory-repository.js";
import {
  ensurePostgresMemoriesReady,
  getSqlClient,
  isPostgresConfigured,
} from "../_lib/postgres.js";

dotenv.config();

export default async function handler(req: any, res: any) {
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
    const requestedIdRaw = req.query?.id;
    let requestedId: number | null = null;

    if (requestedIdRaw !== undefined) {
      const parsedRequestedId = Number(requestedIdRaw);
      if (
        !Number.isFinite(parsedRequestedId) ||
        !Number.isInteger(parsedRequestedId) ||
        parsedRequestedId < 0
      ) {
        return res.status(400).json({
          ok: false,
          error: "Invalid memory id",
        });
      }
      requestedId = parsedRequestedId;
    }

    await ensurePostgresMemoriesReady();

    const memory =
      requestedId !== null
        ? await getMemoryById(getSqlClient(), requestedId)
        : await getRandomMemory(getSqlClient());

    if (!memory) {
      if (requestedId !== null) {
        return res.status(404).json({
          ok: false,
          error: "Memory not found",
        });
      }
      return res.status(404).json({
        ok: false,
        error: "No memories available",
      });
    }

    return res.status(200).json({ ok: true, memory });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Failed to fetch random memory",
    });
  }
}
