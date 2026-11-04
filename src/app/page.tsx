import React from "react";
import { prisma } from "@/lib/prisma";
import LandingClient, {
  type ArtistItem,
  type TestimonialItem,
  type LandingPageData,
  DEFAULT_LANDING_DATA,
  normalizeImageUrl,
} from "@/components/LandingClient";

export type { ArtistItem, TestimonialItem, LandingPageData };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  let initialData: LandingPageData = DEFAULT_LANDING_DATA;

  try {
    const content = await prisma.landingContent.findUnique({
      where: { id: "default" },
    });

    if (content) {
      let parsedArtists = DEFAULT_LANDING_DATA.artists;
      try {
        if (content.artistsJson) {
          const arr = JSON.parse(content.artistsJson);
          if (Array.isArray(arr) && arr.length > 0) parsedArtists = arr;
        }
      } catch (e) {
        console.error("Failed to parse artistsJson on server:", e);
      }

      let parsedTestimonials = DEFAULT_LANDING_DATA.testimonials;
      try {
        if (content.testimonialsJson) {
          const arr = JSON.parse(content.testimonialsJson);
          if (Array.isArray(arr) && arr.length > 0) parsedTestimonials = arr;
        }
      } catch (e) {
        console.error("Failed to parse testimonialsJson on server:", e);
      }

      initialData = {
        id: content.id,
        heroSubtitle: content.heroSubtitle || DEFAULT_LANDING_DATA.heroSubtitle,
        heroTitle1: content.heroTitle1 || DEFAULT_LANDING_DATA.heroTitle1,
        heroTitle2: content.heroTitle2 || "",
        heroBgImage: normalizeImageUrl(content.heroBgImage) || DEFAULT_LANDING_DATA.heroBgImage,
        navBgImage: normalizeImageUrl(content.navBgImage) || DEFAULT_LANDING_DATA.navBgImage,
        storesCount: content.storesCount || 150,
        card1Text: content.card1Text || DEFAULT_LANDING_DATA.card1Text,
        card1Image: normalizeImageUrl(content.card1Image) || DEFAULT_LANDING_DATA.card1Image,
        card2Title: content.card2Title || DEFAULT_LANDING_DATA.card2Title,
        card2Desc: content.card2Desc || DEFAULT_LANDING_DATA.card2Desc,
        card2Image: normalizeImageUrl(content.card2Image) || DEFAULT_LANDING_DATA.card2Image,
        card3Title: content.card3Title || DEFAULT_LANDING_DATA.card3Title,
        card3Desc: content.card3Desc || DEFAULT_LANDING_DATA.card3Desc,
        card3Image: normalizeImageUrl(content.card3Image) || DEFAULT_LANDING_DATA.card3Image,
        artists: parsedArtists.map((a: any) => ({
          ...a,
          photo: normalizeImageUrl(a.photo) || DEFAULT_LANDING_DATA.card1Image,
        })),
        testimonials: parsedTestimonials.map((t: any) => ({
          ...t,
          avatar: normalizeImageUrl(t.avatar) || DEFAULT_LANDING_DATA.card1Image,
        })),
      };
    }
  } catch (err) {
    console.warn("Failed to load landing data on server:", err);
  }

  return <LandingClient initialData={initialData} />;
}
