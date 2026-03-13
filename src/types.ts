export type Memory = {
  id: number;
  date: string | null; // ISO date string
  location: string | null;
  url: string;
};

export type RandomMemoryResponse = {
  ok: boolean;
  memory?: Memory;
  error?: string;
};

export type GalleryMemoriesResponse = {
  ok: boolean;
  memories?: Memory[];
  hasMore?: boolean;
  nextBeforeId?: number | null;
  error?: string;
};

export type DeleteMemoryResponse = {
  ok: boolean;
  id?: number;
  error?: string;
};

export type UpdateMemoryResponse = {
  ok: boolean;
  memory?: Memory;
  error?: string;
};
