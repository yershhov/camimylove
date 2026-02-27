import dotenv from "dotenv";

dotenv.config();

function parseBoolean(value: string | undefined) {
  if (!value) return false;
  return value.toLowerCase() === "true";
}

export default async function handler(_req: any, res: any) {
  return res.status(200).json({
    uploadEnabled: parseBoolean(process.env.UPLOAD_FEATURE_ENABLED),
  });
}
