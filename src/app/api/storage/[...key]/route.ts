import { NextRequest, NextResponse } from "next/server";
import { s3Client } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { key: string[] } }
) {
  try {
    const key = params.key.join("/");
    const bucket = process.env.S3_BUCKET || "object-storage-24p8og";

    const { searchParams } = new URL(req.url);
    const download = searchParams.get("download") === "1";
    const filename = searchParams.get("filename") || key.split("/").pop() || "file";

    const rangeHeader = req.headers.get("range");

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      Range: rangeHeader || undefined,
    });

    const s3Response = await s3Client.send(command);

    if (!s3Response.Body) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const stream = s3Response.Body.transformToWebStream();

    const headers = new Headers();
    if (s3Response.ContentType) {
      headers.set("Content-Type", s3Response.ContentType);
    }
    if (s3Response.ContentLength) {
      headers.set("Content-Length", String(s3Response.ContentLength));
    }
    if (s3Response.ContentRange) {
      headers.set("Content-Range", s3Response.ContentRange);
    }
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    if (download) {
      headers.set(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(filename)}"`
      );
    } else {
      headers.set(
        "Content-Disposition",
        `inline; filename="${encodeURIComponent(filename)}"`
      );
    }

    const status = s3Response.$metadata.httpStatusCode || (rangeHeader ? 206 : 200);

    return new Response(stream as any, {
      status,
      headers,
    });
  } catch (error: any) {
    console.error("Storage streaming error:", error);
    if (error.name === "NoSuchKey") {
      return NextResponse.json({ error: "File not found in storage" }, { status: 404 });
    }
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve storage file" },
      { status: 500 }
    );
  }
}
