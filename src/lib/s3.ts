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

export async function uploadToStorage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `${Date.now()}-${fileName.replace(/\s+/g, "-")}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })
  );

  return `${publicUrl.replace(/\/$/, "")}/${key}`;
}

