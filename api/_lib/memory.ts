import { list } from "@vercel/blob";

export type MemoryRecord = {
  id: number;
  date: string | null;
  location: string | null;
  url: string;
  imageKey?: string;
};

const METADATA_PREFIX = "metadata/";

export function normalizeMemoryRecord(input: any): MemoryRecord | null {
  if (!input || typeof input !== "object") return null;

  const id = Number(input.id);
  if (!Number.isFinite(id)) return null;

  const url = String(input.url ?? "").trim();
  if (!url) return null;

  const dateRaw = input.date;
  const date = dateRaw ? String(dateRaw) : null;

  const rawLocation = input.location;
  const location = rawLocation ? String(rawLocation).trim() : "";

  const imageKey = input.imageKey ? String(input.imageKey) : undefined;

  return {
    id,
    date,
    // Legacy `place` objects are intentionally ignored after migration.
    location: location || null,
    url,
    imageKey,
  };
}

export async function listAllMetadataBlobs(token: string) {
  const blobs: Array<{ pathname: string; url: string }> = [];
  let cursor: string | undefined;

  do {
    const response = await list({
      token,
      prefix: METADATA_PREFIX,
      cursor,
      limit: 1000,
    });

    for (const blob of response.blobs) {
      if (blob.pathname.endsWith(".json")) {
        blobs.push({ pathname: blob.pathname, url: blob.url });
      }
    }

    cursor = response.hasMore ? response.cursor : undefined;
  } while (cursor);

  return blobs;
}
