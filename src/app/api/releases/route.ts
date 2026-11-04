import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyUploadedObject, getStoragePublicUrl } from "@/lib/s3";

export const dynamic = "force-dynamic";

async function getCurrentUser() {
  const cookieStore = cookies();
  const userId = cookieStore.get("hermes_user_id")?.value;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });
    if (user) return user;
  }

  // Fallback to default user
  const fallback = await prisma.user.findFirst({
    where: { email: "abdul@hermes.music" },
    select: { id: true, name: true, email: true, role: true },
  });

  return fallback;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only ADMIN can view all submissions with all=true
    if (all && user.role === "ADMIN") {
      const releases = await prisma.release.findMany({
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ releases });
    }

    // Artist can ONLY view their own releases
    const releases = await prisma.release.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ releases });
  } catch (error) {
    console.error("GET releases error:", error);
    return NextResponse.json({ error: "Failed to fetch releases" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Silakan login" }, { status: 401 });
    }

    const body = await req.json();

    // Verify audio file in S3 if a storage key is provided
    let audioFileUrl = body.audioFile || "audio_preview_final.wav";
    if (body.audioKey) {
      const audioVerification = await verifyUploadedObject(body.audioKey);
      if (audioVerification.exists) {
        audioFileUrl = `/api/storage/${body.audioKey}`;
      }
    } else if (body.audioFile && body.audioFile.startsWith("releases/")) {
      const audioVerification = await verifyUploadedObject(body.audioFile);
      if (audioVerification.exists) {
        audioFileUrl = `/api/storage/${body.audioFile}`;
      }
    }

    // Verify cover artwork in S3 if a storage key is provided
    let coverArtworkUrl =
      body.coverUrl ||
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80";

    if (body.coverKey) {
      const coverVerification = await verifyUploadedObject(body.coverKey);
      if (coverVerification.exists) {
        coverArtworkUrl = `/api/storage/${body.coverKey}`;
      }
    } else if (body.coverUrl && body.coverUrl.startsWith("releases/")) {
      const coverVerification = await verifyUploadedObject(body.coverUrl);
      if (coverVerification.exists) {
        coverArtworkUrl = `/api/storage/${body.coverUrl}`;
      }
    }

    const release = await prisma.release.create({
      data: {
        title: body.title || "Midnight Serenade",
        artist: body.artist || user.name || "HERMES",
        featuring: body.featuring || "",
        composer: body.composer || `${user.name || "Abdul"} • HERMES`,
        producer: body.producer || "Luxoa Studio",
        tiktokClip: body.tiktokClip || "00:45 - 01:15 (30s)",
        genre: body.genre || "Electronic • Downtempo",
        releaseDate: body.releaseDate || new Date().toISOString().split("T")[0],
        duration: body.duration || "3:42",
        streams: "0",
        streamsNum: 0,
        platform: (body.platforms || "Spotify").split(",")[0] || "Spotify",
        platforms: body.platforms || "Spotify,Apple Music,TikTok,YouTube",
        status: body.status || "Pending",
        coverUrl: coverArtworkUrl,
        audioFile: audioFileUrl,
        upc: body.upc || `899${Math.floor(100000000 + Math.random() * 900000000)}`,
        isrc: body.isrc || `ID-HRM-24-${Math.floor(10000 + Math.random() * 90000)}`,
        userId: user.id,
      },
    });

    return NextResponse.json({ ok: true, release });
  } catch (error: any) {
    console.error("POST release error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create release" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, streams, streamsNum } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing release ID" }, { status: 400 });
    }

    // Check release ownership
    const existing = await prisma.release.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Release not found" }, { status: 404 });
    }

    // Only the owner or an ADMIN can update
    if (existing.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Anda tidak memiliki akses untuk mengubah rilis ini." },
        { status: 403 }
      );
    }

    const updated = await prisma.release.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(streams !== undefined ? { streams } : {}),
        ...(streamsNum !== undefined ? { streamsNum: Number(streamsNum) } : {}),
      },
    });

    return NextResponse.json({ ok: true, release: updated });
  } catch (error: any) {
    console.error("PATCH release error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update release" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const existing = await prisma.release.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Release not found" }, { status: 404 });
    }

    // Only owner or ADMIN can delete
    if (existing.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Anda tidak berhak menghapus rilis artis lain." },
        { status: 403 }
      );
    }

    await prisma.release.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("DELETE release error:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete release" }, { status: 500 });
  }
}
