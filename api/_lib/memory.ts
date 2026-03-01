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

export type MetadataBlob = {
  pathname: string;
  url: string;
  uploadedAtMs: number;
};

export function parseMemoryIdFromMetadataPath(pathname: string) {
  const revisionPathMatch = pathname.match(/^metadata\/(\d+)\/[^/]+\.json$/);
  if (revisionPathMatch) {
    const id = Number(revisionPathMatch[1]);
    return Number.isFinite(id) ? id : null;
  }

  // Backward compatibility with legacy metadata/{id}.json entries.
  const legacyPathMatch = pathname.match(/^metadata\/(\d+)\.json$/);
  if (legacyPathMatch) {
    const id = Number(legacyPathMatch[1]);
    return Number.isFinite(id) ? id : null;
  }

  return null;
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
  const blobs: MetadataBlob[] = [];
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
        const uploadedAtMs = new Date(blob.uploadedAt).getTime();
        blobs.push({
          pathname: blob.pathname,
          url: blob.url,
          uploadedAtMs: Number.isFinite(uploadedAtMs) ? uploadedAtMs : 0,
        });
      }
    }

    cursor = response.hasMore ? response.cursor : undefined;
  } while (cursor);

  return blobs;
}

export async function findMetadataBlobById(token: string, id: number) {
  const pathnamePrefix = `${METADATA_PREFIX}${id}`;
  const response = await list({
    token,
    prefix: pathnamePrefix,
    limit: 100,
  });

  const candidates: MetadataBlob[] = response.blobs
    .map((blob) => {
      const parsedId = parseMemoryIdFromMetadataPath(blob.pathname);
      if (parsedId !== id) return null;
      const uploadedAtMs = new Date(blob.uploadedAt).getTime();
      return {
        pathname: blob.pathname,
        url: blob.url,
        uploadedAtMs: Number.isFinite(uploadedAtMs) ? uploadedAtMs : 0,
      };
    })
    .filter((blob): blob is MetadataBlob => Boolean(blob));

  return pickLatestMetadataBlob(candidates);
}

export async function findMetadataBlobsById(token: string, id: number) {
  const pathnamePrefix = `${METADATA_PREFIX}${id}`;
  const response = await list({
    token,
    prefix: pathnamePrefix,
    limit: 1000,
  });

  return response.blobs
    .map((blob) => {
      const parsedId = parseMemoryIdFromMetadataPath(blob.pathname);
      if (parsedId !== id) return null;
      const uploadedAtMs = new Date(blob.uploadedAt).getTime();
      return {
        pathname: blob.pathname,
        url: blob.url,
        uploadedAtMs: Number.isFinite(uploadedAtMs) ? uploadedAtMs : 0,
      };
    })
    .filter((blob): blob is MetadataBlob => Boolean(blob));
}

export function pickLatestMetadataBlob(blobs: MetadataBlob[]) {
  if (blobs.length === 0) return null;
  return blobs.reduce((latest, current) => {
    if (current.uploadedAtMs > latest.uploadedAtMs) return current;
    if (current.uploadedAtMs < latest.uploadedAtMs) return latest;
    return current.pathname > latest.pathname ? current : latest;
  });
}

export function selectLatestMetadataBlobsById(blobs: MetadataBlob[]) {
  const byId = new Map<number, MetadataBlob>();

  for (const blob of blobs) {
    const id = parseMemoryIdFromMetadataPath(blob.pathname);
    if (id === null) continue;

    const previous = byId.get(id);
    if (!previous) {
      byId.set(id, blob);
      continue;
    }

    if (blob.uploadedAtMs > previous.uploadedAtMs) {
      byId.set(id, blob);
      continue;
    }

    if (
      blob.uploadedAtMs === previous.uploadedAtMs &&
      blob.pathname > previous.pathname
    ) {
      byId.set(id, blob);
    }
  }

  return Array.from(byId.entries()).map(([id, blob]) => ({
    id,
    pathname: blob.pathname,
    url: blob.url,
    uploadedAtMs: blob.uploadedAtMs,
  }));
}

export function buildMetadataRevisionKey(id: number) {
  const revision = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
  return `${METADATA_PREFIX}${id}/${revision}.json`;
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
