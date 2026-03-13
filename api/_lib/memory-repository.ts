import type postgres from "postgres";
import type { MemoryRecord } from "./memory.js";

export type SqlClient = ReturnType<typeof postgres>;

type MemoryRow = {
  id: string | number;
  date: string | null;
  location: string | null;
  image_url: string;
};

function mapRowToMemory(row: MemoryRow): MemoryRecord {
  return {
    id: Number(row.id),
    date: row.date ?? null,
    location: row.location ?? null,
    url: row.image_url,
  };
}

export async function ensureMemoriesTable(sql: SqlClient) {
  await sql`
    create table if not exists memories (
      id bigint primary key,
      date text null,
      location text null,
      image_url text not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;

  await sql`
    create index if not exists memories_created_at_desc_idx
      on memories (created_at desc)
  `;
}

export async function upsertMemory(sql: SqlClient, memory: MemoryRecord) {
  await sql`
    insert into memories (id, date, location, image_url, created_at, updated_at)
    values (
      ${memory.id},
      ${memory.date},
      ${memory.location},
      ${memory.url},
      now(),
      now()
    )
    on conflict (id) do update set
      date = excluded.date,
      location = excluded.location,
      image_url = excluded.image_url,
      updated_at = now()
  `;
}

export async function deleteMemory(sql: SqlClient, id: number) {
  const result = await sql`
    delete from memories
    where id = ${id}
    returning id, date, location, image_url
  `;

  return result.length > 0 ? mapRowToMemory(result[0] as MemoryRow) : null;
}

export async function getMemoryById(sql: SqlClient, id: number) {
  const result = await sql`
    select id, date, location, image_url
    from memories
    where id = ${id}
    limit 1
  `;

  if (result.length === 0) return null;
  return mapRowToMemory(result[0] as MemoryRow);
}

export async function getMemoryCount(sql: SqlClient) {
  const result = await sql`
    select count(*)::bigint as count
    from memories
  `;
  const countRaw = Number((result[0] as { count: string }).count);
  return Number.isFinite(countRaw) ? countRaw : 0;
}

export async function getRandomMemory(sql: SqlClient) {
  const count = await getMemoryCount(sql);
  if (count <= 0) return null;

  const offset = Math.floor(Math.random() * count);
  const result = await sql`
    select id, date, location, image_url
    from memories
    order by id desc
    offset ${offset}
    limit 1
  `;

  if (result.length === 0) return null;
  return mapRowToMemory(result[0] as MemoryRow);
}

export async function listMemoriesPage(
  sql: SqlClient,
  limit: number,
  beforeId: number | null,
) {
  const rows =
    beforeId === null
      ? await sql`
          select id, date, location, image_url
          from memories
          order by id desc
          limit ${limit + 1}
        `
      : await sql`
          select id, date, location, image_url
          from memories
          where id < ${beforeId}
          order by id desc
          limit ${limit + 1}
        `;

  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;
  const memories = pageRows.map((row) => mapRowToMemory(row as MemoryRow));
  const nextBeforeId =
    memories.length > 0 ? memories[memories.length - 1]?.id ?? null : null;

  return {
    memories,
    hasMore,
    nextBeforeId,
  };
}
