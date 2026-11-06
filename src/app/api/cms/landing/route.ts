import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_PRISMA_TESTIMONIALS } from "@/lib/landingDefaults";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function cleanUrl(url: any): string {
  if (typeof url !== "string") return url || "";
  return url.replace(/https?:\/\/storage\.vpsmurah\.co\.id/g, "/api/storage");
}

const DEFAULT_LANDING_CONTENT = {
  id: "default",
  heroSubtitle:
    "Masa depan distribusi musik independen. Rilis karya Anda ke seluruh dunia tanpa batas.",
  heroTitle1: "Breakout",
  heroTitle2: "ID",
  heroBgImage: "/6293920186406475512_121.jpg",
  storesCount: 150,
  artists: DEFAULT_PRISMA_TESTIMONIALS,
};

export async function GET() {
  try {
    const content = await prisma.landingContent.findUnique({
      where: { id: "default" },
    });

    if (!content) {
      return NextResponse.json({
        ok: true,
        data: DEFAULT_LANDING_CONTENT,
      });
    }

    let parsedArtists: any[] = DEFAULT_PRISMA_TESTIMONIALS;
    try {
      if (content.artistsJson) {
        const arr = JSON.parse(content.artistsJson);
        if (Array.isArray(arr) && arr.length > 0) parsedArtists = arr;
      } else if (content.testimonialsJson) {
        const arr = JSON.parse(content.testimonialsJson);
        if (Array.isArray(arr) && arr.length > 0) parsedArtists = arr;
      }
    } catch (e) {
      console.error("Failed to parse artistsJson:", e);
    }

    const sanitizedArtists = (parsedArtists || []).map((a: any, idx: number) => ({
      id: a.id || idx + 1,
      name: a.name || "Artis",
      genre: a.genre || "Pop",
      imageUrl: cleanUrl(a.imageUrl || a.photo || a.avatar || DEFAULT_PRISMA_TESTIMONIALS[idx % DEFAULT_PRISMA_TESTIMONIALS.length].imageUrl),
      photo: cleanUrl(a.photo || a.imageUrl || a.avatar || DEFAULT_PRISMA_TESTIMONIALS[idx % DEFAULT_PRISMA_TESTIMONIALS.length].imageUrl),
      listeners: a.listeners || a.monthlyListeners || "1M+",
      monthlyListeners: a.monthlyListeners || a.listeners || "1M+",
      quote: a.quote || a.bio || "Platform terbaik untuk musisi independen.",
      bio: a.bio || a.quote || "Platform terbaik untuk musisi independen.",
      isVerified: a.isVerified !== undefined ? Boolean(a.isVerified) : true,
    }));

    return NextResponse.json({
      ok: true,
      data: {
        id: content.id,
        heroSubtitle: content.heroSubtitle || DEFAULT_LANDING_CONTENT.heroSubtitle,
        heroTitle1: content.heroTitle1 || DEFAULT_LANDING_CONTENT.heroTitle1,
        heroTitle2: content.heroTitle2 || DEFAULT_LANDING_CONTENT.heroTitle2,
        heroBgImage: cleanUrl(content.heroBgImage || DEFAULT_LANDING_CONTENT.heroBgImage),
        storesCount: Number(content.storesCount) || 150,
        artists: sanitizedArtists,
      },
    });
  } catch (error) {
    console.error("GET Landing Content error:", error);
    return NextResponse.json({
      ok: true,
      data: DEFAULT_LANDING_CONTENT,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const incomingArtists = Array.isArray(body.artists) ? body.artists : DEFAULT_PRISMA_TESTIMONIALS;

    const sanitizedArtists = incomingArtists.map((a: any, idx: number) => ({
      id: a.id || idx + 1,
      name: a.name || "Artis",
      genre: a.genre || "Pop",
      imageUrl: cleanUrl(a.imageUrl || a.photo || a.avatar || DEFAULT_PRISMA_TESTIMONIALS[idx % DEFAULT_PRISMA_TESTIMONIALS.length].imageUrl),
      photo: cleanUrl(a.photo || a.imageUrl || a.avatar || DEFAULT_PRISMA_TESTIMONIALS[idx % DEFAULT_PRISMA_TESTIMONIALS.length].imageUrl),
      listeners: a.listeners || a.monthlyListeners || "1M+",
      monthlyListeners: a.monthlyListeners || a.listeners || "1M+",
      quote: a.quote || a.bio || "Platform terbaik untuk musisi independen.",
      bio: a.bio || a.quote || "Platform terbaik untuk musisi independen.",
      isVerified: a.isVerified !== undefined ? Boolean(a.isVerified) : true,
    }));

    const artistsJson = JSON.stringify(sanitizedArtists);

    const updated = await prisma.landingContent.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        heroSubtitle: body.heroSubtitle || DEFAULT_LANDING_CONTENT.heroSubtitle,
        heroTitle1: body.heroTitle1 || DEFAULT_LANDING_CONTENT.heroTitle1,
        heroTitle2: body.heroTitle2 || DEFAULT_LANDING_CONTENT.heroTitle2,
        heroBgImage: cleanUrl(body.heroBgImage || DEFAULT_LANDING_CONTENT.heroBgImage),
        storesCount: Number(body.storesCount) || 150,
        artistsJson,
        testimonialsJson: artistsJson,
      },
      update: {
        heroSubtitle: body.heroSubtitle,
        heroTitle1: body.heroTitle1,
        heroTitle2: body.heroTitle2,
        heroBgImage: cleanUrl(body.heroBgImage),
        storesCount: Number(body.storesCount) || 150,
        artistsJson,
        testimonialsJson: artistsJson,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Konten landing page berhasil disimpan ke database!",
      data: updated,
    });
  } catch (error: any) {
    console.error("POST Landing Content error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Gagal menyimpan konten ke database" },
      { status: 500 }
    );
  }
}
