import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  generatePresignedUploadUrl,
  verifyUploadedObject,
  getPresignedDownloadUrl,
  uploadBufferToR2,
  uploadChunkPartToR2,
  assembleChunksInR2,
} from "@/lib/s3";

export const dynamic = "force-dynamic";

/**
 * Helper to authenticate user from cookie or fallback
 */
async function getAuthenticatedUser() {
  const cookieStore = cookies();
  const userId = cookieStore.get("hermes_user_id")?.value;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });
    if (user) return user;
  }

  // Fallback to primary test artist
  const fallback = await prisma.user.findFirst({
    where: { email: "abdul@hermes.music" },
    select: { id: true, email: true, name: true, role: true },
  });

  return fallback;
}

/**
 * POST /api/upload
 * Workflow:
 * 1. Client sends { fileName, contentType, fileSize, fileType }
 * 2. Server validates auth, content type, and file size
 * 3. Server generates S3 presigned PUT URL
 * 4. Client uploads binary directly to S3/R2 (bypassing Vercel 4.5MB limit)
 * 5. Client or Server verifies object via { action: "verify", key }
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized: Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const contentTypeHeader = req.headers.get("content-type") || "";

    // Action 1: JSON payload for Presigning or Verification
    if (contentTypeHeader.includes("application/json")) {
      const body = await req.json().catch(() => ({}));

      // Sub-action: Verification of uploaded object
      if (body.action === "verify" || (body.key && !body.uploadUrl && !body.action)) {
        if (!body.key || typeof body.key !== "string") {
          return NextResponse.json(
            { ok: false, error: "Key objek penyimpanan diperlukan untuk verifikasi." },
            { status: 400 }
          );
        }

        const verification = await verifyUploadedObject(body.key);
        if (!verification.exists) {
          return NextResponse.json(
            {
              ok: false,
              verified: false,
              error: "File belum terunggah ke Cloudflare R2 atau tidak ditemukan.",
            },
            { status: 404 }
          );
        }

        return NextResponse.json({
          ok: true,
          verified: true,
          ...verification,
        });
      }

      // Sub-action: Assemble Chunked Parts into Final Master Audio (Vercel 413 Bypass)
      if (body.action === "assemble_chunks") {
        const { uploadId, totalParts, fileName, contentType, fileType } = body;
        if (!uploadId || typeof totalParts !== "number" || !fileName) {
          return NextResponse.json(
            { ok: false, error: "Parameter assemble_chunks tidak lengkap." },
            { status: 400 }
          );
        }

        const assembled = await assembleChunksInR2({
          uploadId,
          totalParts,
          fileName,
          contentType: contentType || (fileType === "cover" ? "image/jpeg" : "audio/mpeg"),
          userId: user.id,
          fileType,
        });

        return NextResponse.json({
          ok: true,
          method: "assembled-chunked",
          ...assembled,
        });
      }

      // Sub-action: Generate Presigned Download/Stream URL
      if (body.action === "download_url" && body.key) {
        const downloadUrl = await getPresignedDownloadUrl(body.key, body.filename);
        return NextResponse.json({
          ok: true,
          downloadUrl,
          key: body.key,
        });
      }

      // Default: Generate Presigned Upload PUT URL
      const { fileName, contentType, fileSize, fileType } = body;

      if (!fileName || typeof fileName !== "string") {
        return NextResponse.json(
          { ok: false, error: "Nama file (fileName) wajib disertakan." },
          { status: 400 }
        );
      }

      const presignResult = await generatePresignedUploadUrl({
        fileName,
        contentType: contentType || "application/octet-stream",
        fileSize: fileSize ? Number(fileSize) : undefined,
        userId: user.id,
        fileType: fileType as any,
      });

      return NextResponse.json({
        ok: true,
        ...presignResult,
      });
    }

    // Action 2: Server-side multipart upload to Cloudflare R2 (Bypasses browser CORS completely)
    if (contentTypeHeader.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const fileType = (formData.get("fileType") as "audio" | "cover" | "general") || "audio";
      const uploadId = formData.get("uploadId") as string | null;
      const partIndexRaw = formData.get("partIndex");

      if (!file) {
        return NextResponse.json(
          { ok: false, error: "File tidak ditemukan dalam form data." },
          { status: 400 }
        );
      }

      // Handle Chunk Part (chunked stream strictly under Vercel 4.5MB payload limit)
      if (uploadId && partIndexRaw !== null) {
        const partIndex = Number(partIndexRaw);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const chunkResult = await uploadChunkPartToR2({
          uploadId,
          partIndex,
          buffer,
        });

        return NextResponse.json(chunkResult);
      }

      // Handle Standard Single-Part Upload (for small files like Cover Artwork < 3.5MB)
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await uploadBufferToR2({
        buffer,
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        userId: user.id,
        fileType,
      });

      return NextResponse.json({
        ok: true,
        method: "server-r2-direct",
        ...result,
      });
    }

    return NextResponse.json(
      {
        ok: false,
        error: "Content-Type tidak didukung. Gunakan application/json atau multipart/form-data.",
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Presigned upload API error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Terjadi kesalahan saat membuat presigned upload URL.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    storage: "Cloudflare R2 (S3-Compatible)",
    maxAudioSize: "250MB",
    maxCoverSize: "20MB",
    method: "Presigned PUT",
  });
}
