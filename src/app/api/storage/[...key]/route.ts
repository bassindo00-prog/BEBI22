import { NextRequest, NextResponse } from "next/server";
import { getPresignedDownloadUrl, verifyUploadedObject } from "@/lib/s3";

export const dynamic = "force-dynamic";

/**
 * GET /api/storage/[...key]
 * Redirects securely to S3-compatible presigned URL for direct audio/image streaming.
 * Uses 307 Temporary Redirect so:
 * - 0 audio bytes flow through Vercel serverless function (avoids memory & bandwidth limits)
 * - Browser / Audio player streams directly from Cloudflare R2 with full HTTP Range support
 * - Works regardless of whether the public domain bucket is set to public or private
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { key: string[] } }
) {
  try {
    const key = params.key.join("/");
    if (!key) {
      return NextResponse.json({ error: "Missing storage key" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename") || key.split("/").pop();
    const isDownload =
      searchParams.get("download") === "1" || searchParams.get("download") === "true";

    // Verify object exists
    const verification = await verifyUploadedObject(key);
    if (!verification.exists) {
      return NextResponse.json(
        { error: "Object not found in Cloudflare R2 storage" },
        { status: 404 }
      );
    }

    // Generate signed GET URL with range request support (valid for 24h)
    const presignedGetUrl = await getPresignedDownloadUrl(key, filename, isDownload);

    // Redirect client directly to R2
    return NextResponse.redirect(presignedGetUrl, { status: 307 });
  } catch (error: any) {
    console.error("Storage redirect error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate storage stream URL" },
      { status: 500 }
    );
  }
}

