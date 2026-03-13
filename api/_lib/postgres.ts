import dotenv from "dotenv";
import postgres from "postgres";
import { ensureMemoriesTable } from "./memory-repository.js";

dotenv.config();

let sqlClient: ReturnType<typeof postgres> | null = null;
let schemaReadyPromise: Promise<void> | null = null;

function getConnectionString() {
  const candidates = [
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.DATABASE_URL_UNPOOLED,
  ];

  for (const candidate of candidates) {
    if (candidate && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
}

export function isPostgresConfigured() {
  return Boolean(getConnectionString());
}

export function getSqlClient() {
  if (sqlClient) return sqlClient;

  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error("Postgres connection string is not configured");
  }

  sqlClient = postgres(connectionString, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
    onnotice: () => undefined,
  });
  return sqlClient;
}

export async function ensurePostgresMemoriesReady() {
  if (!schemaReadyPromise) {
    schemaReadyPromise = ensureMemoriesTable(getSqlClient());
  }
  await schemaReadyPromise;
}
