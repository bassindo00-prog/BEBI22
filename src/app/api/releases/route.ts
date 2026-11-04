import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const cookieStore = cookies();
    const userId = cookieStore.get("hermes_user_id")?.value;

    if (all) {
      const releases = await prisma.release.findMany({
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ releases });
    }

    let targetUserId = userId;
    if (!targetUserId) {
      const fallback = await prisma.user.findFirst({
        where: { email: "abdul@hermes.music" },
      });
      targetUserId = fallback?.id;
    }

    const releases = await prisma.release.findMany({
      where: targetUserId ? { userId: targetUserId } : undefined,
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
    const body = await req.json();
    const cookieStore = cookies();
    let userId = cookieStore.get("hermes_user_id")?.value;

    if (!userId) {
      const fallback = await prisma.user.findFirst({
        where: { email: "abdul@hermes.music" },
      });
      userId = fallback?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const release = await prisma.release.create({
      data: {
        title: body.title || "Midnight Serenade",
        artist: body.artist || "HERMES",
        featuring: body.featuring || "",
        composer: body.composer || "Abdul • HERMES",
        producer: body.producer || "Luxoa Studio",
        tiktokClip: body.tiktokClip || "00:45 - 01:15 (30s)",
        genre: body.genre || "Electronic • Downtempo",
        releaseDate: body.releaseDate || "18-10-2024",
        duration: body.duration || "3:42",
        streams: "0",
        streamsNum: 0,
        platform: (body.platforms || "Spotify").split(",")[0] || "Spotify",
        platforms: body.platforms || "Spotify,Apple Music,TikTok,YouTube",
        status: body.status || "Pending",
        coverUrl:
          body.coverUrl ||
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
        audioFile: body.audioFile || "audio_preview_final.wav",
        upc: body.upc || `899${Math.floor(100000000 + Math.random() * 900000000)}`,
        isrc: body.isrc || `ID-HRM-24-${Math.floor(10000 + Math.random() * 90000)}`,
        userId,
      },
    });

    return NextResponse.json({ release });
  } catch (error) {
    console.error("POST release error:", error);
    return NextResponse.json({ error: "Failed to create release" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, streams, streamsNum } = body;

    const updated = await prisma.release.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(streams !== undefined ? { streams } : {}),
        ...(streamsNum !== undefined ? { streamsNum: Number(streamsNum) } : {}),
      },
    });

    return NextResponse.json({ release: updated });
  } catch (error) {
    console.error("PATCH release error:", error);
    return NextResponse.json({ error: "Failed to update release" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }
    await prisma.release.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE release error:", error);
    return NextResponse.json({ error: "Failed to delete release" }, { status: 500 });
  }
}

