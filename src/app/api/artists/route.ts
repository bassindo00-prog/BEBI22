import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

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
    select: { id: true, name: true, email: true, role: true },
  });

  return fallback;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const artists = await prisma.artist.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, artists });
  } catch (error) {
    console.error("GET artists error:", error);
    return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, genre, spotifyId, appleId, photoUrl, bio } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Nama artis wajib diisi!" }, { status: 400 });
    }

    const newArtist = await prisma.artist.create({
      data: {
        name: name.trim(),
        genre: genre?.trim() || "Pop",
        spotifyId: spotifyId?.trim() || "",
        appleId: appleId?.trim() || "",
        photoUrl: photoUrl?.trim() || "",
        bio: bio?.trim() || "",
        userId: user.id,
      },
    });

    return NextResponse.json({ ok: true, artist: newArtist });
  } catch (error) {
    console.error("POST artist error:", error);
    return NextResponse.json({ error: "Failed to create artist" }, { status: 500 });
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
      return NextResponse.json({ error: "Artist ID is required" }, { status: 400 });
    }

    await prisma.artist.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });

    return NextResponse.json({ ok: true, message: "Artist deleted successfully" });
  } catch (error) {
    console.error("DELETE artist error:", error);
    return NextResponse.json({ error: "Failed to delete artist" }, { status: 500 });
  }
}

