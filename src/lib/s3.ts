import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint =
  process.env.S3_ENDPOINT ||
  "https://2d7cdfae18c56d61c8d3ceaa4526dc2a.r2.cloudflarestorage.com";
const region = process.env.S3_REGION || "auto";
const bucket = process.env.S3_BUCKET || "object-storage-24p8og";
const accessKeyId = process.env.S3_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || "";
const publicUrl =
  process.env.S3_PUBLIC_URL ||
  process.env.NEXT_PUBLIC_STORAGE_URL ||
  "https://storage.vpsmurah.co.id";

export const s3Client = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/flac",
  "audio/x-flac",
  "audio/aac",
  "audio/m4a",
  "audio/x-m4a",
  "audio/mp4",
  "audio/ogg",
  "audio/x-aiff",
  "audio/aiff",
  "application/octet-stream", // Fallback for some DAW / WAV uploads
];

export const ALLOWED_COVER_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_AUDIO_SIZE = 250 * 1024 * 1024; // 250 MB
const MAX_COVER_SIZE = 20 * 1024 * 1024; // 20 MB

export interface PresignUploadParams {
  fileName: string;
  contentType: string;
  fileSize?: number;
  userId?: string;
  fileType?: "audio" | "cover" | "general";
}

/**
 * Generate a presigned PUT URL for direct-to-R2 upload from client.
 * Bypasses Vercel payload limits (HTTP 413).
 */
export async function generatePresignedUploadUrl({
  fileName,
  contentType,
  fileSize,
  userId,
  fileType,
}: PresignUploadParams) {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const cleanBase = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 60);

  // Determine file category
  const isAudio =
    fileType === "audio" ||
    ["mp3", "wav", "flac", "aac", "m4a", "ogg", "aif", "aiff"].includes(ext) ||
    contentType.startsWith("audio/");

  const isCover =
    fileType === "cover" ||
    ["jpg", "jpeg", "png", "webp"].includes(ext) ||
    contentType.startsWith("image/");

  if (isAudio) {
    if (fileSize && fileSize > MAX_AUDIO_SIZE) {
      throw new Error(`Ukuran file audio melebihi batas maksimal (Max: 250 MB)`);
    }
    const isAllowedMime =
      ALLOWED_AUDIO_TYPES.includes(contentType.toLowerCase()) ||
      ["mp3", "wav", "flac", "aac", "m4a", "ogg", "aiff"].includes(ext);
    if (!isAllowedMime) {
      throw new Error(
        `Format file audio tidak didukung (${contentType || ext}). Gunakan WAV, MP3, atau FLAC.`
      );
    }
  } else if (isCover) {
    if (fileSize && fileSize > MAX_COVER_SIZE) {
      throw new Error(`Ukuran cover artwork melebihi batas maksimal (Max: 20 MB)`);
    }
    const isAllowedImage =
      ALLOWED_COVER_TYPES.includes(contentType.toLowerCase()) ||
      ["jpg", "jpeg", "png", "webp"].includes(ext);
    if (!isAllowedImage) {
      throw new Error(
        `Format gambar tidak didukung (${contentType || ext}). Gunakan JPG, PNG, atau WEBP.`
      );
    }
  }

  // Unique object key to prevent collisions and organize by user
  const subFolder = isAudio ? "audio" : isCover ? "covers" : "media";
  const userSegment = userId ? userId.replace(/[^a-zA-Z0-9_-]/g, "") : "anonymous";
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const key = `releases/${userSegment}/${subFolder}/${uniqueId}-${cleanBase}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType || (isAudio ? "audio/mpeg" : isCover ? "image/jpeg" : "application/octet-stream"),
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const objectPublicUrl = `${publicUrl.replace(/\/$/, "")}/${key}`;

  return {
    uploadUrl,
    key,
    publicUrl: objectPublicUrl,
    fileName: `${cleanBase}.${ext}`,
    contentType,
    expiresIn: 3600,
  };
}

/**
 * Upload Buffer directly from server to Cloudflare R2 (Node backend bypasses browser CORS)
 */
export async function uploadBufferToR2({
  buffer,
  fileName,
  contentType,
  userId,
  fileType,
}: {
  buffer: Buffer;
  fileName: string;
  contentType: string;
  userId?: string;
  fileType?: "audio" | "cover" | "general";
}) {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const cleanBase = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 60);

  const isAudio =
    fileType === "audio" ||
    ["mp3", "wav", "flac", "aac", "m4a", "ogg", "aif", "aiff"].includes(ext) ||
    contentType.startsWith("audio/");

  const isCover =
    fileType === "cover" ||
    ["jpg", "jpeg", "png", "webp"].includes(ext) ||
    contentType.startsWith("image/");

  const subFolder = isAudio ? "audio" : isCover ? "covers" : "media";
  const userSegment = userId ? userId.replace(/[^a-zA-Z0-9_-]/g, "") : "anonymous";
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const key = `releases/${userSegment}/${subFolder}/${uniqueId}-${cleanBase}.${ext}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType || (isAudio ? "audio/mpeg" : isCover ? "image/jpeg" : "application/octet-stream"),
    })
  );

  const objectPublicUrl = `${publicUrl.replace(/\/$/, "")}/${key}`;
  return {
    key,
    publicUrl: objectPublicUrl,
    fileName: `${cleanBase}.${ext}`,
    contentType,
    size: buffer.length,
  };
}

