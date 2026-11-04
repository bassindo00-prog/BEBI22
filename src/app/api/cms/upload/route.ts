import { NextRequest, NextResponse } from "next/server";
import { uploadBufferToR2 } from "@/lib/s3";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";

    // 1. Try Cloudflare R2 / S3 first if credentials exist
    try {
      if (process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY) {
        const r2Result = await uploadBufferToR2({
          buffer,
          fileName: file.name,
          contentType: mimeType,
          fileType: "cover",
        });
        if (r2Result) {
          const finalUrl = r2Result.key
            ? `/api/storage/${r2Result.key}`
            : r2Result.publicUrl;
          return NextResponse.json({
            ok: true,
            url: finalUrl,
            fileName: file.name,
            provider: "r2",
          });
        }
      }
    } catch (r2Err) {
      console.warn("R2 upload fallback triggered:", r2Err);
    }

    // 2. Try writing to local filesystem (for local dev environments)
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const ext = path.extname(file.name) || ".jpg";
      const baseName = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .toLowerCase();
      const uniqueFileName = `${Date.now()}_${baseName}${ext}`;
      const filePath = path.join(uploadsDir, uniqueFileName);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        ok: true,
        url: `/uploads/${uniqueFileName}`,
        fileName: uniqueFileName,
        provider: "local",
      });
    } catch (fsErr) {
      console.warn("Filesystem read-only (e.g. Vercel), falling back to Data URL");
    }

    // 3. Guaranteed Serverless Fallback: Base64 Data URL (Works 100% on Vercel without disk access)
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      ok: true,
      url: dataUrl,
      fileName: file.name,
      provider: "base64",
    });
  } catch (error: any) {
    console.error("CMS Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
