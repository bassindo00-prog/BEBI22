import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all catalog items
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.toLowerCase();

    let whereClause = {};
    if (q) {
      whereClause = {
        OR: [
          { songId: { contains: q } },
          { title: { contains: q } },
          { artist: { contains: q } },
          { publisher: { contains: q } },
          { status: { contains: q } },
        ],
      };
    }

    const items = await prisma.catalog.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET catalog error:", error);
    return NextResponse.json({ error: "Failed to fetch catalog" }, { status: 500 });
  }
}

// POST new catalog item or bulk upload
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Support Bulk Array of items (e.g. from CSV/Excel paste)
    if (Array.isArray(body.items) && body.items.length > 0) {
      let createdCount = 0;
      for (const item of body.items) {
        if (!item.songId || !item.title) continue;
        await prisma.catalog.upsert({
          where: { songId: String(item.songId).trim() },
          update: {
            title: String(item.title).trim(),
            artist: String(item.artist || "HERMES Artist").trim(),
            publisher: String(item.publisher || "HERMES Publishing").trim(),
            status: String(item.status || "Aktif").trim(),
            youtubeLink: item.youtubeLink || null,
            driveLink: item.driveLink || null,
          },
          create: {
            songId: String(item.songId).trim(),
            title: String(item.title).trim(),
            artist: String(item.artist || "HERMES Artist").trim(),
            publisher: String(item.publisher || "HERMES Publishing").trim(),
            status: String(item.status || "Aktif").trim(),
            youtubeLink: item.youtubeLink || null,
            driveLink: item.driveLink || null,
          },
        });
        createdCount++;
      }
      return NextResponse.json({ ok: true, count: createdCount });
    }

    // Single item creation
    const { songId, title, artist, publisher, status, youtubeLink, driveLink } = body;

    if (!songId || !title) {
      return NextResponse.json(
        { error: "Song ID dan Judul Lagu wajib diisi" },
        { status: 400 }
      );
    }

    const catalog = await prisma.catalog.upsert({
      where: { songId: String(songId).trim() },
      update: {
        title: String(title).trim(),
        artist: String(artist || "HERMES Artist").trim(),
        publisher: String(publisher || "HERMES Publishing").trim(),
        status: String(status || "Aktif").trim(),
        youtubeLink: youtubeLink || null,
        driveLink: driveLink || null,
      },
      create: {
        songId: String(songId).trim(),
        title: String(title).trim(),
        artist: String(artist || "HERMES Artist").trim(),
        publisher: String(publisher || "HERMES Publishing").trim(),
        status: String(status || "Aktif").trim(),
        youtubeLink: youtubeLink || null,
        driveLink: driveLink || null,
      },
    });

    return NextResponse.json({ catalog });
  } catch (error) {
    console.error("POST catalog error:", error);
    return NextResponse.json({ error: "Failed to save catalog" }, { status: 500 });
  }
}

// PATCH update catalog item
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, songId, title, artist, publisher, status, youtubeLink, driveLink } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const updated = await prisma.catalog.update({
      where: { id },
      data: {
        songId: songId ? String(songId).trim() : undefined,
        title: title ? String(title).trim() : undefined,
        artist: artist ? String(artist).trim() : undefined,
        publisher: publisher ? String(publisher).trim() : undefined,
        status: status ? String(status).trim() : undefined,
        youtubeLink: youtubeLink !== undefined ? youtubeLink : undefined,
        driveLink: driveLink !== undefined ? driveLink : undefined,
      },
    });

    return NextResponse.json({ catalog: updated });
  } catch (error) {
    console.error("PATCH catalog error:", error);
    return NextResponse.json({ error: "Failed to update catalog" }, { status: 500 });
  }
}

// DELETE catalog item
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.catalog.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE catalog error:", error);
    return NextResponse.json({ error: "Failed to delete catalog" }, { status: 500 });
  }
}