async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

/**
 * Upload an individual chunk part (max 3MB, well within Vercel's 4.5MB limit) to temporary R2 storage
 */
export async function uploadChunkPartToR2({
  uploadId,
  partIndex,
  buffer,
}: {
  uploadId: string;
  partIndex: number;
  buffer: Buffer;
}) {
  const safeUploadId = uploadId.replace(/[^a-zA-Z0-9_-]/g, "");
  const partKey = `tmp_chunks/${safeUploadId}/${partIndex}.part`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: partKey,
      Body: buffer,
      ContentType: "application/octet-stream",
    })
  );

  return { ok: true, partIndex, partKey, size: buffer.length };
}

/**
 * Assemble all chunk parts into a single final release object in Cloudflare R2
 */
export async function assembleChunksInR2({
  uploadId,
  totalParts,
  fileName,
  contentType,
  userId,
  fileType,
}: {
  uploadId: string;
  totalParts: number;
  fileName: string;
  contentType: string;
  userId?: string;
  fileType?: "audio" | "cover" | "general";
}) {
  const safeUploadId = uploadId.replace(/[^a-zA-Z0-9_-]/g, "");
  const buffers: Buffer[] = [];

  for (let i = 0; i < totalParts; i++) {
    const partKey = `tmp_chunks/${safeUploadId}/${i}.part`;
    const res = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: partKey,
      })
    );
    const buf = await streamToBuffer(res.Body);
    buffers.push(buf);
  }

  const combinedBuffer = Buffer.concat(buffers);

  // Upload final assembled object
  const uploadResult = await uploadBufferToR2({
    buffer: combinedBuffer,
    fileName,
    contentType,
    userId,
    fileType,
  });

  // Asynchronously clean up temp chunk parts
  (async () => {
    for (let i = 0; i < totalParts; i++) {
      const partKey = `tmp_chunks/${safeUploadId}/${i}.part`;
      s3Client
        .send(new DeleteObjectCommand({ Bucket: bucket, Key: partKey }))
        .catch(() => {});
    }
  })();

  return uploadResult;
}

/**
 * Verify that an object exists in R2 and retrieve its size and metadata
 */
export async function verifyUploadedObject(key: string) {
  try {
    const head = await s3Client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    return {
      exists: true,
      key,
      size: head.ContentLength || 0,
      contentType: head.ContentType || "application/octet-stream",
      etag: head.ETag,
      publicUrl: `${publicUrl.replace(/\/$/, "")}/${key}`,
    };
  } catch (error: any) {
    if (error.name === "NotFound" || error.name === "NoSuchKey") {
      return { exists: false, key, size: 0, error: "Object not found in R2" };
    }
    throw error;
  }
}

/**
 * Generate a presigned GET URL for streaming/downloading directly from R2
 */
export async function getPresignedDownloadUrl(key: string, filename?: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentDisposition: filename
      ? `inline; filename="${encodeURIComponent(filename)}"`
      : undefined,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 86400 }); // 24 hours
}

/**
 * Get public URL for a key
 */
export function getStoragePublicUrl(key: string): string {
  if (!key) return "";
  if (key.startsWith("http://") || key.startsWith("https://")) {
    return key;
  }
  return `${publicUrl.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
}
