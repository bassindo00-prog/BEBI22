import { NextRequest, NextResponse } from "next/server";
import { uploadToStorage } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileUrl = await uploadToStorage(buffer, file.name, file.type || "application/octet-stream");

    return NextResponse.json({
      ok: true,
      url: fileUrl,
      fileName: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error("Storage upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload to storage" },
      { status: 500 }
    );
  }
}

