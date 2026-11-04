import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.S3_ENDPOINT || "https://2d7cdfae18c56d61c8d3ceaa4526dc2a.r2.cloudflarestorage.com";
const region = process.env.S3_REGION || "auto";
const bucket = process.env.S3_BUCKET || "object-storage-24p8og";
const accessKeyId = process.env.S3_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || "";
const publicUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "https://storage.vpsmurah.co.id";

export const s3Client = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export interface UploadResult {
  url: string;        // Proxy stream URL
  publicUrl: string;  // Direct public URL
  key: string;        // S3 object key
}

export async function uploadToStorage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<UploadResult> {
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `${Date.now()}-${cleanName}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })
  );

  return {
    url: `/api/storage/${key}`,
    publicUrl: `${publicUrl.replace(/\/$/, "")}/${key}`,
    key,
  };
}
