import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_ARTISTS = [
  {
    id: "art-1",
    name: "Basstrack Indo",
    genre: "Phonk / Bass Nusantara",
    photo: "/6293920186406475218_120.jpg",
    bio: "Pelopor sound bassboosted nusantara dengan 20M+ streams global di DSP.",
    monthlyListeners: "1.8M",
    topTrack: "Midnight Drift Vol. 2",
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "art-2",
    name: "Sarah Viola",
    genre: "Indie Pop / Cinematic",
    photo: "/header-bg.jpg",
    bio: "Vokalis & produser independen, rilis multi-platform global via BREAKOUT.ID.",
    monthlyListeners: "920K",
    topTrack: "Lavendera Sky",
    spotifyUrl: "https://open.spotify.com",
  },
  {
    id: "art-3",
    name: "Krowdy Pulse",
    genre: "Cyberpunk Hip-Hop",
    photo: "/6293920186406475229_121.jpg",
    bio: "Menggabungkan beat industrial modern dengan lirik jalanan Jakarta.",
    monthlyListeners: "640K",
    topTrack: "Neon Rebellion",
    spotifyUrl: "https://open.spotify.com",
  },
];

const DEFAULT_TESTIMONIALS = [
  {
    id: "testi-1",
    name: "Rian Ardiansyah",
    artistName: "Basstrack Indo",
    role: "Electronic Music Producer",
    quote:
      "Distribusi lewat BREAKOUT.ID royalti 100% transparan, cair tepat waktu langsung ke rekening BCA tanpa potongan siluman.",
    avatar: "/6293920186406475218_120.jpg",
    streams: "15.4M Streams",
  },
  {
    id: "testi-2",
    name: "Maya Clarissa",
    artistName: "Sarah Viola",
    role: "Solo Artist & Songwriter",
    quote:
      "Bikin lagu di kamar malam hari, upload master pagi, dalam 48 jam udah live di Spotify, Apple Music & TikTok. Dashboard super clean!",
    avatar: "/header-bg.jpg",
    streams: "4.2M Streams",
  },
  {
    id: "testi-3",
    name: "Denny 'Krowdy'",
    artistName: "Krowdy Pulse",
    role: "Hip-Hop / Beatmaker",
    quote:
      "Dukungan agregator lokal dengan standar internasional. Fitur analitik DSP dan split royaltinya ngebantu banget kolaborasi tim.",
    avatar: "/6293920186406475229_121.jpg",
    streams: "2.8M Streams",
  },
];

