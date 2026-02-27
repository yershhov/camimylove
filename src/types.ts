export type Memory = {
  id: number;
  date: string | null; // ISO date string
  location: string | null;
  url: string;
  imageKey?: string;
};

export type RandomMemoryResponse = {
  ok: boolean;
  memory?: Memory;
  error?: string;
};
