import { list } from "@vercel/blob";

export type MemoryRecord = {
  id: number;
  date: string | null;
  location: string | null;
  url: string;
  imageKey?: string;
};

const METADATA_PREFIX = "metadata/";
const IMAGE_PREFIX = "images/";

export function parseMemoryIdFromMetadataPath(pathname: string) {
  const fileName = pathname.split("/").pop() ?? "";
  const idRaw = fileName.replace(".json", "");
  const id = Number(idRaw);
  return Number.isFinite(id) ? id : null;
}

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

export async function findMetadataBlobById(token: string, id: number) {
  const pathname = `${METADATA_PREFIX}${id}.json`;
  const response = await list({
    token,
    prefix: pathname,
    limit: 10,
  });

  return response.blobs.find((blob) => blob.pathname === pathname) ?? null;
}

export async function findImageBlobByKey(token: string, imageKey: string) {
  const response = await list({
    token,
    prefix: imageKey,
    limit: 10,
  });

  return response.blobs.find((blob) => blob.pathname === imageKey) ?? null;
}

export function parseMemoryIdFromImagePath(pathname: string) {
  if (!pathname.startsWith(IMAGE_PREFIX)) return null;
  const fileName = pathname.split("/").pop() ?? "";
  const idRaw = fileName.replace(/\.[^.]+$/, "");
  const id = Number(idRaw);
  return Number.isFinite(id) ? id : null;
}

export async function findImageBlobByMemoryId(token: string, id: number) {
  const response = await list({
    token,
    prefix: `${IMAGE_PREFIX}${id}`,
    limit: 20,
  });

  return (
    response.blobs.find((blob) => parseMemoryIdFromImagePath(blob.pathname) === id) ??
    null
  );
}