const DEFAULT_LANDING_CONTENT = {
  id: "default",
  heroSubtitle: "Global Reach By BREAKOUT.ID",
  heroTitle1: "BREAKOUT",
  heroTitle2: "ID",
  heroBgImage: "/6293920186406475229_121.jpg",
  navBgImage: "/header-bg.jpg",
  storesCount: 150,
  card1Text:
    "We reshape the future of music distribution and artist services as a platform (MaaS).",
  card1Image: "/6293920186406475218_120.jpg",
  card2Title: "Driven By A Passion.",
  card2Desc: "Pushing the boundaries of what's possible in the global audio realm.",
  card2Image: "/6293920186406475218_120.jpg",
  card3Title: "Distribution Solutions.",
  card3Desc: "Tailored to your unique sound crafting new sonic landscapes.",
  card3Image: "/6293920186406475218_120.jpg",
  artists: DEFAULT_ARTISTS,
  testimonials: DEFAULT_TESTIMONIALS,
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

    let parsedArtists = DEFAULT_ARTISTS;
    try {
      if (content.artistsJson) {
        const arr = JSON.parse(content.artistsJson);
        if (Array.isArray(arr) && arr.length > 0) parsedArtists = arr;
      }
    } catch (e) {
      console.error("Failed to parse artistsJson:", e);
    }

    let parsedTestimonials = DEFAULT_TESTIMONIALS;
    try {
      if (content.testimonialsJson) {
        const arr = JSON.parse(content.testimonialsJson);
        if (Array.isArray(arr) && arr.length > 0) parsedTestimonials = arr;
      }
    } catch (e) {
      console.error("Failed to parse testimonialsJson:", e);
    }

    return NextResponse.json({
      ok: true,
      data: {
        id: content.id,
        heroSubtitle: content.heroSubtitle || DEFAULT_LANDING_CONTENT.heroSubtitle,
        heroTitle1: content.heroTitle1 || DEFAULT_LANDING_CONTENT.heroTitle1,
        heroTitle2: content.heroTitle2 || DEFAULT_LANDING_CONTENT.heroTitle2,
        heroBgImage: content.heroBgImage || DEFAULT_LANDING_CONTENT.heroBgImage,
        navBgImage: content.navBgImage || DEFAULT_LANDING_CONTENT.navBgImage,
        storesCount: Number(content.storesCount) || 150,
        card1Text: content.card1Text || DEFAULT_LANDING_CONTENT.card1Text,
        card1Image: content.card1Image || DEFAULT_LANDING_CONTENT.card1Image,
        card2Title: content.card2Title || DEFAULT_LANDING_CONTENT.card2Title,
        card2Desc: content.card2Desc || DEFAULT_LANDING_CONTENT.card2Desc,
        card2Image: content.card2Image || DEFAULT_LANDING_CONTENT.card2Image,
        card3Title: content.card3Title || DEFAULT_LANDING_CONTENT.card3Title,
        card3Desc: content.card3Desc || DEFAULT_LANDING_CONTENT.card3Desc,
        card3Image: content.card3Image || DEFAULT_LANDING_CONTENT.card3Image,
        artists: parsedArtists,
        testimonials: parsedTestimonials,
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

    const artistsJson = JSON.stringify(body.artists || DEFAULT_ARTISTS);
    const testimonialsJson = JSON.stringify(body.testimonials || DEFAULT_TESTIMONIALS);

    const updated = await prisma.landingContent.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        heroSubtitle: body.heroSubtitle || DEFAULT_LANDING_CONTENT.heroSubtitle,
        heroTitle1: body.heroTitle1 || DEFAULT_LANDING_CONTENT.heroTitle1,
        heroTitle2: body.heroTitle2 || DEFAULT_LANDING_CONTENT.heroTitle2,
        heroBgImage: body.heroBgImage || DEFAULT_LANDING_CONTENT.heroBgImage,
        navBgImage: body.navBgImage || DEFAULT_LANDING_CONTENT.navBgImage,
        storesCount: Number(body.storesCount) || 150,
        card1Text: body.card1Text || DEFAULT_LANDING_CONTENT.card1Text,
        card1Image: body.card1Image || DEFAULT_LANDING_CONTENT.card1Image,
        card2Title: body.card2Title || DEFAULT_LANDING_CONTENT.card2Title,
        card2Desc: body.card2Desc || DEFAULT_LANDING_CONTENT.card2Desc,
        card2Image: body.card2Image || DEFAULT_LANDING_CONTENT.card2Image,
        card3Title: body.card3Title || DEFAULT_LANDING_CONTENT.card3Title,
        card3Desc: body.card3Desc || DEFAULT_LANDING_CONTENT.card3Desc,
        card3Image: body.card3Image || DEFAULT_LANDING_CONTENT.card3Image,
        artistsJson,
        testimonialsJson,
      },
      update: {
        heroSubtitle: body.heroSubtitle,
        heroTitle1: body.heroTitle1,
        heroTitle2: body.heroTitle2,
        heroBgImage: body.heroBgImage,
        navBgImage: body.navBgImage,
        storesCount: Number(body.storesCount) || 150,
        card1Text: body.card1Text,
        card1Image: body.card1Image,
        card2Title: body.card2Title,
        card2Desc: body.card2Desc,
        card2Image: body.card2Image,
        card3Title: body.card3Title,
        card3Desc: body.card3Desc,
        card3Image: body.card3Image,
        artistsJson,
        testimonialsJson,
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
