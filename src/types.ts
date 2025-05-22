export type PhotoMetadata = {
  id: number;
  date: string | null; // ISO date string
  place: {
    latitude: number | null;
    longitude: number | null;
  };
  url: string;
};
