import React from "react";
import { prisma } from "@/lib/prisma";
import LandingClient, {
  type LandingArtist,
  type LandingPageData,
  DEFAULT_LANDING_DATA,
  DEFAULT_PRISMA_TESTIMONIALS,
  normalizeImageUrl,
} from "@/components/LandingClient";

export type { LandingArtist, LandingPageData };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  let initialData: LandingPageData = DEFAULT_LANDING_DATA;

  try {
    const content = await prisma.landingContent.findUnique({
      where: { id: "default" },
    });

    if (content) {
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
        console.error("Failed to parse artistsJson on server:", e);
      }

      initialData = {
        id: content.id,
        heroSubtitle: content.heroSubtitle || DEFAULT_LANDING_DATA.heroSubtitle,
        heroTitle1: content.heroTitle1 || DEFAULT_LANDING_DATA.heroTitle1,
        heroTitle2: content.heroTitle2 || DEFAULT_LANDING_DATA.heroTitle2,
        heroBgImage: normalizeImageUrl(content.heroBgImage) || DEFAULT_LANDING_DATA.heroBgImage,
        artists: parsedArtists.map((a: any, idx: number) => ({
          id: a.id || idx + 1,
          name: a.name || "Artis",
          genre: a.genre || "Pop",
          imageUrl:
            normalizeImageUrl(a.imageUrl || a.photo || a.avatar) ||
            DEFAULT_PRISMA_TESTIMONIALS[idx % DEFAULT_PRISMA_TESTIMONIALS.length].imageUrl,
          listeners: a.listeners || a.monthlyListeners || "1M+",
          quote: a.quote || a.bio || "Platform distribusi musik terbaik untuk musisi independen.",
          isVerified: a.isVerified !== undefined ? Boolean(a.isVerified) : true,
        })),
      };
    }
  } catch (err) {
    console.warn("Failed to load landing data on server:", err);
  }

  return <LandingClient initialData={initialData} />;
}
