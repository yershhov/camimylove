import path from "path";
import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "process";
import dotenv from "dotenv";
import { del, list } from "@vercel/blob";

const PROJECT_ROOT = process.cwd();

dotenv.config({ path: path.join(PROJECT_ROOT, ".env.local") });
dotenv.config({ path: path.join(PROJECT_ROOT, ".env") });
dotenv.config({
  path: path.join(PROJECT_ROOT, ".vercel", ".env.development.local"),
});

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp"];
const DELETE_BATCH_SIZE = 250;

function parseThresholdId(rawArg) {
  if (rawArg === undefined) {
    throw new Error(
      'Missing id. Usage: npm run memories:delete-from -- <id>. Example: npm run memories:delete-from -- 107'
    );
  }

  const value = Number(rawArg);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(
      'Provide a non-negative integer id. Example: npm run memories:delete-from -- 107'
    );
  }
  return value;
}

function extractImageId(pathname) {
  const fileName = pathname.split("/").pop() ?? "";
  const lower = fileName.toLowerCase();
  const hasImageExt = IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
  if (!hasImageExt) return null;

  const baseName = fileName.replace(/\.[^.]+$/, "");
  const id = Number(baseName);
  return Number.isInteger(id) ? id : null;
}

function extractMetadataId(pathname) {
  if (!pathname.startsWith("metadata/") || !pathname.endsWith(".json")) return null;
  const fileName = pathname.split("/").pop() ?? "";
  const id = Number(fileName.replace(".json", ""));
  return Number.isInteger(id) ? id : null;
}

async function listAllBlobs(token, prefix = "") {
  const blobs = [];
  let cursor;

  do {
    const response = await list({
      token,
      prefix,
      cursor,
      limit: 1000,
    });
    blobs.push(...response.blobs);
    cursor = response.hasMore ? response.cursor : undefined;
  } while (cursor);

  return blobs;
}

async function deleteInBatches(token, urls) {
  for (let i = 0; i < urls.length; i += DELETE_BATCH_SIZE) {
    const batch = urls.slice(i, i + DELETE_BATCH_SIZE);
    await del(batch, { token });
  }
}

async function run() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required");
  }

  const thresholdId = parseThresholdId(process.argv[2]);

  const rl = createInterface({ input, output });
  const confirmation = await rl.question(
    `Delete ALL memories with id >= ${thresholdId}? (y/N): `
  );
  rl.close();

  const normalized = confirmation.trim().toLowerCase();
  if (normalized !== "y" && normalized !== "yes") {
    console.log("Aborted. No blobs were deleted.");
    return;
  }

  const [metadataBlobs, imageFolderBlobs] = await Promise.all([
    listAllBlobs(token, "metadata/"),
    listAllBlobs(token, "images/"),
  ]);

  const metadataToDelete = metadataBlobs.filter((blob) => {
    const id = extractMetadataId(blob.pathname);
    return id !== null && id >= thresholdId;
  });

  const imagesInFolderToDelete = imageFolderBlobs.filter((blob) => {
    const id = extractImageId(blob.pathname);
    return id !== null && id >= thresholdId;
  });

  const uniqueByUrl = new Map();
  [...metadataToDelete, ...imagesInFolderToDelete].forEach((blob) =>
    uniqueByUrl.set(blob.url, blob)
  );

  const allToDelete = Array.from(uniqueByUrl.values());
  if (allToDelete.length === 0) {
    console.log(`No blobs found with id >= ${thresholdId}.`);
    return;
  }

  await deleteInBatches(
    token,
    allToDelete.map((blob) => blob.url)
  );

  console.log(
    `Deleted ${allToDelete.length} blobs for id >= ${thresholdId} ` +
      `(${metadataToDelete.length} metadata, ` +
      `${imagesInFolderToDelete.length} images).`
  );
}

run().catch((error) => {
  console.error("Deletion failed", error);
  process.exit(1);
});
