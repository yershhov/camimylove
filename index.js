import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const folder = "../nosotros_jpeg";
const metadataPath = "./public/metadata.json";
let metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));

// Get a list of files that match your metadata order (by id)
const files = metadata
  .map((entry) => {
    // Detect file extension by actual file existence
    const exts = [".jpeg", ".jpg", ".png"];
    for (const ext of exts) {
      const filePath = path.join(folder, `${entry.id}${ext}`);
      if (fs.existsSync(filePath)) {
        return { id: entry.id, file: `${entry.id}${ext}` };
      }
    }
    return null;
  })
  .filter(Boolean);

async function uploadAndMap() {
  console.log("token: ", process.env.BLOB_READ_WRITE_TOKEN);
  for (const item of files) {
    const filePath = path.join(folder, item.file);
    const fileStream = fs.createReadStream(filePath);
    try {
      const { url } = await put(item.file, fileStream, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      console.log(`${item.file} => ${url}`);

      // Find corresponding metadata entry and add the url
      const entry = metadata.find((e) => e.id === item.id);
      if (entry) {
        entry.url = url;
      }
    } catch (err) {
      console.error(`Failed to upload ${item.file}:`, err);
    }
  }

  // Save the updated metadata.json
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log("metadata.json updated with URLs!");
}

uploadAndMap();
