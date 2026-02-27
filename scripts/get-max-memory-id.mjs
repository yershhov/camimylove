import path from "path";
import dotenv from "dotenv";
import { list } from "@vercel/blob";

const PROJECT_ROOT = process.cwd();

dotenv.config({ path: path.join(PROJECT_ROOT, ".env.local") });
dotenv.config({ path: path.join(PROJECT_ROOT, ".env") });
dotenv.config({
  path: path.join(PROJECT_ROOT, ".vercel", ".env.development.local"),
});

async function run() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required");
  }

  let cursor;
  let maxId = -1;

  do {
    const response = await list({
      token,
      prefix: "metadata/",
      cursor,
      limit: 1000,
    });

    for (const blob of response.blobs) {
      const fileName = blob.pathname.split("/").pop() ?? "";
      if (!fileName.endsWith(".json")) continue;
      const id = Number(fileName.replace(".json", ""));
      if (Number.isFinite(id)) {
        maxId = Math.max(maxId, id);
      }
    }

    cursor = response.hasMore ? response.cursor : undefined;
  } while (cursor);

  console.log(maxId);
}

run().catch((error) => {
  console.error("Failed to compute max memory id", error);
  process.exit(1);
});
