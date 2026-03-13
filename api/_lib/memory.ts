export type MemoryRecord = {
  id: number;
  date: string | null;
  location: string | null;
  url: string;
};

type MemoryRecordInput = {
  id?: unknown;
  date?: unknown;
  location?: unknown;
  url?: unknown;
};

export function normalizeMemoryRecord(input: MemoryRecordInput | null | undefined): MemoryRecord | null {
  if (!input || typeof input !== "object") return null;

  const id = Number(input.id);
  if (!Number.isFinite(id)) return null;

  const url = String(input.url ?? "").trim();
  if (!url) return null;

  const dateRaw = input.date;
  const date = dateRaw ? String(dateRaw) : null;

  const rawLocation = input.location;
  const location = rawLocation ? String(rawLocation).trim() : "";

  return {
    id,
    date,
    // Legacy `place` objects are intentionally ignored after migration.
    location: location || null,
    url,
  };
}
